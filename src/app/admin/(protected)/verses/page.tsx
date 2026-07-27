"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { useAdminList } from "@/lib/useAdminList";
import Modal from "@/components/admin/Modal";
import ResourceForm, { type FieldSpec } from "@/components/admin/ResourceForm";
import ReorderableList from "@/components/admin/ReorderableList";

type Verse = {
  id: number;
  notation: string;
  scripture: string;
  version: string;
  position: number;
};

// No day field — position IS the day now (see WEBSITE_PROJECT_CHECKLIST.md /
// pray4tn's Verse model: dragging a verse to a new spot changes which day it
// shows on, rather than day and position being two values that could drift
// apart).
const FIELDS: FieldSpec[] = [
  { name: "notation", label: "Notation (e.g. John 3:16)", required: true },
  { name: "scripture", label: "Scripture Text", type: "textarea", required: true },
  { name: "version", label: "Version (e.g. CSB, NIV)", required: true },
];

export default function VersesPage() {
  // versionInput is what the user is typing; versionFilter only updates on
  // blur/Enter, which changes the fetch path and lets useAdminList refetch
  // on its own. Defaults to CSB, the translation /home actually serves —
  // reordering only makes sense within one translation at a time (position
  // is scoped per version on the backend), so we always start scoped rather
  // than showing an unorderable "all versions" mix.
  const [versionInput, setVersionInput] = useState("CSB");
  const [versionFilter, setVersionFilter] = useState("CSB");
  const path = versionFilter
    ? `/admin/verses?version=${encodeURIComponent(versionFilter)}`
    : "/admin/verses";
  const { items, error: loadError, reload: load } = useAdminList<Verse>(path);
  const [editing, setEditing] = useState<Verse | "new" | null>(null);
  const [deleting, setDeleting] = useState<Verse | null>(null);

  async function handleSave(values: Record<string, string | number>) {
    if (editing === "new") {
      await adminFetch("/admin/verses", {
        method: "POST",
        body: JSON.stringify(values),
      });
    } else if (editing) {
      await adminFetch(`/admin/verses/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
    }
    setEditing(null);
    await load();
  }

  async function handleDelete() {
    if (!deleting) return;
    await adminFetch(`/admin/verses/${deleting.id}`, { method: "DELETE" });
    setDeleting(null);
    await load();
  }

  async function handleSaveOrder(orderedIds: number[]) {
    await adminFetch("/admin/verses/reorder", {
      method: "PATCH",
      body: JSON.stringify({ ids: orderedIds }),
    });
    await load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-navy">Verses</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Version (e.g. CSB)…"
            value={versionInput}
            onChange={(e) => setVersionInput(e.target.value)}
            onBlur={() => setVersionFilter(versionInput)}
            onKeyDown={(e) => e.key === "Enter" && setVersionFilter(versionInput)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90"
          >
            Add Verse
          </button>
        </div>
      </div>
      <p className="mt-1 text-sm text-brand-navy/60">
        {versionFilter
          ? `Position in this list is which day of the rotation a verse shows on — dragging a verse to a new spot changes when it's shown, not just where it appears here. New verses are added to the end. Order is independent per version.`
          : "Enter a version above to view and reorder its verses — order is scoped per translation."}
      </p>

      {loadError && <p className="mt-4 text-brand-error">{loadError}</p>}

      <div className="mt-6">
        {!versionFilter ? (
          <p className="rounded-xl border border-black/10 bg-white px-4 py-6 text-center text-brand-navy/60">
            Enter a version to view its verses.
          </p>
        ) : (
          items && (
            <ReorderableList
              items={items}
              emptyMessage={`No verses for ${versionFilter} yet.`}
              onSaveOrder={handleSaveOrder}
              onEdit={setEditing}
              onDelete={setDeleting}
              renderItem={(item) => (
                <div>
                  <p className="text-brand-navy">
                    {item.notation}{" "}
                    <span className="text-sm text-brand-navy/50">
                      (#{item.position} in rotation)
                    </span>
                  </p>
                  <p className="truncate text-sm text-brand-navy/60">
                    {item.scripture}
                  </p>
                </div>
              )}
            />
          )
        )}
      </div>

      {editing && (
        <Modal
          title={editing === "new" ? "Add Verse" : "Edit Verse"}
          onClose={() => setEditing(null)}
        >
          <ResourceForm
            fields={FIELDS}
            initialValues={
              editing === "new"
                ? { version: versionFilter }
                : editing
            }
            onSubmit={handleSave}
          />
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete Verse" onClose={() => setDeleting(null)}>
          <p className="text-brand-navy">
            Delete <strong>{deleting.notation} ({deleting.version})</strong>?
            This can&rsquo;t be undone.
          </p>
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
