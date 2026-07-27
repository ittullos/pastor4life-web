"use client";

import { useState } from "react";
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

const STATUS_STYLES: Record<SupportTicket["status"], string> = {
  open: "bg-brand-error/10 text-brand-error",
  in_progress: "bg-brand-gold/20 text-brand-navy",
  closed: "bg-brand-success/10 text-brand-success",
};

export default function SupportTicketsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const path = statusFilter
    ? `/admin/support-tickets?status=${encodeURIComponent(statusFilter)}`
    : "/admin/support-tickets";
  const { items, error: loadError } = useAdminList<SupportTicket>(path);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-navy">Support Tickets</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loadError && <p className="mt-4 text-brand-error">{loadError}</p>}

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-brand-navy/60">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Received</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/support-tickets/${item.id}`}
                    className="text-brand-navy hover:underline"
                  >
                    {item.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-brand-navy/70">{item.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[item.status]}`}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-navy/70">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {items?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-brand-navy/60">
                  No support tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
