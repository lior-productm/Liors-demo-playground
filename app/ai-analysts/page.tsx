"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AiAnalystsShell } from "@/src/components/ai-analysts/AiAnalystsShell";
import { AiAnalystsPage } from "@/src/components/ai-analysts/AiAnalystsPage";

function AiAnalystsRouteInner() {
  const params = useSearchParams();
  const chatOpen = params.get("chat") === "1";
  return (
    <AiAnalystsShell activeNav="ai-analysts" initialChatOpen={chatOpen}>
      <AiAnalystsPage />
    </AiAnalystsShell>
  );
}

export default function AiAnalystsRoutePage() {
  return (
    <Suspense fallback={null}>
      <AiAnalystsRouteInner />
    </Suspense>
  );
}
