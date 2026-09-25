import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold">Not authorized</h1>
      <p className="mt-2 text-muted-foreground max-w-sm">
        This account doesn&apos;t have admin access. Contact the store owner if you believe
        this is a mistake.
      </p>
      <Button className="mt-6" asChild>
        <Link href="/">Back to Store</Link>
      </Button>
    </div>
  );
}
