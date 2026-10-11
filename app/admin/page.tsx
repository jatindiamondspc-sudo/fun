import type { Metadata } from "next";
import { Logo } from "@/components/Header";
import { getDb } from "@/lib/db";
import { PRICE_OPTIONS } from "@/lib/validation";

// Waitlist dashboard. Protected by middleware.ts.

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const priceLabel: Record<string, string> = Object.fromEntries(PRICE_OPTIONS.map((o) => [o.value, o.label]));

function when(date: Date) {
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Table({ title, head, rows }: { title: string; head: string[]; rows: React.ReactNode[][] }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-brand-100">
      <h2 className="font-semibold text-ink">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-ink/55">Nothing yet.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs tracking-wide text-ink/50 uppercase">
              <tr>
                {head.map((h) => (
                  <th key={h} className="py-2 pr-4 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 pr-4 whitespace-nowrap tabular-nums">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default async function AdminPage() {
  const sql = getDb();
  if (!sql) return <main className="p-8">Set DATABASE_URL to see signups.</main>;

  const [totals, daily, areas, prices, sources, referrers, recent] = await Promise.all([
    sql<{ gender: string; n: number }[]>`select gender, count(*)::int as n from waitlist group by gender`,
    sql<{ day: string; women: number; men: number }[]>`
      select to_char(d, 'DD Mon') as day, women, men from (
        select date(created_at at time zone 'Asia/Kolkata') as d,
               count(*) filter (where gender = 'woman')::int as women,
               count(*) filter (where gender = 'man')::int as men
        from waitlist where created_at > now() - interval '14 days' group by 1
      ) t order by d desc`,
    sql<{ area: string; women: number; men: number }[]>`
      select area,
             count(*) filter (where gender = 'woman')::int as women,
             count(*) filter (where gender = 'man')::int as men
      from waitlist group by area order by count(*) desc`,
    sql<{ price_willing: string; n: number }[]>`
      select price_willing, count(*)::int as n from waitlist
      where gender = 'man' group by 1 order by 2 desc`,
    sql<{ source: string; campaign: string; women: number; men: number }[]>`
      select coalesce(utm_source, '(direct)') as source, coalesce(utm_campaign, '') as campaign,
             count(*) filter (where gender = 'woman')::int as women,
             count(*) filter (where gender = 'man')::int as men
      from waitlist group by 1, 2 order by count(*) desc limit 20`,
    sql<{ name: string; phone: string; referral_code: string; invited: number }[]>`
      select w.name, w.phone, w.referral_code, count(*)::int as invited
      from waitlist r join waitlist w on w.referral_code = r.referred_by
      group by w.id order by invited desc limit 10`,
    sql<
      {
        created_at: Date;
        gender: string;
        name: string;
        phone: string;
        age: number;
        area: string;
        instagram: string | null;
        email: string | null;
        price_willing: string | null;
        utm_source: string | null;
        referred_by: string | null;
      }[]
    >`
      select created_at, gender, name, phone, age, area, instagram, email, price_willing, utm_source, referred_by
      from waitlist order by created_at desc limit 100`,
  ]);

  const women = totals.find((t) => t.gender === "woman")?.n ?? 0;
  const men = totals.find((t) => t.gender === "man")?.n ?? 0;
  const whatsapp = (phone: string) => (
    <a
      href={`https://wa.me/91${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-brand-700 underline underline-offset-2"
    >
      {phone}
    </a>
  );

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Logo />
          <p className="mt-1 text-sm text-ink/60">Waitlist admin</p>
        </div>
        <a href="/admin/export" className="btn-secondary">
          Download CSV
        </a>
      </div>

      <p className="text-lg text-ink/80">
        <strong className="text-ink">{women + men}</strong> signups: <strong className="text-ink">{women}</strong>{" "}
        {women === 1 ? "woman" : "women"}, <strong className="text-ink">{men}</strong> {men === 1 ? "man" : "men"}.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Table title="Last 14 days" head={["Day", "Women", "Men"]} rows={daily.map((d) => [d.day, d.women, d.men])} />
        <Table title="By area" head={["Area", "Women", "Men"]} rows={areas.map((a) => [a.area, a.women, a.men])} />
        <Table
          title="What men would pay"
          head={["Answer", "Men"]}
          rows={prices.map((p) => [priceLabel[p.price_willing] ?? p.price_willing, p.n])}
        />
        <Table
          title="Where signups come from"
          head={["Source", "Campaign", "Women", "Men"]}
          rows={sources.map((s) => [s.source, s.campaign, s.women, s.men])}
        />
        <Table
          title="Top referrers"
          head={["Name", "WhatsApp", "Code", "Invited"]}
          rows={referrers.map((r) => [r.name, whatsapp(r.phone), r.referral_code, r.invited])}
        />
      </div>

      <Table
        title="Latest 100 signups"
        head={["When", "Who", "Name", "WhatsApp", "Age", "Area", "Instagram", "Email", "Would pay", "Source", "Ref by"]}
        rows={recent.map((r) => [
          when(r.created_at),
          r.gender === "woman" ? "Woman" : "Man",
          r.name,
          whatsapp(r.phone),
          r.age,
          r.area,
          r.instagram ? `@${r.instagram}` : "",
          r.email ?? "",
          r.price_willing ? (priceLabel[r.price_willing] ?? r.price_willing) : "",
          r.utm_source ?? "",
          r.referred_by ?? "",
        ])}
      />
    </main>
  );
}
