"use client";

import { Tag, X } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";

/** Promotion codes are simulated; the UI still exercises every real state. */
export function PromoCodeForm() {
  const id = useId();
  const { promo, applyPromo, removePromo } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = applyPromo(code);
    setError(result.ok ? "" : result.message);
    if (result.ok) setCode("");
  }

  if (promo) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-button bg-sage-tint px-3.5 py-3 text-sm">
        <span className="flex min-w-0 items-center gap-2">
          <Tag aria-hidden className="size-3.5 shrink-0 text-success" />
          <span className="truncate">
            <span className="font-medium">{promo.code}</span> — {promo.label}
          </span>
        </span>
        <button
          type="button"
          onClick={removePromo}
          aria-label={`Remove promotion code ${promo.code}`}
          className="shrink-0 rounded p-1 text-muted transition-colors hover:text-danger"
        >
          <X aria-hidden className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={id} className="text-[0.8125rem] font-medium">
        Promotion code
      </label>
      <div className="mt-1.5 flex gap-2">
        <input
          id={id}
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            if (error) setError("");
          }}
          placeholder="AURELIA10"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "h-11 min-w-0 flex-1 rounded-input border border-border bg-surface px-3.5 text-sm uppercase transition-colors placeholder:normal-case placeholder:text-muted/70 focus:border-foreground/40 focus-visible:outline-none",
            error && "border-danger",
          )}
        />
        <Button type="submit" variant="subtle" disabled={code.trim().length === 0}>
          Apply
        </Button>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </form>
  );
}
