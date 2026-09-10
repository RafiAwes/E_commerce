"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/shared/EmptyState";

/**
 * Root error boundary. Errors are reported to the console here; in production
 * this is where a monitoring client would be called.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16 md:py-24">
      <EmptyState
        className="surface-card"
        icon={<AlertTriangle aria-hidden className="size-6" />}
        titleAs="h1"
        title="Something went wrong"
        description="That is on us. Try again — and if it keeps happening, the rest of the store is still open."
        action={<Button onClick={reset}>Try again</Button>}
        secondaryAction={
          <Link href="/" className={buttonStyles({ variant: "outline" })}>
            Back to home
          </Link>
        }
      />
      {error.digest ? <p className="mt-6 text-center text-xs text-muted tabular">Reference: {error.digest}</p> : null}
    </Container>
  );
}
