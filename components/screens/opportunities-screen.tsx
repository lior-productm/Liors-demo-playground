"use client";

import { useState } from "react";
import {
  Check,
  MoreVertical,
  Target,
  DollarSign,
  Building2,
  ArrowUpRight,
  Sparkles,
  MessageSquare,
  Clock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Screen } from "@/components/sidebar-nav";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";

interface OpportunitiesScreenProps {
  onNavigate: (screen: Screen) => void;
  onHighlightRows: (rows: number[]) => void;
  onHighlightOpportunities: (cells: { row: number; col: number }[]) => void;
}

interface Opportunity {
  id: string;
  category: "expansion" | "refinancing" | "optimization" | "acquisition";
  title: string;
  description: string;
  estimatedValue: string;
  timeline: string;
  confidence: number;
  relatedAssets: string[];
  affectedRows: number[];
  opportunityCells: { row: number; col: number }[];
  actions: string[];
}

const opportunities: Opportunity[] = [
  {
    id: "1",
    category: "expansion",
    title: "Logistics Portfolio Expansion",
    description:
      "Your logistics assets are outperforming at +8.3% above budget with 100% occupancy. Market data suggests strong demand for additional logistics space in the Haifa-Lod corridor. Consider expanding your logistics allocation from 20% to 30% of portfolio.",
    estimatedValue: "+$2.8M annual NOI",
    timeline: "6-12 months",
    confidence: 89,
    relatedAssets: ["Logistics Park A", "Mega Logistics Hub", "Green Park Logistics"],
    affectedRows: [2, 5, 9],
    opportunityCells: [
      { row: 2, col: 3 },
      { row: 5, col: 3 },
      { row: 9, col: 3 },
    ],
    actions: [
      "Identify acquisition targets in corridor",
      "Model expansion scenarios",
      "Review fund allocation limits",
    ],
  },
  {
    id: "2",
    category: "refinancing",
    title: "Residence Heights Refinancing Window",
    description:
      "Current debt ratio at 71% with 4.9% cap rate. Market conditions suggest a 45-55bps rate reduction is achievable through refinancing. Combined with strong occupancy of 96.8%, lenders are likely to offer favorable terms.",
    estimatedValue: "$420K annual savings",
    timeline: "3-6 months",
    confidence: 78,
    relatedAssets: ["Residence Heights"],
    affectedRows: [3],
    opportunityCells: [
      { row: 3, col: 8 },
      { row: 3, col: 9 },
    ],
    actions: [
      "Request refinancing quotes from 3+ lenders",
      "Prepare updated valuation report",
      "Review prepayment penalties",
    ],
  },
  {
    id: "3",
    category: "optimization",
    title: "Retail Portfolio Consolidation",
    description:
      "Three retail assets are underperforming (-8.6% avg NOI variance). Consolidating property management and implementing unified tenant mix strategy could recover $450K in operational efficiency and improve occupancy by 3-5%.",
    estimatedValue: "$450K efficiency gain",
    timeline: "3-9 months",
    confidence: 74,
    relatedAssets: ["Central Mall", "Harbor Retail Center", "City Center Mall"],
    affectedRows: [1, 6, 10],
    opportunityCells: [
      { row: 1, col: 6 },
      { row: 6, col: 6 },
      { row: 10, col: 6 },
    ],
    actions: [
      "Benchmark against peer retail portfolios",
      "Evaluate single PM provider",
      "Develop unified leasing strategy",
    ],
  },
  {
    id: "4",
    category: "acquisition",
    title: "Tech Campus Adjacent Opportunity",
    description:
      "A 12,000 sqm office building adjacent to Tech Campus B in Ra'anana is coming to market. Acquiring this asset would create a campus effect, improving tenant attraction and potentially increasing combined NOI by 15-20%.",
    estimatedValue: "+$1.2M combined NOI uplift",
    timeline: "4-8 months",
    confidence: 65,
    relatedAssets: ["Tech Campus B"],
    affectedRows: [4],
    opportunityCells: [{ row: 4, col: 10 }],
    actions: [
      "Request preliminary info memorandum",
      "Model campus synergy scenarios",
      "Assess fund capacity for acquisition",
    ],
  },
];

const categoryConfig = {
  expansion: { icon: ArrowUpRight, color: "text-[#1F9E8B]", bg: "bg-[#E8F7F3]" },
  refinancing: { icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
  optimization: { icon: Zap, color: "text-warning", bg: "bg-warning/10" },
  acquisition: { icon: Building2, color: "text-chart-3", bg: "bg-chart-3/10" },
};

export function OpportunitiesScreen({
  onNavigate,
  onHighlightRows,
  onHighlightOpportunities,
}: OpportunitiesScreenProps) {
  const [expanded, setExpanded] = useState<string | null>("1");
  const [tracked, setTracked] = useState<Set<string>>(new Set());

  const handleTrack = (id: string) => {
    setTracked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleHover = (opp: Opportunity | null) => {
    if (opp) {
      onHighlightRows(opp.affectedRows);
      onHighlightOpportunities(opp.opportunityCells);
    } else {
      onHighlightRows([]);
      onHighlightOpportunities([]);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">
            Opportunities
          </h2>
          <p className="text-[11px] text-muted-foreground">
            AI-identified value creation opportunities
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1">
          <Target className="h-3 w-3 text-accent" />
          <span className="text-[10px] font-medium text-accent">
            +$4.87M potential
          </span>
        </div>
      </div>

      {/* Category summary */}
      <div className="flex gap-1.5">
        {(["expansion", "refinancing", "optimization", "acquisition"] as const).map(
          (cat) => {
            const config = categoryConfig[cat];
            const Icon = config.icon;
            const count = opportunities.filter(
              (o) => o.category === cat
            ).length;
            return (
              <button
                key={cat}
                type="button"
                className={cn(
                  "flex items-center gap-1 rounded-full border border-border px-2 py-1 text-[10px] font-medium capitalize transition-colors hover:bg-secondary",
                  config.color
                )}
              >
                <Icon className="h-3 w-3" />
                {cat}
                <span className="text-muted-foreground">({count})</span>
              </button>
            );
          }
        )}
      </div>

      {/* Opportunity Cards */}
      <div className="flex flex-col gap-2.5">
        {opportunities.map((opp, idx) => {
          const isExpanded = expanded === opp.id;
          const isTracked = tracked.has(opp.id);
          const config = categoryConfig[opp.category];
          const Icon = config.icon;

          return (
            <div
              key={opp.id}
              className={cn(
                "rounded-lg border bg-card transition-all",
                isExpanded ? "border-accent/30 shadow-sm" : "border-border",
                "border-l-2",
                opp.category === "expansion" && "border-l-accent",
                opp.category === "refinancing" && "border-l-primary",
                opp.category === "optimization" && "border-l-warning",
                opp.category === "acquisition" && "border-l-chart-3"
              )}
              style={{ animationDelay: `${idx * 80}ms` }}
              onMouseEnter={() => handleHover(opp)}
              onMouseLeave={() => handleHover(null)}
            >
              {/* Card Header */}
              <button
                type="button"
                onClick={() =>
                  setExpanded(isExpanded ? null : opp.id)
                }
                className="flex w-full items-center gap-2.5 p-3 text-left"
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded",
                    config.bg
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", config.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {opp.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-medium text-accent">
                      {opp.estimatedValue}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {opp.timeline}
                    </span>
                  </div>
                </div>
                {isTracked && (
                  <span className="flex h-5 items-center gap-0.5 rounded bg-accent/10 px-1.5 text-[9px] font-bold text-accent">
                    <Check className="h-3 w-3" />
                    Tracked
                  </span>
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-border px-3 pb-3 pt-2.5">
                  <p className="mb-2.5 text-[11px] leading-relaxed text-muted-foreground">
                    {opp.description}
                  </p>

                  {/* Confidence */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      AI Confidence
                    </span>
                    <div className="flex-1">
                      <div className="h-1.5 w-full rounded-full bg-secondary">
                        <div
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-700",
                            opp.confidence >= 80
                              ? "bg-accent"
                              : opp.confidence >= 60
                                ? "bg-warning"
                                : "bg-destructive"
                          )}
                          style={{ width: `${opp.confidence}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-foreground">
                      {opp.confidence}%
                    </span>
                  </div>

                  {/* Related Assets */}
                  <div className="mb-3">
                    <p className="mb-1.5 text-[10px] font-medium text-muted-foreground">
                      Related Assets
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {opp.relatedAssets.map((asset) => (
                        <span
                          key={asset}
                          className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-foreground"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="mb-3">
                    <p className="mb-1.5 text-[10px] font-medium text-muted-foreground">
                      Recommended Actions
                    </p>
                    <ul className="flex flex-col gap-1">
                      {opp.actions.map((action, i) => (
                        <li
                          key={action}
                          className="flex items-start gap-1.5 text-[11px] text-foreground"
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-muted-foreground">
                            {i + 1}
                          </span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTrack(opp.id)}
                      className={cn(
                        "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10px] font-semibold transition-colors",
                        isTracked
                          ? "bg-accent/10 text-accent"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {isTracked ? (
                        <>
                          <Check className="h-3 w-3" />
                          Tracking
                        </>
                      ) : (
                        <>
                          <Target className="h-3 w-3" />
                          Track
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate("chat")}
                      className="flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[10px] font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      <MessageSquare className="h-3 w-3" />
                      Deep Dive
                    </button>
                    <button
                      type="button"
                      className="ml-auto flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-[10px] text-muted-foreground transition-colors hover:bg-secondary"
                    >
                      <MoreVertical className="h-3 w-3" />
                      Export
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Portfolio-level Insight */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <AmiioAiDisclaimerTrigger wrapChild>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </AmiioAiDisclaimerTrigger>
          <span className="text-[10px] font-semibold text-primary">
            Amiio AI Portfolio Insight
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-foreground">
          Based on current market conditions and your portfolio composition,
          shifting 8-10% allocation from retail to logistics could increase
          annual portfolio NOI by{" "}
          <span className="font-semibold text-accent">$1.8-2.4M</span> while
          reducing overall portfolio risk.
        </p>
      </div>
    </div>
  );
}
