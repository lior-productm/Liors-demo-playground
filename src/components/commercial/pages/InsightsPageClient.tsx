"use client";

import { useRouter } from "next/navigation";
import type { TopNavTabId } from "@/src/types/commercial";
import { InsightsDashboard } from "@/src/components/pages/InsightsDashboard";
import { navigateTopNavTab } from "@/src/lib/topNavNavigation";

export function InsightsPageClient() {
  const router = useRouter();
  return (
    <InsightsDashboard
      activeTab="amiio"
      onTabChange={(tab: TopNavTabId) => navigateTopNavTab(tab, router)}
    />
  );
}

