"use client";

import { useCallback, useEffect, useState } from "react";
import type { TopNavTabId } from "@/src/types/commercial";
import type { InsightOverviewBucket } from "@/src/components/pages/InsightsManageInsightsSection";
import { TopNav } from "@/src/components/commercial/TopNav";
import { ToastStack } from "@/src/components/commercial/ToastStack";
import { CommercialChatInjectContext } from "@/src/components/commercial/CommercialChatContext";
import {
  ChatPanel,
  ChatRestoreFab,
  ResizableChatAside,
  type ChatDraftPayload,
} from "@/src/components/commercial/ChatPanel";
import { EntityPropertyFilterBar } from "@/src/components/commercial/EntityPropertyFilterBar";
import { useAmiioChat } from "@/src/hooks/useAmiioChat";
import { cn } from "@/lib/utils";
import {
  InsightsManageInsightsSection,
  INSIGHTS_SEED,
  type InsightCardModel,
  type InsightsInsightsSubTab,
  type InsightsTaskBoardLayout,
} from "@/src/components/pages/InsightsManageInsightsSection";
import { InsightDetailSidebar } from "@/src/components/pages/InsightDetailSidebar";

const INSIGHTS_SUB_TABS: { id: InsightsInsightsSubTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "manage", label: "Manage Insights" },
  { id: "amiiopedia", label: "Amiiopedia" },
];

export function InsightsDashboard({
  activeTab,
  onTabChange,
}: {
  activeTab: TopNavTabId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const chat = useAmiioChat(activeTab);
  const [insightsSubTab, setInsightsSubTab] = useState<InsightsInsightsSubTab>("overview");
  const [insights, setInsights] = useState<InsightCardModel[]>(() => [...INSIGHTS_SEED]);
  const [insightDetail, setInsightDetail] = useState<InsightCardModel | null>(null);
  const [chatExpanded, setChatExpanded] = useState(true);
  const [incomingManageBucket, setIncomingManageBucket] =
    useState<InsightOverviewBucket | null>(null);
  const [taskBoardLayout, setTaskBoardLayout] =
    useState<InsightsTaskBoardLayout>("horizontal");
  const [chatDraftPayload, setChatDraftPayload] = useState<ChatDraftPayload>(null);

  const injectChatDraft = useCallback((text: string) => {
    setChatDraftPayload({ id: Date.now(), text });
  }, []);

  const patchInsight = useCallback((id: string, patch: Partial<InsightCardModel>) => {
    setInsights((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    setInsightDetail((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  }, []);

  const openInsightDetail = useCallback((card: InsightCardModel) => {
    setInsightDetail(card);
    setChatExpanded(false);
  }, []);

  const closeInsightDetail = useCallback(() => {
    setInsightDetail(null);
    setChatExpanded(true);
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

  const showRightPanel = (chatExpanded && !insightDetail) || insightDetail !== null;
  const showChatFab = !chatExpanded || insightDetail !== null;

  useEffect(() => {
    if (insightsSubTab !== "manage") {
      setInsightDetail(null);
      setChatExpanded(true);
    }
  }, [insightsSubTab]);

  return (
    <CommercialChatInjectContext.Provider value={injectChatDraft}>
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
            showRightPanel ? "lg:flex-row lg:items-start" : "",
          )}
        >
          <section className="min-w-0 flex-1">
            <div className="mb-4">
              <h1 className="typo-h4 text-[#010309]">Insights</h1>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex min-h-[52px] flex-wrap items-center gap-4">
                {INSIGHTS_SUB_TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setInsightsSubTab(id)}
                    className={cn(
                      "h-10 rounded-[24px] px-4 text-[14px] font-medium leading-[1.24] transition-colors",
                      insightsSubTab === id
                        ? "bg-[#010309] text-[#F0F2F5]"
                        : "text-[#969A9E] hover:text-[#353638]",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex min-h-[52px] flex-wrap items-center justify-end gap-3">
                {insightsSubTab === "manage" ? (
                  <>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#969A9E]">
                      Layout
                    </span>
                    <div className="inline-flex rounded-full border border-[#E6E8EB] bg-white p-px shadow-[0px_1px_4px_rgba(0,0,0,0.04)]">
                      <button
                        type="button"
                        onClick={() => setTaskBoardLayout("horizontal")}
                        className={cn(
                          "flex h-8 min-w-[72px] items-center justify-center rounded-full px-3 text-[12px] font-medium leading-none transition-colors",
                          taskBoardLayout === "horizontal"
                            ? "bg-[#111] text-white"
                            : "text-[#4E4F52]",
                        )}
                      >
                        Horizontal
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskBoardLayout("vertical")}
                        className={cn(
                          "flex h-8 min-w-[72px] items-center justify-center rounded-full px-3 text-[12px] font-medium leading-none transition-colors",
                          taskBoardLayout === "vertical"
                            ? "bg-[#111] text-white"
                            : "text-[#4E4F52]",
                        )}
                      >
                        Vertical
                      </button>
                    </div>
                  </>
                ) : null}
                <EntityPropertyFilterBar clearToastMessage="Cleared insights filters" />
              </div>
            </div>

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
            />
          </section>

          {showRightPanel ? (
            <ResizableChatAside id="amiio-insights-chat">
              {insightDetail ? (
                <InsightDetailSidebar
                  insight={insightDetail}
                  onClose={closeInsightDetail}
                  onKanbanChange={(column) => patchInsight(insightDetail.id, { kanbanColumn: column })}
                />
              ) : (
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
              )}
            </ResizableChatAside>
          ) : null}
        </div>
        {showChatFab ? (
          <ChatRestoreFab
            onExpand={() => {
              setInsightDetail(null);
              setChatExpanded(true);
            }}
          />
        ) : null}
        </main>
      </div>
    </CommercialChatInjectContext.Provider>
  );
}
