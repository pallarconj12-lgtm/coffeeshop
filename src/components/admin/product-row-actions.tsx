"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleProductActive, deleteProduct } from "@/server/actions/catalog";
import { Button } from "@/components/ui/button";

export function ProductRowActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();

  async function handleToggle() {
    const result = await toggleProductActive(id, !isActive);
    if (result?.error) toast.error(result.error);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this product? This can't be undone.")) return;
    const result = await deleteProduct(id);
    if (result?.error) toast.error(result.error);
    router.refresh();
  }

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" onClick={handleToggle}>
        {isActive ? "Hide" : "Show"}
      </Button>
      <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
}
