import { CtaBand } from "@/components/CtaBand";
import { FAQ, type FaqItem } from "@/components/FAQ";
import { Features, type Feature } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero, PageGlow } from "@/components/Hero";
import { HowItWorks, type Step } from "@/components/HowItWorks";
import { WaitlistForm } from "@/components/WaitlistForm";
import { site } from "@/lib/site";

// Women's landing page: the main target for ads.

const features: Feature[] = [
  {
    icon: "sparkles",
    title: "Free. Forever.",
    body: "Women never pay. No premium tiers, no paywalled features, no catch.",
  },
  {
    icon: "shield",
    title: "Only verified men",
    body: "Every man passes a selfie and ID check and pays to be here. Fake profiles and timepass don't make it in.",
  },
  {
    icon: "chat",
    title: "You message first",
    body: "Men can't message you until you match and say hi. No more inbox full of “hi”, “hlo”, “hey dear”.",
  },
  {
    icon: "lock",
    title: "You choose who sees you",
    body: "Hide your profile from your contacts, keep photos private until you match, or pause anytime.",
  },
  {
    icon: "flag",
    title: "Safety built in",
    body: "Block and report in one tap. Every report is reviewed by our team, and repeat offenders are removed for good.",
  },
  {
    icon: "pin",
    title: `Made for ${site.city}`,
    body: "Meet people near you in Delhi, Gurgaon, Noida, Ghaziabad and Faridabad. Local first, not random.",
  },
];

const steps: Step[] = [
  { title: "Join the waitlist", body: "Takes 30 seconds. Just your first name, number and area." },
  {
    title: "Get your invite",
    body: `We'll WhatsApp you as soon as ${site.name} opens in your area. Waitlist members get in first.`,
  },
  { title: "Make the call", body: "Set up your profile, see verified matches, and talk only to the people you choose." },
];

const faq: FaqItem[] = [
  {
    q: "Is it really free for women?",
    a: `Yes. Women will never pay for ${site.name}. Men pay a membership, which keeps the app running and keeps out people who aren't serious.`,
  },
  {
    q: "How are men verified?",
    a: "Every man has to pass a selfie check and an ID check before his profile goes live. No verification, no profile.",
  },
  {
    q: "What will you do with my number?",
    a: "We only use it to send your invite and launch updates on WhatsApp. It's never shown on your profile or shared with other users, and you can ask us to delete it anytime.",
  },
  {
    q: "When are you launching?",
    a: `Soon, starting with ${site.city}. Waitlist members get invited first.`,
  },
  {
    q: "Can I invite my friends?",
    a: "Yes, please! After you join, you'll get a personal link to share on WhatsApp.",
  },
  {
    q: `Why only ${site.city}?`,
    a: "Starting with one region means there are enough great people near you from day one. More cities will follow.",
  },
];

export default function WomenLanding() {
  return (
    <>
      <PageGlow />
      <Header ctaLabel="Join free" />
      <main>
        <Hero
          badge={`Launching soon in ${site.city}`}
          title={
            <>
              Dating where{" "}
              <span className="bg-gradient-to-r from-brand-600 to-rose-500 bg-clip-text py-[0.1em] pr-[0.15em] text-transparent italic">
                you
              </span>{" "}
              make the call.
            </>
          }
          subtitle={`${site.name} is a women-first dating app. It's free forever for women, and every man is verified and on a paid membership, so only the serious ones get in.`}
          points={["Free for women", "Verified men only", "You message first"]}
        >
          <WaitlistForm variant="women" />
        </Hero>
        <Features
          heading="Built around you"
          intro={`Most dating apps are built for endless swiping. ${site.name} is built for women who want to feel safe, respected and in control.`}
          items={features}
        />
        <HowItWorks steps={steps} />
        <FAQ items={faq} />
        <CtaBand
          title="Your love life, your rules."
          body="Join the waitlist today. It's free, it takes 30 seconds, and you'll be first in when we launch."
          label="Get early access"
        />
      </main>
      <Footer crossLink={{ href: "/men", label: "For men" }} />
    </>
  );
}
