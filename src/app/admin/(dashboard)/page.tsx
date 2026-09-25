import {
  ShoppingCart,
  Clock,
  DollarSign,
  Package,
  AlertTriangle,
  XCircle,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "muted",
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "muted" | "warning" | "destructive";
}) {
  const toneClasses = {
    muted: "bg-muted text-muted-foreground",
    warning: "bg-amber-100 text-amber-600",
    destructive: "bg-red-100 text-red-600",
  }[tone];

  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${toneClasses}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { data: orders },
    { count: activeProducts },
    { count: lowStock },
    { count: outOfStock },
    { count: customers },
  ] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("total"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .gt("stock_quantity", 0)
      .lte("stock_quantity", 10),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("stock_quantity", 0),
    supabase.from("customers").select("id", { count: "exact", head: true }),
  ]);

  const revenue = (orders ?? []).reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Store performance at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={totalOrders ?? 0} icon={ShoppingCart} />
        <StatCard label="Pending Orders" value={pendingOrders ?? 0} icon={Clock} tone="warning" />
        <StatCard label="Revenue" value={`₱${revenue.toFixed(2)}`} icon={DollarSign} />
        <StatCard label="Active Products" value={activeProducts ?? 0} icon={Package} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Low Stock" value={lowStock ?? 0} icon={AlertTriangle} tone="warning" />
        <StatCard label="Out of Stock" value={outOfStock ?? 0} icon={XCircle} tone="destructive" />
        <StatCard label="Customers" value={customers ?? 0} icon={Users} />
      </div>
    </div>
  );
}
