import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

// Template for the waitlist phase. Have a lawyer review it before launch.

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  const email = <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>;

  return (
    <LegalPage title="Privacy Policy">
      <p>
        {site.name} (&quot;we&quot;, &quot;us&quot;) is building a women-first dating app. This policy explains what
        we collect through our waitlist, why we collect it, and the choices you have. We process your data in line
        with India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act).
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>From the waitlist form:</strong> your first name, WhatsApp number, age, area and, if you choose, your
          Instagram handle. Men also give an email address and answer a question about pricing.
        </li>
        <li>
          <strong>Automatically:</strong> which ad or link brought you to our site (UTM tags), the invite code of the
          person who referred you, and, if enabled, cookies from Meta and Google that measure how our ads perform.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To send your invite and launch updates on WhatsApp (and email, for men).</li>
        <li>To plan our launch: which areas to open first and how many people are interested.</li>
        <li>To make sure people joining are real and 18 or older.</li>
        <li>To understand which ads and invite links work.</li>
      </ul>

      <h2>Legal basis</h2>
      <p>
        We rely on your consent, which you give when you tick the box on the waitlist form. You can withdraw it at
        any time by emailing {email}. We&apos;ll then stop contacting you and delete your data.
      </p>

      <h2>Who we share it with</h2>
      <p>
        We never sell your data, and your number is never shown to other users. We share data only with service
        providers that help us run the waitlist: website hosting (Vercel), our database (Supabase) and, if enabled,
        Meta and Google for ad measurement. We may also disclose data if the law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep waitlist data only as long as we need it for the waitlist and our launch, and we delete it sooner if
        you ask us to.
      </p>

      <h2>Your rights</h2>
      <p>
        Under the DPDP Act you can ask to access, correct or erase your data, withdraw consent, and raise a
        grievance. Email {email} and we&apos;ll respond as soon as possible. If you&apos;re not satisfied with our
        response, you can complain to the Data Protection Board of India.
      </p>

      <h2>Security</h2>
      <p>
        Your data is stored in a secured database that only our team can access. No system is perfectly secure, but
        we work hard to protect your information.
      </p>

      <h2>18+ only</h2>
      <p>
        {site.name} is only for adults. We don&apos;t knowingly collect data from anyone under 18, and we delete it
        if we find out we have.
      </p>

      <h2>Changes and contact</h2>
      <p>
        If we change this policy, we&apos;ll update the date at the top of this page. For questions or grievances,
        contact us at {email}.
      </p>
    </LegalPage>
  );
}
