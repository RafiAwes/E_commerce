import { BadgeCheck } from "lucide-react";
import { Rating } from "@/components/shared/Rating";
import { formatCount, formatDate, formatRating, pluralize } from "@/lib/formatters";
import type { Review } from "@/types/common";

export interface ProductReviewsProps {
  reviews: readonly Review[];
  rating: number;
  reviewCount: number;
  breakdown: readonly { stars: number; count: number }[];
}

/** Reviews panel: distribution first, then the individual notes. */
export function ProductReviews({ reviews, rating, reviewCount, breakdown }: ProductReviewsProps) {
  const total = breakdown.reduce((sum, row) => sum + row.count, 0) || 1;

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-14">
      <div>
        <p className="text-display-sm tabular">{formatRating(rating)}</p>
        <Rating value={rating} size="md" className="mt-2" />
        <p className="mt-2 text-xs text-muted">
          Based on {formatCount(reviewCount)} {pluralize(reviewCount, "review")}
        </p>

        <ul className="mt-6 flex flex-col gap-2">
          {breakdown.map((row) => (
            <li key={row.stars} className="flex items-center gap-3 text-xs">
              <span className="w-8 shrink-0 text-muted tabular">{row.stars} ★</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-pill bg-secondary">
                <span className="block h-full rounded-pill bg-gold" style={{ width: `${(row.count / total) * 100}%` }} />
              </span>
              <span className="w-6 shrink-0 text-right text-muted tabular">{row.count}</span>
            </li>
          ))}
        </ul>
      </div>

      {reviews.length > 0 ? (
        <ul className="divide-y divide-border">
          {reviews.map((review) => (
            <li key={review.id} className="py-6 first:pt-0 last:pb-0">
              <Rating value={review.rating} />
              <h4 className="mt-3 font-sans text-sm font-medium">{review.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">{review.body}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span className="font-medium text-foreground">{review.author}</span>
                <span>{review.location}</span>
                <span>{formatDate(review.date)}</span>
                {review.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-sage">
                    <BadgeCheck aria-hidden className="size-3.5" />
                    Verified
                  </span>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">
          No written reviews yet for this piece. Ratings shown are from customers who bought it without leaving a note.
        </p>
      )}
    </div>
  );
}
