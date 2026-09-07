"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useWorkouts } from "@/lib/store";
import { formatDuration, getToday } from "@/lib/utils";
import { WORKOUT_TYPES, type WorkoutType } from "@/types";
import {
  Plus,
  Trash2,
  Dumbbell,
  Clock,
  Flame,
  Calendar,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export default function WorkoutsPage() {
  const { user } = useAuthContext();
  const { workouts, addWorkout, deleteWorkout } = useWorkouts(user?.id);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "strength" as WorkoutType,
    duration: "",
    caloriesBurned: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkout({
      name: form.name,
      type: form.type,
      duration: parseInt(form.duration) || 0,
      caloriesBurned: parseInt(form.caloriesBurned) || 0,
      exercises: [{ id: Date.now().toString(), name: form.name }],
      notes: form.notes || undefined,
      date: getToday(),
    });
    setForm({ name: "", type: "strength", duration: "", caloriesBurned: "", notes: "" });
    setShowModal(false);
  };

  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((s, w) => s + w.duration, 0);
  const totalCalories = workouts.reduce((s, w) => s + w.caloriesBurned, 0);

  return (
    <AppLayout>
      <Header
        title="Workouts"
        subtitle="Track and manage your training sessions"
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 text-center">
          <Dumbbell className="w-6 h-6 text-brand-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-zinc-50">{totalWorkouts}</p>
          <p className="text-sm text-zinc-500">Total Workouts</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-zinc-50">{formatDuration(totalDuration)}</p>
          <p className="text-sm text-zinc-500">Total Time</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-zinc-50">{totalCalories}</p>
          <p className="text-sm text-zinc-500">Calories Burned</p>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Log Workout
        </Button>
      </div>

      {/* Workout List */}
      <div className="space-y-4">
        {sortedWorkouts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Dumbbell className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 mb-4">No workouts logged yet</p>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" /> Log Your First Workout
            </Button>
          </div>
        ) : (
          sortedWorkouts.map((workout) => (
            <div key={workout.id} className="glass-card p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-brand-500/10">
                <Dumbbell className="w-6 h-6 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-zinc-100">{workout.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                  <span className="capitalize">{workout.type}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(parseISO(workout.date), "MMM d, yyyy")}
                  </span>
                </div>
                {workout.notes && (
                  <p className="text-sm text-zinc-500 mt-1 truncate">{workout.notes}</p>
                )}
              </div>
              <div className="text-right hidden sm:block">
                <p className="font-medium text-zinc-300">{formatDuration(workout.duration)}</p>
                <p className="text-sm text-zinc-500">{workout.caloriesBurned} cal</p>
              </div>
              <button
                onClick={() => deleteWorkout(workout.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Workout Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Workout">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Workout Name"
            placeholder="Morning Run, Leg Day, etc."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Select
            label="Type"
            options={WORKOUT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as WorkoutType })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (min)"
              type="number"
              placeholder="45"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
            />
            <Input
              label="Calories Burned"
              type="number"
              placeholder="300"
              value={form.caloriesBurned}
              onChange={(e) => setForm({ ...form, caloriesBurned: e.target.value })}
            />
          </div>
          <Input
            label="Notes (optional)"
            placeholder="How did it feel?"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <Button type="submit" className="w-full">
            Save Workout
          </Button>
        </form>
      </Modal>
    </AppLayout>
  );
}
