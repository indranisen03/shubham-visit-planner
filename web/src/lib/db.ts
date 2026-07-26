import postgres from "postgres";

const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> | any };

let mockData: Record<string, any> = {
  1: { id: 1, days_exhausted: 0, floating_picks: [], anchor_plans: {}, proposed_visits: [], updated_at: new Date() }
};

function createMockSQL() {
  const mockFn = async function sql(strings: TemplateStringsArray, ...values: any[]) {
    const query = strings.join("?").replace(/\?/g, () => `$${values.indexOf(values[0]) + 1}`);

    if (query.includes("CREATE TABLE")) {
      return [];
    }
    if (query.includes("SELECT") && query.includes("onboarding")) {
      return [mockData[1] || { id: 1, days_exhausted: 0, floating_picks: [], anchor_plans: {}, proposed_visits: [] }];
    }
    if (query.includes("UPDATE")) {
      if (values && mockData[1]) {
        const dayIdx = strings.toString().indexOf("days_exhausted");
        const floatIdx = strings.toString().indexOf("floating_picks");
        const anchorIdx = strings.toString().indexOf("anchor_plans");
        const visitIdx = strings.toString().indexOf("proposed_visits");

        if (dayIdx >= 0) mockData[1].days_exhausted = values[0];
        if (floatIdx >= 0) mockData[1].floating_picks = values[1];
        if (anchorIdx >= 0) mockData[1].anchor_plans = values[2];
        if (visitIdx >= 0) mockData[1].proposed_visits = values[3];
        mockData[1].updated_at = new Date();
      }
      return [];
    }
    return [];
  } as any;

  mockFn.json = (value: any) => value;
  mockFn.unsafe = (query: string, values?: any[]) => ({ query, values });
  mockFn[Symbol.asyncIterator] = async function* () {};

  return mockFn;
}

let sql: any;
if (globalForDb.sql) {
  sql = globalForDb.sql;
} else if (process.env.POSTGRES_URL && !process.env.POSTGRES_URL.includes("[SENSITIVE]")) {
  sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });
} else {
  sql = createMockSQL();
}

export { sql };

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}

// Two-person app, one shared plan — a single row is all the persistence this needs.
export async function ensureSchema() {
  try {
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
  } catch (e) {
    // Mock DB — schema doesn't apply
  }
}
