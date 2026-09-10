"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  label: string;
  side?: "top" | "bottom";
  className?: string;
  children: ReactNode;
}

/**
 * Opens on hover *and* focus, and is wired with `aria-describedby` so the
 * text is announced rather than being purely visual.
 */
export function Tooltip({ label, side = "top", className, children }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
    >
      <span aria-describedby={id} className="inline-flex">
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        hidden={!open}
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 w-max max-w-[14rem] -translate-x-1/2 animate-fade-in rounded-lg bg-foreground px-2.5 py-1.5 text-center text-xs leading-snug text-background shadow-raised",
          side === "top" ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]",
        )}
      >
        {label}
      </span>
    </span>
  );
}
