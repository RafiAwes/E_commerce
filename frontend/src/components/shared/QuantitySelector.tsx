"use client";

import { Minus, Plus } from "lucide-react";
import { COMMERCE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

const sizes = {
  sm: { wrapper: "h-9", button: "w-8", text: "w-8 text-xs" },
  md: { wrapper: "h-11", button: "w-10", text: "w-10 text-sm" },
} as const;

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = COMMERCE.maxQuantityPerLine,
  size = "md",
  label = "Quantity",
  className,
}: QuantitySelectorProps) {
  const style = sizes[size];

  return (
    <div
      className={cn("inline-flex items-center rounded-button border border-border bg-surface", style.wrapper, className)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "flex h-full items-center justify-center rounded-l-button text-muted transition-colors hover:text-foreground disabled:opacity-35 disabled:hover:text-muted",
          style.button,
        )}
      >
        <Minus aria-hidden className="size-3.5" />
      </button>
      <span aria-live="polite" className={cn("text-center font-medium tabular", style.text)}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          "flex h-full items-center justify-center rounded-r-button text-muted transition-colors hover:text-foreground disabled:opacity-35 disabled:hover:text-muted",
          style.button,
        )}
      >
        <Plus aria-hidden className="size-3.5" />
      </button>
    </div>
  );
}
