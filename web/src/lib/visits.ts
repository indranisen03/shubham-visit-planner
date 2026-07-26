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
  // Aligned with actual planned visits.

  const visits: ProposedVisit[] = [];

  // Visit 1: Late July through mid-August (Shubham in Auburn Hills)
  if (daysRemaining >= 10) {
    visits.push({
      id: "visit-1-upcoming",
      startDate: "2026-07-31", // Thu/Fri this week
      endDate: "2026-08-17", // Through mid-August
      workingDays: 12,
      aroundHolidays: [],
      note: "Extended stay (12 working days)",
    });
  }

  // Visit 2: Early September around Labor Day
  if (daysRemaining >= 20) {
    visits.push({
      id: "visit-2-labor-day",
      startDate: "2026-09-03", // Depart Austin Sep 3
      endDate: "2026-09-15", // Return Sep 14-15
      workingDays: 10,
      aroundHolidays: ["labor-day"],
      note: "Labor Day cluster (Sep 3-15)",
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
