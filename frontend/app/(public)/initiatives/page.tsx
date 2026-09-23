import type { Metadata } from "next";
import Link from "next/link";
import { featuredInitiatives } from "@/lib/content";
import { PageIntro } from "@/components/ui/PageIntro";
import { PatchworkPlaceholder } from "@/components/ui/PatchworkPlaceholder";

export const metadata: Metadata = {
  title: "Initiatives | AKSSADA",
  description:
    "AKSSADA's initiatives across sustainable livelihoods, education, cultural heritage, environment, and youth leadership.",
};

export default function InitiativesPage() {
  return (
    <main>
      <PageIntro
        title="Initiatives"
        description="Work AKSSADA is building across its five focus areas — from active pilots to planned programs."
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {featuredInitiatives.map((item, i) => (
            <Link
              key={item.slug}
              href={`/initiatives/${item.slug}`}
              className="group flex flex-col gap-4"
            >
              <PatchworkPlaceholder
                seed={10 + i}
                className="relative aspect-[4/3] w-full"
              />
              <div>
                <span className="text-xs text-terracotta">{item.status}</span>
                <h2 className="mt-1 font-serif text-xl text-ink transition-colors group-hover:text-terracotta-deep">
                  {item.title}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
