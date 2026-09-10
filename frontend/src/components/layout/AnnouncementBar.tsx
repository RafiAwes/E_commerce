import { Gift, Sparkles, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { COMMERCE } from "@/lib/constants";
import { formatPrice } from "@/lib/formatters";

const messages = [
  { icon: Truck, text: `Free delivery over ${formatPrice(COMMERCE.freeShippingThreshold)}` },
  { icon: Gift, text: "Complimentary hand-wrapping on every order" },
  { icon: Sparkles, text: "Personalized pieces engraved in 48 hours" },
];

/** Static, server-rendered — three reassurances, no carousel, no JavaScript. */
export function AnnouncementBar() {
  return (
    <div className="border-b border-border bg-foreground text-background">
      <Container className="flex h-9 items-center justify-center gap-8 text-[0.6875rem] tracking-[0.08em]">
        {messages.map(({ icon: Icon, text }, index) => (
          <p
            key={text}
            className={index === 0 ? "flex items-center gap-2" : "hidden items-center gap-2 md:flex"}
          >
            <Icon aria-hidden className="size-3.5 text-gold-soft" />
            {text}
          </p>
        ))}
      </Container>
    </div>
  );
}
