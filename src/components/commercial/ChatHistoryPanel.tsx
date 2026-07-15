"use client";

import { useMemo, useState } from "react";
import { History, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getChatHistoryEntries,
  groupChatHistoryEntries,
  type ChatHistoryEntry,
} from "@/src/lib/chatHistoryData";
import { useAskAiSessions } from "@/src/hooks/useAskAiSessions";
import { TruncatedText } from "@/src/components/ui/TruncatedText";

export function ChatHistoryPanel({
  className,
  onSelect,
}: {
  className?: string;
  onSelect?: (entry: ChatHistoryEntry) => void;
}) {
  const { sessions } = useAskAiSessions();
  const [searchQuery, setSearchQuery] = useState("");

  const groups = useMemo(() => {
    const entries = getChatHistoryEntries(sessions);
    return groupChatHistoryEntries(entries, searchQuery);
  }, [sessions, searchQuery]);

  return (
    <div
      className={cn(
        "flex w-[min(100%,304px)] flex-col overflow-hidden rounded-[8px] border border-[#E6E8EB] bg-[#F0F2F5] shadow-[0px_10px_28px_0px_rgba(0,0,0,0.14)]",
        className,
      )}
      role="dialog"
      aria-label="Chat history"
    >
      <div className="flex shrink-0 items-center gap-2 px-4 pb-3 pt-4">
        <History className="size-5 shrink-0 text-[#676A6E]" strokeWidth={1.5} />
        <p className="text-[16px] font-medium leading-[1.5] text-[#676A6E]">Chat history</p>
      </div>

      <div className="shrink-0 px-4 py-2">
        <label className="relative flex h-10 w-full items-center gap-2 rounded-[32px] border border-[#D1D5D9] bg-white px-3">
          <Search className="size-4 shrink-0 text-[#969A9E]" strokeWidth={1.75} />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search..."
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-[1.24] text-[#353638] placeholder:text-[#969A9E] outline-none"
          />
        </label>
      </div>

      <div className="custom-scrollbar flex max-h-[360px] min-h-0 flex-col gap-1 overflow-y-auto px-2 pb-3">
        {groups.length === 0 ? (
          <p className="px-3 py-6 text-center text-[14px] leading-[1.5] text-[#65686B]">
            No chats match your search.
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <div className="flex h-10 items-center px-3">
                <p className="text-[14px] font-normal leading-[1.5] text-[#65686B]">
                  {group.label}
                </p>
              </div>
              {group.entries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onSelect?.(entry)}
                  className="flex h-10 w-full items-center rounded-[4px] px-3 text-left transition-colors hover:bg-white/70"
                >
                  <TruncatedText
                    text={entry.title}
                    side="left"
                    className="text-[16px] font-normal leading-[1.25] text-[#353638]"
                  />
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
