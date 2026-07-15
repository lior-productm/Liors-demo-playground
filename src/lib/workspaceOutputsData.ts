import type { LucideIcon } from "lucide-react";
import {
  Building2,
  FileText,
  Globe,
  Leaf,
  LineChart,
  Lightbulb,
  Workflow,
} from "lucide-react";

export type WorkspaceOutputType = "Analysis" | "Insight" | "Workflow";

export type WorkspaceAnalystId =
  | "reporting"
  | "esg"
  | "market-research"
  | "leasing";

export type WorkspaceWorkflowStep = {
  id: string;
  label: string;
  icon: "envelope" | "lightbulb" | "bell";
  actionLabel?: string;
};

export type WorkspaceRunLogEntry = {
  label: string;
  status: "next" | "completed" | "failed";
};

export type WorkspaceOutput = {
  id: string;
  name: string;
  type: WorkspaceOutputType;
  scope: string;
  trigger: string;
  emailAlert: boolean;
  analyst: WorkspaceAnalystId;
  nextRun: string;
  actionLabel: string;
  isNew?: boolean;
  favorite?: boolean;
  expandedTrigger: string;
  workflowSteps: WorkspaceWorkflowStep[];
  outputItems: string[];
  taskInfo: {
    triggerFull: string;
    scopeFull: string;
    output: string;
    delivery: string;
    status: "Active" | "Inactive";
    owner: string;
    runLog: WorkspaceRunLogEntry[];
  };
};

export type WorkspaceAnalystMeta = {
  id: WorkspaceAnalystId;
  label: string;
  icon: LucideIcon;
  circleClassName: string;
  iconClassName: string;
};

export const WORKSPACE_ANALYSTS: WorkspaceAnalystMeta[] = [
  {
    id: "reporting",
    label: "Reporting",
    icon: FileText,
    circleClassName: "bg-[#E9ECFC]",
    iconClassName: "text-[#4F65E5]",
  },
  {
    id: "esg",
    label: "ESG",
    icon: Leaf,
    circleClassName: "bg-[#E6F6F3]",
    iconClassName: "text-[#1F9E8B]",
  },
  {
    id: "market-research",
    label: "Market Research",
    icon: Globe,
    circleClassName: "bg-[#FDF2FA]",
    iconClassName: "text-[#D6605B]",
  },
  {
    id: "leasing",
    label: "Leasing",
    icon: Building2,
    circleClassName: "bg-[#F2EEE8]",
    iconClassName: "text-[#A2845E]",
  },
];

export function getAnalystMeta(id: WorkspaceAnalystId): WorkspaceAnalystMeta {
  return WORKSPACE_ANALYSTS.find((a) => a.id === id) ?? WORKSPACE_ANALYSTS[0];
}

export function getAnalystPageHref(id: WorkspaceAnalystId): string | null {
  if (id === "leasing") return "/ai-assistants/lease-analyst";
  return null;
}

export const WORKSPACE_TYPE_META: Record<
  WorkspaceOutputType,
  { icon: LucideIcon }
> = {
  Analysis: { icon: LineChart },
  Insight: { icon: Lightbulb },
  Workflow: { icon: Workflow },
};

export const WORKSPACE_OUTPUTS: WorkspaceOutput[] = [
  {
    id: "out-1",
    name: "June Financial Review",
    type: "Analysis",
    scope: "SLB Holdings...",
    trigger: "May 30, 9:00",
    emailAlert: true,
    analyst: "reporting",
    nextRun: "Mon, 9:00",
    actionLabel: "Export analysis",
    isNew: true,
    expandedTrigger: "Every month on the last business day at 09:00",
    workflowSteps: [
      { id: "s1", label: "Pull dashboard data", icon: "lightbulb" },
      { id: "s2", label: "Draft commentary", icon: "envelope", actionLabel: "Preview" },
      { id: "s3", label: "Send report", icon: "bell" },
    ],
    outputItems: ["Portfolio summary PDF", "Variance explanations", "Top-performing assets list"],
    taskInfo: {
      triggerFull: "Every month on the last business day at 09:00",
      scopeFull: "SLB Holdings, full portfolio",
      output: "Monthly financial review report",
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
    id: "out-2",
    name: "Imminent Lease Expiry Risk",
    type: "Insight",
    scope: "All assets",
    trigger: "If lease < 90 days",
    emailAlert: false,
    analyst: "leasing",
    nextRun: "Daily, 8:00",
    actionLabel: "Analyse further",
    expandedTrigger: "When any lease is within 90 days of expiry",
    workflowSteps: [
      { id: "s1", label: "Scan lease register", icon: "lightbulb" },
      { id: "s2", label: "Score tenant risk", icon: "bell" },
      { id: "s3", label: "Create insight card", icon: "envelope", actionLabel: "View card" },
    ],
    outputItems: ["Expiry risk insight", "Tenant exposure summary", "Suggested renewal actions"],
    taskInfo: {
      triggerFull: "When any lease is within 90 days of expiry",
      scopeFull: "All assets, Property Partners portfolio",
      output: "Lease expiry risk insight card",
      delivery: "Workspace",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 15", status: "next" },
        { label: "July 14", status: "completed" },
        { label: "July 13", status: "completed" },
      ],
    },
  },
  {
    id: "out-3",
    name: "Services Charge Insight",
    type: "Workflow",
    scope: "Property Partners...",
    trigger: "If services charges > 5%",
    emailAlert: true,
    analyst: "reporting",
    nextRun: "Weekly",
    actionLabel: "Open Workflow",
    expandedTrigger: "When service charge variance exceeds 5% vs budget",
    workflowSteps: [
      { id: "s1", label: "Compare budget vs actual", icon: "lightbulb" },
      { id: "s2", label: "Flag anomalies", icon: "bell" },
      { id: "s3", label: "Draft explanation", icon: "envelope", actionLabel: "Review draft" },
    ],
    outputItems: ["Budget vs Actual report", "Variance alert", "Commentary draft"],
    taskInfo: {
      triggerFull: "Every month, Monday at 09:00",
      scopeFull: "Property Partners, H.J.E. Wenckebachweg",
      output: "Budget vs Actual report",
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
    id: "out-4",
    name: "ESG Data Gap Alert",
    type: "Insight",
    scope: "All assets",
    trigger: "Weekly",
    emailAlert: false,
    analyst: "esg",
    nextRun: "Mon, 7:00",
    actionLabel: "View analysis",
    expandedTrigger: "Every Monday at 07:00 — scan for missing ESG fields",
    workflowSteps: [
      { id: "s1", label: "Check ESG data completeness", icon: "lightbulb" },
      { id: "s2", label: "Create missing data alert", icon: "bell" },
    ],
    outputItems: ["Missing data alert", "Suggested remediation steps"],
    taskInfo: {
      triggerFull: "Every Monday at 07:00",
      scopeFull: "All assets, ESG reporting scope",
      output: "Missing ESG data alert",
      delivery: "Email",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 14", status: "next" },
        { label: "July 7", status: "completed" },
        { label: "June 30", status: "completed" },
      ],
    },
  },
  {
    id: "out-5",
    name: "Market Rent Benchmark",
    type: "Analysis",
    scope: "Paris Retail",
    trigger: "Monthly",
    emailAlert: true,
    analyst: "market-research",
    nextRun: "Aug 1, 9:00",
    actionLabel: "Export analysis",
    expandedTrigger: "First day of each month at 09:00",
    workflowSteps: [
      { id: "s1", label: "Pull comparable rents", icon: "lightbulb" },
      { id: "s2", label: "Benchmark portfolio", icon: "bell" },
      { id: "s3", label: "Generate summary", icon: "envelope", actionLabel: "Preview" },
    ],
    outputItems: ["Market summary", "Comparable signals", "Rent benchmark table"],
    taskInfo: {
      triggerFull: "First day of each month at 09:00",
      scopeFull: "Paris Retail Portfolio",
      output: "Market rent benchmark report",
      delivery: "Email",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "August 1", status: "next" },
        { label: "July 1", status: "completed" },
        { label: "June 1", status: "completed" },
      ],
    },
  },
  {
    id: "out-6",
    name: "Break Option Monitor",
    type: "Workflow",
    scope: "All assets",
    trigger: "If break < 90 days",
    emailAlert: true,
    analyst: "leasing",
    nextRun: "Daily, 8:00",
    actionLabel: "Open Workflow",
    expandedTrigger: "When a tenant break option opens within 90 days",
    workflowSteps: [
      { id: "s1", label: "Scan break option dates", icon: "lightbulb" },
      { id: "s2", label: "Alert asset manager", icon: "bell" },
      { id: "s3", label: "Draft follow-up", icon: "envelope", actionLabel: "Review draft" },
    ],
    outputItems: ["Break option alert", "Tenant summary", "Follow-up email draft"],
    taskInfo: {
      triggerFull: "When a tenant break option opens within 90 days",
      scopeFull: "All assets, Property Partners portfolio",
      output: "Break option monitoring workflow",
      delivery: "Email + Workspace",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 15", status: "next" },
        { label: "July 14", status: "completed" },
      ],
    },
  },
  {
    id: "out-7",
    name: "Q2 Portfolio Commentary",
    type: "Analysis",
    scope: "Full portfolio",
    trigger: "Jun 30, 17:00",
    emailAlert: false,
    analyst: "reporting",
    nextRun: "Sep 30, 17:00",
    actionLabel: "Export analysis",
    expandedTrigger: "End of quarter at 17:00",
    workflowSteps: [
      { id: "s1", label: "Aggregate Q2 performance", icon: "lightbulb" },
      { id: "s2", label: "Draft IC commentary", icon: "envelope", actionLabel: "Preview" },
    ],
    outputItems: ["Q2 portfolio summary", "IC-ready commentary"],
    taskInfo: {
      triggerFull: "End of quarter at 17:00",
      scopeFull: "Full portfolio, Property Partners",
      output: "Quarterly portfolio commentary",
      delivery: "Email",
      status: "Inactive",
      owner: "Tomer Zakai",
      runLog: [
        { label: "September 30", status: "next" },
        { label: "June 30", status: "completed" },
      ],
    },
  },
  {
    id: "out-8",
    name: "Energy Performance Alert",
    type: "Insight",
    scope: "Netherlands assets",
    trigger: "If consumption +10%",
    emailAlert: true,
    analyst: "esg",
    nextRun: "Weekly",
    actionLabel: "View analysis",
    expandedTrigger: "When energy consumption rises more than 10% vs prior period",
    workflowSteps: [
      { id: "s1", label: "Monitor energy data", icon: "lightbulb" },
      { id: "s2", label: "Flag underperforming assets", icon: "bell" },
    ],
    outputItems: ["Energy performance insight", "Suggested actions"],
    taskInfo: {
      triggerFull: "When energy consumption rises more than 10% vs prior period",
      scopeFull: "Netherlands assets, ESG scope",
      output: "Energy performance alert",
      delivery: "Email",
      status: "Active",
      owner: "Tomer Zakai",
      runLog: [
        { label: "July 14", status: "next" },
        { label: "July 7", status: "completed" },
        { label: "June 30", status: "failed" },
      ],
    },
  },
];
