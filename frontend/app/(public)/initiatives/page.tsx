import type { Metadata } from "next";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Initiatives | AKSSADA",
  description:
    "AKSSADA's initiatives across sustainable livelihoods, education, cultural heritage, environment, and youth leadership.",
};

type Initiative = {
  title: string;
  slug: string;
  focusArea: string;
  summary: string;
  coverImageUrl?: string | null;
};

async function getInitiatives(): Promise<Initiative[]> {
  const res = await fetch(`${getApiUrl()}/api/v1/initiatives`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch initiatives");
  }

  return res.json();
}

export default async function InitiativesPage() {
  const initiatives = await getInitiatives();

  return (
    <main>
      <PageIntro
        title="Initiatives"
        description="Work AKSSADA is building across its five focus areas - from active pilots to planned programs."
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {initiatives.map((item) => (
            <Link
              key={item.slug}
              href={`/initiatives/${item.slug}`}
              className="group flex flex-col gap-4"
            >
              {item.coverImageUrl ? (
                <img
                  src={item.coverImageUrl}
                  alt={item.title}
                  className="relative aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="relative aspect-[4/3] w-full bg-stone-200" />
              )}

              <div>
                <span className="text-xs text-terracotta">
                  {item.focusArea}
                </span>

                <h2 className="mt-1 font-serif text-xl text-ink transition-colors group-hover:text-terracotta-deep">
                  {item.title}
                </h2>

                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {item.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
