import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApiUrl } from "@/lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

type Initiative = {
  title: string;
  slug: string;
  focusArea: string;
  summary: string;
  content: string;
  coverImageUrl?: string | null;
};

async function getInitiative(slug: string): Promise<Initiative | null> {
  const res = await fetch(
    `${getApiUrl()}/api/v1/initiatives/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const initiative = await getInitiative(slug);

  if (!initiative) {
    return { title: "Initiative | AKSSADA" };
  }

  return {
    title: `${initiative.title} | AKSSADA`,
    description: initiative.summary,
  };
}

export default async function InitiativeDetailPage({ params }: Props) {
  const { slug } = await params;
  const initiative = await getInitiative(slug);

  if (!initiative) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <span className="text-xs text-terracotta">
        {initiative.focusArea}
      </span>

      <h1 className="mt-2 font-serif text-4xl leading-tight text-ink">
        {initiative.title}
      </h1>

      <p className="mt-2 text-sm text-ink-soft">
        {initiative.focusArea}
      </p>

      {initiative.coverImageUrl ? (
        <img
          src={initiative.coverImageUrl}
          alt={initiative.title}
          className="mt-8 aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="mt-8 flex aspect-[16/9] w-full items-center justify-center bg-stone-100 text-sm text-ink-soft">
          No cover image available
        </div>
      )}

      <p className="mt-8 text-[15px] leading-relaxed text-ink-soft">
        {initiative.summary}
      </p>

      <div className="mt-8 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
        {initiative.content}
      </div>
    </main>
  );
}
