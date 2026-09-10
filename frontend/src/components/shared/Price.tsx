import { calculateDiscountPercent, formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export interface PriceProps {
  value: number;
  compareAtValue?: number | null;
  size?: "sm" | "md" | "lg";
  showSaving?: boolean;
  className?: string;
}

const sizes = {
  sm: "text-[0.8125rem]",
  md: "text-[0.9375rem]",
  lg: "text-xl",
} as const;

/** One component owns how money is displayed, everywhere in the store. */
export function Price({ value, compareAtValue, size = "md", showSaving = false, className }: PriceProps) {
  const discount = calculateDiscountPercent(value, compareAtValue ?? null);

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular", sizes[size], className)}>
      <span className={cn("font-medium text-foreground", discount && "text-burgundy")}>{formatPrice(value)}</span>
      {discount ? (
        <>
          <s className="text-muted/80 decoration-muted/50">{formatPrice(compareAtValue ?? 0)}</s>
          <span className="sr-only">reduced from {formatPrice(compareAtValue ?? 0)}</span>
          {showSaving ? <span className="text-xs font-medium text-burgundy">Save {discount}%</span> : null}
        </>
      ) : null}
    </span>
  );
}
