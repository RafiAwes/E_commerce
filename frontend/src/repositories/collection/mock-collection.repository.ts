import { collections } from "@/data/collections";
import type { Collection } from "@/types/common";
import type { CollectionRepository } from "./collection.repository";

export class MockCollectionRepository implements CollectionRepository {
  async getAll(): Promise<readonly Collection[]> {
    return collections;
  }

  async getBySlug(slug: string): Promise<Collection | null> {
    return collections.find((collection) => collection.slug === slug) ?? null;
  }

  async getFeatured(): Promise<readonly Collection[]> {
    return collections.filter((collection) => collection.isFeatured);
  }
}
