"use client";

import { createContext, useContext } from "react";

type ChatContextValue = { openChat: () => void };

export const AiAnalystsChatContext = createContext<ChatContextValue>({
  openChat: () => {},
});

/** Lets nested components (Custom task, Edit with AI) open the docked Ask Amiio chat. */
export function useAiAnalystsChat() {
  return useContext(AiAnalystsChatContext);
}
