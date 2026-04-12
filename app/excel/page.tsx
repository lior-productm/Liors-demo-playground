"use client";

import { useState } from "react";
import { ExcelSpreadsheet } from "@/components/excel-spreadsheet";
import { SidebarPanel } from "@/components/sidebar-panel";
import { Sparkles, PanelRightOpen } from "lucide-react";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";

export default function ExcelPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [highlightedRows, setHighlightedRows] = useState<number[]>([]);
  const [anomalyCells, setAnomalyCells] = useState<
    { row: number; col: number }[]
  >([]);
  const [opportunityCells, setOpportunityCells] = useState<
    { row: number; col: number }[]
  >([]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Excel Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Fake Excel Ribbon */}
        <div className="flex items-center justify-between border-b border-border bg-card px-3 py-1.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-[#217346]">
                <span className="text-xs font-bold text-white">X</span>
              </div>
              <span className="text-xs font-semibold text-foreground">
                Portfolio_Q2_2026.xlsx
              </span>
            </div>
            <div className="hidden items-center gap-4 text-xs text-muted-foreground md:flex">
              <span className="cursor-default hover:text-foreground">File</span>
              <span className="cursor-default hover:text-foreground">Home</span>
              <span className="cursor-default hover:text-foreground">Insert</span>
              <span className="cursor-default hover:text-foreground">Data</span>
              <span className="cursor-default hover:text-foreground">Review</span>
              <span className="cursor-default font-medium text-primary hover:text-primary">
                Amiio
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <AmiioAiDisclaimerTrigger>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Sparkles className="h-3 w-3" />
                  <span className="hidden sm:inline">Open Amiio</span>
                  <PanelRightOpen className="h-3 w-3 sm:hidden" />
                </button>
              </AmiioAiDisclaimerTrigger>
            )}
          </div>
        </div>

        {/* Spreadsheet */}
        <ExcelSpreadsheet
          highlightedRows={highlightedRows}
          anomalyCells={anomalyCells}
          opportunityCells={opportunityCells}
        />
      </div>

      {/* Amiio Sidebar */}
      {sidebarOpen && (
        <div className="w-[380px] shrink-0 lg:w-[420px]">
          <SidebarPanel
            onHighlightRows={setHighlightedRows}
            onHighlightAnomalies={setAnomalyCells}
            onHighlightOpportunities={setOpportunityCells}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

