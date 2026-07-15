export type SidebarNavId =
  | "ask-ai"
  | "insights"
  | "ai-assistants"
  | "lease-analyst"
  | "financial"
  | "commercial"
  | "workflow-new"
  | "leasing-renewal"
  | "reporting"
  | "market-research"
  | "settings";

export type TopNavTabId =
  | "amiio"
  | "finance"
  | "commercial"
  | "reporting";

export function sidebarNavToTopNav(id: SidebarNavId): TopNavTabId | null {
  switch (id) {
    case "ask-ai":
      return "amiio";
    case "financial":
      return "finance";
    case "commercial":
      return "commercial";
    case "workflow-new":
    case "leasing-renewal":
      return "commercial";
    case "reporting":
      return "reporting";
    default:
      return null;
  }
}

export function topNavToSidebarNav(id: TopNavTabId): SidebarNavId {
  switch (id) {
    case "amiio":
      return "ask-ai";
    case "finance":
      return "financial";
    case "commercial":
      return "commercial";
    case "reporting":
      return "reporting";
  }
}
