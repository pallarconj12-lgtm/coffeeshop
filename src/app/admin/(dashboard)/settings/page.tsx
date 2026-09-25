import { createClient } from "@/lib/supabase/server";
import { updateSettings } from "@/server/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settingsRows } = await supabase.from("settings").select("key, value");

  // Plain string lookups — settings are stored as plain text, never JSON,
  // so there's nothing to parse here.
  const getValue = (key: string) => settingsRows?.find((s) => s.key === key)?.value ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Store-wide configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Store Details</CardTitle>
          <CardDescription>Shown on the storefront and receipts.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData: FormData) => {
              "use server";
              await updateSettings(formData);
            }}
            className="space-y-4 max-w-md"
          >
            <div className="space-y-2">
              <Label htmlFor="store_name">Store Name</Label>
              <Input id="store_name" name="store_name" defaultValue={getValue("store_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" defaultValue={getValue("currency")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={getValue("contact_email")}
              />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
