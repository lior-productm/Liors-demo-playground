import { Suspense } from "react";
import { LeaseAnalystPage } from "@/src/components/ai-assistants/LeaseAnalystPage";

export default function LeaseAnalystRoutePage() {
  return (
    <Suspense fallback={null}>
      <LeaseAnalystPage />
    </Suspense>
  );
}
