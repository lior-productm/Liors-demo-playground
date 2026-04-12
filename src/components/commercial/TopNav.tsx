"use client";

import { useMemo } from "react";
import { CircleHelp, Sparkles } from "lucide-react";
import type { TopNavTabId } from "@/src/types/commercial";
import { AMIIO_DEMO_ACTIVE_REPORTS_URL } from "@/src/lib/topNavNavigation";
import { cn } from "@/lib/utils";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";

export function TopNav({
  activeTab,
  onTabChange,
}: {
  activeTab: TopNavTabId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const tabs = useMemo(
    () =>
      [
        { id: "amiio" as const, label: "Insights" },
        { id: "finance" as const, label: "Financial" },
        { id: "commercial" as const, label: "Commercial" },
        { id: "browser" as const, label: "Browser" },
        { id: "reporting" as const, label: "Reporting" },
      ] as const,
    [],
  );

  return (
    <div
      className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[rgba(230,231,232,0.7)] px-8"
      style={{ backgroundColor: "var(--Secondary-Sea-Salt)" }}
    >
      <div className="flex min-w-0 items-center gap-8">
        <img src="/amiio-logo.png" alt="Amiio" className="h-[40px]" />

        <nav className="flex items-center gap-2">
          {tabs.map((t) => {
            const isActive = t.id === activeTab;
            const tabClass = cn(
              "relative inline-flex h-[72px] items-center rounded-sm px-4 typo-l2-b transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C2C2C]/25 focus-visible:ring-offset-2",
              isActive
                ? "text-[#2C2C2C]"
                : "text-[#7E8185] hover:text-[#353638]",
            );
            if (t.id === "reporting") {
              return (
                <a
                  key={t.id}
                  href={AMIIO_DEMO_ACTIVE_REPORTS_URL}
                  className={tabClass}
                  aria-current={isActive ? "page" : undefined}
                >
                  {t.label}
                  {isActive ? (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2C2C2C]" />
                  ) : null}
                </a>
              );
            }
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange(t.id)}
                className={tabClass}
              >
                {t.label}
                {isActive ? (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2C2C2C]" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(230,231,232,0.7)] bg-white text-[#7E8185] hover:bg-[#F2F4F7] hover:text-[#353638]"
          aria-label="Help"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("amiio:toast", {
                detail: { message: "Help opened" },
              }),
            )
          }
        >
          <CircleHelp className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F4F7] typo-l3-b text-[#353638]">
            MJ
          </div>
          <div className="flex items-center gap-2 typo-l3-b text-[#7E8185]">
            <AmiioAiDisclaimerTrigger wrapChild>
              <Sparkles className="h-4 w-4 text-[#010309]" />
            </AmiioAiDisclaimerTrigger>
            <span>Property Partners</span>
          </div>
        </div>
      </div>
    </div>
  );
}
