import Link from "next/link";
import { Footer } from "./Footer";
import { Logo } from "./Header";
import { site } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <Link href="/" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
          ← Back
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-brand-950">{title}</h1>
        <p className="mt-2 text-sm text-ink/55">Last updated: {site.legalLastUpdated}</p>
        <div className="mt-8 space-y-4 leading-relaxed text-ink/80 [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
