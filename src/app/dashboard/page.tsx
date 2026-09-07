"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Button } from "@/components/ui/Button";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useWorkouts, useMeals, useActivity } from "@/lib/store";
import { calculateProgress, formatNumber, formatDuration } from "@/lib/utils";
import {
  Footprints,
  Flame,
  Droplets,
  Dumbbell,
  Plus,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { todayWorkouts, totalCaloriesBurned, totalDuration } = useWorkouts(user?.id);
  const { totalCalories, totalProtein, totalCarbs, totalFat } = useMeals(user?.id);
  const { todayActivity, updateTodayActivity } = useActivity(user?.id);

  const steps = todayActivity?.steps ?? 0;
  const water = todayActivity?.waterIntake ?? 0;
  const goals = user?.goals;

  const stepsProgress = calculateProgress(steps, goals?.dailySteps ?? 10000);
  const caloriesProgress = calculateProgress(totalCalories, goals?.dailyCalories ?? 2000);
  const waterProgress = calculateProgress(water, goals?.waterIntake ?? 8);

  const addWater = () => {
    updateTodayActivity({ waterIntake: water + 1 });
  };

  const addSteps = () => {
    updateTodayActivity({ steps: steps + 500 });
  };

  return (
    <AppLayout>
      <Header />

      {/* Activity Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 flex flex-col items-center">
          <ProgressRing
            progress={stepsProgress}
            value={formatNumber(steps)}
            label="steps"
            color="#22c55e"
          />
          <p className="text-sm text-zinc-400 mt-4">
            Goal: {formatNumber(goals?.dailySteps ?? 10000)} steps
          </p>
          <Button variant="ghost" size="sm" onClick={addSteps} className="mt-2">
            <Plus className="w-4 h-4" /> Add 500 steps
          </Button>
        </div>
        <div className="glass-card p-6 flex flex-col items-center">
          <ProgressRing
            progress={caloriesProgress}
            value={totalCalories.toString()}
            label="cal consumed"
            color="#f97316"
          />
          <p className="text-sm text-zinc-400 mt-4">
            Goal: {goals?.dailyCalories ?? 2000} cal
          </p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center">
          <ProgressRing
            progress={waterProgress}
            value={`${water}/${goals?.waterIntake ?? 8}`}
            label="glasses"
            color="#3b82f6"
          />
          <Button variant="ghost" size="sm" onClick={addWater} className="mt-4">
            <Plus className="w-4 h-4" /> Add glass
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Steps Today"
          value={formatNumber(steps)}
          icon={Footprints}
          color="text-brand-400"
          progress={stepsProgress}
        />
        <StatCard
          label="Calories Burned"
          value={totalCaloriesBurned + (todayActivity?.caloriesBurned ?? 0)}
          unit="cal"
          icon={Flame}
          color="text-orange-400"
        />
        <StatCard
          label="Workout Time"
          value={formatDuration(totalDuration)}
          icon={Clock}
          color="text-purple-400"
        />
        <StatCard
          label="Water Intake"
          value={water}
          unit={`/ ${goals?.waterIntake ?? 8} glasses`}
          icon={Droplets}
          color="text-blue-400"
          progress={waterProgress}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Workouts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-brand-400" />
              Today&apos;s Workouts
            </h2>
            <Link href="/workouts">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          {todayWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 mb-4">No workouts logged today</p>
              <Link href="/workouts">
                <Button size="sm">
                  <Plus className="w-4 h-4" /> Log Workout
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todayWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-800/50"
                >
                  <div>
                    <p className="font-medium text-zinc-200">{workout.name}</p>
                    <p className="text-sm text-zinc-500 capitalize">{workout.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-zinc-300">
                      {formatDuration(workout.duration)}
                    </p>
                    <p className="text-xs text-zinc-500">{workout.caloriesBurned} cal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nutrition Summary */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              Nutrition Today
            </h2>
            <Link href="/nutrition">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Calories", value: totalCalories, color: "text-orange-400" },
              { label: "Protein", value: `${totalProtein}g`, color: "text-red-400" },
              { label: "Carbs", value: `${totalCarbs}g`, color: "text-yellow-400" },
              { label: "Fat", value: `${totalFat}g`, color: "text-blue-400" },
            ].map((macro) => (
              <div key={macro.label} className="text-center">
                <p className={`text-lg font-bold ${macro.color}`}>{macro.value}</p>
                <p className="text-xs text-zinc-500">{macro.label}</p>
              </div>
            ))}
          </div>
          <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-brand-500 rounded-full transition-all"
              style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2 text-center">
            {totalCalories} / {goals?.dailyCalories ?? 2000} calories
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
