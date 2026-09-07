import type { DailyActivity, Meal, User, Workout } from "@/types";
import type { DailyActivity as DbActivity, Meal as DbMeal, User as DbUser, Workout as DbWorkout } from "@prisma/client";

export function toUser(row: DbUser): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt.toISOString(),
    goals: {
      dailySteps: row.dailySteps,
      dailyCalories: row.dailyCalories,
      weeklyWorkouts: row.weeklyWorkouts,
      waterIntake: row.waterIntake,
      targetWeight: row.targetWeight ?? undefined,
    },
    preferences: {
      units: row.units as User["preferences"]["units"],
      theme: row.theme as User["preferences"]["theme"],
      notifications: row.notifications,
    },
  };
}

export function toWorkout(row: DbWorkout): Workout {
  let exercises: Workout["exercises"] = [];
  try {
    exercises = JSON.parse(row.exercisesJson);
  } catch {
    exercises = [];
  }
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    type: row.type as Workout["type"],
    duration: row.duration,
    caloriesBurned: row.caloriesBurned,
    exercises,
    notes: row.notes ?? undefined,
    date: row.date,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toMeal(row: DbMeal): Meal {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    type: row.type as Meal["type"],
    calories: row.calories,
    protein: row.protein,
    carbs: row.carbs,
    fat: row.fat,
    date: row.date,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toActivity(row: DbActivity): DailyActivity {
  return {
    id: row.id,
    userId: row.userId,
    date: row.date,
    steps: row.steps,
    caloriesBurned: row.caloriesBurned,
    activeMinutes: row.activeMinutes,
    waterIntake: row.waterIntake,
    weight: row.weight ?? undefined,
  };
}
