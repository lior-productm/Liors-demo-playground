import { Suspense } from "react";
import { FinancialAnalystPage } from "@/src/components/ai-assistants/FinancialAnalystPage";

export default function FinancialAnalystRoutePage() {
  return (
    <Suspense fallback={null}>
      <FinancialAnalystPage />
    </Suspense>
  );
}
