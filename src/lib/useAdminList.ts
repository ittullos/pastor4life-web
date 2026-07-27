"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch, AdminApiError } from "./adminApi";

// Fetches `path` on mount and whenever it changes (so a filter that's part
// of the path, e.g. `?status=open`, naturally triggers a refetch). `reload`
// is for calling after a mutation (save/delete) from an event handler —
// safe to call setState directly there, unlike inside the effect itself
// (react-hooks/set-state-in-effect).
//
// `version` increments on every successful fetch (initial or reload) — pass
// it as a `key` to any child that keeps its own derived local copy of
// `items` (e.g. ReorderableList's drag order), so that child remounts with
// fresh state instead of relying on prop-comparison logic to notice new
// data arrived. Simpler to reason about than trying to diff old vs. new
// items correctly in every case.
export function useAdminList<T>(path: string) {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const reload = useCallback(async () => {
    try {
      const data = await adminFetch<T[]>(path);
      setItems(data);
      setError(null);
      setVersion((v) => v + 1);
    } catch (err) {
      setError(
        err instanceof AdminApiError ? err.message : "Failed to load.",
      );
    }
  }, [path]);

  useEffect(() => {
    let cancelled = false;

    adminFetch<T[]>(path)
      .then((data) => {
        if (!cancelled) {
          setItems(data);
          setError(null);
          setVersion((v) => v + 1);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof AdminApiError ? err.message : "Failed to load.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return { items, error, reload, version };
}
