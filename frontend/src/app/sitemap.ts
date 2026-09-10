import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { catalogService } from "@/services/catalog.service";
import { collectionService } from "@/services/collection.service";
import { productService } from "@/services/product.service";

/** Generated from the catalogue, so new products appear automatically. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, collectionSlugs, occasions] = await Promise.all([
    productService.getAllSlugs(),
    collectionService.getAllSlugs(),
    catalogService.getOccasions(),
  ]);

  const staticRoutes = ["", "/shop", "/collections", "/occasions"].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...collectionSlugs.map((slug) => ({
      url: `${SITE.url}/collections/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...occasions.map((occasion) => ({
      url: `${SITE.url}/occasions/${occasion.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...productSlugs.map((slug) => ({
      url: `${SITE.url}/products/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
