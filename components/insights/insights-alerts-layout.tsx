"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  ArrowLeft,
  Bell,
  ChevronDown,
  ChevronRight,
  Copy,
  Folder,
  Home,
  Mail,
  Search,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type InsightsAlertsLayoutProps = {
  className?: string;
  tableContainerClassName?: string;
  tableInnerClassName?: string;
  /** Row / analysis actions (e.g. open chat). */
  onOpenAnalysis?: () => void;
  onHighlightRows?: (rows: number[]) => void;
  onHighlightAnomalies?: (cells: { row: number; col: number }[]) => void;
};

type StatusTab = "active" | "snoozed" | "archived";

type InsightRow = {
  id: string;
  summary: string;
  entity: string;
  showDot: boolean;
  analysisVariant: "view" | "further";
  highlightRow: number;
  anomalyCells: { row: number; col: number }[];
};

const INSIGHT_ROWS: InsightRow[] = [
  {
    id: "1",
    summary: "Imminent Lease Expiry Risk with Potential Loan Covenant Breach",
    entity: "Come Together",
    showDot: false,
    analysisVariant: "view",
    highlightRow: 0,
    anomalyCells: [
      { row: 0, col: 3 },
      { row: 0, col: 5 },
    ],
  },
  {
    id: "2",
    summary: "Service Charge Recovery Gap increasing in (2025)",
    entity: "Come Together",
    showDot: true,
    analysisVariant: "further",
    highlightRow: 1,
    anomalyCells: [{ row: 1, col: 5 }],
  },
  {
    id: "3",
    summary: "Valuation Report Deadline Approaching — 13 Days Remaining",
    entity: "ABC Holdings",
    showDot: true,
    analysisVariant: "further",
    highlightRow: 2,
    anomalyCells: [{ row: 2, col: 7 }],
  },
  {
    id: "4",
    summary: "Five Consecutive Months of Opex Increases",
    entity: "ABC Holdings",
    showDot: true,
    analysisVariant: "further",
    highlightRow: 3,
    anomalyCells: [{ row: 3, col: 5 }],
  },
  {
    id: "5",
    summary: "Multiple Rental Income Decreases Flagged",
    entity: "Various",
    showDot: true,
    analysisVariant: "further",
    highlightRow: 4,
    anomalyCells: [
      { row: 4, col: 3 },
      { row: 4, col: 6 },
    ],
  },
  {
    id: "6",
    summary: "Prolonged Vacancy Risk — 34% of Asset Unlet",
    entity: "ABC Holdings",
    showDot: true,
    analysisVariant: "further",
    highlightRow: 5,
    anomalyCells: [{ row: 5, col: 6 }],
  },
];

function SortHeader({ label }: { label: string }) {
  return (
    <div className="flex h-7 items-center gap-1">
      <span className="text-[14px] font-medium leading-[1.24] text-[#676A6E]">{label}</span>
      <svg className="size-4 shrink-0 text-[#676A6E]" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M4 5.5L8 2l4 3.5M4 10.5L8 14l4-3.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const noop = () => {};

export function InsightsAlertsLayout({
  className,
  tableContainerClassName = "min-w-0 flex-1 overflow-x-auto rounded-xl",
  tableInnerClassName = "min-w-[640px] space-y-2 lg:min-w-[720px]",
  onOpenAnalysis,
  onHighlightRows = noop,
  onHighlightAnomalies = noop,
}: InsightsAlertsLayoutProps) {
  const [statusTab, setStatusTab] = useState<StatusTab>("active");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return INSIGHT_ROWS;
    return INSIGHT_ROWS.filter(
      (r) =>
        r.summary.toLowerCase().includes(q) ||
        r.entity.toLowerCase().includes(q),
    );
  }, [search]);

  const handleRowHover = (row: InsightRow | null) => {
    if (row) {
      onHighlightRows([row.highlightRow]);
      onHighlightAnomalies(row.anomalyCells);
    } else {
      onHighlightRows([]);
      onHighlightAnomalies([]);
    }
  };

  const openAnalysis = () => {
    onOpenAnalysis?.();
  };

  return (
    <div className={cn("flex min-h-0 flex-col gap-4 p-3 sm:p-4", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-[24px] font-medium leading-[1.25] tracking-tight text-[#121314]">
          Insights &amp; Alerts
        </h1>
        <div className="relative flex flex-wrap items-center gap-2 rounded-[32px] border border-white/30 bg-white/80 p-2 shadow-[0px_6px_20px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.04] backdrop-blur-sm">
          <button
            type="button"
            className="flex h-10 min-w-[160px] shrink-0 items-center justify-between gap-2 rounded-[32px] border border-[#39393A] bg-[#F3F6FA] px-3 py-2 text-left"
          >
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <Folder className="size-4 shrink-0 text-[#39393A]" aria-hidden />
              <span className="truncate text-[16px] font-medium leading-[1.5] text-[#39393A]">
                Z holdings
              </span>
            </span>
            <ChevronDown className="size-5 shrink-0 text-[#39393A]" aria-hidden />
          </button>
          <button
            type="button"
            className="flex h-10 min-w-[180px] shrink-0 items-center justify-between gap-2 rounded-[32px] border border-[#E6E8EB] bg-white px-3 py-2 text-left"
          >
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <Home className="size-4 shrink-0 text-[#7E8185]" aria-hidden />
              <span className="truncate text-[16px] font-normal leading-[1.5] text-[#7E8185]">
                Select property
              </span>
            </span>
            <ChevronDown className="size-5 shrink-0 text-[#7E8185]" aria-hidden />
          </button>
          <button
            type="button"
            className="px-2 py-1 text-[14px] font-medium leading-[1.5] text-[#4E4F52]"
          >
            Clear
          </button>
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#4E4F52] hover:bg-[#F2F4F7]"
            aria-label="Settings"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex rounded-[24px] border border-[#E6E8EB] bg-white p-0.5 shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
            {(
              [
                { id: "active" as const, label: "Active" },
                { id: "snoozed" as const, label: "Snoozed" },
                { id: "archived" as const, label: "Archived" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setStatusTab(t.id)}
                className={cn(
                  "min-w-[83px] rounded-[24px] px-3 py-1.5 text-[14px] font-medium leading-[1.24] transition-colors",
                  statusTab === t.id
                    ? "bg-[#111] text-white shadow-[0px_2px_6px_rgba(0,0,0,0.16)]"
                    : "text-[#4E4F52]",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <label className="flex h-8 min-w-[180px] max-w-[209px] flex-1 items-center gap-2 rounded-full border border-[#D1D5D9] bg-white px-2 py-1.5 sm:flex-initial">
            <Search className="size-4 shrink-0 text-[#969A9E]" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.24] text-[#353638] placeholder:text-[#969A9E] outline-none"
            />
          </label>
        </div>
        <button
          type="button"
          className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg border border-[#E6E8EB] bg-white px-3 text-[14px] font-medium leading-[1.24] text-[#4E4F52] shadow-[0px_4px_16px_rgba(0,0,0,0.08)]"
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filters
        </button>
      </div>

      <div className={tableContainerClassName}>
        <div className={tableInnerClassName}>
          <div className="flex h-10 items-stretch rounded-xl border border-[#E6E8EB] bg-[#F2F4F7]">
            <div className="flex min-w-0 flex-[1.4] items-center pl-8 pr-2">
              <span className="truncate text-[14px] font-medium leading-[1.24] text-[#676A6E]">
                Summary
              </span>
            </div>
            <div className="flex w-[120px] shrink-0 items-center px-2 sm:w-[146px]">
              <SortHeader label="Entity" />
            </div>
            <div className="flex w-[100px] shrink-0 items-center px-2 sm:w-[112px]">
              <SortHeader label="Type" />
            </div>
            <div className="flex w-[100px] shrink-0 items-center px-2 sm:w-[112px]">
              <SortHeader label="Triggered" />
            </div>
            <div className="flex w-[140px] shrink-0 items-center pl-6 pr-2">
              <span className="truncate text-[14px] font-medium leading-[1.24] text-[#676A6E]">
                Actions
              </span>
            </div>
            <div className="flex w-[108px] shrink-0 items-center pl-6 pr-2">
              <span className="truncate text-[14px] font-medium leading-[1.24] text-[#676A6E]">
                Analysis
              </span>
            </div>
            <div className="w-10 shrink-0" aria-hidden />
          </div>

          <div className="flex flex-col gap-2">
            {filteredRows.map((row) => (
              <div
                key={row.id}
                role="button"
                tabIndex={0}
                onMouseEnter={() => handleRowHover(row)}
                onMouseLeave={() => handleRowHover(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openAnalysis();
                  }
                }}
                className="flex min-h-[72px] cursor-pointer items-stretch rounded-xl bg-[#FBFBFB] transition-shadow hover:shadow-[0px_2px_12px_rgba(0,0,0,0.06)]"
              >
                <div className="flex min-w-0 flex-[1.4] items-center gap-2 p-2 pl-2 sm:pl-2">
                  <div className="flex size-4 shrink-0 items-center justify-center">
                    {row.showDot ? (
                      <span className="size-2 rounded-full bg-[#233FDE]" aria-hidden />
                    ) : null}
                  </div>
                  <p className="min-w-0 flex-1 text-[14px] font-normal leading-[1.4] text-[#353638]">
                    {row.summary}
                  </p>
                </div>
                <div className="flex w-[120px] shrink-0 items-center p-2 sm:w-[146px]">
                  <p className="text-[14px] font-medium leading-[1.5] text-[#676A6E]">{row.entity}</p>
                </div>
                <div className="flex w-[100px] shrink-0 items-center p-2 sm:w-[112px]">
                  <span className="rounded-2xl bg-[#EBEDF9] px-2 py-1 text-[12px] font-medium leading-[1.25] text-[#303552]">
                    Commercial
                  </span>
                </div>
                <div className="flex w-[100px] shrink-0 items-center p-2 sm:w-[112px]">
                  <p className="whitespace-nowrap text-[12px] font-medium leading-5 text-[#7E8185]">
                    2 hours ago
                  </p>
                </div>
                <div className="flex w-[140px] shrink-0 items-center p-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center rounded-lg text-[#4E4F52] hover:bg-[#F2F4F7]"
                      aria-label="Copy"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Copy className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center rounded-lg text-[#4E4F52] hover:bg-[#F2F4F7]"
                      aria-label="Snooze"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Bell className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center rounded-lg text-[#4E4F52] hover:bg-[#F2F4F7]"
                      aria-label="Archive"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Archive className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center rounded-lg text-[#4E4F52] hover:bg-[#F2F4F7]"
                      aria-label="Email"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="flex w-[108px] shrink-0 items-center p-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAnalysis();
                    }}
                    className={cn(
                      "h-6 rounded-lg border border-[#B3B8BD] px-1.5 text-[12px] font-medium leading-[1.25] transition-colors hover:bg-[#F2F4F7]",
                      row.analysisVariant === "view" ? "text-[#676A6E]" : "text-[#111]",
                    )}
                  >
                    {row.analysisVariant === "view" ? "View analysis" : "Analyse further"}
                  </button>
                </div>
                <div className="flex w-10 shrink-0 items-center justify-end pr-2">
                  <ChevronRight className="size-5 text-[#353638]" aria-hidden />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[14px] font-medium",
              page <= 1 ? "cursor-not-allowed text-[#969A9E]" : "text-[#676A6E] hover:text-[#353638]",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage(1)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-[14px] leading-[1.24]",
              page === 1 ? "bg-[#39393A] text-white" : "text-[#676A6E]",
            )}
          >
            1
          </button>
          {[2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-[14px] leading-[1.24]",
                page === n ? "bg-[#39393A] text-white" : "text-[#676A6E]",
              )}
            >
              {n}
            </button>
          ))}
          <span className="flex h-8 items-center px-4 text-[14px] text-[#676A6E]">...</span>
          {[97, 98].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-[14px] leading-[1.24]",
                page === n ? "bg-[#39393A] text-white" : "text-[#676A6E]",
              )}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(98, p + 1))}
            className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[14px] font-medium text-[#676A6E] hover:text-[#353638]"
          >
            Next
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
