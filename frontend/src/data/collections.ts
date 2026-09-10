import type { Collection } from "@/types/common";

/**
 * Editorial groupings. A collection is an intentional edit, not a filter —
 * the product order here is the merchandising order shown on the page.
 */
export const collections: readonly Collection[] = [
  {
    id: "c-001",
    slug: "the-celebration-collection",
    name: "The Celebration Collection",
    tagline: "Beautiful gifts designed for life's happiest moments.",
    description:
      "Everything we would send to a birthday, an engagement or the evening someone finally got the news they were waiting for. Bright, generous and wrapped to be opened in front of people.",
    heroImage: "/images/collections/the-celebration-collection.svg",
    accent: "gold",
    productSlugs: [
      "elegant-rose-gift-box",
      "luxury-self-care-gift-set",
      "artisan-chocolate-hamper",
      "romantic-candle-set",
      "floral-gift-basket",
      "mini-celebration-box",
      "gilded-star-ornament",
      "thank-you-blooms-box",
    ],
    featuredProductSlugs: ["elegant-rose-gift-box", "luxury-self-care-gift-set", "artisan-chocolate-hamper"],
    isFeatured: true,
  },
  {
    id: "c-002",
    slug: "quiet-luxury-home",
    name: "Quiet Luxury for the Home",
    tagline: "Restrained pieces for the shelf, the table and the hallway.",
    description:
      "Porcelain, brass and marble in a palette that does not compete with the room it lands in. Our edit for housewarmings, weddings and anyone who has just started somewhere new.",
    heroImage: "/images/collections/quiet-luxury-home.svg",
    accent: "sage",
    productSlugs: [
      "porcelain-bud-vase",
      "marble-brass-coaster-set",
      "brass-tealight-lantern",
      "ceramic-couple-figurine",
      "everlasting-rose-dome",
      "cozy-home-gift-box",
      "first-home-keepsake-set",
      "handmade-decorative-candle",
    ],
    featuredProductSlugs: ["porcelain-bud-vase", "marble-brass-coaster-set", "brass-tealight-lantern"],
    isFeatured: true,
  },
  {
    id: "c-003",
    slug: "forever-keepsakes",
    name: "Forever Keepsakes",
    tagline: "Engraved, personalized and made to be kept.",
    description:
      "The pieces we engrave by hand — names, dates and the occasional short line that means nothing to anyone else. Allow one to two extra working days.",
    heroImage: "/images/collections/forever-keepsakes.svg",
    accent: "rose",
    productSlugs: [
      "personalized-couple-ornament",
      "personalized-name-ornament",
      "custom-photo-frame",
      "personalized-wooden-plaque",
      "personalized-star-map",
      "engraved-keepsake-locket",
      "heart-keepsake-box",
    ],
    featuredProductSlugs: ["personalized-couple-ornament", "personalized-star-map", "engraved-keepsake-locket"],
    isFeatured: true,
  },
  {
    id: "c-004",
    slug: "the-signature-hamper-edit",
    name: "The Signature Hamper Edit",
    tagline: "When the moment calls for something larger.",
    description:
      "Our fullest gifts, packed into baskets worth keeping. Sent to families, to offices, and to anyone who deserves more than a card.",
    heroImage: "/images/collections/the-signature-hamper-edit.svg",
    accent: "burgundy",
    productSlugs: [
      "eid-celebration-hamper",
      "artisan-chocolate-hamper",
      "floral-gift-basket",
      "thank-you-blooms-box",
      "cozy-home-gift-box",
      "luxury-self-care-gift-set",
    ],
    featuredProductSlugs: ["eid-celebration-hamper", "artisan-chocolate-hamper", "floral-gift-basket"],
    isFeatured: false,
  },
  {
    id: "c-005",
    slug: "candlelight-and-scent",
    name: "Candlelight & Scent",
    tagline: "Small-batch pours for slower evenings.",
    description:
      "Soy and coconut wax, cotton wicks, and vessels we would happily keep on a desk afterwards. Poured in small batches, so scents rotate through the year.",
    heroImage: "/images/collections/candlelight-and-scent.svg",
    accent: "gold",
    productSlugs: [
      "amber-oud-candle",
      "hand-poured-soy-trio",
      "romantic-candle-set",
      "handmade-decorative-candle",
      "brass-tealight-lantern",
      "luxury-mini-gift-set",
    ],
    featuredProductSlugs: ["amber-oud-candle", "hand-poured-soy-trio", "romantic-candle-set"],
    isFeatured: true,
  },
];
