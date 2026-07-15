"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLoading } from "@/src/components/layout/DashboardLoading";
import { AskAiChat } from "@/src/components/ask-ai/AskAiChat";
import { getAskAiSession } from "@/src/lib/askAiSessions";

export function AskAiSessionPageClient() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [ready, setReady] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    if (!id) return;
    if (id === "new") {
      router.replace("/ask-ai");
      return;
    }
    const existing = getAskAiSession(id);
    if (!existing) {
      router.replace("/ask-ai");
      return;
    }
    setSessionId(id);
    setReady(true);
  }, [id, router]);

  if (!ready || !sessionId) {
    return <DashboardLoading label="Loading chat…" />;
  }

  const session = getAskAiSession(sessionId);
  return <AskAiChat sessionId={sessionId} initialSession={session} />;
}
