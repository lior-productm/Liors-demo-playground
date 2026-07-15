"use client";

import { AppShell } from "@/src/components/layout/AppShell";
import { SidebarNavIcon } from "@/src/components/layout/SidebarNavIcons";
import { AI_ASSISTANT_CARDS } from "@/src/lib/aiAssistantsData";
import { AiAssistantCardView } from "@/src/components/ai-assistants/AiAssistantCard";

export function AiAssistantsLanding() {
  const row1 = AI_ASSISTANT_CARDS.slice(0, 2);
  const row2 = AI_ASSISTANT_CARDS.slice(2);

  return (
    <AppShell activeNav="ai-assistants">
      <div className="mx-auto flex w-full max-w-[879px] flex-col items-center px-6 pb-12 pt-[95px]">
        <header className="flex w-full flex-col items-center gap-3 text-center">
          <div className="flex flex-col items-center gap-3">
            <SidebarNavIcon name="aiAssistantsStar" width={32} height={32} />
            <h1 className="text-2xl font-medium leading-[1.25] text-black">
              Get started with Amiio AI Assistants
            </h1>
          </div>
          <p className="text-lg font-medium leading-[1.25] text-[#65686B]">
            How can we help you today?
          </p>
        </header>

        <div className="mt-[68px] flex w-full flex-col gap-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            {row1.map((card) => (
              <AiAssistantCardView key={card.id} card={card} />
            ))}
          </div>
          <div className="flex flex-col gap-6 lg:flex-row">
            {row2.map((card) => (
              <AiAssistantCardView key={card.id} card={card} />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="mt-6 text-sm font-medium leading-[1.24] text-[#010309] transition-opacity hover:opacity-70"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("amiio:toast", {
                detail: { message: "More assistants coming soon" },
              }),
            )
          }
        >
          See more
        </button>
      </div>
    </AppShell>
  );
}
