"use client";

import { Fragment, useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  CircleMinus,
  CirclePlus,
  MoreVertical,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { dsFinTypo, dsWidgetFilter } from "@/src/lib/designSystem";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";

/** Figma P&L Table (740:41904) — collapsed dashboard, five month columns at 734px content. */
const PL_MONTHS = [
  "June 2024",
  "July 2024",
  "Aug 2024",
  "Sep 2024",
  "Oct 2024",
] as const;

type PlRowKind = "section" | "expandable" | "indent" | "subtotal" | "result";

type PlRow = {
  id: string;
  kind: PlRowKind;
  label: string;
  values?: readonly string[];
  parentId?: string;
};

const PL_ROWS: PlRow[] = [
  { id: "rev", kind: "section", label: "REVENUE" },
  {
    id: "income",
    kind: "expandable",
    label: "Income",
    values: ["208,805.74", "195,262.90", "189,897.45", "193,828.76", "194,576.83"],
  },
  {
    id: "total-revenue",
    kind: "subtotal",
    label: "Total revenue",
    values: ["208,805.74", "195,262.90", "189,897.45", "193,828.76", "194,576.83"],
  },
  { id: "exp", kind: "section", label: "EXPENSES" },
  {
    id: "mgmt",
    kind: "expandable",
    label: "Management fees",
    values: ["-35,111.43", "-35,111.43", "-34,752.13", "-35,612.70", "-35,294.76"],
  },
  {
    id: "taxes",
    kind: "expandable",
    label: "Taxes and insurances",
    values: ["-1,761.98", "-7,059.98", "-6,832.26", "-5,029.49", "-6,832.26"],
  },
  {
    id: "general",
    kind: "expandable",
    label: "General expenses",
    values: ["-8,757.66", "-7,116.59", "-6,611.12", "-7,057.23", "-7,140.77"],
  },
  {
    id: "mortgage",
    kind: "indent",
    label: "Interest mortgage",
    values: ["-44,626.17", "-48,171.03", "-44,626.16", "-44,750.59", "-44,750.59"],
  },
  {
    id: "total-expenses",
    kind: "subtotal",
    label: "Total expenses",
    values: ["-90,257.24", "-97,459.03", "-92,821.67", "-92,450.01", "-94,018.38"],
  },
  {
    id: "result",
    kind: "result",
    label: "RESULT",
    values: ["118,548.50", "97,803.87", "97,075.78", "101,378.75", "100,558.45"],
  },
];

const PL_CHILDREN: Record<string, PlRow[]> = {
  income: [
    {
      id: "rental-income",
      kind: "indent",
      label: "Rental income",
      parentId: "income",
      values: ["175,432.40", "161,778.86", "156,811.05", "160,326.45", "160,780.42"],
    },
  ],
  mgmt: [
    {
      id: "mgmt-detail",
      kind: "indent",
      label: "Property management",
      parentId: "mgmt",
      values: ["-35,111.43", "-35,111.43", "-34,752.13", "-35,612.70", "-35,294.76"],
    },
  ],
  taxes: [
    {
      id: "tax-detail",
      kind: "indent",
      label: "Insurance premium",
      parentId: "taxes",
      values: ["-1,761.98", "-7,059.98", "-6,832.26", "-5,029.49", "-6,832.26"],
    },
  ],
  general: [
    {
      id: "general-detail",
      kind: "indent",
      label: "Utilities & maintenance",
      parentId: "general",
      values: ["-8,757.66", "-7,116.59", "-6,611.12", "-7,057.23", "-7,140.77"],
    },
  ],
};

const PL_GRID =
  "grid grid-cols-[minmax(8.75rem,11.25rem)_repeat(5,minmax(0,1fr))]";

function PlFilterPill({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        dsWidgetFilter,
        "h-8 shrink-0 rounded-[35px] border-[#D1D5D9] bg-[#E6E8EB] text-[#676A6E]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PlExpandToggle({
  expanded,
  label,
  onToggle,
}: {
  expanded: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center p-2"
      aria-expanded={expanded}
      aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
      onClick={onToggle}
    >
      {expanded ? (
        <CircleMinus className="size-4 text-[#676A6E]" strokeWidth={1.75} />
      ) : (
        <CirclePlus className="size-4 text-[#676A6E]" strokeWidth={1.75} />
      )}
    </button>
  );
}

function PlLabelCell({
  row,
  expanded,
  onToggle,
}: {
  row: PlRow;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const rowBorder =
    row.kind !== "result" && row.kind !== "section"
      ? "border-b border-[rgba(230,231,232,0.7)]"
      : undefined;
  if (row.kind === "section") {
    return (
      <div className={cn("flex h-10 items-center bg-[#F0F2F5] px-2", rowBorder)}>
        <span className="typo-l3-r text-[#353638]">{row.label}</span>
      </div>
    );
  }

  const isSubtotal = row.kind === "subtotal";
  const isResult = row.kind === "result";
  const bg = isSubtotal ? "bg-[#F7F9FB]" : isResult ? "bg-[#F0F2F5]" : "bg-[#F0F2F5]";
  const height = isResult ? "h-12" : "min-h-[35px]";

  return (
    <div className={cn("flex items-center px-2 py-2.5", bg, height, rowBorder)}>
      {row.kind === "expandable" ? (
        <>
          <PlExpandToggle
            expanded={Boolean(expanded)}
            label={row.label}
            onToggle={onToggle!}
          />
          <span className="typo-p3-b truncate text-[#353638]">{row.label}</span>
        </>
      ) : (
        <span
          className={cn(
            "truncate text-[#353638]",
            row.kind === "indent" && "pl-8 typo-l3-r",
            isSubtotal && "typo-n-sectiontotal-s",
            isResult && "typo-n-sectiontotal-s text-[#121212]",
            row.kind !== "indent" && !isSubtotal && !isResult && "typo-p3-b",
          )}
        >
          {row.label}
        </span>
      )}
    </div>
  );
}

function PlValueCell({ row, value }: { row: PlRow; value?: string }) {
  const isSubtotal = row.kind === "subtotal";
  const isResult = row.kind === "result";
  const bg = isSubtotal ? "bg-[#F7F9FB]" : "bg-[#F0F2F5]";
  const height = isResult ? "h-12" : "min-h-[35px]";

  return (
    <div
      className={cn(
        "flex items-center justify-end px-2 py-2.5",
        bg,
        height,
        isResult && "border-b border-[#E6E8EB]",
      )}
    >
      {value ? (
        <span
          className={cn(
            "truncate text-right tabular-nums",
            isSubtotal || isResult
              ? "typo-n-sectiontotal-s text-[#353638]"
              : "typo-n-default-s text-[#2C2C2C]",
            isResult && "text-[#121212]",
          )}
        >
          {value}
        </span>
      ) : null}
    </div>
  );
}

export function FinancialPlTable() {
  const expandableIds = useMemo(
    () => PL_ROWS.filter((r) => r.kind === "expandable").map((r) => r.id),
    [],
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const visibleRows = useMemo(() => {
    const out: PlRow[] = [];
    for (const row of PL_ROWS) {
      out.push(row);
      if (row.kind === "expandable" && expanded[row.id]) {
        const children = PL_CHILDREN[row.id];
        if (children) out.push(...children);
      }
    }
    return out;
  }, [expanded]);

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    expandableIds.forEach((id) => {
      next[id] = true;
    });
    setExpanded(next);
  };

  const collapseAll = () => setExpanded({});

  const anyExpanded = expandableIds.some((id) => expanded[id]);

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-[35px] border border-[rgba(230,231,232,0.7)] bg-[rgba(240,242,245,0.8)] p-6">
      {/* Title + filters — Figma 740:41904 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className={cn(dsFinTypo.sectionTitle)}>P&amp;L</h2>
        <div className="flex flex-wrap items-center gap-2">
          <PlFilterPill className="w-[111px]">
            <Select defaultValue="compare">
              <SelectTrigger className="h-full w-full border-0 bg-transparent px-3 shadow-none focus:ring-0">
                <SelectValue placeholder="Compare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compare">Compare</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
              </SelectContent>
            </Select>
          </PlFilterPill>

          <PlFilterPill className="w-[180px] gap-3 px-3">
            <Calendar className="size-[17px] shrink-0 text-[#676A6E]" strokeWidth={1.5} />
            <span className="typo-l3-b flex-1 truncate text-[#65686B]">Dec - May 2025</span>
            <ChevronDown className="size-[17px] shrink-0 text-[#969A9E]" strokeWidth={1.5} />
          </PlFilterPill>

          <PlFilterPill className="min-w-[111px]">
            <Select defaultValue="quarterly">
              <SelectTrigger className="h-full w-full border-0 bg-transparent px-3 shadow-none focus:ring-0">
                <SelectValue placeholder="Quarterly" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </PlFilterPill>

          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#B3B8BD] text-[#676A6E]"
            aria-label="More options"
          >
            <MoreVertical className="size-5" strokeWidth={1.5} />
          </button>

          <WidgetHeaderLamp
            chatTopic="Analyse the P&L table: revenue vs expenses trends, margin drivers, and anomalies across the periods shown."
            chatLabel="P&L table"
          />
        </div>
      </div>

      {/* Expand / collapse — Figma tertiary buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={expandAll}
          className={cn(
            "inline-flex h-[37px] items-center gap-1 rounded-full px-2 py-1 typo-p2-b",
            anyExpanded ? "text-[#969A9E]" : "text-[#070D2F]",
          )}
        >
          <CirclePlus className="size-4" strokeWidth={1.75} />
          Expand all
        </button>
        <span className="h-4 w-px bg-[#E6E8EB]" aria-hidden />
        <button
          type="button"
          onClick={collapseAll}
          className={cn(
            "inline-flex h-[37px] items-center gap-1 rounded-full px-2 py-1 typo-p2-b",
            anyExpanded ? "text-[#070D2F]" : "text-[#969A9E]",
          )}
        >
          <CircleMinus className="size-4" strokeWidth={1.75} />
          Collapse all
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[rgba(230,231,232,0.7)]">
        <div className="min-w-[min(100%,640px)]">
          <div className={PL_GRID}>
            {/* Header */}
            <div className="flex h-12 items-center border-b border-[#F2F4F7] bg-[#FBFBFB] px-2 py-2.5">
              <span className="typo-l3-b truncate text-[#65686B]">P&amp;L Account</span>
            </div>
            {PL_MONTHS.map((month) => (
              <div
                key={month}
                className="flex h-12 items-center justify-end border-b border-[#F2F4F7] bg-[#FBFBFB] px-2 py-2.5"
              >
                <span className="typo-l3-b truncate text-right text-[#65686B]">{month}</span>
              </div>
            ))}

            {/* Body rows */}
            {visibleRows.map((row) => {
              if (row.kind === "section") {
                return (
                  <div key={row.id} className="col-span-6">
                    <PlLabelCell row={row} />
                  </div>
                );
              }

              const rowBorder =
                row.kind !== "result"
                  ? "border-b border-[rgba(230,231,232,0.7)]"
                  : undefined;

              return (
                <Fragment key={row.id}>
                  <div className={rowBorder}>
                    <PlLabelCell
                      row={row}
                      expanded={expanded[row.id]}
                      onToggle={() =>
                        setExpanded((s) => ({ ...s, [row.id]: !s[row.id] }))
                      }
                    />
                  </div>
                  {PL_MONTHS.map((month, i) => (
                    <div key={`${row.id}-${month}`} className={rowBorder}>
                      <PlValueCell row={row} value={row.values?.[i]} />
                    </div>
                  ))}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
