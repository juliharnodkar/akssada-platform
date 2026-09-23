import Link from "next/link";
import { getInvolvedOptions } from "@/lib/content";

const hrefBySlug: Record<string, string> = {
  support: "/support",
  volunteer: "/volunteer",
  partner: "/partner",
};

export function GetInvolved() {
  return (
    <section className="border-y border-line bg-cream-deep">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Get involved
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {getInvolvedOptions.map((option) => (
            <Link
              key={option.slug}
              href={hrefBySlug[option.slug]}
              className="group flex min-h-[220px] flex-col justify-between rounded-md border border-line bg-cream p-8 transition-colors hover:border-terracotta"
            >
              <h3 className="font-serif text-2xl text-ink">{option.title}</h3>
              <div>
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  {option.description}
                </p>
                <span className="mt-4 inline-block text-sm text-terracotta transition-colors group-hover:text-terracotta-deep">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/volunteer"
            className="inline-block rounded-sm bg-terracotta px-6 py-3 text-[15px] text-cream transition-colors hover:bg-terracotta-deep"
          >
            Get Involved
          </Link>
        </div>
      </div>
    </section>
  );
}
