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
import { GenerateReportModal } from "@/src/components/reporting/GenerateReportModal";
import {
  AppShell,
  DashboardPageBody,
  DashboardPageHeader,
} from "@/src/components/layout/AppShell";
import { DashboardPageTabs } from "@/src/components/layout/DashboardPageTabs";
import { Plus } from "lucide-react";
import { useI18n } from "@/src/hooks/useI18n";

export function ReportingDashboard({
  activeTab,
}: {
  activeTab: TopNavTabId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const { t } = useI18n();
  const chat = useAmiioChat(activeTab, "reporting");
  const [reportTab, setReportTab] = useState<ReportingTabId>("studio");
  const [studioKey, setStudioKey] = useState(0);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [openReportTitle, setOpenReportTitle] = useState<string | undefined>(undefined);

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
        title={t("Reports")}
        actions={
          <button
            type="button"
            onClick={() => setGenerateOpen(true)}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#111] px-4 text-[14px] font-medium leading-[1.24] text-white hover:bg-[#333]"
          >
            <Plus className="size-4" strokeWidth={2} />
            {t("New report")}
          </button>
        }
        tabs={
          <DashboardPageTabs
            tabs={REPORTING_TABS.map((tab) => ({ id: tab.id, label: t(tab.label) }))}
            activeId={reportTab}
            onChange={handleTabChange}
          />
        }
      />

      <DashboardPageBody className="pt-4">
        {reportTab === "active" ? (
          <ReportActiveView
            variant="preview"
            openTitle={openReportTitle}
            onEditInStudio={() => setReportTab("studio")}
          />
        ) : reportTab === "studio" ? (
          <TemplateStudio key={studioKey} />
        ) : (
          <ReportsAllList />
        )}
      </DashboardPageBody>

      {generateOpen ? (
        <GenerateReportModal
          onClose={() => setGenerateOpen(false)}
          onGenerated={(report) => {
            setGenerateOpen(false);
            setOpenReportTitle(report.title);
            setReportTab("active");
          }}
        />
      ) : null}
    </AppShell>
  );
}
