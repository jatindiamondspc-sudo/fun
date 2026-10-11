# HerCall

**You make the call.** A women-first dating app launching in Delhi NCR. Women join free, and men are verified and pay a membership.

This repo is **Phase 1**: mobile-first landing pages and waitlists that ads point to, so we can measure real demand before building the app.

| Page | What it's for |
|---|---|
| `/` | Women's landing page + waitlist (main ad target) |
| `/men` | Men's early-access waitlist, including a "what would you pay?" question |
| `/privacy`, `/terms` | Privacy Policy and Terms (templates, see the launch checklist) |
| `/admin` | Password-protected signups dashboard + CSV download |

After signing up, everyone gets a personal invite link (`/?ref=CODE`) and a "Share on WhatsApp" button.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Postgres · zod. Runs on a Hostinger VPS with Nginx + PM2.

## Run it locally

You need Node 18.18+ and a Postgres database.

```bash
npm install
cp .env.example .env.local     # set DATABASE_URL (and ADMIN_PASSWORD to try /admin)
psql "$DATABASE_URL" -f db/schema.sql
npm run dev                    # http://localhost:3000
```

Without `DATABASE_URL` the pages work, but submitting the form shows a "Waitlist isn't configured" message.

| Script | |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm test` | Form validation tests |

## Deploy

See **[DEPLOY.md](DEPLOY.md)**: step-by-step setup on the Hostinger VPS (Postgres, PM2, Nginx, HTTPS, backups), next to the existing ShipTrack app.

## Running ads

Use UTM tags so every signup records which ad it came from:

```
Women:  https://YOUR-DOMAIN/?utm_source=meta&utm_medium=paid&utm_campaign=delhi_women_v1
Men:    https://YOUR-DOMAIN/men?utm_source=meta&utm_medium=paid&utm_campaign=delhi_men_v1
```

When the Pixel / GA IDs are set, every successful signup fires a Meta **Lead** event and a GA4 **generate_lead** event. Optimise your Meta campaigns for "Lead".

## Seeing your signups

Open **`/admin`** and log in with `ADMIN_USER` / `ADMIN_PASSWORD`. It shows:
- totals, signups per day, and signups per area
- what men said they'd pay
- which ads and referrers brought people
- the latest 100 signups, with WhatsApp links

**Download CSV** exports everything.

For anything else, query Postgres directly (`psql "$DATABASE_URL"`):

```sql
-- Signups per day, women vs men
select date(created_at) as day, gender, count(*) from waitlist group by 1, 2 order by 1 desc;

-- Which areas to launch first
select area, gender, count(*) from waitlist group by 1, 2 order by 3 desc;

-- What men say they'd pay
select price_willing, count(*) from waitlist where gender = 'man' group by 1 order by 2 desc;

-- Which ads bring signups
select utm_source, utm_campaign, gender, count(*) from waitlist group by 1, 2, 3 order by 4 desc;

-- Top referrers
select w.name, w.phone, count(*) as invited
from waitlist r join waitlist w on w.referral_code = r.referred_by
group by 1, 2 order by 3 desc limit 20;
```

## Changing things

- **Brand name, tagline, city, contact email:** [`lib/site.ts`](lib/site.ts)
- **Brand colors:** the `--color-brand-*` tokens in [`app/globals.css`](app/globals.css)
- **Page copy (features, FAQ, steps):** [`app/page.tsx`](app/page.tsx) and [`app/men/page.tsx`](app/men/page.tsx)
- **Form fields and validation:** [`lib/validation.ts`](lib/validation.ts), [`components/WaitlistForm.tsx`](components/WaitlistForm.tsx), [`app/actions/join-waitlist.ts`](app/actions/join-waitlist.ts), plus the SQL table

## Launch checklist

- [ ] Check that the "HerCall" name is free (trademark search) and buy the domain
- [ ] Replace `contactEmail` in `lib/site.ts` with a real inbox
- [ ] Have a lawyer review `/privacy` and `/terms` (DPDP Act 2023)
- [ ] Deploy on the VPS following [DEPLOY.md](DEPLOY.md), then do a test signup on the live site
- [ ] Set a strong `ADMIN_PASSWORD` and turn on daily database backups
- [ ] Add the Meta Pixel / GA4 IDs and confirm the Lead event fires
- [ ] Make sure the app can deliver what the pages promise (free for women, verified men, women message first, block/report)
