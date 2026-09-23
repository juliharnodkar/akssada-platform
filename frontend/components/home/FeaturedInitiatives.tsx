import Link from "next/link";
import { featuredInitiatives } from "@/lib/content";
import { PatchworkPlaceholder } from "@/components/ui/PatchworkPlaceholder";

export function FeaturedInitiatives() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Featured initiatives
        </h2>
        <Link
          href="/initiatives"
          className="text-[15px] text-terracotta transition-colors hover:text-terracotta-deep"
        >
          View all initiatives →
        </Link>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {featuredInitiatives.map((item, i) => (
          <Link
            key={item.slug}
            href={`/initiatives/${item.slug}`}
            className="group flex flex-col gap-4"
          >
            <PatchworkPlaceholder seed={10 + i} className="relative aspect-[4/3] w-full" />
            <div>
              <span className="text-xs text-terracotta">{item.status}</span>
              <h3 className="mt-1 font-serif text-xl text-ink transition-colors group-hover:text-terracotta-deep">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
