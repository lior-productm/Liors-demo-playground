"use client";

import { Lightbulb } from "lucide-react";
import { Sparkline } from "@/src/components/commercial/Sparkline";
import { TrendPill } from "@/src/components/commercial/TrendPill";
import { cn } from "@/lib/utils";
import { dsMetricCard, DS_CARD_GRADIENT } from "@/src/lib/designSystem";

export function MajorMetricCard({
  label,
  value,
  trend,
  trendPct = "1.5%",
  vsLabel = "vs last period",
  sparkline,
  className,
  onInsight,
}: {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  trendPct?: string;
  vsLabel?: string;
  sparkline?: number[];
  className?: string;
  onInsight?: () => void;
}) {
  return (
    <div
      className={cn("flex flex-col gap-2 ds-card-gradient", dsMetricCard, className)}
      style={{ backgroundImage: DS_CARD_GRADIENT }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 flex-1 typo-l2-b text-[#65686B]">{label}</p>
        <button
          type="button"
          onClick={onInsight}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D1D5D9] transition-colors hover:border-[#233FDE] hover:bg-[#EEF0FF]"
          aria-label={`Insight for ${label}`}
        >
          <Lightbulb className="h-4 w-4 text-[#969A9E]" strokeWidth={1.75} />
        </button>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-col justify-between">
          <p className="typo-h4 text-[#353638]">{value}</p>
          {trend ? (
            <div className="mt-2 flex items-center gap-2">
              <TrendPill direction={trend} pct={trendPct} />
              <span className="typo-l3-r text-[#7E8185]">{vsLabel}</span>
            </div>
          ) : null}
        </div>
        {sparkline ? (
          <Sparkline values={sparkline} className="h-[42px] w-[51px] shrink-0" />
        ) : null}
      </div>
    </div>
  );
}
