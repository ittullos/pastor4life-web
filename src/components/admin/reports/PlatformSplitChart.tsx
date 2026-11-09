"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, formatCompactNumber, type Granularity, type PlatformSplitPoint } from "@/lib/stats";

type PlatformSplitChartProps = {
  data: PlatformSplitPoint[];
  granularity: Granularity;
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

// Two-series categorical comparison (iOS/HealthKit vs Android/Health
// Connect) — a legend is mandatory at 2+ series (never color-matching
// alone), and both colors are validated as a pair (dataviz skill,
// color-formula.md): CVD ΔE 24.9, normal-vision ΔE 28.9 — comfortably
// clear of every floor.
export default function PlatformSplitChart({ data, granularity }: PlatformSplitChartProps) {
  const chartData = data.map((p) => ({ ...p, label: formatPeriodLabel(p.period, granularity) }));

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-brand-navy">Active Users by Platform</h3>
      {data.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-brand-navy/50">
          No data in this range.
        </div>
      ) : (
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
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
                width={36}
                tickFormatter={(v: number) => formatCompactNumber(v)}
              />
              <Tooltip
                cursor={{ fill: CHART_COLORS.grid }}
                labelStyle={{ color: CHART_COLORS.ink, fontWeight: 600 }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid rgba(7,20,72,0.1)",
                  fontSize: 12,
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: CHART_COLORS.muted }}
              />
              <Bar
                dataKey="healthkit"
                name="iOS (Apple Health)"
                fill={CHART_COLORS.seriesBlue}
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
              <Bar
                dataKey="health_connect"
                name="Android (Health Connect)"
                fill={CHART_COLORS.seriesOrange}
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
