"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ReportsTab from "@/components/admin/dashboard/ReportsTab";
import ContentTab from "@/components/admin/dashboard/ContentTab";
import SupportTicketsTab from "@/components/admin/dashboard/SupportTicketsTab";

type TabKey = "reports" | "content" | "support-tickets";

const TABS: { key: TabKey; label: string }[] = [
  { key: "reports", label: "Reports" },
  { key: "content", label: "Content" },
  { key: "support-tickets", label: "Support Tickets" },
];

function isTabKey(value: string | null): value is TabKey {
  return TABS.some((t) => t.key === value);
}

// useSearchParams requires a Suspense boundary in the App Router.
export default function AdminDashboard() {
  return (
    <Suspense fallback={null}>
      <DashboardTabs />
    </Suspense>
  );
}

function DashboardTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requested = searchParams.get("tab");
  const activeTab: TabKey = isTabKey(requested) ? requested : "reports";

  function selectTab(tab: TabKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Dashboard</h1>
      <p className="mt-2 text-brand-navy/70">
        Manage the content that powers the Pastor4Life app.
      </p>

      <div className="mt-6 flex gap-1 border-b border-black/10">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => selectTab(tab.key)}
            aria-current={activeTab === tab.key ? "page" : undefined}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? "border-brand-navy text-brand-navy"
                : "border-transparent text-brand-navy/50 hover:text-brand-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "reports" && <ReportsTab />}
        {activeTab === "content" && <ContentTab />}
        {activeTab === "support-tickets" && <SupportTicketsTab />}
      </div>
    </div>
  );
}
