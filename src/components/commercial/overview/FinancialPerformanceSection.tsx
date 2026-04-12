"use client";

export function FinancialPerformanceSection() {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <div className="text-[12px] font-extrabold text-foreground">Financial Performance</div>

      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <div className="rounded-lg border border-border bg-background px-4 py-3">
          <div className="text-[11px] font-extrabold text-foreground">Historical Performance</div>
          <div className="mt-3 min-w-0 overflow-x-auto rounded-md border border-border">
            <div
              className="grid w-full min-w-[26rem] grid-cols-[minmax(4.5rem,18%)_repeat(5,minmax(3.25rem,1fr))] bg-card text-[11px] tabular-nums sm:text-[12px]"
              role="table"
              aria-label="Historical performance"
            >
              <div className="border-b border-border px-2 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:px-3">
                Metric
              </div>
              <div className="border-b border-border px-1.5 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:px-2">
                Q4 &apos;15
              </div>
              <div className="border-b border-border px-1.5 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:px-2">
                Nov &apos;15
              </div>
              <div className="border-b border-border px-1.5 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:px-2">
                Dec &apos;14
              </div>
              <div className="border-b border-border px-1.5 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:px-2">
                Dec &apos;13
              </div>
              <div className="border-b border-border px-1.5 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:px-2">
                Dec &apos;12
              </div>
              {[
                ["NOI", "€3,036,050", "€2,963,640", "€2,923,250", "€2,862,110", "€2,801,320"],
                ["Occupancy", "99.5%", "100%", "100%", "100%", "100%"],
                ["Interest", "3.5%", "3.3%", "3.3%", "3.6%", "3.8%"],
                ["WAULT", "4.2 yr", "4.4 yr", "4.6 yr", "4.9 yr", "5.1 yr"],
              ].map((row) => (
                <div key={row[0]} className="contents" role="row">
                  <div className="border-t border-border px-2 py-2 font-semibold text-foreground sm:px-3 sm:py-2.5">
                    {row[0]}
                  </div>
                  <div className="border-t border-border px-1.5 py-2 text-right font-semibold text-muted-foreground sm:px-2 sm:py-2.5">
                    {row[1]}
                  </div>
                  <div className="border-t border-border px-1.5 py-2 text-right font-semibold text-muted-foreground sm:px-2 sm:py-2.5">
                    {row[2]}
                  </div>
                  <div className="border-t border-border px-1.5 py-2 text-right font-semibold text-muted-foreground sm:px-2 sm:py-2.5">
                    {row[3]}
                  </div>
                  <div className="border-t border-border px-1.5 py-2 text-right font-semibold text-muted-foreground sm:px-2 sm:py-2.5">
                    {row[4]}
                  </div>
                  <div className="border-t border-border px-1.5 py-2 text-right font-semibold text-muted-foreground sm:px-2 sm:py-2.5">
                    {row[5]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-extrabold text-foreground">Performance vs budget</div>
            <div className="text-[10px] font-semibold text-muted-foreground">2026</div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              ["Income", 92, "€1,275K"],
              ["NOI", 74, "€1,044K"],
              ["OPEX", 58, "€812K"],
              ["Debt", 66, "€935K"],
              ["CAPEX", 41, "€575K"],
            ].map(([label, pct, val]) => (
              <div key={label as string} className="grid grid-cols-[90px_1fr_70px] items-center gap-3">
                <div className="text-[11px] font-semibold text-muted-foreground">{label}</div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-right text-[10px] font-semibold text-muted-foreground">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

