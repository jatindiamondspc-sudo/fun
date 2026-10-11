import Link from "next/link";
import { Icon } from "./Icon";
import { site } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-tight text-brand-900">
      <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-white">
        <Icon name="heart" className="size-5 fill-white stroke-white" />
      </span>
      {site.name}
    </Link>
  );
}

export function Header({ ctaLabel }: { ctaLabel: string }) {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
      <Logo />
      <a href="#join" className="btn-secondary px-4 py-2">
        {ctaLabel}
      </a>
    </header>
  );
}
