"use client";

import { useMemo, useState } from "react";
import { Calculator, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ReportPlTable,
  type ReportPlEditableField,
} from "@/src/components/reporting/ReportPlTable";
import type { ReportPlRow } from "@/src/lib/reportingMockData";
import {
  isPlForecastInputCell,
  recomputePlForecast,
  type ForecastExplanation,
} from "@/src/lib/plForecastModel";

export function PlForecastReviewEditor({
  title,
  rows,
  onRowsChange,
  editable = true,
}: {
  title: string;
  rows: ReportPlRow[];
  onRowsChange?: (rows: ReportPlRow[]) => void;
  editable?: boolean;
}) {
  const [lastEditedAccount, setLastEditedAccount] = useState<string | null>(null);

  const explanations = useMemo(
    () => recomputePlForecast(rows).explanations,
    [rows],
  );

  const handleCellDraft = (
    rowIndex: number,
    field: ReportPlEditableField,
    value: string,
  ) => {
    if (!editable || !isPlForecastInputCell(rows[rowIndex], field)) return;
    const draft = rows.map((row, index) =>
      index === rowIndex ? { ...row, [field]: value } : row,
    );
    const next = recomputePlForecast(draft, { index: rowIndex, field });
    setLastEditedAccount(rows[rowIndex].account || rows[rowIndex].category || null);
    onRowsChange?.(next.rows);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-[16px] font-medium leading-[1.25] text-[#05091F]">
          {title}
        </h3>
        <p className="text-[12px] leading-[1.5] text-[#65686B]">
          {editable
            ? "Edit budget or FY forecast on input lines. Totals, NOI, profit, cash flow and variances recalculate live."
            : "Totals, NOI, profit, cash flow and variances are calculated from the forecast figures below."}
        </p>
      </div>

      <ReportPlTable
        rows={rows}
        editable={editable}
        live={editable}
        isCellEditable={(rowIndex, field, row) => isPlForecastInputCell(row, field)}
        onCellDraft={handleCellDraft}
      />

      <div className="flex flex-col gap-3 rounded-xl border border-[#A7B2F2] bg-[#F7F8FF] p-4">
        <div className="flex items-center gap-1.5">
          <Calculator className="size-4 text-[#4C61DB]" strokeWidth={1.75} />
          <p className="text-[12px] font-semibold leading-[1.25] text-[#05091F]">
            Live calculations
          </p>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#4C61DB]">
            <Sparkles className="size-3" strokeWidth={2} />
            Updates as you type
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {explanations.map((item) => (
            <ExplanationCard
              key={item.id}
              item={item}
              highlighted={
                !!lastEditedAccount && item.drivenBy.includes(lastEditedAccount)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExplanationCard({
  item,
  highlighted,
}: {
  item: ForecastExplanation;
  highlighted: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white px-3 py-2.5",
        highlighted ? "border-[#4C61DB] ring-1 ring-[#A7B2F2]" : "border-[#E4E7F5]",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[12px] font-semibold leading-[1.25] text-[#05091F]">
          {item.title}
        </p>
        {item.id !== "variance" ? (
          <p className="shrink-0 text-[12px] font-medium tabular-nums text-[#4C61DB]">
            {item.result}
          </p>
        ) : null}
      </div>
      <p className="mt-1 text-[11px] leading-[1.5] text-[#65686B]">{item.formula}</p>
    </div>
  );
}
