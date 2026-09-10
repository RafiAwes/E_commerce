import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { OccasionCard } from "@/components/shared/OccasionCard";
import { createMetadata } from "@/lib/seo";
import { catalogService } from "@/services/catalog.service";

export const metadata: Metadata = createMetadata({
  title: "Shop by occasion",
  description: "Birthdays, anniversaries, weddings, Eid, Christmas and the days that need no reason at all.",
  path: "/occasions",
});

export default async function OccasionsPage() {
  const occasions = await catalogService.getOccasions();

  return (
    <Container className="py-8 md:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Occasions" }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="text-display-sm md:text-display-md">Shop by occasion</h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          Most people start with the moment rather than the object. Pick what you are celebrating and we will show you
          what suits it.
        </p>
      </header>

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 xl:grid-cols-3">
        {occasions.map((occasion) => (
          <li key={occasion.id}>
            <OccasionCard occasion={occasion} sizes="(min-width: 1200px) 30vw, (min-width: 640px) 30vw, 45vw" />
          </li>
        ))}
      </ul>
    </Container>
  );
}
