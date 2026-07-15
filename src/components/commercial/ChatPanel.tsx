"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Building2,
  FileText,
  Loader2,
  ArrowUpRight,
  Lightbulb,
  Maximize2,
  Mic,
  Minus,
  Plus,
  Send,
  type LucideIcon,
} from "lucide-react";
import { ChatHistoryTrigger } from "@/src/components/commercial/ChatHistoryTrigger";
import { ASK_AI_CHIP_SUGGESTIONS } from "@/src/components/ask-ai/AskAiLanding";
import type { ChatMessage } from "@/src/types/commercial";
import { cn } from "@/lib/utils";
import { AmiioFocusChatBar, type AmiioFocusChatBarLayout } from "@/src/components/commercial/AmiioFocusChatBar";
import {
  SHELL_SIDEBAR_CHAT_INPUT_MAX_PX,
  SHELL_CHAT_WIDTH_PX,
  SHELL_CHAT_PANEL_GRADIENT_STYLE,
  SHELL_SIDE_PANEL_FRAME_CLASS,
  SHELL_SIDE_PANEL_INSET_SHADOW_CLASS,
} from "@/src/lib/shellLayout";
import {
  WorkflowAiBlock,
  WorkflowThinkingIndicator,
  WorkflowUserBubble,
} from "@/src/components/workflows/WorkflowChatUi";

/** Figma 1128:32685 — gradient lamp avatar for all Amiio chat assistant messages. */
export function AiPromptBubble({ size = "sm" }: { size?: "sm" | "md" }) {
  const dim = size === "md" ? "size-6" : "size-5";
  const icon = size === "md" ? "size-[18px]" : "size-[15px]";
  const radius = size === "md" ? "rounded-[18px]" : "rounded-[15px]";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center shadow-[0_1.5px_2.25px_rgba(0,0,0,0.15)]",
        dim,
        radius,
      )}
      style={{
        backgroundImage:
          "linear-gradient(178.07deg, rgb(27, 50, 179) 1.63%, rgb(0, 0, 0) 128.52%)",
      }}
      aria-hidden
    >
      <Lightbulb className={cn(icon, "text-white")} strokeWidth={1.5} />
    </div>
  );
}

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
        "z-50 flex h-14 w-14 cursor-grab touch-none items-center justify-center rounded-full border-0 bg-transparent text-[#353638] shadow-none backdrop-blur-none active:cursor-grabbing",
        position ? "fixed" : "fixed bottom-8 right-8",
      )}
      style={position ? { left: position.left, top: position.top } : undefined}
      aria-label="Open chat (drag to move)"
    >
      <span className="pointer-events-none flex items-center justify-center">
        <AiPromptBubble size="md" />
      </span>
    </button>
  );
}

const DEFAULT_CHAT_PANEL_WIDTH = SHELL_CHAT_WIDTH_PX;
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

export function ChatAside({
  children,
  className,
  id,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}) {
  return (
    <aside
      id={id}
      className={cn("flex h-full min-h-0 w-full min-w-0 flex-col", className)}
      style={style}
    >
      {children}
    </aside>
  );
}

/** @deprecated Prefer ChatAside — resize handles add global listeners and hurt dev performance. */
export function ResizableChatAside({
  children,
  className,
  id,
  reserveTopForFilterRail = false,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Set when filters are stacked above the chat in the right column — shortens max height accordingly. */
  reserveTopForFilterRail?: boolean;
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
        "relative flex min-h-0 w-full min-w-0 flex-col lg:sticky lg:top-8 lg:z-10 lg:h-[calc(100vh-64px)] lg:w-[var(--chat-aside-w)] lg:max-w-[min(var(--chat-aside-w),100%)] lg:shrink-0 lg:self-start",
        heightPx == null &&
          !reserveTopForFilterRail &&
          "lg:max-h-[calc(100vh-64px)]",
        heightPx == null &&
          reserveTopForFilterRail &&
          "lg:max-h-[calc(100vh-64px-64px)]",
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

export type ChatSuggestionGroup = {
  label: string;
  prompts: string[];
};

export const DASHBOARD_CHAT_SUGGESTIONS: ChatSuggestionGroup[] = [
  {
    label: "Performance ANALYSIS",
    prompts: [
      "Create a one-page strategic summary for Paris Retail Portfolio for the investment committee",
      "Rank my assets by risk score and explain the main drivers",
      "Create a portfolio performance summary for Q2",
    ],
  },
  {
    label: "Leasing MANaGEMENT",
    prompts: [
      "Draft a lease agreement renewal based on the Rent Roll 2026",
      "Which tenants are risky?",
    ],
  },
  {
    label: "DATA QUALITY",
    prompts: [
      "Help me find wrong, or inconsistent data",
      "Remove duplicated data",
    ],
  },
];

export const ASK_AI_CARD_SUGGESTIONS = [
  "Create a one-page strategic summary for Paris Retail Portfolio for the investment committee",
  "Rank my assets by risk score and explain the main drivers",
  "Create a portfolio performance summary for Q2",
];

/** Figma 1172:61523 — default chip prompts for expanded sidebar chat. */
export const SIDEBAR_CHAT_CHIP_SUGGESTIONS: {
  label: string;
  icon: LucideIcon;
}[] = [
  { label: "Analyze asset performance", icon: BarChart3 },
  { label: "Initiate a Lease Renewal", icon: Building2 },
  { label: "Draft an Investor report", icon: FileText },
];

/** Figma 830:52546 — default empty-state prompts for sidebar chat. */
export const SIDEBAR_CHAT_EMPTY_PROMPTS = [
  "Summarize the performance of all entities in portfolio A",
  "Which properties are underperforming?",
  "Rank my assets by risk score and explain the main drivers",
];

/** Focus-mode chat bar — sidebar (349px) or Ask Amiio full page (Figma 1172:62206). */
export function SidebarChatInput({
  draft,
  error,
  isTyping,
  inputRef,
  onDraftChange,
  onSubmit,
  placeholder = "Ask me anything",
  rotatingSuggestions,
  className,
  layout = "sidebar",
}: {
  draft: string;
  error: string | null;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onDraftChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  rotatingSuggestions?: readonly string[];
  className?: string;
  layout?: AmiioFocusChatBarLayout;
}) {
  const isFull = layout === "full";

  const handleSend = () => {
    onSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex w-full justify-center",
        isFull ? "max-w-[720px]" : "max-w-[349px]",
        className,
      )}
    >
      <AmiioFocusChatBar
        layout={layout}
        draft={draft}
        error={error}
        isTyping={isTyping}
        inputRef={inputRef}
        onDraftChange={onDraftChange}
        onSubmit={handleSend}
        placeholder={placeholder}
        rotatingSuggestions={rotatingSuggestions}
      />
    </form>
  );
}

/** Input + disclaimer dock anchored to the bottom of expanded chat panels. */
export function SidebarChatInputDock({
  draft,
  error,
  isTyping,
  inputRef,
  onDraftChange,
  onSubmit,
  placeholder,
  rotatingSuggestions,
  className,
  layout = "sidebar",
}: {
  draft: string;
  error: string | null;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onDraftChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  rotatingSuggestions?: readonly string[];
  className?: string;
  layout?: AmiioFocusChatBarLayout;
}) {
  const isFull = layout === "full";

  return (
    <div
      className={cn(
        "flex w-full shrink-0 flex-col items-center gap-2",
        isFull && "mx-auto max-w-[720px]",
        className,
      )}
      style={!isFull ? { maxWidth: SHELL_SIDEBAR_CHAT_INPUT_MAX_PX } : undefined}
    >
      <SidebarChatInput
        draft={draft}
        error={error}
        isTyping={isTyping}
        inputRef={inputRef}
        onDraftChange={onDraftChange}
        onSubmit={onSubmit}
        placeholder={placeholder}
        rotatingSuggestions={rotatingSuggestions}
        layout={layout}
        className={isFull ? "w-full" : undefined}
      />
      <p
        className={cn(
          "whitespace-nowrap text-center font-normal leading-[1.5] text-[#969A9E]",
          isFull ? "text-[12px]" : "text-[11px]",
        )}
      >
        Amiio AI can make mistakes. Check important info.
      </p>
    </div>
  );
}

function SidebarChatChip({
  label,
  icon: Icon,
  onSelect,
}: {
  label: string;
  icon: LucideIcon;
  onSelect: (label: string) => void;
}) {
  return (
    <button
      type="button"
      className="flex h-10 w-full items-center justify-center gap-1 rounded-[32px] border-[1.5px] border-[#E6E8EB] bg-white px-3 py-2 transition-colors hover:bg-[#FAFBFC]"
      onClick={() => onSelect(label)}
    >
      <Icon className="size-4 shrink-0 text-[#65686B]" strokeWidth={1.75} aria-hidden />
      <span className="typo-p2-b truncate text-[#65686B]">{label}</span>
    </button>
  );
}

export function SidebarChatShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("relative h-full min-h-0 w-full rounded-[12px]", SHELL_SIDE_PANEL_FRAME_CLASS)}>
      <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[12px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[12px] backdrop-blur-[20px]"
          style={SHELL_CHAT_PANEL_GRADIENT_STYLE}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit]",
            SHELL_SIDE_PANEL_INSET_SHADOW_CLASS,
          )}
        />
        <div className="relative flex h-full min-h-0 flex-col">{children}</div>
      </div>
    </div>
  );
}

/** Figma 830:52528 — top chat banner. */
export function SidebarChatHeader({
  onNewChat,
  onMinimize,
  title = "New Chat",
}: {
  onNewChat?: () => void;
  onMinimize?: () => void;
  title?: string;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-[#F0F2F5] px-4 py-2">
      <button
        type="button"
        className="inline-flex h-[37px] items-center rounded-[32px] px-2 py-1 typo-p2-b text-[#676A6E] transition-colors hover:bg-[#F0F2F5] hover:text-[#353638]"
        onClick={onNewChat}
      >
        {title}
      </button>
      <div className="flex items-center gap-1 text-[#7E8185]">
        <ChatHistoryTrigger />
        <button
          type="button"
          className="flex size-8 items-center justify-center text-[#7E8185] transition-colors hover:bg-[#F0F2F5] hover:text-[#353638]"
          aria-label="Expand"
        >
          <Maximize2 className="size-6" strokeWidth={1.5} />
        </button>
        {onMinimize ? (
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-[32px] p-2.5 text-[#7E8185] transition-colors hover:bg-[#F0F2F5] hover:text-[#353638]"
            aria-label="Minimize chat"
            onClick={onMinimize}
          >
            <Minus className="size-6" strokeWidth={1.5} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Figma 830:52538 — sidebar chat empty state (1172:61523). */
function SidebarChatEmptyState({
  chips,
  onSelectPrompt,
  draft,
  error,
  isTyping,
  inputRef,
  onDraftChange,
  onSubmit,
}: {
  chips: { label: string; icon: LucideIcon }[];
  onSelectPrompt: (prompt: string) => void;
  draft: string;
  error: string | null;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onDraftChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center gap-4 overflow-hidden px-6 pt-4 pb-4">
      <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-4 overflow-y-auto">
        <div className="flex w-full shrink-0 flex-col items-center gap-1.5 py-6 text-center">
          <p className="typo-h3 leading-[1.5] tracking-[-0.4px] text-[#040617]">
            Good afternoon, Tomer!
          </p>
          <p className="typo-p1-r text-[#65686B]">How can we help you today?</p>
        </div>
        <div className="flex w-full flex-col gap-3">
          {chips.map(({ label, icon }) => (
            <SidebarChatChip
              key={label}
              label={label}
              icon={icon}
              onSelect={onSelectPrompt}
            />
          ))}
        </div>
      </div>
      <SidebarChatInputDock
        draft={draft}
        error={error}
        isTyping={isTyping}
        inputRef={inputRef}
        onDraftChange={onDraftChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export function AskAiComposer({
  draft,
  error,
  isTyping,
  inputRef,
  onDraftChange,
  onSubmit,
}: {
  draft: string;
  error: string | null;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onDraftChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex h-[119px] w-full flex-col gap-2.5 rounded-[16px] border border-[#E6E8EB] bg-white p-2.5",
        error ? "border-red-400" : "",
      )}
    >
      <div className="px-2 py-0.5">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Ask me anything"
          className="w-full bg-transparent text-[16px] font-normal leading-6 text-[#353638] placeholder:text-[#8F8F8F] outline-none"
        />
      </div>
      <div className="mt-auto flex items-end justify-between">
        <button
          type="button"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#353638] hover:bg-[#F0F2F5]"
          aria-label="Attach"
        >
          <Plus className="size-5" strokeWidth={1.75} />
        </button>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-[#101010] hover:bg-[#F0F2F5]"
            aria-label="Voice input"
          >
            <Mic className="size-5" strokeWidth={1.75} />
          </button>
          <button
            type="submit"
            disabled={isTyping}
            className="flex size-8 items-center justify-center rounded-[32px] bg-[#040617] text-white shadow-[0_6.667px_9.333px_rgba(0,0,0,0.14)] disabled:opacity-50"
            aria-label="Send"
          >
            {isTyping ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowUpRight className="size-4" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </form>
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
  variant = "dashboard",
  suggestionGroups = DASHBOARD_CHAT_SUGGESTIONS,
}: {
  messages: ChatMessage[];
  suggestions: string[];
  onSend: (text: string) => void;
  isTyping: boolean;
  onNewChat?: () => void;
  onMinimize?: () => void;
  chatDraftPayload?: ChatDraftPayload;
  onChatDraftPayloadConsumed?: () => void;
  /** Dashboard sidebar chat (categorized prompts) vs Ask AI page (card prompts + rich input). */
  variant?: "dashboard" | "ask-ai";
  suggestionGroups?: ChatSuggestionGroup[];
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

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
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
  };

  const emptyStateChips =
    variant === "dashboard"
      ? SIDEBAR_CHAT_CHIP_SUGGESTIONS
      : ASK_AI_CHIP_SUGGESTIONS.map(({ label, icon }) => ({ label, icon }));

  const handleSelectPrompt = (prompt: string) => {
    setError(null);
    onSend(prompt);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(draft);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <SidebarChatShell>
        <SidebarChatHeader onNewChat={handleNewChat} onMinimize={onMinimize} />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {!hasConversation ? (
            <SidebarChatEmptyState
              chips={emptyStateChips}
              onSelectPrompt={handleSelectPrompt}
              draft={draft}
              error={error}
              isTyping={isTyping}
              inputRef={inputRef}
              onDraftChange={(value) => {
                setDraft(value);
                if (error) setError(null);
              }}
              onSubmit={handleFormSubmit}
            />
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-6 pt-4 pb-4">
              <div
                ref={listRef}
                className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
              >
                {messages.map((msg) =>
                  msg.role === "user" ? (
                    <WorkflowUserBubble key={msg.id}>{msg.text}</WorkflowUserBubble>
                  ) : (
                    <WorkflowAiBlock key={msg.id} question={msg.text} />
                  ),
                )}
                {isTyping ? <WorkflowThinkingIndicator /> : null}
              </div>
              <SidebarChatInputDock
                draft={draft}
                error={error}
                isTyping={isTyping}
                inputRef={inputRef}
                onDraftChange={(value) => {
                  setDraft(value);
                  if (error) setError(null);
                }}
                onSubmit={handleFormSubmit}
              />
            </div>
          )}
        </div>
      </SidebarChatShell>
    </div>
  );
}

export const __assistantReplyFor = assistantReplyFor;
