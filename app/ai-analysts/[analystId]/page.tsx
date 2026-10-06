"use client";

import { Suspense, use } from "react";
import { AiAnalystsShell } from "@/src/components/ai-analysts/AiAnalystsShell";
import { AnalystPage } from "@/src/components/ai-analysts/AnalystPage";
import type { AnalystId } from "@/src/types/aiAnalysts";

const VALID_IDS: AnalystId[] = ["financial", "commercial", "technical", "debt", "service-charges"];

export default function AnalystRoutePage({
  params,
}: {
  params: Promise<{ analystId: string }>;
}) {
  const { analystId } = use(params);
  const id = (VALID_IDS.includes(analystId as AnalystId) ? analystId : "financial") as AnalystId;
  return (
    <AiAnalystsShell activeNav="ai-analysts">
      <Suspense fallback={null}>
        <AnalystPage analystId={id} />
      </Suspense>
    </AiAnalystsShell>
  );
}
