import type { LucideIcon } from "lucide-react";
import { BarChart3, FileText, Landmark, LineChart, Receipt, Wrench } from "lucide-react";

export type AiAssistantId =
  | "reporting"
  | "esg"
  | "market-research"
  | "service-charges"
  | "lease-analyst";

export type AiAssistantTabId = "recent-chats" | "tasks" | "sources";

export type AiAssistantTaskSkill = { title: string; description: string };

export type AiAssistantCard = {
  id: AiAssistantId;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Optional tint for the 24px header icon (Lucide fallback). */
  iconClassName?: string;
  /** Figma-exported SVG under /public — preferred over Lucide when set. */
  iconSrc?: string;
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

export type AiAssistantTaskRunLogStatus = "next" | "completed" | "failed";

export type AiAssistantTaskRunLogEntry = {
  label: string;
  status: AiAssistantTaskRunLogStatus;
};

/** Detail modal fields — Figma AI Analysts Task detail (2453:129096). */
export type AiAssistantTaskInfo = {
  triggerFull: string;
  scopeFull: string;
  output: string;
  delivery: string;
  status: "Active" | "Inactive";
  owner: string;
  runLog: AiAssistantTaskRunLogEntry[];
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
  taskInfo: AiAssistantTaskInfo;
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
    title: "Commercial Analyst",
    description:
      "Reviews commercial performance, tenant exposure, occupancy movements, rent roll trends, and leasing activity to identify risks and opportunities.",
    icon: LineChart,
    iconClassName: "text-[#009951]",
    outputExamples: [
      { label: "Occupancy movements", className: "bg-[#EDF9F3]" },
      { label: "Rent roll trends", className: "bg-[#EDF9F3]" },
      { label: "Tenant exposure", className: "bg-[#EDF9F3]" },
      { label: "Leasing activity", className: "bg-[#EDF9F3]" },
    ],
    chatHref: "/ai-assistants/lease-analyst",
    detailDescription:
      "The Commercial Analyst reviews commercial performance across your portfolio — tenant exposure, occupancy movements, rent roll trends, and leasing activity — so you can spot risks and opportunities early and act with confidence.",
    tasksSkills: [
      {
        title: "Upcoming Expiry Watchlist",
        description:
          "Monitors leases expiring within a chosen scope and summarizes tenants entering the renewal window, incl. WAULT impact and current vs. market indexation.",
      },
      {
        title: "Tenant Satisfaction Signals",
        description:
          "Reads every service request and work order, analyzes tone and sentiment, and flags tenants showing signs of frustration before it turns into a non-renewal.",
      },
      {
        title: "External Tenant Signals",
        description:
          "Scans public online sources for tenant developments — bankruptcy filings, restructurings, expansions, acquisitions — that matter for your assets.",
      },
      {
        title: "Vacancy Monitoring",
        description:
          "Tracks every vacant unit, monitors days-on-market and letting progress against targets, and flags units that are stalling.",
      },
    ],
    starterPrompt: "Notify me every Monday about leases expiring in the next 18 months for Let It Be",
  },
  {
    id: "reporting",
    title: "Financial Analyst",
    description:
      "Analyzes financial performance across assets and portfolios, explains budget variances, and highlights what is driving NOI, income, expenses, and returns.",
    icon: FileText,
    iconClassName: "text-[#4F65E5]",
    iconSrc: "/icons/analysts/financial.svg",
    outputExamples: [
      { label: "NOI variance", className: "bg-[#F6F7FE]" },
      { label: "Budget vs Actuals", className: "bg-[#F6F7FE]" },
      { label: "Expense drivers", className: "bg-[#F6F7FE]" },
      { label: "Financial review", className: "bg-[#F6F7FE]" },
    ],
    chatHref: "/ai-assistants/reporting",
    detailDescription:
      "The Financial Analyst analyzes financial performance across assets and portfolios, explains budget variances, and highlights what is driving NOI, income, expenses, and returns — ready for monthly or quarterly reviews.",
    tasksSkills: [
      {
        title: "Monthly Closing Review",
        description:
          "Reviews monthly figures against expectations, flags anomalies and missing entries, and highlights what needs attention before you close the books.",
      },
      {
        title: "Annual Budgeting",
        description:
          "Prepares next year's property budgets from actuals, contracts, and indexation — giving you a solid draft to review, adjust, and finalize.",
      },
      {
        title: "Anomaly Detection",
        description:
          "Scans all financial postings for anomalies — duplicates, unusual amounts, wrong allocations, unexpected patterns — and flags what needs attention.",
      },
      {
        title: "Budget vs. Actuals Analysis",
        description:
          "Monitors actuals against budget per property, lease, and cost line, links deviations to assumptions, and shows early where forecasts need adjusting.",
      },
    ],
    starterPrompt: "Help me prepare the annual 2027 budget for property X",
  },
  {
    id: "esg",
    title: "Debt Analyst",
    description:
      "Tracks debt exposure, maturities, covenants, refinancing risks, interest costs, and debt performance across the portfolio.",
    icon: Landmark,
    iconClassName: "text-[#838697]",
    iconSrc: "/icons/analysts/debt.svg",
    outputExamples: [
      { label: "Debt maturities", className: "bg-[#F0F2F5]" },
      { label: "Covenant alerts", className: "bg-[#F0F2F5]" },
      { label: "Refinancing risks", className: "bg-[#F0F2F5]" },
      { label: "Interest costs", className: "bg-[#F0F2F5]" },
    ],
    chatHref: "/ai-assistants/esg",
    detailDescription:
      "The Debt Analyst tracks debt exposure, maturities, covenants, refinancing risks, interest costs, and debt performance across the portfolio — helping you stay ahead of refinancing windows and covenant pressure.",
    tasksSkills: [
      {
        title: "Covenant Monitoring",
        description:
          "Monitors debt covenants against live portfolio data and documentation, flagging headroom changes and potential breaches before they become problems.",
      },
      {
        title: "Maturity Calendar",
        description:
          "Surfaces upcoming debt maturities and refinancing windows across the book so nothing catches you by surprise.",
      },
      {
        title: "Refinancing Risk",
        description:
          "Assesses refinancing risk, rate exposure, and lender concentration across your facilities.",
      },
      {
        title: "Interest Cost Review",
        description:
          "Summarizes interest costs and what is driving changes in debt service, ICR, and DSCR.",
      },
    ],
    starterPrompt: "Monitor my debt covenants and alert me before any headroom breach",
  },
  {
    id: "market-research",
    title: "Technical Analyst",
    description:
      "Supports building & facilities operations — maintenance, work orders, CapEx planning, and building systems performance across the portfolio.",
    icon: Wrench,
    iconClassName: "text-[#E07A3F]",
    outputExamples: [
      { label: "Work orders", className: "bg-[#FDF0E7]" },
      { label: "CapEx plans", className: "bg-[#FDF0E7]" },
      { label: "Maintenance alerts", className: "bg-[#FDF0E7]" },
      { label: "Building systems", className: "bg-[#FDF0E7]" },
    ],
    chatHref: "/ai-assistants/market-research",
    detailDescription:
      "The Technical Analyst helps technical managers run building & facilities operations. It tracks work orders, CapEx plans, maintenance needs, and building systems performance so issues are caught early and operations stay on plan.",
    tasksSkills: [
      {
        title: "Technical Compliance Monitoring",
        description:
          "Tracks all technical certifications across your assets — from elevator inspections to energy labels — and flags upcoming renewals well before they expire.",
      },
      {
        title: "Work Order Summary",
        description:
          "Summarizes open work orders, aging tickets, and operational bottlenecks",
      },
      {
        title: "CapEx Planning",
        description:
          "Surfaces CapEx priorities, planned projects, and spend risk by asset",
      },
      {
        title: "Maintenance Alerts",
        description:
          "Flags overdue maintenance and systems that need attention soon",
      },
    ],
    starterPrompt: "What are the upcoming expiring certifications in asset A that need renewal soon",
  },
  {
    id: "service-charges",
    title: "Service Charges Analyst",
    description:
      "Reconciles service charge costs against tenant advances, tracks cost developments per m², and prepares annual settlements ready for review.",
    icon: Receipt,
    iconClassName: "text-[#C2912F]",
    outputExamples: [
      { label: "Annual settlement", className: "bg-[#FBF3E7]" },
      { label: "Advance reconciliation", className: "bg-[#FBF3E7]" },
      { label: "Cost per m²", className: "bg-[#FBF3E7]" },
      { label: "Overrun alerts", className: "bg-[#FBF3E7]" },
    ],
    chatHref: "/ai-assistants/service-charges",
    detailDescription:
      "The Service Charges Analyst reconciles actual costs against advances paid, allocates them across tenants, and prepares annual settlements ready for review — while continuously tracking cost developments per m² so there are no surprises at settlement.",
    tasksSkills: [
      {
        title: "Service Charge Settlement",
        description:
          "Reconciles actual costs against advances paid, allocates them across tenants, and prepares annual settlements — with full flexibility to adjust before finalizing.",
      },
      {
        title: "Service Charge Monitoring",
        description:
          "Continuously tracks actual service charge costs against tenant advances and analyzes cost developments per m², flagging overruns while there's still time to act.",
      },
      {
        title: "Advance Reconciliation",
        description:
          "Matches advance payments per tenant against actual ledgers and highlights under- or over-recovery early.",
      },
      {
        title: "Cost Trend Analysis",
        description:
          "Analyzes cost developments per m² and flags unusual trends across your assets.",
      },
    ],
    starterPrompt: "Help me prepare the annual settlement of service charges for property X",
  },
];

export const LEASE_ANALYST_TASKS: AiAssistantTask[] = [
  {
    id: "upcoming-expiry-watchlist",
    name: "Upcoming Expiry Watchlist",
    description:
      "Monitors leases expiring within a chosen scope and summarizes tenants entering the renewal window, incl. WAULT impact and current vs. market indexation.",
    status: "active",
    tools: ["database", "envelope"],
    outputs: "Expiry watchlist, WAULT impact, Indexation summary",
    trigger: "Weekly scan for leases entering the renewal window.",
    workflowSteps: [
      { id: "1", label: "Scan leases within expiry range", icon: "envelope" },
      {
        id: "2",
        label: "Summarize WAULT impact and indexation",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Send renewal-window digest", icon: "bell" },
    ],
    outputItems: [
      "Expiry watchlist",
      "WAULT impact summary",
      "Current vs. market indexation",
      "Tenants entering renewal window",
      "Follow-up recommendations",
    ],
    taskInfo: {
      triggerFull: "Every Monday — leases expiring in the next 18 months",
      scopeFull: "Let It Be, fund / property scope (min. GRI threshold)",
      output: "Email digest — renewal-window watchlist",
      delivery: "Chat, Email",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 24", status: "completed" },
        { label: "June 17", status: "completed" },
        { label: "June 10", status: "completed" },
      ],
    },
  },
  {
    id: "tenant-satisfaction-signals",
    name: "Tenant Satisfaction Signals",
    description:
      "Reads every service request and work order, analyzes tone and sentiment, and flags tenants showing signs of frustration before it turns into a non-renewal.",
    status: "active",
    tools: ["database"],
    outputs: "Sentiment score, At-risk tenants, Frustration signals",
    trigger: "New service requests or work orders are logged.",
    workflowSteps: [
      { id: "1", label: "Read service requests and work orders", icon: "envelope" },
      {
        id: "2",
        label: "Analyze tone and sentiment",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Flag tenants at risk of non-renewal", icon: "bell" },
    ],
    outputItems: [
      "Tenant sentiment score",
      "At-risk tenant list",
      "Frustration signals",
      "Recommended outreach",
    ],
    taskInfo: {
      triggerFull: "Continuously, as service requests and work orders are logged",
      scopeFull: "All tenants, service requests and work orders",
      output: "At-risk tenant signals",
      delivery: "Chat",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 1", status: "completed" },
        { label: "May 1", status: "completed" },
        { label: "April 1", status: "completed" },
      ],
    },
  },
  {
    id: "external-tenant-signals",
    name: "External Tenant Signals",
    description:
      "Scans public online sources for tenant developments — bankruptcy filings, restructurings, expansions, acquisitions — that matter for your assets.",
    status: "active",
    tools: ["database", "envelope"],
    outputs: "Tenant news alerts, Risk flags, Opportunity signals",
    trigger: "Public sources report a material tenant development.",
    workflowSteps: [
      { id: "1", label: "Scan public online sources", icon: "envelope" },
      {
        id: "2",
        label: "Assess relevance to your assets",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Alert on material developments", icon: "bell" },
    ],
    outputItems: [
      "Tenant news alerts",
      "Bankruptcy / restructuring flags",
      "Expansion / acquisition signals",
      "Impact on your assets",
    ],
    taskInfo: {
      triggerFull: "When public sources report a material tenant development",
      scopeFull: "Portfolio tenants, public online sources",
      output: "External tenant signal alerts",
      delivery: "Email",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 1", status: "completed" },
        { label: "May 1", status: "completed" },
        { label: "April 1", status: "failed" },
      ],
    },
  },
  {
    id: "vacancy-monitoring",
    name: "Vacancy Monitoring",
    description:
      "Tracks every vacant unit, monitors days-on-market and letting progress against targets, and flags units that are stalling.",
    status: "active",
    tools: ["database"],
    outputs: "Vacancy tracker, Days-on-market, Stalling-unit alerts",
    trigger: "Weekly review of vacant units against letting targets.",
    workflowSteps: [
      { id: "1", label: "Track every vacant unit", icon: "envelope" },
      {
        id: "2",
        label: "Monitor days-on-market vs. targets",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Flag stalling units", icon: "bell" },
    ],
    outputItems: [
      "Vacancy tracker",
      "Days-on-market per unit",
      "Letting progress vs. target",
      "Stalling-unit alerts",
    ],
    taskInfo: {
      triggerFull: "Every week — vacant units vs. letting targets",
      scopeFull: "All assets, vacant units",
      output: "Vacancy monitoring report",
      delivery: "Chat",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 24", status: "completed" },
        { label: "June 17", status: "completed" },
        { label: "June 10", status: "completed" },
      ],
    },
  },
];

export const NEW_TASK_CHAT_SUGGESTIONS = [
  "Notify me every Monday about leases expiring in the next 18 months",
  "Flag tenants showing signs of frustration in their service requests",
  "Alert me to external tenant developments in the news",
  "Track vacant units that are stalling on the market",
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
      "Create a one-page strategic summary for Yellow Submarine Portfolio for the investment committee",
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

export const FINANCIAL_ANALYST_TASKS: AiAssistantTask[] = [
  {
    id: "monthly-closing-review",
    name: "Monthly Closing Review",
    description:
      "Reviews monthly figures against expectations, flags anomalies and missing entries, and highlights what needs attention before you close the books.",
    status: "active",
    tools: ["database"],
    outputs: "Closing review, Anomaly flags, Missing entries",
    trigger: "Scheduled monthly, ahead of closing.",
    workflowSteps: [
      { id: "1", label: "Pull monthly figures and budgets", icon: "envelope" },
      {
        id: "2",
        label: "Compare against expectations",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Flag anomalies and missing entries", icon: "bell" },
    ],
    outputItems: [
      "Monthly closing review",
      "Anomaly flags",
      "Missing entries",
      "Items needing attention",
    ],
    taskInfo: {
      triggerFull: "Automatically scheduled each month, before closing",
      scopeFull: "Entity, property, all financial entries and budgets",
      output: "Email digest — monthly closing review",
      delivery: "Email",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 1", status: "completed" },
        { label: "May 1", status: "completed" },
        { label: "April 1", status: "completed" },
      ],
    },
  },
  {
    id: "annual-budgeting",
    name: "Annual Budgeting",
    description:
      "Prepares next year's property budgets from actuals, contracts, and indexation — giving you a solid draft to review, adjust, and finalize.",
    status: "active",
    tools: ["database"],
    outputs: "Draft budget, Assumptions, Indexation basis",
    trigger: "On-demand via chat.",
    workflowSteps: [
      { id: "1", label: "Gather 12 months actuals and contracts", icon: "envelope" },
      {
        id: "2",
        label: "Apply indexation and assumptions",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Draft budget for review", icon: "bell" },
    ],
    outputItems: [
      "Draft property budget",
      "Underlying assumptions",
      "Indexation basis",
      "Vacancy / fill-up assumptions",
    ],
    taskInfo: {
      triggerFull: "On demand — “prepare the annual 2027 budget for property X”",
      scopeFull: "12 months financials, lease data, market assumptions",
      output: "Excel/CSV export — draft annual budget",
      delivery: "Platform",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 1", status: "completed" },
        { label: "May 1", status: "completed" },
        { label: "April 1", status: "completed" },
      ],
    },
  },
  {
    id: "anomaly-detection",
    name: "Anomaly Detection",
    description:
      "Scans all financial postings for anomalies — duplicates, unusual amounts, wrong allocations, and unexpected patterns — and flags what needs your attention.",
    status: "active",
    tools: ["database"],
    outputs: "Anomaly report, Duplicate flags, Allocation issues",
    trigger: "Weekly scan of financial postings.",
    workflowSteps: [
      { id: "1", label: "Scan all financial transactions", icon: "envelope" },
      {
        id: "2",
        label: "Detect duplicates and unusual amounts",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Flag items for review", icon: "bell" },
    ],
    outputItems: [
      "Anomaly report",
      "Duplicate postings",
      "Wrong allocations",
      "Unexpected patterns",
    ],
    taskInfo: {
      triggerFull: "Every week — scan of all financial postings",
      scopeFull: "All financial transactions (+ user instructions)",
      output: "Anomaly report",
      delivery: "Email",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 24", status: "completed" },
        { label: "June 17", status: "completed" },
        { label: "June 10", status: "failed" },
      ],
    },
  },
  {
    id: "budget-vs-actuals",
    name: "Budget vs. Actuals Analysis",
    description:
      "Monitors actuals against budget per property, lease, and cost line, links deviations to assumptions, and shows early where forecasts need adjusting.",
    status: "active",
    tools: ["database"],
    outputs: "Variance analysis, Deviation drivers, Forecast flags",
    trigger: "Continuous monitoring against budget.",
    workflowSteps: [
      { id: "1", label: "Compare actuals to budget", icon: "envelope" },
      {
        id: "2",
        label: "Link deviations to assumptions",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Flag forecasts needing adjustment", icon: "bell" },
    ],
    outputItems: [
      "Variance analysis",
      "Deviation drivers",
      "Per-property / per-lease breakdown",
      "Forecast adjustment flags",
    ],
    taskInfo: {
      triggerFull: "Continuously — actuals vs. budget per property, lease, cost line",
      scopeFull: "All properties, budgets, and cost lines",
      output: "Budget vs. actuals variance analysis",
      delivery: "Platform",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 1", status: "completed" },
        { label: "May 1", status: "completed" },
        { label: "April 1", status: "completed" },
      ],
    },
  },
];

export const FINANCIAL_ANALYST_SOURCES: AiAssistantSource[] = [
  { id: "financial-ledger", name: "Financial Ledger" },
  { id: "budgets", name: "Budgets" },
  { id: "contracts", name: "Contracts & Indexation" },
];

export const FINANCIAL_ANALYST_RECENT_CHATS: AiAssistantRecentChat[] = [
  {
    id: "fin-chat-1",
    title: "Help me prepare the annual 2027 budget for property X",
    timestampLabel: "Today, 14:02",
  },
  {
    id: "fin-chat-2",
    title: "Analyze the March books for property X and flag anything unusual",
    timestampLabel: "Today, 11:34",
  },
  {
    id: "fin-chat-3",
    title: "Explain the NOI variance vs budget for Q2",
    timestampLabel: "Yesterday, 09:20",
  },
  {
    id: "fin-chat-4",
    title: "Which expense lines are driving the increase this month?",
    timestampLabel: "2 days ago, 16:05",
  },
];

export const DEBT_ANALYST_TASKS: AiAssistantTask[] = [
  {
    id: "covenant-monitoring",
    name: "Covenant Monitoring",
    description:
      "Monitors your debt covenants against live portfolio data and documentation, flagging headroom changes and potential breaches before they become problems.",
    status: "active",
    tools: ["database"],
    outputs: "Covenant headroom, Breach alerts, ICR / DSCR",
    trigger: "Proactive — after initial configuration by the user.",
    workflowSteps: [
      { id: "1", label: "Read covenants from loan agreements", icon: "envelope" },
      {
        id: "2",
        label: "Compute headroom against live metrics",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Alert on headroom changes / breaches", icon: "bell" },
    ],
    outputItems: [
      "Covenant headroom",
      "Potential breach alerts",
      "ICR / DSCR / LTV",
      "Rental income & WAULT inputs",
    ],
    taskInfo: {
      triggerFull: "Proactive — recommend & accept, after initial configuration",
      scopeFull: "Debt covenants + related portfolio metrics per entity / asset",
      output: "Determined at configuration by the user",
      delivery: "Determined at configuration",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 1", status: "completed" },
        { label: "May 1", status: "completed" },
        { label: "April 1", status: "completed" },
      ],
    },
  },
  {
    id: "maturity-calendar",
    name: "Maturity Calendar",
    description:
      "Surfaces upcoming debt maturities and refinancing windows across the book so nothing catches you by surprise.",
    status: "active",
    tools: ["database"],
    outputs: "Maturity schedule, Refinancing windows",
    trigger: "Proactive tracking of maturities.",
    workflowSteps: [
      { id: "1", label: "Read facility maturities", icon: "envelope" },
      {
        id: "2",
        label: "Map refinancing windows",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Alert ahead of each window", icon: "bell" },
    ],
    outputItems: [
      "Maturity schedule",
      "Refinancing windows",
      "Facility-level detail",
      "Lead-time alerts",
    ],
    taskInfo: {
      triggerFull: "Proactive — ahead of each maturity / refinancing window",
      scopeFull: "All facilities across the portfolio",
      output: "Maturity & refinancing calendar",
      delivery: "Email",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 1", status: "completed" },
        { label: "May 1", status: "completed" },
        { label: "April 1", status: "completed" },
      ],
    },
  },
  {
    id: "refinancing-risk",
    name: "Refinancing Risk",
    description:
      "Assesses refinancing risk, rate exposure, and lender concentration across your facilities.",
    status: "active",
    tools: ["database"],
    outputs: "Refinancing risk, Rate exposure, Lender concentration",
    trigger: "Proactive assessment on portfolio changes.",
    workflowSteps: [
      { id: "1", label: "Aggregate facility terms", icon: "envelope" },
      {
        id: "2",
        label: "Assess rate and lender exposure",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Flag elevated refinancing risk", icon: "bell" },
    ],
    outputItems: [
      "Refinancing risk score",
      "Rate exposure",
      "Lender concentration",
      "Mitigation options",
    ],
    taskInfo: {
      triggerFull: "Proactive — on material portfolio or rate changes",
      scopeFull: "All facilities, rate and lender exposure",
      output: "Refinancing risk assessment",
      delivery: "Platform",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 1", status: "completed" },
        { label: "May 1", status: "completed" },
        { label: "April 1", status: "failed" },
      ],
    },
  },
  {
    id: "interest-cost-review",
    name: "Interest Cost Review",
    description:
      "Summarizes interest costs and what is driving changes in debt service, ICR, and DSCR.",
    status: "active",
    tools: ["database"],
    outputs: "Interest cost summary, ICR / DSCR drivers",
    trigger: "Scheduled review of debt service.",
    workflowSteps: [
      { id: "1", label: "Aggregate interest and debt service", icon: "envelope" },
      {
        id: "2",
        label: "Explain ICR / DSCR movements",
        icon: "lightbulb",
        actionLabel: "View analysis",
      },
      { id: "3", label: "Summarize cost drivers", icon: "bell" },
    ],
    outputItems: [
      "Interest cost summary",
      "Debt service movements",
      "ICR / DSCR drivers",
      "Period comparison",
    ],
    taskInfo: {
      triggerFull: "Scheduled — periodic debt service review",
      scopeFull: "All facilities, interest and debt service",
      output: "Interest cost & coverage review",
      delivery: "Email",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 1", status: "next" },
        { label: "June 1", status: "completed" },
        { label: "May 1", status: "completed" },
        { label: "April 1", status: "completed" },
      ],
    },
  },
];

export const DEBT_ANALYST_SOURCES: AiAssistantSource[] = [
  { id: "loan-agreements", name: "Loan Agreements" },
  { id: "valuation-reports", name: "Valuation Reports" },
  { id: "financial-metrics", name: "Financial Metrics (ICR / DSCR)" },
];

export const DEBT_ANALYST_RECENT_CHATS: AiAssistantRecentChat[] = [
  {
    id: "debt-chat-1",
    title: "Show covenant headroom across all facilities",
    timestampLabel: "Today, 13:10",
  },
  {
    id: "debt-chat-2",
    title: "Which loans mature in the next 18 months?",
    timestampLabel: "Today, 10:02",
  },
  {
    id: "debt-chat-3",
    title: "Assess refinancing risk for the Amsterdam facility",
    timestampLabel: "Yesterday, 15:48",
  },
  {
    id: "debt-chat-4",
    title: "Explain what's driving the change in DSCR this quarter",
    timestampLabel: "3 days ago, 09:15",
  },
];

/** Decorative icon for reporting card header — matches Figma blue tone */
export const REPORTING_CARD_ICON = BarChart3;
