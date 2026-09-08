"use client";

import { useState, useEffect, useCallback } from "react";
import type { Workout, Meal, DailyActivity } from "@/types";
import { getToday } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  rowToActivity,
  rowToMeal,
  rowToWorkout,
} from "@/lib/supabase/mappers";

/* =========================================================
   WORKOUTS
========================================================= */

export function useWorkouts(userId?: string) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) {
      setWorkouts([]);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load workouts:", error);
        return;
      }

      setWorkouts((data ?? []).map(rowToWorkout));
    } catch (error) {
      console.error("Unexpected workout loading error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addWorkout = useCallback(
    async (
      workout: Omit<Workout, "id" | "userId" | "createdAt">
    ) => {
      if (!userId) {
        console.error("Cannot add workout: no userId");
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("workouts")
        .insert({
          user_id: userId,
          name: workout.name,
          type: workout.type,
          duration: workout.duration,
          calories_burned: workout.caloriesBurned,
          exercises_json: JSON.stringify(
            workout.exercises ?? [{ name: workout.name }]
          ),
          notes: workout.notes ?? null,
          date: workout.date,
        })
        .select("*")
        .single();

      if (error) {
        console.error("Failed to add workout:", error);
        return;
      }

      if (!data) {
        console.error("Workout was inserted but no data was returned.");
        return;
      }

      setWorkouts((prev) => [
        rowToWorkout(data),
        ...prev.filter((w) => w.id !== data.id),
      ]);
    },
    [userId]
  );

  const deleteWorkout = useCallback(
    async (id: string) => {
      if (!userId) return;

      const supabase = createClient();

      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        console.error("Failed to delete workout:", error);
        return;
      }

      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    },
    [userId]
  );

  const todayWorkouts = workouts.filter(
    (workout) => workout.date === getToday()
  );

  const totalCaloriesBurned = todayWorkouts.reduce(
    (sum, workout) => sum + workout.caloriesBurned,
    0
  );

  const totalDuration = todayWorkouts.reduce(
    (sum, workout) => sum + workout.duration,
    0
  );

  return {
    workouts,
    todayWorkouts,
    totalCaloriesBurned,
    totalDuration,
    addWorkout,
    deleteWorkout,
    refresh,
    loading,
  };
}


/* =========================================================
   MEALS / NUTRITION
========================================================= */

export function useMeals(userId?: string) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) {
      setMeals([]);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load meals:", error);
        return;
      }

      setMeals((data ?? []).map(rowToMeal));
    } catch (error) {
      console.error("Unexpected meal loading error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addMeal = useCallback(
    async (
      meal: Omit<Meal, "id" | "userId" | "createdAt">
    ) => {
      if (!userId) {
        console.error("Cannot add meal: no userId");
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("meals")
        .insert({
          user_id: userId,
          name: meal.name,
          type: meal.type,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          date: meal.date,
        })
        .select("*")
        .single();

      if (error) {
        console.error("Failed to add meal:", error);
        return;
      }

      if (!data) {
        console.error("Meal was inserted but no data was returned.");
        return;
      }

      setMeals((prev) => [
        rowToMeal(data),
        ...prev.filter((m) => m.id !== data.id),
      ]);
    },
    [userId]
  );

  const deleteMeal = useCallback(
    async (id: string) => {
      if (!userId) return;

      const supabase = createClient();

      const { error } = await supabase
        .from("meals")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        console.error("Failed to delete meal:", error);
        return;
      }

      setMeals((prev) => prev.filter((m) => m.id !== id));
    },
    [userId]
  );

  const todayMeals = meals.filter(
    (meal) => meal.date === getToday()
  );

  const totalCalories = todayMeals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );

  const totalProtein = todayMeals.reduce(
    (sum, meal) => sum + meal.protein,
    0
  );

  const totalCarbs = todayMeals.reduce(
    (sum, meal) => sum + meal.carbs,
    0
  );

  const totalFat = todayMeals.reduce(
    (sum, meal) => sum + meal.fat,
    0
  );

  return {
    meals,
    todayMeals,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    addMeal,
    deleteMeal,
    refresh,
    loading,
  };
}


/* =========================================================
   DAILY ACTIVITY
========================================================= */

export function useActivity(userId?: string) {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) {
      setActivities([]);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("daily_activities")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) {
        console.error("Failed to load activities:", error);
        return;
      }

      setActivities((data ?? []).map(rowToActivity));
    } catch (error) {
      console.error("Unexpected activity loading error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const todayActivity = activities.find(
    (activity) => activity.date === getToday()
  );

  const updateTodayActivity = useCallback(
    async (updates: Partial<DailyActivity>) => {
      if (!userId) {
        console.error("Cannot update activity: no userId");
        return;
      }

      const supabase = createClient();

      const date = getToday();

      const payload = {
        user_id: userId,
        date,

        steps:
          updates.steps ??
          todayActivity?.steps ??
          0,

        calories_burned:
          updates.caloriesBurned ??
          todayActivity?.caloriesBurned ??
          0,

        active_minutes:
          updates.activeMinutes ??
          todayActivity?.activeMinutes ??
          0,

        water_intake:
          updates.waterIntake ??
          todayActivity?.waterIntake ??
          0,

        weight:
          updates.weight ??
          todayActivity?.weight ??
          null,
      };

      const { data, error } = await supabase
        .from("daily_activities")
        .upsert(payload, {
          onConflict: "user_id,date",
        })
        .select("*")
        .single();

      if (error) {
        console.error("Failed to update today's activity:", error);
        return;
      }

      if (!data) {
        console.error(
          "Activity was updated but no data was returned."
        );
        return;
      }

      const mapped = rowToActivity(data);

      setActivities((prev) => [
        mapped,
        ...prev.filter((activity) => activity.date !== mapped.date),
      ]);
    },
    [userId, todayActivity]
  );

  return {
    activities,
    todayActivity,
    updateTodayActivity,
    refresh,
    loading,
  };
}