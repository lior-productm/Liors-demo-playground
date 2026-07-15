"use client";

import { AlertTriangle, Database, FileText, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DATA_SOURCE_LABELS,
  type ReportDataSourceType,
  type SectionGenerationSummary,
} from "@/src/lib/reportSectionBuilder";

const SOURCE_ICON: Record<
  ReportDataSourceType,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  snowflake: Database,
  web: Globe,
  file: FileText,
};

const CONFIDENCE_STYLE: Record<SectionGenerationSummary["confidence"], string> = {
  high: "bg-[#E7F4EC] text-[#1F7A45]",
  medium: "bg-[#FBF2DC] text-[#856404]",
  low: "bg-[#FBE9E7] text-[#B23A2F]",
};

export function SectionReviewSummary({ summary }: { summary: SectionGenerationSummary }) {
  const SourceIcon = SOURCE_ICON[summary.dataSource.type];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#E6E8EB] bg-[#FAFBFC] p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-[14px] font-semibold leading-[1.25] text-[#05091F]">
          Deep Agent summary
        </h4>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium capitalize leading-4",
            CONFIDENCE_STYLE[summary.confidence],
          )}
        >
          {summary.confidence} confidence
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#65686B]">
          Data source
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E6E8EB] bg-white px-2.5 py-1 text-[12px] font-medium text-[#353638]">
            <SourceIcon className="size-3.5 text-[#65686B]" strokeWidth={1.75} />
            {DATA_SOURCE_LABELS[summary.dataSource.type]}
          </span>
          <span className="truncate text-[12px] leading-[1.5] text-[#65686B]">
            {summary.dataSource.detail}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#65686B]">
          Calculation logic
        </p>
        <p className="text-[12px] leading-[1.5] text-[#353638]">{summary.calculationLogic}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#65686B]">
          Assumptions
        </p>
        <ul className="flex flex-col gap-1.5">
          {summary.assumptions.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-[12px] leading-[1.5] text-[#353638]"
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#65686B]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#65686B]">
          Missing data
        </p>
        {summary.missingData.length === 0 ? (
          <p className="text-[12px] leading-[1.5] text-[#1F7A45]">
            No gaps detected for the selected data points.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {summary.missingData.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-[12px] leading-[1.5] text-[#B23A2F]"
              >
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
