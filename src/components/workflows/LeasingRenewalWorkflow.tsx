"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";
import {
  createWorkflowSession,
  readWorkflowSessions,
  upsertWorkflowSession,
} from "@/src/lib/workflowSessions";
import { intentToTopic } from "@/src/lib/workflowTopics";

/** Legacy route — opens the lease renewal flow inside the workflow chat session. */
export function LeasingRenewalWorkflow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tenant = searchParams.get("tenant");
    const portfolio = searchParams.get("portfolio") ?? undefined;
    const entity = searchParams.get("entity") ?? undefined;
    const property = searchParams.get("property") ?? undefined;

    const matched = readWorkflowSessions().find(
      (session) =>
        session.intent === "lease-renewal" &&
        session.tenant === tenant &&
        session.step === "lease-renewal-active",
    );

    if (matched) {
      router.replace(`/workflows/${matched.id}`);
      return;
    }

    const session = createWorkflowSession();
    upsertWorkflowSession({
      ...session,
      title: tenant ?? "Lease Renewal",
      intent: "lease-renewal",
      topic: intentToTopic("lease-renewal"),
      step: tenant ? "lease-renewal-active" : "lease-scope",
      tenant: tenant ?? undefined,
      portfolio,
      entity,
      property,
      launchedExternally: Boolean(tenant),
      renewalSubStep: tenant ? "proposal-prep" : undefined,
    });
    router.replace(`/workflows/${session.id}`);
  }, [router, searchParams]);

  return <DashboardLoading label="Opening renewal workflow…" />;
}
