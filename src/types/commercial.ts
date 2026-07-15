export type { SidebarNavId, TopNavTabId } from "@/src/types/navigation";

export type LeaseStatus = "Expiring" | "Renewal" | "Active";

export interface LeaseRow {
  id: string;
  assetName: string;
  assetType: "Office" | "Logistics" | "Retail" | "Residential";
  leaseStart: string; // ISO date (YYYY-MM-DD)
  leaseEnd: string; // ISO date (YYYY-MM-DD)
  currentRentPerSqm: number; // numeric for calculations
  marketRentPerSqm: number;
  deltaPct: number; // market vs current
  status: LeaseStatus;
  confidencePct: number;
}

export type ChatRole = "assistant" | "user";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string; // e.g. "12:14"
}

export type RecentActionStatus = "Ready" | "In Progress" | "Completed";

export interface RecentAction {
  id: string;
  assetType: LeaseRow["assetType"];
  title: string;
  detail: string;
  timestamp: string; // e.g. "Today · 10:43"
  status: RecentActionStatus;
  // For badge styling only.
  accent: "accent" | "primary" | "chart-2" | "chart-3";
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "flat";
  accent?: "accent" | "destructive" | "primary" | "chart-3" | "warning";
}

