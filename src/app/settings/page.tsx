"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { getInitials } from "@/lib/utils";
import { User, Bell, Palette, Save, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { user, updateUser, updatePreferences, deleteAccount } = useAuthContext();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    units: (user?.preferences.units ?? "metric") as "metric" | "imperial",
    theme: (user?.preferences.theme ?? "dark") as "light" | "dark" | "system",
    notifications: user?.preferences.notifications ?? true,
  });

  const handleSave = () => {
    updateUser({ name: form.name, email: form.email });
    updatePreferences({
      units: form.units as "metric" | "imperial",
      theme: form.theme as "light" | "dark" | "system",
      notifications: form.notifications,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = async () => {
    if (!confirm("Delete your account and all fitness data? This cannot be undone.")) {
      return;
    }
    await deleteAccount();
    window.location.href = "/";
  };

  return (
    <AppLayout>
      <Header title="Settings" subtitle="Manage your account and preferences" />

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" />
            Profile
          </h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xl">
              {user ? getInitials(user.name) : "?"}
            </div>
            <div>
              <p className="font-medium text-zinc-200">{user?.name}</p>
              <p className="text-sm text-zinc-500">{user?.email}</p>
              <p className="text-xs text-zinc-600 mt-1">
                Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            Preferences
          </h3>
          <div className="space-y-4">
            <Select
              label="Units"
              options={[
                { value: "metric", label: "Metric (kg, km)" },
                { value: "imperial", label: "Imperial (lbs, mi)" },
              ]}
              value={form.units}
              onChange={(e) =>
                setForm({ ...form, units: e.target.value as "metric" | "imperial" })
              }
            />
            <Select
              label="Theme"
              options={[
                { value: "dark", label: "Dark" },
                { value: "light", label: "Light" },
                { value: "system", label: "System" },
              ]}
              value={form.theme}
              onChange={(e) =>
                setForm({
                  ...form,
                  theme: e.target.value as "light" | "dark" | "system",
                })
              }
            />
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-800/50">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-zinc-400" />
                <div>
                  <p className="font-medium text-zinc-200">Notifications</p>
                  <p className="text-sm text-zinc-500">Get reminders for workouts and goals</p>
                </div>
              </div>
              <button
                onClick={() => setForm({ ...form, notifications: !form.notifications })}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  form.notifications ? "bg-brand-500" : "bg-surface-800"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform ${
                    form.notifications ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
          <Button variant="danger" onClick={handleClearData}>
            <Trash2 className="w-4 h-4" /> Delete Account
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
