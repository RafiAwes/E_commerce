import type { ColorOption, Occasion, ProductCategory, Recipient, Review } from "@/types/common";

/** Taxonomy and store-level content that frames the catalogue. */
export interface CatalogRepository {
  getCategories(): Promise<readonly ProductCategory[]>;
  getOccasions(): Promise<readonly Occasion[]>;
  getRecipients(): Promise<readonly Recipient[]>;
  getColors(): Promise<readonly ColorOption[]>;
  /** Store-level reviews (not attached to a single product). */
  getTestimonials(): Promise<readonly Review[]>;
}
