import "server-only";
import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

// Reuse one pool across hot reloads in dev.
const globalForDb = globalThis as unknown as { hercallSql?: Sql };

/** Shared Postgres connection pool, or null if DATABASE_URL is missing. */
export function getDb(): Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  globalForDb.hercallSql ??= postgres(url, { max: 5 });
  return globalForDb.hercallSql;
}
