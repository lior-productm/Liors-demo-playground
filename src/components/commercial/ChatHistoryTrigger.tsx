"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createAskAiSession,
  getAskAiSession,
  upsertAskAiSession,
} from "@/src/lib/askAiSessions";
import {
  DEMO_CHAT_HISTORY_ENTRIES,
  type ChatHistoryEntry,
} from "@/src/lib/chatHistoryData";
import { ChatHistoryPanel } from "@/src/components/commercial/ChatHistoryPanel";

const CHAT_HISTORY_PANEL_WIDTH_PX = 304;
const CHAT_HISTORY_PANEL_GAP_PX = 8;
/** Rough max height for viewport clamping (header + search + list). */
const CHAT_HISTORY_PANEL_EST_HEIGHT_PX = 480;

type PanelPosition = { top: number; left: number };

export function useChatHistoryNavigation() {
  const router = useRouter();

  return useCallback((entry: ChatHistoryEntry) => {
    let sessionId = entry.id;
    if (!getAskAiSession(entry.id)) {
      const isDemo = DEMO_CHAT_HISTORY_ENTRIES.some((item) => item.id === entry.id);
      if (!isDemo) {
        router.push("/ask-ai");
        return;
      }
      const session = createAskAiSession();
      upsertAskAiSession({ ...session, title: entry.title });
      sessionId = session.id;
    }
    router.push(`/ask-ai/${sessionId}`);
  }, [router]);
}

export function ChatHistoryTrigger({
  className,
  buttonClassName,
  panelClassName,
}: {
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigateToHistoryEntry = useChatHistoryNavigation();

  const updatePanelPosition = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    let left = rect.left - CHAT_HISTORY_PANEL_WIDTH_PX - CHAT_HISTORY_PANEL_GAP_PX;
    if (left < CHAT_HISTORY_PANEL_GAP_PX) {
      left = rect.right + CHAT_HISTORY_PANEL_GAP_PX;
    }
    left = Math.min(
      left,
      window.innerWidth - CHAT_HISTORY_PANEL_WIDTH_PX - CHAT_HISTORY_PANEL_GAP_PX,
    );
    left = Math.max(CHAT_HISTORY_PANEL_GAP_PX, left);

    let top = rect.top;
    if (top + CHAT_HISTORY_PANEL_EST_HEIGHT_PX > window.innerHeight - CHAT_HISTORY_PANEL_GAP_PX) {
      top = Math.max(
        CHAT_HISTORY_PANEL_GAP_PX,
        window.innerHeight - CHAT_HISTORY_PANEL_EST_HEIGHT_PX - CHAT_HISTORY_PANEL_GAP_PX,
      );
    }

    setPanelPosition({ top, left });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePanelPosition();
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        const panel = document.getElementById("chat-history-panel-portal");
        if (panel?.contains(event.target as Node)) return;
        setOpen(false);
      }
    };
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open, updatePanelPosition]);

  const handleSelect = (entry: ChatHistoryEntry) => {
    setOpen(false);
    navigateToHistoryEntry(entry);
  };

  const panel =
    open && panelPosition
      ? createPortal(
          <div
            id="chat-history-panel-portal"
            className={cn("fixed z-[100]", panelClassName)}
            style={{ top: panelPosition.top, left: panelPosition.left }}
          >
            <ChatHistoryPanel onSelect={handleSelect} />
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          "flex size-8 items-center justify-center text-[#7E8185] transition-colors hover:bg-[#F0F2F5] hover:text-[#353638]",
          open && "bg-[#F0F2F5] text-[#353638]",
          buttonClassName,
        )}
        aria-label="Chat history"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          setOpen((value) => {
            const next = !value;
            if (next) updatePanelPosition();
            return next;
          });
        }}
      >
        <History className="size-6" strokeWidth={1.5} />
      </button>
      {panel}
    </div>
  );
}
