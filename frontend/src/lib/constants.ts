/** Store-wide constants. Business rules live here, not in components. */

export const SITE = {
  name: "Aurelia",
  legalName: "Aurelia Gift Atelier",
  tagline: "Gifts that make the moment memorable.",
  description:
    "Thoughtfully chosen gifts, ornaments and keepsakes for the people and moments that matter. Hand-finished, beautifully wrapped, delivered across Bangladesh.",
  // Canonical origin. Set NEXT_PUBLIC_SITE_URL per environment so
  // metadata, sitemap and structured data point at the right host.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurelia.example.com",
  locale: "en_BD",
  email: "hello@aurelia.example.com",
  phone: "+880 1700 000000",
  address: "House 42, Road 11, Banani, Dhaka 1213",
} as const;

export const CURRENCY = {
  code: "BDT",
  symbol: "৳",
} as const;

/** Commerce rules — a single place to change pricing behaviour. */
export const COMMERCE = {
  freeShippingThreshold: 2500,
  standardShipping: 120,
  expressShipping: 250,
  giftWrapPrice: 150,
  lowStockThreshold: 6,
  maxQuantityPerLine: 10,
} as const;

export const DELIVERY_METHODS = [
  {
    id: "standard",
    name: "Standard delivery",
    description: "3–5 working days",
    price: COMMERCE.standardShipping,
  },
  {
    id: "express",
    name: "Express delivery",
    description: "Next working day inside Dhaka",
    price: COMMERCE.expressShipping,
  },
] as const;

export type DeliveryMethodId = (typeof DELIVERY_METHODS)[number]["id"];

export const PAYMENT_METHODS = [
  {
    id: "cod",
    name: "Cash on delivery",
    description: "Pay the courier when your gift arrives",
  },
  {
    id: "card",
    name: "Credit or debit card",
    description: "Visa, Mastercard and American Express",
  },
  {
    id: "mobile",
    name: "Mobile payment",
    description: "bKash, Nagad or Rocket",
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

/** Promotion codes are simulated for the prototype. */
export const PROMO_CODES: Record<string, { percentOff: number; label: string }> = {
  AURELIA10: { percentOff: 10, label: "10% off your first order" },
  MOMENTS15: { percentOff: 15, label: "15% off celebration gifting" },
};

export const POPULAR_SEARCHES = [
  "Birthday gifts",
  "Anniversary gifts",
  "Gift for her",
  "Personalized gifts",
  "Home decor",
] as const;

export const STORAGE_KEYS = {
  cart: "aurelia.cart.v1",
  wishlist: "aurelia.wishlist.v1",
  lastOrder: "aurelia.order.v1",
} as const;

/**
 * Delivery districts. A short, real list keeps the checkout honest without
 * pretending to be a full administrative dataset.
 */
export const DELIVERY_DISTRICTS = [
  "Dhaka",
  "Gazipur",
  "Narayanganj",
  "Chattogram",
  "Cumilla",
  "Cox’s Bazar",
  "Sylhet",
  "Moulvibazar",
  "Khulna",
  "Jessore",
  "Rajshahi",
  "Bogura",
  "Rangpur",
  "Dinajpur",
  "Barishal",
  "Mymensingh",
] as const;
