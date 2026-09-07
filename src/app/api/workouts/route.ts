import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { toWorkout } from "@/lib/mappers";
import { getAuthedUserId, unauthorized } from "@/lib/session";
import { getToday } from "@/lib/utils";

export async function GET() {
  const userId = await getAuthedUserId();
  if (!userId) return unauthorized();

  const rows = await prisma.workout.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ workouts: rows.map(toWorkout) });
}

export async function POST(request: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  if (!name) return Response.json({ error: "Workout name is required." }, { status: 400 });

  const row = await prisma.workout.create({
    data: {
      userId,
      name,
      type: String(body.type ?? "other"),
      duration: Number(body.duration) || 0,
      caloriesBurned: Number(body.caloriesBurned) || 0,
      exercisesJson: JSON.stringify(body.exercises ?? [{ name }]),
      notes: body.notes ? String(body.notes) : null,
      date: String(body.date ?? getToday()),
    },
  });
  return Response.json({ workout: toWorkout(row) }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) return unauthorized();

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id." }, { status: 400 });

  const existing = await prisma.workout.findFirst({ where: { id, userId } });
  if (!existing) return Response.json({ error: "Not found." }, { status: 404 });

  await prisma.workout.delete({ where: { id } });
  return Response.json({ ok: true });
}
