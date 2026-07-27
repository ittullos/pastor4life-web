"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUnsavedChanges } from "@/lib/UnsavedChangesContext";

type ReorderableItem = { id: number };

export default function ReorderableList<T extends ReorderableItem>({
  items,
  renderItem,
  onSaveOrder,
  onEdit,
  onDelete,
  emptyMessage = "Nothing here yet.",
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onSaveOrder: (orderedIds: number[]) => Promise<void>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
}) {
  // Initialized once from `items` and never resynced from props after that
  // — the parent is expected to pass a `key` (e.g. a version counter that
  // bumps on every successful fetch) that changes whenever fresh data
  // arrives, which remounts this component and re-runs this initializer
  // instead of relying on prop-diffing logic here to notice new data.
  const [order, setOrder] = useState<T[]>(items);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setDirty } = useUnsavedChanges();

  const isDirty = order.some((item, index) => item.id !== items[index]?.id);

  useEffect(() => {
    setDirty(isDirty);
  }, [isDirty, setDirty]);

  // Clear the dirty flag on unmount too — otherwise navigating away from
  // this page via a route that doesn't remount UnsavedChangesProvider could
  // leave a stale warning active.
  useEffect(() => () => setDirty(false), [setDirty]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrder((current) => {
      const oldIndex = current.findIndex((i) => i.id === active.id);
      const newIndex = current.findIndex((i) => i.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSaveOrder(order.map((i) => i.id));
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save order.");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setOrder(items);
  }

  return (
    <div>
      {isDirty && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-brand-gold/20 px-4 py-3">
          <p className="text-sm text-brand-navy">
            You have unsaved order changes.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={saving}
              className="rounded-full px-4 py-2 text-sm font-medium text-brand-navy hover:bg-black/5 disabled:opacity-60"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Order"}
            </button>
          </div>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-brand-error">{error}</p>}

      {order.length === 0 ? (
        <p className="rounded-xl border border-black/10 bg-white px-4 py-6 text-center text-brand-navy/60">
          {emptyMessage}
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={order.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="overflow-hidden rounded-xl border border-black/10 bg-white">
              {order.map((item) => (
                <SortableRow key={item.id} id={item.id}>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">{renderItem(item)}</div>
                    <div className="flex shrink-0 gap-3">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="text-sm text-brand-navy hover:underline"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          className="text-sm text-brand-error hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </SortableRow>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableRow({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border-b border-black/5 px-4 py-3 last:border-0"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="shrink-0 cursor-grab touch-none px-1 text-lg text-brand-navy/40 hover:text-brand-navy active:cursor-grabbing"
      >
        ⠿
      </button>
      {children}
    </li>
  );
}
