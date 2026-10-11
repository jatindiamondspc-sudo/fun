-- HerCall waitlist table. Run once as the database owner:
--   psql "$DATABASE_URL" -f db/schema.sql

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  gender text not null check (gender in ('woman', 'man')),
  name text not null check (char_length(name) between 2 and 60),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email text,
  age int not null check (age between 18 and 80),
  area text not null,
  instagram text,
  price_willing text check (price_willing in ('299', '499', '999', 'not_sure')),
  consent boolean not null check (consent),

  referral_code text not null,
  referred_by text,

  utm_source text,
  utm_medium text,
  utm_campaign text,

  constraint waitlist_phone_unique unique (phone),
  constraint waitlist_referral_code_unique unique (referral_code)
);

create index if not exists waitlist_referred_by_idx on waitlist (referred_by);
create index if not exists waitlist_created_at_idx on waitlist (created_at);
