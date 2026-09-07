"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon: LucideIcon;
  color?: string;
  progress?: number;
}

export function StatCard({
  label,
  value,
  unit,
  change,
  icon: Icon,
  color = "text-brand-400",
  progress,
}: StatCardProps) {
  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl bg-surface-800", color)}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              change >= 0
                ? "text-brand-400 bg-brand-500/10"
                : "text-red-400 bg-red-500/10"
            )}
          >
            {change >= 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-400 mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-zinc-50">{value}</span>
        {unit && <span className="text-sm text-zinc-500">{unit}</span>}
      </div>
      {progress !== undefined && (
        <div className="mt-3 h-1.5 bg-surface-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
