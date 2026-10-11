import { Icon, type IconName } from "./Icon";

export type Feature = { icon: IconName; title: string; body: string };

export function Features({ heading, intro, items }: { heading: string; intro: string; items: Feature[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-950 sm:text-4xl">{heading}</h2>
        <p className="mt-3 text-lg text-ink/70">{intro}</p>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
            <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name={item.icon} className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-1.5 leading-relaxed text-ink/70">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
