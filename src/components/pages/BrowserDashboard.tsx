"use client";

import { useCallback, useState } from "react";
import type { TopNavTabId } from "@/src/types/commercial";
import { TopNav } from "@/src/components/commercial/TopNav";
import { ToastStack } from "@/src/components/commercial/ToastStack";
import {
  ChatPanel,
  ChatRestoreFab,
  ResizableChatAside,
} from "@/src/components/commercial/ChatPanel";
import { useAmiioChat } from "@/src/hooks/useAmiioChat";
import { cn } from "@/lib/utils";

const DEFAULT_BROWSER_URL = "https://example.com";

function normalizeBrowserUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return DEFAULT_BROWSER_URL;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function BrowserDashboard({
  activeTab,
  onTabChange,
}: {
  activeTab: TopNavTabId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const chat = useAmiioChat(activeTab);
  const [address, setAddress] = useState(DEFAULT_BROWSER_URL);
  const [loadedUrl, setLoadedUrl] = useState(DEFAULT_BROWSER_URL);
  const [chatExpanded, setChatExpanded] = useState(true);

  const handleNavigate = useCallback(() => {
    setLoadedUrl(normalizeBrowserUrl(address));
  }, [address]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--Secondary-Sea-Salt)" }}
    >
      <TopNav activeTab={activeTab} onTabChange={onTabChange} />
      <ToastStack />

      <main className="mx-auto w-full max-w-[1512px] px-8 pb-6 pt-8">
        <div
          className={cn(
            "flex flex-col gap-8",
            chatExpanded ? "lg:flex-row lg:items-start" : "",
          )}
        >
          <section className="min-w-0 flex-1">
            <div className="mb-4">
              <h1 className="typo-h4 text-[#010309]">Browser</h1>
              <p className="mt-1 typo-p3-r text-[#7E8185]">
                Enter a URL to load it in the panel below. Some sites block embedding in iframes.
              </p>
            </div>

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNavigate();
                }}
                placeholder="https://…"
                className="min-h-[40px] flex-1 rounded-lg border border-[rgba(230,231,232,0.9)] bg-white px-3 typo-p3-r text-[#010309] outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#2C2C2C]/25"
                aria-label="Address"
              />
              <button
                type="button"
                onClick={handleNavigate}
                className="h-[40px] shrink-0 rounded-lg bg-[#010309] px-5 typo-l3-b text-white transition-colors hover:bg-[#1a1d24]"
              >
                Go
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-[rgba(230,231,232,0.9)] bg-white shadow-sm">
              <iframe
                title="Embedded browser"
                src={loadedUrl}
                className="h-[min(720px,calc(100vh-280px))] w-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>

          {chatExpanded ? (
            <ResizableChatAside>
              <ChatPanel
                messages={chat.messages}
                suggestions={chat.suggestions}
                isTyping={chat.isTyping}
                onSend={chat.onSend}
                onNewChat={chat.onNewChat}
                onMinimize={() => setChatExpanded(false)}
                chatDraftPayload={null}
                onChatDraftPayloadConsumed={() => {}}
              />
            </ResizableChatAside>
          ) : null}
        </div>
        {!chatExpanded ? <ChatRestoreFab onExpand={() => setChatExpanded(true)} /> : null}
      </main>
    </div>
  );
}
