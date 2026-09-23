import Link from "next/link";
import type { ReactNode } from "react";
import { focusAreas } from "@/lib/content";

const icons: Record<string, ReactNode> = {
  "sustainable-livelihoods": (
    <path d="M12 2 4 6.5v11L12 22l8-4.5v-11L12 2Zm0 4.5 4.5 2.5-4.5 2.5-4.5-2.5L12 6.5Z" />
  ),
  "education-skills": (
    <path d="M4 6.5 12 3l8 3.5-8 3.5-8-3.5Zm2 2.2v7.3L12 19l6-3v-7.3l-6 2.6-6-2.6Z" />
  ),
  "cultural-heritage": (
    <path d="M12 2 15 9l7 1-5.2 4.8L18.2 22 12 18.3 5.8 22l1.4-7.2L2 10l7-1 3-7Z" />
  ),
  "environmental-protection": (
    <path d="M20 4c-8 0-14 6-14 13 0 .7.6 1 1.2.7C10 15.5 14 11 20 4Zm-11 15c-2-2-3-4.5-3-7 0-1.2.2-2.3.5-3.3C4 11 3 14 3 17c0 1 .1 2 .3 3H9Z" />
  ),
  "youth-leadership": (
    <path d="M12 2c2 2.5 3 5 3 7.5C15 14 12 17 12 22c0-5-3-8-3-12.5C9 7 10 4.5 12 2Z" />
  ),
};

export function FocusAreas() {
  return (
    <section className="border-y border-line bg-cream-deep">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Our areas of work
        </h2>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area) => (
            <div key={area.slug} className="flex flex-col gap-3 pr-4">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-terracotta"
                aria-hidden="true"
              >
                {icons[area.slug]}
              </svg>
              <h3 className="font-serif text-xl text-ink">{area.title}</h3>
              <p className="text-[15px] leading-relaxed text-ink-soft">
                {area.description}
              </p>
              <Link
                href="/initiatives"
                className="mt-1 text-sm text-terracotta transition-colors hover:text-terracotta-deep"
              >
                See related initiatives →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
