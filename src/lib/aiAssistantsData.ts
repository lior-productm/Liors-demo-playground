import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  FileText,
  Leaf,
  Search,
} from "lucide-react";

export type AiAssistantId =
  | "reporting"
  | "esg"
  | "market-research"
  | "lease-analyst";

export type AiAssistantTabId = "recent-chats" | "tasks" | "sources";

export type AiAssistantTaskSkill = { title: string; description: string };

export type AiAssistantCard = {
  id: AiAssistantId;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Optional tint for the 24px header icon. */
  iconClassName?: string;
  outputExamples: { label: string; className: string }[];
  chatHref: string;
  /** Longer paragraph shown in the analyst detail modal — Figma 2453:123504. */
  detailDescription: string;
  /** Tasks & Skills cards shown in the analyst detail modal. */
  tasksSkills: AiAssistantTaskSkill[];
  /** Prompt used to seed a chat when starting with this analyst. */
  starterPrompt: string;
};

export type AiAssistantTaskStatus = "active" | "inactive";

export type AiAssistantWorkflowStep = {
  id: string;
  label: string;
  icon: "envelope" | "lightbulb" | "bell";
  actionLabel?: string;
};

export type AiAssistantTask = {
  id: string;
  name: string;
  description: string;
  status: AiAssistantTaskStatus;
  tools: ("database" | "envelope")[];
  outputs: string;
  trigger: string;
  workflowSteps: AiAssistantWorkflowStep[];
  outputItems: string[];
};

export type AiAssistantRecentChat = {
  id: string;
  title: string;
  /** Figma 1453:65747 — e.g. "Today, 14:02" */
  timestampLabel: string;
};

export const AI_ASSISTANT_CARDS: AiAssistantCard[] = [
  {
    id: "lease-analyst",
    title: "Lease Analyst",
    description:
      "Reviews lease expiries, break options, rent reviews, tenant exposure, and renewal risks.",
    icon: Building2,
    iconClassName: "text-[#C2912F]",
    outputExamples: [
      { label: "Upcoming expiries", className: "bg-[#F6F3EF]" },
      { label: "Break options", className: "bg-[#F6F3EF]" },
      { label: "Rent review dates", className: "bg-[#F6F3EF]" },
      { label: "Renewal deadlines", className: "bg-[#F6F3EF]" },
    ],
    chatHref: "/ai-assistants/lease-analyst",
    detailDescription:
      "The Lease Analyst helps you stay ahead of lease events, tenant risks, renewal deadlines, break options, and rent review dates. It can review lease data, identify missing information, summarize upcoming events, and prepare renewal or follow-up drafts for your review.",
    tasksSkills: [
      {
        title: "Draft Renewal Emails",
        description:
          "Prepares a draft email based on current lease terms, lease expiry date, tenant payment history",
      },
      {
        title: "Check Lease Data Quality",
        description:
          "Check missing lease fields, Detect duplicated tenants or units, Compare lease table with rent roll",
      },
      {
        title: "Break Option Monitoring",
        description:
          "Prepares a draft email based on current lease terms, lease expiry date, tenant payment history",
      },
      {
        title: "Draft Lease Proposal",
        description:
          "Drafting and review lease proposals by preparing commercial terms and ensuring data accuracy",
      },
    ],
    starterPrompt: "Initiate a Lease renewal",
  },
  {
    id: "reporting",
    title: "Reporting Assistant",
    description:
      "Drafts monthly or quarterly report commentary from dashboard data, tailored to your needs",
    icon: FileText,
    iconClassName: "text-[#4F65E5]",
    outputExamples: [
      { label: "Portfolio summary", className: "bg-[#F6F7FE]" },
      { label: "Variances explanations", className: "bg-[#F6F7FE]" },
      { label: "Comparisons", className: "bg-[#F6F7FE]" },
      { label: "Top-performing assets", className: "bg-[#F6F7FE]" },
    ],
    chatHref: "/ai-assistants/reporting",
    detailDescription:
      "The Reporting Assistant drafts clear, tailored report commentary straight from your dashboard data. It can summarize portfolio performance, explain variances, compare periods, and highlight top-performing assets — ready for your monthly or quarterly reviews.",
    tasksSkills: [
      {
        title: "Draft Report Commentary",
        description:
          "Generates monthly or quarterly narrative from your latest dashboard figures",
      },
      {
        title: "Explain Variances",
        description:
          "Identifies key movements in the numbers and explains the drivers behind them",
      },
      {
        title: "Period Comparisons",
        description:
          "Compares performance across periods, portfolios, or individual assets",
      },
      {
        title: "Highlight Top Performers",
        description:
          "Surfaces your best and worst performing assets with supporting context",
      },
    ],
    starterPrompt: "Draft a portfolio performance report from my latest dashboard data",
  },
  {
    id: "esg",
    title: "ESG Analyst",
    description:
      "Tracks ESG metrics, regulatory gaps, energy performance, and sustainability risks.",
    icon: Leaf,
    iconClassName: "text-[#1F9E8B]",
    outputExamples: [
      { label: "ESG insight cards", className: "bg-[#EDF9F3]" },
      { label: "Missing data alerts", className: "bg-[#EDF9F3]" },
      { label: "Report-ready commentary", className: "bg-[#EDF9F3]" },
      { label: "Suggested actions", className: "bg-[#EDF9F3]" },
    ],
    chatHref: "/ai-assistants/esg",
    detailDescription:
      "The ESG Analyst tracks sustainability metrics, regulatory gaps, and energy performance across your portfolio. It flags missing data, prepares report-ready commentary, and suggests actions to reduce risk and stay compliant.",
    tasksSkills: [
      {
        title: "Track ESG Metrics",
        description:
          "Monitors energy, emissions, and sustainability indicators across your assets",
      },
      {
        title: "Detect Regulatory Gaps",
        description:
          "Flags compliance risks and upcoming ESG reporting requirements",
      },
      {
        title: "Missing Data Alerts",
        description:
          "Highlights incomplete ESG fields and data that needs attention",
      },
      {
        title: "Report-ready Commentary",
        description:
          "Drafts ESG narrative and suggested actions ready for your review",
      },
    ],
    starterPrompt: "Summarize my portfolio's ESG performance and flag any regulatory gaps",
  },
  {
    id: "market-research",
    title: "Market Research Assistant",
    description:
      "Monitors market trends, comparable assets, rent benchmarks, and local market signals.",
    icon: Search,
    iconClassName: "text-[#D6605B]",
    outputExamples: [
      { label: "Market Summary", className: "bg-[#FDF2FA]" },
      { label: "Recent trends", className: "bg-[#FDF2FA]" },
      { label: "Comparable signals", className: "bg-[#FDF2FA]" },
      { label: "Risks and opportunities", className: "bg-[#FDF2FA]" },
    ],
    chatHref: "/ai-assistants/market-research",
    detailDescription:
      "The Market Research Assistant monitors market trends, comparable assets, and rent benchmarks. It summarizes local market signals and surfaces the risks and opportunities most relevant to your portfolio.",
    tasksSkills: [
      {
        title: "Market Summary",
        description:
          "Compiles a concise overview of current market conditions for your assets",
      },
      {
        title: "Track Recent Trends",
        description:
          "Monitors movements in rents, yields, and demand across your markets",
      },
      {
        title: "Comparable Signals",
        description:
          "Finds comparable assets and benchmarks them against your portfolio",
      },
      {
        title: "Risks & Opportunities",
        description:
          "Highlights emerging market risks and opportunities worth acting on",
      },
    ],
    starterPrompt: "Give me a market summary and comparable rent benchmarks for my portfolio",
  },
];

export const LEASE_ANALYST_TASKS: AiAssistantTask[] = [
  {
    id: "draft-renewal-emails",
    name: "Draft Renewal Emails",
    description:
      "Prepares a draft email based on current lease terms, lease expiry date, tenant payment history and...",
    status: "active",
    tools: ["database", "envelope"],
    outputs: "Renewal Summary, Tenant Risk Score, Income Exposure",
    trigger: "A rent review date is approaching.",
    workflowSteps: [
      { id: "1", label: "Detect upcoming rent review", icon: "envelope" },
      {
        id: "2",
        label: "Summarize current rent and lease terms",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Flag potential upside or risk", icon: "bell" },
    ],
    outputItems: [
      "Rent review alert",
      "Current rent summary",
      "Potential uplift/downside",
      "Draft internal recommendation",
      "Follow-up task",
    ],
  },
  {
    id: "check-lease-data",
    name: "Check Lease Data Quality",
    description:
      "Check missing lease fields, Detect duplicated tenants or units, Compare lease table with rent roll",
    status: "active",
    tools: ["database", "envelope"],
    outputs: "Missing Data Checklist, Mismatch report, Suggested Corrections",
    trigger: "Weekly data quality scan is scheduled.",
    workflowSteps: [
      { id: "1", label: "Scan lease register for missing fields", icon: "envelope" },
      { id: "2", label: "Compare rent roll to lease table", icon: "lightbulb" },
      { id: "3", label: "Generate correction checklist", icon: "bell" },
    ],
    outputItems: [
      "Missing data checklist",
      "Mismatch report",
      "Suggested corrections",
    ],
  },
  {
    id: "break-option-monitoring",
    name: "Break Option Monitoring",
    description:
      "Prepares a draft email based on current lease terms, lease expiry date, tenant payment history and...",
    status: "inactive",
    tools: ["database", "envelope"],
    outputs: "Renewal Summary, Risky Tenants Alerts",
    trigger: "A break option window opens within 90 days.",
    workflowSteps: [
      { id: "1", label: "Identify upcoming break options", icon: "envelope" },
      { id: "2", label: "Assess tenant risk exposure", icon: "lightbulb" },
      { id: "3", label: "Draft alert for asset manager", icon: "bell" },
    ],
    outputItems: ["Break option alert", "Risky tenants list", "Recommended actions"],
  },
];

export const NEW_TASK_CHAT_SUGGESTIONS = [
  "Monitor leases expiring in the next 90 days",
  "Automatically draft renewal emails when a rent review is due",
  "Alert me when a tenant break option window opens",
  "Run a weekly lease data quality check",
] as const;

/** Rotating prompts in the Lease Analyst chat bar placeholder. */
export const LEASE_ANALYST_CHAT_BAR_SUGGESTIONS = [
  "Show me all leases expiring in the next 12 months...",
  "Rank my assets by risk score and explain the main drivers",
  "Which tenants have break options opening in the next 90 days?",
  "Create a portfolio performance summary for Q2",
  "Alert me when a rent review is due on any lease",
] as const;

export const LEASE_ANALYST_RECENT_CHATS: AiAssistantRecentChat[] = [
  {
    id: "chat-1",
    title: "Rank my assets by risk score and explain the main drivers",
    timestampLabel: "Today, 14:02",
  },
  {
    id: "chat-2",
    title:
      "Create a one-page strategic summary for Paris Retail Portfolio for the investment committee",
    timestampLabel: "Today, 11:34",
  },
  {
    id: "chat-3",
    title: "Create a portfolio performance summary for Q2",
    timestampLabel: "Yesterday, 11:34",
  },
  {
    id: "chat-4",
    title: "Draft a report about all properties WAULT improvement",
    timestampLabel: "2 days ago, 11:34",
  },
  {
    id: "chat-5",
    title: "Create a dashboard with my assets valuation and performance",
    timestampLabel: "May 10, 11:34",
  },
];

export function getAssistantById(id: AiAssistantId): AiAssistantCard | undefined {
  return AI_ASSISTANT_CARDS.find((card) => card.id === id);
}

export type AiAssistantSource = { id: string; name: string };

export const LEASE_ANALYST_SOURCES: AiAssistantSource[] = [
  { id: "rent-roll", name: "Rent Roll" },
  { id: "lease-expiries", name: "Lease Expiries" },
  { id: "capex-plans", name: "CapEx plans" },
];

/** Decorative icon for reporting card header — matches Figma blue tone */
export const REPORTING_CARD_ICON = BarChart3;
