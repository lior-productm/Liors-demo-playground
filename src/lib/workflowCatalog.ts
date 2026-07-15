import type { LucideIcon } from "lucide-react";
import { BarChart3, Building2, Leaf, Search } from "lucide-react";
import type { WorkflowIntentId } from "@/src/types/workflows";

export type WorkflowCatalogId =
  | "leasing-renewal"
  | "market-research"
  | "financial-forecasting"
  | "esg";

export type WorkflowCatalogItem = {
  id: WorkflowCatalogId;
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  intent?: WorkflowIntentId;
  comingSoon?: boolean;
};

export const WORKFLOW_CATALOG: WorkflowCatalogItem[] = [
  {
    id: "leasing-renewal",
    title: "Lease Renewal",
    description:
      "Helps you prepare, draft, and review renewal proposals for selected tenants.",
    icon: Building2,
    href: "/workflows/leasing-renewal",
  },
  {
    id: "market-research",
    title: "Market Research",
    description:
      "Analyze property performance, comps, and market trends across your portfolio.",
    icon: Search,
    intent: "market-research",
  },
  {
    id: "financial-forecasting",
    title: "Financial Forecasting",
    description:
      "Forecast cash flows, rank assets by risk, and model scenario outcomes.",
    icon: BarChart3,
    intent: "financial-forecasting",
  },
  {
    id: "esg",
    title: "ESG",
    description:
      "Track sustainability metrics, compliance, and ESG reporting for your assets.",
    icon: Leaf,
    comingSoon: true,
  },
];
