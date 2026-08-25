"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChatMessage, TopNavTabId } from "@/src/types/commercial";
import { __assistantReplyFor } from "@/src/components/commercial/ChatPanel";
import { readDashboardChat, writeDashboardChat } from "@/src/lib/dashboardState";

export function useAmiioChat(activeTab: TopNavTabId, persistKey?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!persistKey) return;
    setMessages(readDashboardChat(persistKey));
  }, [persistKey]);

  const suggestions = useMemo(() => {
    if (activeTab === "reporting")
      return ["Create a monthly report outline", "Which sections changed most?", "Export reporting PDF"];
    if (activeTab === "finance")
      return ["Explain NOI drivers", "Show debt ratio movement", "Summarize cashflow impact"];
    if (activeTab === "amiio")
      return [
        "Create a one-page strategic summary for Yellow Submarine Portfolio for the investment committee",
        "Rank my assets by risk score and explain the main drivers",
        "Create a portfolio performance summary for Q2",
      ];
    return ["Which assets expire next?", "Summarize rent variance vs market", "Generate a lease expiry export"];
  }, [activeTab]);

  useEffect(() => {
    if (persistKey) return;
    setMessages([]);
    setIsTyping(false);
  }, [activeTab, persistKey]);

  useEffect(() => {
    if (!persistKey) return;
    writeDashboardChat(persistKey, messages);
  }, [messages, persistKey]);

  const onNewChat = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
    if (persistKey) writeDashboardChat(persistKey, []);
  }, [persistKey]);

  const onSend = (text: string) => {
    if (isTyping) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    window.setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: __assistantReplyFor(text),
        timestamp: new Date().toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 900);
  };

  return { messages, isTyping, suggestions, onSend, onNewChat };
}
