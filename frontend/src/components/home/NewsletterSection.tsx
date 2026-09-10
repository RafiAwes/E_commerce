import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { NewsletterForm } from "@/components/shared/NewsletterForm";

export function NewsletterSection() {
  return (
    <Section tone="ink" spacing="md">
      <Container>
        <div className="grid items-center gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] xl:gap-16">
          <div>
            <p className="eyebrow text-gold-soft">Newsletter</p>
            <h2 className="mt-4 text-display-sm text-background md:text-display-md">Stay in the loop.</h2>
            <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-background/65">
              Discover new collections, gift ideas, and special moments.
            </p>
          </div>
          <NewsletterForm tone="dark" />
        </div>
      </Container>
    </Section>
  );
}
