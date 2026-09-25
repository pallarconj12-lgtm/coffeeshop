import * as React from "react";

/**
 * Minimal stand-in for @radix-ui/react-slot's <Slot>. Merges the props
 * passed to <Slot> onto its single child element instead of rendering
 * its own DOM node — used for the asChild pattern (e.g. <Button asChild>
 * <Link href="...">...).
 */
export function Slot({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  if (!React.isValidElement(children)) {
    return null;
  }

  const child = children as React.ReactElement<Record<string, unknown>>;

  return React.cloneElement(child, {
    ...props,
    ...child.props,
    className: cn2(
      (props as { className?: string }).className,
      (child.props as { className?: string }).className
    ),
  });
}

function cn2(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
