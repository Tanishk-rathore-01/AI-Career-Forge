# PrepPilot Technical Architecture

## Architecture Goal

The system should support a reliable AI interview preparation loop:

- Authenticate users
- Capture career profile data
- Generate role-specific interview questions
- Evaluate answers with structured AI scoring
- Store feedback and scores
- Show progress and readiness over time
- Control cost, latency, and data exposure

The MVP should be simple enough to ship quickly, while leaving clean paths for voice interviews, resume matching, subscriptions, and institution dashboards.

## Recommended Stack

### Application

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion for restrained interface transitions

### Backend

- Next.js Route Handlers
- Server Actions where they simplify authenticated mutations
- Zod for runtime validation
- Central service layer for AI and database operations

### Database

- PostgreSQL
- Prisma ORM
- Neon or Supabase for hosted Postgres

### Authentication

- Clerk for MVP
- Clerk user ID stored on application records as `userId`

### AI

- OpenAI API
- Structured JSON outputs for scoring
- Separate prompts for interview questions, answer evaluation, and salary negotiation

### Deployment

- Vercel for the web app
- Neon or Supabase for database
- Environment variables for secrets

## High-Level System Flow

```text
Browser
  -> Next.js page / component
  -> Server Action or API Route
  -> Auth guard
  -> Zod input validation
  -> Service layer
  -> Prisma / OpenAI
  -> Zod output validation
  -> Database write
  -> UI response
```

AI calls should never happen directly from the browser.

## Suggested Project Structure

```text
src/
  app/
    (marketing)/
      page.tsx
      demo/
    (auth)/
      sign-in/
      sign-up/
    (app)/
      dashboard/
      onboarding/
      practice/
      practice/[sessionId]/
      salary-practice/
      sessions/
      sessions/[sessionId]/
      settings/
    api/
      profile/
      interview-sessions/
      salary-sessions/
      dashboard/
  components/
    app-shell/
    dashboard/
    feedback/
    forms/
    practice/
    salary/
    ui/
  lib/
    ai/
      prompts/
      schemas.ts
      interview-service.ts
      salary-service.ts
    auth/
      require-user.ts
    db/
      prisma.ts
    scoring/
      readiness.ts
    validation/
      profile.ts
      session.ts
  server/
    profile-service.ts
    interview-session-service.ts
    dashboard-service.ts
prisma/
  schema.prisma
```

## Core Domain Model

### User Profile

Stores candidate setup data used to personalize AI sessions.

Key fields:

- `userId`
- `fullName`
- `targetRole`
- `experienceLevel`
- `skills`
- `preferredLocation`
- `salaryCurrency`
- `expectedSalaryMin`
- `expectedSalaryMax`
- `interviewGoal`

### Interview Session

Represents a practice session.

Key fields:

- `id`
- `userId`
- `mode`
- `difficulty`
- `targetRole`
- `status`
- `startedAt`
- `completedAt`

Modes:

- `hr`
- `technical`
- `behavioral`
- `salary`

Statuses:

- `active`
- `completed`
- `abandoned`

### Interview Message

Stores the conversational history.

Key fields:

- `sessionId`
- `role`
- `content`
- `metadata`

Roles:

- `ai`
- `user`
- `system`

### Answer Evaluation

Stores structured scoring for a submitted answer.

Key fields:

- `sessionId`
- `question`
- `answer`
- `overallScore`
- `categoryScores`
- `strengths`
- `weaknesses`
- `improvedAnswer`
- `readinessLevel`
- `estimatedSelectionChance`
- `nextPracticeStep`
- `rubricVersion`

### Usage Event

Tracks usage for cost control and future monetization.

Key fields:

- `userId`
- `eventType`
- `model`
- `inputTokens`
- `outputTokens`
- `estimatedCost`
- `createdAt`

## AI Service Design

Create a dedicated AI layer instead of calling OpenAI from route handlers directly.

Recommended services:

- `generateInterviewQuestion`
- `evaluateInterviewAnswer`
- `generateSalaryPrompt`
- `evaluateSalaryResponse`

Each service should:

1. Accept validated domain input.
2. Build a task-specific prompt.
3. Call the AI provider.
4. Validate the AI output with Zod.
5. Return typed data to the caller.
6. Record usage metadata when available.

## AI Prompt Boundaries

### Question Generation Prompt

Purpose:

- Generate one relevant question.
- Avoid duplicates within the session.
- Match role, skills, experience level, and difficulty.

Temperature:

- Moderate

Output:

- Strict JSON with question, intent, difficulty, and evaluation focus.

### Answer Evaluation Prompt

Purpose:

- Score a single answer against a fixed rubric.
- Give specific, actionable feedback.
- Produce an improved answer.

Temperature:

- Low

Output:

- Strict JSON matching the answer evaluation schema.

### Salary Negotiation Prompt

Purpose:

- Simulate recruiter or HR pushback.
- Evaluate salary response quality.
- Improve negotiation phrasing.

Temperature:

- Low to moderate

Output:

- Strict JSON matching salary evaluation schema.

## Validation Strategy

Validate at every boundary:

- Client form validation for usability
- API route validation for security
- AI response validation for reliability
- Database constraints for data integrity

Use Zod schemas for:

- Profile input
- Session creation
- Question generation output
- Answer evaluation output
- Salary evaluation output
- Dashboard summary output

Invalid AI JSON should not be stored. The system should retry once with a repair prompt or return a controlled error.

## Authorization Strategy

Every private route or mutation must check:

1. User is authenticated.
2. The requested record belongs to the current user.
3. The operation is allowed for the record status.

Examples:

- User cannot read another user's session.
- User cannot evaluate an answer for a completed session unless retry is explicitly supported.
- Demo sessions should be separated from authenticated user history.

## Readiness Score Service

Dashboard readiness should be calculated from stored evaluations, not live AI calls.

Inputs:

- Recent overall scores
- Category scores
- Session completion count
- Profile completeness

Outputs:

- Readiness score
- Readiness label
- Weakest categories
- Strongest categories
- Recommended next mode

The first implementation can use deterministic formulas. AI-generated recommendations can come later after enough structured data exists.

## Error Handling

Required error states:

- AI provider timeout
- AI invalid response
- Rate limit reached
- User not authenticated
- Session not found
- Session belongs to another user
- Empty or too-short answer
- Database write failure

User-facing errors should be direct and recoverable:

- "The AI response could not be scored. Try submitting again."
- "You have reached today's free practice limit."
- "This session is no longer active."

## Security Requirements

- Store all secrets in environment variables.
- Never expose OpenAI keys in client components.
- Keep AI calls server-side.
- Validate request bodies.
- Escape or sanitize user content where rendered.
- Enforce ownership checks before returning private data.
- Avoid collecting protected attributes for scoring.
- Do not claim guaranteed hiring outcomes.

## Cost Controls

MVP controls:

- One demo question before signup
- Daily limit for free authenticated users
- Store all generated questions and evaluations
- Do not re-score unchanged answers
- Track AI usage events

Future controls:

- Model routing by task type
- Premium usage limits
- Institution-level quotas
- Background analytics for high-cost users

## Future Architecture Extensions

### Voice Interview Mode

Add:

- Speech-to-text
- Transcript editing
- Filler-word analysis
- Speaking pace scoring
- Audio permission handling

### Resume and Job Description Matching

Add:

- Resume parser
- Job description parser
- Embeddings
- pgvector
- Skill-gap analysis

### Institution Dashboard

Add:

- Organization model
- Cohorts
- Admin roles
- Aggregate readiness analytics
- Privacy-aware reporting

### Payments

Add:

- Subscription provider
- Plan model
- Usage entitlements
- Billing webhooks
- Premium feature gates

## Engineering Rules for the Build

- Keep AI prompt code versioned and testable.
- Keep AI provider calls behind service functions.
- Never trust AI output without schema validation.
- Do not mix dashboard calculations into React components.
- Do not place secret-dependent logic in client components.
- Use typed domain models instead of loose JSON across the app.
- Add loading, empty, and error states for every AI action.


