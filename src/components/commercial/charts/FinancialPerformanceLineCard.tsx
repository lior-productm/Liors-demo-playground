"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { AMIIO_CHART_MOTION } from "@/src/lib/chartMotion";

type Point = { label: string; value: number };

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-[11px] font-semibold shadow-sm">
      <div className="text-muted-foreground uppercase tracking-wider text-[9px]">
        {p?.payload?.label}
      </div>
      <div className="mt-1">
        ${p?.value?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        <span className="text-muted-foreground font-bold"> NOI</span>
      </div>
    </div>
  );
};

export function FinancialPerformanceLineCard({
  title,
  points,
}: {
  title: string;
  points: Point[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">Financial Performance</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold text-muted-foreground">Trend</div>
          <div className="text-sm font-bold text-accent">+3.2%</div>
        </div>
      </div>

      <div className="mt-3 h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 10, right: 10, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#E6E8EB" vertical={false} />
            <defs>
              <linearGradient id="amiioArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={34}
              domain={["dataMin - 100000", "dataMax + 100000"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              {...AMIIO_CHART_MOTION}
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="url(#amiioArea)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              {...AMIIO_CHART_MOTION}
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

