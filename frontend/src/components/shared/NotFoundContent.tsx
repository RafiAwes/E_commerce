import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/shared/EmptyState";

const suggestions = [
  { label: "All gifts", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Occasions", href: "/occasions" },
  { label: "Personalized", href: "/shop?personalized=true" },
];

/** Shared by the global 404 and by `notFound()` inside storefront routes. */
export function NotFoundContent() {
  return (
    <Container className="py-16 md:py-24">
      <EmptyState
        className="surface-card"
        icon={<Compass aria-hidden className="size-6" />}
        titleAs="h1"
        title="We could not find that page"
        description="The link may be out of date, or the piece may have sold out and been retired from the atelier."
        action={
          <Link href="/" className={buttonStyles({ variant: "primary" })}>
            Back to home
          </Link>
        }
        secondaryAction={
          <Link href="/shop" className={buttonStyles({ variant: "outline" })}>
            Shop all gifts
          </Link>
        }
      />

      <nav aria-label="Suggested pages" className="mt-8">
        <ul className="flex flex-wrap justify-center gap-2">
          {suggestions.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-pill border border-border bg-surface px-3.5 py-2 text-sm transition-colors hover:border-foreground/30 hover:bg-secondary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
