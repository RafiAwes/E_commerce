/**
 * Core domain model for the Aurelia storefront.
 *
 * These types describe the *business* shape of the catalogue and are the
 * contract every layer agrees on: repositories map raw sources (mock data
 * today, an HTTP API later) into these types, services return them, and UI
 * components consume them. Changing the data source must never change this
 * file.
 */

export type CategoryId =
  | "gift-sets"
  | "ornaments"
  | "personalized"
  | "home-decor"
  | "candles"
  | "keepsakes"
  | "accessories"
  | "hampers";

export type OccasionId =
  | "birthday"
  | "anniversary"
  | "wedding"
  | "valentines"
  | "eid"
  | "christmas"
  | "new-home"
  | "thank-you"
  | "just-because";

export type RecipientId =
  | "her"
  | "him"
  | "couples"
  | "parents"
  | "friends"
  | "kids"
  | "colleagues";

export type ColorId =
  | "ivory"
  | "gold"
  | "blush"
  | "sage"
  | "burgundy"
  | "charcoal"
  | "walnut"
  | "silver";

export type ProductBadge = "new" | "bestseller" | "limited" | "sale";

export type AccentTone = "gold" | "rose" | "sage" | "burgundy";

export interface ProductImage {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface ProductCategory {
  readonly id: CategoryId;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
}

export interface Occasion {
  readonly id: OccasionId;
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly image: string;
  readonly accent: AccentTone;
}

export interface Recipient {
  readonly id: RecipientId;
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly image: string;
}

export interface ColorOption {
  readonly id: ColorId;
  readonly name: string;
  readonly hex: string;
}

/** A purchasable option (size / format) that can shift the base price. */
export interface ProductVariant {
  readonly id: string;
  readonly name: string;
  readonly priceDelta: number;
  readonly inStock: boolean;
}

export interface PersonalizationStyle {
  readonly id: string;
  readonly name: string;
  readonly previewFontClass: string;
}

/** Describes *what* can be personalized — not how it is rendered. */
export interface PersonalizationSpec {
  readonly nameLabel: string;
  readonly namePlaceholder: string;
  readonly maxNameLength: number;
  readonly supportsMessage: boolean;
  readonly maxMessageLength: number;
  readonly styles: readonly PersonalizationStyle[];
  readonly surface: "ornament" | "plaque" | "frame" | "keepsake";
}

export interface Product {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly details: readonly string[];
  readonly price: number;
  readonly compareAtPrice: number | null;
  readonly category: CategoryId;
  readonly occasions: readonly OccasionId[];
  readonly recipients: readonly RecipientId[];
  readonly colors: readonly ColorId[];
  readonly images: readonly ProductImage[];
  readonly rating: number;
  readonly reviewCount: number;
  readonly badge: ProductBadge | null;
  readonly isNew: boolean;
  readonly isFeatured: boolean;
  readonly isBestSeller: boolean;
  readonly isPersonalized: boolean;
  readonly tags: readonly string[];
  readonly stock: number;
  readonly variants: readonly ProductVariant[];
  readonly personalization: PersonalizationSpec | null;
  readonly materials: string;
  readonly dimensions: string;
  /** ISO date — drives "newest first" sorting. */
  readonly createdAt: string;
}

export interface Collection {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly heroImage: string;
  readonly accent: AccentTone;
  readonly productSlugs: readonly string[];
  readonly featuredProductSlugs: readonly string[];
  readonly isFeatured: boolean;
}

export interface Review {
  readonly id: string;
  readonly productSlug: string | null;
  readonly author: string;
  readonly location: string;
  readonly rating: number;
  readonly title: string;
  readonly body: string;
  readonly date: string;
  readonly isVerified: boolean;
}

/** Discriminated result used by pages that can legitimately find nothing. */
export type Maybe<T> = T | null;

export interface Paginated<T> {
  readonly items: readonly T[];
  readonly total: number;
}

/* ------------------------------------------------------------------ */
/* Commerce                                                            */
/* ------------------------------------------------------------------ */

/** Personalization captured at add-to-cart time and carried to the order. */
export interface LineItemPersonalization {
  readonly name: string;
  readonly message: string;
  readonly styleId: string;
  readonly styleName: string;
}

/**
 * A cart line stores a *snapshot* of the product, not a reference. Carts
 * outlive catalogue edits, and a persisted cart must still render correctly
 * if a product is renamed, repriced or withdrawn.
 */
export interface CartItem {
  readonly lineId: string;
  readonly productId: string;
  readonly slug: string;
  readonly name: string;
  readonly image: string;
  readonly unitPrice: number;
  readonly compareAtPrice: number | null;
  readonly quantity: number;
  readonly variantId: string | null;
  readonly variantName: string | null;
  readonly colorId: ColorId | null;
  readonly personalization: LineItemPersonalization | null;
  readonly addedAt: string;
}

/** Wishlists reference the catalogue, so saved items always stay current. */
export interface WishlistItem {
  readonly productId: string;
  readonly slug: string;
  readonly addedAt: string;
}

export interface AppliedPromo {
  readonly code: string;
  readonly label: string;
  readonly percentOff: number;
}

export interface OrderSummary {
  readonly itemCount: number;
  readonly subtotal: number;
  readonly discount: number;
  readonly giftWrapTotal: number;
  readonly shipping: number;
  readonly total: number;
  readonly freeShippingThreshold: number;
  readonly amountToFreeShipping: number;
  readonly qualifiesForFreeShipping: boolean;
}

export interface ContactDetails {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
}

export interface ShippingAddress {
  readonly addressLine1: string;
  readonly addressLine2: string;
  readonly city: string;
  readonly district: string;
  readonly postcode: string;
}

export interface CheckoutData {
  readonly contact: ContactDetails;
  readonly address: ShippingAddress;
  readonly deliveryMethodId: string;
  readonly paymentMethodId: string;
  readonly giftWrap: boolean;
  readonly giftMessage: string;
}

export interface Order {
  readonly id: string;
  readonly reference: string;
  readonly placedAt: string;
  readonly items: readonly CartItem[];
  readonly summary: OrderSummary;
  readonly checkout: CheckoutData;
  readonly estimatedDeliveryFrom: string;
  readonly estimatedDeliveryTo: string;
}
