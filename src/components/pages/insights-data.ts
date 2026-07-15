export type KanbanColumnId = "backlog" | "in_progress" | "done";

export type InsightOverviewBucket = "insights" | "anomalies" | "new_information";

export type InsightTag = { label: string; variant: "accent" | "warning" | "neutral" };

export type InstructionToken = { kind: "chip" | "text"; text: string };

export type InsightCardModel = {
  id: string;
  active: boolean;
  title: string;
  subtitle: string;
  subtitleClassName?: string;
  tags: InsightTag[];
  workflowType: "insight" | "task";
  updatedLabel: string;
  triggeredAt: string;
  kanbanColumn: KanbanColumnId;
  overviewBucket: InsightOverviewBucket;
  impact: "standard" | "high";
  expandDetail?: {
    triggered: string;
    createdOn: string;
    updatedBy: string;
    instructionTokens: InstructionToken[];
  };
  fullDescription?: string;
  recentActionLines?: string[];
  /** Person/source that created the insight (shown in the list "Created by" column). */
  createdBy?: string;
  /** Friendly label for the "Triggered" column (e.g. "Today, 13:31", "Just now"). */
  triggeredLabel?: string;
  /** Marks a freshly created insight with the purple "new" dot in the list. */
  isNew?: boolean;
};

export type InsightsInsightsSubTab = "overview" | "manage" | "amiiopedia";

export type InsightsTaskBoardLayout = "horizontal" | "vertical";

const SERVICE_CHARGE_INSTRUCTION: InstructionToken[] = [
  { kind: "chip", text: "RentalIncomeDecrease" },
  { kind: "text", text: "Greater than" },
  { kind: "chip", text: "5%" },
  { kind: "text", text: "years" },
  { kind: "text", text: "AND" },
  { kind: "chip", text: "DecreaseAmount" },
  { kind: "text", text: "Greater than" },
  { kind: "chip", text: "3.000" },
];

export const INSIGHTS_SEED: InsightCardModel[] = [
  {
    id: "1",
    active: true,
    title: "Rental income decrease",
    subtitle: "Decrease of 5% with minimum of €3.000",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "P&L", variant: "warning" },
    ],
    workflowType: "task",
    updatedLabel: "Updated 1 hour ago",
    triggeredAt: "2024-12-10",
    kanbanColumn: "backlog",
    overviewBucket: "anomalies",
    impact: "high",
  },
  {
    id: "2",
    active: true,
    title: "Expenses increase (general)",
    subtitle: "Increase of 5% with minimum of €3.000",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "Commercial", variant: "warning" },
    ],
    workflowType: "insight",
    updatedLabel: "Updated 2 hours ago",
    triggeredAt: "2024-12-20",
    kanbanColumn: "backlog",
    overviewBucket: "insights",
    impact: "standard",
    createdBy: "Tomer Zakai",
  },
  {
    id: "3",
    active: false,
    title: "OPEX trend",
    subtitle: "Consecutive months of OPEX Increase",
    tags: [
      { label: "Financial", variant: "neutral" },
      { label: "P&L", variant: "neutral" },
    ],
    workflowType: "task",
    updatedLabel: "Updated 1 sec ago",
    triggeredAt: "2024-12-05",
    kanbanColumn: "in_progress",
    overviewBucket: "new_information",
    impact: "high",
    createdBy: "Tomer Zakai",
  },
  {
    id: "4",
    active: true,
    title: "Service Charges discrepancy",
    subtitle: "10% YTD gap between advances and expenses",
    subtitleClassName: "text-[14px] leading-[1.4]",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "Service Charge", variant: "warning" },
    ],
    workflowType: "insight",
    updatedLabel: "Updated on 20 Aug 2025",
    triggeredAt: "2024-12-18",
    kanbanColumn: "in_progress",
    expandDetail: {
      triggered: "15 times (last 7 days)",
      createdOn: "12 Sep 2025",
      updatedBy: "@jimduddley",
      instructionTokens: SERVICE_CHARGE_INSTRUCTION,
    },
    overviewBucket: "anomalies",
    impact: "high",
    createdBy: "Tomer Zakai",
  },
  {
    id: "5",
    active: true,
    title: "Expense increase (Z C.V.)",
    subtitle: "Any increase in expenses for Z C.V.",
    subtitleClassName: "text-[14px] leading-[1.4]",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "P&L", variant: "warning" },
    ],
    workflowType: "task",
    updatedLabel: "Updated on 10 Aug 2025",
    triggeredAt: "2024-12-22",
    kanbanColumn: "done",
    overviewBucket: "insights",
    impact: "standard",
  },
  {
    id: "6",
    active: true,
    title: "Delayed payment tenant X Ltd",
    subtitle: "Notification of any late payment of tenant X Ltd",
    subtitleClassName: "text-[14px] leading-[1.4]",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "General", variant: "warning" },
    ],
    workflowType: "insight",
    updatedLabel: "Updated on 30 Jul 2025",
    triggeredAt: "2024-12-28",
    kanbanColumn: "done",
    overviewBucket: "anomalies",
    impact: "high",
  },
  {
    id: "7",
    active: true,
    title: "Vacancy spike — logistics cluster",
    subtitle: "Portfolio vacancy 2.1pp above threshold on three assets",
    tags: [
      { label: "Commercial", variant: "accent" },
      { label: "Occupancy", variant: "warning" },
    ],
    workflowType: "task",
    updatedLabel: "Updated 4 hours ago",
    triggeredAt: "2025-01-02",
    kanbanColumn: "backlog",
    overviewBucket: "insights",
    impact: "high",
  },
  {
    id: "8",
    active: true,
    title: "Rent indexation batch due Q1",
    subtitle: "Twelve leases eligible — model c. €180K indexed rent uplift",
    tags: [
      { label: "Financial", variant: "accent" },
      { label: "Leasing", variant: "warning" },
    ],
    workflowType: "insight",
    updatedLabel: "Updated 6 hours ago",
    triggeredAt: "2025-01-03",
    kanbanColumn: "in_progress",
    overviewBucket: "insights",
    impact: "high",
  },
];
