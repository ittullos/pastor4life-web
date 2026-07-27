"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { useAdminList } from "@/lib/useAdminList";
import Modal from "@/components/admin/Modal";
import ResourceForm, { type FieldSpec } from "@/components/admin/ResourceForm";
import ReorderableList from "@/components/admin/ReorderableList";

type PrayerItem = {
  id: number;
  title: string;
  body: string;
  position: number;
};

// Position isn't part of the create/edit form — it's managed exclusively via
// drag-and-drop below, which maps to acts_as_list#insert_at on the backend
// (WEBSITE_PROJECT_CHECKLIST.md Section 6.4).
const FIELDS: FieldSpec[] = [
  { name: "title", label: "Title", required: true },
  { name: "body", label: "Body", type: "textarea", required: true },
];

export default function PrayerItemsPage() {
  const { items, error: loadError, reload: load, version } =
    useAdminList<PrayerItem>("/admin/prayer-items");
  const [editing, setEditing] = useState<PrayerItem | "new" | null>(null);
  const [deleting, setDeleting] = useState<PrayerItem | null>(null);

  async function handleSave(values: Record<string, string | number>) {
    if (editing === "new") {
      await adminFetch("/admin/prayer-items", {
        method: "POST",
        body: JSON.stringify(values),
      });
    } else if (editing) {
      await adminFetch(`/admin/prayer-items/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
    }
    setEditing(null);
    await load();
  }

  async function handleDelete() {
    if (!deleting) return;
    await adminFetch(`/admin/prayer-items/${deleting.id}`, {
      method: "DELETE",
    });
    setDeleting(null);
    await load();
  }

  async function handleSaveOrder(orderedIds: number[]) {
    await adminFetch("/admin/prayer-items/reorder", {
      method: "PATCH",
      body: JSON.stringify({ ids: orderedIds }),
    });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">Prayer Items</h1>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90"
        >
          Add Prayer Item
        </button>
      </div>
      <p className="mt-1 text-sm text-brand-navy/60">
        Drag to reorder, then save. New prayer items are added to the end.
      </p>

      {loadError && <p className="mt-4 text-brand-error">{loadError}</p>}

      <div className="mt-6">
        {items && (
          <ReorderableList
            key={version}
            items={items}
            emptyMessage="No prayer items yet."
            onSaveOrder={handleSaveOrder}
            onEdit={setEditing}
            onDelete={setDeleting}
            renderItem={(item) => (
              <div>
                <p className="text-brand-navy">{item.title}</p>
                <p className="truncate text-sm text-brand-navy/60">{item.body}</p>
              </div>
            )}
          />
        )}
      </div>

      {editing && (
        <Modal
          title={editing === "new" ? "Add Prayer Item" : "Edit Prayer Item"}
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
        <Modal title="Delete Prayer Item" onClose={() => setDeleting(null)}>
          <p className="text-brand-navy">
            Delete <strong>{deleting.title}</strong>? This can&rsquo;t be
            undone.
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
