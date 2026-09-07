"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useWorkouts, useMeals, useActivity } from "@/lib/store";
import { calculateProgress, formatNumber } from "@/lib/utils";
import { Target, Footprints, Flame, Dumbbell, Droplets, Save } from "lucide-react";

export default function GoalsPage() {
  const { user, updateGoals } = useAuthContext();
  const { todayWorkouts } = useWorkouts(user?.id);
  const { totalCalories } = useMeals(user?.id);
  const { todayActivity } = useActivity(user?.id);

  const goals = user?.goals;
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    dailySteps: goals?.dailySteps ?? 10000,
    dailyCalories: goals?.dailyCalories ?? 2000,
    weeklyWorkouts: goals?.weeklyWorkouts ?? 4,
    waterIntake: goals?.waterIntake ?? 8,
    targetWeight: goals?.targetWeight ?? 70,
  });

  const steps = todayActivity?.steps ?? 0;
  const water = todayActivity?.waterIntake ?? 0;
  const weeklyWorkoutCount = todayWorkouts.length;

  const goalCards = [
    {
      icon: Footprints,
      label: "Daily Steps",
      current: steps,
      goal: goals?.dailySteps ?? 10000,
      unit: "steps",
      color: "#22c55e",
      field: "dailySteps" as const,
    },
    {
      icon: Flame,
      label: "Daily Calories",
      current: totalCalories,
      goal: goals?.dailyCalories ?? 2000,
      unit: "cal",
      color: "#f97316",
      field: "dailyCalories" as const,
    },
    {
      icon: Dumbbell,
      label: "Weekly Workouts",
      current: weeklyWorkoutCount,
      goal: goals?.weeklyWorkouts ?? 4,
      unit: "workouts",
      color: "#a855f7",
      field: "weeklyWorkouts" as const,
    },
    {
      icon: Droplets,
      label: "Water Intake",
      current: water,
      goal: goals?.waterIntake ?? 8,
      unit: "glasses",
      color: "#3b82f6",
      field: "waterIntake" as const,
    },
  ];

  const handleSave = () => {
    updateGoals(form);
    setEditMode(false);
  };

  return (
    <AppLayout>
      <Header title="Goals" subtitle="Set and track your fitness targets" />

      <div className="flex justify-end mb-6">
        {editMode ? (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4" /> Save Goals
            </Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setEditMode(true)}>
            Edit Goals
          </Button>
        )}
      </div>

      {editMode ? (
        <div className="glass-card p-6 max-w-lg">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-400" />
            Edit Your Goals
          </h3>
          <div className="space-y-4">
            <Input
              label="Daily Steps Goal"
              type="number"
              value={form.dailySteps}
              onChange={(e) => setForm({ ...form, dailySteps: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Daily Calorie Goal"
              type="number"
              value={form.dailyCalories}
              onChange={(e) => setForm({ ...form, dailyCalories: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Weekly Workout Goal"
              type="number"
              value={form.weeklyWorkouts}
              onChange={(e) => setForm({ ...form, weeklyWorkouts: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Daily Water Goal (glasses)"
              type="number"
              value={form.waterIntake}
              onChange={(e) => setForm({ ...form, waterIntake: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Target Weight (kg)"
              type="number"
              value={form.targetWeight}
              onChange={(e) => setForm({ ...form, targetWeight: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {goalCards.map((card) => {
            const progress = calculateProgress(card.current, card.goal);
            return (
              <div key={card.label} className="glass-card p-6 flex flex-col items-center">
                <ProgressRing
                  progress={progress}
                  value={`${progress}%`}
                  label={card.label}
                  color={card.color}
                  size={140}
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-zinc-400">
                    {formatNumber(card.current)} / {formatNumber(card.goal)} {card.unit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {goals?.targetWeight && !editMode && (
        <div className="glass-card p-6 mt-6 max-w-md">
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">Target Weight</h3>
          <p className="text-3xl font-bold text-brand-400">{goals.targetWeight} kg</p>
          {todayActivity?.weight && (
            <p className="text-sm text-zinc-500 mt-2">
              Current: {todayActivity.weight} kg (
              {todayActivity.weight > goals.targetWeight ? "+" : ""}
              {(todayActivity.weight - goals.targetWeight).toFixed(1)} kg)
            </p>
          )}
        </div>
      )}
    </AppLayout>
  );
}
