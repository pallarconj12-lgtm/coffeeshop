"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { staffLogin } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function StaffLoginForm() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin";

  async function handleSubmit(formData: FormData) {
    formData.set("redirectTo", redirectTo);
    setLoading(true);
    const result = await staffLogin(formData);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Sign In</CardTitle>
        <CardDescription>Staff access only.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
