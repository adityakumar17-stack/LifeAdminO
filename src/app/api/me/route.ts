import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { toUser } from "@/lib/mappers";
import { getAuthedUserId, unauthorized } from "@/lib/session";

export async function GET() {
  const userId = await getAuthedUserId();
  if (!userId) return unauthorized();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return unauthorized();
  return Response.json({ user: toUser(user) });
}

export async function PATCH(request: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const data: Record<string, unknown> = {};

  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.email === "string" && body.email.trim()) {
    data.email = body.email.trim().toLowerCase();
  }
  if (body.goals) {
    if (typeof body.goals.dailySteps === "number") data.dailySteps = body.goals.dailySteps;
    if (typeof body.goals.dailyCalories === "number") data.dailyCalories = body.goals.dailyCalories;
    if (typeof body.goals.weeklyWorkouts === "number") {
      data.weeklyWorkouts = body.goals.weeklyWorkouts;
    }
    if (typeof body.goals.waterIntake === "number") data.waterIntake = body.goals.waterIntake;
    if (typeof body.goals.targetWeight === "number") data.targetWeight = body.goals.targetWeight;
  }
  if (body.preferences) {
    if (typeof body.preferences.units === "string") data.units = body.preferences.units;
    if (typeof body.preferences.theme === "string") data.theme = body.preferences.theme;
    if (typeof body.preferences.notifications === "boolean") {
      data.notifications = body.preferences.notifications;
    }
  }

  try {
    const user = await prisma.user.update({ where: { id: userId }, data });
    return Response.json({ user: toUser(user) });
  } catch {
    return Response.json({ error: "Could not update profile." }, { status: 400 });
  }
}

export async function DELETE() {
  const userId = await getAuthedUserId();
  if (!userId) return unauthorized();
  await prisma.user.delete({ where: { id: userId } });
  return Response.json({ ok: true });
}
