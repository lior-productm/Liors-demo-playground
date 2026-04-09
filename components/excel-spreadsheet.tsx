"use client";

import { cn } from "@/lib/utils";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { AlertTriangle, Sparkles } from "lucide-react";
import { TrendDirectionGlyph } from "@/src/components/commercial/TrendPill";

interface CellAnnotation {
  row: number;
  col: number;
  type: "anomaly" | "opportunity" | "trend" | "ai-flag";
  tooltip: string;
}

interface ExcelSpreadsheetProps {
  highlightedRows?: number[];
  anomalyCells?: { row: number; col: number }[];
  opportunityCells?: { row: number; col: number }[];
  activeInsightId?: string | null;
}

const columns = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

const headers = [
  "Asset Name",
  "Type",
  "Location",
  "NOI (Actual)",
  "NOI (Budget)",
  "Variance %",
  "Occupancy",
  "Tenant Count",
  "WAULT",
  "Cap Rate",
  "Debt Ratio",
  "Market Value",
  "Trend (2Y)",
];

const data = [
  ["Tower One Office", "Office", "Tel Aviv", "4,250,000", "4,100,000", "+3.7%", "94.2%", "18", "4.8", "6.2%", "58%", "68,500,000", "+12%"],
  ["Central Mall", "Retail", "Herzliya", "2,180,000", "2,450,000", "-11.0%", "87.3%", "42", "3.2", "7.1%", "62%", "30,700,000", "-8%"],
  ["Logistics Park A", "Logistics", "Haifa", "1,890,000", "1,750,000", "+8.0%", "100%", "5", "6.5", "5.8%", "45%", "32,600,000", "+22%"],
  ["Residence Heights", "Residential", "Jerusalem", "3,420,000", "3,380,000", "+1.2%", "96.8%", "124", "2.1", "4.9%", "71%", "69,800,000", "+6%"],
  ["Tech Campus B", "Office", "Ra'anana", "5,100,000", "5,200,000", "-1.9%", "91.5%", "12", "5.3", "6.0%", "54%", "85,000,000", "+9%"],
  ["Green Park Logistics", "Logistics", "Be'er Sheva", "980,000", "920,000", "+6.5%", "100%", "3", "8.2", "7.5%", "38%", "13,100,000", "+18%"],
  ["Harbor Retail Center", "Retail", "Ashdod", "1,560,000", "1,680,000", "-7.1%", "82.1%", "35", "2.8", "7.8%", "67%", "20,000,000", "-12%"],
  ["Skyline Apartments", "Residential", "Netanya", "2,740,000", "2,700,000", "+1.5%", "98.1%", "86", "1.9", "4.5%", "73%", "60,900,000", "+4%"],
  ["Innovation Tower", "Office", "Petah Tikva", "3,850,000", "3,900,000", "-1.3%", "89.7%", "15", "4.1", "6.3%", "56%", "61,100,000", "+7%"],
  ["Mega Logistics Hub", "Logistics", "Lod", "2,320,000", "2,100,000", "+10.5%", "100%", "7", "7.1", "6.1%", "42%", "38,000,000", "+26%"],
  ["City Center Mall", "Retail", "Rishon LeZion", "1,890,000", "2,050,000", "-7.8%", "84.5%", "38", "3.5", "7.3%", "59%", "25,900,000", "-5%"],
  ["Prestige Residences", "Residential", "Herzliya Pituach", "4,100,000", "4,050,000", "+1.2%", "97.3%", "64", "2.4", "4.2%", "68%", "97,600,000", "+15%"],
];

// Persistent inline annotations that show on the Excel itself
const inlineAnnotations: CellAnnotation[] = [
  // Anomalies - red flags
  { row: 1, col: 5, type: "anomaly", tooltip: "NOI -11% below budget - Anchor tenant lost Q2" },
  { row: 1, col: 6, type: "anomaly", tooltip: "Occupancy dropped 5.2% YoY" },
  { row: 6, col: 6, type: "anomaly", tooltip: "Critically low occupancy - new competitor nearby" },
  { row: 6, col: 5, type: "anomaly", tooltip: "NOI -7.1% variance with downward trend" },
  { row: 10, col: 5, type: "anomaly", tooltip: "Retail NOI declining - road construction impact" },
  // High debt warnings
  { row: 3, col: 10, type: "anomaly", tooltip: "Debt ratio 71% exceeds 65% target" },
  { row: 7, col: 10, type: "anomaly", tooltip: "Highest leverage in portfolio at 73%" },
  // Opportunities - green flags
  { row: 2, col: 3, type: "opportunity", tooltip: "Logistics outperforming +8% - expansion potential" },
  { row: 9, col: 3, type: "opportunity", tooltip: "Logistics +10.5% - strongest performer" },
  { row: 5, col: 3, type: "opportunity", tooltip: "Logistics +6.5% - full occupancy maintained" },
  // Trend flags - tenant increase from 2 years ago
  { row: 2, col: 12, type: "trend", tooltip: "Tenant count +22% over 2 years - budget optimization opportunity" },
  { row: 9, col: 12, type: "trend", tooltip: "+26% growth in 2 years - highest in portfolio" },
  { row: 11, col: 12, type: "trend", tooltip: "+15% growth - Herzliya Pituach demand rising" },
  // AI-detected patterns
  { row: 0, col: 7, type: "ai-flag", tooltip: "Amiio: Tenant count increased 40% in 2Y - renegotiate rates" },
  { row: 2, col: 7, type: "ai-flag", tooltip: "Amiio: 5 tenants, all long-term - optimize insurance costs" },
  { row: 11, col: 7, type: "ai-flag", tooltip: "Amiio: Tenant demand up - opportunity to increase rent 8-12%" },
];

export function ExcelSpreadsheet({
  highlightedRows = [],
  anomalyCells = [],
  opportunityCells = [],
  activeInsightId,
}: ExcelSpreadsheetProps) {
  const isAnomaly = (row: number, col: number) =>
    anomalyCells.some((c) => c.row === row && c.col === col);
  const isOpportunity = (row: number, col: number) =>
    opportunityCells.some((c) => c.row === row && c.col === col);
  const getAnnotation = (row: number, col: number) =>
    inlineAnnotations.find((a) => a.row === row && a.col === col);

  return (
    <div className="flex-1 overflow-hidden bg-card">
      {/* Excel Toolbar */}
      <div className="flex items-center gap-1 border-b border-border bg-secondary/50 px-2 py-1">
        <div className="flex items-center gap-1">
          <div className="flex h-7 items-center gap-1.5 rounded border border-border bg-card px-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">D2</span>
          </div>
          <div className="hidden h-7 flex-1 items-center rounded border border-border bg-card px-2 text-xs text-muted-foreground md:flex">
            <span className="font-mono">{"=SUM(D2:D13)"}</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Legend */}
          <div className="hidden items-center gap-3 rounded-md border border-border bg-card px-2.5 py-1 lg:flex">
            <div className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm border-2 border-destructive bg-destructive/10" />
              <span className="text-[10px] text-muted-foreground">Anomaly</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-sm border-2 border-accent bg-accent/10" />
              <span className="text-[10px] text-muted-foreground">Opportunity</span>
            </div>
            <div className="flex items-center gap-1">
              <AmiioAiDisclaimerTrigger wrapChild>
                <Sparkles className="h-2.5 w-2.5 text-primary" />
              </AmiioAiDisclaimerTrigger>
              <span className="text-[10px] text-muted-foreground">AI Insight</span>
            </div>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            {["B", "I", "U"].map((format) => (
              <button
                key={format}
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded text-xs text-muted-foreground hover:bg-secondary"
              >
                <span className={format === "B" ? "font-bold" : format === "I" ? "italic" : "underline"}>
                  {format}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sheet Tabs */}
      <div className="flex items-center border-b border-border bg-secondary/30">
        <div className="flex items-center gap-0.5 px-1 py-0.5">
          <button
            type="button"
            className="rounded-t border border-b-0 border-border bg-card px-3 py-1 text-xs font-medium text-foreground"
          >
            Portfolio Overview
          </button>
          <button
            type="button"
            className="rounded-t border border-b-0 border-transparent px-3 py-1 text-xs text-muted-foreground hover:bg-secondary/50"
          >
            Cash Flow
          </button>
          <button
            type="button"
            className="rounded-t border border-b-0 border-transparent px-3 py-1 text-xs text-muted-foreground hover:bg-secondary/50"
          >
            Debt Schedule
          </button>
          <button
            type="button"
            className="rounded-t border border-b-0 border-transparent px-3 py-1 text-xs text-muted-foreground hover:bg-secondary/50"
          >
            Tenant Analysis
          </button>
        </div>
      </div>

      {/* Proactive AI Banner in Excel */}
      <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/5 px-3 py-1.5">
        <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary animate-ai-pulse" />
        </AmiioAiDisclaimerTrigger>
        <p className="flex-1 truncate text-[11px] text-foreground">
          <span className="font-semibold text-primary">Amiio detected:</span>{" "}
          Tenant count increased in Logistics Park A from 3 to 5 since 2024 - budget may need adjustment.
          Tower One tenant count grew 40% in 2Y.
        </p>
        <button
          type="button"
          className="shrink-0 rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Review in Amiio
        </button>
      </div>

      {/* Spreadsheet Grid */}
      <div className="overflow-auto custom-scrollbar" style={{ height: "calc(100% - 102px)" }}>
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col || "row-header"}
                  className={cn(
                    "excel-header-cell px-2 py-1.5 text-center font-medium text-muted-foreground select-none",
                    i === 0 ? "w-8 min-w-[32px]" : "min-w-[100px]"
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Header row */}
            <tr>
              <td className="excel-row-header px-2 py-1.5 text-center font-medium text-muted-foreground select-none">
                1
              </td>
              {headers.map((header) => (
                <td
                  key={header}
                  className="excel-cell px-2 py-1.5 font-semibold text-foreground"
                >
                  {header}
                </td>
              ))}
            </tr>

            {/* Data rows */}
            {data.map((row, rowIdx) => {
              const isHighlighted = highlightedRows.includes(rowIdx);
              return (
                <tr
                  key={row[0]}
                  className={cn(
                    "group transition-colors duration-200",
                    isHighlighted && "excel-highlight-row"
                  )}
                >
                  <td className="excel-row-header px-2 py-1.5 text-center font-medium text-muted-foreground select-none">
                    {rowIdx + 2}
                  </td>
                  {row.map((cell, colIdx) => {
                    const anomalyActive = isAnomaly(rowIdx, colIdx);
                    const oppActive = isOpportunity(rowIdx, colIdx);
                    const annotation = getAnnotation(rowIdx, colIdx);

                    return (
                      <td
                        key={`${rowIdx}-${colIdx}`}
                        className={cn(
                          "excel-cell relative px-2 py-1.5 whitespace-nowrap transition-all duration-200",
                          anomalyActive && "excel-anomaly-cell",
                          oppActive && "excel-opportunity-cell",
                          colIdx >= 3 && "text-right font-mono",
                          // Inline red text for negative variances
                          cell.startsWith("-") && colIdx === 5 && "text-destructive font-medium",
                          // Inline green text for strong positive variances
                          cell.startsWith("+") && colIdx === 5 && parseFloat(cell) > 5 && "text-accent font-medium",
                          // Negative 2Y trends
                          cell.startsWith("-") && colIdx === 12 && "text-destructive font-medium",
                          // Strong positive 2Y trends
                          cell.startsWith("+") && colIdx === 12 && parseFloat(cell) > 15 && "text-accent font-semibold",
                          // Low occupancy highlight
                          colIdx === 6 && parseFloat(cell) < 88 && "text-destructive font-medium",
                          // High debt highlight
                          colIdx === 10 && parseInt(cell) > 68 && "text-destructive font-medium",
                        )}
                      >
                        <span className="relative">
                          {cell}
                          {/* Inline annotation badges */}
                          {annotation && (
                            <span
                              className={cn(
                                "absolute -right-1 -top-2 z-10",
                                annotation.type === "anomaly" && "text-destructive",
                                annotation.type === "opportunity" && "text-accent",
                                annotation.type === "trend" && "text-primary",
                                annotation.type === "ai-flag" && "text-primary",
                              )}
                              title={annotation.tooltip}
                            >
                              {annotation.type === "anomaly" && (
                                <AlertTriangle className="h-3 w-3 drop-shadow-sm" />
                              )}
                              {annotation.type === "opportunity" && (
                                <TrendDirectionGlyph
                                  direction="up"
                                  className="h-3 w-3 drop-shadow-sm"
                                />
                              )}
                              {annotation.type === "trend" && (
                                <TrendDirectionGlyph
                                  direction="up"
                                  className="h-3 w-3 drop-shadow-sm"
                                />
                              )}
                              {annotation.type === "ai-flag" && (
                                <Sparkles className="h-2.5 w-2.5 drop-shadow-sm animate-ai-pulse" />
                              )}
                            </span>
                          )}
                        </span>

                        {/* Tooltip on hover for annotated cells */}
                        {annotation && (
                          <span className="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2.5 py-1.5 text-[10px] font-normal text-foreground shadow-lg group-hover:visible">
                            <span className="flex items-center gap-1.5">
                              {annotation.type === "ai-flag" && (
                                <Sparkles className="h-3 w-3 shrink-0 text-primary" />
                              )}
                              {annotation.type === "anomaly" && (
                                <AlertTriangle className="h-3 w-3 shrink-0 text-destructive" />
                              )}
                              {annotation.type === "opportunity" && (
                                <TrendDirectionGlyph
                                  direction="up"
                                  className="h-3 w-3 shrink-0"
                                />
                              )}
                              {annotation.tooltip}
                            </span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Summary row */}
            <tr className="border-t-2 border-foreground/20 bg-secondary/40">
              <td className="excel-row-header px-2 py-1.5 text-center font-bold text-muted-foreground select-none">
                14
              </td>
              <td className="excel-cell px-2 py-1.5 font-bold text-foreground">TOTAL / AVG</td>
              <td className="excel-cell px-2 py-1.5 text-muted-foreground">12 Assets</td>
              <td className="excel-cell px-2 py-1.5 text-muted-foreground">4 Types</td>
              <td className="excel-cell px-2 py-1.5 text-right font-mono font-bold text-foreground">34,280,000</td>
              <td className="excel-cell px-2 py-1.5 text-right font-mono font-bold text-foreground">33,280,000</td>
              <td className="excel-cell px-2 py-1.5 text-right font-mono font-bold text-accent">+2.4%</td>
              <td className="excel-cell px-2 py-1.5 text-right font-mono font-bold text-foreground">93.5%</td>
              <td className="excel-cell px-2 py-1.5 text-right font-mono font-bold text-foreground">449</td>
              <td className="excel-cell px-2 py-1.5 text-right font-mono text-foreground">4.4</td>
              <td className="excel-cell px-2 py-1.5 text-right font-mono text-foreground">6.1%</td>
              <td className="excel-cell px-2 py-1.5 text-right font-mono text-foreground">58%</td>
              <td className="excel-cell px-2 py-1.5 text-right font-mono font-bold text-foreground">603,200,000</td>
              <td className="excel-cell px-2 py-1.5 text-right font-mono font-bold text-accent">+7.8%</td>
            </tr>

            {/* Empty rows for realism */}
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="excel-row-header px-2 py-1.5 text-center font-medium text-muted-foreground select-none">
                  {15 + i}
                </td>
                {columns.slice(1).map((_, j) => (
                  <td key={`empty-${i}-${j}`} className="excel-cell px-2 py-1.5" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
