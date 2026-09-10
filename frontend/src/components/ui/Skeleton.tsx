import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "card" | "pill";
}

const radii = {
  sm: "rounded",
  md: "rounded-lg",
  card: "rounded-card",
  pill: "rounded-pill",
} as const;

/**
 * Loading placeholders mirror the shape of the content they replace, so the
 * page does not jump when data arrives.
 */
export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  return <div aria-hidden className={cn("skeleton-sheen", radii[rounded], className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-4/5 w-full" rounded="card" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
