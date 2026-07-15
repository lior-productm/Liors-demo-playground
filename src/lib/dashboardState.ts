import type { ChatMessage } from "@/src/types/commercial";
import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";

export const DASHBOARD_STATE_KEYS = {
  commercial: "amiio:dashboard:commercial",
  financialUi: "amiio:dashboard:financial-ui",
  reportingUi: "amiio:dashboard:reporting-ui",
  insightsUi: "amiio:dashboard:insights-ui",
  insightsData: "amiio:dashboard:insights-data",
  insightsFocus: "amiio:dashboard:insights-focus",
  chat: (id: string) => `amiio:dashboard-chat:${id}`,
} as const;

export type CommercialDashboardState = {
  view: "overview" | "rent-roll";
  selectedPortfolio: string;
  selectedEntity: string;
  selectedProperty: string;
  messages: ChatMessage[];
  chatMinimized: boolean;
};

export type FinancialDashboardUiState = {
  financialSubTab: string;
  chatExpanded: boolean;
};

export type ReportingDashboardUiState = {
  reportTab: string;
};

export type InsightsDashboardUiState = {
  insightsSubTab: string;
  chatExpanded: boolean;
};

export function readCommercialDashboardState(
  fallback: CommercialDashboardState,
): CommercialDashboardState {
  return readLocalJson(DASHBOARD_STATE_KEYS.commercial, fallback);
}

export function writeCommercialDashboardState(state: CommercialDashboardState) {
  writeLocalJson(DASHBOARD_STATE_KEYS.commercial, state);
}

export function readFinancialDashboardUi(
  fallback: FinancialDashboardUiState,
): FinancialDashboardUiState {
  return readLocalJson(DASHBOARD_STATE_KEYS.financialUi, fallback);
}

export function writeFinancialDashboardUi(state: FinancialDashboardUiState) {
  writeLocalJson(DASHBOARD_STATE_KEYS.financialUi, state);
}

export function readReportingDashboardUi(
  fallback: ReportingDashboardUiState,
): ReportingDashboardUiState {
  return readLocalJson(DASHBOARD_STATE_KEYS.reportingUi, fallback);
}

export function writeReportingDashboardUi(state: ReportingDashboardUiState) {
  writeLocalJson(DASHBOARD_STATE_KEYS.reportingUi, state);
}

export function readInsightsDashboardUi(
  fallback: InsightsDashboardUiState,
): InsightsDashboardUiState {
  return readLocalJson(DASHBOARD_STATE_KEYS.insightsUi, fallback);
}

export function writeInsightsDashboardUi(state: InsightsDashboardUiState) {
  writeLocalJson(DASHBOARD_STATE_KEYS.insightsUi, state);
}

export function readDashboardChat(persistKey: string): ChatMessage[] {
  return readLocalJson(DASHBOARD_STATE_KEYS.chat(persistKey), []);
}

export function writeDashboardChat(persistKey: string, messages: ChatMessage[]) {
  writeLocalJson(DASHBOARD_STATE_KEYS.chat(persistKey), messages);
}
