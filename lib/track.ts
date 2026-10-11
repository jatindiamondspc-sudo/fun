import type { Variant } from "./validation";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Report a waitlist signup to Meta Pixel / GA4 (no-op if they aren't loaded). */
export function trackLead(variant: Variant) {
  window.fbq?.("track", "Lead", { content_name: `waitlist_${variant}` });
  window.gtag?.("event", "generate_lead", { form: `waitlist_${variant}` });
}

const ATTRIBUTION_KEYS = ["ref", "utm_source", "utm_medium", "utm_campaign"] as const;
const STORAGE_KEY = "hercall_attribution";

/**
 * Remember where the visitor came from (ad UTMs, referral code) for the session,
 * so it survives a visit to another page before signing up.
 */
export function rememberAttribution() {
  const params = new URLSearchParams(window.location.search);
  const found = ATTRIBUTION_KEYS.filter((key) => params.get(key));
  if (found.length === 0) return;
  try {
    const saved = Object.fromEntries(found.map((key) => [key, params.get(key)]));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Storage blocked (private mode): the current URL still works.
  }
}

export function getAttribution(): Record<string, string> {
  let saved: Record<string, string> = {};
  try {
    saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    // ignore
  }
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key) ?? saved[key];
    if (value) out[key] = value;
  }
  return out;
}
