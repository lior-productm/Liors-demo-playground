"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, CircleHelp, Globe, Search, Sparkles } from "lucide-react";
import type { TopNavTabId } from "@/src/types/commercial";
import { AMIIO_DEMO_ACTIVE_REPORTS_URL } from "@/src/lib/topNavNavigation";
import { cn } from "@/lib/utils";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const REGION_OPTIONS: { code: string; name: string }[] = [
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "IE", name: "Ireland" },
  { code: "LU", name: "Luxembourg" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "PL", name: "Poland" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "SE", name: "Sweden" },
  { code: "DK", name: "Denmark" },
  { code: "US", name: "United States" },
];

export function TopNav({
  activeTab,
  onTabChange,
}: {
  activeTab: TopNavTabId;
  onTabChange: (tab: TopNavTabId) => void;
}) {
  const [regionOpen, setRegionOpen] = useState(false);
  const [regionCode, setRegionCode] = useState("NL");
  const [regionQuery, setRegionQuery] = useState("");
  const regionSearchRef = useRef<HTMLInputElement>(null);

  const filteredRegions = useMemo(() => {
    const q = regionQuery.trim().toLowerCase();
    if (!q) return REGION_OPTIONS;
    return REGION_OPTIONS.filter(
      (r) =>
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q),
    );
  }, [regionQuery]);

  useEffect(() => {
    if (!regionOpen) return;
    const id = requestAnimationFrame(() => regionSearchRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [regionOpen]);

  const tabs = useMemo(
    () =>
      [
        { id: "amiio" as const, label: "Insights" },
        { id: "finance" as const, label: "Financial" },
        { id: "commercial" as const, label: "Commercial" },
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
        <Popover
          open={regionOpen}
          onOpenChange={(open) => {
            setRegionOpen(open);
            if (!open) setRegionQuery("");
          }}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex h-7 items-center gap-1 rounded-full border border-[rgba(230,231,232,0.7)] bg-white px-2.5 text-[#353638] transition-colors hover:bg-[#F2F4F7]",
                regionOpen && "ring-2 ring-[#2C2C2C]/15",
              )}
              aria-expanded={regionOpen}
              aria-haspopup="dialog"
              aria-label={`Region: ${regionCode}. Open menu`}
            >
              <Globe
                className="h-3.5 w-3.5 shrink-0 text-[#7E8185]"
                aria-hidden
              />
              <span className="text-[11px] font-semibold leading-none tracking-wide">
                {regionCode}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-[min(100vw-2rem,280px)] border-[rgba(230,231,232,0.9)] bg-white p-3 shadow-lg"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[#7E8185]">
              Region
            </p>
            <div className="relative mb-2">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7E8185]"
                aria-hidden
              />
              <Input
                ref={regionSearchRef}
                type="search"
                autoComplete="off"
                placeholder="Search region…"
                value={regionQuery}
                onChange={(e) => setRegionQuery(e.target.value)}
                className="h-8 border-[rgba(230,231,232,0.9)] bg-[rgba(255,255,255,0.95)] pl-8 text-[13px] text-[#353638] placeholder:text-[#7E8185] focus-visible:ring-[#2C2C2C]/20"
              />
            </div>
            <div
              className="max-h-[220px] overflow-y-auto rounded-md border border-[rgba(230,231,232,0.6)] bg-[rgba(250,251,252,0.6)]"
              role="listbox"
              aria-label="Regions"
            >
              {filteredRegions.length === 0 ? (
                <div className="px-3 py-6 text-center typo-p3-r text-[#7E8185]">
                  No regions match your search
                </div>
              ) : (
                filteredRegions.map((r) => {
                  const selected = r.code === regionCode;
                  return (
                    <button
                      key={r.code}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 border-b border-[rgba(230,231,232,0.5)] px-3 py-2 text-left text-[13px] last:border-b-0 hover:bg-white",
                        selected && "bg-white",
                      )}
                      onClick={() => {
                        setRegionCode(r.code);
                        setRegionOpen(false);
                        setRegionQuery("");
                      }}
                    >
                      <span className="min-w-0 flex-1 text-[#353638]">
                        {r.name}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#7E8185]">
                          {r.code}
                        </span>
                        {selected ? (
                          <Check className="h-3.5 w-3.5 text-[#010309]" />
                        ) : null}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>

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
