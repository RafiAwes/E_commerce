import { BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Rating } from "@/components/shared/Rating";
import type { Review } from "@/types/common";

export function Testimonials({ reviews }: { reviews: readonly Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <Section>
      <Container>
        <SectionHeading
          align="center"
          eyebrow="From our customers"
          title="Gifts that landed well."
          description="A few notes from people who sent something from Aurelia recently."
        />

        <Reveal as="ul" className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {reviews.slice(0, 4).map((review) => (
            <li key={review.id} className="surface-card flex flex-col p-6">
              <Rating value={review.rating} size="md" />
              <h3 className="mt-4 font-sans text-sm font-medium">{review.title}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{review.body}</p>
              <footer className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-medium">{review.author}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                  {review.isVerified ? (
                    <>
                      <BadgeCheck aria-hidden className="size-3.5 text-sage" />
                      Verified customer
                    </>
                  ) : (
                    review.location
                  )}
                </p>
              </footer>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
