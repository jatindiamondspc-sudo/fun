export type FaqItem = { q: string; a: string };

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-950 sm:text-4xl">Questions</h2>
      <div className="mt-8 divide-y divide-brand-100 rounded-2xl bg-white shadow-sm ring-1 ring-brand-100">
        {items.map((item) => (
          <details key={item.q} className="group px-5 py-4 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden="true" className="text-xl text-brand-500 transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-2 leading-relaxed text-ink/70">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
