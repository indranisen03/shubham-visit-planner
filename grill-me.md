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
