"use client";

import { TrendPill } from "@/src/components/commercial/TrendPill";

function MiniDonut({ valuePct, tone }: { valuePct: number; tone: "primary" | "accent" }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(100, valuePct));
  const dash = (filled / 100) * c;
  const rest = c - dash;

  const stroke = tone === "primary" ? "hsl(var(--primary))" : "hsl(var(--accent))";
  const track = "hsl(var(--secondary))";

  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      <g transform="translate(22 22)">
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

export function MiniKpiStrip() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-card px-4 py-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          WAULT
        </div>
        <div className="mt-1 flex items-end justify-between">
          <div className="text-lg font-extrabold text-foreground">4.2 years</div>
          <TrendPill direction="up" pct="+0.3%" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Occupancy rate
            </div>
            <div className="mt-1 text-lg font-extrabold text-foreground">99.5%</div>
            <div className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
              +1.2% vs previous year
            </div>
          </div>
          <MiniDonut valuePct={99.5} tone="primary" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Vacancy rate
            </div>
            <div className="mt-1 text-lg font-extrabold text-foreground">0.5%</div>
            <div className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
              -0.3% vs previous year
            </div>
          </div>
          <MiniDonut valuePct={0.5} tone="accent" />
        </div>
      </div>
    </div>
  );
}

