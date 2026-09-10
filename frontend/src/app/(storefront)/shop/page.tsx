import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { CatalogView } from "@/features/catalog/components/CatalogView";
import { buildCatalogFacets } from "@/features/catalog/lib/facets";
import { parseCatalogSearchParams, toProductQuery } from "@/features/catalog/lib/search-params";
import type { RawSearchParams } from "@/lib/search-params";
import { createMetadata } from "@/lib/seo";
import { catalogService } from "@/services/catalog.service";

interface ShopPageProps {
  searchParams: Promise<RawSearchParams>;
}

/**
 * Search-param driven metadata: a shared `/shop?q=candles` link describes
 * itself correctly, and filtered views stay out of the index.
 */
export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const state = parseCatalogSearchParams(await searchParams);

  if (state.search) {
    return createMetadata({
      title: `Search results for “${state.search}”`,
      description: `Gifts and ornaments matching “${state.search}” at Aurelia.`,
      path: `/shop?q=${encodeURIComponent(state.search)}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: "Shop all gifts",
    description:
      "Browse every gift, ornament, hamper and personalized keepsake in the Aurelia atelier. Filter by occasion, recipient, colour and budget.",
    path: "/shop",
  });
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const state = parseCatalogSearchParams(await searchParams);

  const [{ items, total }, allProducts, categories, occasions, recipients, colors] = await Promise.all([
    catalogService.getProducts(toProductQuery(state)),
    catalogService.getAllProducts(),
    catalogService.getCategories(),
    catalogService.getOccasions(),
    catalogService.getRecipients(),
    catalogService.getColors(),
  ]);

  const facets = buildCatalogFacets(allProducts, state, { categories, occasions, recipients, colors });
  const heading = state.search ? `Results for “${state.search}”` : "All gifts";

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="text-display-sm md:text-display-md">{heading}</h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          {state.search
            ? "Sorted by how closely each piece matches your search."
            : "Every gift we make, in one place. Narrow by occasion, recipient, colour or budget — the filters live in the URL, so you can share exactly what you are looking at."}
        </p>
      </header>

      <div className="mt-10">
        <CatalogView products={items} total={total} state={state} facets={facets} basePath="/shop" />
      </div>
    </Container>
  );
}
