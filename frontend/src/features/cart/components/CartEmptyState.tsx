import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";

export function CartEmptyState({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <EmptyState
      icon={<ShoppingBag aria-hidden className="size-6" />}
      title="Your bag is empty"
      description="Nothing chosen yet. Start with our best sellers, or let the gift finder narrow it down for you."
      action={
        <Link href="/shop" onClick={onNavigate} className={buttonStyles({ variant: "primary" })}>
          Shop gifts
        </Link>
      }
      secondaryAction={
        <Link href="/#gift-finder" onClick={onNavigate} className={buttonStyles({ variant: "outline" })}>
          Find a gift
        </Link>
      }
    />
  );
}
