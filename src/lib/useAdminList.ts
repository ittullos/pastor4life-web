"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch, AdminApiError } from "./adminApi";

// Fetches `path` on mount and whenever it changes (so a filter that's part
// of the path, e.g. `?status=open`, naturally triggers a refetch). `reload`
// is for calling after a mutation (save/delete) from an event handler —
// safe to call setState directly there, unlike inside the effect itself
// (react-hooks/set-state-in-effect).
export function useAdminList<T>(path: string) {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const data = await adminFetch<T[]>(path);
      setItems(data);
      setError(null);
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

  return { items, error, reload };
}
