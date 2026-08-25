"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ALL_REPORTS_LIST } from "@/src/lib/reportingMockData";
import {
  DISTRIBUTION_LABELS,
  DISTRIBUTION_PILL_STYLES,
  readAllDistributionStatuses,
} from "@/src/lib/reportDistribution";
import { listTemplateTitles } from "@/src/lib/reportTemplates";

const LEGACY_STATUS_STYLES: Record<string, string> = {
  "In Review": "bg-[#EEF0FF] text-[#1B32B3]",
  Completed: "bg-[#E8F5E9] text-[#2E7D32]",
  Draft: "bg-[#F3F4F6] text-[#6B7280]",
};

type Row = {
  title: string;
  statusLabel: string;
  pillClass: string;
  updated: string;
};

export function ReportsAllList() {
  const [rows, setRows] = useState<Row[]>(() =>
    ALL_REPORTS_LIST.map((report) => ({
      title: report.title,
      statusLabel: report.status,
      pillClass: LEGACY_STATUS_STYLES[report.status] ?? LEGACY_STATUS_STYLES.Draft,
      updated: report.updated,
    })),
  );

  useEffect(() => {
    const statuses = readAllDistributionStatuses();
    const liveTitles = listTemplateTitles();

    // Live templates (from the Template Studio) show their distribution status.
    const liveRows: Row[] = liveTitles.map((title) => {
      const status = statuses[title] ?? "draft";
      return {
        title,
        statusLabel: DISTRIBUTION_LABELS[status],
        pillClass: DISTRIBUTION_PILL_STYLES[status],
        updated: "Updated in Template Studio",
      };
    });

    // Keep any legacy list entries that aren't already represented above.
    const legacyRows: Row[] = ALL_REPORTS_LIST.filter(
      (report) => !liveTitles.includes(report.title),
    ).map((report) => ({
      title: report.title,
      statusLabel: report.status,
      pillClass: LEGACY_STATUS_STYLES[report.status] ?? LEGACY_STATUS_STYLES.Draft,
      updated: report.updated,
    }));

    setRows([...liveRows, ...legacyRows]);
  }, []);

  return (
    <div className="rounded-xl border border-[#E8EAED] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-[#E8EAED] px-6 py-3 text-[12px] font-medium uppercase tracking-wide text-[#6B7280]">
        <span>Report</span>
        <span>Status</span>
        <span>Updated</span>
      </div>
      <ul>
        {rows.map((report) => (
          <li
            key={report.title}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#E8EAED] px-6 py-4 last:border-b-0"
          >
            <span className="text-[14px] font-medium leading-[1.24] text-[#111]">
              {report.title}
            </span>
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium leading-4",
                report.pillClass,
              )}
            >
              {report.statusLabel}
            </span>
            <span className="text-[14px] leading-[1.24] text-[#6B7280]">
              {report.updated}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
