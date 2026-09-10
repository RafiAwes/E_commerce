"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { Overlay } from "@/components/ui/Overlay";
import { searchIndex, type SearchIndexItem } from "@/lib/catalog/search-index";
import { POPULAR_SEARCHES } from "@/lib/constants";
import { formatPrice } from "@/lib/formatters";

export interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  index: readonly SearchIndexItem[];
}

/**
 * Search runs entirely against a small client-side index, so suggestions
 * appear as the shopper types. Submitting hands off to `/shop?q=`, which is
 * server-rendered and shareable.
 */
export function SearchOverlay({ open, onClose, index }: SearchOverlayProps) {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const suggestions = useMemo(() => searchIndex(index, term), [index, term]);
  const trimmed = term.trim();

  function goToResults(query: string) {
    const value = query.trim();
    if (!value) return;
    onClose();
    setTerm("");
    router.push(`/shop?q=${encodeURIComponent(value)}`);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    goToResults(term);
  }

  return (
    <Overlay
      open={open}
      onClose={onClose}
      labelledBy="search-overlay-title"
      panelClassName="absolute inset-x-0 top-0 max-h-[92vh] animate-fade-in overflow-y-auto border-b border-border bg-background shadow-overlay"
    >
      <div className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-6 sm:py-10">
        <div className="flex items-center justify-between gap-4">
          <h2 id="search-overlay-title" className="text-display-sm">
            Search
          </h2>
          <IconButton label="Close search" size="sm" onClick={onClose} className="-mr-2">
            <X aria-hidden className="size-[1.15rem]" />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} role="search" className="mt-5">
          <label htmlFor="storefront-search" className="sr-only">
            Search gifts and ornaments
          </label>
          <div className="relative">
            <Search aria-hidden className="absolute top-1/2 left-4 size-[1.15rem] -translate-y-1/2 text-muted" />
            <input
              id="storefront-search"
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Try “ornament”, “gift for her”, “candle”…"
              autoComplete="off"
              className="h-14 w-full rounded-button border border-border bg-surface pr-4 pl-12 text-base transition-colors hover:border-foreground/25 focus:border-foreground/40 focus-visible:ring-2 focus-visible:ring-burgundy/20 focus-visible:outline-none"
            />
          </div>
        </form>

        {trimmed.length < 2 ? (
          <div className="mt-8">
            <h3 className="eyebrow text-muted">Popular searches</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((search) => (
                <li key={search}>
                  <button
                    type="button"
                    onClick={() => goToResults(search)}
                    className="rounded-pill border border-border bg-surface px-3.5 py-2 text-sm transition-colors hover:border-foreground/30 hover:bg-secondary"
                  >
                    {search}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="mt-8">
            <h3 className="eyebrow text-muted">Products</h3>
            <ul className="mt-3 divide-y divide-border">
              {suggestions.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-secondary/60"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {item.image ? <Image src={item.image} alt="" fill sizes="56px" className="object-cover" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{item.name}</span>
                      <span className="block text-xs text-muted">{item.categoryLabel}</span>
                    </span>
                    <span className="text-sm tabular">{formatPrice(item.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => goToResults(term)}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors hover:text-burgundy"
            >
              View all results for “{trimmed}”
              <ArrowRight aria-hidden className="size-3.5" />
            </button>
          </div>
        ) : (
          <div className="mt-10 rounded-card border border-border bg-surface px-6 py-10 text-center">
            <p className="text-sm font-medium">No products match “{trimmed}”</p>
            <p className="mt-2 text-sm text-muted">
              Try a broader term, or browse the{" "}
              <Link href="/shop" onClick={onClose} className="underline underline-offset-4">
                full collection
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </Overlay>
  );
}
