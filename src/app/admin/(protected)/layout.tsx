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
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <AdminNav />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </UnsavedChangesProvider>
  );
}
