"use client";

import { Badge } from "@/components/ui/badge";

export function ValuationAndCapexSection() {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <div className="text-[12px] font-extrabold text-foreground">Indicative Valuation</div>

      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <div className="rounded-lg border border-border bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-extrabold text-foreground">CAP RATE</div>
            <Badge variant="secondary" className="h-5 px-2 text-[10px] font-bold">
              INDICATIVE
            </Badge>
          </div>

          <div className="mt-4 space-y-3">
            <Row label="Indicative Value" value="€47,225,000" />
            <Row label="NOI" value="€3,036,050" />
            <Row label="Current Valuation" value="€44,110,000" />
          </div>

          <div className="mt-4 rounded-md border border-border bg-card px-3 py-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-muted-foreground">VARIANCE</span>
              <span className="font-extrabold text-accent">+€3,115,000</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {[
              ["SCENARIOS", ""],
              ["Base Case", "€47,225,000"],
              ["Downside", "€45,720,000"],
              ["Aggressive", "€48,610,000"],
            ].map(([k, v], idx) => (
              <div key={k} className="flex items-center justify-between text-[11px]">
                <span className={idx === 0 ? "text-[10px] font-bold uppercase tracking-wider text-muted-foreground" : "font-semibold text-muted-foreground"}>
                  {k}
                </span>
                <span className="font-semibold text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-extrabold text-foreground">CAPEX 2026</div>
            <Badge variant="secondary" className="h-5 px-2 text-[10px] font-bold">
              Remaining €171,210
            </Badge>
          </div>

          <div className="mt-4 space-y-3">
            {[
              ["BY CATEGORY", ""],
              ["Maintenance", "€52,700", "APPROVED"],
              ["Sustainability", "€68,400", "PENDING"],
              ["TOP-10 Projects", "", ""],
            ].map((r, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-[11px]">
                <span className={idx in { 0: 1, 3: 1 } ? "text-[10px] font-bold uppercase tracking-wider text-muted-foreground" : "font-semibold text-muted-foreground"}>
                  {r[0]}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  {r[1] ? <span className="font-semibold text-foreground">{r[1]}</span> : null}
                  {r[2] ? (
                    <Badge
                      variant={r[2] === "APPROVED" ? "default" : "secondary"}
                      className="h-5 px-2 text-[9px] font-bold"
                    >
                      {r[2]}
                    </Badge>
                  ) : null}
                </div>
              </div>
            ))}

            <div className="rounded-md border border-border bg-card px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Elevator modernization
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-muted-foreground">Budget</span>
                <span className="font-semibold text-foreground">€110,000</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-muted-foreground">Spent</span>
                <span className="font-semibold text-foreground">€68,300</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

