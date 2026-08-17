"use client";

import { Leaf, Scale, ShieldCheck } from "lucide-react";

import { Container } from "@/components/shared/container";

const valueProps = [
  {
    icon: Leaf,
    title: "Natural & Sustainable Materials",
    description:
      "Engineered with anodized aerospace aluminum, bio-cellulose drivers, and eco-friendly recyclable packaging.",
  },
  {
    icon: ShieldCheck,
    title: "1 Year Official Warranty",
    description:
      "Comprehensive manufacturer coverage and quick local replacement support on all Quulix audio and tech gear.",
  },
  {
    icon: Scale,
    title: "Honest & Transparent Pricing",
    description:
      "Direct-to-consumer pricing with zero middleman markup. World-class acoustic engineering accessible to everyone.",
  },
];

export function ValueProps() {
  return (
    <section aria-label="Brand value propositions" className="py-14 sm:py-18 bg-white/60 border-y border-stone-200/80">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10 lg:gap-12">
          {valueProps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center group transition duration-300"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-stone-100 text-stone-900 shadow-sm border border-stone-200/80 transition-all duration-300 group-hover:scale-110 group-hover:bg-stone-950 group-hover:text-white group-hover:shadow-lg">
                  <Icon className="h-9 w-9 stroke-[1.5]" />
                </div>
                <h3 className="mt-5 font-display text-lg sm:text-xl font-bold text-stone-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600 max-w-xs">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
