import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";

export const AI_ASSISTANT_NAV_CHANGED = "amiio:ai-assistant-nav-changed";
export const LEASE_ANALYST_HOME = "amiio:lease-analyst-home";

const STORAGE_KEY = "amiio:ai-assistant-nav";

export type PinnedAiAssistantId = "lease-analyst";

type AiAssistantNavState = {
  pinned: PinnedAiAssistantId[];
};

function readState(): AiAssistantNavState {
  return readLocalJson<AiAssistantNavState>(STORAGE_KEY, { pinned: [] });
}

export function readPinnedAiAssistants(): PinnedAiAssistantId[] {
  return readState().pinned;
}

export function isAiAssistantPinned(id: PinnedAiAssistantId): boolean {
  return readPinnedAiAssistants().includes(id);
}

export function pinAiAssistant(id: PinnedAiAssistantId) {
  if (typeof window === "undefined") return;

  const pinned = readPinnedAiAssistants();
  if (pinned.includes(id)) return;

  writeLocalJson(STORAGE_KEY, { pinned: [...pinned, id] });
  window.dispatchEvent(new CustomEvent(AI_ASSISTANT_NAV_CHANGED));
}

export function clearPinnedAiAssistants() {
  if (typeof window === "undefined") return;

  writeLocalJson(STORAGE_KEY, { pinned: [] });
  window.dispatchEvent(new CustomEvent(AI_ASSISTANT_NAV_CHANGED));
}

export function requestLeaseAnalystHome() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LEASE_ANALYST_HOME));
}
