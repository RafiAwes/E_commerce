import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { clamp } from "@/lib/utils";
import type { OrderSummary } from "@/types/common";

/** Progress toward the free-delivery threshold — a gentle nudge, not a hard sell. */
export function FreeShippingMeter({ summary }: { summary: OrderSummary }) {
  const spent = summary.subtotal - summary.discount;
  const progress = clamp(Math.round((spent / summary.freeShippingThreshold) * 100), 0, 100);

  return (
    <div className="rounded-card bg-secondary px-4 py-3.5">
      <p className="flex items-center gap-2 text-xs">
        <Truck aria-hidden className="size-3.5 shrink-0 text-gold" />
        {summary.qualifiesForFreeShipping ? (
          <span className="font-medium">Delivery is on us.</span>
        ) : (
          <span>
            <span className="font-medium tabular">{formatPrice(summary.amountToFreeShipping)}</span> away from free delivery
          </span>
        )}
      </p>
      <div
        className="mt-2.5 h-1 w-full overflow-hidden rounded-pill bg-border"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress toward free delivery"
      >
        <div
          className="h-full rounded-pill bg-gold transition-[width] duration-500 ease-[var(--ease-out-soft)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
