"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";
import { AMIIO_CHART_MOTION } from "@/src/lib/chartMotion";

type MonthPoint = { month: string; value: number; color: "chart-1" | "chart-2" | "chart-3" | "accent" };

const colorToHsl = (c: MonthPoint["color"]) => {
  switch (c) {
    case "accent":
      return "hsl(var(--accent))";
    case "chart-1":
      return "hsl(var(--chart-1))";
    case "chart-2":
      return "hsl(var(--chart-2))";
    case "chart-3":
      return "hsl(var(--chart-3))";
    default:
      return "hsl(var(--chart-1))";
  }
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-[11px] font-semibold shadow-sm">
      <div className="text-muted-foreground uppercase tracking-wider text-[9px]">
        {p?.payload?.month}
      </div>
      <div className="mt-1">{p?.value?.toLocaleString()} sqm</div>
    </div>
  );
};

export function LeaseExpiryBarCard({
  title,
  total,
  data,
}: {
  title: string;
  total: string;
  data: MonthPoint[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">{total}</div>
        </div>
        <div className="rounded-full bg-primary/5 px-3 py-1 text-[10px] font-bold text-primary">
          Next 12 months
        </div>
      </div>

      <div className="mt-3 h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 10, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#E6E8EB" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={28}
              domain={[0, "dataMax"]}
              allowDecimals={false}
            />
            <Bar {...AMIIO_CHART_MOTION} dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.month} fill={colorToHsl(d.color)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

