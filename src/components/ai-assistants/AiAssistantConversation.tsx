"use client";

import { useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WorkflowAiBlock,
  WorkflowThinkingIndicator,
  WorkflowUserBubble,
} from "@/src/components/workflows/WorkflowChatUi";

export type AiAssistantChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: readonly string[];
};

function SuggestionChip({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-10 shrink-0 items-center gap-1 rounded-[32px] border-[1.5px] border-[#E6E8EB] bg-white px-3 py-2 text-left transition-colors hover:bg-[#FAFBFC] disabled:opacity-50",
      )}
    >
      <Sparkles className="size-4 shrink-0 text-[#65686B]" strokeWidth={1.75} aria-hidden />
      <span className="text-sm font-medium leading-none text-[#65686B]">{label}</span>
    </button>
  );
}

export function AiAssistantConversation({
  messages,
  isTyping,
  onSuggestionSelect,
  className,
}: {
  messages: AiAssistantChatMessage[];
  isTyping?: boolean;
  onSuggestionSelect?: (suggestion: string) => void;
  className?: string;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) return null;

  return (
    <div
      className={cn(
        "flex w-full max-w-[661px] flex-col gap-4 overflow-y-auto text-left",
        className,
      )}
    >
      {messages.map((message) =>
        message.role === "user" ? (
          <WorkflowUserBubble key={message.id} size="sm">
            {message.content}
          </WorkflowUserBubble>
        ) : (
          <WorkflowAiBlock key={message.id} question={message.content}>
            {message.suggestions?.length ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {message.suggestions.map((suggestion) => (
                  <SuggestionChip
                    key={suggestion}
                    label={suggestion}
                    disabled={isTyping}
                    onClick={() => onSuggestionSelect?.(suggestion)}
                  />
                ))}
              </div>
            ) : null}
          </WorkflowAiBlock>
        ),
      )}
      {isTyping ? <WorkflowThinkingIndicator /> : null}
      <div ref={endRef} aria-hidden />
    </div>
  );
}
