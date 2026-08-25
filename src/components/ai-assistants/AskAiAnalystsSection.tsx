"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AI_ASSISTANT_CARDS,
  type AiAssistantCard,
} from "@/src/lib/aiAssistantsData";
import { pinAiAssistant } from "@/src/lib/aiAssistantNavState";
import { AiAnalystDetailModal } from "@/src/components/ai-assistants/AiAnalystDetailModal";
import { LeaseAnalystIcon } from "@/src/components/ai-assistants/LeaseAnalystIcon";
import { FinancialAnalystIcon } from "@/src/components/ai-assistants/FinancialAnalystIcon";
import { DebtAnalystIcon } from "@/src/components/ai-assistants/DebtAnalystIcon";

function AnalystCardIcon({
  card,
  className,
}: {
  card: AiAssistantCard;
  className?: string;
}) {
  if (card.id === "lease-analyst") {
    return <LeaseAnalystIcon className={cn("size-6 shrink-0", className)} />;
  }
  if (card.id === "reporting") {
    return <FinancialAnalystIcon className={cn("size-6 shrink-0", className)} />;
  }
  if (card.id === "esg") {
    return <DebtAnalystIcon className={cn("size-6 shrink-0", className)} />;
  }

  if (card.iconSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={card.iconSrc}
        alt=""
        width={24}
        height={24}
        className={cn("size-6 shrink-0", className)}
        aria-hidden
      />
    );
  }

  const Icon = card.icon;
  return (
    <Icon
      className={cn("size-6 shrink-0", card.iconClassName ?? "text-[#353638]", className)}
      strokeWidth={1.5}
      aria-hidden
    />
  );
}

function AnalystCard({
  card,
  onOpenDetails,
  onStart,
}: {
  card: AiAssistantCard;
  onOpenDetails: () => void;
  onStart: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpenDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetails();
        }
      }}
      className="flex min-h-[150px] min-w-0 flex-1 cursor-pointer flex-col gap-3.5 rounded-[12px] border border-[rgba(230,231,232,0.7)] bg-white p-4 text-left transition-shadow hover:shadow-[0px_2px_8px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <AnalystCardIcon card={card} className="size-5" />
              <h3 className="text-sm font-semibold leading-[1.25] text-[#1E1E1E]">
                {card.title}
              </h3>
            </div>
            <p className="text-[13px] font-normal leading-[1.4] text-[#65686B]">
              {card.description}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onStart();
          }}
          className="inline-flex h-7 shrink-0 items-center justify-center rounded-[32px] border border-[#B3B8BD] px-3 py-1 text-xs font-medium leading-[1.24] text-[#010309] transition-colors hover:bg-[#F0F2F5]"
        >
          Start
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="text-[11px] font-medium uppercase tracking-[1.2355px] text-[#65686B]">
          Ouput examples
        </p>
        <div className="flex flex-wrap gap-1.5">
          {card.outputExamples.map((pill) => (
            <span
              key={pill.label}
              className={cn(
                "rounded-[32px] px-2 py-1 text-[11px] font-medium leading-[1.5] text-[#353638]",
                pill.className,
              )}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto flex justify-end">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetails();
          }}
          className="h-7 text-xs font-medium leading-[1.24] text-[#010309] transition-colors hover:text-[#4F65E5]"
        >
          See more
        </button>
      </div>
    </article>
  );
}

/** "Start with AI Analysts" section on Ask Amiio — Figma 2451:121956 / 2797:63386. */
export function AskAiAnalystsSection({
  onStartChat,
}: {
  onStartChat?: (card: AiAssistantCard) => void;
}) {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState<AiAssistantCard | null>(null);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const primaryCards = AI_ASSISTANT_CARDS.filter((c) => c.id !== "service-charges");
  const extraCards = AI_ASSISTANT_CARDS.filter((c) => c.id === "service-charges");
  const visibleCards = showAll ? AI_ASSISTANT_CARDS : primaryCards;
  const hasMore = extraCards.length > 0;

  const openDetails = (card: AiAssistantCard) => {
    setActiveCard(card);
    setOpen(true);
  };

  const startChat = (card: AiAssistantCard) => {
    setOpen(false);
    if (card.id === "lease-analyst") {
      pinAiAssistant("lease-analyst");
      router.push("/ai-assistants/lease-analyst");
      return;
    }
    if (card.id === "reporting") {
      pinAiAssistant("financial");
      router.push(card.chatHref);
      return;
    }
    if (card.id === "esg") {
      pinAiAssistant("debt");
      router.push(card.chatHref);
      return;
    }
    onStartChat?.(card);
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex w-full flex-col items-center gap-1.5 text-center">
        <h2 className="typo-h4 text-[#353638]">
          Start with AI Analysts
        </h2>
        <p className="typo-p3-r text-[#65686B]">
          Choose a specialized analyst to help with commercial, financial, debt,
          technical, or portfolio performance.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {visibleCards.map((card) => (
          <AnalystCard
            key={card.id}
            card={card}
            onOpenDetails={() => openDetails(card)}
            onStart={() => startChat(card)}
          />
        ))}
      </div>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="text-sm font-medium leading-[1.24] text-[#010309] transition-opacity hover:opacity-70"
        >
          {showAll ? "See less" : "See more"}
        </button>
      ) : null}

      <AiAnalystDetailModal
        card={activeCard}
        open={open}
        onOpenChange={setOpen}
        onStartChat={startChat}
      />
    </div>
  );
}
