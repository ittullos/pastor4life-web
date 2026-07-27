"use client";

import { createContext, useContext, useEffect, useState } from "react";

type UnsavedChangesContextValue = {
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  confirmDiscard: () => boolean;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(
  null,
);

export function UnsavedChangesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDirty, setDirty] = useState(false);

  // Covers browser-level navigation away from the page: closing the tab,
  // typing a new URL, refreshing. Does NOT cover in-app client-side
  // navigation (Next.js Link/router) — that's handled separately by
  // confirmDiscard, called from AdminNav before it navigates.
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function confirmDiscard() {
    if (!isDirty) return true;
    return window.confirm(
      "You have unsaved changes to the order. Leave without saving?",
    );
  }

  return (
    <UnsavedChangesContext.Provider value={{ isDirty, setDirty, confirmDiscard }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const ctx = useContext(UnsavedChangesContext);
  if (!ctx) {
    throw new Error(
      "useUnsavedChanges must be used within UnsavedChangesProvider",
    );
  }
  return ctx;
}
