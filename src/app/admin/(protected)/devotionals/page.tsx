"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { useAdminList } from "@/lib/useAdminList";
import Modal from "@/components/admin/Modal";
import ResourceForm, { type FieldSpec } from "@/components/admin/ResourceForm";
import ReorderableList from "@/components/admin/ReorderableList";

type Devotional = {
  id: number;
  title: string;
  img_url: string;
  url: string;
  position: number;
};

const FIELDS: FieldSpec[] = [
  { name: "title", label: "Title", required: true },
  { name: "img_url", label: "Image URL", type: "url", required: true },
  { name: "url", label: "Audio URL", type: "url", required: true },
];

export default function DevotionalsPage() {
  const { items, error: loadError, reload: load } =
    useAdminList<Devotional>("/admin/devotionals");
  const [editing, setEditing] = useState<Devotional | "new" | null>(null);
  const [deleting, setDeleting] = useState<Devotional | null>(null);

  async function handleSave(values: Record<string, string | number>) {
    if (editing === "new") {
      // No position sent — new devotionals always append to the end
      // (Devotional#acts_as_list on the backend).
      await adminFetch("/admin/devotionals", {
        method: "POST",
        body: JSON.stringify(values),
      });
    } else if (editing) {
      await adminFetch(`/admin/devotionals/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
    }
    setEditing(null);
    await load();
  }

  async function handleDelete() {
    if (!deleting) return;
    await adminFetch(`/admin/devotionals/${deleting.id}`, {
      method: "DELETE",
    });
    setDeleting(null);
    await load();
  }

  async function handleSaveOrder(orderedIds: number[]) {
    await adminFetch("/admin/devotionals/reorder", {
      method: "PATCH",
      body: JSON.stringify({ ids: orderedIds }),
    });
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">Devotionals</h1>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90"
        >
          Add Devotional
        </button>
      </div>
      <p className="mt-1 text-sm text-brand-navy/60">
        Drag to reorder, then save. New devotionals are added to the end.
      </p>

      {loadError && <p className="mt-4 text-brand-error">{loadError}</p>}

      <div className="mt-6">
        {items && (
          <ReorderableList
            items={items}
            emptyMessage="No devotionals yet."
            onSaveOrder={handleSaveOrder}
            onEdit={setEditing}
            onDelete={setDeleting}
            renderItem={(item) => (
              <div>
                <p className="text-brand-navy">{item.title}</p>
                <p className="truncate text-sm text-brand-navy/60">{item.url}</p>
              </div>
            )}
          />
        )}
      </div>

      {editing && (
        <Modal
          title={editing === "new" ? "Add Devotional" : "Edit Devotional"}
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
        <Modal title="Delete Devotional" onClose={() => setDeleting(null)}>
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
