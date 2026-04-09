/** Shared copy for inline “Full description / Recent actions” panels — no imports from InsightsManageInsightsSection to avoid circular deps. */

type InsightOverviewBucket = "insights" | "anomalies" | "new_information";

const OVERVIEW_BUCKET_LABEL: Record<InsightOverviewBucket, string> = {
  insights: "Insights",
  anomalies: "Anomalies",
  new_information: "New information",
};

type CardForExpandedCopy = {
  fullDescription?: string;
  subtitle: string;
  overviewBucket: InsightOverviewBucket;
  impact: "standard" | "high";
  triggeredAt: string;
  expandDetail?: {
    triggered: string;
    createdOn: string;
    updatedBy: string;
  };
  recentActionLines?: string[];
  updatedLabel: string;
  active: boolean;
};

export function insightInlineFullDescription(card: CardForExpandedCopy): string {
  if (card.fullDescription) return card.fullDescription;
  return `${card.subtitle}\n\nThis signal sits in the ${OVERVIEW_BUCKET_LABEL[card.overviewBucket]} bucket on the overview. Impact is ${card.impact === "high" ? "high — it appears under Significant insights" : "standard"}. Last evaluation window uses trigger reference ${card.triggeredAt}.`;
}

export function insightInlineRecentActions(card: CardForExpandedCopy): string[] {
  if (card.recentActionLines?.length) return card.recentActionLines;
  const d = card.expandDetail;
  if (d) {
    return [
      `Rule fired ${d.triggered}.`,
      `Instruction snapshot maintained by ${d.updatedBy} (created ${d.createdOn}).`,
      "Use Edit to adjust thresholds or notification routing.",
    ];
  }
  return [
    card.updatedLabel,
    card.active
      ? "Monitoring is on; Amiio will re-evaluate on the next data refresh."
      : "Monitoring is paused — toggle Active on the card to resume.",
  ];
}
