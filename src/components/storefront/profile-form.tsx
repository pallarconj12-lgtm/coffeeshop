"use client";

import * as React from "react";
import { toast } from "sonner";
import { updateProfile } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({
  email,
  fullName,
  phone,
}: {
  email: string;
  fullName: string;
  phone: string;
}) {
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await updateProfile(formData);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated.");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled className="opacity-70" />
        <p className="text-xs text-muted-foreground">
          Contact support to change the email tied to your account.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" defaultValue={fullName} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={phone} placeholder="Not set" />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
