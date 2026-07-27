"use client";

import Link from "next/link";
import { useAdminList } from "@/lib/useAdminList";

export default function AdminDashboard() {
  const devotionals = useAdminList<unknown>("/admin/devotionals");
  const journeys = useAdminList<unknown>("/admin/journeys");
  const prayerItems = useAdminList<unknown>("/admin/prayer-items");
  const verses = useAdminList<unknown>("/admin/verses");
  const openTickets = useAdminList<unknown>(
    "/admin/support-tickets?status=open",
  );

  const cards = [
    { href: "/admin/devotionals", label: "Devotionals", count: devotionals.items?.length },
    { href: "/admin/journeys", label: "Journeys", count: journeys.items?.length },
    { href: "/admin/prayer-items", label: "Prayer Items", count: prayerItems.items?.length },
    { href: "/admin/verses", label: "Verses", count: verses.items?.length },
    {
      href: "/admin/support-tickets?status=open",
      label: "Open Support Tickets",
      count: openTickets.items?.length,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Dashboard</h1>
      <p className="mt-2 text-brand-navy/70">
        Manage the content that powers the Pastor4Life app.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-black/10 bg-white p-6 shadow-sm transition-colors hover:border-brand-navy/30"
          >
            <p className="text-3xl font-bold text-brand-navy">
              {card.count ?? "…"}
            </p>
            <p className="mt-1 text-sm font-medium text-brand-navy/70">
              {card.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
