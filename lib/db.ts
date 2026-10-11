import "server-only";
import postgres from "postgres";

export type Sql = ReturnType<typeof postgres>;

// Reuse one pool across hot reloads in dev.
const globalForDb = globalThis as unknown as { hercallSql?: Sql };

/** Shared Postgres connection pool, or null if DATABASE_URL is missing. */
export function getDb(): Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  globalForDb.hercallSql ??= postgres(url, { max: 5 });
  return globalForDb.hercallSql;
}

/** Readable reason a query failed, e.g. "connect ECONNREFUSED 127.0.0.1:5432". */
export function dbErrorText(error: unknown): string {
  // A refused connection to "localhost" fails on both IPv6 and IPv4 and arrives as an AggregateError.
  const inner = error instanceof AggregateError && error.errors.length > 0 ? error.errors[0] : error;
  if (inner instanceof Error && inner.message) return inner.message;
  return String((inner as { code?: unknown } | null)?.code ?? inner);
}
