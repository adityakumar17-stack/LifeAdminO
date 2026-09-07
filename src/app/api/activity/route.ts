import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { toActivity } from "@/lib/mappers";
import { getAuthedUserId, unauthorized } from "@/lib/session";
import { getToday } from "@/lib/utils";

export async function GET() {
  const userId = await getAuthedUserId();
  if (!userId) return unauthorized();

  const rows = await prisma.dailyActivity.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
  return Response.json({ activities: rows.map(toActivity) });
}

export async function PATCH(request: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const date = String(body.date ?? getToday());

  const data = {
    steps: typeof body.steps === "number" ? body.steps : undefined,
    caloriesBurned: typeof body.caloriesBurned === "number" ? body.caloriesBurned : undefined,
    activeMinutes: typeof body.activeMinutes === "number" ? body.activeMinutes : undefined,
    waterIntake: typeof body.waterIntake === "number" ? body.waterIntake : undefined,
    weight: typeof body.weight === "number" ? body.weight : undefined,
  };

  const row = await prisma.dailyActivity.upsert({
    where: { userId_date: { userId, date } },
    create: {
      userId,
      date,
      steps: data.steps ?? 0,
      caloriesBurned: data.caloriesBurned ?? 0,
      activeMinutes: data.activeMinutes ?? 0,
      waterIntake: data.waterIntake ?? 0,
      weight: data.weight ?? null,
    },
    update: Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    ),
  });

  return Response.json({ activity: toActivity(row) });
}
