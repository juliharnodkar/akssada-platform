export function PageIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-line bg-cream-deep">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <h1 className="max-w-2xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          {description}
        </p>
      </div>
    </section>
  );
}
