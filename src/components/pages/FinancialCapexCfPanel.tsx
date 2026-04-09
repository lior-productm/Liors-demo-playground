"use client";

import { useCallback, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ExternalLink,
  FileText,
  HardHat,
  Lightbulb,
  Mail,
  MessageSquare,
  MoreVertical,
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
    const prompt = `Capex & Cash Flow — Analyse with Amiio:\n\n${topic}`;
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

const KPI_ITEMS: {
  title: string;
  value: string;
  sub: string;
  subTone?: "success" | "warning" | "muted";
}[] = [
  { title: "Total Capex Budget", value: fmtEuroAmount(280_000), sub: "FY 2026", subTone: "muted" },
  { title: "Spent YTD", value: fmtEuroAmount(76_000), sub: "63% utilized", subTone: "warning" },
  { title: "Net Cash Flow YTD", value: fmtEuroAmount(255_594), sub: "Q1 2026", subTone: "success" },
  { title: "Cash Reserve", value: fmtEuroAmount(450_000), sub: "3.2 months coverage", subTone: "muted" },
];

const CAPEX_PROJECTS: {
  id: string;
  name: string;
  budget: number;
  spent: number;
  progressPct: number;
  state: "in-progress" | "completed" | "planned";
  barClass: string;
  detail: string;
}[] = [
  {
    id: "hvac",
    name: "HVAC System Upgrade",
    budget: 125_000,
    spent: 89_000,
    progressPct: 65,
    state: "in-progress",
    barClass: "bg-[var(--Tertiary-600)]",
    detail:
      "Main contractor completed plant-room replacement and controls integration is underway. Delivery on track for June handover.",
  },
  {
    id: "lobby",
    name: "Lobby Renovation",
    budget: 75_000,
    spent: 75_000,
    progressPct: 100,
    state: "completed",
    barClass: "bg-[var(--Secondary-600)]",
    detail: "Work package closed and signed off. Spend finalized at budget with no change orders.",
  },
  {
    id: "roof",
    name: "Roof Repairs",
    budget: 45_000,
    spent: 12_000,
    progressPct: 25,
    state: "in-progress",
    barClass: "bg-[var(--Tertiary-600)]",
    detail: "Phase one patching complete. Remaining works depend on weather windows in Q2.",
  },
  {
    id: "led",
    name: "Energy Efficiency (LED)",
    budget: 35_000,
    spent: 0,
    progressPct: 0,
    state: "planned",
    barClass: "bg-[var(--Neutral-300)]",
    detail: "Procurement list prepared; installation starts after tenant coordination in April.",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const;
const CASH_INFLOW = [150, 150, 150, 150, 150, 150];
const CASH_OUTFLOW = [64, 64, 64, 85, 65, 74];

type CashFlowRow = {
  item: string;
  jan: number;
  feb: number;
  mar: number;
  q1: number;
  tone?: "positive" | "negative" | "strong";
};

const CASHFLOW_ROWS: CashFlowRow[] = [
  { item: "Operating Cash Inflow", jan: 150_399, feb: 150_399, mar: 150_399, q1: 451_197, tone: "strong" },
  { item: "Operating Expenses", jan: -9_701, feb: -9_701, mar: -9_701, q1: -29_103, tone: "negative" },
  { item: "Debt Service", jan: -45_833, feb: -45_711, mar: -45_589, q1: -137_133, tone: "negative" },
  { item: "Net Operating CF", jan: 94_865, feb: 94_987, mar: 95_109, q1: 284_961 },
  { item: "Capex Outflow", jan: -12_000, feb: -5_000, mar: -12_367, q1: -29_367, tone: "negative" },
  { item: "Net Cash Flow", jan: 82_865, feb: 89_987, mar: 82_742, q1: 255_594, tone: "strong" },
];

const CAPEX_INPUT_SOURCES: {
  id: string;
  title: string;
  date: string;
  icon: LucideIcon;
  iconBg: string;
  detail: string;
}[] = [
  {
    id: "c1",
    title: "HVAC Quote.pdf",
    date: "Jan 5, 2026",
    icon: FileText,
    iconBg: "bg-[#E6F6F3] text-[#146B3A]",
    detail: "Vendor quote and scope schedule for HVAC replacement package.",
  },
  {
    id: "c2",
    title: "Contractor Invoice",
    date: "Feb 28, 2026",
    icon: Mail,
    iconBg: "bg-[#D3E8FA] text-[#1A4D8C]",
    detail: "Invoice batch for MEP progress payment and associated retention.",
  },
  {
    id: "c3",
    title: "AM Note: Roof Repair",
    date: "Feb 15, 2026",
    icon: MessageSquare,
    iconBg: "bg-[#EDE9F7] text-[#5B4B8A]",
    detail: "Asset manager note on roof contractor sequencing and budget contingency.",
  },
  {
    id: "c4",
    title: "PM Site Visit Notes",
    date: "Mar 1, 2026",
    icon: HardHat,
    iconBg: "bg-[#FBF2DC] text-[#B07D12]",
    detail: "Site walk summary covering punch list, safety actions, and next milestones.",
  },
];

function statusPill(state: (typeof CAPEX_PROJECTS)[number]["state"]) {
  if (state === "completed")
    return <span className="rounded-full bg-[#E6F6F3] px-2 py-0.5 text-[11px] font-semibold text-[#1F9E8B]">Completed</span>;
  if (state === "in-progress")
    return <span className="rounded-full bg-[#D3E8FA] px-2 py-0.5 text-[11px] font-semibold text-[#1A4D8C]">In Progress</span>;
  return <span className="rounded-full bg-[#EDEEF2] px-2 py-0.5 text-[11px] font-semibold text-[#676A6E]">Planned</span>;
}

function valueToneClass(tone?: CashFlowRow["tone"]) {
  if (tone === "negative") return "text-[#C65A66]";
  if (tone === "strong") return "text-[#010309] font-semibold";
  return "text-[#353638]";
}

export function FinancialCapexCfPanel() {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  const chartPoints = useMemo(() => {
    const width = 560;
    const height = 250;
    const padL = 40;
    const padR = 16;
    const padT = 16;
    const padB = 30;
    const innerW = width - padL - padR;
    const innerH = height - padT - padB;
    const maxY = 160;
    const toX = (i: number) => padL + (i / (MONTHS.length - 1)) * innerW;
    const toY = (v: number) => padT + ((maxY - v) / maxY) * innerH;

    const makePath = (vals: number[]) =>
      vals.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(" ");

    return {
      width,
      height,
      padL,
      padR,
      padT,
      padB,
      inflowPath: makePath(CASH_INFLOW),
      outflowPath: makePath(CASH_OUTFLOW),
      toX,
      toY,
      yTicks: [0, 40, 80, 120, 160],
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_ITEMS.map((k) => (
          <div
            key={k.title}
            className={cn(
              "rounded-2xl border border-[rgba(230,231,232,0.85)] bg-white p-5 shadow-[0px_2px_12px_rgba(0,0,0,0.04)]",
              amiioCardHoverSurface,
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] font-medium text-[#65686B]">{k.title}</p>
              <WidgetHeaderLamp
                className="h-7 w-7"
                chatLabel={k.title}
                chatTopic={`Analyse ${k.title} in Capex & Cash Flow context.`}
              />
            </div>
            <p className={cn("mt-2 text-[22px] font-semibold tabular-nums tracking-tight", k.subTone === "success" ? "text-[#146B3A]" : "text-[#010309]")}>
              {k.value}
            </p>
            <p className={cn("mt-1 text-[12px] font-medium", k.subTone === "success" ? "text-[#146B3A]" : k.subTone === "warning" ? "text-[#B07D12]" : "text-[#969A9E]")}>
              {k.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={cn(DS_CARD, "p-6")}>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <h3 className="text-[16px] font-semibold text-[#2C2C2C]">Capital Expenditure Projects</h3>
            <WidgetHeaderLamp
              chatLabel="Capex projects"
              chatTopic="Summarise capex project progress, budget burn, and delivery risk for each project."
            />
          </div>
          <div className="flex flex-col gap-4">
            {CAPEX_PROJECTS.map((p) => {
              const open = expandedProjectId === p.id;
              return (
                <div key={p.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedProjectId((id) => (id === p.id ? null : p.id))}
                    className="w-full rounded-xl border border-[rgba(230,231,232,0.75)] bg-[#FAFBFC] p-3 text-left"
                  >
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <p className="text-[14px] font-semibold text-[#010309]">{p.name}</p>
                      {statusPill(p.state)}
                    </div>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#65686B]">
                      <span>Budget: {fmtEuroAmount(p.budget)}</span>
                      <span>Spent: {fmtEuroAmount(p.spent)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--Neutral-200)]">
                      <div className={cn("h-full rounded-full transition-[width] duration-300", p.barClass)} style={{ width: `${p.progressPct}%` }} />
                    </div>
                    <p className="mt-1 text-right text-[11px] text-[#969A9E]">{p.progressPct}% complete</p>
                  </button>
                  {open ? (
                    <div className="mt-2 rounded-xl border border-[rgba(230,231,232,0.85)] bg-[#F3F4F6] p-3">
                      <p className="text-[12px] leading-[1.45] text-[#353638]">{p.detail}</p>
                      <div className="mt-3 flex justify-end">
                        <AnalyseWithAmiioButton topic={`${p.name} — spent ${fmtEuroAmount(p.spent)} of ${fmtEuroAmount(p.budget)}.\n\n${p.detail}`} />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className={cn(DS_CARD, "p-6")}>
          <div className="mb-4 flex items-start justify-between gap-2">
            <h3 className="text-[16px] font-semibold text-[#2C2C2C]">Cash Flow Projection</h3>
            <WidgetHeaderLamp
              chatLabel="Cash flow projection"
              chatTopic="Interpret monthly cash inflow and outflow projection for Jan to Jun and highlight risks."
            />
          </div>
          <div className="relative w-full overflow-x-auto">
            <svg className="h-[250px] w-full min-w-[520px]" viewBox={`0 0 ${chartPoints.width} ${chartPoints.height}`}>
              {chartPoints.yTicks.map((tick) => {
                const y = chartPoints.toY(tick);
                return (
                  <g key={tick}>
                    <line x1={chartPoints.padL} x2={chartPoints.width - chartPoints.padR} y1={y} y2={y} stroke="#E6E8EB" strokeDasharray="4 6" />
                    <text x={8} y={y + 4} fontSize={11} fill="#969A9E">{tick === 0 ? "€0" : `€${tick}K`}</text>
                  </g>
                );
              })}
              {MONTHS.map((m, i) => (
                <text key={m} x={chartPoints.toX(i)} y={chartPoints.height - 8} textAnchor="middle" fontSize={11} fill="#969A9E">
                  {m}
                </text>
              ))}
              <path d={chartPoints.inflowPath} fill="none" stroke="#1F9E8B" strokeWidth={2.5} />
              <path d={chartPoints.outflowPath} fill="none" stroke="#EA4B57" strokeWidth={2.5} />
              {CASH_INFLOW.map((v, i) => (
                <circle key={`in-${i}`} cx={chartPoints.toX(i)} cy={chartPoints.toY(v)} r={3.5} fill="#1F9E8B" />
              ))}
              {CASH_OUTFLOW.map((v, i) => (
                <circle key={`out-${i}`} cx={chartPoints.toX(i)} cy={chartPoints.toY(v)} r={3.5} fill="#EA4B57" />
              ))}
            </svg>
          </div>
          <div className="mt-1 flex items-center justify-center gap-6 text-[12px] text-[#65686B]">
            <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-[#1F9E8B]" />Cash Inflow</span>
            <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-[#EA4B57]" />Cash Outflow</span>
          </div>
        </div>
      </div>

      <div className={cn(DS_CARD, "overflow-hidden p-6")}>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-[16px] font-semibold text-[#2C2C2C]">Cash Flow Statement - Q1 2026</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#D1D5D9] bg-white px-3 text-[13px] font-medium text-[#010309] transition-colors hover:bg-[#F7F8FA]"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", { detail: { message: "Export cashflow statement" } }),
                )
              }
            >
              Export
            </button>
            <WidgetHeaderLamp
              chatLabel="Cash Flow Statement - Q1 2026"
              chatTopic="Analyse the Q1 cash flow statement including operating inflow, debt service, capex outflow, and net cash flow."
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[rgba(230,231,232,0.85)]">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[rgba(230,231,232,0.9)] bg-[#F7F8FA]">
                {["Item", "Jan", "Feb", "Mar", "Q1 Total"].map((h) => (
                  <th key={h} className={cn("px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#969A9E]", h !== "Item" && "text-right")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CASHFLOW_ROWS.map((r) => (
                <tr key={r.item} className="border-b border-[rgba(230,231,232,0.6)] last:border-0">
                  <td className="px-4 py-3 text-[13px] font-medium text-[#353638]">{r.item}</td>
                  <td className={cn("px-4 py-3 text-right text-[13px] tabular-nums", valueToneClass(r.tone))}>{fmtEuroAmount(r.jan)}</td>
                  <td className={cn("px-4 py-3 text-right text-[13px] tabular-nums", valueToneClass(r.tone))}>{fmtEuroAmount(r.feb)}</td>
                  <td className={cn("px-4 py-3 text-right text-[13px] tabular-nums", valueToneClass(r.tone))}>{fmtEuroAmount(r.mar)}</td>
                  <td className={cn("px-4 py-3 text-right text-[13px] tabular-nums font-semibold", valueToneClass(r.tone))}>{fmtEuroAmount(r.q1)}</td>
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
              chatLabel="Capex & CF input sources"
              chatTopic="Summarise source documents used for capex and cashflow reporting."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {CAPEX_INPUT_SOURCES.map((s) => {
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
                  <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", s.iconBg)}>
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

