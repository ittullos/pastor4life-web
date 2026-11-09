"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, formatCompactNumber, type Granularity, type SeriesPoint } from "@/lib/stats";

type TimeSeriesChartProps = {
  title: string;
  data: SeriesPoint[];
  granularity: Granularity;
  color?: string;
  unit?: string;
  emptyMessage?: string;
};

function formatPeriodLabel(period: string, granularity: Granularity): string {
  if (granularity === "year") return period;
  if (granularity === "month") {
    const [y, m] = period.split("-");
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
  const [y, m, d] = period.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Single-series trend chart: 2px line, ~10% fill wash, hairline recessive
// gridlines, crosshair tooltip. A single series needs no legend box — the
// title names it (marks-and-anatomy.md).
export default function TimeSeriesChart({
  title,
  data,
  granularity,
  color = CHART_COLORS.seriesBlue,
  unit,
  emptyMessage = "No data in this range.",
}: TimeSeriesChartProps) {
  const chartData = data.map((p) => ({ ...p, label: formatPeriodLabel(p.period, granularity) }));

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-brand-navy">{title}</h3>
      {data.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-brand-navy/50">
          {emptyMessage}
        </div>
      ) : (
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="0" />
              <XAxis
                dataKey="label"
                tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                axisLine={{ stroke: CHART_COLORS.grid }}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(v: number) => formatCompactNumber(v)}
              />
              <Tooltip
                cursor={{ stroke: CHART_COLORS.grid, strokeWidth: 1 }}
                formatter={(value) => [
                  `${formatCompactNumber(typeof value === "number" ? value : Number(value))}${unit ? ` ${unit}` : ""}`,
                  title,
                ]}
                labelStyle={{ color: CHART_COLORS.ink, fontWeight: 600 }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid rgba(7,20,72,0.1)",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={color}
                fillOpacity={0.1}
                dot={false}
                activeDot={{ r: 4, stroke: CHART_COLORS.surface, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
