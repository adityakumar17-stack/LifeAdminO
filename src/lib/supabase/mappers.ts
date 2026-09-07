import type { DailyActivity, Meal, User, Workout } from "@/types";

type ProfileRow = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  daily_steps: number;
  daily_calories: number;
  weekly_workouts: number;
  water_intake: number;
  target_weight: number | null;
  units: string;
  theme: string;
  notifications: boolean;
};

type WorkoutRow = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  duration: number;
  calories_burned: number;
  exercises_json: string;
  notes: string | null;
  date: string;
  created_at: string;
};

type MealRow = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  created_at: string;
};

type ActivityRow = {
  id: string;
  user_id: string;
  date: string;
  steps: number;
  calories_burned: number;
  active_minutes: number;
  water_intake: number;
  weight: number | null;
};

export function profileToUser(row: ProfileRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    goals: {
      dailySteps: row.daily_steps,
      dailyCalories: row.daily_calories,
      weeklyWorkouts: row.weekly_workouts,
      waterIntake: row.water_intake,
      targetWeight: row.target_weight ?? undefined,
    },
    preferences: {
      units: row.units as User["preferences"]["units"],
      theme: row.theme as User["preferences"]["theme"],
      notifications: row.notifications,
    },
  };
}

export function rowToWorkout(row: WorkoutRow): Workout {
  let exercises: Workout["exercises"] = [];
  try {
    exercises = JSON.parse(row.exercises_json);
  } catch {
    exercises = [];
  }
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type as Workout["type"],
    duration: row.duration,
    caloriesBurned: row.calories_burned,
    exercises,
    notes: row.notes ?? undefined,
    date: row.date,
    createdAt: row.created_at,
  };
}

export function rowToMeal(row: MealRow): Meal {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type as Meal["type"],
    calories: row.calories,
    protein: row.protein,
    carbs: row.carbs,
    fat: row.fat,
    date: row.date,
    createdAt: row.created_at,
  };
}

export function rowToActivity(row: ActivityRow): DailyActivity {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    steps: row.steps,
    caloriesBurned: row.calories_burned,
    activeMinutes: row.active_minutes,
    waterIntake: row.water_intake,
    weight: row.weight ?? undefined,
  };
}
