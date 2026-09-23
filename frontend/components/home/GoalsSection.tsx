import { threeYearGoals } from "@/lib/content";

export function GoalsSection() {
  return (
    <section className="bg-forest text-cream">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="max-w-md font-serif text-3xl leading-tight sm:text-4xl">
          Looking ahead
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream/70">
          These are AKSSADA&apos;s stated goals for the next three years, not
          figures already achieved.
        </p>

        <dl className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {threeYearGoals.map((goal) => (
            <div key={goal.label} className="border-t border-cream/20 pt-5">
              <dt className="sr-only">{goal.label}</dt>
              <dd className="font-serif text-4xl text-cream sm:text-5xl">
                {goal.value}
              </dd>
              <p className="mt-2 max-w-[16rem] text-[15px] leading-snug text-cream/75">
                {goal.label}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
