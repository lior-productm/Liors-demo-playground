"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChatMessage, TopNavTabId } from "@/src/types/commercial";
import { TopNav } from "./TopNav";
import { ToastStack } from "./ToastStack";
import {
  ChatPanel,
  ChatRestoreFab,
  ResizableChatAside,
  __assistantReplyFor,
} from "./ChatPanel";
import { CommercialChatInjectContext } from "./CommercialChatContext";
import { EntityPropertyFilterBar } from "./EntityPropertyFilterBar";
import { PropertyHubView } from "./views/PropertyHubView";
import { TenantHubView } from "./views/TenantHubView";
import { LeasingToolView } from "./views/LeasingToolView";
import { PortfolioOverviewView } from "./views/PortfolioOverviewView";
import { TenantModal } from "./TenantModal";

type CommercialView = "portfolio" | "property" | "tenant" | "leasing";

export function CommercialDashboard({
  activeTab,
  onTabChange,
}: {
  activeTab: TopNavTabId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const [view, setView] = useState<CommercialView>("portfolio");
  const [tenantModalOpen, setTenantModalOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [chatDraftPayload, setChatDraftPayload] = useState<{
    id: number;
    text: string;
  } | null>(null);
  /** When opening Leasing Tool from Tenant Hub lease renewal, jump straight to Proposal Prep. */
  const [leasingEntryIntent, setLeasingEntryIntent] = useState<
    "default" | "proposal-prep"
  >("default");

  const suggestions = useMemo(() => {
    const base = [
      "Why has the revenue decreased in the last year?",
      "Please summarise the content of this page",
    ];
    if (activeTab === "reporting")
      return [
        "Create a monthly report outline",
        "Please summarise the content of this page",
      ];
    if (activeTab === "finance")
      return [
        "Explain NOI drivers",
        "Please summarise the content of this page",
      ];
    if (activeTab === "amiio")
      return [
        "What did Amiio detect today?",
        "Please summarise the content of this page",
      ];
    return base;
  }, [activeTab]);

  useEffect(() => {
    setMessages([]);
    setIsTyping(false);
  }, [activeTab]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

  const sendUserMessage = useCallback(
    (text: string) => {
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
      }, 1100);
    },
    [isTyping],
  );

  const handleSend = sendUserMessage;

  const handleNavigateToLeasing = () => {
    setLeasingEntryIntent("default");
    setView("leasing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToLeaseRenewalProposalPrep = () => {
    setLeasingEntryIntent("proposal-prep");
    setView("leasing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearLeasingEntryIntent = useCallback(() => {
    setLeasingEntryIntent("default");
  }, []);

  const handleAnalyseWithAmiio = useCallback(
    (topic: string) => {
      setChatMinimized(false);
      sendUserMessage(`Analyse ${topic}`);
    },
    [sendUserMessage],
  );

  const injectChatDraft = useCallback((text: string) => {
    setChatMinimized(false);
    setChatDraftPayload({ id: Date.now(), text });
  }, []);

  const handleOpenTenantModal = () => setTenantModalOpen(true);
  const handleTenantConfirm = (_tenantName: string) => {
    setTenantModalOpen(false);
    setView("tenant");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleSecondaryTabClick = (tab: CommercialView) => {
    if (tab === "tenant") {
      setTenantModalOpen(true);
      return;
    }
    if (tab === "leasing") {
      setLeasingEntryIntent("default");
    }
    setView(tab);
  };

  return (
    <CommercialChatInjectContext.Provider value={injectChatDraft}>
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--Secondary-Sea-Salt)" }}
    >
      <TopNav activeTab={activeTab} onTabChange={onTabChange} />

      <ToastStack />

      <main className="mx-auto w-full max-w-[1512px] px-8 pb-6 pt-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <section className="min-w-0 flex-1">
            {/* Title + Filters Bar */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <h1 className="text-[20px] font-medium leading-[1.25] tracking-tight text-[#010309]">
                Commercial Dashboard
              </h1>

              <EntityPropertyFilterBar clearToastMessage="Cleared filters" />
            </div>

            {/* Secondary Navigation Tabs */}
            <div className="mb-6 flex items-center gap-2">
              {(
                [
                  { id: "portfolio" as const, label: "Portfolio" },
                  { id: "property" as const, label: "Property Hub" },
                  { id: "tenant" as const, label: "Tenant Hub" },
                  { id: "leasing" as const, label: "Leasing Tool" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSecondaryTabClick(t.id)}
                  className={
                    view === t.id
                      ? "h-[36px] rounded-full bg-[#010309] px-5 text-[14px] font-medium leading-[1.25] text-white transition-colors"
                      : "h-[36px] rounded-full px-4 text-[14px] font-medium leading-[1.25] text-[#969A9E] transition-colors hover:text-[#353638]"
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* View Content */}
            {view === "portfolio" && (
              <PortfolioOverviewView onAnalyseWithAmiio={handleAnalyseWithAmiio} />
            )}

            {view === "property" && (
              <PropertyHubView onNavigateToLeasing={handleNavigateToLeasing} onAnalyseWithAmiio={handleAnalyseWithAmiio} onOpenTenantHub={handleOpenTenantModal} />
            )}

            {view === "tenant" && (
              <TenantHubView
                onNavigateToLeasing={handleNavigateToLeaseRenewalProposalPrep}
                onAnalyseWithAmiio={handleAnalyseWithAmiio}
              />
            )}

            {view === "leasing" && (
              <LeasingToolView
                onOpenTenantHub={handleOpenTenantModal}
                onAnalyseWithAmiio={handleAnalyseWithAmiio}
                entryIntent={leasingEntryIntent}
                onEntryIntentApplied={clearLeasingEntryIntent}
              />
            )}
          </section>

          {/* Chat Panel — column hidden when minimized so main content uses full width */}
          {!chatMinimized ? (
            <ResizableChatAside>
              <ChatPanel
                messages={messages}
                suggestions={suggestions}
                isTyping={isTyping}
                onSend={handleSend}
                onNewChat={handleNewChat}
                onMinimize={() => setChatMinimized(true)}
                chatDraftPayload={chatDraftPayload}
                onChatDraftPayloadConsumed={() => setChatDraftPayload(null)}
              />
            </ResizableChatAside>
          ) : null}
        </div>
      </main>

      {chatMinimized && (
        <ChatRestoreFab onExpand={() => setChatMinimized(false)} />
      )}

      <TenantModal
        open={tenantModalOpen}
        onClose={() => setTenantModalOpen(false)}
        onConfirm={handleTenantConfirm}
      />
    </div>
    </CommercialChatInjectContext.Provider>
  );
}
