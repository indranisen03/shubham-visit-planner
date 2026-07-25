// 60-day H-1B compliance counter math.
// IMPORTANT: this is a scheduling aid only. The actual day count and compliance
// threshold must be verified by an immigration advisor, never trusted solely
// to this app's arithmetic.
export const COUNTER_MAX_DAYS = 60;
export const COUNTER_WARNING_THRESHOLD = 20;

export function daysRemaining(daysExhausted: number): number {
  return Math.max(0, Math.min(COUNTER_MAX_DAYS, COUNTER_MAX_DAYS - daysExhausted));
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(from: string, to: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(from);
  const [r2, g2, b2] = hexToRgb(to);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

const GREEN = "#7FB77E";
const AMBER = "#F2B84B";
const RED = "#E4572E";

// Full green at 60 remaining, gradually shifting, solidly red under the
// 20-day warning threshold (per PROJECT_BRIEF.md's design direction).
export function counterVisual(daysExhausted: number) {
  const remaining = daysRemaining(daysExhausted);
  const pct = remaining / COUNTER_MAX_DAYS;

  let color: string;
  const zone: "green" | "amber" | "red" =
    remaining >= 40 ? "green" : remaining >= COUNTER_WARNING_THRESHOLD ? "amber" : "red";

  if (zone === "green") {
    color = GREEN;
  } else if (zone === "amber") {
    const t = (remaining - COUNTER_WARNING_THRESHOLD) / (40 - COUNTER_WARNING_THRESHOLD);
    color = lerpColor(AMBER, GREEN, t);
  } else {
    const t = remaining / COUNTER_WARNING_THRESHOLD;
    color = lerpColor(RED, AMBER, t);
  }

  return { remaining, pct, color, zone };
}
