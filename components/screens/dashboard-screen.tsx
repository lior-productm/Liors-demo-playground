"use client";

import {
  ArrowUpRight,
  Building2,
  AlertTriangle,
  Sparkles,
  FileSpreadsheet,
  Users,
  ChevronUp,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import type { Screen } from "@/components/sidebar-nav";
import {
  AmiioAiDisclaimerTrigger,
  defaultLampTooltipSummary,
} from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import {
  TrendDirectionGlyph,
  TrendPill,
} from "@/src/components/commercial/TrendPill";
import { AmiioSummaryTypewriterText } from "@/src/components/commercial/AmiioSummaryTypewriter";

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
}

const kpis = [
  {
    label: "Total Portfolio NOI",
    value: "$34.3M",
    change: "+2.4%",
    positive: true,
    sub: "vs. budget",
  },
  {
    label: "Avg. Occupancy",
    value: "93.5%",
    change: "-0.8%",
    positive: false,
    sub: "vs. last quarter",
  },
  {
    label: "Portfolio Value",
    value: "$603M",
    change: "+4.1%",
    positive: true,
    sub: "YoY growth",
  },
  {
    label: "Avg. Cap Rate",
    value: "6.1%",
    change: "+0.2%",
    positive: false,
    sub: "market adjusted",
  },
];

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  return (
    <div className="flex flex-col gap-4 p-4 animate-fade-in-up">
      {/* AI Summary */}
      <div className="rounded-2xl border border-[rgba(230,231,232,0.7)] bg-[rgba(255,255,255,0.8)] p-4">
        <button className="flex items-center gap-2">
          <ChevronUp className="h-5 w-5 text-[#969A9E]" />
          <span className="text-sm font-medium text-[#2C2C2C]">
            Amiio&apos;s AI Summary
          </span>
        </button>

        <div className="mt-3 flex flex-col gap-2">
          {[
            {
              text: "Portfolio performing 2.4% above budget overall",
              when: "Just now",
              lampSummary: defaultLampTooltipSummary(
                "NOI vs budget",
                "Compares portfolio net operating income to the current budget baseline.",
              ),
            },
            {
              text: "3 proactive opportunities detected from tenant data changes worth +$670K/year",
              when: "2 days ago",
              lampSummary: defaultLampTooltipSummary(
                "Tenant-led upside",
                "Estimated annual value from opportunities inferred from recent lease and tenant signals.",
              ),
            },
            {
              text: "Two retail assets need attention — underperformance flagged",
              when: "1 week ago",
              lampSummary: defaultLampTooltipSummary(
                "Retail performance",
                "Highlights retail holdings tracking below expectations in the portfolio view.",
              ),
            },
          ].map((insight, index) => (
            <div
              key={insight.text}
              className="flex items-center rounded-xl border border-[rgba(230,231,232,0.7)] bg-[#FBFBFB] px-3 py-2.5"
            >
              <div className="flex flex-1 items-center gap-2">
                <AmiioAiDisclaimerTrigger
                  variant="lamp"
                  wrapChild
                  lampSummary={insight.lampSummary}
                  wrapperClassName="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#010309] shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                >
                  <Lightbulb className="h-3 w-3 text-white" />
                </AmiioAiDisclaimerTrigger>
                <AmiioSummaryTypewriterText
                  text={insight.text}
                  className="text-[11px] leading-snug text-[#353638]"
                  charDelayMs={7}
                  startDelayMs={index * 240}
                />
              </div>
              <span className="ml-2 shrink-0 text-[10px] font-medium text-[#7E8185]">
                {insight.when}
              </span>
              <ChevronRight className="ml-1 h-4 w-4 shrink-0 text-[#969A9E]" />
            </div>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border border-border bg-card p-3"
          >
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {kpi.label}
            </p>
            <p className="text-lg font-bold text-foreground">{kpi.value}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1">
              <TrendPill
                direction={kpi.positive ? "up" : "down"}
                pct={kpi.change}
              />
              <span className="text-[10px] text-muted-foreground">
                {kpi.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Proactive Insight Highlight */}
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-accent" />
          <span className="text-[11px] font-bold text-accent">
            Tenant Growth Detected
          </span>
          <span className="ml-auto rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold text-accent">
            NEW
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-foreground">
          Tower One Office tenant count grew <span className="font-semibold text-accent">40% in 2 years</span> (13 to 18).
          Budget hasn{"'"}t been updated - you{"'"}re missing ~$185K in CAM recoveries.
        </p>
        <AmiioAiDisclaimerTrigger>
          <button
            type="button"
            onClick={() => onNavigate("insights")}
            className="mt-2 flex items-center gap-1 rounded-md bg-accent px-2.5 py-1.5 text-[10px] font-semibold text-accent-foreground hover:bg-accent/90"
          >
            <Sparkles className="h-3 w-3" />
            Review Proactive Insights
          </button>
        </AmiioAiDisclaimerTrigger>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Requires Attention
        </h3>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onNavigate("insights")}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">
                5 Anomalies + 3 Proactive Insights
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                Retail underperformance, debt ratios, budget gaps
              </p>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate("opportunities")}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-accent/30 hover:bg-accent/5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F7F3]">
              <TrendDirectionGlyph direction="up" className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">
                4 Opportunities Found
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                Logistics expansion, refinancing, rent uplift
              </p>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate("generate")}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">
                3 Files Suggested
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                Budget revision, rent analysis, strategy plan
              </p>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate("forecasts")}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">
                Q3 Forecast Ready
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                AI-generated projections across 12 assets
              </p>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Asset Performance Mini Chart */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Asset Type Performance
        </h3>
        <div className="rounded-lg border border-border bg-card p-3">
          {[
            { type: "Logistics", noi: "+8.3%", bar: 83, color: "bg-accent" },
            { type: "Office", noi: "+0.2%", bar: 52, color: "bg-primary" },
            { type: "Residential", noi: "+1.3%", bar: 56, color: "bg-chart-3" },
            { type: "Retail", noi: "-8.6%", bar: 28, color: "bg-destructive" },
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-3 py-1.5">
              <span className="w-16 text-[11px] text-muted-foreground">
                {item.type}
              </span>
              <div className="flex-1">
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className={`h-2 rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${item.bar}%` }}
                  />
                </div>
              </div>
              <span
                className={`w-12 text-right text-[11px] font-medium ${item.noi.startsWith("-") ? "text-destructive" : "text-accent"}`}
              >
                {item.noi}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
