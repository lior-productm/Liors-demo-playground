"use client";

export function ServiceChargesRow() {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <div className="text-[12px] font-extrabold text-foreground">Service Charges</div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Average Payment" value="€680,500" delta="+2.4%" tone="accent" />
        <Metric label="Actual Expenses" value="€647,230" delta="-0.8%" tone="destructive" />
        <Metric label="Balance" value="-€45,180" delta="+1.1%" tone="accent" />
        <Metric label="Budget Variance" value="-5.1%" delta="-0.2%" tone="destructive" />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "accent" | "destructive";
}) {
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-[14px] font-extrabold text-foreground">{value}</div>
      <div className={`mt-1 text-[10px] font-semibold ${tone === "accent" ? "text-accent" : "text-destructive"}`}>
        {delta} <span className="text-muted-foreground">vs last period</span>
      </div>
    </div>
  );
}

