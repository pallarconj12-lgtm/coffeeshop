import { requireStaff } from "@/lib/auth/guards";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { getStoreName } from "@/lib/data/settings";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, storeName] = await Promise.all([requireStaff(), getStoreName()]);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar storeName={storeName} />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
