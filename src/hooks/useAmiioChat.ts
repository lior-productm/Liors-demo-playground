"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChatMessage, TopNavTabId } from "@/src/types/commercial";
import { __assistantReplyFor } from "@/src/components/commercial/ChatPanel";

export function useAmiioChat(activeTab: TopNavTabId) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = useMemo(() => {
    if (activeTab === "reporting")
      return ["Create a monthly report outline", "Which sections changed most?", "Export reporting PDF"];
    if (activeTab === "finance")
      return ["Explain NOI drivers", "Show debt ratio movement", "Summarize cashflow impact"];
    if (activeTab === "amiio")
      return ["What did Amiio detect today?", "Summarize proactive opportunities", "Ask for recommended next steps"];
    if (activeTab === "browser")
      return ["Summarize this page", "Extract key dates from the content", "Compare this to our portfolio context"];
    return ["Which assets expire next?", "Summarize rent variance vs market", "Generate a lease expiry export"];
  }, [activeTab]);

  useEffect(() => {
    setMessages([]);
    setIsTyping(false);
  }, [activeTab]);

  const onNewChat = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

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

