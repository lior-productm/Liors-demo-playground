"use client";

import { useCallback, useEffect, useState } from "react";
import type { TopNavTabId } from "@/src/types/commercial";
import { EntityPropertyFilterBar } from "@/src/components/commercial/EntityPropertyFilterBar";
import { useEntityPropertyFilters } from "@/src/hooks/useEntityPropertyFilters";
import {
  ChatPanel,
  ChatAside,
  type ChatDraftPayload,
} from "@/src/components/commercial/ChatPanel";
import { FloatingAmiioChat } from "@/src/components/commercial/FloatingAmiioChat";
import { CommercialChatInjectContext } from "@/src/components/commercial/CommercialChatContext";
import { useAmiioChat } from "@/src/hooks/useAmiioChat";
import {
  readFinancialDashboardUi,
  writeFinancialDashboardUi,
} from "@/src/lib/dashboardState";
import { lazyNamed } from "@/src/lib/lazy-component";
import {
  AppShell,
  DashboardPageBody,
  DashboardPageHeader,
} from "@/src/components/layout/AppShell";
import { DashboardPageTabs } from "@/src/components/layout/DashboardPageTabs";

const FinancialOverviewPanel = lazyNamed(
  () => import("@/src/components/pages/FinancialOverviewPanel"),
  "FinancialOverviewPanel",
  "Loading overview…",
);
const FinancialDebtCompliancePanel = lazyNamed(
  () => import("@/src/components/pages/FinancialDebtCompliancePanel"),
  "FinancialDebtCompliancePanel",
  "Loading debt compliance…",
);
const FinancialBudgetingPanel = lazyNamed(
  () => import("@/src/components/pages/FinancialBudgetingPanel"),
  "FinancialBudgetingPanel",
  "Loading budgeting…",
);
const FinancialCapexCfPanel = lazyNamed(
  () => import("@/src/components/pages/FinancialCapexCfPanel"),
  "FinancialCapexCfPanel",
  "Loading capex & CF…",
);

const FINANCIAL_SUB_TABS = [
  { id: "overview", label: "Overview" },
  { id: "debt-compliance", label: "Debt Compliance" },
  { id: "budgetting", label: "Budgeting" },
  { id: "capex-cf", label: "Capex & CF" },
] as const;

type FinancialSubTabId = (typeof FINANCIAL_SUB_TABS)[number]["id"];

export function FinancialDashboard({
  activeTab,
}: {
  activeTab: TopNavTabId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const [financialSubTab, setFinancialSubTab] = useState<FinancialSubTabId>("overview");
  const [chatDraftPayload, setChatDraftPayload] = useState<ChatDraftPayload>(null);
  const [chatExpanded, setChatExpanded] = useState(false);

  useEffect(() => {
    const savedUi = readFinancialDashboardUi({
      financialSubTab: "overview",
      chatExpanded: false,
    });
    setFinancialSubTab(savedUi.financialSubTab as FinancialSubTabId);
  }, []);

  const chat = useAmiioChat(activeTab, "financial");
  const filters = useEntityPropertyFilters();

  useEffect(() => {
    writeFinancialDashboardUi({ financialSubTab, chatExpanded });
  }, [financialSubTab, chatExpanded]);

  const injectFinancialChatDraft = useCallback((text: string) => {
    setChatDraftPayload({ id: Date.now(), text });
  }, []);

  useEffect(() => {
    if (chatDraftPayload) setChatExpanded(true);
  }, [chatDraftPayload]);

  useEffect(() => {
    const onExpandChat = () => setChatExpanded(true);
    window.addEventListener("amiio:expand-chat", onExpandChat);
    return () => window.removeEventListener("amiio:expand-chat", onExpandChat);
  }, []);

  return (
    <AppShell
      activeNav="financial"
      chatMinimized={!chatExpanded}
      chatPanel={
        <ChatAside>
          <ChatPanel
            messages={chat.messages}
            suggestions={chat.suggestions}
            isTyping={chat.isTyping}
            onSend={chat.onSend}
            onNewChat={chat.onNewChat}
            onMinimize={() => setChatExpanded(false)}
            chatDraftPayload={chatDraftPayload}
            onChatDraftPayloadConsumed={() => setChatDraftPayload(null)}
          />
        </ChatAside>
      }
      chatRestoreFab={
        <FloatingAmiioChat
          messages={chat.messages}
          suggestions={chat.suggestions}
          isTyping={chat.isTyping}
          onSend={chat.onSend}
          onExpandPanel={() => setChatExpanded(true)}
          chatDraftPayload={chatDraftPayload}
          onChatDraftPayloadConsumed={() => setChatDraftPayload(null)}
        />
      }
    >
      <DashboardPageHeader
        title="Financial Dashboard"
        tabs={
          <DashboardPageTabs
            tabs={FINANCIAL_SUB_TABS}
            activeId={financialSubTab}
            onChange={(id) => setFinancialSubTab(id as FinancialSubTabId)}
          />
        }
        filters={
          <EntityPropertyFilterBar
            portfolioLabel={filters.selectedPortfolio}
            entityLabel={filters.selectedEntity}
            propertyLabel={filters.selectedProperty}
            portfolioOptions={filters.portfolioOptions}
            entityOptions={filters.entityOptions}
            propertyOptions={filters.propertyOptions}
            onPortfolioChange={filters.handlePortfolioChange}
            onEntityChange={filters.handleEntityChange}
            onPropertyChange={filters.handlePropertyChange}
          />
        }
      />

      <DashboardPageBody>
        <CommercialChatInjectContext.Provider value={injectFinancialChatDraft}>
          {financialSubTab === "overview" ? <FinancialOverviewPanel /> : null}
          {financialSubTab === "debt-compliance" ? <FinancialDebtCompliancePanel /> : null}
          {financialSubTab === "budgetting" ? <FinancialBudgetingPanel /> : null}
          {financialSubTab === "capex-cf" ? <FinancialCapexCfPanel /> : null}
        </CommercialChatInjectContext.Provider>
      </DashboardPageBody>
    </AppShell>
  );
}
