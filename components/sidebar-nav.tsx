"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Lightbulb,
  ArrowUpRight,
  Target,
  MessageSquare,
  FileSpreadsheet,
} from "lucide-react";

export type Screen =
  | "dashboard"
  | "insights"
  | "forecasts"
  | "opportunities"
  | "generate"
  | "chat";

interface SidebarNavProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  insightCount?: number;
}

const navItems: { id: Screen; label: string; icon: typeof LayoutDashboard }[] =
  [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "insights", label: "Insights", icon: Lightbulb },
    { id: "forecasts", label: "Forecasts", icon: ArrowUpRight },
    { id: "opportunities", label: "Opps", icon: Target },
    { id: "generate", label: "Generate", icon: FileSpreadsheet },
    { id: "chat", label: "AI Chat", icon: MessageSquare },
  ];

export function SidebarNav({
  activeScreen,
  onScreenChange,
  insightCount = 0,
}: SidebarNavProps) {
  return (
    <nav className="flex items-center gap-0.5 border-b border-border bg-card px-1 overflow-x-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onScreenChange(item.id)}
            className={cn(
              "relative flex shrink-0 items-center gap-1 px-2 py-2.5 text-[11px] font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{item.label}</span>
            {item.id === "insights" && insightCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {insightCount}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
