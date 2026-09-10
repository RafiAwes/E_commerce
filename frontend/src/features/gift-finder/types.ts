import type { OccasionId, Product, RecipientId } from "@/types/common";

/** What the shopper tells us. Every field is optional until they choose. */
export interface GiftFinderCriteria {
  readonly recipientId: RecipientId | null;
  readonly occasionId: OccasionId | null;
  readonly budgetId: string | null;
}

export interface BudgetBand {
  readonly id: string;
  readonly label: string;
  readonly min: number | null;
  readonly max: number | null;
}

/**
 * A compact product projection. The finder runs in the browser, so shipping
 * the full catalogue would be wasteful — this carries only what scoring and
 * the result card need.
 */
export interface GiftFinderProduct {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly image: string;
  readonly price: number;
  readonly compareAtPrice: number | null;
  readonly rating: number;
  readonly reviewCount: number;
  readonly occasions: readonly OccasionId[];
  readonly recipients: readonly RecipientId[];
  readonly isFeatured: boolean;
  readonly isBestSeller: boolean;
  readonly isPersonalized: boolean;
  readonly inStock: boolean;
}

export interface GiftRecommendation {
  readonly product: GiftFinderProduct;
  readonly score: number;
  /** Human-readable justifications shown on the result card. */
  readonly reasons: readonly string[];
}

export function toGiftFinderProducts(products: readonly Product[]): GiftFinderProduct[] {
  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0]?.src ?? "",
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    rating: product.rating,
    reviewCount: product.reviewCount,
    occasions: product.occasions,
    recipients: product.recipients,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isPersonalized: product.isPersonalized,
    inStock: product.stock > 0,
  }));
}
