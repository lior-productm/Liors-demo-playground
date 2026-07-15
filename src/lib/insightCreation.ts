import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";
import { DASHBOARD_STATE_KEYS } from "@/src/lib/dashboardState";
import {
  INSIGHTS_SEED,
  type InsightCardModel,
} from "@/src/components/pages/insights-data";

/**
 * Persist a new insight created through the Ask Amiio "Create new insight"
 * flow so it surfaces on the Insights dashboard.
 */
export function createInsightFromAskAi(input: {
  topic: string;
  formula: string;
  frequency: string;
}): InsightCardModel {
  const now = new Date();
  const triggeredLabel = `Today, ${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const insight: InsightCardModel = {
    id: `insight-${Date.now()}`,
    active: true,
    title: input.topic,
    subtitle: input.formula,
    tags: [
      { label: "Custom", variant: "accent" },
      { label: input.frequency, variant: "neutral" },
    ],
    workflowType: "insight",
    updatedLabel: "Created just now",
    triggeredAt: now.toISOString().slice(0, 10),
    triggeredLabel,
    createdBy: "Tomer Zakai",
    isNew: true,
    kanbanColumn: "backlog",
    overviewBucket: "new_information",
    impact: "standard",
  };

  const existing = readLocalJson<InsightCardModel[]>(
    DASHBOARD_STATE_KEYS.insightsData,
    [...INSIGHTS_SEED],
  );
  writeLocalJson(DASHBOARD_STATE_KEYS.insightsData, [insight, ...existing]);
  // Flag the freshly created insight so the dashboard can land on it,
  // auto-expand the full description and show the purple "new" dot.
  writeLocalJson(DASHBOARD_STATE_KEYS.insightsFocus, insight.id);

  return insight;
}
