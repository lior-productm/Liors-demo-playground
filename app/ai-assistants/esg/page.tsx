import { Suspense } from "react";
import { DebtAnalystPage } from "@/src/components/ai-assistants/DebtAnalystPage";

export default function DebtAnalystRoutePage() {
  return (
    <Suspense fallback={null}>
      <DebtAnalystPage />
    </Suspense>
  );
}
