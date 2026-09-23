import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="bg-forest text-cream">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
        <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">
          Be part of sustainable community development.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/support"
            className="rounded-sm bg-terracotta px-6 py-3 text-[15px] text-cream transition-colors hover:bg-terracotta-deep"
          >
            Support Our Work
          </Link>
          <Link
            href="/contact"
            className="rounded-sm border border-cream/40 px-6 py-3 text-[15px] text-cream transition-colors hover:border-cream"
          >
            Contact AKSSADA
          </Link>
        </div>
      </div>
    </section>
  );
}
