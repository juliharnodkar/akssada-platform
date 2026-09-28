import type { Metadata } from "next";
import { focusAreas, featuredInitiatives } from "@/lib/content";
import { PageIntro } from "@/components/ui/PageIntro";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | AKSSADA",
  description:
    "AKSSADA is a community-focused initiative working alongside the Siddi community in Karnataka.",
};

export default function AboutPage() {
  return (
    <main>
      {/* 1. ABOUT AKSSADA */}
      <PageIntro
        title="Creating opportunities. Strengthening communities."
        description="AKSSADA is a community-focused initiative working alongside the Siddi community in Karnataka to create opportunities in education, sustainable livelihoods, youth development, and community growth."
      />

      {/* 2. THE SIDDI COMMUNITY */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              Heritage & Aspiration
            </span>
            <h2 className="mt-2 font-serif text-3xl font-medium text-ink md:text-4xl">
              The Siddi Community
            </h2>
          </div>
          <div className="space-y-6 text-[16px] leading-relaxed text-ink-soft lg:col-span-7">
            <p>
              The Siddi community in Karnataka represents a unique cultural tapestry with deep historical roots along the Western Ghats. Known for their rich traditions, music, dance, and deep Connection to the natural ecosystem, Siddi families carry forward centuries of heritage.
            </p>
            <p>
              We work together to foster pathways where cultural identity is celebrated, local aspirations are nurtured, and young people have access to modern tools and economic choices while honoring their ancestral roots.
            </p>
          </div>
        </div>
      </section>

      {/* 3. OUR MISSION */}
      <section className="border-y border-line bg-sand/30 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-moss-deep">
            Our Purpose
          </span>
          <h2 className="mt-2 font-serif text-3xl font-medium text-ink md:text-4xl">
            Our Mission
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
            To walk alongside community members in building self-reliant futures by combining traditional wisdom with practical opportunities in livelihoods, education, sports, and eco-conservation.
          </p>
        </div>
      </section>

      {/* 4. WHAT WE FOCUS ON */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              Areas of Activity
            </span>
            <h2 className="mt-2 font-serif text-3xl font-medium text-ink md:text-4xl">
              What We Focus On
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.slice(0, 4).map((area) => (
              <div
                key={area.slug}
                className="flex flex-col justify-between rounded-lg border border-line bg-surface p-6 shadow-xs"
              >
                <div>
                  <h3 className="font-serif text-lg font-medium text-ink">
                    {area.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                    {area.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW WE WORK */}
      <section className="border-t border-line bg-sand/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              Values & Philosophy
            </span>
            <h2 className="mt-2 font-serif text-3xl font-medium text-ink md:text-4xl">
              How We Work
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-line bg-surface p-6 shadow-xs">
              <div className="h-2 w-8 bg-terracotta mb-4 rounded-full" />
              <h3 className="font-serif text-xl font-medium text-ink">Community-Led</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                Initiatives are defined, shaped, and driven in active collaboration with local community members and leaders.
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface p-6 shadow-xs">
              <div className="h-2 w-8 bg-moss mb-4 rounded-full" />
              <h3 className="font-serif text-xl font-medium text-ink">Inclusive</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                Ensuring equitable participation across women&apos;s groups, youth, and families across forest villages.
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface p-6 shadow-xs">
              <div className="h-2 w-8 bg-terracotta-deep mb-4 rounded-full" />
              <h3 className="font-serif text-xl font-medium text-ink">Sustainable</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                Balancing economic growth with long-term ecological stewardship and cultural continuity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR INITIATIVES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-moss-deep">
            Current Programs
          </span>
          <h2 className="mt-2 font-serif text-3xl font-medium text-ink md:text-4xl">
            Our Initiatives
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredInitiatives.map((init) => (
            <div
              key={init.slug}
              className="rounded-lg border border-line bg-surface p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-terracotta">
                  {init.status}
                </span>
                <h3 className="mt-2 font-serif text-xl font-medium text-ink">
                  {init.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                  {init.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line/60">
                <Link
                  href="/initiatives"
                  className="text-xs font-semibold text-terracotta hover:text-terracotta-deep transition-colors inline-flex items-center gap-1"
                >
                  View details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. GET INVOLVED */}
      <section className="border-t border-line bg-surface py-20 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
            Join The Journey
          </span>
          <h2 className="mt-2 font-serif text-3xl font-medium text-ink md:text-4xl">
            Get Involved
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            Whether you wish to support initiatives, volunteer your time and skills, explore partnership opportunities, or simply connect with our team, we welcome your involvement.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/volunteer"
              className="rounded-md bg-terracotta px-6 py-3 text-[15px] font-medium text-cream transition-colors hover:bg-terracotta-deep shadow-xs"
            >
              Volunteer
            </Link>
            <Link
              href="/support"
              className="rounded-md border border-line px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-line/40"
            >
              Support Us
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-line px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-line/40"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


