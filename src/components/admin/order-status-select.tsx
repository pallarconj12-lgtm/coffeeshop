"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateOrderStatus } from "@/server/actions/orders";

const STATUSES = ["pending", "preparing", "ready", "completed", "cancelled"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const result = await updateOrderStatus(orderId, e.target.value);
    if (result?.error) toast.error(result.error);
    router.refresh();
  }

  return (
    <select
      defaultValue={status}
      onChange={handleChange}
      className="rounded-md border border-input bg-transparent px-2 py-1 text-xs capitalize"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
