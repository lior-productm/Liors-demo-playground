"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteWorkflowSession,
  readWorkflowSessions,
  renameWorkflowSession,
  upsertWorkflowSession,
} from "@/src/lib/workflowSessions";
import type { WorkflowSession } from "@/src/types/workflows";

export function useWorkflowSessions() {
  const [sessions, setSessions] = useState<WorkflowSession[]>(() =>
    typeof window === "undefined" ? [] : readWorkflowSessions(),
  );

  const refresh = useCallback(() => {
    setSessions(readWorkflowSessions());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("amiio:workflow-sessions-changed", onChange);
    return () => window.removeEventListener("amiio:workflow-sessions-changed", onChange);
  }, [refresh]);

  const saveSession = useCallback(
    (session: WorkflowSession) => {
      upsertWorkflowSession(session);
      window.dispatchEvent(new CustomEvent("amiio:workflow-sessions-changed"));
    },
    [],
  );

  const removeSession = useCallback((id: string) => {
    deleteWorkflowSession(id);
    window.dispatchEvent(new CustomEvent("amiio:workflow-sessions-changed"));
  }, []);

  const renameSession = useCallback((id: string, title: string) => {
    renameWorkflowSession(id, title);
    window.dispatchEvent(new CustomEvent("amiio:workflow-sessions-changed"));
  }, []);

  return { sessions, saveSession, removeSession, renameSession, refresh };
}
