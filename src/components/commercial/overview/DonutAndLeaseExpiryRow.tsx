"use client";

function Donut() {
  const r = 46;
  const c = 2 * Math.PI * r;
  const segments = [
    { pct: 35, color: "hsl(var(--primary))" },
    { pct: 25, color: "hsl(var(--chart-2))" },
    { pct: 20, color: "hsl(var(--chart-3))" },
    { pct: 20, color: "hsl(var(--muted-foreground))" },
  ];

  let offset = 0;
  return (
    <svg width="170" height="170" viewBox="0 0 170 170">
      <g transform="translate(85 85) rotate(-90)">
        <circle r={r} cx="0" cy="0" fill="transparent" stroke="hsl(var(--secondary))" strokeWidth="18" />
        {segments.map((s, idx) => {
          const dash = (s.pct / 100) * c;
          const seg = (
            <circle
              key={idx}
              r={r}
              cx="0"
              cy="0"
              fill="transparent"
              stroke={s.color}
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash + 2; // tiny gap
          return seg;
        })}
      </g>
    </svg>
  );
}

function IconDots() {
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <span className="h-1 w-1 rounded-full bg-muted-foreground/70" />
      <span className="h-1 w-1 rounded-full bg-muted-foreground/70" />
      <span className="h-1 w-1 rounded-full bg-muted-foreground/70" />
    </div>
  );
}

export function DonutAndLeaseExpiryRow() {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      <div className="rounded-xl border border-border bg-card px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-extrabold text-foreground">IRR (%) of Total</div>
          <IconDots />
        </div>
        <div className="mt-3 grid grid-cols-[190px_1fr] items-center gap-4">
          <div className="flex items-center justify-center">
            <Donut />
          </div>
          <div className="space-y-2">
            {[
              { k: "Scotland", v: "35%", c: "bg-primary" },
              { k: "Waaier Nederland", v: "25%", c: "bg-chart-2" },
              { k: "Equity BV", v: "20%", c: "bg-chart-3" },
              { k: "Luxembourg", v: "20%", c: "bg-muted-foreground" },
            ].map((x) => (
              <div key={x.k} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${x.c}`} />
                  <span className="text-[11px] font-semibold text-muted-foreground">{x.k}</span>
                </div>
                <span className="text-[11px] font-extrabold text-foreground">{x.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-extrabold text-foreground">Lease Expiry</div>
          <IconDots />
        </div>
        <div className="mt-4 grid grid-cols-6 items-end gap-3 h-[170px] px-2">
          {[
            { year: "2024", h: 38 },
            { year: "2025", h: 92 },
            { year: "2026", h: 120 },
            { year: "2027", h: 86 },
            { year: "2028", h: 58 },
            { year: "2029", h: 44 },
          ].map((b) => (
            <div key={b.year} className="flex flex-col items-center justify-end gap-2">
              <div className="w-7 rounded-md bg-muted" style={{ height: `${b.h}px` }} />
              <div className="text-[10px] font-semibold text-muted-foreground">{b.year}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

