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

  // Propose rough 4 visits over the next 6 months, spaced ~6 weeks apart,
  // clustering around major holidays (Labor Day, Durga Puja, Diwali, Thanksgiving, Christmas).
  // Each visit ~10 working days (roughly 2 calendar weeks including weekends).

  // Anchor points: Sep 7 (Labor Day), Oct 17 (Durga Puja), Nov 8 (Diwali), Nov 26 (Thanksgiving), Dec 25 (Christmas)
  // Strategy: Try to land Thu/Fri departures, consecutive working days.

  const visits: ProposedVisit[] = [];

  // Visit 1: Around Labor Day (Sep 5 Fri - Sep 15 Mon = 10 working days)
  if (daysRemaining >= 10) {
    visits.push({
      id: "visit-1-labor-day",
      startDate: "2026-09-04", // Thu evening (working day before Fri)
      endDate: "2026-09-14", // Mon evening (end of next week)
      workingDays: 10,
      aroundHolidays: ["labor-day"],
      note: "Around Labor Day long weekend",
    });
  }

  // Visit 2: Around Durga Puja (Oct 17-21)
  if (daysRemaining >= 20) {
    visits.push({
      id: "visit-2-durga-puja",
      startDate: "2026-10-16", // Fri before Durga Puja starts (Sat Oct 17)
      endDate: "2026-10-26", // Mon after it ends
      workingDays: 10,
      aroundHolidays: ["durga-puja"],
      note: "Durga Puja festival (Oct 17-21)",
    });
  }

  // Visit 3: Around Diwali + Thanksgiving (Nov 6-26)
  // Diwali is Nov 8 (Sun), Thanksgiving is Nov 26 (Thu)
  // Could do one long visit or two shorter ones. Let's do one extended visit spanning both.
  if (daysRemaining >= 30) {
    visits.push({
      id: "visit-3-diwali-thanksgiving",
      startDate: "2026-11-05", // Thu before Diwali (Fri Nov 6)
      endDate: "2026-11-23", // Mon before Thanksgiving (ends just before Thu Nov 26)
      workingDays: 15,
      aroundHolidays: ["diwali", "thanksgiving"],
      note: "Diwali (Nov 8) + Thanksgiving (Nov 26)",
    });
  }

  // Visit 4: Around Christmas (Dec 24-25)
  if (daysRemaining >= 40) {
    visits.push({
      id: "visit-4-christmas",
      startDate: "2026-12-18", // Fri before Christmas week
      endDate: "2026-12-30", // Wed before New Year
      workingDays: 10,
      aroundHolidays: ["christmas"],
      note: "Christmas + year-end break",
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
