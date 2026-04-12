"use client";

import { useRouter } from "next/navigation";
import type { TopNavTabId } from "@/src/types/commercial";
import { FinancialDashboard } from "@/src/components/pages/FinancialDashboard";
import { navigateTopNavTab } from "@/src/lib/topNavNavigation";

export function FinancialPageClient() {
  const router = useRouter();
  return (
    <FinancialDashboard
      activeTab="finance"
      onTabChange={(tab: TopNavTabId) => navigateTopNavTab(tab, router)}
    />
  );
}

