# grill-me.md — architecture discussion log

Working notes for the back-and-forth needed before we lock an architecture for the Shubham Visit Planner. Once we agree on stack/hosting/data model, the settled decisions move into `PROJECT_BRIEF.md` / `README.md` and this file becomes historical record.

## 2026-07-25 — Kickoff

**Decided:**
- Project lives in its own repo, separate from the old `GradSchool` repo (`repository2`), to avoid mixing unrelated work.
- Global `issues.md` (troubleshooting log, reusable across future projects) lives at `~/.claude/skills/visit-planner-issues/issues.md`, structured so it can become a Claude Code skill later.
- GitHub home: `https://github.com/indranisen03` — confirming exact repo name and push plan next.

**Still open (from PROJECT_BRIEF.md "Open Questions for Kickoff"):**
1. Exact starting day count already exhausted on the 60-day counter (Shubham left Monday July 20, 2026; today is Friday July 24... actually confirm today's real date before locking this).
2. Which flight API — Skyscanner vs Amadeus — and API key/access setup.
3. Hosting/stack choice — Streamlit vs. Vercel/React — pick for fastest path to a working v1.
4. Stellantis Part Shortage / PC Portal work is a separate thread, not in scope here — just flagged so it doesn't get conflated.

**Next small step:** confirm GitHub repo name + whether to push now, then lock stack choice (this is the one architectural decision that shapes everything else — data storage, hosting, how onboarding forms work).

## 2026-07-25 — GitHub + stack discussion

**Decided:** Repo pushed to `github.com/indranisen03/shubham-visit-planner` over SSH (existing SSH key already authorized on the account).

**Stack question raised:** Streamlit vs. React/Vercel — benefits, which is "lighter," does it have client-side rendering.

Key facts surfaced:
- **Streamlit** = server-side only. No client-side rendering — the whole Python script reruns on the server on every interaction, and the browser just displays what comes back over a websocket. Lighter to *build* (single Python file, no separate API layer, free one-click hosting on Community Cloud) but the rerun model adds latency for anything that calls an external API (flight search) unless results are cached, and "cute Pinterest-y" custom design fights the framework (CSS injection hacks, not full control).
- **React + Vercel** = true client-side rendering (or hybrid SSR/hydration with Next.js). Full design control (matches the pastel/gradient/calendar-grid design brief much better) and a snappier end-user feel, but more setup: components, state management, API routes for flight/calendar calls. Free Vercel hosting is fast and mobile-friendly out of the box.
- "Lighter" splits two ways: lighter to build → Streamlit; lighter/snappier at runtime for the user → React (client-side).

**Recommendation given (not yet confirmed):** Streamlit for v1, given the brief's ~1 hour build estimate and the fact the agent (not the UI) does the heavy lifting — accept the design-polish tradeoff for now, revisit with a React rebuild later if the "cute" factor matters enough. Open until Indrani decides.

## 2026-07-25 — Architecture locked

**Decision:** React from the outset, not Streamlit. Driving reason: flight search latency matters more than design polish for v1 — Streamlit's whole-script-rerun-per-interaction model risked slow/re-fetching behavior on every click; a real client-side React app avoids that.

**Follow-up fork surfaced:** "React + Vercel" still needed a backend answer, since flight/calendar API keys can't live in the browser. Resolved:
- **Framework:** Next.js (not plain React+Vite) — built-in serverless API routes double as the caching/dedupe layer for flight search calls, deploys natively to Vercel as one codebase.
- **Data storage:** Vercel Postgres (Neon-backed), chosen over Supabase — auto-wires into a Vercel/Next.js project with no extra config, and Supabase's auth/realtime features aren't needed for a 2-person app.

**This closes the core architecture decision.** Full stack: **Next.js (React, client-side rendering) + Vercel Postgres, deployed on Vercel.** Remaining open items (flight API vendor, exact 60-day starting count) are implementation details, not architecture — tracked in PROJECT_BRIEF.md's open questions, not blocking further build.

## 2026-07-25 — Scaffold verified working

`create-next-app` (TypeScript, Tailwind, App Router, `src/` dir) scaffolded into `web/`. Hit and resolved a Node version + Tailwind native-binary issue (full detail in the global issues log, not repeated here). Confirmed working end-to-end: `next build` succeeds, `next dev` serves the default page cleanly in-browser with no console errors, via a `.claude/launch.json` preview config.

**Architecture is now shared-understanding-complete** for the foundational layer (Next.js + Vercel Postgres + Vercel hosting, local dev running). From here, remaining decisions are feature-level (onboarding form design, flight API vendor, DB schema) and can be worked through as we build each piece, not as blocking pre-build discussion.

## 2026-07-25 — Flight API + final push

**Flight search setup:** RapidAPI + Flights Scraper Sky API. Indrani added `RAPIDAPI_KEY` to Vercel Environment Variables. Ready for wiring.

**Dashboard live:** Home page now shows counter + 6-month skeleton (proposed visits around Labor Day, Durga Puja, Diwali/Thanksgiving, Christmas). All auto-generated from the counter + holiday data already in Postgres.

**Remaining for v1:** flight search logic, Google Calendar integration (blocked on Indrani reconnecting the calendar connector).

## 2026-07-25 — Onboarding form v1 (localStorage, no DB yet)

Built `/onboarding` (`web/src/app/onboarding/page.tsx`) with three parts: the 60-day counter input with a live green→amber→red gradient bar (`web/src/lib/counter.ts`), a real "Fixed vs. Floating" employer holiday model (`web/src/lib/holidays.ts`, replacing the earlier generic Labor Day/Thanksgiving/Christmas placeholders), and a Durga Puja/Diwali section since those aren't on the employer calendar at all.

**Real holiday data received from Indrani**, reconstructed from a paste that lost its original two-column table structure — grouped by HR convention rather than paste line position (see the file's header comment for the full reasoning). Flagged as worth a one-time sanity check with Shubham, not blocking.

**Persistence:** localStorage only for now, not real Vercel Postgres yet — that needs Indrani to connect the GitHub repo to a Vercel project and provision Postgres first (an account-level action, not something doable from here). Tracked as the next infrastructure step once this form's shape feels right.

**Verified in-browser:** counter bar transitions correctly through all three color zones, floating-day picker enforces the 4-pick cap, form data round-trips through localStorage. Caught and fixed a JSX whitespace bug in the process (full detail in the global issues log) — a reminder that even non-interactive text needs an actual browser check, not just a successful build.
