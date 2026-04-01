import Link from "next/link";

import { Container } from "@/components/shared/container";

export default function NotFound() {
  return (
    <Container className="py-12">
      <div className="rounded-[32px] border border-stone-200 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
          404
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-stone-950">
          This category does not exist.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
          The route is valid, but the requested category slug is not present in the mock API.
        </p>
        <Link
          href="/category/all"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-stone-800"
        >
          Browse all products
        </Link>
      </div>
    </Container>
  );
}
