"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUnsavedChanges } from "@/lib/UnsavedChangesContext";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/devotionals", label: "Devotionals" },
  { href: "/admin/journeys", label: "Journeys" },
  { href: "/admin/prayer-items", label: "Prayer Items" },
  { href: "/admin/verses", label: "Verses" },
  { href: "/admin/support-tickets", label: "Support Tickets" },
];

export default function AdminNav() {
  const router = useRouter();
  const { confirmDiscard } = useUnsavedChanges();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    if (confirmDiscard()) {
      router.push(href);
    }
  }

  return (
    <nav className="flex flex-wrap gap-4">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={(e) => handleClick(e, link.href)}
          className="text-sm font-medium text-white/80 hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
