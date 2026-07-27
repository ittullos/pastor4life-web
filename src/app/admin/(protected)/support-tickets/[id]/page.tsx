"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminFetch, AdminApiError } from "@/lib/adminApi";

type SupportTicket = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: "open" | "in_progress" | "closed";
  internal_note: string | null;
  created_at: string;
};

export default function SupportTicketDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminFetch<SupportTicket>(`/admin/support-tickets/${params.id}`)
      .then(setTicket)
      .catch((err) =>
        setLoadError(
          err instanceof AdminApiError
            ? err.message
            : "Failed to load this ticket.",
        ),
      );
  }, [params.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError(null);
    setSaved(false);
    setSaving(true);

    const data = new FormData(event.currentTarget);

    try {
      const updated = await adminFetch<SupportTicket>(
        `/admin/support-tickets/${params.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: data.get("status"),
            internal_note: data.get("internal_note"),
          }),
        },
      );
      setTicket(updated);
      setSaved(true);
    } catch (err) {
      setSaveError(
        err instanceof AdminApiError ? err.message : "Failed to save.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return <p className="text-brand-error">{loadError}</p>;
  }

  if (!ticket) {
    return <p className="text-brand-navy/60">Loading…</p>;
  }

  return (
    <div className="max-w-2xl">
      <button
        type="button"
        onClick={() => router.push("/admin/support-tickets")}
        className="text-sm font-medium text-brand-navy hover:underline"
      >
        ← Back to Support Tickets
      </button>

      <div className="mt-4 rounded-xl border border-black/10 bg-white p-6">
        <h1 className="text-xl font-bold text-brand-navy">{ticket.name}</h1>
        <p className="mt-1 text-sm text-brand-navy/70">{ticket.email}</p>
        <p className="mt-1 text-xs text-brand-navy/50">
          Received {new Date(ticket.created_at).toLocaleString()}
        </p>

        <p className="mt-4 whitespace-pre-wrap rounded-lg bg-brand-navy/5 p-4 text-brand-navy">
          {ticket.message}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-brand-navy"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={ticket.status}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-brand-navy focus:border-brand-navy focus:outline-none"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="internal_note"
              className="block text-sm font-medium text-brand-navy"
            >
              Internal Note{" "}
              <span className="font-normal text-brand-navy/50">
                (never shown to the submitter)
              </span>
            </label>
            <textarea
              id="internal_note"
              name="internal_note"
              rows={4}
              defaultValue={ticket.internal_note ?? ""}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-brand-navy focus:border-brand-navy focus:outline-none"
            />
          </div>

          {saveError && <p className="text-sm text-brand-error">{saveError}</p>}
          {saved && (
            <p className="text-sm text-brand-success">Saved.</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="self-start rounded-full bg-brand-navy px-6 py-3 font-medium text-white transition-colors hover:bg-brand-navy/90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
