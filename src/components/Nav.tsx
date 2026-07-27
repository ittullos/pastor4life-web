"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/support", label: "Support" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-brand-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/p4l-icon.png"
            alt="Pastor4Life"
            width={44}
            height={44}
            priority
            className="h-11 w-11 rounded-[22%]"
          />
        </Link>

        {/* Desktop nav — horizontal links, md breakpoint and above */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-brand-lime"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger toggle — below md */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
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
        <nav
          id="mobile-nav"
          className="border-t border-white/10 px-4 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
