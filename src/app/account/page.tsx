import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("customers")
    .select("full_name, email, phone")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Account</h1>
        <form action={signOut}>
          <Button variant="outline" size="sm" type="submit">
            Sign Out
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p><span className="text-muted-foreground">Name:</span> {profile?.full_name || "—"}</p>
          <p><span className="text-muted-foreground">Email:</span> {profile?.email || user?.email}</p>
          <p><span className="text-muted-foreground">Phone:</span> {profile?.phone || "—"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
