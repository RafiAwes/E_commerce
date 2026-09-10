import { Container } from "@/components/ui/Container";
import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function OccasionLoading() {
  return (
    <>
      <div className="bg-gold-tint">
        <Container className="py-8 md:py-12">
          <span className="sr-only" role="status">
            Loading occasion
          </span>
          <Skeleton className="h-3 w-48" />
          <div className="mt-6 grid items-center gap-9 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:gap-16">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-12 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="aspect-[16/10] w-full" rounded="card" />
          </div>
        </Container>
      </div>
      <Container className="py-16">
        <ProductGridSkeleton count={8} />
      </Container>
    </>
  );
}
