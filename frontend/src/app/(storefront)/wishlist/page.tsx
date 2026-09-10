import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { toCardProducts } from "@/features/catalog/lib/card-projection";
import { WishlistGrid } from "@/features/wishlist/components/WishlistGrid";
import { createMetadata } from "@/lib/seo";
import { catalogService } from "@/services/catalog.service";

export const metadata: Metadata = createMetadata({
  title: "Wishlist",
  description: "The pieces you have saved for later.",
  path: "/wishlist",
  noIndex: true,
});

/**
 * The saved list itself lives in the browser, so the server sends the
 * catalogue and the client resolves the references against it.
 */
export default async function WishlistPage() {
  const products = await catalogService.getAllProducts();

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="text-display-sm md:text-display-md">Your wishlist</h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          Saved pieces, kept on this device. Move them to your bag whenever you are ready.
        </p>
      </header>

      <div className="mt-10">
        <WishlistGrid catalogue={toCardProducts(products)} />
      </div>
    </Container>
  );
}
