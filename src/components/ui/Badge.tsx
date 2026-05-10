import { cn } from "@/lib/utils";
import { type ComponentProps, type Ref } from "react";

interface BadgeProps extends ComponentProps<"span"> {
  variant?: "default" | "success";
  ref?: Ref<HTMLSpanElement>;
}

export function Badge({ variant = "default", className, ref, ...props }: BadgeProps) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] px-2 py-0.5 text-xs font-medium",
        variant === "default" && "bg-[var(--muted)] text-[var(--muted-foreground)]",
        variant === "success" && "bg-[var(--success)] text-[var(--success-foreground)]",
        className,
      )}
      {...props}
    />
  );
}
