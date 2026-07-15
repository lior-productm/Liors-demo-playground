import type { AskAiSession } from "@/src/types/askAi";
import {
  migrateSessionStorageToLocal,
  readLocalJson,
  writeLocalJson,
} from "@/src/lib/browserStorage";

const STORAGE_KEY = "amiio:ask-ai-sessions";

function ensureMigrated() {
  migrateSessionStorageToLocal(STORAGE_KEY);
}

export function readAskAiSessions(): AskAiSession[] {
  if (typeof window === "undefined") return [];
  ensureMigrated();
  try {
    return readLocalJson<AskAiSession[]>(STORAGE_KEY, []);
  } catch {
    return [];
  }
}

export function writeAskAiSessions(sessions: AskAiSession[]) {
  writeLocalJson(STORAGE_KEY, sessions);
}

export function upsertAskAiSession(session: AskAiSession) {
  const sessions = readAskAiSessions().filter((s) => s.id !== session.id);
  writeAskAiSessions([{ ...session, updatedAt: Date.now() }, ...sessions]);
}

export function deleteAskAiSession(id: string) {
  writeAskAiSessions(readAskAiSessions().filter((s) => s.id !== id));
}

export function renameAskAiSession(id: string, title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;
  const sessions = readAskAiSessions();
  const index = sessions.findIndex((s) => s.id === id);
  if (index === -1) return;
  sessions[index] = { ...sessions[index], title: trimmed, updatedAt: Date.now() };
  writeAskAiSessions(sessions);
}

export function createAskAiSession(options?: { viaPlus?: boolean }): AskAiSession {
  const kept = readAskAiSessions().filter((session) => !isOrphanAskAiDraft(session));
  writeAskAiSessions(kept);

  const session: AskAiSession = {
    id: `ai-${Date.now()}`,
    title: "New chat",
    messages: [],
    createdViaPlus: options?.viaPlus ?? false,
    createdAt: Date.now(),
  };
  upsertAskAiSession(session);
  notifyAskAiSessionsChanged();
  return session;
}

/** Sessions shown in the sidebar — exclude empty chats not started via + */
export function listSidebarAskAiSessions(): AskAiSession[] {
  return readAskAiSessions().filter(
    (session) => session.messages.length > 0 || session.createdViaPlus,
  );
}

export function getAskAiSession(id: string): AskAiSession | undefined {
  return readAskAiSessions().find((s) => s.id === id);
}

export function notifyAskAiSessionsChanged() {
  window.dispatchEvent(new CustomEvent("amiio:ask-ai-sessions-changed"));
}

export function isOrphanAskAiDraft(session: AskAiSession): boolean {
  return session.messages.length === 0 && !session.createdViaPlus;
}
