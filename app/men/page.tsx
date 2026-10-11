import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { FAQ, type FaqItem } from "@/components/FAQ";
import { Features, type Feature } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero, PageGlow } from "@/components/Hero";
import { HowItWorks, type Step } from "@/components/HowItWorks";
import { WaitlistForm } from "@/components/WaitlistForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "For men: early access",
  description: `Request early access to ${site.name}, the verified, women-first dating app launching in ${site.city}.`,
};

const features: Feature[] = [
  {
    icon: "shield",
    title: "A verified community",
    body: "Everyone passes a selfie and ID check, so you know the people you're talking to are real.",
  },
  {
    icon: "users",
    title: "Women actually want to be here",
    body: "Women join free and stay in control, so they feel safe enough to show up. That's good for everyone.",
  },
  {
    icon: "heart",
    title: "Quality over endless swiping",
    body: "A smaller, serious community means fewer dead-end matches and more real conversations.",
  },
  {
    icon: "sparkles",
    title: "Be first in",
    body: `Waitlist members get access before anyone else when we launch in ${site.city}.`,
  },
];

const steps: Step[] = [
  { title: "Join the waitlist", body: "Tell us a bit about you. It takes a minute." },
  { title: "Get verified", body: "When we launch, complete a quick selfie and ID check." },
  { title: "Start meeting people", body: "Pick a membership and start matching with verified people near you." },
];

const faq: FaqItem[] = [
  {
    q: "Why do men have to pay?",
    a: "Paid, verified memberships keep out bots, scammers and people who aren't serious. That keeps the community safe for women, which makes it better for you too.",
  },
  {
    q: "How much will it cost?",
    a: "Pricing will be announced before launch. Your answer in the form helps us set a fair price.",
  },
  {
    q: "How does verification work?",
    a: "A quick selfie check plus an ID check before your profile goes live. Your ID is never shown on your profile.",
  },
  {
    q: "When are you launching?",
    a: `Soon, starting with ${site.city}. Waitlist members get invited first.`,
  },
];

export default function MenLanding() {
  return (
    <>
      <PageGlow />
      <Header ctaLabel="Get early access" />
      <main>
        <Hero
          badge={`Limited early access · ${site.city}`}
          title={
            <>
              Less noise.{" "}
              <span className="bg-gradient-to-r from-brand-600 to-rose-500 bg-clip-text py-[0.1em] pr-[0.15em] text-transparent italic">
                Real
              </span>{" "}
              conversations.
            </>
          }
          subtitle={`${site.name} is a women-first dating app. Women join free, and every man is verified and on a paid membership. That means fewer fake profiles, less spam, and a better shot at a real connection.`}
          points={["Verified members only", "Women-first community", "Waitlist gets in first"]}
        >
          <WaitlistForm variant="men" />
        </Hero>
        <Features
          heading="Why it's worth it"
          intro="Free apps are full of bots, fake profiles and people who aren't serious. A verified, paid community changes that."
          items={features}
        />
        <HowItWorks steps={steps} />
        <FAQ items={faq} />
        <CtaBand
          title="Spots are limited."
          body={`Join the early-access list now and be first in when ${site.name} opens in ${site.city}.`}
          label="Request early access"
        />
      </main>
      <Footer crossLink={{ href: "/", label: "For women" }} />
    </>
  );
}
