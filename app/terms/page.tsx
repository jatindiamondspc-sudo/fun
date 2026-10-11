import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

// Template for the waitlist phase. Have a lawyer review it before launch.

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  const email = <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>;

  return (
    <LegalPage title="Terms">
      <p>
        These terms apply to the {site.name} website and waitlist. By joining the waitlist, you agree to them.
      </p>

      <h2>Who can join</h2>
      <p>You must be 18 or older to join the waitlist or use {site.name}.</p>

      <h2>The waitlist</h2>
      <p>
        Joining the waitlist doesn&apos;t create an account, and it doesn&apos;t guarantee access, a launch date,
        specific features or pricing. We may change or close the waitlist at any time.
      </p>

      <h2>Your information</h2>
      <p>
        Please give accurate details and use your own phone number. One signup per person. We may remove fake,
        duplicate or abusive signups. Our <Link href="/privacy">Privacy Policy</Link> explains how we handle your
        data.
      </p>

      <h2>Invite links</h2>
      <p>
        Share your invite link with people who might want to join. Don&apos;t spam it or share it in misleading ways.
      </p>

      <h2>Contacting you</h2>
      <p>
        By joining, you agree that we can contact you on WhatsApp (and email, if you gave one) about {site.name}. To
        stop, reply STOP or email {email}.
      </p>

      <h2>Liability</h2>
      <p>
        The website and waitlist are provided &quot;as is&quot;. To the extent the law allows, we aren&apos;t liable
        for indirect or consequential losses arising from them.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Courts in New Delhi have jurisdiction.</p>

      <h2>Changes and contact</h2>
      <p>
        If we change these terms, we&apos;ll update the date at the top of this page. Questions? Email {email}.
      </p>
    </LegalPage>
  );
}
