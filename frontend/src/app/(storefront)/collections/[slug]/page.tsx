import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { createMetadata } from "@/lib/seo";
import { collectionService } from "@/services/collection.service";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await collectionService.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await collectionService.getCollection(slug);

  if (!collection) {
    return createMetadata({ title: "Collection not found", description: "This collection is no longer available.", noIndex: true });
  }

  return createMetadata({
    title: collection.name,
    description: collection.tagline,
    path: `/collections/${collection.slug}`,
    image: collection.heroImage,
  });
}

/**
 * Collection pages are an editorial edit rather than a filtered view: the
 * order of `productSlugs` is the merchandising order, so no sort control.
 */
export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await collectionService.getCollection(slug);

  if (!collection) notFound();

  const [featured, products, related] = await Promise.all([
    collectionService.getFeaturedProducts(collection),
    collectionService.getCollectionProducts(collection),
    collectionService.getRelatedCollections(collection.slug, 3),
  ]);

  const rest = products.filter((product) => !collection.featuredProductSlugs.includes(product.slug));

  return (
    <>
      <PageHero
        eyebrow="Collection"
        title={collection.name}
        description={collection.description}
        image={collection.heroImage}
        imageAlt={`${collection.name} collection`}
        accent={collection.accent}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: collection.name },
            ]}
          />
        }
        actions={
          <Link href="/shop" className={buttonStyles({ variant: "outline" })}>
            Shop everything
          </Link>
        }
      />

      {featured.length > 0 ? (
        <Section spacing="md">
          <Container>
            <SectionHeading eyebrow="The edit" title={collection.tagline} />
            <ProductGrid products={featured} columns={3} priorityCount={3} className="mt-9" />
          </Container>
        </Section>
      ) : null}

      {rest.length > 0 ? (
        <Section tone="secondary" spacing="md">
          <Container>
            <SectionHeading eyebrow="Everything in this collection" title={`All ${products.length} pieces`} />
            <ProductGrid products={rest} columns={4} className="mt-9" />
          </Container>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section spacing="md">
          <Container>
            <SectionHeading eyebrow="Keep looking" title="Other collections" />
            <ul className="mt-9 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/collections/${item.slug}`}
                    className="group flex h-full flex-col justify-between rounded-card border border-border bg-surface p-6 transition-colors hover:border-foreground/25"
                  >
                    <div>
                      <h3 className="font-display text-xl leading-tight">{item.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{item.tagline}</p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
                      Explore
                      <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
