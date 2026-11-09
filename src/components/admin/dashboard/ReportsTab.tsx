import Link from "next/link";
import { presetRange } from "@/lib/stats";
import { useStatsReport } from "@/lib/useStatsReport";
import StatTile from "@/components/admin/reports/StatTile";

// A lightweight, fixed-range (last 30 days) preview — the full Reports page
// is where date-range/granularity filtering and the charts actually live.
export default function ReportsTab() {
  const { startDate, endDate } = presetRange("30d");
  const { report, loading, error } = useStatsReport(startDate, endDate, "day");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-brand-navy/70">Last 30 days at a glance.</p>
        <Link
          href="/admin/reports"
          className="rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-navy/90"
        >
          View full Reports →
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-brand-error/20 bg-brand-error/5 p-3 text-sm text-brand-error">
          {error}
        </p>
      )}

      {!report && loading && <p className="mt-6 text-brand-navy/50">Loading…</p>}

      {report && (
        <div
          className={`mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${loading ? "opacity-60 transition-opacity" : "transition-opacity"}`}
        >
          <StatTile
            label="Total registered users"
            value={report.kpis.total_users.value}
            previous={report.kpis.total_users.previous}
            comparisonLabel="vs start of range"
          />
          <StatTile
            label="New signups"
            value={report.kpis.new_signups.value}
            previous={report.kpis.new_signups.previous}
          />
          <StatTile
            label="Active users"
            value={report.kpis.active_users.value}
            previous={report.kpis.active_users.previous}
          />
          <StatTile
            label="Miles logged"
            value={report.kpis.total_miles.value}
            previous={report.kpis.total_miles.previous}
            unit="mi"
          />
        </div>
      )}
    </div>
  );
}
