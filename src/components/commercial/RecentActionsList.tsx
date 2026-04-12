"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";
import type { RecentAction } from "@/src/types/commercial";
import { cn } from "@/lib/utils";

const statusIcon = (status: RecentAction["status"]) => {
  switch (status) {
    case "Ready":
      return <CheckCircle2 className="h-4 w-4 text-accent" />;
    case "Completed":
      return <CheckCircle2 className="h-4 w-4 text-chart-2" />;
    case "In Progress":
      return <PlayCircle className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const accentToStyles = (accent: RecentAction["accent"]) => {
  switch (accent) {
    case "primary":
      return "bg-primary/10 text-primary border-primary/20";
    case "accent":
      return "bg-accent/10 text-accent border-accent/20";
    case "chart-2":
      return "bg-chart-2/10 text-chart-2 border-chart-2/20";
    case "chart-3":
      return "bg-chart-3/10 text-chart-3 border-chart-3/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};

export function RecentActionsList({
  actions,
}: {
  actions: RecentAction[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(actions[0]?.id ?? null);

  const items = useMemo(() => actions, [actions]);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-foreground">Recent actions</div>
          <div className="text-[11px] font-semibold text-muted-foreground mt-0.5">
            Tracks exports, notes, and portfolio updates
          </div>
        </div>
        <div className="rounded-full bg-background px-3 py-1 text-[10px] font-bold text-muted-foreground border border-border">
          {items.length} updates
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {items.map((a) => {
          const expanded = expandedId === a.id;
          return (
            <button
              key={a.id}
              type="button"
              className={cn(
                "text-left rounded-lg border border-border bg-background p-3 transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring",
                expanded ? "bg-secondary" : "",
              )}
              onClick={() => setExpandedId((prev) => (prev === a.id ? null : a.id))}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border">
                    {statusIcon(a.status)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">
                      {a.title}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold",
                          accentToStyles(a.accent),
                        )}
                      >
                        {a.assetType}
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {a.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
                  {a.status}
                </div>
              </div>

              {expanded && (
                <div className="mt-2 rounded-md border border-border bg-card px-3 py-2">
                  <div className="text-[11px] font-semibold text-muted-foreground">
                    Details
                  </div>
                  <div className="mt-1 text-[12px] font-bold text-foreground">
                    {a.detail}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

