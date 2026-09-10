import { Container } from "@/components/ui/Container";
import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

/** Mirrors the shop layout: sidebar, toolbar, grid. */
export default function ShopLoading() {
  return (
    <Container className="py-8 md:py-12">
      <span className="sr-only" role="status">
        Loading products
      </span>
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-6 h-9 w-56" />
      <Skeleton className="mt-4 h-4 w-full max-w-xl" />

      <div className="mt-10 flex flex-col gap-8 xl:flex-row xl:gap-12">
        <div className="hidden w-64 shrink-0 flex-col gap-6 xl:flex">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex flex-col gap-2.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-11 w-44" rounded="md" />
          </div>
          <div className="mt-8">
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </div>
    </Container>
  );
}
