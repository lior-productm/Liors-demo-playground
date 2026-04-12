"use client";

import { useCallback, useEffect, useState } from "react";
import type { TopNavTabId } from "@/src/types/commercial";
import { TopNav } from "@/src/components/commercial/TopNav";
import { ToastStack } from "@/src/components/commercial/ToastStack";
import { EntityPropertyFilterBar } from "@/src/components/commercial/EntityPropertyFilterBar";
import {
  ChatPanel,
  ChatRestoreFab,
  ResizableChatAside,
  type ChatDraftPayload,
} from "@/src/components/commercial/ChatPanel";
import { CommercialChatInjectContext } from "@/src/components/commercial/CommercialChatContext";
import { useAmiioChat } from "@/src/hooks/useAmiioChat";
import { FinancialBudgetingPanel } from "@/src/components/pages/FinancialBudgetingPanel";
import { FinancialCapexCfPanel } from "@/src/components/pages/FinancialCapexCfPanel";
import { FinancialDebtCompliancePanel } from "@/src/components/pages/FinancialDebtCompliancePanel";
import { FinancialOverviewPanel } from "@/src/components/pages/FinancialOverviewPanel";
import { cn } from "@/lib/utils";

const FINANCIAL_SUB_TABS = [
  { id: "overview", label: "Overview" },
  { id: "debt-compliance", label: "Debt Compliance" },
  { id: "budgetting", label: "Budgeting" },
  { id: "capex-cf", label: "Capex & CF" },
] as const;

type FinancialSubTabId = (typeof FINANCIAL_SUB_TABS)[number]["id"];

export function FinancialDashboard({
  activeTab,
  onTabChange,
}: {
  activeTab: TopNavTabId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const chat = useAmiioChat(activeTab);
  const [financialSubTab, setFinancialSubTab] = useState<FinancialSubTabId>("overview");
  const [chatDraftPayload, setChatDraftPayload] = useState<ChatDraftPayload>(null);
  const [chatExpanded, setChatExpanded] = useState(true);

  const injectFinancialChatDraft = useCallback((text: string) => {
    setChatDraftPayload({ id: Date.now(), text });
  }, []);

  useEffect(() => {
    if (chatDraftPayload) setChatExpanded(true);
  }, [chatDraftPayload]);

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
              <h1 className="typo-h4 text-[#010309]">Financial Dashboard</h1>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {FINANCIAL_SUB_TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFinancialSubTab(id)}
                    className={cn(
                      "h-[36px] rounded-full text-[14px] font-medium leading-[1.25] transition-colors",
                      financialSubTab === id
                        ? "bg-[#010309] px-5 text-white"
                        : "px-4 text-[#969A9E] hover:text-[#353638]",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex shrink-0 justify-end sm:ml-auto">
                <EntityPropertyFilterBar clearToastMessage="Cleared financial filters" />
              </div>
            </div>

            <CommercialChatInjectContext.Provider value={injectFinancialChatDraft}>
              {financialSubTab === "overview" ? <FinancialOverviewPanel /> : null}
              {financialSubTab === "debt-compliance" ? <FinancialDebtCompliancePanel /> : null}
              {financialSubTab === "budgetting" ? <FinancialBudgetingPanel /> : null}
              {financialSubTab === "capex-cf" ? <FinancialCapexCfPanel /> : null}
              {financialSubTab !== "overview" &&
              financialSubTab !== "debt-compliance" &&
              financialSubTab !== "budgetting" &&
              financialSubTab !== "capex-cf" ? (
                <div className="mb-3 rounded-xl border border-border bg-card px-4 py-6">
                  <div className="typo-h5 text-foreground">
                    {FINANCIAL_SUB_TABS.find((t) => t.id === financialSubTab)?.label}
                  </div>
                  <p className="mt-2 typo-p3-r text-muted-foreground">
                    This section is reserved for{" "}
                    {FINANCIAL_SUB_TABS.find((t) => t.id === financialSubTab)?.label} analytics. Use the
                    chat panel to ask Amiio about drivers, covenants, and portfolio context.
                  </p>
                </div>
              ) : null}
            </CommercialChatInjectContext.Provider>
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
                chatDraftPayload={chatDraftPayload}
                onChatDraftPayloadConsumed={() => setChatDraftPayload(null)}
              />
            </ResizableChatAside>
          ) : null}
        </div>
        {!chatExpanded ? <ChatRestoreFab onExpand={() => setChatExpanded(true)} /> : null}
      </main>
    </div>
  );
}

