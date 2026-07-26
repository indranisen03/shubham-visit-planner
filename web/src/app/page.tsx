"use client";

import { useEffect, useState } from "react";
import { counterVisual } from "@/lib/counter";
import { generateSkeleton, ProposedVisit } from "@/lib/visits";
import Link from "next/link";

type OnboardingData = {
  daysExhausted: number;
  floatingPicks: string[];
  anchorPlans: Record<string, { option: string; note: string }>;
};

type FlightOption = {
  price?: number;
  airline?: string;
  stops?: number;
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function VisitCard({ visit, onSearchFlights }: { visit: ProposedVisit; onSearchFlights: (visit: ProposedVisit) => void }) {
  const [flightSearching, setFlightSearching] = useState(false);
  const [flights, setFlights] = useState<FlightOption[] | null>(null);
  const [flightError, setFlightError] = useState<string | null>(null);

  const handleSearchFlights = async () => {
    setFlightSearching(true);
    setFlightError(null);
    try {
      const res = await fetch(
        `/api/flights?departureDate=${visit.startDate}&returnDate=${visit.endDate}`
      );
      if (!res.ok) throw new Error("Flight search failed");
      const data = await res.json();
      setFlights(data.data || []);
    } catch (e) {
      setFlightError("Couldn't fetch flights");
    } finally {
      setFlightSearching(false);
    }
  };

  return (
    <div className="rounded-lg bg-blush/40 p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-medium">
          {formatDate(visit.startDate)} – {formatDate(visit.endDate)}
        </h3>
        <span className="text-xs font-medium text-foreground/70">~{visit.workingDays}d</span>
      </div>
      <p className="mt-1 text-sm text-foreground/70">{visit.note}</p>

      <button
        onClick={handleSearchFlights}
        disabled={flightSearching}
        className="mt-3 rounded-lg bg-blush/60 px-3 py-1.5 text-xs font-medium text-foreground hover:opacity-90 disabled:opacity-50"
      >
        {flightSearching ? "Searching..." : "Search Flights"}
      </button>

      {flightError && <p className="mt-2 text-xs text-red-600">{flightError}</p>}

      {flights && flights.length > 0 && (
        <div className="mt-3 space-y-2 rounded-lg bg-black/30 p-3 border border-black/20">
          <p className="text-xs font-semibold text-foreground">✈ {flights.length} options found</p>
          {flights.slice(0, 3).map((flight, i) => (
            <div key={i} className="text-xs text-foreground flex justify-between items-center">
              <span>{flight.airline}</span>
              <span className="font-semibold text-blush">${flight.price}</span>
              {flight.stops > 0 && <span className="text-foreground/60">+{flight.stops} stop{flight.stops > 1 ? "s" : ""}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/onboarding")
      .then((res) => res.json())
      .then((d: OnboardingData) => {
        setData(d);
      })
      .catch(() => setError("Couldn't load data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="min-h-screen bg-background px-4 py-10">Loading...</main>;
  if (error || !data)
    return (
      <main className="min-h-screen bg-background px-4 py-10">
        <p className="text-red-600">{error}</p>
      </main>
    );

  const visual = counterVisual(data.daysExhausted);
  const skeleton = generateSkeleton(data.daysExhausted, data.floatingPicks);

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <header className="text-center space-y-1">
          <p className="text-sm tracking-wide text-blush-dark">austin ⇄ auburn hills</p>
          <h1 className="text-4xl font-semibold text-foreground">Visit Planner</h1>
          <p className="text-sm text-foreground/70">6-month skeleton for the next trip(s)</p>
        </header>

        {/* 60-day counter */}
        <section className="rounded-2xl bg-cream p-6 shadow-sm ring-1 ring-blush/60">
          <h2 className="text-lg font-medium">H-1B 60-day window</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="text-3xl font-semibold" style={{ color: visual.color }}>
              {visual.remaining}
            </div>
            <div className="text-sm text-foreground/70">days remaining</div>
          </div>
          <div className="mt-4">
            <div className="h-6 w-full overflow-hidden rounded-full bg-white ring-1 ring-blush/60">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${visual.pct * 100}%`, backgroundColor: visual.color }}
              />
            </div>
          </div>
          {visual.zone === "red" && (
            <p className="mt-2 text-sm font-medium text-red-600">⚠️ Warning zone — very limited time left</p>
          )}
        </section>

        {/* 6-month skeleton */}
        <section className="rounded-2xl bg-cream p-6 shadow-sm ring-1 ring-blush/60">
          <h2 className="text-lg font-medium">Proposed 6-month skeleton</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Rough visit windows (blue shades). Confirm dates + search flights in the{" "}
            <Link href="/onboarding" className="font-medium text-amber-400 hover:text-amber-300 transition">
              onboarding form
            </Link>
            .
          </p>

          <div className="mt-6 space-y-3">
            {skeleton.length === 0 ? (
              <p className="text-sm text-foreground/70">No visits possible with 0 days remaining.</p>
            ) : (
              skeleton.map((visit) => (
                <VisitCard key={visit.id} visit={visit} onSearchFlights={() => {}} />
              ))
            )}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-blush/50 p-6 text-center">
          <p className="font-medium">Ready to plan the next trip?</p>
          <Link
            href="/onboarding"
            className="mt-3 inline-block rounded-full bg-blush-dark px-6 py-2 text-white hover:opacity-90"
          >
            Onboarding form
          </Link>
        </div>
      </div>
    </main>
  );
}
