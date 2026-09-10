import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";

export interface CatalogEmptyStateProps {
  searchTerm?: string;
  onClearHref?: string;
}

/** Shown when filters or a search return nothing. */
export function CatalogEmptyState({ searchTerm, onClearHref = "/shop" }: CatalogEmptyStateProps) {
  const isSearch = Boolean(searchTerm);

  return (
    <EmptyState
      icon={<PackageSearch aria-hidden className="size-6" />}
      title={isSearch ? `No results for “${searchTerm}”` : "Nothing matches those filters"}
      description={
        isSearch
          ? "Check the spelling, or try a broader term like “candle”, “ornament” or “for her”."
          : "Try removing a filter or two — or let the gift finder narrow things down for you."
      }
      action={
        <Link href={onClearHref} className={buttonStyles({ variant: "primary" })}>
          Clear filters
        </Link>
      }
      secondaryAction={
        <Link href="/#gift-finder" className={buttonStyles({ variant: "outline" })}>
          Try the gift finder
        </Link>
      }
      className="surface-card"
    />
  );
}
