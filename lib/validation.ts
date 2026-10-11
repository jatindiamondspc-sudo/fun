import { z } from "zod";

// Shared by the browser (instant errors) and the server action (source of truth).

export type Variant = "women" | "men";

export const AREAS = ["Delhi", "Gurgaon", "Noida", "Ghaziabad", "Faridabad", "Other"] as const;

export const PRICE_OPTIONS = [
  { value: "299", label: "₹299 / month" },
  { value: "499", label: "₹499 / month" },
  { value: "999", label: "₹999 / month" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

const PRICE_VALUES = ["299", "499", "999", "not_sure"] as const;

const name = z
  .string({ error: "Enter your name" })
  .trim()
  .min(2, "Enter your name")
  .max(60, "That name is too long");

// Accepts "98765 43210", "+91-98765-43210", "09876543210" → "9876543210".
const phone = z
  .string({ error: "Enter your WhatsApp number" })
  .trim()
  .min(1, "Enter your WhatsApp number")
  .transform((v) => v.replace(/[\s()-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"));

const age = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.coerce
    .number({ error: "Enter your age" })
    .int("Enter a valid age")
    .min(18, "You must be 18 or older to join")
    .max(80, "Enter a valid age"),
);

const area = z.enum(AREAS, { error: "Pick your area" });

const instagram = z
  .string()
  .trim()
  .regex(/^@?[A-Za-z0-9._]{0,30}$/, "Enter a valid Instagram handle")
  .transform((v) => v.replace(/^@/, ""))
  .optional();

const consent = z.literal("on", { error: "Please accept to continue" });

const email = z
  .string({ error: "Enter your email" })
  .trim()
  .toLowerCase()
  .min(1, "Enter your email")
  .pipe(z.email({ error: "Enter a valid email" }));

const priceWilling = z.enum(PRICE_VALUES, { error: "Pick an option" });

export const womenSchema = z.object({ name, phone, age, area, instagram, consent });

export const menSchema = womenSchema.extend({ email, priceWilling });

export function schemaFor(variant: Variant) {
  return variant === "men" ? menSchema : womenSchema;
}

export type FieldErrors = Partial<Record<string, string>>;

/** First error message per field, keyed by field name. */
export function fieldErrorsFrom(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
