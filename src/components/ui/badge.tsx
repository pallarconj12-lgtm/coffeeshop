import * as React from "react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  confirmed: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  preparing: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  ready: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
  completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  default: "bg-muted text-muted-foreground border-border",
};

export function Badge({
  className,
  status,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { status?: string }) {
  const style = (status && statusStyles[status]) || statusStyles.default;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        style,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
