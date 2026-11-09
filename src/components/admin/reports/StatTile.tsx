import { CHART_COLORS, formatCompactNumber } from "@/lib/stats";

type StatTileProps = {
  label: string;
  value: number;
  previous?: number;
  unit?: string; // e.g. "mi" — appended after the formatted value
  comparisonLabel?: string; // defaults to "vs previous period"
};

// Stat tile contract (dataviz skill, marks-and-anatomy.md): label (sentence
// case, no trailing colon) · value (semibold, auto-compact) · delta (signed,
// named comparison period, color = direction, since more is always the
// desired direction for every KPI this dashboard shows).
export default function StatTile({
  label,
  value,
  previous,
  unit,
  comparisonLabel = "vs previous period",
}: StatTileProps) {
  const hasComparison = typeof previous === "number";
  const delta = hasComparison ? value - previous : null;
  const pct =
    hasComparison && previous !== 0 && delta !== null
      ? (delta / previous) * 100
      : null;

  const deltaColor =
    delta === null || delta === 0
      ? CHART_COLORS.muted
      : delta > 0
        ? CHART_COLORS.statusGood
        : CHART_COLORS.statusBad;

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-brand-navy/70">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-brand-navy">
        {formatCompactNumber(value)}
        {unit ? <span className="ml-1 text-lg font-medium text-brand-navy/60">{unit}</span> : null}
      </p>
      {delta !== null && (
        <p className="mt-1.5 text-sm font-medium" style={{ color: deltaColor }}>
          {delta >= 0 ? "+" : ""}
          {formatCompactNumber(delta)}
          {pct !== null && ` (${delta >= 0 ? "+" : ""}${pct.toFixed(0)}%)`}
          <span className="ml-1 font-normal text-brand-navy/50">{comparisonLabel}</span>
        </p>
      )}
    </div>
  );
}
