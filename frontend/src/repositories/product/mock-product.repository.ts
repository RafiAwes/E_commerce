import { products } from "@/data/products";
import { reviews } from "@/data/reviews";
import { applyProductQuery, filterProducts, searchProducts, type ProductQuery } from "@/lib/catalog/query";
import type { Paginated, Product, Review } from "@/types/common";
import type { ProductRepository } from "./product.repository";

/**
 * In-memory implementation backed by the mock catalogue.
 *
 * Methods are async on purpose: consumers already await them, so replacing
 * this class with an HTTP client changes no call site.
 */
export class MockProductRepository implements ProductRepository {
  async query(query: ProductQuery): Promise<Paginated<Product>> {
    // `total` reflects the matching set before any limit is applied, so
    // "showing 12 of 30" style copy stays correct.
    const searched = query.search ? searchProducts(products, query.search) : products;
    const total = filterProducts(searched, query).length;
    return { items: applyProductQuery(products, query), total };
  }

  async getAll(): Promise<readonly Product[]> {
    return products;
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return products.find((product) => product.slug === slug) ?? null;
  }

  async getBySlugs(slugs: readonly string[]): Promise<readonly Product[]> {
    // Preserve the caller's order — collections rely on it for merchandising.
    const bySlug = new Map(products.map((product) => [product.slug, product]));
    return slugs.flatMap((slug) => {
      const product = bySlug.get(slug);
      return product ? [product] : [];
    });
  }

  async getByIds(ids: readonly string[]): Promise<readonly Product[]> {
    const idSet = new Set(ids);
    return products.filter((product) => idSet.has(product.id));
  }

  async getReviews(slug: string): Promise<readonly Review[]> {
    return reviews.filter((review) => review.productSlug === slug);
  }
}
