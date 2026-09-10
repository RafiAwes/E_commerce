"use client";

import { StoreImage as Image } from "@/components/shared/StoreImage";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { COMMERCE } from "@/lib/constants";
import { formatPrice } from "@/lib/formatters";

const included = [
  "Recycled tissue and a hand-tied grosgrain ribbon",
  "A wax seal in Aurelia gold",
  "A letterpress card, hand-written with your message",
  "A rigid outer box so nothing arrives creased",
];

/**
 * Explains what the paid wrapping upgrade actually contains — the question
 * shoppers ask most often before ticking the box.
 */
export function GiftWrapDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-muted underline underline-offset-4 transition-colors hover:text-foreground"
      >
        What is included?
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Premium gift wrapping"
        description={`${formatPrice(COMMERCE.giftWrapPrice)} per order. Signature wrapping is always included for free.`}
        size="sm"
        footer={
          <Button fullWidth onClick={() => setOpen(false)}>
            Got it
          </Button>
        }
      >
        <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-image bg-secondary">
          <Image
            src="/images/editorial/gift-wrapping.svg"
            alt="A gift box wrapped in textured paper with a grosgrain ribbon"
            fill
            sizes="(min-width: 768px) 28rem, 90vw"
            className="object-cover"
          />
        </div>

        <ul className="flex flex-col gap-2.5 text-sm">
          {included.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-gold" />
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs text-muted">
          Prices are never shown anywhere in the packaging, so a gift can be sent straight to the recipient.
        </p>
      </Dialog>
    </>
  );
}
