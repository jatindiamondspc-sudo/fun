// Brand + launch config. Rename the brand or change the city here.
// Brand colors live in app/globals.css (the `--color-brand-*` theme tokens).
export const site = {
  name: "HerCall",
  tagline: "You make the call.",
  city: "Delhi NCR",
  description:
    "HerCall is the women-first dating app launching in Delhi NCR. Free forever for women. Every man is verified and on a paid membership.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // TODO: replace with a real inbox before launch (shown on the Privacy & Terms pages).
  contactEmail: "contact@example.com",
  legalLastUpdated: "11 October 2026",
} as const;
