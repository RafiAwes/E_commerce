import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { AppliedPromo, OrderSummary } from "@/types/common";

export interface CartSummaryProps {
  summary: OrderSummary;
  promo?: AppliedPromo | null;
  showGiftWrap?: boolean;
  className?: string;
}

function Row({ label, value, muted = true }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <dt className={muted ? "text-muted" : ""}>{label}</dt>
      <dd className="tabular">{value}</dd>
    </div>
  );
}

/** Pure presentation — every number arrives pre-calculated from the cart lib. */
export function CartSummary({ summary, promo, showGiftWrap = true, className }: CartSummaryProps) {
  return (
    <dl className={cn("flex flex-col gap-2.5", className)}>
      <Row label="Subtotal" value={formatPrice(summary.subtotal)} />
      {summary.discount > 0 ? (
        <div className="flex items-baseline justify-between gap-4 text-sm text-success">
          <dt>Discount{promo ? ` (${promo.code})` : ""}</dt>
          <dd className="tabular">−{formatPrice(summary.discount)}</dd>
        </div>
      ) : null}
      {showGiftWrap && summary.giftWrapTotal > 0 ? <Row label="Gift wrapping" value={formatPrice(summary.giftWrapTotal)} /> : null}
      <Row label="Delivery" value={summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)} />

      <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-border pt-3.5">
        <dt className="text-sm font-medium">Total</dt>
        <dd className="text-lg font-medium tabular">{formatPrice(summary.total)}</dd>
      </div>
    </dl>
  );
}
