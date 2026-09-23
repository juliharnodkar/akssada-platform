import type { Metadata } from "next";
import { org } from "@/lib/content";
import { PageIntro } from "@/components/ui/PageIntro";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | AKSSADA",
  description:
    "AKSSADA is a Section 8 non-profit working with the Siddi community and other forest-dwelling communities in Karnataka.",
};

export default function AboutPage() {
  return (
    <main>
      <PageIntro
        title="About AKSSADA"
        description={org.mission}
      />
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-4 font-serif text-3xl text-ink">Our History</h2>
            <p className="mb-4 text-[15px] leading-relaxed text-ink-soft">
              {org.fullName} is a registered Section 8 non-profit dedicated to uplifting marginalized groups living in and around the forests of Karnataka.
            </p>
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Founded on the belief that conservation and human well-being must go hand-in-hand, we have spent years collaborating with local leaders to build programs that respect indigenous traditions while opening new pathways to prosperity.
            </p>
          </div>
          <div>
            <h2 className="mb-4 font-serif text-3xl text-ink">Our Approach</h2>
            <ul className="flex flex-col gap-4 text-[15px] leading-relaxed text-ink-soft">
              <li className="flex items-start gap-3">
                <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-terracotta shrink-0" />
                <span><strong>Community-Led:</strong> We do not impose solutions; we co-design them with the people who will run them.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-terracotta shrink-0" />
                <span><strong>Holistic:</strong> Livelihoods, education, and health are interconnected. Our programs address all three simultaneously.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-terracotta shrink-0" />
                <span><strong>Sustainable:</strong> We prioritize eco-friendly initiatives that protect the rich biodiversity of the Western Ghats.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-line pt-16 text-center">
          <h2 className="mb-6 font-serif text-3xl text-ink">Join Our Mission</h2>
          <p className="mx-auto mb-8 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            Whether you want to support our existing initiatives, volunteer your skills, or partner with us on a new project, there is a place for you in our community.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/volunteer"
              className="rounded-sm bg-terracotta px-6 py-3 text-[15px] text-cream transition-colors hover:bg-terracotta-deep"
            >
              Get Involved
            </Link>
            <Link
              href="/contact"
              className="rounded-sm border border-line px-6 py-3 text-[15px] text-ink transition-colors hover:bg-line/50"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
