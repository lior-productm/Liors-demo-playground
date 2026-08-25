"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiAssistantCard } from "@/src/lib/aiAssistantsData";
import { pinAiAssistant } from "@/src/lib/aiAssistantNavState";
import { LeaseAnalystIcon } from "@/src/components/ai-assistants/LeaseAnalystIcon";
import { FinancialAnalystIcon } from "@/src/components/ai-assistants/FinancialAnalystIcon";
import { DebtAnalystIcon } from "@/src/components/ai-assistants/DebtAnalystIcon";

function ChatButton() {
  return (
    <span className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-[32px] border border-[#B3B8BD] px-3 py-1.5 text-sm font-medium leading-[1.24] text-[#010309] transition-colors hover:bg-[#F0F2F5]">
      Chat
      <ArrowRight className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
    </span>
  );
}

function CardIcon({ card }: { card: AiAssistantCard }) {
  if (card.id === "lease-analyst") {
    return <LeaseAnalystIcon className="size-6 shrink-0" />;
  }
  if (card.id === "reporting") {
    return <FinancialAnalystIcon className="size-6 shrink-0" />;
  }
  if (card.id === "esg") {
    return <DebtAnalystIcon className="size-6 shrink-0" />;
  }

  if (card.iconSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={card.iconSrc}
        alt=""
        width={24}
        height={24}
        className="size-6 shrink-0"
        aria-hidden
      />
    );
  }

  const Icon = card.icon;
  return (
    <Icon
      className={cn("size-6 shrink-0", card.iconClassName ?? "text-[#353638]")}
      strokeWidth={1.5}
      aria-hidden
    />
  );
}

export function AiAssistantCardView({
  card,
  onChatClick,
}: {
  card: AiAssistantCard;
  onChatClick?: () => void;
}) {
  const PIN_BY_ID: Partial<Record<AiAssistantCard["id"], "lease-analyst" | "financial" | "debt">> = {
    "lease-analyst": "lease-analyst",
    reporting: "financial",
    esg: "debt",
  };
  const pinId = PIN_BY_ID[card.id];

  const chatControl = pinId ? (
    <Link
      href={card.chatHref}
      onClick={() => {
        pinAiAssistant(pinId);
        onChatClick?.();
      }}
    >
      <ChatButton />
    </Link>
  ) : (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("amiio:toast", {
            detail: { message: `${card.title} (coming soon)` },
          }),
        )
      }
    >
      <ChatButton />
    </button>
  );

  return (
    <article className="flex h-[255px] min-w-[240px] flex-1 flex-col gap-5 rounded-[12px] border border-[rgba(230,231,232,0.7)] bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CardIcon card={card} />
              <h3 className="text-base font-semibold leading-[1.25] text-[#1E1E1E]">
                {card.title}
              </h3>
            </div>
            <p className="text-sm font-normal leading-[1.4] text-[#65686B]">
              {card.description}
            </p>
          </div>
        </div>
        {chatControl}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-[1.24px] text-[#65686B]">
          Ouput examples
        </p>
        <div className="flex flex-wrap gap-2">
          {card.outputExamples.map((pill) => (
            <span
              key={pill.label}
              className={cn(
                "rounded-[32px] px-2 py-1.5 text-xs font-medium leading-[1.5] text-[#353638]",
                pill.className,
              )}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
