import { NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";

export async function GET() {
  await ensureSchema();
  const rows = await sql`SELECT days_exhausted, floating_picks, anchor_plans FROM onboarding WHERE id = 1`;
  const row = rows[0];
  return NextResponse.json({
    daysExhausted: row?.days_exhausted ?? 0,
    floatingPicks: row?.floating_picks ?? [],
    anchorPlans: row?.anchor_plans ?? {},
  });
}

export async function POST(request: Request) {
  await ensureSchema();
  const body = await request.json();
  const daysExhausted = Math.max(0, Math.min(60, Number(body.daysExhausted) || 0));
  const floatingPicks = Array.isArray(body.floatingPicks) ? body.floatingPicks : [];
  const anchorPlans = typeof body.anchorPlans === "object" && body.anchorPlans !== null ? body.anchorPlans : {};

  await sql`
    INSERT INTO onboarding (id, days_exhausted, floating_picks, anchor_plans, updated_at)
    VALUES (1, ${daysExhausted}, ${sql.json(floatingPicks)}, ${sql.json(anchorPlans)}, now())
    ON CONFLICT (id) DO UPDATE SET
      days_exhausted = EXCLUDED.days_exhausted,
      floating_picks = EXCLUDED.floating_picks,
      anchor_plans = EXCLUDED.anchor_plans,
      updated_at = now()
  `;

  return NextResponse.json({ ok: true });
}
