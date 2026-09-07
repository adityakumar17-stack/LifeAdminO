"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useMeals } from "@/lib/store";
import { getToday } from "@/lib/utils";
import { MEAL_TYPES, type MealType } from "@/types";
import { Plus, Trash2, UtensilsCrossed } from "lucide-react";

export default function NutritionPage() {
  const { user } = useAuthContext();
  const { todayMeals, totalCalories, totalProtein, totalCarbs, totalFat, addMeal, deleteMeal } =
    useMeals(user?.id);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "breakfast" as MealType,
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMeal({
      name: form.name,
      type: form.type,
      calories: parseInt(form.calories) || 0,
      protein: parseInt(form.protein) || 0,
      carbs: parseInt(form.carbs) || 0,
      fat: parseInt(form.fat) || 0,
      date: getToday(),
    });
    setForm({ name: "", type: "breakfast", calories: "", protein: "", carbs: "", fat: "" });
    setShowModal(false);
  };

  const calorieGoal = user?.goals.dailyCalories ?? 2000;
  const caloriePercent = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100);

  const mealsByType = MEAL_TYPES.map((type) => ({
    ...type,
    meals: todayMeals.filter((m) => m.type === type.value),
    calories: todayMeals
      .filter((m) => m.type === type.value)
      .reduce((s, m) => s + m.calories, 0),
  }));

  return (
    <AppLayout>
      <Header title="Nutrition" subtitle="Track your meals and macros" />

      {/* Macro Summary */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-zinc-500">Calories Today</p>
            <p className="text-3xl font-bold text-zinc-50">
              {totalCalories}{" "}
              <span className="text-lg text-zinc-500 font-normal">/ {calorieGoal}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-brand-400">{caloriePercent}%</p>
            <p className="text-sm text-zinc-500">of daily goal</p>
          </div>
        </div>
        <div className="h-3 bg-surface-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${caloriePercent}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Protein", value: totalProtein, unit: "g", color: "bg-red-500" },
            { label: "Carbs", value: totalCarbs, unit: "g", color: "bg-yellow-500" },
            { label: "Fat", value: totalFat, unit: "g", color: "bg-blue-500" },
          ].map((macro) => (
            <div key={macro.label} className="text-center">
              <div className={`w-2 h-2 rounded-full ${macro.color} mx-auto mb-2`} />
              <p className="text-xl font-bold text-zinc-100">
                {macro.value}
                <span className="text-sm text-zinc-500 font-normal">{macro.unit}</span>
              </p>
              <p className="text-xs text-zinc-500">{macro.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Log Meal
        </Button>
      </div>

      {/* Meals by Type */}
      <div className="space-y-6">
        {mealsByType.map((section) => (
          <div key={section.value} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                {section.label}
              </h3>
              <span className="text-sm text-zinc-500">{section.calories} cal</span>
            </div>
            {section.meals.length === 0 ? (
              <p className="text-sm text-zinc-600 py-2">No meals logged</p>
            ) : (
              <div className="space-y-2">
                {section.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50"
                  >
                    <div>
                      <p className="font-medium text-zinc-200">{meal.name}</p>
                      <p className="text-xs text-zinc-500">
                        P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-zinc-300">{meal.calories} cal</span>
                      <button
                        onClick={() => deleteMeal(meal.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Meal Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Meal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Meal Name"
            placeholder="Grilled Chicken Salad"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Select
            label="Meal Type"
            options={MEAL_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as MealType })}
          />
          <Input
            label="Calories"
            type="number"
            placeholder="450"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
            required
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Protein (g)"
              type="number"
              placeholder="30"
              value={form.protein}
              onChange={(e) => setForm({ ...form, protein: e.target.value })}
            />
            <Input
              label="Carbs (g)"
              type="number"
              placeholder="40"
              value={form.carbs}
              onChange={(e) => setForm({ ...form, carbs: e.target.value })}
            />
            <Input
              label="Fat (g)"
              type="number"
              placeholder="15"
              value={form.fat}
              onChange={(e) => setForm({ ...form, fat: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">
            Save Meal
          </Button>
        </form>
      </Modal>
    </AppLayout>
  );
}
