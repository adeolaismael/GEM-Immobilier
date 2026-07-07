import { createServerSupabaseClientWithAuth } from "@/lib/supabase-server";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClientWithAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-black/5 bg-white shadow-sm">
        <AdminSidebar />
      </aside>
      <div className="flex flex-1 flex-col pl-64">
        <AdminHeader userEmail={user?.email ?? null} />
        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
}
