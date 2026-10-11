"use server";

import { randomInt } from "node:crypto";
import postgres from "postgres";
import { getDb } from "@/lib/db";
import { fieldErrorsFrom, schemaFor, type FieldErrors, type MenSignup, type Variant } from "@/lib/validation";

export type WaitlistState =
  | { status: "idle" }
  | { status: "error"; message?: string; fieldErrors?: FieldErrors }
  | { status: "success"; referralCode: string };

// No 0/O/1/I so codes are easy to read out loud.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_PATTERN = /^[A-HJ-NP-Z2-9]{6}$/;

function makeReferralCode() {
  let code = "";
  for (let i = 0; i < 6; i++) code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return code;
}

function optionalField(formData: FormData, key: string, max = 100) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;
}

const SAVE_FAILED: WaitlistState = {
  status: "error",
  message: "We couldn't save your spot right now. Please try again in a minute.",
};

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  // Honeypot: real people never see or fill this field.
  if (optionalField(formData, "company")) return { status: "success", referralCode: makeReferralCode() };

  const variant: Variant = formData.get("variant") === "men" ? "men" : "women";
  const parsed = schemaFor(variant).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };

  const sql = getDb();
  if (!sql) {
    console.error("[waitlist] DATABASE_URL is not set");
    return process.env.NODE_ENV === "production"
      ? SAVE_FAILED
      : { status: "error", message: "Waitlist isn't configured: set DATABASE_URL in .env.local." };
  }

  const data = parsed.data;
  const menData = variant === "men" ? (data as MenSignup) : null;
  const ref = optionalField(formData, "ref")?.toUpperCase() ?? null;
  const row = {
    gender: variant === "men" ? "man" : "woman",
    name: data.name,
    phone: data.phone,
    age: data.age,
    area: data.area,
    instagram: data.instagram || null,
    email: menData?.email ?? null,
    price_willing: menData?.priceWilling ?? null,
    consent: true,
    referred_by: ref && CODE_PATTERN.test(ref) ? ref : null,
    utm_source: optionalField(formData, "utm_source"),
    utm_medium: optionalField(formData, "utm_medium"),
    utm_campaign: optionalField(formData, "utm_campaign"),
  };

  try {
    // Retry only on the (rare) referral-code collision.
    for (let attempt = 0; attempt < 3; attempt++) {
      const referralCode = makeReferralCode();
      try {
        const inserted = await sql`
          insert into waitlist ${sql({ ...row, referral_code: referralCode })}
          on conflict on constraint waitlist_phone_unique do nothing
          returning referral_code`;
        if (inserted.length > 0) return { status: "success", referralCode };

        // Phone is already on the list. Same response as a new signup, so nobody
        // can use this form to check whether a number is on a dating waitlist.
        const [existing] = await sql`select referral_code from waitlist where phone = ${data.phone}`;
        if (existing) return { status: "success", referralCode: existing.referral_code };
        return SAVE_FAILED;
      } catch (error) {
        const codeTaken =
          error instanceof postgres.PostgresError && error.constraint_name === "waitlist_referral_code_unique";
        if (!codeTaken) throw error;
      }
    }
  } catch (error) {
    console.error("[waitlist] insert failed", error);
    return SAVE_FAILED;
  }

  console.error("[waitlist] could not generate a unique referral code");
  return SAVE_FAILED;
}
