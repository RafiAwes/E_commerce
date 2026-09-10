import { StoreImage as Image } from "@/components/shared/StoreImage";
import Link from "next/link";
import { ProductBadgePill } from "@/components/ui/Badge";
import { Price } from "@/components/shared/Price";
import { Rating } from "@/components/shared/Rating";
import { QuickAdd } from "@/features/cart/components/QuickAdd";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { COMMERCE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/common";

export interface ProductCardProps {
  product: Product;
  /** Feeds `sizes` so the browser never downloads an oversized image. */
  sizes?: string;
  priority?: boolean;
  className?: string;
}

const DEFAULT_SIZES = "(min-width: 1200px) 22vw, (min-width: 768px) 30vw, 45vw";

/**
 * A Server Component. Only the wishlist toggle and quick-add are client
 * islands, so a grid of thirty products ships almost no JavaScript.
 */
export function ProductCard({ product, sizes = DEFAULT_SIZES, priority = false, className }: ProductCardProps) {
  const [primaryImage, hoverImage] = product.images;
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= COMMERCE.lowStockThreshold;
  const needsOptions = product.isPersonalized || product.variants.length > 0;
  const href = `/products/${product.slug}`;

  // Client islands receive only the fields they need, which keeps the RSC
  // payload for a thirty-product grid small.
  const wishlistRef = { id: product.id, slug: product.slug, name: product.name };
  const cartRef = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    images: primaryImage ? [primaryImage] : [],
  };

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative overflow-hidden rounded-image bg-secondary">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden
          className="block aspect-[4/5] w-full focus-visible:outline-none"
        >
          {primaryImage ? (
            <Image
              src={primaryImage.src}
              alt=""
              fill
              sizes={sizes}
              priority={priority}
              className={cn(
                "object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.045]",
                hoverImage && "group-hover:opacity-0",
                soldOut && "opacity-70 grayscale-[0.35]",
              )}
            />
          ) : null}
          {hoverImage ? (
            <Image
              src={hoverImage.src}
              alt=""
              fill
              sizes={sizes}
              loading="lazy"
              className="object-cover opacity-0 transition-opacity duration-500 ease-[var(--ease-out-soft)] group-hover:opacity-100"
            />
          ) : null}
        </Link>

        {product.badge ? <ProductBadgePill badge={product.badge} className="absolute top-3 left-3 z-10" /> : null}
        {soldOut ? (
          <span className="eyebrow absolute top-3 left-3 z-10 rounded-pill bg-foreground/85 px-2.5 py-1 text-[0.625rem] text-background">
            Sold out
          </span>
        ) : null}

        <WishlistButton product={wishlistRef} className="absolute top-2.5 right-2.5 z-10" />

        <QuickAdd
          product={cartRef}
          needsOptions={needsOptions}
          soldOut={soldOut}
          className="absolute inset-x-3 bottom-3 z-10 flex justify-end"
        />
      </div>

      <div className="mt-3.5 flex flex-1 flex-col gap-1.5">
        <h3 className="font-sans text-[0.9375rem] leading-snug font-medium">
          <Link href={href} className="transition-colors hover:text-burgundy">
            {/* Stretched hit area: the whole card is clickable, one tab stop. */}
            <span className="absolute inset-0 z-0" aria-hidden />
            {product.name}
          </Link>
        </h3>

        <Rating value={product.rating} reviewCount={product.reviewCount} />

        <div className="mt-0.5 flex items-baseline justify-between gap-2">
          <Price value={product.price} compareAtValue={product.compareAtPrice} />
          {lowStock ? <span className="text-[0.6875rem] text-burgundy">Only {product.stock} left</span> : null}
        </div>
      </div>
    </article>
  );
}
