# PrepPilot Decision Record

This document captures recommended defaults for the first build. These decisions can change, but the MVP should start with a clear position.

## Decision 1: Audience

Recommendation: start with students, interns, freshers, and experienced professionals across any field.

Reasoning:

- They have a stronger pain point around interview uncertainty.
- They need guided coaching more than advanced customization.
- The first MVP can be simpler and still useful.
- India-focused and international preparation gives the product a sharper identity while supporting global client interviews.

Rejected for MVP:

- Building equally for senior professionals from day one.
- Building recruiter-side tooling before candidate-side value is proven.

## Decision 2: Geography and Salary Context

Recommendation: India-first, globally understandable.

Reasoning:

- Salary expectations, fresher interviews, campus placements, and HR conversations differ by market.
- India-first examples make the product more practical for the likely initial user base.
- The UI copy and architecture should not block global expansion later.

Implementation note:

- Store `preferredLocation` and `salaryCurrency`.
- Default to INR for India users.
- Keep scoring independent of protected or sensitive personal attributes.

## Decision 3: Input Mode

Recommendation: text-first MVP, with voice practice and confidence/filler-word detection in Phase 2.

Reasoning:

- Text-first is faster to build and easier to evaluate reliably.
- Voice adds transcription, latency, permission handling, noise issues, and speech confidence analysis.
- The core value is question quality, feedback quality, and progress tracking.

Future path:

- Add speech-to-text.
- Add filler-word tracking.
- Add speaking pace and confidence indicators.
- Add mock video interview mode only after the text loop works well.

## Decision 4: Authentication Flow

Recommendation: allow one limited demo interview before signup, then require authentication for saving history.

Reasoning:

- A demo reduces friction and lets users feel the product value immediately.
- Saving feedback, tracking progress, and showing dashboard history require an account.
- Demo usage should be rate-limited to control AI cost.

MVP behavior:

- Demo user can answer one question and receive feedback.
- User must sign up to continue, save history, or access dashboard.

## Decision 5: Auth Provider

Recommendation: NextAuth/Auth.js for MVP.

Reasoning:

- Fits the confirmed requirement to avoid Clerk.
- Works well with the Next.js App Router through `auth.ts` and route handlers.
- Supports Google OAuth plus credentials-based email/password login.

Tradeoff:

- Credentials auth requires careful password hashing and validation.
- OAuth provider configuration needs environment variables.

## Decision 6: UI Model

Recommendation: guided AI coach with dashboard depth.

Reasoning:

- Freshers need a clear next step, not a dense enterprise dashboard first.
- The dashboard is still important, but the core experience should feel like being coached through practice.
- The first screen after onboarding should recommend what to practice next.

UX direction:

- Calm, serious, professional interface.
- Strong visual scoring cards.
- Clear progress indicators.
- Practice room should be focused, with minimal distractions.

## Decision 7: Salary Negotiation in MVP

Recommendation: include salary negotiation as an MVP mode, but keep advanced salary analytics for later.

Reasoning:

- Salary practice is a differentiating feature.
- The first version can simulate HR conversations without needing perfect market salary data.
- Advanced compensation benchmarking can become premium later.

MVP behavior:

- User provides expected salary and role.
- AI simulates HR pushback.
- AI scores tone, clarity, confidence, reasoning, flexibility, and value justification.

## Decision 8: Selection Chance

Recommendation: show "estimated selection chance" only as a coaching signal, never as a guarantee.

Reasoning:

- The app cannot know the actual hiring decision.
- A probability-like score can motivate improvement, but must be framed responsibly.
- The readiness score should be more prominent than selection chance.

Required copy principle:

- Use wording like "estimated readiness signal" or "practice-based estimate."
- Avoid wording like "you will get selected" or "guaranteed chance."

## Decision 9: AI Provider Strategy

Recommendation: start with OpenAI API and structured outputs.

Reasoning:

- Reliable structured JSON matters more than raw creativity for scoring.
- The app needs separate prompts for question generation, answer evaluation, and salary simulation.
- Strong validation around AI output is mandatory.

Future path:

- Add model routing by task complexity.
- Use cheaper models for simple HR feedback.
- Use stronger models for technical evaluation.
- Add embeddings and vector search when resume/job description matching is introduced.

## Decision 10: MVP Monetization

Recommendation: build usage tracking now, payments later.

Reasoning:

- Monetization should not delay the first product loop.
- Usage tracking is required for cost control and later subscriptions.
- A future premium plan can unlock unlimited sessions, salary negotiation depth, resume matching, and company-specific prep.

MVP behavior:

- Free users have daily practice limits.
- Admin-configurable usage limits should be possible later.
- No payment integration in the first build unless explicitly prioritized.

## Recommended MVP Defaults

- Audience: students, interns, freshers, and experienced professionals
- Geography: India-first
- Input: text-first, voice-ready Phase 2
- Demo: one free limited demo before signup
- Auth: NextAuth/Auth.js
- UI: guided coach first, dashboard second
- Salary negotiation: included in MVP
- Selection chance: responsible estimate only
- AI provider: OpenAI API
- Monetization: usage tracking now, payments later


