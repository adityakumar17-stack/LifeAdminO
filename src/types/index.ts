export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  goals: UserGoals;
  preferences: UserPreferences;
}

export interface UserGoals {
  dailySteps: number;
  dailyCalories: number;
  weeklyWorkouts: number;
  targetWeight?: number;
  waterIntake: number;
}

export interface UserPreferences {
  units: "metric" | "imperial";
  theme: "light" | "dark" | "system";
  notifications: boolean;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  type: WorkoutType;
  duration: number;
  caloriesBurned: number;
  exercises: Exercise[];
  notes?: string;
  date: string;
  createdAt: string;
}

export type WorkoutType =
  | "strength"
  | "cardio"
  | "yoga"
  | "hiit"
  | "running"
  | "cycling"
  | "swimming"
  | "other";

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  type: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  createdAt: string;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface DailyActivity {
  id: string;
  userId: string;
  date: string;
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  waterIntake: number;
  weight?: number;
}

export interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
  icon: string;
  color: string;
}

export const WORKOUT_TYPES: { value: WorkoutType; label: string; icon: string }[] = [
  { value: "strength", label: "Strength", icon: "dumbbell" },
  { value: "cardio", label: "Cardio", icon: "heart-pulse" },
  { value: "yoga", label: "Yoga", icon: "flower-2" },
  { value: "hiit", label: "HIIT", icon: "zap" },
  { value: "running", label: "Running", icon: "footprints" },
  { value: "cycling", label: "Cycling", icon: "bike" },
  { value: "swimming", label: "Swimming", icon: "waves" },
  { value: "other", label: "Other", icon: "activity" },
];

export const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

export const DEFAULT_GOALS: UserGoals = {
  dailySteps: 10000,
  dailyCalories: 2000,
  weeklyWorkouts: 4,
  waterIntake: 8,
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  units: "metric",
  theme: "dark",
  notifications: true,
};
