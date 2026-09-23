import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { PatchworkPlaceholder } from "@/components/ui/PatchworkPlaceholder";

export const metadata: Metadata = {
  title: "Stories | AKSSADA",
  description: "Stories from AKSSADA's work with forest-dwelling communities in Karnataka.",
};

export default function StoriesPage() {
  return (
    <main>
      <PageIntro
        title="Stories"
        description="Stories from the field will be published here as AKSSADA's initiatives progress."
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <PatchworkPlaceholder seed={20 + i} className="relative aspect-[4/3] w-full" />
              <div>
                <h2 className="font-serif text-xl text-ink-soft">
                  Story coming soon
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft/70">
                  Check back here as new stories are published.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
