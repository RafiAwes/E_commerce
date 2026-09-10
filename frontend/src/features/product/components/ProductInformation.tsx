import Link from "next/link";
import { Badge, ProductBadgePill } from "@/components/ui/Badge";
import { Price } from "@/components/shared/Price";
import { Rating } from "@/components/shared/Rating";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/common";
import { describeStock, getStockState, resolveCompareAtPrice, resolveUnitPrice } from "../lib/pricing";

/**
 * The static half of the product header. Prices shown here use the base
 * variant; the purchase panel updates its own total as options change.
 */
export function ProductInformation({ product, categoryName }: { product: Product; categoryName: string }) {
  const stockState = getStockState(product);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {product.badge ? <ProductBadgePill badge={product.badge} /> : null}
        <Badge tone="outline">{categoryName}</Badge>
        {/* The category badge already says "Personalized" — do not repeat it. */}
        {product.isPersonalized && product.category !== "personalized" ? (
          <Badge tone="outline">Can be engraved</Badge>
        ) : null}
      </div>

      <h1 className="mt-4 text-display-sm md:text-display-md">{product.name}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Rating value={product.rating} reviewCount={product.reviewCount} size="md" showValue />
        <Link href="#reviews" className="text-xs text-muted underline underline-offset-4 transition-colors hover:text-foreground">
          Read reviews
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <Price
          value={resolveUnitPrice(product, product.variants[0] ?? null)}
          compareAtValue={resolveCompareAtPrice(product, product.variants[0] ?? null)}
          size="lg"
          showSaving
        />
        <span
          className={cn(
            "text-xs",
            stockState === "sold-out" ? "text-danger" : stockState === "low-stock" ? "text-burgundy" : "text-success",
          )}
        >
          {describeStock(product)}
        </span>
      </div>

      <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">{product.description}</p>
    </div>
  );
}
