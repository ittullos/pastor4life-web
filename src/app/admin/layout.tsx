import type { Metadata } from "next";
import ConfigureAmplifyClientSide from "@/components/admin/ConfigureAmplifyClientSide";

// Keeps the admin portal out of search results and off the public sitemap —
// it's a staff tool, not a public destination (WEBSITE_PROJECT_CHECKLIST.md
// Section 4/9).
export const metadata: Metadata = {
  title: "Pastor4Life Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-brand-navy/5">
      <ConfigureAmplifyClientSide />
      {children}
    </div>
  );
}
