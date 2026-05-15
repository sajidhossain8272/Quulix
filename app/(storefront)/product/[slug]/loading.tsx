import { Container } from "@/components/shared/container";

export default function Loading() {
  return (
    <main className="pb-16 sm:pb-20">
      <Container className="pt-6 sm:pt-8">
        <div className="mb-5 h-5 w-56 animate-pulse rounded-full bg-stone-200" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
          <section className="space-y-4">
            <div className="aspect-[4/4.4] animate-pulse rounded-[36px] bg-stone-200 sm:aspect-[4/4.1]" />
            <div className="space-y-4 rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="h-3 w-32 animate-pulse rounded-full bg-stone-200" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-28 animate-pulse rounded-[24px] bg-stone-100" />
                <div className="h-28 animate-pulse rounded-[24px] bg-stone-100" />
              </div>
            </div>
          </section>
          <section className="space-y-5">
            <div className="space-y-4 rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
              <div className="h-3 w-28 animate-pulse rounded-full bg-stone-200" />
              <div className="h-12 w-full animate-pulse rounded-[24px] bg-stone-200" />
              <div className="h-5 w-40 animate-pulse rounded-full bg-stone-200" />
              <div className="h-24 w-full animate-pulse rounded-[24px] bg-stone-100" />
              <div className="flex flex-wrap gap-3">
                <div className="h-10 w-28 animate-pulse rounded-full bg-stone-100" />
                <div className="h-10 w-32 animate-pulse rounded-full bg-stone-100" />
              </div>
            </div>
            <div className="space-y-4 rounded-[32px] border border-stone-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-7">
              <div className="h-16 animate-pulse rounded-[24px] bg-stone-100" />
              <div className="h-12 animate-pulse rounded-full bg-stone-200" />
              <div className="h-12 animate-pulse rounded-full bg-stone-100" />
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
