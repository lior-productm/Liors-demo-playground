"use client";

import { useState } from "react";
import type { SidebarNavId } from "@/src/types/navigation";
import { AppShell } from "@/src/components/layout/AppShell";
import { ChatAside, ChatPanel } from "@/src/components/commercial/ChatPanel";
import { FloatingAmiioChat } from "@/src/components/commercial/FloatingAmiioChat";
import { useAmiioChat } from "@/src/hooks/useAmiioChat";
import { AiAnalystsModalsProvider } from "@/src/components/ai-analysts/AiAnalystsModals";
import { AiAnalystsChatContext } from "@/src/components/ai-analysts/AiAnalystsChatContext";

export { useAiAnalystsChat } from "@/src/components/ai-analysts/AiAnalystsChatContext";

/** Shared shell for the AI Analysts + Tasks pages: sidebar + docked Ask Amiio chat. */
export function AiAnalystsShell({
  children,
  activeNav = "ai-analysts",
  initialChatOpen = false,
}: {
  children: React.ReactNode;
  activeNav?: SidebarNavId;
  initialChatOpen?: boolean;
}) {
  const chat = useAmiioChat("amiio", "ai-analysts-chat");
  const [chatExpanded, setChatExpanded] = useState(initialChatOpen);

  return (
    <AiAnalystsChatContext.Provider value={{ openChat: () => setChatExpanded(true) }}>
      <AppShell
        activeNav={activeNav}
        chatMinimized={!chatExpanded}
        chatPanel={
          <ChatAside id="amiio-ai-analysts-chat">
            <ChatPanel
              variant="ask-ai"
              messages={chat.messages}
              suggestions={chat.suggestions}
              isTyping={chat.isTyping}
              onSend={chat.onSend}
              onNewChat={chat.onNewChat}
              onMinimize={() => setChatExpanded(false)}
            />
          </ChatAside>
        }
        chatRestoreFab={
          !chatExpanded ? (
            <FloatingAmiioChat
              messages={chat.messages}
              suggestions={chat.suggestions}
              isTyping={chat.isTyping}
              onSend={chat.onSend}
              onExpandPanel={() => setChatExpanded(true)}
            />
          ) : undefined
        }
      >
        <AiAnalystsModalsProvider>{children}</AiAnalystsModalsProvider>
      </AppShell>
    </AiAnalystsChatContext.Provider>
  );
}
