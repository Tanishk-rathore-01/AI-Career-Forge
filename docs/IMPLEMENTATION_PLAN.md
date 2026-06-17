# PrepPilot Implementation Plan

## Build Strategy

Build the product in vertical slices. Each phase should produce a usable part of the application that can be tested end to end.

Avoid building all UI first or all backend first. The core risk is the AI practice loop, so the build should reach that loop quickly.

## Phase 0: Project Setup

### Goal

Create a production-grade Next.js foundation.

### Tasks

- Scaffold Next.js App Router with TypeScript.
- Add Tailwind CSS.
- Add shadcn/ui.
- Add linting and formatting.
- Add base environment variable template.
- Add shared app layout.
- Add route groups for public and authenticated areas.

### Done When

- App runs locally.
- TypeScript compiles.
- Lint passes.
- Home page renders.
- README has setup instructions.

## Phase 1: Design System and Shell

### Goal

Create the visual foundation for a serious career coaching product.

### Tasks

- Build marketing/home page.
- Build authenticated app shell.
- Build dashboard layout.
- Add navigation.
- Add reusable score card, feedback panel, progress indicator, and empty state components.
- Add mobile responsive behavior.

### UX Rules

- Keep the interface focused and professional.
- Use a guided coach feel, not a generic admin dashboard.
- Avoid clutter in the practice room.
- Make feedback visually scannable.

### Done When

- Public home page is responsive.
- Authenticated shell layout is ready.
- Key reusable components exist.
- Empty states are designed.

## Phase 2: Authentication

### Goal

Add secure user identity and protected routes.

### Tasks

- Integrate NextAuth/Auth.js.
- Add sign-in and sign-up pages.
- Protect authenticated routes.
- Add `requireUser` helper.
- Confirm user ID is available server-side.

### Done When

- User can sign up.
- User can sign in.
- User can sign out.
- Protected pages redirect unauthenticated users.
- Server routes can access authenticated user ID.

## Phase 3: Database and Domain Schema

### Goal

Persist profiles, sessions, messages, evaluations, and usage events.

### Tasks

- Add Prisma.
- Configure PostgreSQL.
- Create schema models:
  - Profile
  - InterviewSession
  - InterviewMessage
  - AnswerEvaluation
  - UsageEvent
- Add enums for mode, difficulty, status, and readiness level.
- Add indexes for user-owned queries.
- Add Prisma client helper.

### Done When

- Migration runs.
- Prisma client generates.
- Database can create and read a profile.
- Ownership fields exist on private records.

## Phase 4: Onboarding

### Goal

Capture candidate context for AI personalization.

### Tasks

- Build onboarding form.
- Validate profile input.
- Save profile.
- Allow profile editing.
- Redirect users without a profile to onboarding.

### Done When

- User can complete onboarding.
- Profile data persists.
- Required fields are validated.
- Salary fields can be skipped except for salary practice.

## Phase 5: AI Service Layer

### Goal

Create a safe AI abstraction before connecting UI flows.

### Tasks

- Add AI provider client server-side.
- Add prompt templates.
- Add Zod schemas for AI outputs.
- Implement:
  - `generateInterviewQuestion`
  - `evaluateInterviewAnswer`
  - `generateSalaryPrompt`
  - `evaluateSalaryResponse`
- Add retry/repair path for invalid AI JSON.
- Add usage event recording.

### Done When

- AI services return typed validated data.
- Invalid AI output is rejected.
- Secrets are server-side only.
- Prompt and rubric versions are included.

## Phase 6: Interview Practice Loop

### Goal

Build the core product loop.

### Tasks

- Create interview session.
- Generate first question.
- Render practice room.
- Submit text answer.
- Evaluate answer.
- Store question, answer, and feedback.
- Show feedback panel.
- Allow next question or finish session.

### Done When

- User can complete one full interview answer cycle.
- Feedback is stored.
- Evaluation can be reviewed after page refresh.
- Duplicate submissions are prevented.
- Loading and error states are handled.

## Phase 7: Dashboard and History

### Goal

Turn stored practice into progress tracking.

### Tasks

- Build dashboard summary service.
- Calculate readiness score.
- Identify weakest and strongest categories.
- Show recent sessions.
- Build session history list.
- Build session detail page.

### Done When

- Dashboard loads from stored data.
- No AI call is needed for dashboard summary.
- User can view prior answers and feedback.
- Empty dashboard guides new users to practice.

## Phase 8: Salary Negotiation Mode

### Goal

Add the differentiating salary practice workflow.

### Tasks

- Add salary practice start flow.
- Require salary range for this mode.
- Generate recruiter prompt.
- Submit user response.
- Evaluate negotiation quality.
- Show improved response.
- Store salary session messages and scoring.

### Done When

- User can complete one salary negotiation exchange.
- Feedback includes negotiation-specific scores.
- AI simulates realistic but respectful recruiter pressure.
- Session is saved and visible in history.

## Phase 9: Demo Flow and Usage Limits

### Goal

Let users experience value before signup while protecting AI cost.

### Tasks

- Build limited demo page.
- Allow one question and one evaluation.
- Track demo usage by browser session or IP-aware middleware.
- Prompt signup after feedback.
- Add daily limit for authenticated free users.

### Done When

- Demo works without login.
- Demo cannot be used indefinitely.
- Authenticated users have enforceable daily limits.
- Limit errors are user-friendly.

## Phase 10: Polish and Verification

### Goal

Prepare the MVP for real testing.

### Tasks

- Add loading states.
- Add empty states.
- Add error states.
- Test mobile layouts.
- Check accessibility basics.
- Verify API key isolation.
- Verify ownership checks.
- Add basic automated tests for scoring helpers and validation schemas.

### Done When

- Core flows work on desktop and mobile.
- Lint passes.
- Typecheck passes.
- Tests pass.
- No secrets are exposed to the browser.
- Unauthorized users cannot access private records.

## Suggested First Commit Scope

The first implementation commit should include:

- Next.js scaffold
- Tailwind
- basic layout
- README setup instructions
- implemented PrepPilot public landing and authenticated app shell

Do not include AI logic in the first commit. Establish the project foundation first.

## Key Risks

### AI Output Reliability

Risk:

- Model returns invalid JSON or generic feedback.

Mitigation:

- Strict schemas, low-temperature scoring, retry/repair, and prompt versioning.

### Cost Growth

Risk:

- Demo and free usage can become expensive.

Mitigation:

- Usage limits, stored feedback, no repeated scoring, and usage events.

### Misleading Selection Probability

Risk:

- Users may treat selection chance as a guarantee.

Mitigation:

- Label as practice-based estimate and prioritize readiness score.

### Scope Creep

Risk:

- Resume builder, voice, payments, and company prep can delay MVP.

Mitigation:

- Keep MVP text-first and focused on the interview loop.

## First Build Recommendation

Start with phases 0 through 4 before integrating any AI provider. This ensures the product has a stable app shell, auth, database, and onboarding context before expensive AI workflows are connected.


