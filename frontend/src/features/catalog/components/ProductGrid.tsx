import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/common";

export interface ProductGridProps {
  products: readonly Product[];
  /** Column count at the largest breakpoint; smaller screens step down. */
  columns?: 3 | 4;
  /** How many images opt out of lazy loading (above the fold only). */
  priorityCount?: number;
  className?: string;
}

const columnStyles = {
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
} as const;

const columnSizes = {
  3: "(min-width: 1200px) 30vw, (min-width: 768px) 30vw, 45vw",
  4: "(min-width: 1440px) 20vw, (min-width: 1200px) 23vw, (min-width: 768px) 30vw, 45vw",
} as const;

export function ProductGrid({ products, columns = 4, priorityCount = 0, className }: ProductGridProps) {
  return (
    <ul className={cn("grid gap-x-4 gap-y-9 md:gap-x-6 md:gap-y-11", columnStyles[columns], className)}>
      {products.map((product, index) => (
        <li key={product.id} className="min-w-0">
          <ProductCard product={product} sizes={columnSizes[columns]} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
