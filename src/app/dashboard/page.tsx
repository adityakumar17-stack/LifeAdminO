"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useWorkouts, useMeals, useActivity } from "@/lib/store";
import {
  calculateProgress,
  formatNumber,
  formatDuration,
} from "@/lib/utils";

import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Dumbbell,
  Droplets,
  Flame,
  Footprints,
  Plus,
  Target,
  TrendingUp,
  Trophy,
  Utensils,
} from "lucide-react";

import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuthContext();

  const {
    todayWorkouts,
    totalCaloriesBurned,
    totalDuration,
  } = useWorkouts(user?.id);

  const {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
  } = useMeals(user?.id);

  const {
    todayActivity,
    updateTodayActivity,
  } = useActivity(user?.id);

  const steps = todayActivity?.steps ?? 0;
  const water = todayActivity?.waterIntake ?? 0;

  const goals = user?.goals;

  const stepGoal = goals?.dailySteps ?? 10000;
  const calorieGoal = goals?.dailyCalories ?? 2000;
  const waterGoal = goals?.waterIntake ?? 8;

  const stepsProgress = calculateProgress(steps, stepGoal);
  const caloriesProgress = calculateProgress(
    totalCalories,
    calorieGoal
  );
  const waterProgress = calculateProgress(
    water,
    waterGoal
  );

  /*
   * -------------------------------------------------------
   * FITPULSE SCORE
   * -------------------------------------------------------
   * This is a simple local score for now.
   * Later we can replace this with a real AI-powered score.
   */

  const workoutScore =
    todayWorkouts.length > 0 ? 100 : 0;

  const fitnessScore = Math.round(
    stepsProgress * 0.3 +
      waterProgress * 0.2 +
      workoutScore * 0.3 +
      caloriesProgress * 0.2
  );

  /*
   * -------------------------------------------------------
   * DAILY INSIGHT
   * -------------------------------------------------------
   */

  let insightTitle = "Start your day strong";
  let insightText =
    "Log your first activity to start building today's fitness picture.";

  if (todayWorkouts.length > 0 && waterProgress >= 50) {
    insightTitle = "You're building momentum";
    insightText =
      "You've already started strong today. Keep your hydration and nutrition consistent.";
  } else if (todayWorkouts.length > 0) {
    insightTitle = "Workout complete";
    insightText =
      "Great job getting your training done. Focus on hydration and nutrition next.";
  } else if (stepsProgress >= 50) {
    insightTitle = "Good movement today";
    insightText =
      "Your activity level is looking good. Consider adding a workout to complete today's training goal.";
  } else if (waterProgress < 50) {
    insightTitle = "Hydration is your priority";
    insightText =
      "You're currently behind on hydration. Add a few glasses throughout the day.";
  }

  const addWater = () => {
    updateTodayActivity({
      waterIntake: water + 1,
    });
  };

  const addSteps = () => {
    updateTodayActivity({
      steps: steps + 500,
    });
  };

  return (
    <AppLayout>
      <Header />

      <main className="space-y-6 pb-10">

        {/* =====================================================
            TOP SUMMARY
        ====================================================== */}

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Fitness Score */}

          <div className="glass-card p-6 xl:col-span-1">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-brand-400" />

                  <h2 className="text-lg font-semibold text-zinc-100">
                    FitPulse Score
                  </h2>
                </div>

                <p className="text-sm text-zinc-500 mt-1">
                  Your activity score today
                </p>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Today
              </span>
            </div>

            <div className="flex items-center gap-6">

              <div className="relative">
                <ProgressRing
                  progress={fitnessScore}
                  value={fitnessScore.toString()}
                  label="score"
                  color="#22c55e"
                />
              </div>

              <div className="flex-1 space-y-3">

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">
                      Steps
                    </span>

                    <span className="text-zinc-300">
                      {Math.round(stepsProgress)}%
                    </span>
                  </div>

                  <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          stepsProgress,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">
                      Hydration
                    </span>

                    <span className="text-zinc-300">
                      {Math.round(waterProgress)}%
                    </span>
                  </div>

                  <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          waterProgress,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">
                      Training
                    </span>

                    <span className="text-zinc-300">
                      {todayWorkouts.length > 0
                        ? "Complete"
                        : "Pending"}
                    </span>
                  </div>

                  <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: `${
                          todayWorkouts.length > 0
                            ? 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>


          {/* Today's Focus */}

          <div className="glass-card p-6 xl:col-span-2">

            <div className="flex items-center justify-between mb-5">

              <div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-400" />

                  <h2 className="text-lg font-semibold text-zinc-100">
                    Today&apos;s Focus
                  </h2>
                </div>

                <p className="text-sm text-zinc-500 mt-1">
                  Your priorities for today
                </p>
              </div>

              <span className="text-xs text-zinc-500">
                {todayWorkouts.length > 0
                  ? "1 / 1 complete"
                  : "0 / 1 complete"}
              </span>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              {/* Workout */}

              <Link
                href="/workouts"
                className="group rounded-xl border border-white/5 bg-surface-800/40 p-4 hover:bg-surface-800/70 transition"
              >
                <div className="flex items-center justify-between mb-3">

                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-purple-400" />
                  </div>

                  {todayWorkouts.length > 0 && (
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  )}
                </div>

                <p className="text-sm font-medium text-zinc-200">
                  Workout
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  {todayWorkouts.length > 0
                    ? `${todayWorkouts.length} workout logged`
                    : "No workout logged yet"}
                </p>

                <div className="flex items-center gap-1 text-xs text-brand-400 mt-3">
                  {todayWorkouts.length > 0
                    ? "View workout"
                    : "Start training"}

                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </div>
              </Link>


              {/* Nutrition */}

              <Link
                href="/nutrition"
                className="group rounded-xl border border-white/5 bg-surface-800/40 p-4 hover:bg-surface-800/70 transition"
              >
                <div className="flex items-center justify-between mb-3">

                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-orange-400" />
                  </div>

                  <span className="text-xs text-zinc-500">
                    {Math.round(caloriesProgress)}%
                  </span>
                </div>

                <p className="text-sm font-medium text-zinc-200">
                  Nutrition
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  {totalCalories} / {calorieGoal} calories
                </p>

                <div className="flex items-center gap-1 text-xs text-orange-400 mt-3">
                  Log food

                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </div>
              </Link>


              {/* Hydration */}

              <button
                onClick={addWater}
                className="group text-left rounded-xl border border-white/5 bg-surface-800/40 p-4 hover:bg-surface-800/70 transition"
              >
                <div className="flex items-center justify-between mb-3">

                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-blue-400" />
                  </div>

                  <Plus className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition" />
                </div>

                <p className="text-sm font-medium text-zinc-200">
                  Hydration
                </p>

                <p className="text-xs text-zinc-500 mt-1">
                  {water} / {waterGoal} glasses
                </p>

                <div className="flex items-center gap-1 text-xs text-blue-400 mt-3">
                  Add a glass

                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </div>
              </button>

            </div>
          </div>
        </section>


        {/* =====================================================
            DAILY INSIGHT
        ====================================================== */}

        <section className="glass-card p-6 border-brand-500/10 bg-gradient-to-r from-brand-500/5 via-transparent to-purple-500/5">

          <div className="flex flex-col md:flex-row md:items-center gap-5">

            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6 text-brand-400" />
            </div>

            <div className="flex-1">

              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold text-zinc-100">
                  FitPulse Insight
                </h2>

                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400">
                  Daily
                </span>
              </div>

              <p className="text-sm font-medium text-brand-300">
                {insightTitle}
              </p>

              <p className="text-sm text-zinc-500 mt-1">
                {insightText}
              </p>

            </div>

            <Link href="/progress">
              <Button variant="ghost" size="sm">
                View Progress
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

          </div>
        </section>


        {/* =====================================================
            QUICK STATS
        ====================================================== */}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="glass-card p-5">

            <div className="flex items-center justify-between">

              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <Footprints className="w-5 h-5 text-brand-400" />
              </div>

              <span className="text-xs text-zinc-500">
                {Math.round(stepsProgress)}%
              </span>

            </div>

            <p className="text-2xl font-bold text-zinc-100 mt-4">
              {formatNumber(steps)}
            </p>

            <p className="text-sm text-zinc-500">
              Steps today
            </p>

            <Button
              variant="ghost"
              size="sm"
              onClick={addSteps}
              className="mt-3"
            >
              <Plus className="w-3.5 h-3.5" />
              500 steps
            </Button>

          </div>


          <div className="glass-card p-5">

            <div className="flex items-center justify-between">

              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>

              <TrendingUp className="w-4 h-4 text-zinc-600" />

            </div>

            <p className="text-2xl font-bold text-zinc-100 mt-4">
              {totalCaloriesBurned +
                (todayActivity?.caloriesBurned ?? 0)}
            </p>

            <p className="text-sm text-zinc-500">
              Calories burned
            </p>

          </div>


          <div className="glass-card p-5">

            <div className="flex items-center justify-between">

              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>

            </div>

            <p className="text-2xl font-bold text-zinc-100 mt-4">
              {formatDuration(totalDuration)}
            </p>

            <p className="text-sm text-zinc-500">
              Workout time
            </p>

          </div>


          <div className="glass-card p-5">

            <div className="flex items-center justify-between">

              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-blue-400" />
              </div>

              <span className="text-xs text-zinc-500">
                {Math.round(waterProgress)}%
              </span>

            </div>

            <p className="text-2xl font-bold text-zinc-100 mt-4">
              {water}
            </p>

            <p className="text-sm text-zinc-500">
              Water glasses
            </p>

          </div>

        </section>


        {/* =====================================================
            WORKOUT + NUTRITION
        ====================================================== */}

        <section className="grid lg:grid-cols-2 gap-6">

          {/* Workouts */}

          <div className="glass-card p-6">

            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center gap-2">

                <Dumbbell className="w-5 h-5 text-brand-400" />

                <h2 className="text-lg font-semibold text-zinc-100">
                  Today&apos;s Workouts
                </h2>

              </div>

              <Link href="/workouts">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

            </div>


            {todayWorkouts.length === 0 ? (

              <div className="text-center py-8">

                <div className="w-12 h-12 mx-auto rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                  <Dumbbell className="w-5 h-5 text-brand-400" />
                </div>

                <p className="text-zinc-300 font-medium">
                  Your training is waiting
                </p>

                <p className="text-sm text-zinc-500 mt-1 mb-4">
                  Log your first workout of the day.
                </p>

                <Link href="/workouts">
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                    Log Workout
                  </Button>
                </Link>

              </div>

            ) : (

              <div className="space-y-3">

                {todayWorkouts.map((workout) => (

                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-surface-800/50 border border-white/5"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                        <Dumbbell className="w-4 h-4 text-brand-400" />
                      </div>

                      <div>

                        <p className="font-medium text-zinc-200">
                          {workout.name}
                        </p>

                        <p className="text-sm text-zinc-500 capitalize">
                          {workout.type}
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="text-sm font-medium text-zinc-300">
                        {formatDuration(workout.duration)}
                      </p>

                      <p className="text-xs text-zinc-500">
                        {workout.caloriesBurned} cal
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* Nutrition */}

          <div className="glass-card p-6">

            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center gap-2">

                <Utensils className="w-5 h-5 text-orange-400" />

                <h2 className="text-lg font-semibold text-zinc-100">
                  Nutrition Today
                </h2>

              </div>

              <Link href="/nutrition">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

            </div>


            <div className="grid grid-cols-4 gap-3 mb-6">

              <div className="text-center">
                <p className="text-lg font-bold text-orange-400">
                  {totalCalories}
                </p>
                <p className="text-xs text-zinc-500">
                  Calories
                </p>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-red-400">
                  {totalProtein}g
                </p>
                <p className="text-xs text-zinc-500">
                  Protein
                </p>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-yellow-400">
                  {totalCarbs}g
                </p>
                <p className="text-xs text-zinc-500">
                  Carbs
                </p>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-blue-400">
                  {totalFat}g
                </p>
                <p className="text-xs text-zinc-500">
                  Fat
                </p>
              </div>

            </div>


            <div className="h-2 bg-surface-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-gradient-to-r from-orange-500 to-brand-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    caloriesProgress,
                    100
                  )}%`,
                }}
              />

            </div>

            <p className="text-xs text-zinc-500 mt-2 text-center">
              {totalCalories} / {calorieGoal} calories
            </p>

          </div>

        </section>


        {/* =====================================================
            ACHIEVEMENT
        ====================================================== */}

        <section className="glass-card p-6">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>

            <div>
              <h2 className="font-semibold text-zinc-100">
                Today&apos;s Achievement
              </h2>

              <p className="text-sm text-zinc-500">
                Keep building your consistency
              </p>
            </div>

          </div>

          <div className="flex items-center justify-between">

            <div>

              {todayWorkouts.length > 0 ? (

                <>
                  <p className="text-brand-400 font-medium">
                    Workout completed 🎉
                  </p>

                  <p className="text-sm text-zinc-500 mt-1">
                    You&apos;ve made progress toward today&apos;s training goal.
                  </p>
                </>

              ) : (

                <>
                  <p className="text-zinc-300 font-medium">
                    Your next achievement is waiting.
                  </p>

                  <p className="text-sm text-zinc-500 mt-1">
                    Complete a workout today to start your streak.
                  </p>
                </>

              )}

            </div>

            <Link href="/goals">
              <Button variant="ghost" size="sm">
                Goals
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

          </div>

        </section>

      </main>
    </AppLayout>
  );
}