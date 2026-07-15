import type { ChatMessage } from "@/src/types/commercial";

export type AskAiLeaseRenewalStep = "scope" | "tenant" | "reasoning" | "complete";

export type AskAiLeaseRenewalState = {
  step: AskAiLeaseRenewalStep;
  portfolio: string;
  entity: string;
  property: string;
  tenantId?: string;
  tenantName?: string;
};

/** In-chat "Create new insight" flow (Figma 1864:61211 → 1901:27814). */
export type AskAiInsightCreationStep =
  | "topic"
  | "frequency"
  | "thinking"
  | "validation"
  | "creating"
  | "complete";

export type AskAiInsightCreationState = {
  step: AskAiInsightCreationStep;
  topic?: string;
  frequency?: string;
  /** Set when the user picks "Other" and Amiio asks them to free-type the answer. */
  awaitingCustom?: boolean;
};

export type AskAiSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  /** In-chat lease renewal flow (Figma 1040:59706). */
  leaseRenewal?: AskAiLeaseRenewalState;
  /** In-chat insight creation flow (Figma 1901:22257 → 1901:27814). */
  insightCreation?: AskAiInsightCreationState;
  /** Set when the user explicitly starts a chat via the sidebar + button */
  createdViaPlus?: boolean;
  createdAt: number;
  updatedAt?: number;
};

export const ASK_AI_LEASE_RENEWAL_USER_MESSAGE = "Start a Lease renewal process";
export const ASK_AI_CREATE_INSIGHT_USER_MESSAGE = "Create new insight";
