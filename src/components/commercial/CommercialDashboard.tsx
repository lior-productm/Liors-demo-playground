"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TopNavTabId } from "@/src/types/commercial";
import type { SidebarNavId } from "@/src/types/navigation";
import { ToastStack } from "./ToastStack";
import {
  ChatPanel,
  ChatAside,
  __assistantReplyFor,
} from "./ChatPanel";
import { FloatingAmiioChat } from "./FloatingAmiioChat";
import { CommercialChatInjectContext } from "./CommercialChatContext";
import { EntityPropertyFilterBar } from "./EntityPropertyFilterBar";
import {
  getFilterEntityOptions,
  getFilterPortfolioOptions,
  getFilterPropertyOptions,
} from "@/src/lib/leaseBackendData";
import { lazyNamed } from "@/src/lib/lazy-component";
import {
  AppShell,
  DashboardPageBody,
  DashboardPageHeader,
} from "@/src/components/layout/AppShell";
import { DashboardPageTabs } from "@/src/components/layout/DashboardPageTabs";
import type { ChatMessage } from "@/src/types/commercial";
import {
  readCommercialDashboardState,
  writeCommercialDashboardState,
  type CommercialDashboardState,
} from "@/src/lib/dashboardState";

const PortfolioOverviewView = lazyNamed(
  () => import("./views/PortfolioOverviewView"),
  "PortfolioOverviewView",
  "Loading overview…",
);
const PropertyHubView = lazyNamed(
  () => import("./views/PropertyHubView"),
  "PropertyHubView",
  "Loading property hub…",
);
const RentRollView = lazyNamed(
  () => import("./views/RentRollView"),
  "RentRollView",
  "Loading rent roll…",
);

type CommercialView = "overview" | "rent-roll";

const DEFAULT_PORTFOLIO = "Portfolio A";
const DEFAULT_ENTITY = "Select entity";
const DEFAULT_PROPERTY = "Select property";

const COMMERCIAL_TABS = [
  { id: "overview" as const, label: "Overview" },
  { id: "rent-roll" as const, label: "Rent Roll" },
];

const COMMERCIAL_DEFAULTS: CommercialDashboardState = {
  view: "overview",
  selectedPortfolio: DEFAULT_PORTFOLIO,
  selectedEntity: DEFAULT_ENTITY,
  selectedProperty: DEFAULT_PROPERTY,
  messages: [],
  chatMinimized: true,
};

export function CommercialDashboard({
  activeTab,
  activeNav = "commercial",
  onTabChange,
}: {
  activeTab: TopNavTabId;
  activeNav?: SidebarNavId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const router = useRouter();
  const [view, setView] = useState<CommercialView>("overview");
  const [selectedPortfolio, setSelectedPortfolio] = useState(DEFAULT_PORTFOLIO);
  const [selectedEntity, setSelectedEntity] = useState(DEFAULT_ENTITY);
  const [selectedProperty, setSelectedProperty] = useState(DEFAULT_PROPERTY);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(true);
  const [chatDraftPayload, setChatDraftPayload] = useState<{
    id: number;
    text: string;
  } | null>(null);

  useEffect(() => {
    const saved = readCommercialDashboardState(COMMERCIAL_DEFAULTS);
    const migratedView =
      saved.view === "rent-roll"
        ? "rent-roll"
        : saved.view === "property"
          ? "rent-roll"
          : "overview";
    setView(migratedView);
    setSelectedPortfolio(saved.selectedPortfolio);
    setSelectedEntity(saved.selectedEntity);
    setSelectedProperty(saved.selectedProperty);
    setMessages(saved.messages);
  }, []);

  const suggestions = useMemo(() => {
    const base = [
      "Summarize the performance of all entities in portfolio A",
      "Which properties are underperforming?",
      "Rank my assets by risk score and explain the main drivers",
    ];
    if (activeTab === "reporting")
      return [
        "Create a monthly report outline",
        "Please summarise the content of this page",
        "Which reports are due this week?",
      ];
    if (activeTab === "finance")
      return [
        "Explain NOI drivers",
        "Please summarise the content of this page",
        "Which properties are underperforming?",
      ];
    if (activeTab === "amiio")
      return [
        "What did Amiio detect today?",
        "Please summarise the content of this page",
        "Which properties are underperforming?",
      ];
    return base;
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "commercial") {
      setMessages([]);
      setIsTyping(false);
    }
  }, [activeTab]);

  useEffect(() => {
    writeCommercialDashboardState({
      view,
      selectedPortfolio,
      selectedEntity,
      selectedProperty,
      messages,
      chatMinimized,
    });
  }, [view, selectedPortfolio, selectedEntity, selectedProperty, messages, chatMinimized]);

  useEffect(() => {
    const onExpandChat = () => setChatMinimized(false);
    window.addEventListener("amiio:expand-chat", onExpandChat);
    return () => window.removeEventListener("amiio:expand-chat", onExpandChat);
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setIsTyping(false);
    writeCommercialDashboardState({
      view,
      selectedPortfolio,
      selectedEntity,
      selectedProperty,
      messages: [],
      chatMinimized,
    });
  }, [view, selectedPortfolio, selectedEntity, selectedProperty, chatMinimized]);

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
    router.push("/workflows/leasing-renewal");
  };

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

  const isEntitySelected = selectedEntity !== DEFAULT_ENTITY;
  const isPropertySelected = selectedProperty !== DEFAULT_PROPERTY;

  const portfolioOptions = useMemo(() => getFilterPortfolioOptions(), []);
  const entityOptions = useMemo(
    () => getFilterEntityOptions(selectedPortfolio),
    [selectedPortfolio],
  );
  const propertyOptions = useMemo(
    () =>
      isEntitySelected
        ? getFilterPropertyOptions(selectedPortfolio, selectedEntity)
        : [],
    [isEntitySelected, selectedEntity, selectedPortfolio],
  );

  const handlePortfolioChange = useCallback((value: string) => {
    setSelectedPortfolio(value);
    setSelectedEntity(DEFAULT_ENTITY);
    setSelectedProperty(DEFAULT_PROPERTY);
  }, []);

  const handleEntityChange = useCallback((value: string) => {
    setSelectedEntity(value);
    setSelectedProperty(DEFAULT_PROPERTY);
  }, []);

  const handlePropertyChange = useCallback((value: string) => {
    setSelectedProperty(value);
  }, []);

  return (
    <CommercialChatInjectContext.Provider value={injectChatDraft}>
      <AppShell
        activeNav={activeNav}
        chatMinimized={chatMinimized}
        chatPanel={
          <ChatAside>
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
          </ChatAside>
        }
        chatRestoreFab={
          <FloatingAmiioChat
            messages={messages}
            suggestions={suggestions}
            isTyping={isTyping}
            onSend={handleSend}
            onExpandPanel={() => setChatMinimized(false)}
            chatDraftPayload={chatDraftPayload}
            onChatDraftPayloadConsumed={() => setChatDraftPayload(null)}
          />
        }
      >
        <DashboardPageHeader
          title="Commercial Dashboard"
          tabs={
            <DashboardPageTabs
              tabs={COMMERCIAL_TABS}
              activeId={view}
              onChange={(id) => setView(id as CommercialView)}
            />
          }
          filters={
            <EntityPropertyFilterBar
              portfolioLabel={selectedPortfolio}
              entityLabel={selectedEntity}
              propertyLabel={selectedProperty}
              portfolioOptions={portfolioOptions}
              entityOptions={entityOptions}
              propertyOptions={propertyOptions}
              onPortfolioChange={handlePortfolioChange}
              onEntityChange={handleEntityChange}
              onPropertyChange={handlePropertyChange}
            />
          }
        />

        <DashboardPageBody>
          {view === "overview" &&
            (isPropertySelected ? (
              <PropertyHubView
                onNavigateToLeasing={handleNavigateToLeasing}
                onAnalyseWithAmiio={handleAnalyseWithAmiio}
              />
            ) : (
              <PortfolioOverviewView
                scope={isEntitySelected ? "entity" : "portfolio"}
                selectedPortfolio={selectedPortfolio}
                selectedEntity={selectedEntity}
                selectedProperty={selectedProperty}
                onAnalyseWithAmiio={handleAnalyseWithAmiio}
              />
            ))}

          {view === "rent-roll" && (
            <RentRollView onAnalyseWithAmiio={handleAnalyseWithAmiio} />
          )}
        </DashboardPageBody>
      </AppShell>
    </CommercialChatInjectContext.Provider>
  );
}
