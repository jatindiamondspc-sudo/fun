"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import type { Variant } from "@/lib/validation";
import { Icon } from "./Icon";

const copy = {
  women: {
    body: `We'll WhatsApp you as soon as ${site.name} opens in ${site.city}.`,
    ask: "Dating is better when your friends are here too. Invite your girls with your personal link:",
    message: (link: string) =>
      `I just joined the ${site.name} waitlist, a dating app where women make the call. Free for women, verified men only. Join me: ${link}`,
  },
  men: {
    body: `We'll reach out on WhatsApp or email when early access opens in ${site.city}.`,
    ask: "Help the community grow. Share your personal link with friends:",
    message: (link: string) =>
      `${site.name} is a women-first dating app launching in ${site.city}. Free for women, and every man is verified. Join the waitlist: ${link}`,
  },
};

export function SuccessShare({ variant, referralCode }: { variant: Variant; referralCode: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const text = copy[variant];
  const link = `${window.location.origin}/?ref=${referralCode}`;

  // Move focus to the confirmation so screen readers announce it.
  useEffect(() => headingRef.current?.focus(), []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      linkRef.current?.select();
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 text-center shadow-xl ring-1 shadow-brand-900/5 ring-brand-100 sm:p-8">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
        <Icon name="heart" className="size-7 fill-brand-600" />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-3xl font-semibold text-brand-950 outline-none">
        You&apos;re on the list!
      </h2>
      <p className="mt-2 text-ink/70">{text.body}</p>

      <div className="mt-6 rounded-2xl bg-brand-50/70 p-4 text-left">
        <p className="text-sm font-medium text-ink/80">{text.ask}</p>
        <div className="mt-3 flex gap-2">
          <input
            ref={linkRef}
            readOnly
            value={link}
            aria-label="Your invite link"
            onFocus={(e) => e.currentTarget.select()}
            className="field-input min-w-0 flex-1 py-2.5 text-sm"
          />
          <button type="button" onClick={copyLink} className="btn-secondary shrink-0 px-4 py-2.5">
            <Icon name={copied ? "check" : "copy"} className="size-4" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(text.message(link))}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 w-full"
      >
        <Icon name="chat" className="size-5" />
        Share on WhatsApp
      </a>
    </div>
  );
}
