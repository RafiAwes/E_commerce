import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/seo";
import { collectionService } from "@/services/collection.service";

export const metadata: Metadata = createMetadata({
  title: "Collections",
  description: "Curated edits from the Aurelia atelier — celebration gifting, quiet luxury for the home, keepsakes and hampers.",
  path: "/collections",
});

export default async function CollectionsPage() {
  const collections = await collectionService.getCollections();

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections" }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="text-display-sm md:text-display-md">Collections</h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          Edits we put together by hand. Each one is a point of view rather than a category — a set of pieces that belong
          in the same room, or the same moment.
        </p>
      </header>

      <ul className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
        {collections.map((collection, index) => (
          <li key={collection.id}>
            <Link href={`/collections/${collection.slug}`} className="group block overflow-hidden rounded-card border border-border bg-surface">
              <span className="relative block aspect-[16/9] bg-secondary">
                <Image
                  src={collection.heroImage}
                  alt={`${collection.name} collection`}
                  fill
                  priority={index < 2}
                  sizes="(min-width: 768px) 46vw, 92vw"
                  className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                />
              </span>
              <span className="block p-6">
                <span className="eyebrow text-gold">{collection.productSlugs.length} pieces</span>
                <span className="mt-2.5 block font-display text-2xl leading-tight">{collection.name}</span>
                <span className="mt-2 block text-sm leading-relaxed text-muted">{collection.tagline}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
                  Explore collection
                  <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
