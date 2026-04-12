"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { AMIIO_CHART_MOTION } from "@/src/lib/chartMotion";

type Slice = {
  name: string;
  value: number;
  color: "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5" | "accent" | "primary" | "destructive";
};

const colorToHsl = (c: Slice["color"]) => {
  // These are the exact HSL token variables defined by the theme.
  switch (c) {
    case "accent":
      return "hsl(var(--accent))";
    case "primary":
      return "hsl(var(--primary))";
    case "destructive":
      return "hsl(var(--destructive))";
    case "chart-1":
      return "hsl(var(--chart-1))";
    case "chart-2":
      return "hsl(var(--chart-2))";
    case "chart-3":
      return "hsl(var(--chart-3))";
    case "chart-4":
      return "hsl(var(--chart-4))";
    case "chart-5":
      return "hsl(var(--chart-5))";
    default:
      return "hsl(var(--chart-1))";
  }
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const name = p?.name as string;
  const val = p?.value as number;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-[11px] font-semibold text-foreground shadow-sm">
      <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
        {name}
      </div>
      <div className="mt-1">{val.toFixed(1)}%</div>
    </div>
  );
};

export function OccupancyDonutCard({
  title,
  value,
  filledValuePct,
}: {
  title: string;
  value: string;
  filledValuePct: number; // 0-100
}) {
  const data: Slice[] = [
    { name: "Occupied", value: filledValuePct, color: "primary" },
    { name: "Vacant", value: Math.max(0, 100 - filledValuePct), color: "chart-5" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">{value}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] font-semibold text-muted-foreground">
            Health score
          </div>
          <div className="text-sm font-bold text-accent">A-</div>
        </div>
      </div>

      <div className="mt-3 h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              {...AMIIO_CHART_MOTION}
              data={data}
              dataKey="value"
              innerRadius={48}
              outerRadius={64}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((s) => (
                <Cell
                  key={s.name}
                  fill={colorToHsl(s.color)}
                  className="transition-opacity duration-200"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="font-semibold text-foreground">Occupied</span>
          <span className="text-muted-foreground">{filledValuePct.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-chart-5" />
          <span className="font-semibold text-foreground">Vacant</span>
          <span className="text-muted-foreground">
            {(100 - filledValuePct).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

