// Shubham's employer holiday calendar for 2026, as pasted by Indrani on 2026-07-25.
// Reconstructed from a paste that lost its original two-column (Fixed/Floating)
// table structure — grouped by HR convention (Fixed = guaranteed for everyone,
// Floating = optional pool capped at 4 picks), not by paste line position, since
// the paste's blank-line artifacts made position unreliable. Worth a one-time
// sanity check with Shubham, but not blocking further build.
export type EmployerHoliday = {
  id: string;
  label: string; // employer's name for the day
  date: string; // ISO date
};

// Guaranteed days off, no selection needed.
export const FIXED_HOLIDAYS_2026: EmployerHoliday[] = [
  { id: "new-years-day", label: "New Year's Day", date: "2026-01-01" },
  { id: "memorial-day", label: "Memorial Day", date: "2026-05-25" },
  { id: "independence-day-observed", label: "Independence Day (observed)", date: "2026-07-03" },
  { id: "labor-day", label: "Labor Day", date: "2026-09-07" },
  { id: "thanksgiving-thu", label: "Thanksgiving Holiday", date: "2026-11-26" },
  { id: "thanksgiving-fri", label: "Thanksgiving Holiday", date: "2026-11-27" },
  { id: "winter-holiday-dec24", label: "Winter Holiday", date: "2026-12-24" },
  { id: "winter-holiday-dec25", label: "Winter Holiday", date: "2026-12-25" },
];

// Shubham picks exactly 4 from this pool — enforce that cap in the UI.
export const FLOATING_HOLIDAY_POOL_2026: EmployerHoliday[] = [
  { id: "new-years-extra", label: "New Year's", date: "2026-01-02" },
  { id: "mlk-day", label: "Martin Luther King Jr. Day", date: "2026-01-19" },
  { id: "presidents-day", label: "President's Day", date: "2026-02-16" },
  { id: "earth-day", label: "Earth Day", date: "2026-04-22" },
  { id: "juneteenth", label: "Juneteenth", date: "2026-06-19" },
  { id: "pre-labor-day-bridge", label: "Bridge day before Labor Day", date: "2026-09-04" },
  { id: "indigenous-peoples-day", label: "Indigenous Peoples' Day", date: "2026-10-12" },
  { id: "veterans-day", label: "Veteran's Day", date: "2026-11-11" },
  { id: "thanksgiving-bridge-mon", label: "Thanksgiving Holiday (bridge)", date: "2026-11-23" },
  { id: "thanksgiving-bridge-tue", label: "Thanksgiving Holiday (bridge)", date: "2026-11-24" },
  { id: "thanksgiving-bridge-wed", label: "Thanksgiving Holiday (bridge)", date: "2026-11-25" },
  { id: "winter-week-dec21", label: "Winter Holiday", date: "2026-12-21" },
  { id: "winter-week-dec22", label: "Winter Holiday", date: "2026-12-22" },
  { id: "winter-week-dec23", label: "Winter Holiday", date: "2026-12-23" },
  { id: "winter-week-dec28", label: "Winter Holiday", date: "2026-12-28" },
  { id: "winter-week-dec29", label: "Winter Holiday", date: "2026-12-29" },
  { id: "winter-week-dec30", label: "Winter Holiday", date: "2026-12-30" },
  { id: "winter-week-dec31", label: "Winter Holiday", date: "2026-12-31" },
];

export const FLOATING_HOLIDAY_PICK_LIMIT = 4;

// Cultural anchor dates that matter for trip-clubbing but are NOT on the
// employer calendar at all — getting time off around these requires spending
// a floating pick, PTO, or WFH days, tracked separately from the pool above.
// Dates confirmed via web search on 2026-07-25 (lunisolar, not computed).
export type CulturalAnchor = {
  id: string;
  name: string;
  start: string;
  end: string;
  note?: string;
};

export const CULTURAL_ANCHORS_2026: CulturalAnchor[] = [
  {
    id: "durga-puja",
    name: "Durga Puja",
    start: "2026-10-17",
    end: "2026-10-21",
    note: "Sat–Wed; not on the employer calendar",
  },
  {
    id: "diwali",
    name: "Diwali",
    start: "2026-11-06",
    end: "2026-11-10",
    note: "Main day (Lakshmi Puja) Sun Nov 8; not on the employer calendar",
  },
];
