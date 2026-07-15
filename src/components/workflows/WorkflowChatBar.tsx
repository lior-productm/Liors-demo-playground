"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AmiioFocusChatBar } from "@/src/components/commercial/AmiioFocusChatBar";
import { SHELL_ASK_AI_CHAT_BAR_MAX_PX } from "@/src/lib/shellLayout";

/** Full-view workflow chat bar — matches Ask Amiio {@link AmiioFocusChatBar} layout. */
export function WorkflowChatBar({
  className,
  formClassName,
  placeholder = "Ask me anything",
  floating = false,
  isTyping = false,
  draft: draftProp,
  onDraftChange,
  error,
  inputRef: inputRefProp,
  onSend,
}: {
  className?: string;
  formClassName?: string;
  placeholder?: string;
  floating?: boolean;
  isTyping?: boolean;
  draft?: string;
  onDraftChange?: (value: string) => void;
  error?: string | null;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onSend?: (message: string) => void;
}) {
  const [uncontrolledDraft, setUncontrolledDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = inputRefProp ?? internalInputRef;
  const disabled = isSending || isTyping;
  const controlled = draftProp !== undefined;
  const draft = controlled ? draftProp : uncontrolledDraft;

  const setDraft = (value: string) => {
    if (controlled) onDraftChange?.(value);
    else setUncontrolledDraft(value);
  };

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (!trimmed || disabled) return;

    setIsSending(true);
    onSend?.(trimmed);
    if (!onSend) {
      window.dispatchEvent(
        new CustomEvent("amiio:toast", {
          detail: { message: "Workflow assistant is processing your request…" },
        }),
      );
    }
    if (!controlled) setUncontrolledDraft("");
    window.setTimeout(() => setIsSending(false), 600);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit();
  };

  return (
    <div className={cn("flex w-full flex-col items-center gap-2", className)}>
      <form
        onSubmit={handleFormSubmit}
        style={{ maxWidth: SHELL_ASK_AI_CHAT_BAR_MAX_PX }}
        className={cn("w-full", formClassName)}
      >
        <AmiioFocusChatBar
          layout="full"
          draft={draft}
          error={error}
          isTyping={isTyping || isSending}
          placeholder={placeholder}
          inputRef={inputRef}
          onDraftChange={setDraft}
          onSubmit={handleSubmit}
          className={floating ? "shadow-[0_8px_24px_rgba(0,0,0,0.12)]" : undefined}
        />
      </form>
      <p className="whitespace-nowrap text-center text-[12px] font-normal leading-[1.5] text-[#969A9E]">
        Amiio AI can make mistakes. Check important info.
      </p>
    </div>
  );
}
