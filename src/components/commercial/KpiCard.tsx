"use client";

import { TrendPill } from "@/src/components/commercial/TrendPill";
import { Sparkline } from "@/src/components/commercial/Sparkline";
import type { KpiMetric } from "@/src/types/commercial";
import { Lightbulb } from "lucide-react";

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const trend = metric.trend;
  const isUp = trend === "up";
  const isDown = trend === "down";

  return (
    <div
      className="flex flex-col gap-2 rounded-2xl border border-[#E6E8EB] p-5"
      style={{
        backgroundImage:
          "linear-gradient(-88deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.9) 100%)",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 flex-1 text-[14px] font-medium leading-[1.24] text-[#65686B]">
          {metric.label}
        </p>
        <button
          type="button"
          className="flex size-5 shrink-0 items-center justify-center rounded-full border border-[#D1D5D9]"
          aria-label={`Insight for ${metric.label}`}
        >
          <Lightbulb className="size-[15px] text-[#676A6E]" strokeWidth={1.75} />
        </button>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <p className="text-[20px] font-medium leading-[1.25] text-[#353638]">
            {metric.value}
          </p>
          {(isUp || isDown) && (
            <div className="mt-2 flex items-center gap-2">
              <TrendPill direction={isUp ? "up" : "down"} pct="1.5%" />
              <span className="text-[12px] font-normal leading-[1.24] text-[#7E8185]">
                {metric.sub ?? "vs last period"}
              </span>
            </div>
          )}
        </div>
        <Sparkline
          values={[12, 18, 14, 22, 19, 24, 21]}
          className="h-[42px] w-[51px] shrink-0"
        />
      </div>
    </div>
  );
}
