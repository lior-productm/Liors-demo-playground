"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Send, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SHELL_SIDEBAR_EXPANDED_PX,
  shellContentAreaCenterLeftCss,
  shellContentAreaMaxWidthCss,
} from "@/src/lib/shellLayout";
import type { ChatMessage } from "@/src/types/commercial";
import {
  AiPromptBubble,
  type ChatDraftPayload,
} from "@/src/components/commercial/ChatPanel";
import { useDraggablePosition } from "@/src/hooks/useDraggablePosition";

const FLOATING_BOTTOM_PX = 19;
/** ~87.5% of Figma 1172:66701 — proportional scale for floating chat chrome */
const FLOAT_SCALE = 0.875;
const s = (px: number) => Math.round(px * FLOAT_SCALE);

const PILL_WIDTH_PX = 124;
const PILL_HEIGHT_PX = 44;
const PILL_ICON_PX = 24;
const BAR_MAX_WIDTH_PX = s(672);
const BAR_HEIGHT_PX = s(56);
const BAR_RADIUS_PX = s(28);
const BAR_PADDING_PX = s(10);
const RESPONSE_MAX_WIDTH_PX = BAR_MAX_WIDTH_PX;

const DEFAULT_ROTATING_PROMPTS = [
  "Create a portfolio performance summary...",
  "Analyze asset performance across the portfolio",
  "Initiate a Lease Renewal workflow",
  "Draft an Investor report for Q2",
];

function FloatingChatIcon({
  src,
  size = 20,
  className,
}: {
  src: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className="block h-full w-full object-contain"
        aria-hidden
      />
    </span>
  );
}

function FloatingChatInputBar({
  draft,
  focused,
  reasoning,
  placeholder,
  onDraftChange,
  onFocus,
  onBlur,
  onSubmit,
  onExpandPanel,
  onStop,
  inputRef,
}: {
  draft: string;
  focused: boolean;
  reasoning?: boolean;
  placeholder: string;
  onDraftChange: (value: string) => void;
  onFocus: () => void;
  onBlur: (e: React.FocusEvent) => void;
  onSubmit: () => void;
  onExpandPanel?: () => void;
  onStop?: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const canSend = draft.trim().length > 0 && !reasoning;

  return (
    <div
      className={cn(
        "flex w-full flex-col justify-center border border-[#E9E9E9] bg-white transition-shadow",
        focused
          ? "shadow-[0px_0px_7px_2px_rgba(122,139,235,0.5)]"
          : "shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]",
      )}
      style={{
        height: BAR_HEIGHT_PX,
        borderRadius: BAR_RADIUS_PX,
        padding: BAR_PADDING_PX,
      }}
    >
      <div className="flex items-center justify-between gap-2.5">
        {reasoning ? (
          <div className="flex min-w-0 flex-1 items-center gap-2 pl-0.5">
            <div
              className="relative flex shrink-0 items-center justify-center"
              style={{ width: s(32), height: s(32) }}
            >
              <FloatingChatIcon src="/floating-chat/lightbulb.svg" size={s(20)} />
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
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <FloatingChatIcon src="/floating-chat/plus-circle.svg" size={s(36)} />
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={placeholder}
              className="min-w-0 flex-1 bg-transparent text-[13px] font-normal leading-5 text-[#121212] placeholder:text-[#8F8F8F] outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
            />
          </div>
        )}

        <div className="flex shrink-0 items-center gap-3">
          {onExpandPanel && !reasoning ? (
            <button
              type="button"
              onClick={onExpandPanel}
              className="flex items-center justify-center text-[#7E8185] transition-colors hover:text-[#353638]"
              style={{ width: s(20), height: s(20) }}
              aria-label="Open side panel"
            >
              <FloatingChatIcon src="/floating-chat/panel-expand.svg" size={s(20)} />
            </button>
          ) : null}

          {reasoning ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center justify-center rounded-full bg-[rgba(230,231,232,0.7)] text-[#65686B]"
              style={{ width: s(32), height: s(32) }}
              aria-label="Stop"
            >
              <Square className="size-2.5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!canSend}
              onClick={onSubmit}
              className={cn(
                "flex items-center justify-center rounded-full shadow-[0px_6.667px_9.333px_rgba(0,0,0,0.14)] transition-colors",
                canSend ? "text-white" : "bg-[#D1D5D9] text-white",
              )}
              style={
                canSend
                  ? {
                      width: s(32),
                      height: s(32),
                      backgroundImage:
                        "linear-gradient(178.07deg, rgb(27, 50, 179) 1.63%, rgb(0, 0, 0) 128.52%)",
                    }
                  : { width: s(32), height: s(32) }
              }
              aria-label="Send"
            >
              {canSend ? (
                <FloatingChatIcon src="/floating-chat/send.svg" size={s(16)} />
              ) : (
                <Send className="size-3.5" strokeWidth={2} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function truncateAssistant(text: string, limit = 148) {
  if (text.length <= limit) return { short: text, truncated: false };
  const cut = text.slice(0, limit).trimEnd();
  return { short: `${cut}..`, truncated: true };
}

export function FloatingAmiioChat({
  messages,
  suggestions = DEFAULT_ROTATING_PROMPTS,
  isTyping,
  onSend,
  onExpandPanel,
  chatDraftPayload,
  onChatDraftPayloadConsumed,
}: {
  messages: ChatMessage[];
  suggestions?: string[];
  isTyping: boolean;
  onSend: (text: string) => void;
  onExpandPanel: () => void;
  chatDraftPayload?: ChatDraftPayload;
  onChatDraftPayloadConsumed?: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showFullResponse, setShowFullResponse] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [forcePill, setForcePill] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getContainerSize = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    return {
      width: rect?.width ?? BAR_MAX_WIDTH_PX,
      height: rect?.height ?? PILL_HEIGHT_PX,
    };
  }, []);

  const { position: dragPosition, startDrag, moveDrag, endDrag } = useDraggablePosition({
    margin: 12,
    getSize: getContainerSize,
  });

  const lastAssistant = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i]?.role === "assistant") return messages[i];
    }
    return null;
  }, [messages]);

  const hasResponse = Boolean(lastAssistant) && !isTyping;
  const showResponseCard = hasResponse && (hovered || focused || !forcePill);
  const showInputBar = !hasResponse && (hovered || focused || isTyping);
  const showMinimizedPill = !showResponseCard && !showInputBar;

  const rotatingPrompts =
    suggestions.length > 0 ? suggestions : DEFAULT_ROTATING_PROMPTS;

  useEffect(() => {
    if (!showInputBar || focused || isTyping || hasResponse) return;
    const id = window.setInterval(() => {
      setPromptIndex((current) => (current + 1) % rotatingPrompts.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [showInputBar, focused, isTyping, hasResponse, rotatingPrompts.length]);

  useEffect(() => {
    if (!chatDraftPayload) return;
    setDraft(chatDraftPayload.text);
    setForcePill(false);
    onChatDraftPayloadConsumed?.();
    queueMicrotask(() => {
      setHovered(true);
      inputRef.current?.focus();
    });
  }, [chatDraftPayload, onChatDraftPayloadConsumed]);

  useEffect(() => {
    if (isTyping) setShowFullResponse(false);
  }, [isTyping]);

  const handleSubmit = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed || isTyping) return;
    setDraft("");
    setForcePill(false);
    onSend(trimmed);
  }, [draft, isTyping, onSend]);

  const handleFocus = () => {
    setFocused(true);
    setHovered(true);
    setForcePill(false);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    setFocused(false);
  };

  const handleClose = () => {
    setFocused(false);
    setHovered(false);
    setForcePill(true);
    setShowFullResponse(false);
  };

  const handleOpenChat = () => {
    setForcePill(false);
    setHovered(true);
  };

  const assistantPreview = lastAssistant
    ? truncateAssistant(lastAssistant.text.replace(/\n/g, " "))
    : null;

  const defaultAnchorStyle = {
    left: shellContentAreaCenterLeftCss(),
    transform: "translateX(-50%)",
    bottom: FLOATING_BOTTOM_PX,
  } as const;

  const containerWidth = `min(${BAR_MAX_WIDTH_PX}px, ${shellContentAreaMaxWidthCss(SHELL_SIDEBAR_EXPANDED_PX)})`;

  const containerPositionStyle = dragPosition
    ? {
        left: dragPosition.left,
        top: dragPosition.top,
        bottom: "auto" as const,
        transform: "none" as const,
      }
    : defaultAnchorStyle;

  const handlePillPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    startDrag(e.clientX, e.clientY, rect.left, rect.top);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handlePillPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    moveDrag(e.clientX, e.clientY);
  };

  const handlePillPointerEnd = (e: React.PointerEvent<HTMLButtonElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const moved = endDrag();
    if (!moved) handleOpenChat();
  };

  return (
    <div
      ref={containerRef}
      className="fixed z-50 flex flex-col items-center"
      style={{
        ...containerPositionStyle,
        width: containerWidth,
      }}
      onMouseEnter={() => {
        setHovered(true);
        if (forcePill) setForcePill(false);
      }}
      onMouseLeave={() => {
        if (!focused && !isTyping && !hasResponse) setHovered(false);
      }}
    >
      {showMinimizedPill ? (
        <button
          type="button"
          onPointerDown={handlePillPointerDown}
          onPointerMove={handlePillPointerMove}
          onPointerUp={handlePillPointerEnd}
          onPointerCancel={(e) => {
            try {
              e.currentTarget.releasePointerCapture(e.pointerId);
            } catch {
              /* ignore */
            }
            endDrag();
          }}
          className="flex cursor-grab touch-none items-center justify-center rounded-full border border-[#1B32B3] bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.12)] transition-transform hover:scale-[1.02] active:cursor-grabbing"
          style={{
            width: PILL_WIDTH_PX,
            height: PILL_HEIGHT_PX,
          }}
          aria-label="Open Amiio chat (drag to move)"
        >
          <FloatingChatIcon
            src="/floating-chat/lightbulb.svg"
            size={PILL_ICON_PX}
            className="size-6"
          />
        </button>
      ) : null}

      {showInputBar ? (
        <div className="w-full">
          <FloatingChatInputBar
            draft={draft}
            focused={focused}
            reasoning={isTyping}
            placeholder={rotatingPrompts[promptIndex] ?? rotatingPrompts[0]}
            onDraftChange={setDraft}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
            onExpandPanel={onExpandPanel}
            inputRef={inputRef}
          />
        </div>
      ) : null}

      {showResponseCard && lastAssistant ? (
        <div
          className="relative w-full overflow-hidden rounded-2xl border-2 border-white/60 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]"
          style={{
            maxWidth: RESPONSE_MAX_WIDTH_PX,
            backgroundImage:
              "linear-gradient(91deg, rgba(255, 255, 255, 0.3) 1.29%, rgba(255, 255, 255, 0.15) 100.09%)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-[30px]" aria-hidden />
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_6px_0px_rgba(255,255,255,0.2)]" aria-hidden />

          <div className="relative px-3.5 py-1.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <AiPromptBubble size="sm" />
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={onExpandPanel}
                    className="flex items-center justify-center text-[#7E8185] hover:text-[#353638]"
                    style={{ width: s(32), height: s(32) }}
                    aria-label="Open side panel"
                  >
                    <FloatingChatIcon src="/floating-chat/header-panel.svg" size={s(20)} />
                  </button>
                  <button
                    type="button"
                    onClick={onExpandPanel}
                    className="flex items-center justify-center text-[#7E8185] hover:text-[#353638]"
                    style={{ width: s(32), height: s(32) }}
                    aria-label="Expand chat"
                  >
                    <FloatingChatIcon src="/floating-chat/header-expand.svg" size={s(20)} />
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex items-center justify-center text-[#7E8185] hover:text-[#353638]"
                    style={{ width: s(32), height: s(32) }}
                    aria-label="Close chat"
                  >
                    <X className="size-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              <div className="relative max-h-[158px] overflow-y-auto pr-2">
                {showFullResponse ? (
                  <p className="whitespace-pre-wrap text-[13px] font-medium leading-5 text-[#353638]">
                    {lastAssistant.text}
                  </p>
                ) : (
                  <p className="text-[13px] font-medium leading-5 text-[#353638]">
                    {assistantPreview?.short}
                  </p>
                )}
              </div>

              {!showFullResponse && assistantPreview?.truncated ? (
                <button
                  type="button"
                  onClick={() => setShowFullResponse(true)}
                  className="self-end text-[13px] font-medium leading-5 text-[#010309] hover:underline"
                >
                  Show more
                </button>
              ) : null}
            </div>
          </div>

          <div className="relative px-3.5 pb-3.5 pt-2">
            <FloatingChatInputBar
              draft={draft}
              focused={focused}
              reasoning={isTyping}
              placeholder="Explain me this...."
              onDraftChange={setDraft}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
              onExpandPanel={onExpandPanel}
              inputRef={inputRef}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
