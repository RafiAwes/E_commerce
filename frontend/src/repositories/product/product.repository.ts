import type { Paginated, Product, Review } from "@/types/common";
import type { ProductQuery } from "@/lib/catalog/query";

/**
 * Data-access contract for products.
 *
 * Everything above this line (services, features, UI) is written against the
 * interface, never the implementation. Swapping `MockProductRepository` for
 * an `ApiProductRepository` that calls `GET /products` is a one-line change
 * in `repositories/index.ts`.
 */
export interface ProductRepository {
  /** Applies a full catalogue query and returns the matching page. */
  query(query: ProductQuery): Promise<Paginated<Product>>;
  getAll(): Promise<readonly Product[]>;
  getBySlug(slug: string): Promise<Product | null>;
  getBySlugs(slugs: readonly string[]): Promise<readonly Product[]>;
  getByIds(ids: readonly string[]): Promise<readonly Product[]>;
  getReviews(slug: string): Promise<readonly Review[]>;
}
