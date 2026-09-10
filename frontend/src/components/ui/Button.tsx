import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "gold" | "outline" | "ghost" | "subtle" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-button font-medium tracking-[0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-soft)] disabled:pointer-events-none disabled:opacity-45 active:translate-y-px";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:bg-burgundy shadow-subtle",
  gold: "bg-gold text-white hover:bg-[#a9884f] shadow-subtle",
  outline: "border border-foreground/20 bg-transparent text-foreground hover:border-foreground/60 hover:bg-secondary/60",
  ghost: "bg-transparent text-foreground hover:bg-secondary",
  subtle: "bg-secondary text-foreground hover:bg-gold-soft",
  danger: "border border-danger/30 bg-transparent text-danger hover:bg-danger/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-[0.9375rem]",
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Exposed separately so links can adopt button styling without wrapping a
 * `<button>` in an `<a>` — `<Link className={buttonStyles(...)}>`.
 */
export function buttonStyles({ variant = "primary", size = "md", fullWidth, className }: ButtonStyleOptions = {}): string {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  children?: ReactNode;
}

export function Button({ variant, size, fullWidth, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, fullWidth, className })} {...props} />;
}
