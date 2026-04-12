"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  ArrowUpRight,
  Plus,
  Maximize2,
  Minus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { ChatMessage } from "@/src/types/commercial";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AMIIO_AI_DISCLAIMER } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";

function assistantReplyFor(text: string) {
  const t = text.toLowerCase();
  if (t.startsWith("analyse ") || t.startsWith("analyze ")) {
    const topic = text.replace(/^analyse\s+/i, "").replace(/^analyze\s+/i, "").trim();
    return `I’ll focus on: ${topic}\n\nI can summarize drivers, compare to portfolio benchmarks, and suggest concrete next steps (reports, tenant outreach, or scenarios). Tell me if you want an executive summary or full detail.`;
  }
  if (t.includes("revenue") || t.includes("decreased")) {
    return "Revenue decreased by 4.2% year-over-year primarily due to three factors:\n\n1. Vacancy increase — Two units in Gloucester 140 were vacant for 4 months during tenant transitions\n2. Rent-free periods — New leases for ScaleHub III included 3-month incentives\n3. Service charge adjustments — Energy costs were renegotiated downward\n\nWould you like me to break this down by property or generate a detailed variance report?";
  }
  if (
    t.includes("summarise") ||
    t.includes("summarize") ||
    t.includes("summary")
  ) {
    return "This page shows the Commercial Dashboard for Z Holdings portfolio:\n\n• WAULT: 4.2 years across all properties\n• Occupancy: 99.5% with only 0.5% vacancy\n• Total GRI: €1,140,703 annually\n• Key insight: 3 leases expiring within 12 months — recommend prioritizing renewal negotiations for ScaleHub III B.V. and Caesar Consulting B.V.\n\nWant me to drill into any specific section?";
  }
  if (t.includes("lease") && t.includes("expire")) {
    return "I can highlight the next 90-day lease expirations and show which assets have the highest renewal probability. Would you like the list sorted by confidence or delta vs market?";
  }
  if (t.includes("rent") || t.includes("market")) {
    return "Based on Amiio's comps, I'm seeing a consistent gap vs market rents in Retail and Logistics. I can generate a variance summary and recommended negotiation targets—want it by asset or by asset type?";
  }
  return "Got it. I can analyze lease expiry timelines, identify renewal windows, and suggest negotiation strategies based on current market data. Ask me about a specific tenant, property, or time period.";
}

const CHAT_FAB_DRAG_THRESHOLD_PX = 8;

function clampFab(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function ChatRestoreFab({ onExpand }: { onExpand: () => void }) {
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const dragRef = useRef<{
    originX: number;
    originY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);
  const movedRef = useRef(false);

  const fabSize = 56;
  const margin = 8;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    movedRef.current = false;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    dragRef.current = {
      originX: e.clientX,
      originY: e.clientY,
      startLeft: position?.left ?? r.left,
      startTop: position?.top ?? r.top,
    };
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.originX;
    const dy = e.clientY - d.originY;
    if (Math.hypot(dx, dy) > CHAT_FAB_DRAG_THRESHOLD_PX) movedRef.current = true;
    const maxL = Math.max(margin, window.innerWidth - fabSize - margin);
    const maxT = Math.max(margin, window.innerHeight - fabSize - margin);
    setPosition({
      left: clampFab(d.startLeft + dx, margin, maxL),
      top: clampFab(d.startTop + dy, margin, maxT),
    });
  };

  const endPointer = (
    e: React.PointerEvent<HTMLButtonElement>,
    opts?: { allowExpandOnTap: boolean },
  ) => {
    if (dragRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      dragRef.current = null;
    }
    const allowExpand = opts?.allowExpandOnTap !== false;
    if (allowExpand && !movedRef.current) onExpand();
    movedRef.current = false;
  };

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(e) => endPointer(e)}
      onPointerCancel={(e) => endPointer(e, { allowExpandOnTap: false })}
      className={cn(
        "z-50 flex h-14 w-14 cursor-grab touch-none items-center justify-center rounded-full border border-[rgba(1,3,9,0.14)] bg-transparent text-[#353638] shadow-none backdrop-blur-none active:cursor-grabbing",
        position ? "fixed" : "fixed bottom-8 right-8",
      )}
      style={position ? { left: position.left, top: position.top } : undefined}
      aria-label="Open chat (drag to move)"
    >
      <Sparkles className="pointer-events-none h-6 w-6 drop-shadow-sm" />
    </button>
  );
}

const DEFAULT_CHAT_PANEL_WIDTH = 396;
const CHAT_PANEL_WIDTH_MIN = 280;
const CHAT_PANEL_WIDTH_MAX = 920;
const CHAT_PANEL_HEIGHT_MIN = 320;

function chatPanelMaxHeight() {
  if (typeof window === "undefined") return 900;
  return Math.max(CHAT_PANEL_HEIGHT_MIN, window.innerHeight - 120);
}

function chatPanelMaxWidth() {
  if (typeof window === "undefined") return CHAT_PANEL_WIDTH_MAX;
  return Math.min(CHAT_PANEL_WIDTH_MAX, Math.max(CHAT_PANEL_WIDTH_MIN, window.innerWidth - 240));
}

type ResizeDrag =
  | { kind: "w"; startX: number; startWidth: number }
  | { kind: "h"; startY: number; startHeight: number }
  | {
      kind: "corner";
      startX: number;
      startY: number;
      startWidth: number;
      startHeight: number;
    };

export function ResizableChatAside({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const asideRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(DEFAULT_CHAT_PANEL_WIDTH);
  const [heightPx, setHeightPx] = useState<number | null>(null);
  const dragRef = useRef<ResizeDrag | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const maxW = chatPanelMaxWidth();
      const maxH = chatPanelMaxHeight();
      if (d.kind === "w") {
        const dw = d.startX - e.clientX;
        setWidth(clampFab(d.startWidth + dw, CHAT_PANEL_WIDTH_MIN, maxW));
      } else if (d.kind === "h") {
        const dh = e.clientY - d.startY;
        setHeightPx(clampFab(d.startHeight + dh, CHAT_PANEL_HEIGHT_MIN, maxH));
      } else {
        const dw = d.startX - e.clientX;
        const dh = e.clientY - d.startY;
        setWidth(clampFab(d.startWidth + dw, CHAT_PANEL_WIDTH_MIN, maxW));
        setHeightPx(clampFab(d.startHeight + dh, CHAT_PANEL_HEIGHT_MIN, maxH));
      }
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const startWidthDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { kind: "w", startX: e.clientX, startWidth: width };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const startHeightDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = asideRef.current;
    const currentH = heightPx ?? el?.offsetHeight ?? 600;
    dragRef.current = { kind: "h", startY: e.clientY, startHeight: currentH };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const startCornerDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = asideRef.current;
    const currentH = heightPx ?? el?.offsetHeight ?? 600;
    dragRef.current = {
      kind: "corner",
      startX: e.clientX,
      startY: e.clientY,
      startWidth: width,
      startHeight: currentH,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const wStyle = clampFab(width, CHAT_PANEL_WIDTH_MIN, chatPanelMaxWidth());

  return (
    <aside
      id={id}
      ref={asideRef}
      className={cn(
        "relative flex min-h-0 w-full min-w-0 flex-col lg:sticky lg:top-[104px] lg:z-10 lg:w-[var(--chat-aside-w)] lg:max-w-[min(var(--chat-aside-w),100%)] lg:shrink-0 lg:self-start",
        heightPx == null &&
          "lg:h-[min(755px,calc(100dvh-104px-24px))] lg:max-h-[min(755px,calc(100dvh-104px-24px))]",
        className,
      )}
      style={{
        ["--chat-aside-w" as string]: `${wStyle}px`,
        ...(heightPx != null ? { height: heightPx, maxHeight: heightPx } : {}),
      }}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize chat width"
        onPointerDown={startWidthDrag}
        className="absolute bottom-3 left-0 top-3 z-20 hidden w-3 -translate-x-1/2 cursor-ew-resize rounded-full bg-transparent hover:bg-[rgba(1,3,9,0.06)] lg:block"
      />
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize chat height"
        onPointerDown={startHeightDrag}
        className="absolute bottom-0 left-4 right-4 z-20 hidden h-3 -translate-y-1/2 cursor-ns-resize rounded-full bg-transparent hover:bg-[rgba(1,3,9,0.06)] lg:block"
      />
      <div
        aria-label="Resize chat width and height"
        onPointerDown={startCornerDrag}
        className="absolute bottom-0 left-0 z-20 hidden h-5 w-5 -translate-x-px translate-y-px cursor-nwse-resize rounded-br-md bg-transparent hover:bg-[rgba(1,3,9,0.06)] lg:block"
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pl-1.5">{children}</div>
    </aside>
  );
}

export type ChatDraftPayload = { id: number; text: string } | null;

export function ChatPanel({
  messages,
  suggestions,
  onSend,
  isTyping,
  onNewChat,
  onMinimize,
  chatDraftPayload,
  onChatDraftPayloadConsumed,
}: {
  messages: ChatMessage[];
  suggestions: string[];
  onSend: (text: string) => void;
  isTyping: boolean;
  onNewChat?: () => void;
  onMinimize?: () => void;
  /** When set, pre-fills the composer (e.g. from widget lamp) */
  chatDraftPayload?: ChatDraftPayload;
  onChatDraftPayloadConsumed?: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasConversation = messages.length > 0;

  useEffect(() => {
    listRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [messages.length, isTyping]);

  useEffect(() => {
    if (!chatDraftPayload) return;
    setDraft(chatDraftPayload.text);
    setError(null);
    onChatDraftPayloadConsumed?.();
    queueMicrotask(() => inputRef.current?.focus());
  }, [chatDraftPayload?.id, chatDraftPayload, onChatDraftPayloadConsumed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) {
      setError("Please type a question before sending.");
      return;
    }
    if (trimmed.length < 3) {
      setError("Question is too short.");
      return;
    }
    setError(null);
    setDraft("");
    onSend(trimmed);
  };

  const handleNewChat = () => {
    onNewChat?.();
    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: { message: "New chat started" },
      }),
    );
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex h-full min-h-0 w-full flex-col rounded-[12px] border-2 border-[rgba(255,255,255,0.6)] bg-[linear-gradient(90deg,rgba(255,255,255,0.3)_1.2%,rgba(255,255,255,0.15)_100%)] shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-[20px]">
        {/* Top Chat Banner */}
        <div className="flex h-[53px] shrink-0 items-center justify-between px-4">
          <Button
            variant="ghost"
            className="h-8 gap-2 px-2 typo-l2-b text-[#7E8185] transition-colors hover:bg-[#010309] hover:text-[#F0F2F5] hover:[&_svg]:text-[#F0F2F5]"
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>

          <div className="flex items-center gap-0.5 text-[#7E8185]">
            <button
              type="button"
              className="rounded-full p-1.5 text-[#7E8185] transition-colors hover:bg-[#010309] hover:text-[#F0F2F5]"
              aria-label="History"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-full p-1.5 text-[#7E8185] transition-colors hover:bg-[#010309] hover:text-[#F0F2F5]"
              aria-label="Expand"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            {onMinimize && (
              <button
                type="button"
                className="rounded-full p-1.5 text-[#7E8185] transition-colors hover:bg-[#010309] hover:text-[#F0F2F5]"
                aria-label="Minimize chat"
                onClick={onMinimize}
              >
                <Minus className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        {!hasConversation ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="flex-1 px-6 pt-4">
              <div className="flex flex-col items-center pt-6">
                <img src="/amiio-logo.png" alt="Amiio" className="h-[43px]" />
                <div className="mt-3 typo-h5 text-[#2C2C2C]">Good afternoon, Tomer!</div>
                <div className="mt-3 typo-p2-r text-[#7E8185]">Select a topic or ask me a question</div>
              </div>

              <div className="mx-auto mt-8 w-full max-w-[340px] px-1">
                {suggestions.slice(0, 2).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="flex h-10 w-full items-center justify-center border-b border-[rgba(205,207,213,0.5)] typo-l3-b text-[#7E8185] transition-colors hover:text-[#353638]"
                    onClick={() => {
                      setError(null);
                      onSend(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div
              ref={listRef}
              className="flex-1 space-y-4 overflow-y-auto px-5 py-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#010309]">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[min(320px,calc(100%-2.5rem))] rounded-xl px-3 py-2 typo-p2-r",
                      msg.role === "user"
                        ? "bg-[#010309] text-white"
                        : "bg-[#F2F4F7] text-[#353638]",
                    )}
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < msg.text.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#010309]">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex items-center gap-1 rounded-xl bg-[#F2F4F7] px-3 py-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#7E8185]" />
                    <span className="typo-p3-r text-[#7E8185]">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="shrink-0 px-6 pt-3 pb-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                className={cn(
                  "h-[42px] rounded-full border-[rgba(0,0,0,0.04)] bg-[rgba(255,255,255,0.8)] pl-5 typo-p2-r text-[#353638] placeholder:typo-p2-r placeholder:text-[#7E8185]",
                  error ? "border-red-400" : "",
                )}
                placeholder="Ask me anything"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (error) setError(null);
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isTyping}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#7E8185] transition-colors hover:bg-[#F2F4F7] hover:text-[#353638] disabled:opacity-50"
              aria-label="Send"
            >
              {isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpRight className="h-4 w-4" />
              )}
            </button>
          </form>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-center typo-p3-r text-[#7E8185]">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-black" aria-hidden />
            <span>{AMIIO_AI_DISCLAIMER}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const __assistantReplyFor = assistantReplyFor;
