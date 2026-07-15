"use client";

import { SidebarChatInputDock } from "@/src/components/commercial/ChatPanel";
import { LEASE_ANALYST_CHAT_BAR_SUGGESTIONS } from "@/src/lib/aiAssistantsData";

/** Ask Amiio full-page chat bar for Lease Analyst — Figma 1172:62206. */
export function AiAssistantChatBar({
  draft,
  isTyping,
  inputRef,
  onDraftChange,
  onSubmit,
  className,
  suggestions = LEASE_ANALYST_CHAT_BAR_SUGGESTIONS,
  placeholder = "Ask me anything",
  rotateSuggestions = true,
}: {
  draft: string;
  isTyping?: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onDraftChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  className?: string;
  suggestions?: readonly string[];
  placeholder?: string;
  rotateSuggestions?: boolean;
}) {
  const showRotatingSuggestions =
    rotateSuggestions && suggestions.length > 0 && !draft.trim();

  return (
    <SidebarChatInputDock
      layout="full"
      className={className}
      draft={draft}
      error={null}
      isTyping={isTyping}
      inputRef={inputRef}
      onDraftChange={onDraftChange}
      onSubmit={onSubmit}
      placeholder={placeholder}
      rotatingSuggestions={showRotatingSuggestions ? suggestions : undefined}
    />
  );
}
