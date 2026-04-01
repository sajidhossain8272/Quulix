import { Container } from "@/components/shared/container";
import { SectionSkeleton } from "@/components/ui/section-skeleton";

export default function Loading() {
  return (
    <main className="pb-16 sm:pb-20">
      <Container className="pt-4 sm:pt-6">
        <div className="min-h-[480px] animate-pulse rounded-[32px] bg-stone-200 sm:min-h-[560px]" />
      </Container>
      <Container className="space-y-12 pt-8 sm:space-y-16 sm:pt-10">
        <SectionSkeleton cards={4} />
        <SectionSkeleton cards={4} />
      </Container>
    </main>
  );
}
