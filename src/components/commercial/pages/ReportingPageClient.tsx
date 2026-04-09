"use client";

import { useRouter } from "next/navigation";
import type { TopNavTabId } from "@/src/types/commercial";
import { ReportingDashboard } from "@/src/components/pages/ReportingDashboard";
import { navigateTopNavTab } from "@/src/lib/topNavNavigation";

export function ReportingPageClient() {
  const router = useRouter();
  return (
    <ReportingDashboard
      activeTab="reporting"
      onTabChange={(tab: TopNavTabId) => navigateTopNavTab(tab, router)}
    />
  );
}

