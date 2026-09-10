import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only controls must still announce themselves. */
  label: string;
  variant?: "plain" | "surface" | "outline";
  size?: "sm" | "md";
}

const variants = {
  plain: "text-foreground hover:bg-secondary",
  surface: "bg-surface/90 text-foreground shadow-subtle backdrop-blur-sm hover:bg-surface",
  outline: "border border-border bg-surface text-foreground hover:border-foreground/40",
} as const;

const sizes = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
} as const;

export function IconButton({ label, variant = "plain", size = "md", className, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-200 disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
