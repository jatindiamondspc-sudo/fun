import Link from "next/link";
import { Logo } from "./Header";
import { site } from "@/lib/site";

export function Footer({ crossLink }: { crossLink?: { href: string; label: string } }) {
  return (
    <footer className="border-t border-brand-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-ink/60">
            {site.tagline} Launching in {site.city}. 18+ only.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink/70">
          {crossLink && (
            <Link href={crossLink.href} className="hover:text-brand-700">
              {crossLink.label}
            </Link>
          )}
          <Link href="/privacy" className="hover:text-brand-700">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-brand-700">
            Terms
          </Link>
          <span className="text-ink/50">© {new Date().getFullYear()} {site.name}</span>
        </nav>
      </div>
    </footer>
  );
}
