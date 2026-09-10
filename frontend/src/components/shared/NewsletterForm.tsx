"use client";

import { Check, Loader2 } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { newsletterService } from "@/services/newsletter.service";
import { cn } from "@/lib/utils";

type Status = "idle" | "pending" | "success" | "error";

/**
 * Reusable subscription form. Validation lives in the service layer, so the
 * component only orchestrates the four states it can be in.
 */
export function NewsletterForm({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("pending");
    const result = await newsletterService.subscribe(email);
    setStatus(result.status);
    setMessage(result.message);
    if (result.status === "success") setEmail("");
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className={cn(
          "flex items-center gap-2.5 rounded-button px-4 py-3.5 text-sm",
          tone === "dark" ? "bg-background/10 text-background" : "bg-sage-tint text-[#455040]",
          className,
        )}
      >
        <Check aria-hidden className="size-4 shrink-0" />
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)} noValidate>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={id} className="sr-only">
            Email address
          </label>
          <input
            id={id}
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "error") setStatus("idle");
            }}
            required
            placeholder="you@example.com"
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? `${id}-error` : undefined}
            className={cn(
              "h-12 w-full rounded-button border px-4 text-sm transition-colors focus-visible:outline-none",
              tone === "dark"
                ? "border-background/25 bg-background/10 text-background placeholder:text-background/50 focus:border-background/50"
                : "border-border bg-surface placeholder:text-muted/70 focus:border-foreground/40",
              status === "error" && "border-danger",
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          variant={tone === "dark" ? "gold" : "primary"}
          disabled={status === "pending"}
          className="h-12 shrink-0"
        >
          {status === "pending" ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
          {status === "pending" ? "Subscribing" : "Subscribe"}
        </Button>
      </div>
      {status === "error" ? (
        <p id={`${id}-error`} role="alert" className={cn("mt-2 text-xs", tone === "dark" ? "text-rose-soft" : "text-danger")}>
          {message}
        </p>
      ) : (
        <p className={cn("mt-2.5 text-xs", tone === "dark" ? "text-background/60" : "text-muted")}>
          One email a month. Unsubscribe whenever you like.
        </p>
      )}
    </form>
  );
}
