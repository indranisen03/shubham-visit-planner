# SHUBHAM VISIT PLANNER AGENT — PROJECT BRIEF

Prepared July 24, 2026 for kickoff session. This is the source-of-truth context for the project — see [grill-me.md](grill-me.md) for the architecture discussion still in progress, and [README.md](README.md) (once it exists) for the "why" behind the rules.

## PROJECT GOAL

Build a small, cute, shareable web app that helps Indrani and Shubham plan his visits from Austin to Auburn Hills between now and December 2026, while automatically respecting his H-1B 60-day compliance window, maximizing holiday and long weekend time, and finding good flight deals. Human involvement is limited to the planning/input stage and the final approval stage; the agent handles search, tracking, and drafting in between.

## CORE REQUIREMENTS

### 1. Visit structure
- Visits should be roughly 10 working days at a time, consecutive rather than scattered.
- Avoid weekend-only turnarounds; prefer Thursday evening or Friday morning departures to dodge weekend price spikes.
- Actively look to club visits around long weekends (e.g. Labor Day) and major anchor dates (Durga Puja, Diwali, Thanksgiving, Christmas).
- Skeleton plan should sketch the full next six months up front for the big picture, but only the next visit or two should be firmly booked. Later blocks remain flexible placeholders until closer to the date.

### 2. Sixty day counter (H-1B compliance tracking)
- Onboarding step asks Indrani for a starting counter: days already exhausted since Shubham's last departure (he left Monday this week, current date Friday July 24, 2026).
- Every time a new visit is planned and confirmed by both Indrani and Shubham, the agent updates the counter.
- Visual: a countdown progress bar starting full green at 60, gradually shifting color as days burn down, turning red under 20 days remaining as the key warning zone.
- Important: the agent proposes scheduling only. The actual day counting and compliance threshold should get a real check from an immigration advisor, not fully trusted to the agent's math.

### 3. Shubham's flexi holiday input
- Onboarding flow shows Shubham a list of upcoming long holidays/weekends.
- For each, he can either fill in his flexi day(s) or skip. Skipping is read as "no flexi days available" and the agent plans around that.
- This can be a simple shared invite link he opens once, rather than a spreadsheet.

### 4. Flight search logic
- Search using a flight API (Skyscanner or Amadeus) for Austin to Detroit routes.
- Primary carrier check: Delta (card already acquired, no purchases made yet, likely has a minimum spend requirement for a sign-up bonus worth confirming and hitting on this booking).
- Secondary suggestion: cheapest reasonable nonstop alternative (e.g. Southwest), since it's a long travel day and connections aren't worth the time/money.
- Alaska Airlines card intentionally not used for this route (no viable Austin-Detroit Alaska flights); saved for a future trip.
- Observed price range so far: roughly 500 to 600 dollars round trip on Delta.

### 5. Calendar integration
- Once a window is approved by both, agent drafts the calendar event(s) automatically (Google Calendar connection already available).

## TECH AND HOSTING
- Small web app, likely Streamlit or a lightweight React front end.
- Hosted for free on something like Streamlit Community Cloud or Vercel, giving a shareable link both can open on phones.
- No separate Excel/spreadsheet needed for inputs; onboarding form captures starting counter and flexi days directly, app remembers going forward.

## DESIGN DIRECTION (Pinterest-y, romantic, cute)
- Soft pastel palette, blush and sage tones suggested.
- Calendar grid showing visit blocks visually.
- Small icons for flights and holidays.
- Countdown progress bar for the 60-day window styled as the centerpiece visual, green to red gradient as days deplete.

## CODING STANDARDS (placeholder, to finalize together)
- Clear, descriptive function names.
- Inline comments explaining business logic, especially the 60-day counter and 10-working-day block logic, since the reasoning needs to be understandable months later.
- A README capturing the "why" behind the rules (compliance window, visit cadence, holiday clubbing logic).
- Indrani to bring any additional personal conventions to kickoff session.

## OPEN QUESTIONS FOR KICKOFF
- Confirm exact starting day count already exhausted (Shubham left Monday July 20, 2026).
- Confirm which flight API to use and API key/access setup.
- Confirm hosting choice (Streamlit vs. Vercel/React) based on quickest path to a working v1.
- Walk through new pointers Indrani found for the separate Stellantis Part Shortage / PC Portal work (nine-step plant analyst decision flow plus agent recommendation layer) as a second thread, kept distinct from this project.

## ESTIMATED EFFORT
Since the agent does the bulk of ongoing work (searching, tracking, drafting), Indrani's hands-on time is expected to be light: one focused session (approx. 1 hour) to build v1 and set up onboarding inputs, then brief check-ins of just a few minutes whenever the agent surfaces a proposed visit window for approval.

## CONVERSATION LOG NOTE
This brief was compiled from a detailed back-and-forth planning conversation covering agent project ideas broadly (meal planning, running/kettlebell training, personal finance sweep, and this visit planner), before narrowing to this project. Full conversation nuance preserved in this document as the source of truth for kickoff.
