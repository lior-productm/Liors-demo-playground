"use client";

import { TrendPill } from "@/src/components/commercial/TrendPill";

function MiniDonut({ valuePct, tone }: { valuePct: number; tone: "primary" | "muted" }) {
  const r = 12;
  const c = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(100, valuePct));
  const dash = (filled / 100) * c;
  const rest = c - dash;

  const stroke = tone === "primary" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))";
  const track = "hsl(var(--secondary))";

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
      <g transform="translate(20 20)">
        <circle r={r} cx="0" cy="0" fill="transparent" stroke={track} strokeWidth="6" />
        <circle
          r={r}
          cx="0"
          cy="0"
          fill="transparent"
          stroke={stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${rest}`}
          transform="rotate(-90)"
        />
      </g>
    </svg>
  );
}

export function KpiStripWithMiniMetrics() {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            WAULT
          </div>
          <div className="mt-1 flex items-end justify-between">
            <div className="text-[16px] font-extrabold text-foreground">4.2 years</div>
            <TrendPill direction="up" pct="+0.3%" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Occupancy Rate
              </div>
              <div className="mt-1 text-[16px] font-extrabold text-foreground">99.5%</div>
              <div className="mt-0.5 text-[10px] font-semibold text-accent">
                +1.2% <span className="text-muted-foreground">vs previous year</span>
              </div>
            </div>
            <MiniDonut valuePct={99.5} tone="primary" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Vacancy Rate
              </div>
              <div className="mt-1 text-[16px] font-extrabold text-foreground">0.5%</div>
              <div className="mt-0.5 text-[10px] font-semibold text-destructive">
                -0.3% <span className="text-muted-foreground">vs previous year</span>
              </div>
            </div>
            <MiniDonut valuePct={0.5} tone="muted" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { k: "Tenant Retention Rate", v: "80%", delta: "-2.4%", down: true },
          { k: "NOI Absorption", v: "-0.9%", delta: "-0.8%", down: true },
          { k: "Average rent per sqm", v: "€239", delta: "+3.4%", down: false },
          { k: "Total GFA", v: "€34,703", delta: "+2.1%", down: false },
          { k: "IRR", v: "3%", delta: "+0.2%", down: false },
        ].map((m) => (
          <div key={m.k} className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {m.k}
            </div>
            <div className="mt-1 text-[14px] font-extrabold text-foreground">{m.v}</div>
            <div className={`mt-1 text-[10px] font-semibold ${m.down ? "text-destructive" : "text-accent"}`}>
              {m.delta} <span className="text-muted-foreground">vs previous year</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

