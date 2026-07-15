"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiAssistantCard } from "@/src/lib/aiAssistantsData";
import { pinAiAssistant } from "@/src/lib/aiAssistantNavState";

function ChatButton() {
  return (
    <span className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-[32px] border border-[#B3B8BD] px-3 py-1.5 text-sm font-medium leading-[1.24] text-[#010309] transition-colors hover:bg-[#F0F2F5]">
      Chat
      <ArrowRight className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
    </span>
  );
}

export function AiAssistantCardView({
  card,
  onChatClick,
}: {
  card: AiAssistantCard;
  onChatClick?: () => void;
}) {
  const Icon = card.icon;

  const chatControl =
    card.id === "lease-analyst" ? (
      <Link
        href={card.chatHref}
        onClick={() => {
          pinAiAssistant("lease-analyst");
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
              <Icon
                className={cn("size-6 shrink-0", card.iconClassName ?? "text-[#353638]")}
                strokeWidth={1.5}
                aria-hidden
              />
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
