import { Icon } from "./Icon";

export function CtaBand({ title, body, label }: { title: string; body: string; label: string }) {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:pb-24">
      <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-rose-500 px-6 py-12 text-center text-white sm:px-12">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-white/85">{body}</p>
        <a
          href="#join"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-brand-800 shadow-lg transition hover:bg-brand-50"
        >
          {label}
          <Icon name="arrow" className="size-5" />
        </a>
      </div>
    </section>
  );
}
