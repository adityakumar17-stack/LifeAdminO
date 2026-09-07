import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { toMeal } from "@/lib/mappers";
import { getAuthedUserId, unauthorized } from "@/lib/session";
import { getToday } from "@/lib/utils";

export async function GET() {
  const userId = await getAuthedUserId();
  if (!userId) return unauthorized();

  const rows = await prisma.meal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ meals: rows.map(toMeal) });
}

export async function POST(request: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  if (!name) return Response.json({ error: "Meal name is required." }, { status: 400 });

  const row = await prisma.meal.create({
    data: {
      userId,
      name,
      type: String(body.type ?? "snack"),
      calories: Number(body.calories) || 0,
      protein: Number(body.protein) || 0,
      carbs: Number(body.carbs) || 0,
      fat: Number(body.fat) || 0,
      date: String(body.date ?? getToday()),
    },
  });
  return Response.json({ meal: toMeal(row) }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) return unauthorized();

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id." }, { status: 400 });

  const existing = await prisma.meal.findFirst({ where: { id, userId } });
  if (!existing) return Response.json({ error: "Not found." }, { status: 404 });

  await prisma.meal.delete({ where: { id } });
  return Response.json({ ok: true });
}
