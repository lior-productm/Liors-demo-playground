import type {
  ChatMessage,
  KpiMetric,
  LeaseRow,
  RecentAction,
  RecentActionStatus,
  TopNavTabId,
} from "@/src/types/commercial";

export const topNavTabs: Array<{ id: TopNavTabId; label: string }> = [
  { id: "amiio", label: "Amiio" },
  { id: "finance", label: "Finance" },
  { id: "commercial", label: "Commercial" },
  { id: "reporting", label: "Reporting" },
];

export const kpis: KpiMetric[] = [
  {
    id: "noi",
    label: "Net Operating Income",
    value: "$42.7M",
    sub: "vs last quarter",
    trend: "up",
    accent: "primary",
  },
  {
    id: "occupancy",
    label: "Occupancy Rate",
    value: "95.1%",
    sub: "target 95.0%",
    trend: "up",
    accent: "accent",
  },
  {
    id: "debt",
    label: "Debt Ratio",
    value: "61.4%",
    sub: "market adjusted",
    trend: "down",
    accent: "destructive",
  },
  {
    id: "cap",
    label: "Weighted Cap Rate",
    value: "6.0%",
    sub: "current blend",
    trend: "flat",
    accent: "chart-3",
  },
];

export const leaseTableRows: LeaseRow[] = [
  {
    id: "l1",
    assetName: "Tower One Office",
    assetType: "Office",
    leaseStart: "2021-07-01",
    leaseEnd: "2026-09-30",
    currentRentPerSqm: 148,
    marketRentPerSqm: 156,
    deltaPct: 5.4,
    status: "Renewal",
    confidencePct: 82,
  },
  {
    id: "l2",
    assetName: "Mega Logistics Hub",
    assetType: "Logistics",
    leaseStart: "2020-03-15",
    leaseEnd: "2026-02-28",
    currentRentPerSqm: 121,
    marketRentPerSqm: 129,
    deltaPct: 6.6,
    status: "Expiring",
    confidencePct: 74,
  },
  {
    id: "l3",
    assetName: "Central Mall",
    assetType: "Retail",
    leaseStart: "2019-10-01",
    leaseEnd: "2026-08-31",
    currentRentPerSqm: 86,
    marketRentPerSqm: 80,
    deltaPct: -6.9,
    status: "Active",
    confidencePct: 66,
  },
  {
    id: "l4",
    assetName: "Harbor Retail Center",
    assetType: "Retail",
    leaseStart: "2022-04-01",
    leaseEnd: "2027-01-31",
    currentRentPerSqm: 77,
    marketRentPerSqm: 82,
    deltaPct: 6.5,
    status: "Active",
    confidencePct: 72,
  },
  {
    id: "l5",
    assetName: "Prestige Residences",
    assetType: "Residential",
    leaseStart: "2021-11-01",
    leaseEnd: "2026-12-15",
    currentRentPerSqm: 54,
    marketRentPerSqm: 57,
    deltaPct: 5.6,
    status: "Renewal",
    confidencePct: 79,
  },
  {
    id: "l6",
    assetName: "Green Park Logistics",
    assetType: "Logistics",
    leaseStart: "2018-05-01",
    leaseEnd: "2026-05-31",
    currentRentPerSqm: 116,
    marketRentPerSqm: 123,
    deltaPct: 6.0,
    status: "Expiring",
    confidencePct: 68,
  },
  {
    id: "l7",
    assetName: "City Center Mall",
    assetType: "Retail",
    leaseStart: "2020-09-01",
    leaseEnd: "2026-10-15",
    currentRentPerSqm: 83,
    marketRentPerSqm: 88,
    deltaPct: 6.0,
    status: "Renewal",
    confidencePct: 70,
  },
  {
    id: "l8",
    assetName: "Skyline Apartments",
    assetType: "Residential",
    leaseStart: "2020-01-01",
    leaseEnd: "2026-06-30",
    currentRentPerSqm: 51,
    marketRentPerSqm: 49,
    deltaPct: -3.9,
    status: "Expiring",
    confidencePct: 62,
  },
];

/** Demo chats start empty so the greeting / topic picker is the default view. */
export const initialChatMessages: ChatMessage[] = [];

export const recentActions: RecentAction[] = [
  {
    id: "a1",
    assetType: "Office",
    title: "Renewal window scored",
    detail: "Tower One Office · Renewal probability 82%",
    timestamp: "Today · 10:43",
    status: "Ready",
    accent: "primary",
  },
  {
    id: "a2",
    assetType: "Logistics",
    title: "Lease expiry calendar updated",
    detail: "Mega Logistics Hub · Expiring in 5 months",
    timestamp: "Today · 09:12",
    status: "Completed",
    accent: "chart-2",
  },
  {
    id: "a3",
    assetType: "Retail",
    title: "Rent variance flagged",
    detail: "Central Mall · Market -6.9% vs current",
    timestamp: "Yesterday · 16:28",
    status: "In Progress",
    accent: "chart-3",
  },
  {
    id: "a4",
    assetType: "Residential",
    title: "Escalation scenario generated",
    detail: "Prestige Residences · +5.6% market delta",
    timestamp: "Yesterday · 14:02",
    status: "Ready",
    accent: "accent",
  },
  {
    id: "a5",
    assetType: "Logistics",
    title: "Tenant pipeline note created",
    detail: "Green Park Logistics · Renewal shortlist 3 tenants",
    timestamp: "Yesterday · 11:41",
    status: "In Progress",
    accent: "primary",
  },
  {
    id: "a6",
    assetType: "Retail",
    title: "Service-charge adjustment suggested",
    detail: "Harbor Retail Center · CAM recovery forecast updated",
    timestamp: "Mon · 09:55",
    status: "Ready",
    accent: "accent",
  },
  {
    id: "a7",
    assetType: "Office",
    title: "Cap-rate snapshot refreshed",
    detail: "Tower One Office · 6.0% blended cap rate",
    timestamp: "Mon · 08:18",
    status: "Completed",
    accent: "chart-2",
  },
  {
    id: "a8",
    assetType: "Residential",
    title: "Market comps referenced",
    detail: "Skyline Apartments · comps from 2025-2026",
    timestamp: "Sun · 19:44",
    status: "Ready",
    accent: "chart-3",
  },
  {
    id: "a9",
    assetType: "Retail",
    title: "Budget comparison run",
    detail: "City Center Mall · NOI variance -1.3%",
    timestamp: "Sun · 17:10",
    status: "Completed",
    accent: "primary",
  },
  {
    id: "a10",
    assetType: "Logistics",
    title: "Next steps assigned",
    detail: "Mega Logistics Hub · Ask brokers for updated spreads",
    timestamp: "Sun · 15:27",
    status: "In Progress",
    accent: "accent",
  },
];

export function statusAccent(status: RecentActionStatus): RecentAction["accent"] {
  switch (status) {
    case "Ready":
      return "primary";
    case "Completed":
      return "chart-2";
    case "In Progress":
      return "accent";
    default:
      return "primary";
  }
}

