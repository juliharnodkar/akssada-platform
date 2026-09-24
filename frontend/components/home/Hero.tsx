import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden border-b border-line">
      <img
        src="/images/akssada-hero.png"
        alt="Forest landscape and community surroundings in rural Karnataka"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/40 to-forest-deep/10" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-32 text-cream">
        <h1 className="max-w-2xl font-serif text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
          Building sustainable futures with communities.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
          AKSSADA works with the Siddi community and other forest-dwelling
          communities in Karnataka through sustainable livelihoods,
          education, cultural preservation, and environmental initiatives.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/support"
            className="rounded-sm bg-terracotta px-6 py-3 text-[15px] text-cream transition-colors hover:bg-terracotta-deep"
          >
            Support Our Work
          </Link>

          <Link
            href="/initiatives"
            className="rounded-sm border border-cream/40 px-6 py-3 text-[15px] text-cream transition-colors hover:border-cream"
          >
            Explore Our Initiatives
          </Link>
        </div>
      </div>
    </section>
  );
}
