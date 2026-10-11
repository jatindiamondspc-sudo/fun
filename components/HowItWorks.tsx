export type Step = { title: string; body: string };

export function HowItWorks({ steps }: { steps: Step[] }) {
  return (
    <section className="bg-brand-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className="grid size-10 place-items-center rounded-full bg-white/10 font-display text-lg font-semibold text-brand-200 ring-1 ring-white/20">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1.5 leading-relaxed text-white/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
