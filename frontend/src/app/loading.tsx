import { Container } from "@/components/ui/Container";
import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

/** Generic route fallback. Individual routes override this with a closer match. */
export default function Loading() {
  return (
    <Container className="py-12">
      <span className="sr-only" role="status">
        Loading
      </span>
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-6 h-10 w-72" />
      <Skeleton className="mt-4 h-4 w-full max-w-lg" />
      <ProductGridSkeleton count={8} />
    </Container>
  );
}
