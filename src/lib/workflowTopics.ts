import type { WorkflowIntentId, WorkflowSession, WorkflowTopicId } from "@/src/types/workflows";

export const WORKFLOW_TOPICS: {
  id: WorkflowTopicId;
  label: string;
}[] = [
  { id: "leasing-renewal", label: "Lease Renewal" },
  { id: "service-charge-settlement", label: "Service Charge Settlement" },
  { id: "market-research", label: "Market Research" },
  { id: "financial-forecasting", label: "Financial Forecasting" },
  { id: "esg", label: "ESG" },
];

export function intentToTopic(intent: WorkflowIntentId): WorkflowTopicId | undefined {
  switch (intent) {
    case "lease-renewal":
      return "leasing-renewal";
    case "service-charge-settlement":
      return "service-charge-settlement";
    case "prepare-report":
      return "reporting";
    case "market-research":
      return "market-research";
    case "financial-forecasting":
      return "financial-forecasting";
    case "something-else":
      return undefined;
  }
}

export function getSessionTopic(session: WorkflowSession): WorkflowTopicId | undefined {
  if (session.topic) return session.topic;
  if (!session.intent) return undefined;
  return intentToTopic(session.intent);
}

export function isOrphanWorkflowDraft(session: WorkflowSession): boolean {
  return !getSessionTopic(session) && (session.step === "intent" || session.step === "custom-intent");
}

export function getTopicOverviewHref(topicId: WorkflowTopicId): string | undefined {
  switch (topicId) {
    case "leasing-renewal":
      return "/workflows/leasing-renewal";
    case "service-charge-settlement":
      return "/workflows/service-charge-settlement";
    case "market-research":
    case "financial-forecasting":
    case "esg":
      return "/workflows/new";
    default:
      return undefined;
  }
}

export function getTopicLabel(topicId: WorkflowTopicId): string {
  return WORKFLOW_TOPICS.find((t) => t.id === topicId)?.label ?? topicId;
}

/** Which workflow topic row should show focus — at most one at a time. */
export function getActiveWorkflowTopicId(
  pathname: string,
  sessions: WorkflowSession[],
): WorkflowTopicId | null {
  if (pathname === "/workflows/leasing-renewal") {
    return "leasing-renewal";
  }
  if (pathname === "/workflows/service-charge-settlement") {
    return "service-charge-settlement";
  }

  // Shared overview route — do not highlight every topic that links here.
  if (pathname === "/workflows/new") {
    return null;
  }

  const match = pathname.match(/^\/workflows\/([^/]+)$/);
  if (!match || match[1] === "new") return null;

  const session = sessions.find((item) => item.id === match[1]);
  return session ? (getSessionTopic(session) ?? null) : null;
}

export function getInitialExpandedWorkflowTopics(
  pathname: string,
  sessions: WorkflowSession[],
): Record<WorkflowTopicId, boolean> {
  const topics: Record<WorkflowTopicId, boolean> = {
    "leasing-renewal": false,
    "service-charge-settlement": false,
    reporting: false,
    "market-research": false,
    "financial-forecasting": false,
    esg: false,
  };

  if (
    pathname === "/workflows/new" ||
    pathname === "/workflows/leasing-renewal" ||
    pathname === "/workflows/service-charge-settlement"
  ) {
    if (pathname === "/workflows/leasing-renewal") {
      topics["leasing-renewal"] = true;
    }
    if (pathname === "/workflows/service-charge-settlement") {
      topics["service-charge-settlement"] = true;
    }
    return topics;
  }

  const match = pathname.match(/^\/workflows\/([^/]+)$/);
  if (!match || match[1] === "new") return topics;

  const session = sessions.find((item) => item.id === match[1]);
  const topic = session ? getSessionTopic(session) : undefined;
  if (topic) topics[topic] = true;

  return topics;
}
