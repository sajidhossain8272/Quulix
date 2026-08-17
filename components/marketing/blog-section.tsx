"use client";

import { ArrowUpRight, BookOpen, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  dateDay: string;
  dateMonth: string;
  readTime: string;
  excerpt: string;
  image: string;
}

const articles: Article[] = [
  {
    id: "article-1",
    slug: "what-leather-materials-we-use",
    title: "What Materials We Use: Aerospace Alloys & Full-Grain Leather",
    category: "Materials & Build",
    dateDay: "17",
    dateMonth: "AUG",
    readTime: "4 min read",
    excerpt:
      "A deep dive into how we select sustainable full-grain leather, anodized aerospace aluminum, and bio-cellulose diaphragm drivers for superior acoustic isolation.",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "article-2",
    slug: "our-story-acoustic-mastery",
    title: "Our Story: Designing Acoustic Harmony Without Visual Clutter",
    category: "Brand Story",
    dateDay: "12",
    dateMonth: "AUG",
    readTime: "5 min read",
    excerpt:
      "Why we stripped away flashy LEDs and brittle plastics in favor of tactile rotary dials, magnetic snap accessories, and enduring Scandinavian-inspired acoustics.",
    image:
      "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "article-3",
    slug: "color-accuracy-studio-acoustics",
    title: "Color Accuracy & Studio Acoustics: Tech Setup for Modern Creators",
    category: "Creator Studio",
    dateDay: "04",
    dateMonth: "AUG",
    readTime: "6 min read",
    excerpt:
      "How calibrated reference monitors and open-back planar headphones empower video editors, music producers, and UI designers to produce world-class digital work.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "article-4",
    slug: "our-audio-quality-standards",
    title: "Our Audio Quality Standards: Testing Frequency Response & Durability",
    category: "Engineering",
    dateDay: "28",
    dateMonth: "JUL",
    readTime: "4 min read",
    excerpt:
      "Behind the scenes in our acoustic chamber: harmonic distortion testing, stress-testing flex hinges over 50,000 cycles, and environmental heat tests.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
  },
];

export function BlogSection() {
  return (
    <section aria-labelledby="latest-articles-heading" className="content-auto py-14 sm:py-18 lg:py-22">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left pb-8 sm:pb-12 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-700 mb-2">
              <BookOpen className="h-3.5 w-3.5 text-amber-700" />
              <span>Tech Journal & Insights</span>
            </div>
            <h2
              id="latest-articles-heading"
              className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-950"
            >
              Latest Articles
            </h2>
            <p className="mt-2 max-w-xl text-sm sm:text-base text-stone-700">
              Expert guides on acoustic engineering, material science, workspace productivity, and audio care.
            </p>
          </div>

          <Link
            href="/category/all"
            className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-2.5 min-h-[44px] text-xs font-semibold uppercase tracking-[0.08em] text-stone-900 shadow-sm transition hover:border-stone-400 hover:bg-stone-50"
          >
            Explore All Guides
            <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-8 sm:pt-10">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-xl"
            >
              {/* Image & Date Badge */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-stone-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-950/10 transition-opacity group-hover:opacity-0" />

                {/* Date Badge */}
                <div className="absolute top-3 left-3 flex flex-col items-center justify-center rounded-xl bg-white px-2.5 py-1.5 shadow-md">
                  <span className="font-display text-base font-extrabold leading-none text-stone-950">
                    {article.dateDay}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700">
                    {article.dateMonth}
                  </span>
                </div>

                {/* Category Pill */}
                <div className="absolute bottom-3 right-3">
                  <span className="rounded-full bg-stone-950/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] font-medium text-stone-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      2026
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-stone-900 line-clamp-2 transition-colors group-hover:text-amber-800">
                    {article.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-stone-700 line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                {/* Bottom Read Action */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold uppercase tracking-[0.06em] text-stone-900 min-h-[44px]">
                  <span className="group-hover:text-amber-800 transition-colors">Read Article</span>
                  <ArrowUpRight className="h-4 w-4 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber-800" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
