import type { ProductCategory } from "@/types/common";

/** Catalogue taxonomy. Slugs are stable and safe to expose in URLs. */
export const categories: readonly ProductCategory[] = [
  {
    id: "gift-sets",
    slug: "gift-sets",
    name: "Gift Sets",
    description: "Curated boxes where every piece has been chosen to sit beautifully together.",
    image: "/images/categories/gift-sets.svg",
  },
  {
    id: "ornaments",
    slug: "ornaments",
    name: "Ornaments",
    description: "Hand-finished ornaments made to be unwrapped once and kept for years.",
    image: "/images/categories/ornaments.svg",
  },
  {
    id: "personalized",
    slug: "personalized",
    name: "Personalized",
    description: "Names, dates and quiet messages engraved by hand in our Dhaka atelier.",
    image: "/images/categories/personalized.svg",
  },
  {
    id: "home-decor",
    slug: "home-decor",
    name: "Home Decor",
    description: "Understated objects for the shelf, the table and the entryway.",
    image: "/images/categories/home-decor.svg",
  },
  {
    id: "candles",
    slug: "candles",
    name: "Candles & Scent",
    description: "Slow-burning soy candles poured in small batches.",
    image: "/images/categories/candles.svg",
  },
  {
    id: "keepsakes",
    slug: "keepsakes",
    name: "Keepsakes",
    description: "Small vessels for the things worth holding on to.",
    image: "/images/categories/keepsakes.svg",
  },
  {
    id: "accessories",
    slug: "accessories",
    name: "Accessories",
    description: "Considered pieces to wear, carry and gift.",
    image: "/images/categories/accessories.svg",
  },
  {
    id: "hampers",
    slug: "hampers",
    name: "Hampers & Baskets",
    description: "Generous arrangements for the moments that call for something larger.",
    image: "/images/categories/hampers.svg",
  },
];
