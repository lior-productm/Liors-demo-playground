import { Suspense } from "react";
import { AiAssistantNavReset } from "@/src/components/ai-assistants/AiAssistantNavReset";

export default function AiAssistantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AiAssistantNavReset />
      </Suspense>
      {children}
    </>
  );
}
