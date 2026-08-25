"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/src/components/layout/AppShell";
import { ChatHistoryTrigger } from "@/src/components/commercial/ChatHistoryTrigger";
import { AiAssistantChatBar } from "@/src/components/ai-assistants/AiAssistantChatBar";
import { AiAssistantTabNav } from "@/src/components/ai-assistants/AiAssistantTabNav";
import {
  AiAssistantSourcesPanel,
  NewSourceButton,
} from "@/src/components/ai-assistants/AiAssistantSourcesPanel";
import {
  AiAssistantTasksTable,
  NewTaskButton,
} from "@/src/components/ai-assistants/AiAssistantTasksTable";
import { AiAssistantRecentChatsList } from "@/src/components/ai-assistants/AiAssistantRecentChatsList";
import {
  AiAssistantConversation,
  type AiAssistantChatMessage,
} from "@/src/components/ai-assistants/AiAssistantConversation";
import type {
  AiAssistantRecentChat,
  AiAssistantSource,
  AiAssistantTabId,
  AiAssistantTask,
} from "@/src/lib/aiAssistantsData";
import {
  getRecentChatTranscript,
  transcriptToMessages,
} from "@/src/lib/aiAssistantRecentChatTranscripts";
import { analystHomeEvent } from "@/src/lib/aiAssistantNavState";
import type { SidebarNavId } from "@/src/types/navigation";

const FULL_CHAT_MAX_PX = 720;

export type AnalystWorkspaceConfig = {
  /** Absolute route path, e.g. "/ai-assistants/lease-analyst". */
  basePath: string;
  activeNav: SidebarNavId;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  tasks: AiAssistantTask[];
  sources: AiAssistantSource[];
  recentChats: AiAssistantRecentChat[];
  newTaskSuggestions: readonly string[];
};

function parseTab(value: string | null): AiAssistantTabId {
  if (value === "recent-chats" || value === "sources" || value === "tasks") return value;
  return "tasks";
}

function buildAssistantReply(userMessage: string): string {
  return `Got it. I'll continue on "${userMessage}" using your connected data sources. Anything specific you'd like me to focus on?`;
}

export function AnalystWorkspacePage({ config }: { config: AnalystWorkspaceConfig }) {
  const {
    basePath,
    activeNav,
    title,
    description,
    Icon,
    tasks,
    sources: initialSources,
    recentChats,
    newTaskSuggestions,
  } = config;

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = parseTab(searchParams.get("tab"));
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<AiAssistantChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [newTaskChatActive, setNewTaskChatActive] = useState(false);
  const [sources, setSources] = useState<AiAssistantSource[]>([...initialSources]);
  const fullChatActive = messages.length > 0 || isTyping;

  const newTaskGreeting: AiAssistantChatMessage = {
    id: "new-task-greeting",
    role: "assistant",
    content:
      "How can I help you set up a new task? Choose a suggestion below or describe what you'd like to automate.",
    suggestions: newTaskSuggestions,
  };

  const resetToHome = useCallback(() => {
    setMessages([]);
    setDraft("");
    setIsTyping(false);
    setNewTaskChatActive(false);
    router.replace(basePath);
  }, [router, basePath]);

  useEffect(() => {
    const eventName = analystHomeEvent(basePath);
    window.addEventListener(eventName, resetToHome);
    return () => window.removeEventListener(eventName, resetToHome);
  }, [resetToHome, basePath]);

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
      router.replace(query ? `${basePath}?${query}` : basePath);
    },
    [router, searchParams, basePath],
  );

  const appendExchange = useCallback((userMessage: string) => {
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
          content: buildAssistantReply(userMessage),
        },
      ]);
    }, 900);
  }, []);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isTyping) return;
    setDraft("");
    appendExchange(trimmed);
  };

  const handleNewTask = () => {
    setNewTaskChatActive(true);
    setMessages([newTaskGreeting]);
  };

  const handleRecentChatSelect = (chat: AiAssistantRecentChat) => {
    const turns = getRecentChatTranscript(chat.id);
    setNewTaskChatActive(false);
    if (turns.length > 0) {
      setMessages(transcriptToMessages(chat.id, turns));
      return;
    }
    setMessages([
      { id: `${chat.id}-user`, role: "user", content: chat.title },
      {
        id: `${chat.id}-assistant`,
        role: "assistant",
        content: `Here's what I found for "${chat.title}". Let me know if you'd like me to dig deeper.`,
      },
    ]);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    appendExchange(suggestion);
  };

  const handleRemoveSource = (id: string) => {
    setSources((current) => current.filter((source) => source.id !== id));
  };

  const handleUploadSource = () => {
    setSources([...initialSources]);
    window.dispatchEvent(
      new CustomEvent("amiio:toast", { detail: { message: "Sources connected" } }),
    );
  };

  void newTaskChatActive;

  if (fullChatActive) {
    return (
      <AppShell activeNav={activeNav} mainAlign="center" hideMainScrollbar>
        <div className="relative mx-auto flex min-h-full w-full flex-col bg-[#F7F8FA] px-6">
          <div className="absolute right-8 top-8 z-10">
            <ChatHistoryTrigger />
          </div>

          <div
            className="mx-auto flex w-full flex-1 flex-col pt-8"
            style={{ maxWidth: FULL_CHAT_MAX_PX }}
          >
            <header className="flex shrink-0 flex-col items-center gap-2 pb-6 pt-16 text-center">
              <Icon className="h-8 w-auto" />
              <h1 className="typo-h3 text-black">{title}</h1>
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
    <AppShell activeNav={activeNav} mainAlign="center" hideMainScrollbar>
      <div className="relative mx-auto w-full max-w-[984px] px-4 pb-12 pt-6 sm:px-6">
        <div className="absolute right-4 top-6 sm:right-6">
          <ChatHistoryTrigger />
        </div>

        <header className="mx-auto flex max-w-[879px] flex-col items-center gap-5 pt-12 text-center">
          <Icon className="h-8 w-auto" />
          <div className="flex flex-col gap-2">
            <h1 className="typo-h3 text-black">{title}</h1>
            <p className="max-w-lg typo-p2-r text-[#65686B]">{description}</p>
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

          {activeTab === "tasks" ? <AiAssistantTasksTable tasks={tasks} /> : null}

          {activeTab === "recent-chats" ? (
            <AiAssistantRecentChatsList
              chats={recentChats}
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
