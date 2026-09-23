import Link from "next/link";
import { PatchworkPlaceholder } from "@/components/ui/PatchworkPlaceholder";

export function StoriesPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Stories from the field
        </h2>
        <Link
          href="/stories"
          className="text-[15px] text-terracotta transition-colors hover:text-terracotta-deep"
        >
          View all stories →
        </Link>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-4">
            <PatchworkPlaceholder seed={20 + i} className="relative aspect-[4/3] w-full" />
            <div>
              <h3 className="font-serif text-xl text-ink-soft">
                Story coming soon
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft/70">
                We&apos;re documenting stories from AKSSADA&apos;s work as
                initiatives progress. Check back here as they&apos;re
                published.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
