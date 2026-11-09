"use client";

import { useEffect, useState } from "react";
import { adminFetch, AdminApiError } from "./adminApi";
import type { Granularity, StatsReport } from "./stats";

type State = { path: string; report: StatsReport | null; error: string | null };

// Mirrors useAdminList's shape, but for the single-object stats report, and
// deliberately keeps the previous report visible (not cleared to null)
// while a new filter selection loads -- "refetch keeps the frame," not a
// skeleton or a flash to empty (dataviz skill, interaction.md).
//
// `loading` is derived (state.path !== the path this render wants) rather
// than its own setState call at the top of the effect, which would
// otherwise trigger react-hooks/set-state-in-effect -- the effect only ever
// calls setState from the async callback, once real data (or an error)
// exists.
export function useStatsReport(startDate: string, endDate: string, granularity: Granularity) {
  const path = `/admin/reports/stats?start_date=${startDate}&end_date=${endDate}&granularity=${granularity}`;
  const [state, setState] = useState<State>({ path: "", report: null, error: null });

  useEffect(() => {
    let cancelled = false;

    adminFetch<StatsReport>(path)
      .then((data) => {
        if (!cancelled) setState({ path, report: data, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          setState((prev) => ({
            path,
            report: prev.report,
            error: err instanceof AdminApiError ? err.message : "Failed to load report.",
          }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return { report: state.report, loading: state.path !== path, error: state.error };
}
