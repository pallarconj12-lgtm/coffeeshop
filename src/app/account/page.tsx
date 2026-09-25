import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProfileForm } from "@/components/storefront/profile-form";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("customers").select("full_name, email, phone").eq("id", user.id).maybeSingle(),
    supabase
      .from("orders")
      .select("id, status, fulfillment, total, created_at")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Account</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile and track your past orders.
          </p>
        </div>
        <form action={signOut}>
          <Button variant="outline" size="sm" type="submit">
            Sign Out
          </Button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>Keep your contact details up to date.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              email={profile?.email || user.email || ""}
              fullName={profile?.full_name || ""}
              phone={profile?.phone || ""}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order History</CardTitle>
            <CardDescription>
              {orders?.length ? `${orders.length} order${orders.length === 1 ? "" : "s"}` : "No orders yet."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {orders && orders.length > 0 ? (
              <ul className="divide-y">
                {orders.map((order) => (
                  <li key={order.id}>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-accent/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()} · {order.fulfillment}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-medium">₱{Number(order.total).toFixed(2)}</span>
                        <Badge status={order.status}>{order.status}</Badge>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  You haven&apos;t placed an order yet.
                </p>
                <Button asChild size="sm">
                  <Link href="/shop">Browse the Shop</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
