"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, type Ref, Children, cloneElement, isValidElement } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm";
  loading?: boolean;
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = "primary",
  size = "default",
  loading,
  asChild = false,
  className,
  children,
  disabled,
  ref,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center rounded-[var(--radius-lg)] font-brand font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2",
    variant === "primary" && "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-amber-600)] active:scale-[0.98]",
    variant === "secondary" && "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--color-warm-stone-200)] active:scale-[0.98]",
    variant === "ghost" && "text-[var(--foreground)] hover:bg-[var(--secondary)] active:scale-[0.98]",
    size === "default" && "h-10 px-4 py-2 text-base",
    size === "sm" && "h-8 px-3 text-sm",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = Children.only(children) as React.ReactElement<{className?: string; ref?: Ref<HTMLElement>}>;
    return cloneElement(child, {
      className: cn(baseClasses, child.props.className),
      ref: ref as Ref<HTMLElement>,
    });
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={baseClasses}
      {...props}
    >
      {loading && (
        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}