import Link from "next/link";
import { X } from "lucide-react";
import { getStoreName } from "@/lib/data/settings";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const storeName = await getStoreName();

  return (
    <div className="dark bg-background text-foreground min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm relative">
        <Link
          href="/"
          aria-label="Close"
          className="absolute -top-3 -right-3 rounded-full bg-background border p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <X className="h-4 w-4" />
        </Link>
        <Link href="/" className="block text-center text-lg font-bold tracking-tight mb-8 uppercase">
          {storeName}
        </Link>
        {children}
      </div>
    </div>
  );
}
