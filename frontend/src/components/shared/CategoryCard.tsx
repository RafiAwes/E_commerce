import type { ProductCategory } from "@/types/common";
import { TileCard } from "./TileCard";

export function CategoryCard({ category, sizes }: { category: ProductCategory; sizes?: string }) {
  return (
    <TileCard
      href={`/shop?category=${category.slug}`}
      title={category.name}
      image={category.image}
      imageAlt={`${category.name} gifts`}
      aspect="square"
      sizes={sizes}
    />
  );
}
