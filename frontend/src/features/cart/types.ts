import type { CartItem, ColorId, LineItemPersonalization, Product, ProductVariant } from "@/types/common";

export type { CartItem, LineItemPersonalization };

/**
 * Only the fields the cart actually snapshots. Keeping this narrow means
 * server components hand a small object to client islands instead of
 * serialising the whole product into the RSC payload.
 */
export type CartProductRef = Pick<Product, "id" | "slug" | "name" | "price" | "compareAtPrice" | "images">;

/** What a product page or quick-add hands to the cart. */
export interface AddToCartInput {
  product: CartProductRef;
  quantity?: number;
  variant?: ProductVariant | null;
  colorId?: ColorId | null;
  personalization?: LineItemPersonalization | null;
}

export interface CartTotalsOptions {
  giftWrap?: boolean;
  promoPercentOff?: number;
  expressDelivery?: boolean;
}
