"use client";

import { ChevronUp, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr]">
          <div className="min-w-0">
            <div className="relative h-[150px] w-full overflow-hidden rounded-lg border border-border bg-secondary">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.10),rgba(255,255,255,0.0),rgba(16,185,129,0.10))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.18),transparent_50%)]" />
            </div>
            <div className="mt-3">
              <div className="text-[12px] font-extrabold text-foreground">
                H.J.E. Wenckebachweg 123
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Amsterdam
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <InfoCol
              title="KEY INFO"
              rows={[
                ["SPV", "Wenckebachweg Amsterdam BV"],
                ["Valuation", "€47,225,000"],
                ["Asset Manager", "Sandra van Holland"],
                ["Energy Label", <Badge key="el" className="h-5 px-2 text-[10px] font-bold">A</Badge>],
              ]}
            />
            <InfoCol
              title="CLASSIFICATION"
              rows={[
                ["Asset Use", "Office"],
                ["Type", "Core+"],
                ["Tenure", "Freehold"],
                ["Tenant Type", "Multi"],
              ]}
            />
            <InfoCol
              title="CHARACTERISTICS"
              rows={[
                ["Condition", <Pill key="cond">B (Good)</Pill>],
                ["Location", <Pill key="loc">A (Excellent)</Pill>],
                ["Year Built", "2000"],
                ["Floors", "4"],
              ]}
            />
            <InfoCol
              title="KEY INFO"
              rows={[
                ["Plot Size", "10,757"],
                ["GFA", "€14,423.25"],
                ["LFA", "13,170.2"],
                [
                  "Vacancy",
                  <div key="vac" className="flex items-center gap-2">
                    <VacancyRing pct={0} />
                    <span className="text-[12px] font-extrabold text-foreground">0%</span>
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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-foreground px-2.5 text-[10px] font-bold text-background">
      {children}
    </span>
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
      <div className="mt-3 space-y-3">
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

