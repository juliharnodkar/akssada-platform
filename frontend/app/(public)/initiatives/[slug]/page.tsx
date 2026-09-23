import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { featuredInitiatives } from "@/lib/content";
import { PatchworkPlaceholder } from "@/components/ui/PatchworkPlaceholder";

type Props = {
  params: Promise<{ slug: string }>;
};

function getInitiative(slug: string) {
  return featuredInitiatives.find((item) => item.slug === slug);
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const initiative = getInitiative(slug);
  if (!initiative) return { title: "Initiative | AKSSADA" };
  return {
    title: `${initiative.title} | AKSSADA`,
    description: initiative.description,
  };
}

export async function generateStaticParams() {
  return featuredInitiatives.map((item) => ({ slug: item.slug }));
}

export default async function InitiativeDetailPage({ params }: Props) {
  const { slug } = await params;
  const initiative = getInitiative(slug);
  if (!initiative) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <span className="text-xs text-terracotta">{initiative.status}</span>
      <h1 className="mt-2 font-serif text-4xl leading-tight text-ink">
        {initiative.title}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">{initiative.focusArea}</p>

      <PatchworkPlaceholder seed={30} className="relative mt-8 aspect-[16/9] w-full" />

      <p className="mt-8 text-[15px] leading-relaxed text-ink-soft">
        {initiative.description}
      </p>
      <p className="mt-6 text-sm text-ink-soft/70">
        Full initiative content will be added here once it&apos;s available
        through the Initiatives API.
      </p>
    </main>
  );
}
