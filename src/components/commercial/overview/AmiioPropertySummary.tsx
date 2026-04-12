"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { AmiioSummaryTypewriterText } from "@/src/components/commercial/AmiioSummaryTypewriter";

type SummaryItem = {
  id: string;
  text: string;
  time: string;
};

const items: SummaryItem[] = [
  {
    id: "s1",
    text:
      "Occupancy improved by 2.3% since last visit, driven by new lease signed with Tech Solutions B.V. for 850 sqm on the 3rd floor.",
    time: "2 days ago",
  },
  {
    id: "s2",
    text:
      "WAULT decreased from 4.8 to 4.2 years due to approaching lease expiry of Logistics Plus (Q2 2026). Renewal discussions should be initiated.",
    time: "5 days ago",
  },
  {
    id: "s3",
    text:
      "CAPEX execution at 68% of budget. Elevator modernization project on track for Q1 2026 completion.",
    time: "1 week ago",
  },
];

export function AmiioPropertySummary() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <AmiioAiDisclaimerTrigger wrapChild wrapperClassName="shrink-0">
            <Sparkles className="h-5 w-5 shrink-0 text-[#010309]" aria-hidden />
          </AmiioAiDisclaimerTrigger>
          <div className="text-[12px] font-extrabold text-foreground">
            Amiio&apos;s Property Summary
          </div>
        </div>
        <Button variant="ghost" className="h-8 px-2 text-[11px] font-bold text-muted-foreground">
          View all <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-4 pb-4">
        {items.map((it, index) => (
          <div
            key={it.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 mb-2"
          >
            <AmiioAiDisclaimerTrigger
              wrapChild
              wrapperClassName="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card"
            >
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </AmiioAiDisclaimerTrigger>
            <div className="min-w-0 flex-1">
              <AmiioSummaryTypewriterText
                text={it.text}
                className="text-[11px] font-semibold text-foreground"
                charDelayMs={7}
                startDelayMs={index * 220}
              />
            </div>
            <div className="shrink-0 text-[10px] font-semibold text-muted-foreground">
              {it.time}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 rounded-md px-3 text-[10px] font-bold"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("amiio:toast", { detail: { message: "Analyse further" } }),
                )
              }
            >
              Analyse further
            </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

