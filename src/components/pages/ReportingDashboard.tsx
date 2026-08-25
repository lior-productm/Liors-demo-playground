"use client";

import { useState, useEffect } from "react";
import type { TopNavTabId } from "@/src/types/commercial";
import { ChatPanel, ChatAside } from "@/src/components/commercial/ChatPanel";
import { FloatingAmiioChat } from "@/src/components/commercial/FloatingAmiioChat";
import { useAmiioChat } from "@/src/hooks/useAmiioChat";
import {
  writeReportingDashboardUi,
} from "@/src/lib/dashboardState";
import {
  REPORTING_TABS,
  type ReportingTabId,
} from "@/src/lib/reportingMockData";
import { ReportActiveView } from "@/src/components/reporting/ReportActiveView";
import { ReportsAllList } from "@/src/components/reporting/ReportsAllList";
import { TemplateStudio } from "@/src/components/reporting/TemplateStudio";
import {
  AppShell,
  DashboardPageBody,
  DashboardPageHeader,
} from "@/src/components/layout/AppShell";
import { DashboardPageTabs } from "@/src/components/layout/DashboardPageTabs";

export function ReportingDashboard({
  activeTab,
}: {
  activeTab: TopNavTabId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const chat = useAmiioChat(activeTab, "reporting");
  const [reportTab, setReportTab] = useState<ReportingTabId>("studio");
  const [studioKey, setStudioKey] = useState(0);
  const [chatExpanded, setChatExpanded] = useState(false);

  useEffect(() => {
    setReportTab("studio");
    setStudioKey((value) => value + 1);
  }, []);

  useEffect(() => {
    writeReportingDashboardUi({ reportTab });
  }, [reportTab]);

  const handleTabChange = (id: string) => {
    const tab = id as ReportingTabId;
    setReportTab(tab);
    if (tab === "studio") {
      setStudioKey((value) => value + 1);
    }
  };

  return (
    <AppShell
      activeNav="reporting"
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
        />
      }
    >
      <DashboardPageHeader
        title="Reports"
        tabs={
          <DashboardPageTabs
            tabs={REPORTING_TABS}
            activeId={reportTab}
            onChange={handleTabChange}
          />
        }
      />

      <DashboardPageBody className="pt-4">
        {reportTab === "active" ? (
          <ReportActiveView
            variant="preview"
            onEditInStudio={() => setReportTab("studio")}
          />
        ) : reportTab === "studio" ? (
          <TemplateStudio key={studioKey} />
        ) : (
          <ReportsAllList />
        )}
      </DashboardPageBody>
    </AppShell>
  );
}
