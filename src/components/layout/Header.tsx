"use client";

import { useEffect, useRef, useState } from "react";
import { getGreeting, getInitials, formatNumber, calculateProgress } from "@/lib/utils";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useActivity, useWorkouts } from "@/lib/store";
import {
  CalendarDays,
  Sparkles,
  Footprints,
  Dumbbell,
  Droplets,
  Plus,
  X,
  Utensils,
  Target,
  TrendingUp,
  Settings,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

function getTimeCue() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return {
      label: "Morning session",
      hint: "Prime time for a focused workout",
    };
  }

  if (hour < 17) {
    return {
      label: "Afternoon energy",
      hint: "Keep the streak moving",
    };
  }

  return {
    label: "Evening wind-down",
    hint: "Log today before you wrap up",
  };
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuthContext();
  const { todayActivity, updateTodayActivity } = useActivity(user?.id);
  const { todayWorkouts } = useWorkouts(user?.id);

  const router = useRouter();

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [search, setSearch] = useState("");

  const quickAddRef = useRef<HTMLDivElement>(null);

  const firstName = user?.name?.split(" ")[0] || "there";
  const greeting = getGreeting();
  const cue = getTimeCue();
  const today = format(new Date(), "EEEE, MMMM d");

  const steps = todayActivity?.steps ?? 0;
  const water = todayActivity?.waterIntake ?? 0;

  const stepGoal = user?.goals?.dailySteps ?? 10000;
  const waterGoal = user?.goals?.waterIntake ?? 8;

  const stepPct = calculateProgress(steps, stepGoal);

  const heading = title || (
    <>
      {greeting},{" "}
      <span className="gradient-text">{firstName}</span>
    </>
  );

  const supporting = subtitle || cue.hint;

  // Close quick-add menu when clicking outside it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        quickAddRef.current &&
        !quickAddRef.current.contains(event.target as Node)
      ) {
        setShowQuickAdd(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search navigation
  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim().toLowerCase();

    if (!query) return;

    if (
      query.includes("workout") ||
      query.includes("exercise") ||
      query.includes("training")
    ) {
      router.push("/workouts");
    } else if (
      query.includes("meal") ||
      query.includes("food") ||
      query.includes("nutrition") ||
      query.includes("calorie")
    ) {
      router.push("/nutrition");
    } else if (
      query.includes("goal") ||
      query.includes("target")
    ) {
      router.push("/goals");
    } else if (
      query.includes("progress") ||
      query.includes("analytics") ||
      query.includes("stats")
    ) {
      router.push("/progress");
    } else if (
      query.includes("setting") ||
      query.includes("profile")
    ) {
      router.push("/settings");
    } else {
      // Default search destination
      router.push("/workouts");
    }

    setSearch("");
  }

  async function addWater() {
    await updateTodayActivity({
      waterIntake: water + 1,
    });

    setShowQuickAdd(false);
  }

  async function addSteps() {
    await updateTodayActivity({
      steps: steps + 500,
    });

    setShowQuickAdd(false);
  }

  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        {/* ========================================================= */}
        {/* GREETING / SUMMARY CARD */}
        {/* ========================================================= */}

        <div className="relative overflow-hidden rounded-2xl border border-surface-800 bg-gradient-to-br from-surface-900 via-surface-900 to-brand-500/10 px-4 py-4 sm:px-5 sm:py-5 flex-1">

          <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-brand-500/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-16 left-24 h-28 w-28 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative flex items-start gap-3.5 sm:gap-4">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-brand-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-500/20 ring-2 ring-brand-400/20">
                {user ? getInitials(user.name) : "FP"}
              </div>

              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-brand-400 ring-2 ring-surface-900" />
            </div>

            <div className="min-w-0 flex-1">

              {/* Date + session */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">

                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-800/80 border border-white/5 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400">
                  <CalendarDays className="w-3 h-3 text-brand-400" />
                  {today}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 text-[11px] font-medium text-brand-400">
                  <Sparkles className="w-3 h-3" />
                  {title ? title : cue.label}
                </span>

              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight truncate">
                {heading}
              </h1>

              <p className="text-sm text-zinc-400 mt-1">
                {supporting}
              </p>

              {/* Daily mini stats */}
              {!title && (
                <>
                  <div className="mt-3 flex flex-wrap gap-2">

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 border border-white/5 px-2.5 py-1 text-xs text-zinc-300">
                      <Footprints className="w-3.5 h-3.5 text-brand-400" />
                      {formatNumber(steps)} steps · {stepPct}%
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 border border-white/5 px-2.5 py-1 text-xs text-zinc-300">
                      <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
                      {todayWorkouts.length} workout
                      {todayWorkouts.length === 1 ? "" : "s"} today
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 border border-white/5 px-2.5 py-1 text-xs text-zinc-300">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      {water}/{waterGoal} glasses
                    </span>

                  </div>

                  <div className="mt-3 h-1.5 w-full max-w-sm rounded-full bg-surface-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500"
                      style={{
                        width: `${Math.min(stepPct, 100)}%`,
                      }}
                    />
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ACTION BAR */}
        {/* ========================================================= */}

        <div className="flex items-center gap-2 sm:gap-3 w-full lg:max-w-xl lg:flex-1 min-w-0">

          {/* SEARCH */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 min-w-0"
          >
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search workouts, meals, goals..."
              className="w-full h-11 pl-10 pr-12 rounded-2xl bg-surface-900/80 border border-surface-800 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40"
            />

            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center rounded-md border border-surface-700 bg-surface-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
              Enter
            </kbd>
          </form>

          {/* ======================================================= */}
          {/* QUICK ADD */}
          {/* ======================================================= */}

          <div className="relative shrink-0" ref={quickAddRef}>

            <button
              type="button"
              aria-label="Quick add"
              aria-expanded={showQuickAdd}
              onClick={() => setShowQuickAdd((value) => !value)}
              className="inline-flex h-11 w-11 sm:w-auto items-center justify-center gap-2 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium px-3.5 sm:px-4 transition-colors shadow-lg shadow-brand-500/10"
            >
              {showQuickAdd ? (
                <X className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}

              <span className="hidden sm:inline">
                {showQuickAdd ? "Close" : "Log"}
              </span>
            </button>

            {/* QUICK ADD MENU */}
            {showQuickAdd && (
              <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-surface-700 bg-surface-900 shadow-2xl shadow-black/40 p-2">

                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Quick Add
                  </p>
                </div>

                {/* Workout */}
                <Link
                  href="/workouts"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-surface-800 transition-colors"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <Dumbbell className="w-4 h-4" />
                  </span>

                  <span>
                    <span className="block text-sm font-medium text-zinc-100">
                      Log Workout
                    </span>
                    <span className="block text-xs text-zinc-500">
                      Record today's training
                    </span>
                  </span>
                </Link>

                {/* Meal */}
                <Link
                  href="/nutrition"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-surface-800 transition-colors"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                    <Utensils className="w-4 h-4" />
                  </span>

                  <span>
                    <span className="block text-sm font-medium text-zinc-100">
                      Log Meal
                    </span>
                    <span className="block text-xs text-zinc-500">
                      Track calories & macros
                    </span>
                  </span>
                </Link>

                {/* Water */}
                <button
                  type="button"
                  onClick={addWater}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-surface-800 transition-colors text-left"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Droplets className="w-4 h-4" />
                  </span>

                  <span>
                    <span className="block text-sm font-medium text-zinc-100">
                      Add Water
                    </span>
                    <span className="block text-xs text-zinc-500">
                      +1 glass · {water}/{waterGoal}
                    </span>
                  </span>
                </button>

                {/* Steps */}
                <button
                  type="button"
                  onClick={addSteps}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-surface-800 transition-colors text-left"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                    <Footprints className="w-4 h-4" />
                  </span>

                  <span>
                    <span className="block text-sm font-medium text-zinc-100">
                      Add Steps
                    </span>
                    <span className="block text-xs text-zinc-500">
                      +500 steps
                    </span>
                  </span>
                </button>

                {/* Goals */}
                <Link
                  href="/goals"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-surface-800 transition-colors"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                    <Target className="w-4 h-4" />
                  </span>

                  <span>
                    <span className="block text-sm font-medium text-zinc-100">
                      Manage Goals
                    </span>
                    <span className="block text-xs text-zinc-500">
                      Update your targets
                    </span>
                  </span>
                </Link>

              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* PROFILE */}
          {/* ======================================================= */}

          <Link
            href="/settings"
            aria-label="Open profile settings"
            className="hidden sm:flex h-11 items-center gap-2.5 shrink-0 rounded-2xl bg-surface-900/80 border border-surface-800 pl-1.5 pr-3 hover:border-brand-500/30 transition-colors"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
              {user ? getInitials(user.name) : "FP"}
            </span>

            <span className="text-left min-w-0">
              <span className="block text-sm font-medium text-zinc-100 leading-tight truncate max-w-[7.5rem]">
                {firstName}
              </span>

              <span className="block text-[11px] text-zinc-500 leading-tight">
                Profile
              </span>
            </span>
          </Link>

        </div>
      </div>
    </header>
  );
}