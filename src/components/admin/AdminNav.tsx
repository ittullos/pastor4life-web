"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUnsavedChanges } from "@/lib/UnsavedChangesContext";
import SignOutButton from "./SignOutButton";

type NavLink = { href: string; label: string };

const TOP_LINKS: NavLink[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/reports", label: "Reports" },
];

const CONTENT_LINKS: NavLink[] = [
  { href: "/admin/devotionals", label: "Devotionals" },
  { href: "/admin/prayer-items", label: "Prayer Items" },
  { href: "/admin/verses", label: "Verses" },
];

const TAIL_LINKS: NavLink[] = [{ href: "/admin/support-tickets", label: "Support Tickets" }];

export default function AdminNav() {
  const router = useRouter();
  const { confirmDiscard } = useUnsavedChanges();
  const [open, setOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [contentExpanded, setContentExpanded] = useState(false); // mobile accordion
  const contentMenuRef = useRef<HTMLDivElement>(null);

  // Close the desktop Content dropdown on an outside click.
  useEffect(() => {
    if (!contentOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!contentMenuRef.current?.contains(event.target as Node)) {
        setContentOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [contentOpen]);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    setOpen(false);
    setContentOpen(false);
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
          <nav className="hidden items-center gap-4 md:flex">
            {TOP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm font-medium text-white/80 hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            <div ref={contentMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setContentOpen((v) => !v)}
                aria-expanded={contentOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
              >
                Content
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-3.5 w-3.5 transition-transform ${contentOpen ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {contentOpen && (
                <div className="absolute left-0 top-full z-10 mt-2 w-44 rounded-lg border border-black/10 bg-white py-1.5 shadow-lg">
                  {CONTENT_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleClick(e, link.href)}
                      className="block px-4 py-2 text-sm font-medium text-brand-navy hover:bg-brand-navy/5"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {TAIL_LINKS.map((link) => (
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
            {TOP_LINKS.map((link) => (
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

            <li>
              <button
                type="button"
                onClick={() => setContentExpanded((v) => !v)}
                aria-expanded={contentExpanded}
                className="flex w-full items-center justify-between text-sm font-medium text-white/80 hover:text-white"
              >
                Content
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-3.5 w-3.5 transition-transform ${contentExpanded ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {contentExpanded && (
                <ul className="mt-3 flex flex-col gap-3 border-l border-white/10 pl-4">
                  {CONTENT_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={(e) => handleClick(e, link.href)}
                        className="block text-sm font-medium text-white/70 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {TAIL_LINKS.map((link) => (
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
