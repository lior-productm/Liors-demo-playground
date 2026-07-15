"use client";

import { cn } from "@/lib/utils";
import type { AiAssistantTabId } from "@/src/lib/aiAssistantsData";

const TABS: { id: AiAssistantTabId; label: string }[] = [
  { id: "recent-chats", label: "Recent chats" },
  { id: "tasks", label: "Tasks" },
  { id: "sources", label: "Sources" },
];

export function AiAssistantTabNav({
  activeTab,
  onTabChange,
  trailing,
  centered = false,
}: {
  activeTab: AiAssistantTabId;
  onTabChange: (tab: AiAssistantTabId) => void;
  trailing?: React.ReactNode;
  /** Figma 1453:65526 — tabs centered without trailing actions */
  centered?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 sm:flex-row sm:items-center",
        centered ? "sm:justify-center" : "sm:justify-between",
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-4",
          !centered && "sm:flex-1",
          centered && "max-w-[680px]",
        )}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isSources = tab.id === "sources";
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex h-10 items-center justify-center rounded-[24px] px-4 text-sm font-medium leading-[1.24] transition-colors",
                isActive
                  ? "bg-[#E6E8EB] text-[#353638]"
                  : cn(
                      isSources ? "text-[#2C2C2C]" : "text-[#353638]",
                      "hover:bg-[#F0F2F5]/80",
                    ),
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {trailing}
    </div>
  );
}
