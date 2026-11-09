"use client";

import { presetRange, type Granularity } from "@/lib/stats";

type ReportFiltersProps = {
  startDate: string;
  endDate: string;
  granularity: Granularity;
  onRangeChange: (startDate: string, endDate: string) => void;
  onGranularityChange: (granularity: Granularity) => void;
  onExport: () => void;
  exportDisabled: boolean;
};

const PRESETS: { key: Parameters<typeof presetRange>[0]; label: string }[] = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "month", label: "This month" },
  { key: "year", label: "This year" },
];

const GRANULARITIES: { key: Granularity; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

// One filter row above every chart/stat on the page — date range first
// (presets before custom), then granularity, then export. Every chart below
// re-renders against this same slice, so the numbers always agree
// (dataviz skill, interaction.md).
export default function ReportFilters({
  startDate,
  endDate,
  granularity,
  onRangeChange,
  onGranularityChange,
  onExport,
  exportDisabled,
}: ReportFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((preset) => {
          const { startDate: pStart, endDate: pEnd } = presetRange(preset.key);
          const active = pStart === startDate && pEnd === endDate;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => onRangeChange(pStart, pEnd)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-navy text-white"
                  : "bg-brand-navy/5 text-brand-navy hover:bg-brand-navy/10"
              }`}
            >
              {preset.label}
            </button>
          );
        })}

        <div className="mx-1 h-6 w-px bg-black/10" />

        <label className="flex items-center gap-1.5 text-sm text-brand-navy/70">
          <span className="sr-only">Start date</span>
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => onRangeChange(e.target.value, endDate)}
            className="rounded-lg border border-black/10 px-2 py-1.5 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
          />
        </label>
        <span className="text-brand-navy/40">–</span>
        <label className="flex items-center gap-1.5 text-sm text-brand-navy/70">
          <span className="sr-only">End date</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => onRangeChange(startDate, e.target.value)}
            className="rounded-lg border border-black/10 px-2 py-1.5 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-full border border-black/10 p-0.5">
          {GRANULARITIES.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => onGranularityChange(g.key)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                granularity === g.key
                  ? "bg-brand-navy text-white"
                  : "text-brand-navy/70 hover:bg-brand-navy/5"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onExport}
          disabled={exportDisabled}
          className="rounded-full bg-brand-lime px-4 py-1.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-lime/80 disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
