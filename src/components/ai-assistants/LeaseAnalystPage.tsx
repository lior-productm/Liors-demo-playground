"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppShell } from "@/src/components/layout/AppShell";
import { ChatHistoryTrigger } from "@/src/components/commercial/ChatHistoryTrigger";
import { AiAssistantChatBar } from "@/src/components/ai-assistants/AiAssistantChatBar";
import { AiAssistantTabNav } from "@/src/components/ai-assistants/AiAssistantTabNav";
import {
  AiAssistantSourcesPanel,
  NewSourceButton,
} from "@/src/components/ai-assistants/AiAssistantSourcesPanel";
import { LeaseAnalystIcon } from "@/src/components/ai-assistants/LeaseAnalystIcon";
import {
  AiAssistantTasksTable,
  NewTaskButton,
} from "@/src/components/ai-assistants/AiAssistantTasksTable";
import { AiAssistantRecentChatsList } from "@/src/components/ai-assistants/AiAssistantRecentChatsList";
import {
  AiAssistantConversation,
  type AiAssistantChatMessage,
} from "@/src/components/ai-assistants/AiAssistantConversation";
import {
  LEASE_ANALYST_RECENT_CHATS,
  LEASE_ANALYST_SOURCES,
  LEASE_ANALYST_TASKS,
  NEW_TASK_CHAT_SUGGESTIONS,
  type AiAssistantRecentChat,
  type AiAssistantSource,
  type AiAssistantTabId,
} from "@/src/lib/aiAssistantsData";
import {
  getRecentChatTranscript,
  transcriptToMessages,
} from "@/src/lib/aiAssistantRecentChatTranscripts";
import { analystHomeEvent, LEASE_ANALYST_HOME } from "@/src/lib/aiAssistantNavState";

const FULL_CHAT_MAX_PX = 720;

function parseTab(value: string | null): AiAssistantTabId {
  if (value === "recent-chats" || value === "sources" || value === "tasks") return value;
  return "tasks";
}

function buildAssistantReply(userMessage: string, isNewTaskFlow: boolean): string {
  if (!isNewTaskFlow) {
    const lower = userMessage.toLowerCase();
    if (lower.includes("renewal") || lower.includes("extend")) {
      return "I can pull the latest renewal status for that asset and update the lease timeline. Want me to include tenant payment history in the summary?";
    }
    if (lower.includes("wault") || lower.includes("expir")) {
      return "I'll refresh the WAULT and expiry analysis with current lease data. Should I scope this to a single asset or the full portfolio?";
    }
    if (lower.includes("export") || lower.includes("pdf") || lower.includes("report")) {
      return "I can export an updated version with the latest lease events and rent figures. Say if you want the IC format or the full detail report.";
    }
    return `Got it. I'll continue on "${userMessage}" using your current lease register and rent roll. Anything specific you'd like me to focus on?`;
  }

  const lower = userMessage.toLowerCase();
  if (lower.includes("expir")) {
    return "I can set up a task that scans your lease register daily and alerts you when any lease is within 90 days of expiry. Which portfolio or assets should I monitor?";
  }
  if (lower.includes("renewal") || lower.includes("email")) {
    return "Got it — I'll create a task that drafts renewal emails based on lease terms, expiry dates, and tenant payment history. Should this run automatically when a rent review date approaches?";
  }
  if (lower.includes("break option")) {
    return "I'll monitor break option windows across your portfolio and flag tenants 90 days before a break can be exercised. Want alerts sent by email or added to your task list?";
  }
  if (lower.includes("data quality") || lower.includes("quality check")) {
    return "I can schedule a weekly check for missing lease fields, duplicated tenants, and mismatches against your rent roll. Which properties should I include?";
  }
  return `I'll help you set up an automated task for: "${userMessage}". Tell me which assets to include and how often you'd like this to run.`;
}

const NEW_TASK_GREETING: AiAssistantChatMessage = {
  id: "new-task-greeting",
  role: "assistant",
  content:
    "How can I help you set up a new task? Choose a suggestion below or describe what you'd like to automate.",
  suggestions: NEW_TASK_CHAT_SUGGESTIONS,
};

export function LeaseAnalystPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = parseTab(searchParams.get("tab"));
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<AiAssistantChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [newTaskChatActive, setNewTaskChatActive] = useState(false);
  const [sources, setSources] = useState<AiAssistantSource[]>([...LEASE_ANALYST_SOURCES]);
  const fullChatActive = messages.length > 0 || isTyping;

  const resetToHome = useCallback(() => {
    setMessages([]);
    setDraft("");
    setIsTyping(false);
    setNewTaskChatActive(false);
    router.replace("/ai-assistants/lease-analyst");
  }, [router]);

  useEffect(() => {
    const scopedEvent = analystHomeEvent("/ai-assistants/lease-analyst");
    window.addEventListener(LEASE_ANALYST_HOME, resetToHome);
    window.addEventListener(scopedEvent, resetToHome);
    return () => {
      window.removeEventListener(LEASE_ANALYST_HOME, resetToHome);
      window.removeEventListener(scopedEvent, resetToHome);
    };
  }, [resetToHome]);

  useEffect(() => {
    if (!fullChatActive) return;
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, fullChatActive]);

  const setTab = useCallback(
    (tab: AiAssistantTabId) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "tasks") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
      const query = params.toString();
      router.replace(query ? `/ai-assistants/lease-analyst?${query}` : "/ai-assistants/lease-analyst");
    },
    [router, searchParams],
  );

  const appendExchange = useCallback((userMessage: string, isNewTaskFlow: boolean) => {
    const userMsg: AiAssistantChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessage,
    };

    setMessages((current) => [
      ...current.map((message) =>
        message.suggestions ? { ...message, suggestions: undefined } : message,
      ),
      userMsg,
    ]);
    setIsTyping(true);

    window.setTimeout(() => {
      setIsTyping(false);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: buildAssistantReply(userMessage, isNewTaskFlow),
        },
      ]);
    }, 900);
  }, []);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isTyping) return;
    setDraft("");
    appendExchange(trimmed, newTaskChatActive);
  };

  const handleNewTask = () => {
    setNewTaskChatActive(true);
    setMessages([NEW_TASK_GREETING]);
  };

  const handleRecentChatSelect = (chat: AiAssistantRecentChat) => {
    const turns = getRecentChatTranscript(chat.id);
    setNewTaskChatActive(false);
    setMessages(transcriptToMessages(chat.id, turns));
  };

  const handleSuggestionSelect = (suggestion: string) => {
    appendExchange(suggestion, true);
  };

  const handleRemoveSource = (id: string) => {
    setSources((current) => current.filter((source) => source.id !== id));
  };

  const handleUploadSource = () => {
    setSources([...LEASE_ANALYST_SOURCES]);
    window.dispatchEvent(
      new CustomEvent("amiio:toast", { detail: { message: "Sources connected" } }),
    );
  };

  if (fullChatActive) {
    return (
      <AppShell activeNav="lease-analyst" mainAlign="center" hideMainScrollbar>
        <div className="relative mx-auto flex min-h-full w-full flex-col bg-[#F7F8FA] px-6">
          <div className="absolute right-8 top-8 z-10">
            <ChatHistoryTrigger />
          </div>

          <div
            className="mx-auto flex w-full flex-1 flex-col pt-8"
            style={{ maxWidth: FULL_CHAT_MAX_PX }}
          >
            <header className="flex shrink-0 flex-col items-center gap-2 pb-6 pt-16 text-center">
              <LeaseAnalystIcon className="h-8 w-auto" />
              <h1 className="typo-h3 text-black">Commercial Analyst</h1>
            </header>

            <div ref={listRef} className="flex flex-col gap-6 pb-6">
              <AiAssistantConversation
                messages={messages}
                isTyping={isTyping}
                onSuggestionSelect={handleSuggestionSelect}
                className="max-w-none"
              />
            </div>
          </div>

          <div
            className="sticky bottom-0 z-40 mx-auto flex w-full max-w-[720px] shrink-0 justify-center pb-6 pt-3"
            style={{
              background: "linear-gradient(180deg, transparent 0%, #F7F8FA 45%)",
            }}
          >
            <AiAssistantChatBar
              className="w-full"
              draft={draft}
              isTyping={isTyping}
              inputRef={inputRef}
              onDraftChange={setDraft}
              onSubmit={handleFormSubmit}
              suggestions={[]}
              placeholder="Ask me anything"
            />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeNav="lease-analyst" mainAlign="center" hideMainScrollbar>
      <div className="relative mx-auto w-full max-w-[984px] px-4 pb-12 pt-6 sm:px-6">
        <div className="absolute right-4 top-6 sm:right-6">
          <ChatHistoryTrigger />
        </div>

        <header className="mx-auto flex max-w-[879px] flex-col items-center gap-5 pt-12 text-center">
          <LeaseAnalystIcon className="h-8 w-auto" />
          <div className="flex flex-col gap-2">
            <h1 className="typo-h3 text-black">Commercial Analyst</h1>
            <p className="max-w-lg typo-p2-r text-[#65686B]">
              Helps you stay ahead of lease events, tenant risks, renewal deadlines, break
              options, and rent review dates.
            </p>
          </div>
          <AiAssistantChatBar
            className="w-full max-w-[720px]"
            draft={draft}
            isTyping={isTyping}
            inputRef={inputRef}
            onDraftChange={setDraft}
            onSubmit={handleFormSubmit}
          />
        </header>

        <section className="mx-auto mt-10 flex w-full max-w-[900px] flex-col items-center gap-8">
          <AiAssistantTabNav
            activeTab={activeTab}
            onTabChange={setTab}
            trailing={
              activeTab === "tasks" ? (
                <NewTaskButton onClick={handleNewTask} />
              ) : activeTab === "sources" && sources.length > 0 ? (
                <NewSourceButton onClick={handleUploadSource} />
              ) : undefined
            }
            centered
          />

          {activeTab === "tasks" ? (
            <AiAssistantTasksTable tasks={LEASE_ANALYST_TASKS} />
          ) : null}

          {activeTab === "recent-chats" ? (
            <AiAssistantRecentChatsList
              chats={LEASE_ANALYST_RECENT_CHATS}
              onSelect={handleRecentChatSelect}
            />
          ) : null}

          {activeTab === "sources" ? (
            <AiAssistantSourcesPanel
              sources={sources}
              onRemove={handleRemoveSource}
              onUpload={handleUploadSource}
            />
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
