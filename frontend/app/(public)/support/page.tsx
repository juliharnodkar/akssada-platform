import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support | AKSSADA",
  description: "Ways to support AKSSADA's work with forest-dwelling communities in Karnataka.",
};

export default function SupportPage() {
  return (
    <main>
      <PageIntro
        title="Support Our Work"
        description="Your support helps sustain AKSSADA's work across livelihoods, education, culture, and the environment."
      />
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-12">
          <h2 className="mb-4 font-serif text-3xl text-ink">Make an Impact</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Direct donations will be processed securely here in a future update. For now, explore how your contribution can create tangible change on the ground.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Livelihood Kit",
              amount: "₹2,500",
              desc: "Provides a family with initial supplies for beekeeping or a medicinal plant nursery.",
            },
            {
              title: "Student Support",
              amount: "₹5,000",
              desc: "Sponsors one year of supplementary education and skills training for a young student.",
            },
            {
              title: "Community Program",
              amount: "₹10,000",
              desc: "Funds a village-level workshop on sustainable farming or forest-fire prevention.",
            },
          ].map((tier) => (
            <div key={tier.title} className="flex flex-col border border-line bg-cream p-6">
              <h3 className="font-serif text-xl text-ink">{tier.title}</h3>
              <p className="mt-2 text-2xl text-terracotta">{tier.amount}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">{tier.desc}</p>
              <button
                type="button"
                className="mt-6 rounded-sm bg-line px-4 py-2 text-sm text-ink-soft cursor-not-allowed opacity-70"
                disabled
              >
                Coming Soon
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-sm bg-cream-deep p-8 text-center border border-line">
          <h3 className="mb-3 font-serif text-2xl text-ink">Other Ways to Give</h3>
          <p className="mx-auto mb-6 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            If you represent a corporate CSR program, a foundation, or wish to make an offline donation via bank transfer, please reach out to us directly.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-sm bg-ink px-6 py-3 text-[15px] text-cream transition-colors hover:bg-ink/90"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
