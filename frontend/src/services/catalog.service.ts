import { catalogRepository, productRepository } from "@/repositories";
import type { ProductQuery } from "@/lib/catalog/query";
import { getPriceBounds } from "@/lib/catalog/query";
import type { SearchIndexItem } from "@/lib/catalog/search-index";
import { normalizeText } from "@/lib/utils";
import type {
  CategoryId,
  ColorOption,
  Occasion,
  OccasionId,
  Paginated,
  Product,
  ProductCategory,
  Recipient,
  RecipientId,
  Review,
} from "@/types/common";

/**
 * Application-facing catalogue API.
 *
 * Pages and features talk to this object; it is the seam that hides whether
 * the data came from a local array or an HTTP call.
 */
export const catalogService = {
  getProducts(query: ProductQuery = {}): Promise<Paginated<Product>> {
    return productRepository.query(query);
  },

  getAllProducts(): Promise<readonly Product[]> {
    return productRepository.getAll();
  },

  async getBestSellers(limit = 8): Promise<readonly Product[]> {
    const { items } = await productRepository.query({ isBestSeller: true, sort: "recommended", limit });
    return items;
  },

  async getNewArrivals(limit = 8): Promise<readonly Product[]> {
    const { items } = await productRepository.query({ sort: "newest", limit });
    return items;
  },

  async getFeatured(limit = 6): Promise<readonly Product[]> {
    const { items } = await productRepository.query({ isFeatured: true, sort: "recommended", limit });
    return items;
  },

  async getPersonalized(limit = 4): Promise<readonly Product[]> {
    const { items } = await productRepository.query({ personalizedOnly: true, sort: "recommended", limit });
    return items;
  },

  async getProductsByOccasion(occasion: OccasionId, limit?: number): Promise<readonly Product[]> {
    const { items } = await productRepository.query({ occasions: [occasion], sort: "recommended", limit });
    return items;
  },

  async getProductsByRecipient(recipient: RecipientId, limit?: number): Promise<readonly Product[]> {
    const { items } = await productRepository.query({ recipients: [recipient], sort: "recommended", limit });
    return items;
  },

  async getProductsByCategory(category: CategoryId, limit?: number): Promise<readonly Product[]> {
    const { items } = await productRepository.query({ categories: [category], sort: "recommended", limit });
    return items;
  },

  async search(term: string, limit = 8): Promise<readonly Product[]> {
    const { items } = await productRepository.query({ search: term, limit });
    return items;
  },

  getCategories(): Promise<readonly ProductCategory[]> {
    return catalogRepository.getCategories();
  },

  getOccasions(): Promise<readonly Occasion[]> {
    return catalogRepository.getOccasions();
  },

  getRecipients(): Promise<readonly Recipient[]> {
    return catalogRepository.getRecipients();
  },

  getColors(): Promise<readonly ColorOption[]> {
    return catalogRepository.getColors();
  },

  getTestimonials(): Promise<readonly Review[]> {
    return catalogRepository.getTestimonials();
  },

  async getOccasionBySlug(slug: string): Promise<Occasion | null> {
    const all = await catalogRepository.getOccasions();
    return all.find((occasion) => occasion.slug === slug) ?? null;
  },

  async getRecipientBySlug(slug: string): Promise<Recipient | null> {
    const all = await catalogRepository.getRecipients();
    return all.find((recipient) => recipient.slug === slug) ?? null;
  },

  async getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
    const all = await catalogRepository.getCategories();
    return all.find((category) => category.slug === slug) ?? null;
  },

  /**
   * Lightweight projection handed to the client search overlay so
   * autocomplete works instantly without a round trip.
   */
  async getSearchIndex(): Promise<readonly SearchIndexItem[]> {
    const [all, categoryList] = await Promise.all([productRepository.getAll(), catalogRepository.getCategories()]);
    const categoryNames = new Map(categoryList.map((category) => [category.id, category.name]));

    return all.map((product) => ({
      slug: product.slug,
      name: product.name,
      categoryLabel: categoryNames.get(product.category) ?? "Gifts",
      price: product.price,
      image: product.images[0]?.src ?? "",
      keywords: normalizeText(
        [...product.tags, ...product.occasions, ...product.recipients, product.category, product.shortDescription].join(" "),
      ),
    }));
  },

  /** Price slider bounds, derived from the live catalogue rather than hardcoded. */
  async getPriceRange(): Promise<{ min: number; max: number }> {
    const all = await productRepository.getAll();
    return getPriceBounds(all);
  },
};
