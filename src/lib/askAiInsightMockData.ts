import type { AskAiReasoningStepItem } from "@/src/components/ask-ai/AskAiReasoningStep";

/** Copy + suggestion data for the in-chat "Create new insight" flow. */

export const ASK_AI_INSIGHT_TOPIC_PROMPT =
  "Which topic would you like to create insights for?";
export const ASK_AI_INSIGHT_FREQUENCY_PROMPT =
  "How often would you like to monitor this insight?";

/** Shown after the user taps "Other" and should describe their own answer. */
export const ASK_AI_INSIGHT_TOPIC_CUSTOM_PROMPT =
  "Sure! In your own words, what topic would you like to create your insight on?";
export const ASK_AI_INSIGHT_FREQUENCY_CUSTOM_PROMPT =
  "Got it! How often would you like Amiio to monitor this insight?";

/** Figma 1901:22431–22439 — topic suggestion chips. */
export const ASK_AI_INSIGHT_TOPIC_OPTIONS = [
  "WAULT change",
  "Lease expiry",
  "Revenue trend change",
];

/** Figma 1901:22683–27812 — monitoring frequency suggestion chips. */
export const ASK_AI_INSIGHT_FREQUENCY_OPTIONS = [
  "Bi-weekly",
  "Weekly",
  "Bi-monthly",
  "Monthly",
  "Quarterly",
];

/** Derive the monitoring formula Amiio proposes for a chosen topic. */
export function deriveInsightFormula(topic: string): string {
  const key = topic.trim().toLowerCase();
  if (key.includes("wault")) return "WAULT increased more than 2%";
  if (key.includes("lease") && key.includes("expir")) return "Lease expiring within 90 days";
  if (key.includes("revenue")) return "Revenue changed more than 5%";
  if (key.includes("expense")) return "Expenses increased more than 5%";
  if (key.includes("occupanc") || key.includes("vacan")) return "Occupancy dropped more than 3%";
  if (key.includes("arrear") || key.includes("payment")) return "Outstanding balance over 30 days";
  return `${topic.trim()} threshold exceeded`;
}

/** Deep-research steps shown while Amiio assembles the insight (Figma 1901:28009–28016). */
export function buildInsightReasoningSteps(
  topic: string,
  frequency: string,
): AskAiReasoningStepItem[] {
  return [
    { id: "analysed", label: "Analysed question" },
    { id: "fetched", label: "Fetched data" },
    {
      id: "intent",
      label: `You want to monitor “${topic}” on a ${frequency.toLowerCase()} basis.`,
    },
    { id: "generating", label: "Generating your process" },
  ];
}
