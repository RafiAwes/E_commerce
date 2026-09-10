import { Star } from "lucide-react";
import { formatCount, formatRating } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}

const starSizes = { sm: "size-3", md: "size-3.5" } as const;

/**
 * Stars are decorative; the accessible name carries the actual rating so it
 * is never announced as five separate icons.
 */
export function Rating({ value, reviewCount, size = "sm", showValue = false, className }: RatingProps) {
  const rounded = Math.round(value);

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs text-muted", className)}
      aria-label={`Rated ${formatRating(value)} out of 5${reviewCount ? ` from ${formatCount(reviewCount)} reviews` : ""}`}
    >
      <span aria-hidden className="inline-flex items-center gap-px text-gold">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={cn(starSizes[size], star <= rounded ? "fill-current" : "fill-transparent opacity-35")} />
        ))}
      </span>
      {showValue ? (
        <span aria-hidden className="font-medium text-foreground tabular">
          {formatRating(value)}
        </span>
      ) : null}
      {typeof reviewCount === "number" ? (
        <span aria-hidden className="tabular">
          ({formatCount(reviewCount)})
        </span>
      ) : null}
    </span>
  );
}
