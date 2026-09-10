import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProductDetailsTabs } from "@/features/product/components/ProductDetailsTabs";
import { ProductGallery } from "@/features/product/components/ProductGallery";
import { ProductInformation } from "@/features/product/components/ProductInformation";
import { ProductPurchase } from "@/features/product/components/ProductPurchase";
import { RelatedProducts } from "@/features/product/components/RelatedProducts";
import { CURRENCY } from "@/lib/constants";
import { breadcrumbJsonLd, createMetadata, productJsonLd } from "@/lib/seo";
import { catalogService } from "@/services/catalog.service";
import { productService } from "@/services/product.service";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** Every product is pre-rendered — thirty static pages, no runtime fetching. */
export async function generateStaticParams() {
  const slugs = await productService.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    return createMetadata({ title: "Product not found", description: "This piece is no longer available.", noIndex: true });
  }

  return createMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/products/${product.slug}`,
    image: product.images[0]?.src,
    type: "article",
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);

  if (!product) notFound();

  const [related, reviews, breakdown, colors, category] = await Promise.all([
    productService.getRelatedProducts(product, 4),
    productService.getReviews(product.slug),
    productService.getRatingBreakdown(product.slug),
    catalogService.getColors(),
    catalogService.getCategoryBySlug(product.category),
  ]);

  const categoryName = category?.name ?? "Gifts";
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: categoryName, href: `/shop?category=${product.category}` },
    { label: product.name },
  ];

  return (
    <>
      {/* Structured data: product offer + breadcrumb trail. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: productJsonLd({
            name: product.name,
            description: product.shortDescription,
            image: product.images[0]?.src ?? "",
            slug: product.slug,
            price: product.price,
            currency: CURRENCY.code,
            inStock: product.stock > 0,
            rating: product.rating,
            reviewCount: product.reviewCount,
            category: categoryName,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: categoryName, path: `/shop?category=${product.category}` },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        }}
      />

      <Container className="py-8 md:py-10">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 grid gap-10 xl:grid-cols-2 xl:gap-16">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="flex flex-col gap-8 xl:pt-2">
            <ProductInformation product={product} categoryName={categoryName} />
            <ProductPurchase product={product} colors={colors} />
          </div>
        </div>
      </Container>

      <Section id="reviews" tone="surface" spacing="sm">
        <Container>
          {/* Keeps the heading order intact: the tab panels below use h3. */}
          <h2 className="sr-only">Product information</h2>
          <ProductDetailsTabs product={product} reviews={reviews} breakdown={breakdown} />
        </Container>
      </Section>

      <RelatedProducts products={related} />
    </>
  );
}
