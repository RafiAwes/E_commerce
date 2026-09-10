import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export interface PageMetadataInput {
  title: string;
  description: string;
  /** Absolute path, e.g. "/shop" — used for the canonical URL. */
  path?: string;
  image?: string;
  /** Product and collection pages are articles/products, not the site index. */
  type?: "website" | "article";
  noIndex?: boolean;
}

/**
 * One helper for every page's metadata so titles, canonicals and social cards
 * stay consistent as routes are added.
 */
export function createMetadata({ title, description, path = "/", image, type = "website", noIndex }: PageMetadataInput): Metadata {
  const url = `${SITE.url}${path}`;
  const ogImage = image ?? "/images/editorial/featured-collection.svg";

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      url,
      title: `${title} · ${SITE.name}`,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: ogImage, width: 1600, height: 1000, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE.name}`,
      description,
      images: [ogImage],
    },
  };
}

/** Minimal, valid product structured data for rich results. */
export function productJsonLd(input: {
  name: string;
  description: string;
  image: string;
  slug: string;
  price: number;
  currency: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  category: string;
}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: `${SITE.url}${input.image}`,
    category: input.category,
    brand: { "@type": "Brand", name: SITE.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: input.rating,
      reviewCount: input.reviewCount,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/products/${input.slug}`,
      price: input.price,
      priceCurrency: input.currency,
      availability: input.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  });
}

export function breadcrumbJsonLd(items: readonly { name: string; path: string }[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  });
}
