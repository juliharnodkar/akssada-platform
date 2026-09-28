import { notFound } from "next/navigation";
import { getApiUrl } from "@/lib/api";
import { PageIntro } from "@/components/ui/PageIntro";

export const dynamic = "force-dynamic";

interface StoryDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImageUrl?: string;
  authorName?: string;
  category?: string;
  publishedAt: string;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${getApiUrl()}/api/v1/stories/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const story: StoryDetail = await res.json();
      return {
        title: `${story.title} | AKSSADA Stories`,
      };
    }
  } catch (e) {
    // ignore
  }
  return { title: "Story | AKSSADA" };
}

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let story: StoryDetail | null = null;
  try {
    const res = await fetch(`${getApiUrl()}/api/v1/stories/${slug}`, { cache: "no-store" });
    if (res.ok) {
      story = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch story", error);
  }

  if (!story) {
    notFound();
  }

  return (
    <main className="pb-24">
      <PageIntro title={story.title} description={story.category || "Story"} />
      <article className="mx-auto max-w-3xl px-6 py-12">
        {story.coverImageUrl && (
          <div className="mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={story.coverImageUrl} 
              alt={story.title} 
              className="w-full rounded-xl aspect-video object-cover shadow-sm"
            />
          </div>
        )}
        <div className="prose prose-lg prose-ink mx-auto text-ink-soft">
          {story.content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
        {story.authorName && (
          <div className="mt-12 pt-8 border-t border-line text-sm text-ink-soft/70">
            Written by <span className="font-medium text-ink-soft">{story.authorName}</span>
          </div>
        )}
      </article>
    </main>
  );
}
