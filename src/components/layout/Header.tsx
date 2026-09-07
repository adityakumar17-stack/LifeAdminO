"use client";

import { getGreeting, getInitials, formatNumber, calculateProgress } from "@/lib/utils";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useActivity, useWorkouts } from "@/lib/store";
import {
  Bell,
  Search,
  CalendarDays,
  Sparkles,
  Footprints,
  Dumbbell,
  Droplets,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

function getTimeCue() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return { label: "Morning session", hint: "Prime time for a focused workout" };
  }
  if (hour < 17) {
    return { label: "Afternoon energy", hint: "Keep the streak moving" };
  }
  return { label: "Evening wind-down", hint: "Log today before you wrap up" };
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuthContext();
  const { todayActivity } = useActivity(user?.id);
  const { todayWorkouts } = useWorkouts(user?.id);

  const firstName = user?.name?.split(" ")[0] || "there";
  const greeting = getGreeting();
  const cue = getTimeCue();
  const today = format(new Date(), "EEEE, MMMM d");

  const steps = todayActivity?.steps ?? 0;
  const water = todayActivity?.waterIntake ?? 0;
  const stepGoal = user?.goals.dailySteps ?? 10000;
  const waterGoal = user?.goals.waterIntake ?? 8;
  const stepPct = calculateProgress(steps, stepGoal);

  const heading = title || (
    <>
      {greeting}, <span className="gradient-text">{firstName}</span>
    </>
  );

  const supporting = subtitle || cue.hint;

  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-surface-800 bg-gradient-to-br from-surface-900 via-surface-900 to-brand-500/10 px-4 py-4 sm:px-5 sm:py-5 flex-1">
          <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-24 h-28 w-28 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative flex items-start gap-3.5 sm:gap-4">
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-brand-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-500/20 ring-2 ring-brand-400/20">
                {user ? getInitials(user.name) : "FP"}
              </div>
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-brand-400 ring-2 ring-surface-900" />
            </div>

            <div className="min-w-0 flex-1">
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
              <p className="text-sm text-zinc-400 mt-1">{supporting}</p>

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
                      style={{ width: `${stepPct}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full lg:max-w-xl lg:flex-1 min-w-0">
          <label className="relative flex-1 min-w-0">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="search"
              placeholder="Search workouts, meals, goals..."
              className="w-full h-11 pl-10 pr-12 rounded-2xl bg-surface-900/80 border border-surface-800 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center rounded-md border border-surface-700 bg-surface-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
              ⌘K
            </kbd>
          </label>

          <Link
            href="/workouts"
            className="inline-flex h-11 items-center gap-2 shrink-0 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium px-3.5 sm:px-4 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Log</span>
          </Link>

          <button
            type="button"
            aria-label="Notifications"
            className="relative h-11 w-11 shrink-0 rounded-2xl bg-surface-900/80 border border-surface-800 text-zinc-400 hover:text-zinc-100 hover:border-brand-500/30 transition-colors inline-flex items-center justify-center"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-400 rounded-full ring-2 ring-surface-900" />
          </button>

          <Link
            href="/settings"
            className="hidden sm:flex h-11 items-center gap-2.5 shrink-0 rounded-2xl bg-surface-900/80 border border-surface-800 pl-1.5 pr-3 hover:border-brand-500/30 transition-colors"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
              {user ? getInitials(user.name) : "FP"}
            </span>
            <span className="text-left min-w-0">
              <span className="block text-sm font-medium text-zinc-100 leading-tight truncate max-w-[7.5rem]">
                {firstName}
              </span>
              <span className="block text-[11px] text-zinc-500 leading-tight">Profile</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
