"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteAskAiSession,
  listSidebarAskAiSessions,
  renameAskAiSession,
  upsertAskAiSession,
} from "@/src/lib/askAiSessions";
import type { AskAiSession } from "@/src/types/askAi";

export function useAskAiSessions() {
  const [sessions, setSessions] = useState<AskAiSession[]>([]);

  const refresh = useCallback(() => {
    setSessions(listSidebarAskAiSessions());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("amiio:ask-ai-sessions-changed", onChange);
    return () => window.removeEventListener("amiio:ask-ai-sessions-changed", onChange);
  }, [refresh]);

  const saveSession = useCallback((session: AskAiSession) => {
    upsertAskAiSession(session);
    window.dispatchEvent(new CustomEvent("amiio:ask-ai-sessions-changed"));
  }, []);

  const removeSession = useCallback((id: string) => {
    deleteAskAiSession(id);
    window.dispatchEvent(new CustomEvent("amiio:ask-ai-sessions-changed"));
  }, []);

  const renameSession = useCallback((id: string, title: string) => {
    renameAskAiSession(id, title);
    window.dispatchEvent(new CustomEvent("amiio:ask-ai-sessions-changed"));
  }, []);

  return { sessions, saveSession, removeSession, renameSession, refresh };
}
