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

export function useWorkouts(userId?: string) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const refresh = useCallback(async () => {
    if (!userId) return;

    const supabase = createClient();

    const { data } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setWorkouts((data ?? []).map(rowToWorkout));
  }, [userId]);
  useEffect(() => {
    if (!userId) {
      setWorkouts([]);
      return;
    }
  
    void refresh();
  }, [userId, refresh]);
  const addWorkout = useCallback(
    async (
      workout: Omit<Workout, "id" | "userId" | "createdAt">
    ) => {
      if (!userId) return;

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

      if (error || !data) return;

      setWorkouts((prev) => [
        rowToWorkout(data),
        ...prev.filter((w) => w.id !== data.id),
      ]);
    },
    [userId]
  );

  const deleteWorkout = useCallback(
    async (id: string) => {
      const supabase = createClient();

      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", id);

      if (error) return;

      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    },
    []
  );

  const todayWorkouts = workouts.filter(
    (w) => w.date === getToday()
  );

  const totalCaloriesBurned = todayWorkouts.reduce(
    (sum, w) => sum + w.caloriesBurned,
    0
  );

  const totalDuration = todayWorkouts.reduce(
    (sum, w) => sum + w.duration,
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
  };
}

export function useMeals(userId?: string) {
  const [meals, setMeals] = useState<Meal[]>([]);

  const refresh = useCallback(async () => {
    if (!userId) return;

    const supabase = createClient();

    const { data } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setMeals((data ?? []).map(rowToMeal));
  }, [userId]);

  const addMeal = useCallback(
    async (
      meal: Omit<Meal, "id" | "userId" | "createdAt">
    ) => {
      if (!userId) return;

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

      if (error || !data) return;

      setMeals((prev) => [
        rowToMeal(data),
        ...prev.filter((m) => m.id !== data.id),
      ]);
    },
    [userId]
  );

  const deleteMeal = useCallback(
    async (id: string) => {
      const supabase = createClient();

      const { error } = await supabase
        .from("meals")
        .delete()
        .eq("id", id);

      if (error) return;

      setMeals((prev) => prev.filter((m) => m.id !== id));
    },
    []
  );

  const todayMeals = meals.filter(
    (m) => m.date === getToday()
  );

  const totalCalories = todayMeals.reduce(
    (sum, m) => sum + m.calories,
    0
  );

  const totalProtein = todayMeals.reduce(
    (sum, m) => sum + m.protein,
    0
  );

  const totalCarbs = todayMeals.reduce(
    (sum, m) => sum + m.carbs,
    0
  );

  const totalFat = todayMeals.reduce(
    (sum, m) => sum + m.fat,
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
  };
}

export function useActivity(userId?: string) {
  const [activities, setActivities] = useState<DailyActivity[]>([]);

  const refresh = useCallback(async () => {
    if (!userId) return;

    const supabase = createClient();

    const { data } = await supabase
      .from("daily_activities")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    setActivities((data ?? []).map(rowToActivity));
  }, [userId]);

  const todayActivity = activities.find(
    (a) => a.date === getToday()
  );

  const updateTodayActivity = useCallback(
    async (updates: Partial<DailyActivity>) => {
      if (!userId) return;

      const supabase = createClient();

      const date = getToday();

      const payload = {
        user_id: userId,
        date,
        steps: updates.steps ?? todayActivity?.steps ?? 0,
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

      if (error || !data) return;

      const mapped = rowToActivity(data);

      setActivities((prev) => [
        mapped,
        ...prev.filter((a) => a.date !== mapped.date),
      ]);
    },
    [userId, todayActivity]
  );

  return {
    activities,
    todayActivity,
    updateTodayActivity,
    refresh,
  };
}