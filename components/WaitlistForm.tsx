"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions/join-waitlist";
import { site } from "@/lib/site";
import { getAttribution, rememberAttribution, trackLead } from "@/lib/track";
import { AREAS, PRICE_OPTIONS, fieldErrorsFrom, schemaFor, type FieldErrors, type Variant } from "@/lib/validation";
import { Icon } from "./Icon";
import { SuccessShare } from "./SuccessShare";

const initialState: WaitlistState = { status: "idle" };

const copy = {
  women: {
    title: "Get early access",
    subtitle: `Free forever for women. We'll invite you on WhatsApp when ${site.name} opens in ${site.city}.`,
    submit: "Join the waitlist. It's free",
    contact: "on WhatsApp",
  },
  men: {
    title: "Request early access",
    subtitle: `Spots are limited. Waitlist members get invited first when ${site.name} opens in ${site.city}.`,
    submit: "Request early access",
    contact: "on WhatsApp or email",
  },
};

export function WaitlistForm({ variant }: { variant: Variant }) {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);
  // Errors found in the browser win; otherwise show what the server returned.
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);
  const errors: FieldErrors = clientErrors ?? (state.status === "error" ? (state.fieldErrors ?? {}) : {});
  const text = copy[variant];

  useEffect(() => rememberAttribution(), []);

  useEffect(() => {
    if (state.status === "success") trackLead(variant);
  }, [state, variant]);

  if (state.status === "success") {
    return <SuccessShare variant={variant} referralCode={state.referralCode} />;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = schemaFor(variant).safeParse(Object.fromEntries(formData));
    if (!result.success) {
      const found = fieldErrorsFrom(result.error);
      setClientErrors(found);
      const firstInvalid = Array.from(form.elements).find((el) => found[(el as HTMLInputElement).name]);
      (firstInvalid as HTMLElement | undefined)?.focus();
      return;
    }

    setClientErrors(null);
    for (const [key, value] of Object.entries(getAttribution())) formData.set(key, value);
    startTransition(() => formAction(formData));
  }

  function clearError(event: React.FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name;
    if (errors[name]) setClientErrors({ ...errors, [name]: undefined });
  }

  function a11y(name: string) {
    const id = `${variant}-${name}`;
    return {
      id,
      name,
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": errors[name] ? `${id}-error` : undefined,
    };
  }

  function errorText(name: string) {
    if (!errors[name]) return null;
    return (
      <p id={`${variant}-${name}-error`} className="field-error">
        {errors[name]}
      </p>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 shadow-brand-900/5 ring-brand-100 sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-brand-950">{text.title}</h2>
      <p className="mt-1.5 text-ink/70">{text.subtitle}</p>

      <form noValidate onSubmit={handleSubmit} onChange={clearError} className="relative mt-6 space-y-4">
        <input type="hidden" name="variant" value={variant} />

        {/* Honeypot for bots: hidden from people and screen readers. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Company
            <input type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div>
          <label htmlFor={`${variant}-name`} className="field-label">
            First name
          </label>
          <input {...a11y("name")} type="text" autoComplete="given-name" placeholder="Your first name" className="field-input" />
          {errorText("name")}
        </div>

        <div>
          <label htmlFor={`${variant}-phone`} className="field-label">
            WhatsApp number
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base text-ink/55">+91</span>
            <input
              {...a11y("phone")}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
              maxLength={16}
              className="field-input pl-14"
            />
          </div>
          {errorText("phone")}
        </div>

        {variant === "men" && (
          <div>
            <label htmlFor={`${variant}-email`} className="field-label">
              Email
            </label>
            <input {...a11y("email")} type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" className="field-input" />
            {errorText("email")}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${variant}-age`} className="field-label">
              Age
            </label>
            <input {...a11y("age")} type="text" inputMode="numeric" maxLength={2} placeholder="18+" className="field-input" />
            {errorText("age")}
          </div>
          <div>
            <label htmlFor={`${variant}-area`} className="field-label">
              Area
            </label>
            <select {...a11y("area")} defaultValue="" className="field-input field-select">
              <option value="" disabled>
                Select
              </option>
              {AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            {errorText("area")}
          </div>
        </div>

        <div>
          <label htmlFor={`${variant}-instagram`} className="field-label">
            Instagram <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base text-ink/55">@</span>
            <input {...a11y("instagram")} type="text" autoCapitalize="none" autoCorrect="off" placeholder="yourhandle" className="field-input pl-9" />
          </div>
          {errorText("instagram")}
        </div>

        {variant === "men" && (
          <fieldset aria-describedby={errors.priceWilling ? `${variant}-priceWilling-error` : undefined}>
            <legend className="field-label">What would you pay per month for a verified, women-first dating app?</legend>
            <div className="grid grid-cols-2 gap-2">
              {PRICE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-center rounded-xl border border-brand-200 bg-white px-3 py-3 text-sm font-semibold text-ink/80 transition hover:border-brand-400 has-checked:border-brand-600 has-checked:bg-brand-50 has-checked:text-brand-800 has-focus-visible:ring-4 has-focus-visible:ring-brand-500/20"
                >
                  <input type="radio" name="priceWilling" value={option.value} className="sr-only" />
                  {option.label}
                </label>
              ))}
            </div>
            {errorText("priceWilling")}
          </fieldset>
        )}

        <div>
          <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/75">
            <input
              {...a11y("consent")}
              type="checkbox"
              className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-brand-600"
            />
            <span>
              I&apos;m 18+ and I agree to the{" "}
              <Link href="/privacy" target="_blank" className="font-semibold text-brand-700 underline underline-offset-2">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" target="_blank" className="font-semibold text-brand-700 underline underline-offset-2">
                Terms
              </Link>
              , and to hear from {site.name} {text.contact}.
            </span>
          </label>
          {errorText("consent")}
        </div>

        {state.status === "error" && state.message && !clientErrors && (
          <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {state.message}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "Saving your spot…" : text.submit}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink/55">
          <Icon name="lock" className="size-3.5" />
          Your number is never shown or shared.
        </p>
      </form>
    </div>
  );
}
