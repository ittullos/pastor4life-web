import Link from "next/link";
import { useAdminList } from "@/lib/useAdminList";

type SupportTicket = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: "open" | "in_progress" | "closed";
  created_at: string;
};

const PREVIEW_COUNT = 5;

export default function SupportTicketsTab() {
  const { items, error } = useAdminList<SupportTicket>("/admin/support-tickets?status=open");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-3xl font-bold text-brand-navy">{items?.length ?? "…"}</p>
          <p className="text-sm font-medium text-brand-navy/70">Open support tickets</p>
        </div>
        <Link
          href="/admin/support-tickets"
          className="rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-navy/90"
        >
          View all tickets →
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-brand-error/20 bg-brand-error/5 p-3 text-sm text-brand-error">
          {error}
        </p>
      )}

      {items && items.length === 0 && (
        <p className="mt-6 text-brand-navy/50">No open tickets right now.</p>
      )}

      {items && items.length > 0 && (
        <ul className="mt-4 divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          {items.slice(0, PREVIEW_COUNT).map((ticket) => (
            <li key={ticket.id}>
              <Link
                href="/admin/support-tickets"
                className="flex items-start justify-between gap-4 p-4 transition-colors hover:bg-brand-navy/5"
              >
                <div className="min-w-0">
                  <p className="font-medium text-brand-navy">{ticket.name}</p>
                  <p className="mt-0.5 truncate text-sm text-brand-navy/60">{ticket.message}</p>
                </div>
                <span className="shrink-0 text-xs text-brand-navy/40">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
