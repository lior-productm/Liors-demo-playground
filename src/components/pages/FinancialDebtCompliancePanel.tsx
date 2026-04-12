"use client";

import { useCallback, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Lightbulb,
  Mail,
  MessageSquare,
  MoreVertical,
  StickyNote,
} from "lucide-react";
import { amiioCardHoverSurface, cn } from "@/lib/utils";
import { WidgetHeaderLamp } from "@/src/components/commercial/WidgetHeaderLamp";
import { useCommercialChatInject } from "@/src/components/commercial/CommercialChatContext";

const DS_CARD =
  "rounded-[32px] border border-[rgba(230,231,232,0.85)] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.04)]";

function fmtEuroAmount(n: number) {
  return `€ ${n.toLocaleString("de-DE")}`;
}

function AnalyseWithAmiioButton({ topic }: { topic: string }) {
  const inject = useCommercialChatInject();
  const onClick = useCallback(() => {
    const prompt = `Debt Compliance — Analyse with Amiio:\n\n${topic}`;
    if (inject) inject(prompt);
    else
      window.dispatchEvent(
        new CustomEvent("amiio:toast", {
          detail: { message: "Open chat to analyse with Amiio" },
        }),
      );
  }, [inject, topic]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#D1D5D9] bg-white px-3.5 text-[13px] font-medium text-[#353638] shadow-[0px_2px_6px_rgba(0,0,0,0.05)] transition-colors hover:border-[#BFC6CD] hover:bg-[#F8FAFC]"
    >
      <Lightbulb className="size-4 shrink-0 text-[#7E8185]" strokeWidth={1.8} />
      Analyse with Amiio
    </button>
  );
}

const COVENANTS: {
  id: string;
  name: string;
  requirement: string;
  value: string;
  detail: string;
}[] = [
  {
    id: "dscr",
    name: "DSCR (Debt Service Coverage)",
    requirement: "Required: >1.20x",
    value: "1.45x",
    detail:
      "Trailing twelve-month DSCR is comfortably above the facility floor. Amiio flags no near-term breach risk under base-case cashflow.",
  },
  {
    id: "ltv",
    name: "LTV (Loan to Value)",
    requirement: "Required: <65%",
    value: "52.3%",
    detail:
      "Current LTV reflects latest independent valuation and outstanding balance. Headroom remains versus covenant cap.",
  },
  {
    id: "icr",
    name: "ICR (Interest Coverage)",
    requirement: "Required: >1.50x",
    value: "2.12x",
    detail:
      "Interest cover includes scheduled amortisation and floating-rate stress per facility definition.",
  },
  {
    id: "occ",
    name: "Occupancy Rate",
    requirement: "Required: >85%",
    value: "92.5%",
    detail:
      "Portfolio-weighted occupancy per lender reporting pack; excludes units under refurbishment per side letter.",
  },
];

const LOAN_ROWS: { label: string; value: string }[] = [
  { label: "Facility Amount", value: fmtEuroAmount(12_500_000) },
  { label: "Outstanding Balance", value: fmtEuroAmount(10_200_000) },
  { label: "Interest Rate", value: "4.25% (Euribor + 175bps)" },
  { label: "Maturity Date", value: "March 2029" },
  { label: "Next Payment", value: "April 1, 2026" },
  { label: "Payment Amount", value: fmtEuroAmount(45_833) },
];

const PAYMENT_ROWS: { date: string; principal: number; interest: number; total: number; balanceAfter: number }[] =
  [
    { date: "Apr 1, 2026", principal: 34_333, interest: 11_500, total: 45_833, balanceAfter: 10_165_667 },
    { date: "May 1, 2026", principal: 34_450, interest: 11_383, total: 45_833, balanceAfter: 10_131_217 },
    { date: "Jun 1, 2026", principal: 34_568, interest: 11_265, total: 45_833, balanceAfter: 10_096_649 },
  ];

const INPUT_SOURCES: {
  id: string;
  title: string;
  date: string;
  icon: LucideIcon;
  iconBg: string;
  detail: string;
}[] = [
  {
    id: "s1",
    title: "Bank Covenant Update",
    date: "Mar 1, 2026",
    icon: Mail,
    iconBg: "bg-[#D3E8FA] text-[#1A4D8C]",
    detail: "Latest covenant compliance letter from relationship bank confirming all tests passed for Q1 reporting.",
  },
  {
    id: "s2",
    title: "Bank Call Transcript",
    date: "Feb 15, 2026",
    icon: MessageSquare,
    iconBg: "bg-[#FBF2DC] text-[#B07D12]",
    detail: "Transcript of quarterly lender call covering refi timeline and consent process for capex spend.",
  },
  {
    id: "s3",
    title: "Loan Agreement.pdf",
    date: "Jan 10, 2026",
    icon: FileText,
    iconBg: "bg-[#E6F6F3] text-[#146B3A]",
    detail: "Executed facility agreement including schedules for covenants, events of default, and reporting.",
  },
  {
    id: "s4",
    title: "AM Note: Refinancing",
    date: "Feb 28, 2026",
    icon: StickyNote,
    iconBg: "bg-[#EDE9F7] text-[#5B4B8A]",
    detail: "Internal asset management memo on refinancing options and lender mapping for 2027 window.",
  },
];

export function FinancialDebtCompliancePanel() {
  const [expandedCovenantId, setExpandedCovenantId] = useState<string | null>(null);
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className={cn(
            "flex w-full flex-1 items-start gap-3 rounded-2xl border border-[#B8E0D0] bg-[#EEF8F4] px-4 py-3 sm:items-center sm:py-3.5",
            amiioCardHoverSurface,
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1F9E8B]/15">
            <CheckCircle2 className="size-5 text-[#1F9E8B]" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-[#146B3A]">All Covenants Compliant</p>
            <p className="mt-0.5 text-[13px] text-[#65686B]">Last reviewed: March 1, 2026</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-[#010309] px-3.5 text-[13px] font-medium text-white shadow-[0px_2px_8px_rgba(1,3,9,0.2)] transition-colors hover:bg-[#040718]"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("amiio:toast", { detail: { message: "Debt compliance actions" } }),
            )
          }
        >
          Actions
          <MoreVertical className="size-4 opacity-90" strokeWidth={2} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
        <div className={cn(DS_CARD, "flex flex-col p-6")}>
          <div className="mb-4 flex items-start justify-between gap-2">
            <h3 className="text-[16px] font-semibold text-[#2C2C2C]">Covenant Summary</h3>
            <WidgetHeaderLamp
              chatLabel="Covenant Summary"
              chatTopic="Summarise DSCR, LTV, ICR, and occupancy covenants versus facility requirements and headroom."
            />
          </div>
          <div className="flex flex-col divide-y divide-[rgba(230,231,232,0.9)]">
            {COVENANTS.map((c) => {
              const open = expandedCovenantId === c.id;
              return (
                <div key={c.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedCovenantId((id) => (id === c.id ? null : c.id))}
                    className={cn(
                      "flex w-full items-start justify-between gap-3 py-4 text-left transition-colors",
                      "hover:bg-[#F7F8FA]/80 first:pt-0 last:pb-0",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#010309]">{c.name}</p>
                      <p className="mt-0.5 text-[12px] text-[#65686B]">{c.requirement}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-[14px] font-semibold tabular-nums text-[#010309]">{c.value}</span>
                      <span className="rounded-full bg-[#E6F6F3] px-2 py-0.5 text-[11px] font-semibold text-[#1F9E8B]">
                        Compliant
                      </span>
                    </div>
                  </button>
                  {open ? (
                    <div className="border-t border-[rgba(230,231,232,0.85)] bg-[#F3F4F6] px-3 py-3 sm:px-4">
                      <p className="text-[12px] leading-[1.45] text-[#353638]">{c.detail}</p>
                      <div className="mt-3 flex justify-end">
                        <AnalyseWithAmiioButton
                          topic={`${c.name}\n${c.requirement}\nCurrent: ${c.value}\n\n${c.detail}`}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className={cn(DS_CARD, "flex flex-col p-6")}>
          <div className="mb-4 flex items-start justify-between gap-2">
            <h3 className="text-[16px] font-semibold text-[#2C2C2C]">Loan Details</h3>
            <WidgetHeaderLamp
              chatLabel="Loan Details"
              chatTopic="Explain facility size, margin, amortisation profile, and next payment for the primary loan."
            />
          </div>
          <div className="flex flex-col divide-y divide-[rgba(230,231,232,0.9)] rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FAFBFC]">
            {LOAN_ROWS.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-[13px] text-[#65686B]">{row.label}</span>
                <span className="text-right text-[13px] font-medium tabular-nums text-[#010309]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 inline-flex items-start gap-1.5 text-[12px] leading-[1.45] text-[#65686B]">
            <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-[#7E8185]" strokeWidth={1.8} />
            <span>
              Facility is senior secured on the portfolio with quarterly covenant testing. Stress DSCR
              under downside rent and rate scenarios in chat.
            </span>
          </p>
        </div>
      </div>

      <div className={cn(DS_CARD, "overflow-hidden p-6")}>
        <div className="mb-4 flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-semibold text-[#2C2C2C]">Upcoming Debt Service Payments</h3>
          <WidgetHeaderLamp
            chatLabel="Debt service schedule"
            chatTopic="Interpret upcoming principal, interest, and balance trajectory for the facility payment schedule."
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[rgba(230,231,232,0.9)]">
                {["Date", "Principal", "Interest", "Total Payment", "Balance After"].map((h) => (
                  <th
                    key={h}
                    className="pb-3 pr-4 text-[12px] font-medium uppercase tracking-[0.04em] text-[#969A9E]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYMENT_ROWS.map((row) => (
                <tr
                  key={row.date}
                  className="border-b border-[rgba(230,231,232,0.6)] last:border-0"
                >
                  <td className="py-3 pr-4 text-[13px] font-medium text-[#353638]">{row.date}</td>
                  <td className="py-3 pr-4 text-[13px] tabular-nums text-[#353638]">
                    {fmtEuroAmount(row.principal)}
                  </td>
                  <td className="py-3 pr-4 text-[13px] tabular-nums text-[#353638]">
                    {fmtEuroAmount(row.interest)}
                  </td>
                  <td className="py-3 pr-4 text-[13px] font-semibold tabular-nums text-[#010309]">
                    {fmtEuroAmount(row.total)}
                  </td>
                  <td className="py-3 text-[13px] tabular-nums text-[#353638]">
                    {fmtEuroAmount(row.balanceAfter)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={cn(DS_CARD, "p-6")}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[16px] font-semibold text-[#2C2C2C]">Input Sources</h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-[13px] font-medium text-[#233FDE] underline-offset-2 hover:underline"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", { detail: { message: "View all sources" } }),
                )
              }
            >
              View all
            </button>
            <WidgetHeaderLamp
              chatLabel="Input sources"
              chatTopic="List debt compliance input sources (bank letters, transcripts, agreements) and how they affect covenant monitoring."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {INPUT_SOURCES.map((s) => {
            const Icon = s.icon;
            const open = expandedSourceId === s.id;
            return (
              <div key={s.id} className="relative min-w-0">
                <button
                  type="button"
                  className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-lg text-[#969A9E] transition-colors hover:bg-white hover:text-[#233FDE]"
                  aria-label={`Open ${s.title}`}
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("amiio:toast", { detail: { message: `Open ${s.title}` } }),
                    )
                  }
                >
                  <ExternalLink className="size-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedSourceId((id) => (id === s.id ? null : s.id))}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl border border-[rgba(230,231,232,0.85)] bg-[#FAFBFC] p-3 pr-10 text-left transition-colors",
                    amiioCardHoverSurface,
                    "hover:border-[#D1D5D9]",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      s.iconBg,
                    )}
                  >
                    <Icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#010309]">{s.title}</p>
                    <p className="mt-0.5 text-[12px] text-[#65686B]">{s.date}</p>
                  </div>
                </button>
                {open ? (
                  <div className="mt-2 rounded-xl border border-[rgba(230,231,232,0.85)] bg-[#F3F4F6] p-3">
                    <p className="text-[12px] leading-[1.45] text-[#353638]">{s.detail}</p>
                    <div className="mt-3 flex justify-end">
                      <AnalyseWithAmiioButton topic={`Input source: ${s.title}\n\n${s.detail}`} />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
