# CLAUDE.md — working instructions for this repo

Standing instructions for Claude when working in the Shubham Visit Planner project. See [PROJECT_BRIEF.md](PROJECT_BRIEF.md) for the "what," [grill-me.md](grill-me.md) for the architecture discussion still in progress.

## Reporting

- Share a rough sense of token/cost consumption at each stage of work (and a summary at the end of a session), to the extent the tooling allows. Note: there is no in-conversation tool that reports exact token counts — the CLI's own `/cost` command (run by the user, not invokable by Claude) is the source of truth for exact numbers. When no exact figure is available, say so plainly rather than guessing a precise number, and give a qualitative sense of effort instead (e.g. "this step touched N files / did a web search / spawned a subagent — heavier than the last step").

## Local dev environment

This machine's default Node (`/usr/local/bin/node`) is v16.14.2 — too old for Next.js. A working Node 20 is installed via Homebrew but kept **keg-only** (not linked globally) to avoid clobbering the old manual Node install other projects may depend on. Always prefix Node/npm commands in `web/` with the keg's bin path:

```
PATH="/usr/local/opt/node@20/bin:$PATH" npm run dev
```

See `~/.claude/skills/visit-planner-issues/issues.md` for the full story if this breaks again.

## Coding standards (from PROJECT_BRIEF.md, to refine together)

- Clear, descriptive function names.
- Inline comments explaining business logic, especially the 60-day counter and 10-working-day block logic — the reasoning needs to be understandable months later.
- README captures the "why" behind the rules (compliance window, visit cadence, holiday clubbing logic), not just setup steps.
- Build in small steps, confirm shared understanding before continuing (see grill-me.md).
