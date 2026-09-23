import Link from "next/link";
import { org } from "@/lib/content";
import { PatchworkPlaceholder } from "@/components/ui/PatchworkPlaceholder";

export function MissionSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:gap-16 md:py-28">
      <div>
        <h2 className="max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Community-led change, rooted in opportunity.
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
          {org.mission}
        </p>
        <Link
          href="/about"
          className="mt-6 inline-block text-[15px] text-terracotta transition-colors hover:text-terracotta-deep"
        >
          Learn about AKSSADA →
        </Link>
      </div>

      <PatchworkPlaceholder
        seed={2}
        className="relative aspect-[4/5] w-full"
        label="Members of a forest-dwelling community in Karnataka"
      />
    </section>
  );
}
