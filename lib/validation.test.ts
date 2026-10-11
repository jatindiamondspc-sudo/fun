import { test } from "node:test";
import assert from "node:assert/strict";
import { fieldErrorsFrom, menSchema, womenSchema } from "./validation.ts";

const validWoman = {
  name: "  Priya  ",
  phone: "+91 98765-43210",
  age: "24",
  area: "Gurgaon",
  instagram: "@priya.s",
  consent: "on",
};

const validMan = { ...validWoman, name: "Rahul", email: " Rahul@Example.COM ", priceWilling: "499" };

function errorsFor(schema: typeof womenSchema | typeof menSchema, input: unknown) {
  const result = schema.safeParse(input);
  assert.equal(result.success, false);
  return fieldErrorsFrom(result.error!);
}

test("valid woman signup is normalized", () => {
  const result = womenSchema.safeParse(validWoman);
  assert.ok(result.success);
  assert.deepEqual(result.data, {
    name: "Priya",
    phone: "9876543210",
    age: 24,
    area: "Gurgaon",
    instagram: "priya.s",
    consent: "on",
  });
});

test("phone formats are normalized to 10 digits", () => {
  for (const phone of ["9876543210", "09876543210", "919876543210", "98765 43210"]) {
    const result = womenSchema.safeParse({ ...validWoman, phone });
    assert.ok(result.success, phone);
    assert.equal(result.data.phone, "9876543210");
  }
});

test("invalid phone numbers are rejected", () => {
  assert.equal(errorsFor(womenSchema, { ...validWoman, phone: " " }).phone, "Enter your WhatsApp number");
  for (const phone of ["12345", "5876543210", "98765432101"]) {
    assert.equal(
      errorsFor(womenSchema, { ...validWoman, phone }).phone,
      "Enter a valid 10-digit Indian mobile number",
      phone,
    );
  }
});

test("age must be 18+", () => {
  assert.equal(errorsFor(womenSchema, { ...validWoman, age: "17" }).age, "You must be 18 or older to join");
  assert.equal(errorsFor(womenSchema, { ...validWoman, age: "" }).age, "Enter your age");
  assert.equal(errorsFor(womenSchema, { ...validWoman, age: "abc" }).age, "Enter your age");
  assert.ok(womenSchema.safeParse({ ...validWoman, age: "18" }).success);
});

test("consent is required", () => {
  const noConsent: Partial<typeof validWoman> = { ...validWoman };
  delete noConsent.consent;
  assert.equal(errorsFor(womenSchema, noConsent).consent, "Please accept to continue");
});

test("empty form reports every required field", () => {
  const errors = errorsFor(womenSchema, {});
  assert.deepEqual(Object.keys(errors).sort(), ["age", "area", "consent", "name", "phone"]);
});

test("instagram is optional", () => {
  const noInsta: Partial<typeof validWoman> = { ...validWoman };
  delete noInsta.instagram;
  assert.ok(womenSchema.safeParse(noInsta).success);
  assert.ok(womenSchema.safeParse({ ...validWoman, instagram: "" }).success);
  assert.equal(errorsFor(womenSchema, { ...validWoman, instagram: "not valid!" }).instagram, "Enter a valid Instagram handle");
});

test("men need email and price answer", () => {
  const result = menSchema.safeParse(validMan);
  assert.ok(result.success);
  assert.equal(result.data.email, "rahul@example.com");
  assert.equal(result.data.priceWilling, "499");

  const errors = errorsFor(menSchema, { ...validWoman, email: "nope" });
  assert.equal(errors.email, "Enter a valid email");
  assert.equal(errors.priceWilling, "Pick an option");
  assert.equal(errorsFor(menSchema, { ...validMan, email: "" }).email, "Enter your email");
});
