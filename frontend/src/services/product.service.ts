import { productRepository } from "@/repositories";
import type { Product, Review } from "@/types/common";

/** Scores catalogue neighbours: same category first, then shared context. */
function relatednessScore(candidate: Product, source: Product): number {
  let score = candidate.category === source.category ? 30 : 0;
  score += candidate.occasions.filter((occasion) => source.occasions.includes(occasion)).length * 8;
  score += candidate.recipients.filter((recipient) => source.recipients.includes(recipient)).length * 5;
  score += candidate.tags.filter((tag) => source.tags.includes(tag)).length * 4;
  const priceGap = Math.abs(candidate.price - source.price) / Math.max(source.price, 1);
  score += Math.max(0, 10 - priceGap * 10);
  return score;
}

export const productService = {
  getProductBySlug(slug: string): Promise<Product | null> {
    return productRepository.getBySlug(slug);
  },

  async getRelatedProducts(product: Product, limit = 4): Promise<readonly Product[]> {
    const all = await productRepository.getAll();
    return all
      .filter((candidate) => candidate.slug !== product.slug)
      .map((candidate) => ({ candidate, score: relatednessScore(candidate, product) }))
      .sort((a, b) => b.score - a.score || b.candidate.rating - a.candidate.rating)
      .slice(0, limit)
      .map((entry) => entry.candidate);
  },

  getReviews(slug: string): Promise<readonly Review[]> {
    return productRepository.getReviews(slug);
  },

  /** Used by `generateStaticParams` so every product is pre-rendered. */
  async getAllSlugs(): Promise<readonly string[]> {
    const all = await productRepository.getAll();
    return all.map((product) => product.slug);
  },

  /** Star distribution for the reviews panel, derived from the review list. */
  async getRatingBreakdown(slug: string): Promise<readonly { stars: number; count: number }[]> {
    const productReviews = await productRepository.getReviews(slug);
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: productReviews.filter((review) => Math.round(review.rating) === stars).length,
    }));
  },
};
