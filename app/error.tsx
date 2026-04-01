"use client";

import { useEffect } from "react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-12">
      <div className="rounded-[32px] border border-red-200 bg-red-50/80 p-8 shadow-[0_20px_60px_rgba(185,28,28,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-500">
          Application error
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-950">
          The storefront hit an unexpected state.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
          Reset the route segment to retry rendering. The error boundary is wired and ready
          for production debugging flows.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </Container>
  );
}
