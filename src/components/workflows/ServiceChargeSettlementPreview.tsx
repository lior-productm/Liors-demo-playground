"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialChartInsightLamp } from "@/src/components/commercial/FinancialChartInsightLamp";
import {
  computeSettlement,
  formatEuro,
  SERVICE_CHARGE_ASSUMPTIONS,
  SERVICE_CHARGE_EXCLUSIONS,
  SERVICE_CHARGE_PROPERTY,
  SERVICE_CHARGE_YEAR,
  type SettlementLineItem,
} from "@/src/lib/serviceChargeSettlementData";

function LineRow({
  item,
  onAnalyseFurther,
}: {
  item: SettlementLineItem;
  onAnalyseFurther?: (topic: string) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-[#F8FAFC]">
      <div className="min-w-0">
        <p className="truncate text-[14px] font-medium leading-[1.4] text-[#353638]">
          {item.category}
        </p>
        {item.note ? (
          <span className="mt-1 inline-flex rounded-full bg-[#FBF2DC] px-2 py-0.5 text-[11px] font-medium leading-[1.3] text-[#856404]">
            {item.note}
          </span>
        ) : null}
      </div>
      <p className="min-w-0 truncate text-[13px] font-normal leading-[1.4] text-[#65686B]">
        {item.basis}
      </p>
      <div className="flex items-center justify-end gap-2">
        <span className="text-[14px] font-medium leading-[1.4] text-[#010309]">
          {formatEuro(item.grossAmount)}
        </span>
        <FinancialChartInsightLamp
          summary={item.summary}
          analyseTopic={item.analysePrompt}
          ariaLabel={`Analyse ${item.category}`}
          popoverSide="left"
          className="size-[26px]"
        />
      </div>
    </div>
  );
}

/** Interactive settlement preview — recalculates from confirmed assumptions + adjustments. */
export function ServiceChargeSettlementPreview({
  answers,
  overrides = {},
  onAnalyseFurther,
  onExport,
}: {
  answers: Record<string, string>;
  /** Per-line gross overrides applied by chat/row adjustments. */
  overrides?: Record<string, number>;
  onAnalyseFurther?: (topic: string) => void;
  onExport?: (kind: "xlsx" | "pdf") => void;
}) {
  const settlement = computeSettlement(answers, overrides);
  const vatPct = Math.round(settlement.vatRate * 100);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[rgba(230,231,232,0.7)] bg-white shadow-[inset_0_1px_4px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#E6E8EB] bg-[#FAFBFC] px-4 py-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="size-4 shrink-0 text-[#233FDE]" strokeWidth={1.8} aria-hidden />
          <p className="text-[14px] font-medium leading-[1.3] text-[#010309]">
            {SERVICE_CHARGE_YEAR} Service Charge Settlement — {SERVICE_CHARGE_PROPERTY}
          </p>
        </div>
        <span className="rounded-full bg-[#EBEDF9] px-2 py-0.5 text-[11px] font-medium text-[#233FDE]">
          Preview
        </span>
      </div>

      {/* Line items table */}
      <div className="flex flex-col divide-y divide-[#F0F2F5]">
        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_auto] items-center gap-3 px-4 py-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-[#969A9E]">
            Cost category
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-[#969A9E]">
            Allocation basis
          </span>
          <span className="text-right text-[11px] font-medium uppercase tracking-wide text-[#969A9E]">
            Recoverable
          </span>
        </div>

        {settlement.baseLines.map((item) => (
          <LineRow key={item.id} item={item} onAnalyseFurther={onAnalyseFurther} />
        ))}

        {/* Recoverable subtotal */}
        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_auto] items-center gap-3 bg-[#FBFCFD] px-4 py-2.5">
          <p className="text-[13px] font-medium leading-[1.4] text-[#65686B]">Recoverable subtotal</p>
          <span />
          <span className="text-right text-[14px] font-medium leading-[1.4] text-[#353638]">
            {formatEuro(settlement.recoverableSubtotal)}
          </span>
        </div>

        {/* Management fee (derived) */}
        <LineRow item={settlement.managementFee} onAnalyseFurther={onAnalyseFurther} />

        {/* Net total */}
        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_auto] items-center gap-3 bg-[#FBFCFD] px-4 py-2.5">
          <p className="text-[13px] font-medium leading-[1.4] text-[#65686B]">Net total</p>
          <span />
          <span className="text-right text-[14px] font-medium leading-[1.4] text-[#353638]">
            {formatEuro(settlement.netTotal)}
          </span>
        </div>

        {/* VAT */}
        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_auto] items-center gap-3 px-4 py-2.5">
          <p className="text-[13px] font-medium leading-[1.4] text-[#65686B]">VAT ({vatPct}%)</p>
          <span />
          <span className="text-right text-[14px] font-medium leading-[1.4] text-[#353638]">
            {formatEuro(settlement.vatAmount)}
          </span>
        </div>

        {/* Gross total */}
        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_auto] items-center gap-3 bg-[#FAFBFC] px-4 py-3">
          <p className="text-[14px] font-semibold leading-[1.4] text-[#010309]">
            Total incl. VAT
          </p>
          <span />
          <span className="text-right text-[15px] font-semibold leading-[1.4] text-[#010309]">
            {formatEuro(settlement.grossTotal)}
          </span>
        </div>
      </div>

      {/* Confirmed assumptions & notes */}
      <div className="border-t border-[#E6E8EB] px-4 py-3">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[#969A9E]">
          Confirmed assumptions
        </p>
        <div className="flex flex-col gap-1.5">
          {SERVICE_CHARGE_ASSUMPTIONS.map((assumption) => (
            <div key={assumption.id} className="flex items-start justify-between gap-3">
              <span className="text-[13px] font-normal leading-[1.4] text-[#65686B]">
                {assumption.label}
              </span>
              <span className="shrink-0 text-right text-[13px] font-medium leading-[1.4] text-[#1CAB9F]">
                {answers[assumption.id] ?? assumption.defaultAnswer}
              </span>
            </div>
          ))}
        </div>

        {SERVICE_CHARGE_EXCLUSIONS.length > 0 ? (
          <>
            <p className="mb-1.5 mt-3 text-[12px] font-medium uppercase tracking-wide text-[#969A9E]">
              Excluded from settlement
            </p>
            <div className="flex flex-col gap-1.5">
              {SERVICE_CHARGE_EXCLUSIONS.map((exclusion) => (
                <div key={exclusion.label} className="flex items-start justify-between gap-3">
                  <span className="text-[13px] font-normal leading-[1.4] text-[#65686B]">
                    {exclusion.label}{" "}
                    <span className="text-[#969A9E]">— {exclusion.reason}</span>
                  </span>
                  <span className="shrink-0 text-right text-[13px] font-medium leading-[1.4] text-[#B23A48]">
                    {formatEuro(exclusion.amount)}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Export actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-[#E6E8EB] px-4 py-3">
        <button
          type="button"
          onClick={() => onExport?.("xlsx")}
          className="inline-flex h-9 items-center gap-2 rounded-[32px] bg-[#010309] px-3.5 text-[13px] font-medium leading-[1.24] text-[#F0F2F5] transition-colors hover:bg-[#252628]"
        >
          <FileSpreadsheet className="size-4" strokeWidth={1.8} aria-hidden />
          Export to Excel
        </button>
        <button
          type="button"
          onClick={() => onExport?.("pdf")}
          className="inline-flex h-9 items-center gap-2 rounded-[32px] border border-[#B3B8BD] bg-white px-3.5 text-[13px] font-medium leading-[1.24] text-[#010309] transition-colors hover:bg-[#F0F2F5]"
        >
          <FileText className="size-4" strokeWidth={1.8} aria-hidden />
          Generate PDF
        </button>
      </div>

      <div className={cn("border-t border-[#E6E8EB] bg-[#F9FAFB] px-4 py-2.5")}>
        <p className="text-[11px] font-normal leading-[1.4] text-[#969A9E]">
          The Excel export writes these confirmed values and allocation notes into your firm&apos;s
          formatted template with live formulas (SUM, fee %, VAT). Customer-facing PDFs are prepared
          from the finalized settlement.
        </p>
      </div>
    </div>
  );
}
