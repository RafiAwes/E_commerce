import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/shared/BrandIcons";
import { Container } from "@/components/ui/Container";
import { catalogService } from "@/services/catalog.service";
import { SITE } from "@/lib/constants";
import { Logo } from "./Logo";

const helpLinks = [
  { label: "Delivery & returns", href: "/shop" },
  { label: "Gift wrapping", href: "/#gift-wrapping" },
  { label: "Personalization", href: "/shop?personalized=true" },
  { label: "Corporate gifting", href: "/shop?recipient=colleagues" },
];

export async function Footer() {
  const [categories, occasions] = await Promise.all([catalogService.getCategories(), catalogService.getOccasions()]);

  return (
    <footer className="mt-auto border-t border-border bg-secondary">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] xl:gap-12">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{SITE.description}</p>
            <ul className="mt-6 flex flex-col gap-2 text-sm text-muted">
              <li className="flex items-start gap-2.5">
                <MapPin aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold" />
                {SITE.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone aria-hidden className="size-3.5 shrink-0 text-gold" />
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-foreground">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail aria-hidden className="size-3.5 shrink-0 text-gold" />
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-foreground">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Shop">
            <h2 className="eyebrow text-muted">Shop</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/shop?category=${category.slug}`} className="transition-colors hover:text-burgundy">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Occasions">
            <h2 className="eyebrow text-muted">Occasions</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {occasions.slice(0, 7).map((occasion) => (
                <li key={occasion.id}>
                  <Link href={`/occasions/${occasion.slug}`} className="transition-colors hover:text-burgundy">
                    {occasion.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Help">
            <h2 className="eyebrow text-muted">Help</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-burgundy">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/collections" className="transition-colors hover:text-burgundy">
                  All collections
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-7 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. Prototype storefront — no orders are processed.
          </p>
          <div className="flex items-center gap-5">
            <span>Cash on delivery · Card · bKash</span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${SITE.name} on Instagram`}
              className="transition-colors hover:text-foreground"
            >
              <InstagramIcon className="size-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
