import SignOutButton from "@/components/admin/SignOutButton";
import AdminNav from "@/components/admin/AdminNav";
import { UnsavedChangesProvider } from "@/lib/UnsavedChangesContext";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnsavedChangesProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <header className="bg-brand-navy text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="font-semibold">Pastor4Life Admin</span>
              <AdminNav />
            </div>
            <SignOutButton />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </UnsavedChangesProvider>
  );
}
