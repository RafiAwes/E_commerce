import { categories } from "@/data/categories";
import { colorOptions } from "@/data/colors";
import { occasions } from "@/data/occasions";
import { recipients } from "@/data/recipients";
import { reviews } from "@/data/reviews";
import type { ColorOption, Occasion, ProductCategory, Recipient, Review } from "@/types/common";
import type { CatalogRepository } from "./catalog.repository";

export class MockCatalogRepository implements CatalogRepository {
  async getCategories(): Promise<readonly ProductCategory[]> {
    return categories;
  }

  async getOccasions(): Promise<readonly Occasion[]> {
    return occasions;
  }

  async getRecipients(): Promise<readonly Recipient[]> {
    return recipients;
  }

  async getColors(): Promise<readonly ColorOption[]> {
    return colorOptions;
  }

  async getTestimonials(): Promise<readonly Review[]> {
    return reviews.filter((review) => review.productSlug === null);
  }
}
