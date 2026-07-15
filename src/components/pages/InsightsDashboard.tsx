"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { TopNavTabId } from "@/src/types/commercial";
import {
  AppShell,
  DashboardPageBody,
  DashboardPageHeader,
} from "@/src/components/layout/AppShell";
import { CommercialChatInjectContext } from "@/src/components/commercial/CommercialChatContext";
import {
  ChatPanel,
  ChatAside,
  type ChatDraftPayload,
} from "@/src/components/commercial/ChatPanel";
import { FloatingAmiioChat } from "@/src/components/commercial/FloatingAmiioChat";
import { EntityPropertyFilterBar } from "@/src/components/commercial/EntityPropertyFilterBar";
import { useEntityPropertyFilters } from "@/src/hooks/useEntityPropertyFilters";
import { useAmiioChat } from "@/src/hooks/useAmiioChat";
import { readLocalJson, writeLocalJson } from "@/src/lib/browserStorage";
import {
  writeInsightsDashboardUi,
  DASHBOARD_STATE_KEYS,
} from "@/src/lib/dashboardState";
import { lazyNamed } from "@/src/lib/lazy-component";
import {
  INSIGHTS_SEED,
  type InsightCardModel,
  type InsightOverviewBucket,
  type InsightsInsightsSubTab,
  type InsightsTaskBoardLayout,
} from "@/src/components/pages/insights-data";

const InsightsManageInsightsSection = lazyNamed(
  () => import("@/src/components/pages/InsightsManageInsightsSection"),
  "InsightsManageInsightsSection",
  "Loading insights…",
);
const InsightCreationChatPanel = lazyNamed(
  () => import("@/src/components/ask-ai/InsightCreationChatPanel"),
  "InsightCreationChatPanel",
  "Loading…",
);
const InsightDetailSidebar = lazyNamed(
  () => import("@/src/components/pages/InsightDetailSidebar"),
  "InsightDetailSidebar",
  "Loading insight…",
);

export function InsightsDashboard({
  activeTab,
  onTabChange,
}: {
  activeTab: TopNavTabId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const chat = useAmiioChat(activeTab, "insights");
  const filters = useEntityPropertyFilters();
  // The Insights page now lands directly on the All Insights table; the
  // Overview / Manage / Amiiopedia sub-tabs have been retired.
  const [insightsSubTab, setInsightsSubTab] = useState<InsightsInsightsSubTab>("manage");
  const [insights, setInsights] = useState<InsightCardModel[]>([...INSIGHTS_SEED]);
  const [insightDetail, setInsightDetail] = useState<InsightCardModel | null>(null);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [incomingManageBucket, setIncomingManageBucket] =
    useState<InsightOverviewBucket | null>(null);
  const taskBoardLayout: InsightsTaskBoardLayout = "horizontal";
  const [chatDraftPayload, setChatDraftPayload] = useState<ChatDraftPayload>(null);
  const [focusInsightId, setFocusInsightId] = useState<string | null>(null);
  const [creatingInsight, setCreatingInsight] = useState(false);

  useEffect(() => {
    setInsights(readLocalJson(DASHBOARD_STATE_KEYS.insightsData, [...INSIGHTS_SEED]));
    // A just-created insight (from the Ask Amiio flow) is expanded and scrolled
    // into view on the table.
    const focusId = readLocalJson<string | null>(
      DASHBOARD_STATE_KEYS.insightsFocus,
      null,
    );
    if (focusId) {
      writeLocalJson(DASHBOARD_STATE_KEYS.insightsFocus, null);
      setFocusInsightId(focusId);
    }
  }, []);

  useEffect(() => {
    writeInsightsDashboardUi({ insightsSubTab, chatExpanded });
  }, [insightsSubTab, chatExpanded]);

  useEffect(() => {
    writeLocalJson(DASHBOARD_STATE_KEYS.insightsData, insights);
  }, [insights]);

  const injectChatDraft = useCallback((text: string) => {
    setChatDraftPayload({ id: Date.now(), text });
  }, []);

  const patchInsight = useCallback((id: string, patch: Partial<InsightCardModel>) => {
    setInsights((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    setInsightDetail((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  }, []);

  const deleteInsight = useCallback(
    (card: InsightCardModel) => {
      setInsights((prev) => prev.filter((c) => c.id !== card.id));
      setInsightDetail((prev) => (prev?.id === card.id ? null : prev));
      window.dispatchEvent(
        new CustomEvent("amiio:toast", {
          detail: { message: "Insight deleted" },
        }),
      );
      // Per design: after deleting, the user is taken back to the dashboard.
      onTabChange("finance");
    },
    [onTabChange],
  );

  const openInsightDetail = useCallback((card: InsightCardModel) => {
    setInsightDetail(card);
    setChatExpanded(false);
  }, []);

  const closeInsightDetail = useCallback(() => {
    setInsightDetail(null);
    setChatExpanded(false);
  }, []);

  const openInsightAndManage = useCallback(
    (card: InsightCardModel) => {
      setInsightsSubTab("manage");
      openInsightDetail(card);
    },
    [openInsightDetail],
  );

  const goToManageFromOverview = useCallback(() => {
    setInsightsSubTab("manage");
  }, []);

  const goToManageWithBucketFromOverview = useCallback(
    (bucket: InsightOverviewBucket) => {
      setInsightsSubTab("manage");
      setIncomingManageBucket(bucket);
    },
    [],
  );

  const ackIncomingManageBucket = useCallback(() => {
    setIncomingManageBucket(null);
  }, []);

  const startCreateInsight = useCallback(() => {
    setInsightDetail(null);
    setChatExpanded(false);
    setCreatingInsight(true);
  }, []);

  const handleInsightCreated = useCallback((insight: InsightCardModel) => {
    setCreatingInsight(false);
    setInsights(readLocalJson(DASHBOARD_STATE_KEYS.insightsData, [...INSIGHTS_SEED]));
    setInsightsSubTab("manage");
    setFocusInsightId(insight.id);
  }, []);

  const showRightPanel =
    creatingInsight || (chatExpanded && !insightDetail) || insightDetail !== null;
  const showChatFab = !creatingInsight && (!chatExpanded || insightDetail !== null);

  useEffect(() => {
    if (insightsSubTab !== "manage") {
      setInsightDetail(null);
      setChatExpanded(false);
    }
  }, [insightsSubTab]);

  useEffect(() => {
    const onExpandChat = () => {
      setInsightDetail(null);
      setChatExpanded(true);
    };
    window.addEventListener("amiio:expand-chat", onExpandChat);
    return () => window.removeEventListener("amiio:expand-chat", onExpandChat);
  }, []);

  return (
    <CommercialChatInjectContext.Provider value={injectChatDraft}>
      <AppShell
        activeNav="insights"
        chatMinimized={!showRightPanel}
        chatPanel={
          <ChatAside id="amiio-insights-chat">
            {creatingInsight ? (
              <InsightCreationChatPanel
                onCreated={handleInsightCreated}
                onClose={() => setCreatingInsight(false)}
              />
            ) : insightDetail ? (
              <InsightDetailSidebar
                insight={insightDetail}
                onClose={closeInsightDetail}
                onKanbanChange={(column) =>
                  patchInsight(insightDetail.id, { kanbanColumn: column })
                }
              />
            ) : (
          <ChatPanel
            variant="ask-ai"
            messages={chat.messages}
                suggestions={chat.suggestions}
                isTyping={chat.isTyping}
                onSend={chat.onSend}
                onNewChat={chat.onNewChat}
                onMinimize={() => setChatExpanded(false)}
                chatDraftPayload={chatDraftPayload}
                onChatDraftPayloadConsumed={() => setChatDraftPayload(null)}
              />
            )}
          </ChatAside>
        }
        chatRestoreFab={
          showChatFab ? (
            <FloatingAmiioChat
              messages={chat.messages}
              suggestions={chat.suggestions}
              isTyping={chat.isTyping}
              onSend={chat.onSend}
              onExpandPanel={() => {
                setInsightDetail(null);
                setChatExpanded(true);
              }}
              chatDraftPayload={chatDraftPayload}
              onChatDraftPayloadConsumed={() => setChatDraftPayload(null)}
            />
          ) : undefined
        }
      >
        <DashboardPageHeader
          title="Insights"
          actions={
            <button
              type="button"
              onClick={startCreateInsight}
              className="flex h-10 items-center gap-1.5 rounded-[32px] bg-[#010309] px-3.5 py-1 text-[14px] font-medium leading-[1.24] text-[#F0F2F5] shadow-[0px_2px_12px_rgba(0,0,0,0.12)] transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" strokeWidth={2} />
              Create new
            </button>
          }
          filters={
            <div className="flex items-center gap-2">
              <EntityPropertyFilterBar
                variant="insights"
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
            </div>
          }
        />

        <DashboardPageBody>
          <InsightsManageInsightsSection
            activeSubTab={insightsSubTab}
            insights={insights}
            onPatchInsight={patchInsight}
            onOpenInsightDetail={
              insightsSubTab === "manage" ? openInsightDetail : undefined
            }
            selectedDetailInsightId={insightDetail?.id ?? null}
            incomingManageBucket={incomingManageBucket}
            onAckIncomingManageBucket={ackIncomingManageBucket}
            onOverviewOpenInsight={openInsightAndManage}
            onOverviewGoToManage={goToManageFromOverview}
            onOverviewGoToManageWithBucket={goToManageWithBucketFromOverview}
            onOverviewNavigateTab={onTabChange}
            taskBoardLayout={taskBoardLayout}
            focusInsightId={focusInsightId}
            onAckFocusInsight={() => setFocusInsightId(null)}
            onDeleteInsight={deleteInsight}
          />
        </DashboardPageBody>
      </AppShell>
    </CommercialChatInjectContext.Provider>
  );
}
