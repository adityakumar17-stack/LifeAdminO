"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User, UserGoals, UserPreferences } from "@/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { profileToUser } from "@/lib/supabase/mappers";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateGoals: (goals: Partial<UserGoals>) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setUser(data ? profileToUser(data) : null);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) await loadProfile(data.user.id);
      else setUser(null);
      setIsLoading(false);
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) void loadProfile(session.user.id);
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env, then restart npm run dev.";
    }
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return error.message;
    if (data.user && !data.session) {
      return "Check your email to confirm the account, or disable email confirmation in Supabase Auth settings.";
    }
    if (data.user) await loadProfile(data.user.id);
    return null;
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return "Supabase is not configured. Add your project URL and anon key to .env.";
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    return null;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const patchProfile = useCallback(
    async (fields: Record<string, unknown>) => {
      if (!user) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", user.id)
        .select("*")
        .single();
      if (!error && data) setUser(profileToUser(data));
    },
    [user]
  );

  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      await patchProfile({
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.email ? { email: updates.email } : {}),
      });
    },
    [patchProfile]
  );

  const updateGoals = useCallback(
    async (goals: Partial<UserGoals>) => {
      await patchProfile({
        ...(goals.dailySteps !== undefined ? { daily_steps: goals.dailySteps } : {}),
        ...(goals.dailyCalories !== undefined ? { daily_calories: goals.dailyCalories } : {}),
        ...(goals.weeklyWorkouts !== undefined ? { weekly_workouts: goals.weeklyWorkouts } : {}),
        ...(goals.waterIntake !== undefined ? { water_intake: goals.waterIntake } : {}),
        ...(goals.targetWeight !== undefined ? { target_weight: goals.targetWeight } : {}),
      });
    },
    [patchProfile]
  );

  const updatePreferences = useCallback(
    async (prefs: Partial<UserPreferences>) => {
      await patchProfile({
        ...(prefs.units ? { units: prefs.units } : {}),
        ...(prefs.theme ? { theme: prefs.theme } : {}),
        ...(prefs.notifications !== undefined ? { notifications: prefs.notifications } : {}),
      });
    },
    [patchProfile]
  );

  const deleteAccount = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    await supabase.from("profiles").delete().eq("id", user.id);
    await supabase.auth.signOut();
    setUser(null);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signOut,
        updateUser,
        updateGoals,
        updatePreferences,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
