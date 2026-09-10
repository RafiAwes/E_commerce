import type { GiftFinderCriteria, GiftFinderProduct, GiftRecommendation } from "../types";
import { findBudgetBand } from "./budgets";

/**
 * Gift recommendation.
 *
 * A transparent, deterministic score — no AI, no hidden weighting. Kept
 * entirely separate from the UI so the algorithm can be tuned, tested or
 * swapped for a server-side recommender without touching a component.
 */

const WEIGHTS = {
  recipient: 42,
  occasion: 40,
  budget: 24,
  featured: 7,
  bestSeller: 6,
  personalized: 4,
  ratingMultiplier: 3,
} as const;

export interface RecommendOptions {
  limit?: number;
  /**
   * When a strict match returns too few gifts we widen the net rather than
   * showing an empty state — a gift finder that finds nothing is worse than
   * one that finds something close.
   */
  minimumResults?: number;
}

function inBudget(product: GiftFinderProduct, budgetId: string | null): boolean {
  const band = findBudgetBand(budgetId);
  if (!band) return true;
  if (band.min !== null && product.price < band.min) return false;
  if (band.max !== null && product.price > band.max) return false;
  return true;
}

function scoreProduct(
  product: GiftFinderProduct,
  criteria: GiftFinderCriteria,
  labels: { recipient?: string; occasion?: string; budget?: string },
): GiftRecommendation {
  const reasons: string[] = [];
  let score = product.rating * WEIGHTS.ratingMultiplier;

  if (criteria.recipientId && product.recipients.includes(criteria.recipientId)) {
    score += WEIGHTS.recipient;
    if (labels.recipient) reasons.push(`Chosen ${labels.recipient.toLowerCase()}`);
  }

  if (criteria.occasionId && product.occasions.includes(criteria.occasionId)) {
    score += WEIGHTS.occasion;
    if (labels.occasion) reasons.push(`Made for ${labels.occasion.toLowerCase()}`);
  }

  if (inBudget(product, criteria.budgetId)) {
    if (criteria.budgetId) {
      score += WEIGHTS.budget;
      reasons.push("Within your budget");
    }
  } else {
    score -= WEIGHTS.budget;
  }

  if (product.isFeatured) score += WEIGHTS.featured;
  if (product.isBestSeller) {
    score += WEIGHTS.bestSeller;
    if (reasons.length < 3) reasons.push("A best seller");
  }
  if (product.isPersonalized) {
    score += WEIGHTS.personalized;
    if (reasons.length < 3) reasons.push("Can be personalized");
  }
  if (!product.inStock) score -= 100;

  return { product, score, reasons: reasons.slice(0, 3) };
}

export function recommendProducts(
  products: readonly GiftFinderProduct[],
  criteria: GiftFinderCriteria,
  labels: { recipient?: string; occasion?: string; budget?: string } = {},
  options: RecommendOptions = {},
): GiftRecommendation[] {
  const { limit = 4, minimumResults = 3 } = options;

  const scored = products
    .map((product) => scoreProduct(product, criteria, labels))
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);

  // Prefer gifts that satisfy at least one stated preference…
  const strong = scored.filter((entry) => entry.reasons.length > 0 && entry.product.inStock);
  if (strong.length >= minimumResults) return strong.slice(0, limit);

  // …then relax, so the finder always returns something worth looking at.
  return scored.filter((entry) => entry.product.inStock).slice(0, limit);
}
