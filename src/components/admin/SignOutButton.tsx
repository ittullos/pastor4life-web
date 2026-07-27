"use client";

import { signOut } from "aws-amplify/auth";
import { useUnsavedChanges } from "@/lib/UnsavedChangesContext";

export default function SignOutButton() {
  const { confirmDiscard } = useUnsavedChanges();

  async function handleSignOut() {
    if (!confirmDiscard()) return;
    await signOut();
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-sm font-medium text-white/80 hover:text-white"
    >
      Sign Out
    </button>
  );
}
