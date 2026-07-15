"use client";

import { Fragment } from "react";
import type { AiAssistantRecentChat } from "@/src/lib/aiAssistantsData";

/** Figma 1453:65746 — recent chats list (title + timestamp, dividers). */
export function AiAssistantRecentChatsList({
  chats,
  onSelect,
}: {
  chats: AiAssistantRecentChat[];
  onSelect?: (chat: AiAssistantRecentChat) => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[681px] flex-col gap-6 rounded-lg p-5">
      {chats.map((chat, index) => (
        <Fragment key={chat.id}>
          {index > 0 ? <div className="h-px w-full shrink-0 bg-[#E5E5E5]" aria-hidden /> : null}
          <button
            type="button"
            onClick={() => onSelect?.(chat)}
            className="flex w-full items-center justify-between gap-4 text-left transition-opacity hover:opacity-80"
          >
            <p className="min-w-0 flex-1 truncate text-sm font-medium leading-[1.5] text-[#353638]">
              {chat.title}
            </p>
            <p className="shrink-0 text-right text-sm font-normal leading-[1.5] text-[#65686B]">
              {chat.timestampLabel}
            </p>
          </button>
        </Fragment>
      ))}
    </div>
  );
}
