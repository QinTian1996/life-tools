import { cn } from "@/lib/utils";
import { type ComponentProps, type Ref } from "react";

interface CardProps extends ComponentProps<"div"> {
  padding?: "default" | "compact";
  ref?: Ref<HTMLDivElement>;
}

export function Card({ padding = "default", className, ref, ...props }: CardProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] rounded-[var(--radius-lg)]",
        padding === "default" && "p-6",
        padding === "compact" && "p-4",
        className,
      )}
      {...props}
    />
  );
}
