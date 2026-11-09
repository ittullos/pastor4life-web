"use client";

import { useState } from "react";
import { CHART_COLORS, downloadReportCsv, presetRange, type Granularity } from "@/lib/stats";
import { useStatsReport } from "@/lib/useStatsReport";
import ReportFilters from "@/components/admin/reports/ReportFilters";
import StatTile from "@/components/admin/reports/StatTile";
import TimeSeriesChart from "@/components/admin/reports/TimeSeriesChart";
import PlatformSplitChart from "@/components/admin/reports/PlatformSplitChart";

export default function ReportsPage() {
  const initial = presetRange("30d");
  const [startDate, setStartDate] = useState(initial.startDate);
  const [endDate, setEndDate] = useState(initial.endDate);
  const [granularity, setGranularity] = useState<Granularity>("day");

  const { report, loading, error } = useStatsReport(startDate, endDate, granularity);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Reports</h1>
      <p className="mt-2 text-brand-navy/70">
        Usage and growth statistics for the Pastor4Life app.
      </p>

      <div className="mt-6">
        <ReportFilters
          startDate={startDate}
          endDate={endDate}
          granularity={granularity}
          onRangeChange={(s, e) => {
            setStartDate(s);
            setEndDate(e);
          }}
          onGranularityChange={setGranularity}
          onExport={() => report && downloadReportCsv(report)}
          exportDisabled={!report}
        />
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-brand-error/20 bg-brand-error/5 p-3 text-sm text-brand-error">
          {error}
        </p>
      )}

      {!report && loading && (
        <p className="mt-10 text-center text-brand-navy/50">Loading report…</p>
      )}

      {report && (
        // Refetch keeps the frame: the previous render stays visible at
        // reduced opacity while a new filter selection loads, rather than
        // flashing to a skeleton or blank state (dataviz skill, interaction.md).
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
            <StatTile
              label="Avg. miles per active user"
              value={report.goal_progress.avg_miles_per_active_user}
              unit="mi"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-brand-navy">Mission Impact (Year to Date)</h2>
            <p className="mt-1 text-sm text-brand-navy/60">
              Independent of the date range above — always reflects the current calendar year.
            </p>
            <div className="mt-3 max-w-xs">
              <StatTile
                label="Active users who've completed this year's goal"
                value={report.goal_progress.users_completed_goal_pct ?? 0}
                unit="%"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <TimeSeriesChart
              title="New Signups"
              data={report.series.new_signups}
              granularity={granularity}
              color={CHART_COLORS.seriesBlue}
            />
            <TimeSeriesChart
              title="Active Users"
              data={report.series.active_users}
              granularity={granularity}
              color={CHART_COLORS.seriesBlue}
            />
            <TimeSeriesChart
              title="Miles Logged"
              data={report.series.total_miles}
              granularity={granularity}
              color={CHART_COLORS.seriesGold}
              unit="mi"
            />
            <PlatformSplitChart data={report.series.platform_split} granularity={granularity} />
            <TimeSeriesChart
              title="Account Deletions"
              data={report.series.account_deletions}
              granularity={granularity}
              color={CHART_COLORS.statusBad}
              emptyMessage="No deletions in this range."
            />
          </div>
        </div>
      )}
    </div>
  );
}
