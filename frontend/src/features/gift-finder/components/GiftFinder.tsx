"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { Button, buttonStyles } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { BUDGET_BANDS, findBudgetBand } from "../lib/budgets";
import { recommendProducts } from "../lib/recommend";
import { GiftRecommendationCard } from "./GiftRecommendationCard";
import type { GiftFinderCriteria, GiftFinderProduct, GiftRecommendation } from "../types";

export interface GiftFinderOption {
  id: string;
  label: string;
}

export interface GiftFinderProps {
  products: readonly GiftFinderProduct[];
  recipients: readonly GiftFinderOption[];
  occasions: readonly GiftFinderOption[];
  className?: string;
}

const EMPTY: GiftFinderCriteria = { recipientId: null, occasionId: null, budgetId: null };

function ChoiceGroup({
  legend,
  step,
  options,
  value,
  onChange,
}: {
  legend: string;
  step: number;
  options: readonly GiftFinderOption[];
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 flex items-center gap-2.5 text-sm font-medium">
        <span
          aria-hidden
          className={cn(
            "inline-flex size-6 items-center justify-center rounded-full border text-[0.6875rem] tabular",
            value ? "border-gold bg-gold text-white" : "border-border bg-surface text-muted",
          )}
        >
          {step}
        </span>
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : option.id)}
              className={cn(
                "rounded-pill border px-3.5 py-2 text-sm transition-all duration-200",
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface hover:border-foreground/35 hover:bg-secondary",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * The signature discovery feature.
 *
 * The component owns only selection state and presentation — the matching
 * itself lives in `lib/recommend.ts`, which is a pure function over a compact
 * product projection.
 */
export function GiftFinder({ products, recipients, occasions, className }: GiftFinderProps) {
  const [criteria, setCriteria] = useState<GiftFinderCriteria>(EMPTY);
  const [results, setResults] = useState<readonly GiftRecommendation[] | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const hasSelection = Boolean(criteria.recipientId || criteria.occasionId || criteria.budgetId);

  function handleFind() {
    const labels = {
      recipient: recipients.find((option) => option.id === criteria.recipientId)?.label,
      occasion: occasions.find((option) => option.id === criteria.occasionId)?.label,
      budget: findBudgetBand(criteria.budgetId)?.label,
    };
    setResults(recommendProducts(products, criteria, labels, { limit: 4 }));
    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function handleReset() {
    setCriteria(EMPTY);
    setResults(null);
  }

  // The "see everything that matches" link reuses the catalogue's URL contract.
  const shopParams = new URLSearchParams();
  if (criteria.recipientId) shopParams.set("recipient", criteria.recipientId);
  if (criteria.occasionId) shopParams.set("occasion", criteria.occasionId);
  const shopHref = `/shop${shopParams.toString() ? `?${shopParams.toString()}` : ""}`;

  return (
    <div className={cn("surface-card p-6 sm:p-8 xl:p-10", className)}>
      <div className="grid gap-7 md:grid-cols-3 md:gap-8">
        <ChoiceGroup
          step={1}
          legend="Who is it for?"
          options={recipients}
          value={criteria.recipientId}
          onChange={(id) => setCriteria((current) => ({ ...current, recipientId: id as GiftFinderCriteria["recipientId"] }))}
        />
        <ChoiceGroup
          step={2}
          legend="What are you celebrating?"
          options={occasions}
          value={criteria.occasionId}
          onChange={(id) => setCriteria((current) => ({ ...current, occasionId: id as GiftFinderCriteria["occasionId"] }))}
        />
        <ChoiceGroup
          step={3}
          legend="What's your budget?"
          options={BUDGET_BANDS.map((band) => ({ id: band.id, label: band.label }))}
          value={criteria.budgetId}
          onChange={(id) => setCriteria((current) => ({ ...current, budgetId: id }))}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button size="lg" variant="gold" onClick={handleFind} disabled={!hasSelection}>
          <Sparkles aria-hidden className="size-4" />
          Find gifts
        </Button>
        {results ? (
          <Button size="lg" variant="ghost" onClick={handleReset}>
            Start over
          </Button>
        ) : (
          <p className="text-xs text-muted">Pick at least one — we&apos;ll do the rest.</p>
        )}
      </div>

      <div ref={resultsRef} aria-live="polite">
        {results ? (
          <div className="mt-8 animate-fade-up">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-lg">
                {results.length > 0 ? "We'd suggest these" : "Nothing quite matched"}
              </h3>
              <Link href={shopHref} className="text-xs underline underline-offset-4 transition-colors hover:text-burgundy">
                See everything that matches
              </Link>
            </div>

            {results.length > 0 ? (
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 xl:grid-cols-4">
                {results.map((recommendation) => (
                  <li key={recommendation.product.id}>
                    <GiftRecommendationCard recommendation={recommendation} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                Try widening the budget, or{" "}
                <Link href="/shop" className="underline underline-offset-4">
                  browse everything
                </Link>
                .
              </p>
            )}
          </div>
        ) : null}
      </div>

      {!results ? (
        <p className="mt-6 text-xs text-muted">
          Prefer to browse?{" "}
          <Link href="/shop" className={cn(buttonStyles({ variant: "ghost", size: "sm" }), "-my-1 px-2 underline underline-offset-4")}>
            See all gifts
          </Link>
        </p>
      ) : null}
    </div>
  );
}
