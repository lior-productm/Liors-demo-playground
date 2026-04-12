"use client";

import { InsightsAlertsLayout } from "@/components/insights/insights-alerts-layout";
import type { Screen } from "@/components/sidebar-nav";

interface InsightsScreenProps {
  onNavigate: (screen: Screen) => void;
  onHighlightRows: (rows: number[]) => void;
  onHighlightAnomalies: (cells: { row: number; col: number }[]) => void;
}

export function InsightsScreen({
  onNavigate,
  onHighlightRows,
  onHighlightAnomalies,
}: InsightsScreenProps) {
  return (
    <InsightsAlertsLayout
      onOpenAnalysis={() => onNavigate("chat")}
      onHighlightRows={onHighlightRows}
      onHighlightAnomalies={onHighlightAnomalies}
    />
  );
}
