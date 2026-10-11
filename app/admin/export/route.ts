import { dbErrorText, getDb } from "@/lib/db";

// CSV of every signup. Protected by middleware.ts.

export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  if (value == null) return "";
  let text = value instanceof Date ? value.toISOString() : String(value);
  // Names come from a public form: stop Excel/Sheets from running them as formulas.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET() {
  const sql = getDb();
  if (!sql) return new Response("DATABASE_URL is not set", { status: 500 });

  let rows;
  try {
    rows = await sql`
      select created_at, gender, name, phone, age, area, instagram, email, price_willing,
             referral_code, referred_by, utm_source, utm_medium, utm_campaign
      from waitlist order by created_at`;
  } catch (error) {
    console.error("[admin] CSV export failed", error);
    return new Response(`Can't load signups from the database: ${dbErrorText(error)}`, { status: 503 });
  }
  const columns = rows.columns.map((column) => column.name);
  const lines = [columns.join(","), ...rows.map((row) => columns.map((c) => csvCell(row[c])).join(","))];
  const date = new Date().toISOString().slice(0, 10);

  // BOM so Excel opens the file as UTF-8.
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hercall-waitlist-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
