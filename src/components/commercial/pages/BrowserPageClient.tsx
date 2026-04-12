"use client";

import { useRouter } from "next/navigation";
import { BrowserDashboard } from "@/src/components/pages/BrowserDashboard";
import type { TopNavTabId } from "@/src/types/commercial";
import { navigateTopNavTab } from "@/src/lib/topNavNavigation";

export function BrowserPageClient() {
  const router = useRouter();
  return (
    <BrowserDashboard
      activeTab="browser"
      onTabChange={(tab: TopNavTabId) => navigateTopNavTab(tab, router)}
    />
  );
}
