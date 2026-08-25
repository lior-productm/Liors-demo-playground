"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";
import { WorkflowCreationChat } from "@/src/components/workflows/WorkflowCreationChat";
import { ServiceChargeSettlementFlow } from "@/src/components/workflows/ServiceChargeSettlementFlow";
import { WorkflowsOverviewPageClient } from "@/src/components/workflows/WorkflowsOverviewPageClient";
import { getWorkflowSession } from "@/src/lib/workflowSessions";

function resolveWorkflowSessionId(id: string) {
  if (!id || id === "new") return null;
  return getWorkflowSession(id) ? id : null;
}

export function WorkflowSessionPageClient() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [sessionId, setSessionId] = useState(() => resolveWorkflowSessionId(id) ?? "");
  const [ready, setReady] = useState(() => Boolean(resolveWorkflowSessionId(id)));

  useLayoutEffect(() => {
    if (id === "new") {
      setSessionId("");
      setReady(false);
      return;
    }

    const resolved = resolveWorkflowSessionId(id);
    if (resolved) {
      setSessionId(resolved);
      setReady(true);
      return;
    }

    setSessionId("");
    setReady(false);
  }, [id]);

  useEffect(() => {
    if (!id || id === "new") return;
    if (getWorkflowSession(id)) return;
    router.replace("/workflows/new");
  }, [id, router]);

  if (id === "new") {
    return <WorkflowsOverviewPageClient />;
  }

  if (!ready || !sessionId) {
    return <DashboardLoading label="Starting workflow…" />;
  }

  const session = getWorkflowSession(sessionId);
  if (session?.topic === "service-charge-settlement") {
    return <ServiceChargeSettlementFlow sessionId={sessionId} initialSession={session} />;
  }
  return <WorkflowCreationChat sessionId={sessionId} initialSession={session} />;
}
