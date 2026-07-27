"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUnsavedChanges } from "@/lib/UnsavedChangesContext";
import SignOutButton from "./SignOutButton";

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
  const [open, setOpen] = useState(false);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    setOpen(false);
    if (confirmDiscard()) {
      router.push(href);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="font-semibold">Pastor4Life Admin</span>

          {/* Desktop nav — horizontal links, md breakpoint and above */}
          <nav className="hidden flex-wrap gap-4 md:flex">
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
        </div>

        <div className="hidden md:block">
          <SignOutButton />
        </div>

        {/* Mobile hamburger toggle — below md */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav id="admin-mobile-nav" className="border-t border-white/10 pb-4 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="block text-sm font-medium text-white/80 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-white/10 pt-4">
              <SignOutButton />
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
