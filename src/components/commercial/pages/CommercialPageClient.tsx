"use client";

import { useRouter } from "next/navigation";
import { CommercialDashboard } from "@/src/components/commercial/CommercialDashboard";
import type { TopNavTabId } from "@/src/types/commercial";
import { navigateTopNavTab } from "@/src/lib/topNavNavigation";

export function CommercialPageClient() {
  const router = useRouter();
  return (
    <CommercialDashboard
      activeTab="commercial"
      onTabChange={(tab: TopNavTabId) => navigateTopNavTab(tab, router)}
    />
  );
}
