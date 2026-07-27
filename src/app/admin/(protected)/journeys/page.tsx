"use client";

import { useState } from "react";
import { adminFetch, AdminApiError } from "@/lib/adminApi";
import { useAdminList } from "@/lib/useAdminList";
import Modal from "@/components/admin/Modal";
import ResourceForm, { type FieldSpec } from "@/components/admin/ResourceForm";

type Journey = {
  id: number;
  title: string;
  weekly_miles: number;
  monthly_miles: number;
  annual_miles: number;
};

const FIELDS: FieldSpec[] = [
  { name: "title", label: "Title", required: true },
  { name: "weekly_miles", label: "Weekly Miles", type: "number", required: true },
  { name: "monthly_miles", label: "Monthly Miles", type: "number", required: true },
  { name: "annual_miles", label: "Annual Miles", type: "number", required: true },
];

export default function JourneysPage() {
  const { items, error: loadError, reload: load } =
    useAdminList<Journey>("/admin/journeys");
  const [editing, setEditing] = useState<Journey | "new" | null>(null);
  const [deleting, setDeleting] = useState<Journey | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleSave(values: Record<string, string | number>) {
    if (editing === "new") {
      await adminFetch("/admin/journeys", {
        method: "POST",
        body: JSON.stringify(values),
      });
    } else if (editing) {
      await adminFetch(`/admin/journeys/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
    }
    setEditing(null);
    await load();
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteError(null);
    try {
      await adminFetch(`/admin/journeys/${deleting.id}`, { method: "DELETE" });
      setDeleting(null);
      await load();
    } catch (err) {
      // Most likely cause: a commitment still references this journey
      // (pray4tn returns 422 rather than 500 for that — see
      // WEBSITE_PROJECT_CHECKLIST.md Section 6.4).
      setDeleteError(
        err instanceof AdminApiError
          ? err.message
          : "Failed to delete journey.",
      );
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">Journeys</h1>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90"
        >
          Add Journey
        </button>
      </div>

      {loadError && <p className="mt-4 text-brand-error">{loadError}</p>}

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-brand-navy/60">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Weekly</th>
              <th className="px-4 py-3 font-medium">Monthly</th>
              <th className="px-4 py-3 font-medium">Annual</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 text-brand-navy">{item.title}</td>
                <td className="px-4 py-3 text-brand-navy/70">{item.weekly_miles}</td>
                <td className="px-4 py-3 text-brand-navy/70">{item.monthly_miles}</td>
                <td className="px-4 py-3 text-brand-navy/70">{item.annual_miles}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    className="mr-3 text-brand-navy hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError(null);
                      setDeleting(item);
                    }}
                    className="text-brand-error hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-brand-navy/60">
                  No journeys yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal
          title={editing === "new" ? "Add Journey" : "Edit Journey"}
          onClose={() => setEditing(null)}
        >
          <ResourceForm
            fields={FIELDS}
            initialValues={editing === "new" ? undefined : editing}
            onSubmit={handleSave}
          />
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete Journey" onClose={() => setDeleting(null)}>
          <p className="text-brand-navy">
            Delete <strong>{deleting.title}</strong>? This can&rsquo;t be
            undone.
          </p>
          {deleteError && (
            <p className="mt-3 text-sm text-brand-error">{deleteError}</p>
          )}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              className="rounded-full px-4 py-2 text-sm font-medium text-brand-navy hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full bg-brand-error px-4 py-2 text-sm font-medium text-white hover:bg-brand-error/90"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
