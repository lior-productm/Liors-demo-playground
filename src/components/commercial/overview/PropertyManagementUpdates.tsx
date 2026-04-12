"use client";

import { Badge } from "@/components/ui/badge";

export function PropertyManagementUpdates() {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <div className="text-[12px] font-extrabold text-foreground">Property Management Updates</div>

      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <div className="rounded-lg border border-border bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-extrabold text-foreground">Service Requests</div>
            <Badge variant="secondary" className="h-5 px-2 text-[10px] font-bold">
              +5.2%
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Metric label="Requests this month" value="12" />
            <Metric label="Portfolios average" value="16" />
          </div>

          <div className="mt-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Status Breakdown
            </div>
            <div className="mt-2 space-y-2">
              {[
                ["HVAC", "3", "bg-primary/15 text-primary"],
                ["Electric", "2", "bg-chart-2/15 text-chart-2"],
                ["Plumbing", "4", "bg-warning/15 text-warning"],
                ["General Maintenance", "3", "bg-secondary text-muted-foreground"],
              ].map(([k, v, cls]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground">{k}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${cls}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-extrabold text-foreground">Sentiment Score</div>
            <Badge variant="secondary" className="h-5 px-2 text-[10px] font-bold">
              +7.0%
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Metric label="Score" value="8.2" />
            <Metric label="Based on" value="156 emails analysed" />
          </div>

          <div className="mt-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Sentiment Breakdown
            </div>
            <div className="mt-2 space-y-2">
              {[
                ["Positive", "65%", "hsl(var(--accent))"],
                ["Neutral", "27%", "hsl(var(--primary))"],
                ["Negative", "8%", "hsl(var(--destructive))"],
              ].map(([k, v, color]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground">{k}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-foreground">{v}</span>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: color as string }} />
                  </div>
                </div>
              ))}
              <div className="pt-1 text-[10px] font-semibold text-muted-foreground">
                <span className="font-bold">0</span> angry and/or tense communications
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-[14px] font-extrabold text-foreground">{value}</div>
    </div>
  );
}

