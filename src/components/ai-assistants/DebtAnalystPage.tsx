"use client";

import { AnalystWorkspacePage } from "@/src/components/ai-assistants/AnalystWorkspacePage";
import { DebtAnalystIcon } from "@/src/components/ai-assistants/DebtAnalystIcon";
import {
  DEBT_ANALYST_RECENT_CHATS,
  DEBT_ANALYST_SOURCES,
  DEBT_ANALYST_TASKS,
} from "@/src/lib/aiAssistantsData";

const DEBT_NEW_TASK_SUGGESTIONS = [
  "Monitor my debt covenants and alert me before any breach",
  "Track upcoming debt maturities and refinancing windows",
  "Assess refinancing risk and rate exposure across facilities",
  "Summarize interest costs and what's driving ICR / DSCR",
] as const;

export function DebtAnalystPage() {
  return (
    <AnalystWorkspacePage
      config={{
        basePath: "/ai-assistants/esg",
        activeNav: "ai-assistants",
        title: "Debt Analyst",
        description:
          "Tracks debt exposure, maturities, covenants, refinancing risks, interest costs, and debt performance across the portfolio.",
        Icon: DebtAnalystIcon,
        tasks: DEBT_ANALYST_TASKS,
        sources: DEBT_ANALYST_SOURCES,
        recentChats: DEBT_ANALYST_RECENT_CHATS,
        newTaskSuggestions: DEBT_NEW_TASK_SUGGESTIONS,
      }}
    />
  );
}
