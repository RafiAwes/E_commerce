import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Shared label / hint / error scaffolding so every control in the store is
 * announced the same way. Controls wire `aria-describedby` to `${id}-hint`
 * and `${id}-error`.
 */
export function Field({ id, label, hint, error, required, hideLabel, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-[0.8125rem] font-medium text-foreground", hideLabel && "sr-only")}>
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const controlStyles =
  "w-full rounded-input border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition-colors duration-200 hover:border-foreground/25 focus:border-foreground/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/25 disabled:cursor-not-allowed disabled:bg-secondary/60 aria-[invalid=true]:border-danger";
