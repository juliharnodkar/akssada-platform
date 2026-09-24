import Link from "next/link";
import { getApiUrl } from "@/lib/api";

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

export async function FeaturedInitiatives() {
  const initiatives = await getInitiatives();

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-terracotta">
              Featured initiatives
            </p>
          </div>

          <Link
            href="/initiatives"
            className="text-sm text-ink-soft transition-colors hover:text-terracotta-deep"
          >
            View all initiatives →
          </Link>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {initiatives.slice(0, 3).map((item) => (
            <Link
              key={item.slug}
              href={`/initiatives/${item.slug}`}
              className="group flex flex-col gap-4"
            >
              {item.coverImageUrl ? (
                <img
                  src={item.coverImageUrl}
                  alt={item.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="aspect-[4/3] w-full bg-stone-200" />
              )}

              <div>
                <span className="text-xs text-terracotta">
                  {item.focusArea}
                </span>

                <h3 className="mt-1 font-serif text-xl text-ink transition-colors group-hover:text-terracotta-deep">
                  {item.title}
                </h3>

                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {item.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
