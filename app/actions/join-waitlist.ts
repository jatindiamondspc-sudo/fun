"use server";

import { randomInt } from "node:crypto";
import { getSupabase } from "@/lib/supabase";
import { fieldErrorsFrom, schemaFor, type FieldErrors, type Variant } from "@/lib/validation";

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

  const supabase = getSupabase();
  if (!supabase) {
    console.error("[waitlist] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set");
    return process.env.NODE_ENV === "production"
      ? SAVE_FAILED
      : {
          status: "error",
          message: "Waitlist isn't configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
        };
  }

  const data = parsed.data;
  const ref = optionalField(formData, "ref")?.toUpperCase() ?? null;
  const row = {
    gender: variant === "men" ? "man" : "woman",
    name: data.name,
    phone: data.phone,
    age: data.age,
    area: data.area,
    instagram: data.instagram || null,
    email: "email" in data ? data.email : null,
    price_willing: "priceWilling" in data ? data.priceWilling : null,
    consent: true,
    referred_by: ref && CODE_PATTERN.test(ref) ? ref : null,
    utm_source: optionalField(formData, "utm_source"),
    utm_medium: optionalField(formData, "utm_medium"),
    utm_campaign: optionalField(formData, "utm_campaign"),
  };

  // Retry only on the (rare) referral-code collision.
  for (let attempt = 0; attempt < 3; attempt++) {
    const referralCode = makeReferralCode();
    const { error } = await supabase.from("waitlist").insert({ ...row, referral_code: referralCode });
    if (!error) return { status: "success", referralCode };

    if (error.code !== "23505") {
      console.error("[waitlist] insert failed", error);
      return SAVE_FAILED;
    }

    if (error.message.includes("waitlist_phone_unique")) {
      // Same response as a new signup, so nobody can use this form to check
      // whether a phone number is already on a dating waitlist.
      const existing = await supabase.from("waitlist").select("referral_code").eq("phone", data.phone).single();
      if (existing.data) return { status: "success", referralCode: existing.data.referral_code };
      console.error("[waitlist] duplicate phone lookup failed", existing.error);
      return SAVE_FAILED;
    }
  }

  console.error("[waitlist] could not generate a unique referral code");
  return SAVE_FAILED;
}
