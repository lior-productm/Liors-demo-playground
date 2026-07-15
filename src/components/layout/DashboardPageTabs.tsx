"use client";

import { cn } from "@/lib/utils";

export type DashboardTab = { id: string; label: string };

export function DashboardPageTabs({
  tabs,
  activeId,
  onChange,
  className,
}: {
  tabs: readonly DashboardTab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start border-b border-transparent", className)}>
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex h-12 shrink-0 items-center justify-center px-4 typo-p1-b transition-colors",
              active
                ? "border-b-2 border-[#121212] text-[#2E3033]"
                : "text-[#65686B] hover:text-[#353638]",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
