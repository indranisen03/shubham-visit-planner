import postgres from "postgres";

// Single shared connection pool, reused across warm serverless invocations.
const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

export const sql = globalForDb.sql ?? postgres(process.env.POSTGRES_URL!, { ssl: "require" });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}

// Two-person app, one shared plan — a single row is all the persistence this needs.
export async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS onboarding (
      id INTEGER PRIMARY KEY DEFAULT 1,
      days_exhausted INTEGER NOT NULL DEFAULT 0,
      floating_picks JSONB NOT NULL DEFAULT '[]',
      anchor_plans JSONB NOT NULL DEFAULT '{}',
      proposed_visits JSONB NOT NULL DEFAULT '[]',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT single_row CHECK (id = 1)
    )
  `;
}
