"use client";

import { ChevronUp, MapPin } from "lucide-react";
import { InvestmentSummaryPhoto } from "@/src/components/commercial/overview/InvestmentSummaryPhoto";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-[#010309] px-2.5 text-[10px] font-bold text-[#F0F2F5]">
      {children}
    </span>
  );
}

export function InvestmentSummaryCard() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 px-5 py-4">
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
        <div className="text-[12px] font-extrabold text-foreground">
          Investment Summary
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="grid min-w-0 grid-cols-[220px_minmax(0,1fr)] items-start gap-3 overflow-hidden md:gap-4">
          <div className="flex w-[220px] max-w-[220px] shrink-0 flex-col gap-1.5">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-secondary">
              <InvestmentSummaryPhoto
                containerClassName="h-full w-full"
                className="h-full w-full rounded-lg object-cover"
                alt="H.J.E. Wenckebachweg 123"
              />
            </div>
            <div className="flex min-w-0 items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 break-words text-[12px] font-semibold text-foreground">
                H.J.E. Wenckebachweg 123 / Amsterdam
              </div>
            </div>
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-3 gap-y-3 md:grid-cols-4 md:gap-x-4">
            <InfoCol
              title="KEY INFO"
              rows={[
                ["Property code", "p1000071"],
                ["SPV", "Wenckebachweg Amsterdam B.V."],
                ["Valuation", "€26.870.544"],
                ["Asset Manager", "Daniel Meyer"],
                ["Energy Label", <Pill key="el">A</Pill>],
              ]}
            />
            <InfoCol
              title="CLASSIFICATION"
              rows={[
                ["Asset Use", "Office"],
                ["Type", "Core+"],
                ["Tenure", "Freehold"],
                ["Tenant Type", "Multi tenant"],
              ]}
            />
            <InfoCol
              title="CHARACTERISTICS"
              rows={[
                ["Condition", <Pill key="cond">B (Good)</Pill>],
                ["Location", <Pill key="loc">A (Excellent)</Pill>],
                ["Year Built", "2001"],
                ["Floors", "4"],
              ]}
            />
            <InfoCol
              title="AREAS"
              rows={[
                ["Plot Size", "10.757 sqm"],
                ["GFA", "€14,423.25"],
                ["LFA", "13,170.2"],
                [
                  "Vacancy",
                  <div key="vac" className="flex items-center gap-2">
                    <VacancyRing pct={9.3} />
                    <span className="text-[12px] font-semibold text-foreground">9,3%</span>
                  </div>,
                ],
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCol({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, React.ReactNode]>;
}) {
  return (
    <div>
      <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="mt-2 space-y-2">
        {rows.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <div className="text-[10px] font-semibold text-muted-foreground">
              {k}
            </div>
            <div className="mt-0.5 text-[12px] font-semibold text-foreground">
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VacancyRing({ pct }: { pct: number }) {
  const r = 10;
  const c = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(100, pct));
  const dash = (filled / 100) * c;
  const rest = c - dash;
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" className="shrink-0">
      <g transform="translate(13 13)">
        <circle r={r} cx="0" cy="0" fill="transparent" stroke="hsl(var(--secondary))" strokeWidth="3.5" />
        <circle
          r={r}
          cx="0"
          cy="0"
          fill="transparent"
          stroke="hsl(var(--primary))"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${rest}`}
          transform="rotate(-90)"
        />
      </g>
    </svg>
  );
}
