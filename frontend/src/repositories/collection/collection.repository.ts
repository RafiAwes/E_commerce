import type { Collection } from "@/types/common";

export interface CollectionRepository {
  getAll(): Promise<readonly Collection[]>;
  getBySlug(slug: string): Promise<Collection | null>;
  getFeatured(): Promise<readonly Collection[]>;
}
