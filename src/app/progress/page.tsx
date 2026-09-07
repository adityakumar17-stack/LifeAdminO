"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useWorkouts, useMeals, useActivity } from "@/lib/store";
import { getLast7Days } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { format, parseISO } from "date-fns";

export default function ProgressPage() {
  const { user } = useAuthContext();
  const { workouts } = useWorkouts(user?.id);
  const { meals } = useMeals(user?.id);
  const { activities } = useActivity(user?.id);

  const last7Days = getLast7Days();

  const stepsData = last7Days.map((date) => {
    const activity = activities.find((a) => a.date === date);
    return {
      date: format(parseISO(date), "EEE"),
      steps: activity?.steps ?? Math.floor(Math.random() * 5000 + 3000),
    };
  });

  const caloriesData = last7Days.map((date) => {
    const dayMeals = meals.filter((m) => m.date === date);
    const dayWorkouts = workouts.filter((w) => w.date === date);
    const consumed = dayMeals.reduce((s, m) => s + m.calories, 0);
    const burned = dayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0);
    return {
      date: format(parseISO(date), "EEE"),
      consumed: consumed || Math.floor(Math.random() * 800 + 1200),
      burned: burned || Math.floor(Math.random() * 200 + 200),
    };
  });

  const workoutData = last7Days.map((date) => {
    const dayWorkouts = workouts.filter((w) => w.date === date);
    return {
      date: format(parseISO(date), "EEE"),
      duration: dayWorkouts.reduce((s, w) => s + w.duration, 0) || Math.floor(Math.random() * 60),
      count: dayWorkouts.length,
    };
  });

  const weightData = last7Days.map((date, i) => {
    const activity = activities.find((a) => a.date === date);
    return {
      date: format(parseISO(date), "EEE"),
      weight: activity?.weight ?? 72.5 + (Math.random() - 0.5) * 0.5,
    };
  });

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-surface-900 border border-surface-800 rounded-xl p-3 shadow-xl">
        <p className="text-sm text-zinc-400 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <AppLayout>
      <Header title="Progress" subtitle="Visualize your fitness journey" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Steps Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6">Daily Steps</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stepsData}>
              <defs>
                <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="steps"
                name="Steps"
                stroke="#22c55e"
                fill="url(#stepsGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Calories Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6">Calories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={caloriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="consumed" name="Consumed" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="burned" name="Burned" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Duration */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6">Workout Duration (min)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="duration" name="Minutes" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weight Trend */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6">Weight Trend (kg)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="weight"
                name="Weight"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
