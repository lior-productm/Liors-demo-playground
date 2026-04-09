"use client";

import { TrendPill } from "@/src/components/commercial/TrendPill";
import type { KpiMetric } from "@/src/types/commercial";

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const trend = metric.trend;
  const isUp = trend === "up";
  const isDown = trend === "down";
  const isFlat = trend === "flat";

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
            {metric.label}
          </div>
          <div className="mt-1 text-xl font-bold text-foreground">
            {metric.value}
          </div>
        </div>
        {isUp || isDown ? (
          <TrendPill direction={isUp ? "up" : "down"} />
        ) : isFlat ? (
          <TrendPill direction="neutral" pct="—" />
        ) : null}
      </div>
      {metric.sub && (
        <div className="mt-1 text-[10px] font-semibold text-muted-foreground">
          {metric.sub}
        </div>
      )}
    </div>
  );
}

