"use client";

import { cn } from "@/lib/utils";

/** Sticky bottom dock — stays inside the main chat scroll column (not under the sidebar). */
export function WorkflowChatDock({
  children,
  maxWidth,
  className,
}: {
  children: React.ReactNode;
  maxWidth?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("sticky bottom-0 z-40 mx-auto w-full shrink-0 px-6 pb-6 pt-4", className)}
      style={{
        maxWidth,
        background: "linear-gradient(180deg, transparent 0%, #F7F8FA 45%)",
      }}
    >
      {children}
    </div>
  );
}
