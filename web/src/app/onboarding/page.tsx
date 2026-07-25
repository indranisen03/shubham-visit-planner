"use client";

import { useEffect, useState } from "react";
import {
  CULTURAL_ANCHORS_2026,
  FIXED_HOLIDAYS_2026,
  FLOATING_HOLIDAY_PICK_LIMIT,
  FLOATING_HOLIDAY_POOL_2026,
} from "@/lib/holidays";
import { counterVisual } from "@/lib/counter";

const ANCHOR_OPTIONS = [
  "Not sure yet",
  "Floating day",
  "PTO / vacation day",
  "Work from India",
  "Won't be able to",
] as const;

type AnchorPlan = {
  option: (typeof ANCHOR_OPTIONS)[number];
  note: string;
};

type OnboardingData = {
  daysExhausted: number;
  floatingPicks: string[];
  anchorPlans: Record<string, AnchorPlan>;
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function OnboardingPage() {
  const [daysExhausted, setDaysExhausted] = useState<number>(0);
  const [floatingPicks, setFloatingPicks] = useState<string[]>([]);
  const [anchorPlans, setAnchorPlans] = useState<Record<string, AnchorPlan>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/onboarding")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        return res.json();
      })
      .then((saved: OnboardingData) => {
        setDaysExhausted(saved.daysExhausted ?? 0);
        setFloatingPicks(saved.floatingPicks ?? []);
        setAnchorPlans(saved.anchorPlans ?? {});
      })
      .catch(() => setError("Couldn't load saved data — starting fresh."))
      .finally(() => setLoading(false));
  }, []);

  const visual = counterVisual(daysExhausted);

  function toggleFloatingPick(id: string) {
    setFloatingPicks((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= FLOATING_HOLIDAY_PICK_LIMIT) return prev;
      return [...prev, id];
    });
  }

  function setAnchorPlan(id: string, patch: Partial<AnchorPlan>) {
    setAnchorPlans((prev) => ({
      ...prev,
      [id]: {
        option: prev[id]?.option ?? "Not sure yet",
        note: prev[id]?.note ?? "",
        ...patch,
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data: OnboardingData = { daysExhausted, floatingPicks, anchorPlans };
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to save (${res.status})`);
      setSubmitted(true);
    } catch {
      setError("Couldn't save — check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl space-y-10">
        <header className="text-center space-y-1">
          <p className="text-sm tracking-wide text-blush-dark">austin ⇄ auburn hills</p>
          <h1 className="text-3xl font-semibold text-foreground">Shubham Visit Planner</h1>
          <p className="text-sm text-foreground/70">
            One quick form so the agent can start sketching visits.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 60-day counter */}
          <section className="rounded-2xl bg-cream p-6 shadow-sm ring-1 ring-blush/60">
            <h2 className="text-lg font-medium">Starting counter (Indrani)</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Days already exhausted since Shubham&apos;s last departure. This is a
              scheduling aid only — the real count and threshold should be
              double-checked with an immigration advisor.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="number"
                min={0}
                max={60}
                value={daysExhausted}
                onChange={(e) =>
                  setDaysExhausted(Math.max(0, Math.min(60, Number(e.target.value) || 0)))
                }
                className="w-24 rounded-lg border border-blush-dark/50 bg-white px-3 py-2 text-center text-lg"
              />
              <span className="text-sm text-foreground/70">days already used out of 60</span>
            </div>
            <div className="mt-4">
              <div className="h-4 w-full overflow-hidden rounded-full bg-white ring-1 ring-blush/60">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${visual.pct * 100}%`, backgroundColor: visual.color }}
                />
              </div>
              <p className="mt-2 text-sm font-medium" style={{ color: visual.color }}>
                {visual.remaining} days remaining
                {visual.zone === "red" ? " — warning zone" : ""}
              </p>
            </div>
          </section>

          {/* Fixed holidays */}
          <section className="rounded-2xl bg-cream p-6 shadow-sm ring-1 ring-sage/60">
            <h2 className="text-lg font-medium">Fixed holidays</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Automatic — no choice needed, just here for planning context.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              {FIXED_HOLIDAYS_2026.map((h) => (
                <li key={h.id} className="rounded-lg bg-sage/40 px-3 py-2">
                  <div className="font-medium">{formatDate(h.date)}</div>
                  <div className="text-foreground/70">{h.label}</div>
                </li>
              ))}
            </ul>
          </section>

          {/* Floating holidays */}
          <section className="rounded-2xl bg-cream p-6 shadow-sm ring-1 ring-blush/60">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-medium">Floating holidays (Shubham)</h2>
              <span className="text-sm font-medium text-blush-dark">
                {floatingPicks.length}/{FLOATING_HOLIDAY_PICK_LIMIT} picked
              </span>
            </div>
            <p className="mt-1 text-sm text-foreground/70">
              Pick exactly {FLOATING_HOLIDAY_PICK_LIMIT}{" "}
              from your employer&apos;s pool. Unpicked days are read as unavailable.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FLOATING_HOLIDAY_POOL_2026.map((h) => {
                const checked = floatingPicks.includes(h.id);
                const disabled = !checked && floatingPicks.length >= FLOATING_HOLIDAY_PICK_LIMIT;
                return (
                  <li key={h.id}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                        checked ? "bg-blush/60" : "bg-white"
                      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleFloatingPick(h.id)}
                        className="h-4 w-4"
                      />
                      <span>
                        <span className="font-medium">{formatDate(h.date)}</span>{" "}
                        <span className="text-foreground/70">{h.label}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Cultural anchors not on the employer calendar */}
          <section className="rounded-2xl bg-cream p-6 shadow-sm ring-1 ring-sage/60">
            <h2 className="text-lg font-medium">Durga Puja &amp; Diwali</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Not on the employer calendar at all — skipping means no time off
              planned around these.
            </p>
            <div className="mt-4 space-y-4">
              {CULTURAL_ANCHORS_2026.map((a) => (
                <div key={a.id} className="rounded-lg bg-sage/30 p-4">
                  <div className="font-medium">
                    {a.name}{" "}
                    <span className="font-normal text-foreground/70">
                      ({formatDate(a.start)} – {formatDate(a.end)})
                    </span>
                  </div>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <select
                      value={anchorPlans[a.id]?.option ?? "Not sure yet"}
                      onChange={(e) =>
                        setAnchorPlan(a.id, { option: e.target.value as AnchorPlan["option"] })
                      }
                      className="rounded-lg border border-sage-dark/50 bg-white px-3 py-2 text-sm"
                    >
                      {ANCHOR_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="optional note"
                      value={anchorPlans[a.id]?.note ?? ""}
                      onChange={(e) => setAnchorPlan(a.id, { note: e.target.value })}
                      className="flex-1 rounded-lg border border-sage-dark/50 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || saving}
            className="w-full rounded-full bg-blush-dark px-6 py-3 text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : loading ? "Loading…" : "Save onboarding info"}
          </button>
        </form>

        {submitted && (
          <div className="rounded-2xl bg-sage/50 p-6 text-sm">
            <p className="font-medium">Saved to the shared database.</p>
            <p className="mt-1 text-foreground/70">
              {visual.remaining} days remaining · {floatingPicks.length}/
              {FLOATING_HOLIDAY_PICK_LIMIT} floating days picked ·{" "}
              {Object.values(anchorPlans).filter((p) => p.option !== "Not sure yet").length}/
              {CULTURAL_ANCHORS_2026.length} cultural anchors planned.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
