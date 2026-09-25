import { Suspense } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { StaffLoginForm } from "@/components/admin/login-form";
import { getStoreName } from "@/lib/data/settings";

export default async function AdminLoginPage() {
  const storeName = await getStoreName();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-muted/30">
      <div className="w-full max-w-sm relative">
        <Link
          href="/"
          aria-label="Close"
          className="absolute -top-3 -right-3 rounded-full bg-background border p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <X className="h-4 w-4" />
        </Link>
        <p className="text-lg font-bold tracking-tight mb-8 text-center uppercase">{storeName} Admin</p>
        <Suspense>
          <StaffLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
