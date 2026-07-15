"use client";

import type { ReactNode } from "react";
import { AlertTriangle, ArrowUpRight, Lightbulb } from "lucide-react";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { amiioCardHoverSurface, cn } from "@/lib/utils";

export type OverviewKeyTrend = {
  tone: "positive" | "warning";
  content: ReactNode;
};

function OverviewKeyTrendsList({ trends }: { trends: OverviewKeyTrend[] }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <p className="text-[12px] leading-[1.24] text-[#65686B]">Key trends</p>
      {trends.map((trend, index) => (
        <div
          key={index}
          className="flex items-center gap-1.5 text-[14px] leading-[1.24] text-[#2C2C2C]"
        >
          {trend.tone === "warning" ? (
            <AlertTriangle className="size-5 shrink-0 text-[#E7B65A]" strokeWidth={1.75} />
          ) : (
            <ArrowUpRight className="size-5 shrink-0 text-[#1F9E8B]" strokeWidth={1.75} />
          )}
          <p>{trend.content}</p>
        </div>
      ))}
    </div>
  );
}

export function OverviewAiSummaryCard({
  title,
  chatTopic,
  chatLabel,
  summary,
  trends,
  className,
}: {
  title: string;
  chatTopic: string;
  chatLabel: string;
  summary: ReactNode;
  trends: OverviewKeyTrend[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] px-6 py-5",
        amiioCardHoverSurface,
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#010309] text-white">
                <Lightbulb className="h-3.5 w-3.5" />
              </div>
            </AmiioAiDisclaimerTrigger>
            <h3 className="text-[18px] font-medium leading-[1.25] text-[#2C2C2C]">{title}</h3>
          </div>
          <WidgetHeaderLamp chatTopic={chatTopic} chatLabel={chatLabel} />
        </div>

        <div className="flex flex-col items-start gap-5 xl:flex-row xl:gap-6">
          <div className="min-w-0 flex-1">
            <div className="text-[14px] leading-[1.4] text-[#2C2C2C]">{summary}</div>
            <div className="mt-4 xl:hidden">
              <OverviewKeyTrendsList trends={trends} />
            </div>
            <button type="button" className="mt-3 text-[14px] font-medium text-[#070D2F]">
              Read more
            </button>
          </div>

          <div className="hidden w-full shrink-0 xl:block xl:w-[393px]">
            <OverviewKeyTrendsList trends={trends} />
          </div>
        </div>
      </div>
    </div>
  );
}
