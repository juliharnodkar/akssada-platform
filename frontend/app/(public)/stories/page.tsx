import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { PatchworkPlaceholder } from "@/components/ui/PatchworkPlaceholder";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export const metadata: Metadata = {
  title: "Stories | AKSSADA",
  description: "Stories from AKSSADA's work with forest-dwelling communities in Karnataka.",
};

export const dynamic = "force-dynamic";

interface StorySummary {
  id: string;
  title: string;
  slug: string;
  coverImageUrl?: string;
  authorName?: string;
  category?: string;
  publishedAt: string;
}

export default async function StoriesPage() {
  let stories: StorySummary[] = [];
  try {
    const res = await fetch(`${getApiUrl()}/api/v1/stories`, { cache: 'no-store' });
    if (res.ok) {
      stories = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch stories", error);
  }

  return (
    <main>
      <PageIntro
        title="Stories"
        description="Stories from the field will be published here as AKSSADA's initiatives progress."
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {stories.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <h2 className="font-serif text-2xl text-ink-soft">Stories coming soon</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft/70">
                Check back here as new stories are published.
              </p>
            </div>
          ) : (
            stories.map((story, i) => (
              <div key={story.id} className="flex flex-col gap-4">
                <Link href={`/stories/${story.slug}`}>
                  {story.coverImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={story.coverImageUrl} alt={story.title} className="relative aspect-[4/3] w-full object-cover rounded-lg" />
                  ) : (
                    <PatchworkPlaceholder seed={20 + i} className="relative aspect-[4/3] w-full rounded-lg overflow-hidden" />
                  )}
                </Link>
                <div>
                  <h2 className="font-serif text-xl text-ink-soft hover:underline">
                    <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                  </h2>
                  {story.category && (
                    <span className="mt-2 text-sm text-indigo-600 font-medium tracking-wide uppercase">{story.category}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
