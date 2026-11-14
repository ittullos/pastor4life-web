import { APP_STORE_URL } from "@/lib/storeLinks";

// Deliberately not Apple's badge or logo -- Apple's marketing guidelines only
// allow the official unmodified badge artwork, so this is our own two-line
// button with a generic phone glyph instead.
export default function AppStoreButton({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const colors =
    variant === "light"
      ? "bg-white text-brand-navy shadow-lg hover:bg-white/90"
      : "bg-brand-navy text-white hover:bg-brand-navy/90";

  return (
    <a
      href={APP_STORE_URL}
      className={`inline-flex items-center gap-3 rounded-2xl px-5 py-3 text-left transition ${colors}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="h-7 w-7 shrink-0"
      >
        <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
        <path d="M10.5 18.5h3" />
      </svg>
      <span className="leading-tight">
        <span className="block text-xs font-medium opacity-80">
          Download on the
        </span>
        <span className="block text-lg font-bold">App Store</span>
      </span>
    </a>
  );
}
