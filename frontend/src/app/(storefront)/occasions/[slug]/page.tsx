import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CatalogView } from "@/features/catalog/components/CatalogView";
import { buildCatalogFacets } from "@/features/catalog/lib/facets";
import { parseCatalogSearchParams, toProductQuery } from "@/features/catalog/lib/search-params";
import { filterProducts } from "@/lib/catalog/query";
import type { RawSearchParams } from "@/lib/search-params";
import { createMetadata } from "@/lib/seo";
import { catalogService } from "@/services/catalog.service";

interface OccasionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}

export async function generateStaticParams() {
  const occasions = await catalogService.getOccasions();
  return occasions.map((occasion) => ({ slug: occasion.slug }));
}

export async function generateMetadata({ params }: OccasionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const occasion = await catalogService.getOccasionBySlug(slug);

  if (!occasion) {
    return createMetadata({ title: "Occasion not found", description: "We do not have an edit for that occasion.", noIndex: true });
  }

  return createMetadata({
    title: `${occasion.name} gifts`,
    description: occasion.description,
    path: `/occasions/${occasion.slug}`,
    image: occasion.image,
  });
}

/**
 * Occasion pages reuse the catalogue architecture with the occasion locked
 * in: the facet is hidden because the page itself already implies it.
 */
export default async function OccasionPage({ params, searchParams }: OccasionPageProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const occasion = await catalogService.getOccasionBySlug(slug);

  if (!occasion) notFound();

  const parsed = parseCatalogSearchParams(rawSearchParams);
  const state = { ...parsed, occasions: [occasion.id] as const };

  const [{ items, total }, allProducts, categories, occasions, recipients, colors] = await Promise.all([
    catalogService.getProducts(toProductQuery(state)),
    catalogService.getAllProducts(),
    catalogService.getCategories(),
    catalogService.getOccasions(),
    catalogService.getRecipients(),
    catalogService.getColors(),
  ]);

  // Facet counts are scoped to this occasion, not the whole catalogue.
  const scoped = filterProducts(allProducts, { occasions: [occasion.id] });
  const facets = buildCatalogFacets(scoped, state, { categories, occasions, recipients, colors });

  return (
    <>
      <PageHero
        eyebrow="Occasion"
        title={`${occasion.name} gifts`}
        description={occasion.description}
        image={occasion.image}
        imageAlt={`${occasion.name} gifts`}
        accent={occasion.accent}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Occasions", href: "/occasions" },
              { label: occasion.name },
            ]}
          />
        }
        actions={
          <Link href="/#gift-finder" className={buttonStyles({ variant: "primary" })}>
            Not sure? Try the gift finder
          </Link>
        }
      />

      <Section spacing="sm">
        <Container>
          <SectionHeading eyebrow="The edit" title={occasion.tagline} />
          <div className="mt-8">
            <CatalogView
              products={items}
              total={total}
              state={state}
              facets={facets}
              basePath={`/occasions/${occasion.slug}`}
              hiddenFacets={["occasions"]}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
