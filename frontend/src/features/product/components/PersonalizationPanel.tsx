"use client";

import { PenLine } from "lucide-react";
import { useId } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { PersonalizationErrors } from "@/lib/validations/personalization";
import type { LineItemPersonalization, PersonalizationSpec } from "@/types/common";

export interface PersonalizationPanelProps {
  spec: PersonalizationSpec;
  value: LineItemPersonalization;
  onChange: (value: LineItemPersonalization) => void;
  errors: PersonalizationErrors;
}

const surfaceStyles: Record<PersonalizationSpec["surface"], string> = {
  ornament: "aspect-square rounded-full bg-gold-tint",
  plaque: "aspect-[5/2] rounded-lg bg-[#efe3d2]",
  frame: "aspect-[5/2] rounded-sm border-8 border-[#8a6a4c] bg-surface",
  keepsake: "aspect-square rounded-full bg-gold-soft",
};

/**
 * Personalization is deliberately its own panel rather than being folded into
 * the generic product page: only personalized products render it, and its
 * validation lives in `lib/validations/personalization.ts`.
 */
export function PersonalizationPanel({ spec, value, onChange, errors }: PersonalizationPanelProps) {
  const baseId = useId();
  const activeStyle = spec.styles.find((style) => style.id === value.styleId) ?? spec.styles[0];
  const previewText = value.name.trim() || spec.namePlaceholder.replace(/^e\.g\.\s*/i, "");

  return (
    <section aria-labelledby={`${baseId}-heading`} className="rounded-card border border-gold-soft bg-gold-tint/45 p-5">
      <h3 id={`${baseId}-heading`} className="flex items-center gap-2 font-sans text-sm font-medium">
        <PenLine aria-hidden className="size-4 text-gold" />
        Personalize this piece
      </h3>
      <p className="mt-1.5 text-xs text-muted">Engraved by hand before wrapping. Allow one extra working day.</p>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Input
            id={`${baseId}-name`}
            label={spec.nameLabel}
            placeholder={spec.namePlaceholder}
            value={value.name}
            maxLength={spec.maxNameLength}
            error={errors.name}
            hint={`${value.name.length}/${spec.maxNameLength} characters`}
            onChange={(event) => onChange({ ...value, name: event.target.value })}
            required
          />

          {spec.supportsMessage ? (
            <Textarea
              id={`${baseId}-message`}
              label="Short message (optional)"
              placeholder="A line for the reverse"
              value={value.message}
              maxLength={spec.maxMessageLength}
              error={errors.message}
              hint={`${value.message.length}/${spec.maxMessageLength} characters`}
              onChange={(event) => onChange({ ...value, message: event.target.value })}
              className="min-h-[4.5rem]"
            />
          ) : null}

          <fieldset>
            <legend className="mb-2 text-[0.8125rem] font-medium">Lettering style</legend>
            <div className="flex flex-wrap gap-2">
              {spec.styles.map((style) => {
                const selected = style.id === activeStyle?.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onChange({ ...value, styleId: style.id, styleName: style.name })}
                    className={cn(
                      "rounded-pill border px-3 py-1.5 text-xs transition-colors",
                      selected ? "border-foreground bg-foreground text-background" : "border-border bg-surface hover:border-foreground/35",
                    )}
                  >
                    {style.name}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Simulated preview — indicative of the engraving, not a proof. */}
        <div className="flex flex-col">
          <p className="eyebrow mb-2.5 text-muted">Preview</p>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-surface p-5">
            <div
              className={cn(
                "flex w-full max-w-56 flex-col items-center justify-center gap-1 px-4 text-center shadow-subtle",
                surfaceStyles[spec.surface],
              )}
            >
              <span className={cn("text-lg leading-tight break-words text-[#6b5322]", activeStyle?.previewFontClass)}>
                {previewText}
              </span>
              {spec.supportsMessage && value.message.trim() ? (
                <span className="text-[0.625rem] leading-snug text-[#8a7248]">{value.message}</span>
              ) : null}
            </div>
          </div>
          <p className="mt-2 text-[0.6875rem] text-muted">
            An indication of layout. Final engraving is centred and set by hand.
          </p>
        </div>
      </div>
    </section>
  );
}
