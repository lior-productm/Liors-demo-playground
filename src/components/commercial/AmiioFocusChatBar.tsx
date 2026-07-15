"use client";

import { useState } from "react";
import { Loader2, Mic, Plus, Send, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { UpwardSuggestionCarousel } from "@/src/components/ai-assistants/UpwardSuggestionCarousel";
import {
  SHELL_ASK_AI_CHAT_BAR_HEIGHT_PX,
  SHELL_ASK_AI_CHAT_BAR_MAX_PX,
  SHELL_SIDEBAR_CHAT_INPUT_MAX_PX,
} from "@/src/lib/shellLayout";

const FOCUS_SHADOW = "shadow-[0px_0px_7px_2px_rgba(122,139,235,0.5)]";

export type AmiioFocusChatBarLayout = "sidebar" | "full";

export function AmiioFocusChatBar({
  layout = "full",
  draft,
  error,
  isTyping,
  reasoning,
  placeholder = "Ask me anything",
  rotatingSuggestions,
  inputRef,
  onDraftChange,
  onSubmit,
  onStop,
  onExpandPanel,
  className,
}: {
  layout?: AmiioFocusChatBarLayout;
  draft: string;
  error?: string | null;
  isTyping?: boolean;
  reasoning?: boolean;
  placeholder?: string;
  rotatingSuggestions?: readonly string[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  onExpandPanel?: () => void;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const isSidebar = layout === "sidebar";
  const isFull = layout === "full";
  const canSend = draft.trim().length > 0 && !reasoning && !isTyping;
  const showRotatingSuggestions =
    Boolean(rotatingSuggestions?.length) && !draft.trim() && !focused && !reasoning;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col justify-center border bg-white transition-shadow",
        isFull ? "border-[#D1D5D9]" : "border-[#E9E9E9]",
        focused ? FOCUS_SHADOW : isSidebar ? "shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]" : "",
        error ? "border-red-400" : "",
        className,
      )}
      style={
        isSidebar
          ? {
              height: 42,
              maxWidth: SHELL_SIDEBAR_CHAT_INPUT_MAX_PX,
              borderRadius: 24,
              padding: "0 20px",
            }
          : {
              height: SHELL_ASK_AI_CHAT_BAR_HEIGHT_PX,
              maxWidth: SHELL_ASK_AI_CHAT_BAR_MAX_PX,
              borderRadius: 28,
              padding: 10,
            }
      }
    >
      <div className="flex items-center justify-between gap-2">
        {reasoning ? (
          <div className="flex min-w-0 flex-1 items-center gap-2 pl-0.5">
            <div className="relative flex size-8 shrink-0 items-center justify-center">
              <Square className="size-2.5 fill-[#65686B]" />
              <span
                className="pointer-events-none absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#A7B2F2]"
                aria-hidden
              />
            </div>
            <p className="truncate text-[13px] font-normal leading-5 text-[#65686B]">
              Analyzing data...
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center",
              isFull ? "gap-2.5" : "gap-[15px]",
            )}
          >
            {isFull ? (
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#D1D5D9] text-[#353638] transition-colors hover:bg-[#F0F2F5]"
                aria-label="Attach"
              >
                <Plus className="size-5" strokeWidth={1.75} />
              </button>
            ) : (
              <button
                type="button"
                className="flex shrink-0 items-center justify-center text-[#757575]"
                aria-label="Attach"
              >
                <Plus className="size-[15px]" strokeWidth={1.75} />
              </button>
            )}
            <div className="relative min-w-0 flex-1">
              {showRotatingSuggestions && rotatingSuggestions ? (
                <UpwardSuggestionCarousel
                  suggestions={rotatingSuggestions}
                  paused={Boolean(draft.trim()) || focused || Boolean(isTyping)}
                />
              ) : null}
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => onDraftChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={showRotatingSuggestions ? undefined : placeholder}
                disabled={Boolean(isTyping && !reasoning)}
                aria-label={showRotatingSuggestions ? "Ask Lease Analyst" : undefined}
                className={cn(
                  "min-w-0 w-full bg-transparent outline-none disabled:opacity-50",
                  isFull
                    ? "text-[16px] font-normal leading-6 text-[#353638] placeholder:text-[#8F8F8F]"
                    : "text-[14px] font-normal leading-normal tracking-[0.25px] text-[#353638] placeholder:text-[#757575]",
                )}
              />
            </div>
          </div>
        )}

        <div className={cn("flex shrink-0 items-center", isFull ? "gap-2" : "gap-3")}>
          {onExpandPanel && !reasoning && !isSidebar ? (
            <button
              type="button"
              onClick={onExpandPanel}
              className="flex size-5 items-center justify-center text-[#7E8185] transition-colors hover:text-[#353638]"
              aria-label="Open side panel"
            >
              <Plus className="size-4" strokeWidth={1.75} />
            </button>
          ) : null}

          {reasoning ? (
            <button
              type="button"
              onClick={onStop}
              className="flex size-8 items-center justify-center rounded-full bg-[rgba(230,231,232,0.7)] text-[#65686B]"
              aria-label="Stop"
            >
              <Square className="size-2.5 fill-current" />
            </button>
          ) : isSidebar ? (
            <button
              type="button"
              disabled={isTyping}
              onClick={onSubmit}
              className="ml-2 flex size-4 shrink-0 items-center justify-center text-[#757575] transition-colors hover:text-[#353638] disabled:opacity-50"
              aria-label="Send"
            >
              {isTyping ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" strokeWidth={2} />
              )}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full text-[#353638] transition-colors hover:bg-[#F0F2F5]"
                aria-label="Voice input"
              >
                <Mic className="size-5" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                disabled={!canSend}
                onClick={onSubmit}
                className="flex size-8 items-center justify-center rounded-[32px] bg-[#040617] p-[6.667px] text-white shadow-[0px_6.667px_9.333px_rgba(0,0,0,0.14)] transition-opacity disabled:opacity-50"
                aria-label="Send"
              >
                {isTyping ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" strokeWidth={2} />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
