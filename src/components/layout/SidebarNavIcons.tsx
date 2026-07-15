"use client";

import { cn } from "@/lib/utils";

const ICONS = {
  lightbulb: "/sidebar-icons/lightbulb.svg",
  sparkle: "/sidebar-icons/sparkle.svg",
  aiAssistantsStar: "/sidebar-icons/ai-assistants-star.svg",
  workflows: "/sidebar-icons/workflows.svg",
  dashboards: "/sidebar-icons/dashboards.svg",
  reports: "/sidebar-icons/reports.svg",
  workspace: "/sidebar-icons/workspace.svg",
  collapse: "/sidebar-icons/collapse.svg",
} as const;

export type SidebarNavIconName = keyof typeof ICONS;

export function SidebarNavIcon({
  name,
  size = 24,
  width,
  height,
  className,
}: {
  name: SidebarNavIconName;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}) {
  const w = width ?? size;
  const h = height ?? size;

  return (
    <span
      className={cn("flex shrink-0 items-center justify-center", className)}
      style={{ width: w, height: h }}
    >
      <img src={ICONS[name]} alt="" className="h-full w-full" aria-hidden />
    </span>
  );
}
