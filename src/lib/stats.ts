// Types, brand chart palette, and small helpers for the admin reports
// dashboard. Colors are stepped from the site's brand tokens
// (globals.css) specifically for use as chart data marks -- the raw
// brand hexes (navy/lime/peach/gold) were picked for UI chrome, not
// chart marks on white, and fail the data-viz palette validator's
// lightness/chroma/contrast checks at full strength. These steps (same
// hue, adjusted lightness/chroma) pass all six checks -- see the PR
// description for the validator output.
export const CHART_COLORS = {
  seriesBlue: "#4c6cc3", // stepped from brand-navy — headline metrics (signups, active users)
  seriesOrange: "#c76a00", // stepped from brand-peach — platform split (Android), secondary accent
  seriesGold: "#af8b00", // stepped from brand-gold — mileage/steps volume
  statusGood: "#007b41", // stepped from brand-success — positive deltas
  statusBad: "#d32f2f", // brand-error as-is — negative deltas, account deletions
  ink: "#071448", // brand-navy — axis/label text
  muted: "rgba(7,20,72,0.6)", // secondary text
  grid: "rgba(7,20,72,0.12)", // hairline gridlines
  surface: "#ffffff",
} as const;

export type Granularity = "day" | "month" | "year";

export type StatsRange = { start_date: string; end_date: string; granularity: Granularity };
export type KpiValue = { value: number; previous: number };
export type SeriesPoint = { period: string; value: number };
export type PlatformSplitPoint = { period: string; healthkit: number; health_connect: number };

export type StatsReport = {
  range: StatsRange;
  kpis: {
    total_users: KpiValue;
    new_signups: KpiValue;
    active_users: KpiValue;
    total_miles: KpiValue;
  };
  series: {
    new_signups: SeriesPoint[];
    active_users: SeriesPoint[];
    total_miles: SeriesPoint[];
    account_deletions: SeriesPoint[];
    platform_split: PlatformSplitPoint[];
  };
  goal_progress: {
    users_completed_goal_pct: number | null;
    avg_miles_per_active_user: number;
  };
};

export function formatCompactNumber(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (abs >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toLocaleString();
}

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export function presetRange(
  preset: "7d" | "30d" | "90d" | "month" | "year",
): { startDate: string; endDate: string } {
  const today = new Date();
  const end = isoDate(today);

  switch (preset) {
    case "7d": {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return { startDate: isoDate(start), endDate: end };
    }
    case "30d": {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return { startDate: isoDate(start), endDate: end };
    }
    case "90d": {
      const start = new Date(today);
      start.setDate(start.getDate() - 89);
      return { startDate: isoDate(start), endDate: end };
    }
    case "month": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate: isoDate(start), endDate: end };
    }
    case "year": {
      const start = new Date(today.getFullYear(), 0, 1);
      return { startDate: isoDate(start), endDate: end };
    }
  }
}

// Builds one CSV (comma, quoted where needed) covering every number in the
// report, and triggers a browser download. All client-side -- no extra
// backend endpoint needed, since the data's already loaded for the charts.
export function downloadReportCsv(report: StatsReport) {
  const rows: string[][] = [["section", "period", "metric", "value"]];

  (Object.entries(report.kpis) as [string, KpiValue][]).forEach(([name, kpi]) => {
    rows.push(["kpi", report.range.end_date, `${name}`, String(kpi.value)]);
    rows.push(["kpi", "previous_period", `${name}`, String(kpi.previous)]);
  });

  report.series.new_signups.forEach((p) => rows.push(["series", p.period, "new_signups", String(p.value)]));
  report.series.active_users.forEach((p) => rows.push(["series", p.period, "active_users", String(p.value)]));
  report.series.total_miles.forEach((p) => rows.push(["series", p.period, "total_miles", String(p.value)]));
  report.series.account_deletions.forEach((p) =>
    rows.push(["series", p.period, "account_deletions", String(p.value)]),
  );
  report.series.platform_split.forEach((p) => {
    rows.push(["series", p.period, "platform_healthkit", String(p.healthkit)]);
    rows.push(["series", p.period, "platform_health_connect", String(p.health_connect)]);
  });

  rows.push([
    "goal_progress",
    report.range.end_date,
    "users_completed_goal_pct",
    String(report.goal_progress.users_completed_goal_pct ?? ""),
  ]);
  rows.push([
    "goal_progress",
    report.range.end_date,
    "avg_miles_per_active_user",
    String(report.goal_progress.avg_miles_per_active_user),
  ]);

  const escapeCell = (cell: string) =>
    /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
  const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pastor4life-report_${report.range.start_date}_to_${report.range.end_date}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
