import { collectionRepository, productRepository } from "@/repositories";
import type { Collection, Product } from "@/types/common";

export const collectionService = {
  getCollections(): Promise<readonly Collection[]> {
    return collectionRepository.getAll();
  },

  getCollection(slug: string): Promise<Collection | null> {
    return collectionRepository.getBySlug(slug);
  },

  getFeaturedCollections(): Promise<readonly Collection[]> {
    return collectionRepository.getFeatured();
  },

  /** The single collection used for the homepage editorial band. */
  async getHeroCollection(): Promise<Collection | null> {
    const featured = await collectionRepository.getFeatured();
    return featured[0] ?? null;
  },

  getCollectionProducts(collection: Collection): Promise<readonly Product[]> {
    return productRepository.getBySlugs(collection.productSlugs);
  },

  getFeaturedProducts(collection: Collection): Promise<readonly Product[]> {
    return productRepository.getBySlugs(collection.featuredProductSlugs);
  },

  async getRelatedCollections(slug: string, limit = 3): Promise<readonly Collection[]> {
    const all = await collectionRepository.getAll();
    return all.filter((collection) => collection.slug !== slug).slice(0, limit);
  },

  async getAllSlugs(): Promise<readonly string[]> {
    const all = await collectionRepository.getAll();
    return all.map((collection) => collection.slug);
  },
};
