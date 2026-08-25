"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";
import { useWorkflowSessions } from "@/src/hooks/useWorkflowSessions";
import { createWorkflowSessionForIntent } from "@/src/lib/workflowSessions";

/**
 * Service Charge Settlement overview route — resumes the most recent settlement
 * case, or starts a new one, then redirects into the workflow chat.
 */
export function ServiceChargeSettlementOverviewPageClient() {
  const router = useRouter();
  const { sessions } = useWorkflowSessions();

  useEffect(() => {
    const existing = sessions
      .filter((s) => s.topic === "service-charge-settlement")
      .sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt))[0];

    if (existing) {
      router.replace(`/workflows/${existing.id}`);
      return;
    }

    const session = createWorkflowSessionForIntent("service-charge-settlement");
    router.replace(`/workflows/${session.id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <DashboardLoading label="Loading service charge settlement…" />;
}
