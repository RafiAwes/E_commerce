import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

/** Mirrors the product page: gallery on the left, purchase panel on the right. */
export default function ProductLoading() {
  return (
    <Container className="py-8 md:py-10">
      <span className="sr-only" role="status">
        Loading product
      </span>
      <Skeleton className="h-3 w-64" />

      <div className="mt-8 grid gap-10 xl:grid-cols-2 xl:gap-16">
        <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
          <Skeleton className="aspect-[4/5] w-full flex-1" rounded="card" />
          <div className="flex gap-2.5 md:w-20 md:flex-col">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="aspect-[4/5] w-16 md:w-full" rounded="md" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-28" rounded="pill" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="mt-4 h-12 w-full" rounded="md" />
          <Skeleton className="h-12 w-full" rounded="md" />
        </div>
      </div>
    </Container>
  );
}
