import type { WorkflowIntentId, WorkflowSession } from "@/src/types/workflows";
import { intentToTopic, isOrphanWorkflowDraft } from "@/src/lib/workflowTopics";
import {
  migrateSessionStorageToLocal,
  readLocalJson,
  writeLocalJson,
} from "@/src/lib/browserStorage";

const STORAGE_KEY = "amiio:workflow-sessions";

function ensureMigrated() {
  migrateSessionStorageToLocal(STORAGE_KEY);
}

export function readWorkflowSessions(): WorkflowSession[] {
  if (typeof window === "undefined") return [];
  ensureMigrated();
  try {
    return readLocalJson<WorkflowSession[]>(STORAGE_KEY, []);
  } catch {
    return [];
  }
}

export function writeWorkflowSessions(sessions: WorkflowSession[]) {
  writeLocalJson(STORAGE_KEY, sessions);
}

export function upsertWorkflowSession(session: WorkflowSession) {
  const sessions = readWorkflowSessions().filter((s) => s.id !== session.id);
  writeWorkflowSessions([{ ...session, updatedAt: Date.now() }, ...sessions]);
}

export function deleteWorkflowSession(id: string) {
  writeWorkflowSessions(readWorkflowSessions().filter((s) => s.id !== id));
}

export function renameWorkflowSession(id: string, title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;
  const sessions = readWorkflowSessions();
  const index = sessions.findIndex((s) => s.id === id);
  if (index === -1) return;
  sessions[index] = { ...sessions[index], title: trimmed, updatedAt: Date.now() };
  writeWorkflowSessions(sessions);
}

export function createWorkflowSession(): WorkflowSession {
  const kept = readWorkflowSessions().filter((session) => !isOrphanWorkflowDraft(session));
  writeWorkflowSessions(kept);

  const session: WorkflowSession = {
    id: `wf-${Date.now()}`,
    title: "New workflow",
    step: "intent",
    createdAt: Date.now(),
  };
  upsertWorkflowSession(session);
  notifyWorkflowSessionsChanged();
  return session;
}

/** Opens a blank workflow chat (prompt chips landing) at `/workflows/{id}`. */
export function startNewWorkflowChat(router: { push: (href: string) => void }): WorkflowSession {
  const session = createWorkflowSession();
  router.push(`/workflows/${session.id}`);
  return session;
}

export function createWorkflowSessionForIntent(intent: WorkflowIntentId): WorkflowSession {
  const kept = readWorkflowSessions().filter((session) => !isOrphanWorkflowDraft(session));
  writeWorkflowSessions(kept);

  const topic = intentToTopic(intent);
  const session: WorkflowSession = {
    id: `wf-${Date.now()}`,
    title:
      intent === "lease-renewal"
        ? "Lease Renewal"
        : intent === "prepare-report"
          ? "Prepare a Report"
          : intent === "financial-forecasting"
            ? "Financial Forecasting"
            : intent === "market-research"
              ? "Market Research"
              : "New workflow",
    step: intent === "lease-renewal" ? "lease-scope" : "complete",
    intent,
    topic,
    createdAt: Date.now(),
  };
  upsertWorkflowSession(session);
  notifyWorkflowSessionsChanged();
  return session;
}

export function getWorkflowSession(id: string): WorkflowSession | undefined {
  return readWorkflowSessions().find((s) => s.id === id);
}

export function notifyWorkflowSessionsChanged() {
  window.dispatchEvent(new CustomEvent("amiio:workflow-sessions-changed"));
}
