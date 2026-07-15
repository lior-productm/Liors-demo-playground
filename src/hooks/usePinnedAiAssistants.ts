"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AI_ASSISTANT_NAV_CHANGED,
  pinAiAssistant,
  readPinnedAiAssistants,
  type PinnedAiAssistantId,
} from "@/src/lib/aiAssistantNavState";

export function usePinnedAiAssistants() {
  const [pinned, setPinned] = useState<PinnedAiAssistantId[]>(() =>
    typeof window === "undefined" ? [] : readPinnedAiAssistants(),
  );

  const refresh = useCallback(() => {
    setPinned(readPinnedAiAssistants());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(AI_ASSISTANT_NAV_CHANGED, refresh);
    return () => window.removeEventListener(AI_ASSISTANT_NAV_CHANGED, refresh);
  }, [refresh]);

  const pin = useCallback((id: PinnedAiAssistantId) => {
    pinAiAssistant(id);
  }, []);

  return { pinned, pin };
}
