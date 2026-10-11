import { Icon } from "./Icon";

type HeroProps = {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
  points: string[];
  children: React.ReactNode;
};

/** Soft color glow at the top of the page. Render it before <Header /> so it sits behind the header and hero. */
export function PageGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60rem] overflow-hidden">
      <div className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-brand-200/60 blur-3xl" />
      <div className="absolute top-40 -right-32 size-[26rem] rounded-full bg-rose-200/50 blur-3xl" />
    </div>
  );
}

export function Hero({ badge, title, subtitle, points, children }: HeroProps) {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-4 pb-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14 lg:pt-12 lg:pb-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-sm font-semibold text-brand-700 backdrop-blur">
            <Icon name="sparkles" className="size-4" />
            {badge}
          </p>
          <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-brand-950 sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">{subtitle}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {points.map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-ink/80 shadow-sm ring-1 ring-brand-100"
              >
                <Icon name="check" className="size-4 text-brand-600" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div id="join" className="scroll-mt-6">
          {children}
        </div>
      </div>
    </section>
  );
}
