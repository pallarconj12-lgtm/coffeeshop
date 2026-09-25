"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCategory } from "@/server/actions/catalog";
import { Button } from "@/components/ui/button";

export function CategoryDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this category?")) return;
    const result = await deleteCategory(id);
    if (result?.error) toast.error(result.error);
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDelete}>
      Delete
    </Button>
  );
}
