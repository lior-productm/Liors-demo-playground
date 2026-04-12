"use client";

import { useState } from "react";
import { SidebarNav, type Screen } from "@/components/sidebar-nav";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { InsightsScreen } from "@/components/screens/insights-screen";
import { ForecastsScreen } from "@/components/screens/forecasts-screen";
import { OpportunitiesScreen } from "@/components/screens/opportunities-screen";
import { GenerateScreen } from "@/components/screens/generate-screen";
import { ChatScreen } from "@/components/screens/chat-screen";
import { X, Sparkles } from "lucide-react";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";

interface SidebarPanelProps {
  onHighlightRows: (rows: number[]) => void;
  onHighlightAnomalies: (cells: { row: number; col: number }[]) => void;
  onHighlightOpportunities: (cells: { row: number; col: number }[]) => void;
  onClose: () => void;
}

export function SidebarPanel({
  onHighlightRows,
  onHighlightAnomalies,
  onHighlightOpportunities,
  onClose,
}: SidebarPanelProps) {
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");

  const handleScreenChange = (screen: Screen) => {
    setActiveScreen(screen);
    onHighlightRows([]);
    onHighlightAnomalies([]);
    onHighlightOpportunities([]);
  };

  return (
    <div className="flex h-full w-full flex-col border-l border-border bg-background animate-slide-in">
      {/* Panel Header */}
      <div className="flex items-center gap-2.5 border-b border-border bg-card px-4 py-3">
        <AmiioAiDisclaimerTrigger
          wrapChild
          wrapperClassName="flex h-7 w-7 items-center justify-center rounded-lg bg-primary"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </AmiioAiDisclaimerTrigger>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-foreground tracking-tight">
            amiio
          </h1>
          <p className="text-[10px] text-muted-foreground">
            AI-Powered Real Estate Analytics
          </p>
        </div>
        <div className="flex items-center gap-1 mr-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-ai-pulse" />
          <span className="text-[9px] font-medium text-accent">Connected</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <SidebarNav
        activeScreen={activeScreen}
        onScreenChange={handleScreenChange}
        insightCount={activeScreen !== "insights" ? 8 : 0}
      />

      {/* Screen Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeScreen === "dashboard" && (
          <DashboardScreen onNavigate={handleScreenChange} />
        )}
        {activeScreen === "insights" && (
          <InsightsScreen
            onNavigate={handleScreenChange}
            onHighlightRows={onHighlightRows}
            onHighlightAnomalies={onHighlightAnomalies}
          />
        )}
        {activeScreen === "forecasts" && <ForecastsScreen />}
        {activeScreen === "opportunities" && (
          <OpportunitiesScreen
            onNavigate={handleScreenChange}
            onHighlightRows={onHighlightRows}
            onHighlightOpportunities={onHighlightOpportunities}
          />
        )}
        {activeScreen === "generate" && <GenerateScreen />}
        {activeScreen === "chat" && <ChatScreen />}
      </div>
    </div>
  );
}
