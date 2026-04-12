"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Info, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { TrendPill } from "@/src/components/commercial/TrendPill";

interface ForecastItem {
  id: string;
  asset: string;
  type: string;
  currentNOI: string;
  forecastNOI: string;
  change: string;
  positive: boolean;
  confidence: number;
  factors: string[];
  quarterlyTrend: number[];
}

const forecasts: ForecastItem[] = [
  {
    id: "1",
    asset: "Tower One Office",
    type: "Office",
    currentNOI: "$4.25M",
    forecastNOI: "$4.41M",
    change: "+3.8%",
    positive: true,
    confidence: 87,
    factors: [
      "Strong tenant retention",
      "Market rent growth in Tel Aviv (+4.2%)",
      "Upcoming lease renewals at higher rates",
    ],
    quarterlyTrend: [60, 65, 72, 78, 83, 88],
  },
  {
    id: "2",
    asset: "Central Mall",
    type: "Retail",
    currentNOI: "$2.18M",
    forecastNOI: "$1.96M",
    change: "-10.1%",
    positive: false,
    confidence: 72,
    factors: [
      "Continued footfall decline in retail sector",
      "Two tenant expirations in Q3",
      "Increasing maintenance costs",
    ],
    quarterlyTrend: [80, 74, 68, 60, 55, 48],
  },
  {
    id: "3",
    asset: "Logistics Park A",
    type: "Logistics",
    currentNOI: "$1.89M",
    forecastNOI: "$2.12M",
    change: "+12.2%",
    positive: true,
    confidence: 93,
    factors: [
      "100% occupancy with waitlist",
      "E-commerce demand surge",
      "Long-term lease with annual escalators",
    ],
    quarterlyTrend: [55, 62, 70, 78, 85, 93],
  },
  {
    id: "4",
    asset: "Residence Heights",
    type: "Residential",
    currentNOI: "$3.42M",
    forecastNOI: "$3.49M",
    change: "+2.0%",
    positive: true,
    confidence: 81,
    factors: [
      "Stable residential demand",
      "Below-market rents with upside",
      "High retention at 96.8%",
    ],
    quarterlyTrend: [65, 67, 70, 72, 75, 78],
  },
  {
    id: "5",
    asset: "Mega Logistics Hub",
    type: "Logistics",
    currentNOI: "$2.32M",
    forecastNOI: "$2.64M",
    change: "+13.8%",
    positive: true,
    confidence: 91,
    factors: [
      "Strategic location near airport",
      "New cold storage facility opening",
      "Government logistics incentives",
    ],
    quarterlyTrend: [52, 60, 68, 76, 84, 91],
  },
];

export function ForecastsScreen() {
  const [expanded, setExpanded] = useState<string | null>("1");

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-3 p-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">
            AI Forecasts
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Next quarter projections based on your organization data
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1">
          <AmiioAiDisclaimerTrigger wrapChild>
            <Sparkles className="h-3 w-3 text-primary animate-ai-pulse" />
          </AmiioAiDisclaimerTrigger>
          <span className="text-[10px] font-medium text-primary">Q3 2026</span>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-card p-2.5">
        <div className="text-center">
          <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Portfolio NOI
          </p>
          <p className="text-sm font-bold text-foreground">$35.8M</p>
          <div className="mt-0.5 flex justify-center">
            <TrendPill direction="up" pct="+4.4%" />
          </div>
        </div>
        <div className="border-x border-border text-center">
          <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Avg. Confidence
          </p>
          <p className="text-sm font-bold text-foreground">85%</p>
          <p className="text-[10px] text-muted-foreground">AI model</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Assets at Risk
          </p>
          <p className="text-sm font-bold text-destructive">2</p>
          <p className="text-[10px] text-muted-foreground">retail segment</p>
        </div>
      </div>

      {/* Forecast Cards */}
      <div className="flex flex-col gap-2">
        {forecasts.map((forecast, idx) => {
          const isExpanded = expanded === forecast.id;
          return (
            <div
              key={forecast.id}
              className={cn(
                "rounded-lg border bg-card transition-all",
                isExpanded
                  ? "border-primary/30 shadow-sm"
                  : "border-border"
              )}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Card Header */}
              <button
                type="button"
                onClick={() => toggleExpand(forecast.id)}
                className="flex w-full items-center gap-2.5 p-3 text-left"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-secondary">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {forecast.asset}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {forecast.type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs font-bold text-foreground">
                      {forecast.forecastNOI}
                    </p>
                    <div className="flex items-center justify-end gap-0.5">
                      <TrendPill
                        direction={forecast.positive ? "up" : "down"}
                        pct={forecast.change}
                      />
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-border px-3 pb-3 pt-2.5">
                  {/* Mini trend chart */}
                  <div className="mb-3">
                    <p className="mb-1.5 text-[10px] font-medium text-muted-foreground">
                      6-Month NOI Trend
                    </p>
                    <div className="flex items-end gap-1 h-10">
                      {forecast.quarterlyTrend.map((val, i) => (
                        <div
                          key={`bar-${forecast.id}-${i}`}
                          className="flex-1 rounded-t transition-all duration-500"
                          style={{
                            height: `${val}%`,
                            backgroundColor:
                              i === forecast.quarterlyTrend.length - 1
                                ? forecast.positive
                                  ? "hsl(var(--accent))"
                                  : "hsl(var(--destructive))"
                                : i >= forecast.quarterlyTrend.length - 2
                                  ? forecast.positive
                                    ? "hsl(152 60% 46% / 0.5)"
                                    : "hsl(0 72% 55% / 0.5)"
                                  : "hsl(var(--secondary))",
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
                      <span>Q1</span>
                      <span>Q2</span>
                      <span className="font-medium text-foreground">
                        Q3 (forecast)
                      </span>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      Confidence
                    </span>
                    <div className="flex-1">
                      <div className="h-1.5 w-full rounded-full bg-secondary">
                        <div
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-700",
                            forecast.confidence >= 80
                              ? "bg-accent"
                              : forecast.confidence >= 60
                                ? "bg-warning"
                                : "bg-destructive"
                          )}
                          style={{ width: `${forecast.confidence}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-foreground">
                      {forecast.confidence}%
                    </span>
                  </div>

                  {/* Key Factors */}
                  <div>
                    <p className="mb-1.5 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                      <Info className="h-3 w-3" />
                      Key Driving Factors
                    </p>
                    <ul className="flex flex-col gap-1">
                      {forecast.factors.map((factor) => (
                        <li
                          key={factor}
                          className="flex items-start gap-1.5 text-[11px] text-foreground"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Current vs Forecast */}
                  <div className="mt-3 flex items-center gap-2 rounded bg-secondary/50 px-2 py-1.5">
                    <span className="text-[10px] text-muted-foreground">
                      Current:
                    </span>
                    <span className="text-[10px] font-bold text-foreground">
                      {forecast.currentNOI}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {" -> "}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Forecast:
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-bold",
                        forecast.positive
                          ? "text-accent"
                          : "text-destructive"
                      )}
                    >
                      {forecast.forecastNOI}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
