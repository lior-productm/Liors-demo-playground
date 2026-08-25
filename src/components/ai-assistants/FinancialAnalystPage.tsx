"use client";

import { AnalystWorkspacePage } from "@/src/components/ai-assistants/AnalystWorkspacePage";
import { FinancialAnalystIcon } from "@/src/components/ai-assistants/FinancialAnalystIcon";
import {
  FINANCIAL_ANALYST_RECENT_CHATS,
  FINANCIAL_ANALYST_SOURCES,
  FINANCIAL_ANALYST_TASKS,
} from "@/src/lib/aiAssistantsData";

const FINANCIAL_NEW_TASK_SUGGESTIONS = [
  "Schedule a monthly closing review before I close the books",
  "Help me prepare the annual 2027 budget for property X",
  "Scan the books weekly for anomalies and duplicates",
  "Monitor budget vs actuals per property and flag variances",
] as const;

export function FinancialAnalystPage() {
  return (
    <AnalystWorkspacePage
      config={{
        basePath: "/ai-assistants/reporting",
        activeNav: "ai-assistants",
        title: "Financial Analyst",
        description:
          "Analyzes financial performance, explains budget variances, and highlights what is driving NOI, income, expenses, and returns.",
        Icon: FinancialAnalystIcon,
        tasks: FINANCIAL_ANALYST_TASKS,
        sources: FINANCIAL_ANALYST_SOURCES,
        recentChats: FINANCIAL_ANALYST_RECENT_CHATS,
        newTaskSuggestions: FINANCIAL_NEW_TASK_SUGGESTIONS,
      }}
    />
  );
}
