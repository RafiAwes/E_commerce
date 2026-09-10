import type { Metadata } from "next";
import { FeaturedCollectionBand } from "@/components/home/FeaturedCollectionBand";
import { GiftFinderSection } from "@/components/home/GiftFinderSection";
import { GiftWrapping } from "@/components/home/GiftWrapping";
import { Hero } from "@/components/home/Hero";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { PersonalizedGifts } from "@/components/home/PersonalizedGifts";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ShopByMoment } from "@/components/home/ShopByMoment";
import { ShopByRecipient } from "@/components/home/ShopByRecipient";
import { SocialGallery } from "@/components/home/SocialGallery";
import { Testimonials } from "@/components/home/Testimonials";
import { toGiftFinderProducts } from "@/features/gift-finder/types";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { catalogService } from "@/services/catalog.service";
import { collectionService } from "@/services/collection.service";

export const metadata: Metadata = createMetadata({
  title: SITE.tagline,
  description: SITE.description,
  path: "/",
});

/**
 * The homepage orchestrates: it resolves every section's data in parallel on
 * the server and hands it down. The sections themselves stay presentational.
 */
export default async function HomePage() {
  const [occasions, recipients, bestSellers, personalized, testimonials, heroCollection, allProducts] = await Promise.all([
    catalogService.getOccasions(),
    catalogService.getRecipients(),
    catalogService.getBestSellers(8),
    catalogService.getPersonalized(4),
    catalogService.getTestimonials(),
    collectionService.getHeroCollection(),
    catalogService.getAllProducts(),
  ]);

  // New arrivals deliberately exclude anything already shown above.
  const [{ items: newArrivals }, collectionProducts] = await Promise.all([
    catalogService.getProducts({
      sort: "newest",
      limit: 4,
      excludeSlugs: bestSellers.map((product) => product.slug),
    }),
    heroCollection ? collectionService.getFeaturedProducts(heroCollection) : Promise.resolve([]),
  ]);

  return (
    <>
      <Hero />

      <ShopByMoment occasions={occasions} />

      <ProductShowcase
        eyebrow="Best sellers"
        title="The ones people keep coming back for."
        description="Our most-gifted pieces this season, chosen by customers rather than by us."
        products={bestSellers}
        href="/shop?sort=recommended"
        linkLabel="Shop all best sellers"
      />

      <GiftFinderSection
        products={toGiftFinderProducts(allProducts)}
        recipients={recipients.map((recipient) => ({ id: recipient.id, label: recipient.name }))}
        occasions={occasions.map((occasion) => ({ id: occasion.id, label: occasion.name }))}
      />

      {heroCollection ? <FeaturedCollectionBand collection={heroCollection} products={collectionProducts} /> : null}

      <ShopByRecipient recipients={recipients} />

      <ProductShowcase
        eyebrow="Just arrived"
        title="New this season."
        description="Fresh into the atelier — small runs, so they do not tend to last."
        products={newArrivals}
        href="/shop?sort=newest"
        linkLabel="Shop new arrivals"
        tone="secondary"
      />

      <PersonalizedGifts products={personalized} />

      <GiftWrapping />

      <Testimonials reviews={testimonials} />

      <SocialGallery />

      <NewsletterSection />
    </>
  );
}
