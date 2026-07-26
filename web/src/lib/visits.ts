// 6-month visit skeleton generation logic.
// Given counter + holidays, propose a skeleton plan without storing it yet.

import { FIXED_HOLIDAYS_2026, FLOATING_HOLIDAY_POOL_2026, CULTURAL_ANCHORS_2026 } from "./holidays";

export type ProposedVisit = {
  id: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  workingDays: number;
  aroundHolidays: string[]; // holiday IDs this clusters near
  note: string;
};

export function generateSkeleton(
  daysExhausted: number,
  floatingPicks: string[]
): ProposedVisit[] {
  const daysRemaining = Math.max(0, 60 - daysExhausted);

  // Propose next 2 upcoming trips, max 10 working days each.
  // Focus on clustering around major holidays to maximize value.

  const visits: ProposedVisit[] = [];

  // Visit 1: Coming weekend + 10 working days (late July/early Aug)
  if (daysRemaining >= 10) {
    visits.push({
      id: "visit-1-upcoming",
      startDate: "2026-07-27", // This coming weekend
      endDate: "2026-08-07", // ~10 working days later
      workingDays: 10,
      aroundHolidays: [],
      note: "Coming trip (10 working days)",
    });
  }

  // Visit 2: Around Labor Day (early Sep)
  if (daysRemaining >= 20) {
    visits.push({
      id: "visit-2-labor-day",
      startDate: "2026-09-04", // Labor Day weekend cluster
      endDate: "2026-09-14",
      workingDays: 10,
      aroundHolidays: ["labor-day"],
      note: "Labor Day long weekend cluster",
    });
  }

  return visits;
}

function countWorkingDays(startIso: string, endIso: string): number {
  const start = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++; // skip Sat (6) and Sun (0)
    current.setDate(current.getDate() + 1);
  }
  return count;
}
