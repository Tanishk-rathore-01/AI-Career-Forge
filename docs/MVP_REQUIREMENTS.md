# PrepPilot MVP Requirements

## MVP Goal

Build a focused AI interview preparation platform that helps students, freshers, and early-career professionals practice role-specific interviews, improve their answers, prepare for salary negotiation, and track interview readiness.

The MVP should prove one core loop:

1. User sets a career target.
2. AI runs a focused practice session.
3. User submits an answer.
4. AI gives structured scoring and coaching.
5. User can see progress over time.

## Target User

Primary persona:

- Student, fresher, or early-career candidate
- 0-3 years of experience
- Preparing for internships, entry-level jobs, or first job switch
- Needs guidance on answer quality, confidence, and salary conversation

Initial market assumption:

- India-first examples and salary context
- Product language should remain globally understandable

## Positioning

PrepPilot should be positioned as:

> A personal AI interview coach that helps candidates practice, improve, and measure readiness before real interviews.

It should not be positioned as:

- A guaranteed job selection predictor
- A generic chatbot
- A replacement for real recruiters or mentors

## MVP User Journeys

### Journey 1: First-Time Practice

1. User lands on the homepage.
2. User sees a clear promise: practice interviews and get an AI readiness score.
3. User starts a demo or creates an account.
4. User selects target role, experience level, and skills.
5. User chooses interview mode.
6. AI asks a question.
7. User submits a text answer.
8. AI returns score, feedback, improved answer, and next step.

### Journey 2: Returning User Improvement

1. User opens dashboard.
2. User sees readiness score and weak areas.
3. User starts recommended practice.
4. User compares new score with previous sessions.
5. User receives a next practice recommendation.

### Journey 3: Salary Negotiation Practice

1. User selects salary negotiation mode.
2. User enters current salary, expected salary, location, and target role.
3. AI acts as recruiter or HR.
4. User responds to salary questions.
5. AI scores confidence, professionalism, justification strength, and flexibility.
6. User receives a stronger salary response.

## Functional Requirements

### Authentication

MVP requirement:

- User can sign up and sign in.
- User session is protected.
- Private interview history is only visible to the owner.

Recommended implementation:

- Clerk for fastest MVP
- NextAuth only if full auth control is preferred

### User Profile

User can save:

- Full name
- Target role
- Experience level
- Skills
- Preferred location
- Expected salary range
- Interview goal

Validation:

- Target role is required.
- Experience level is required.
- Skills must be an array, even if empty.
- Salary fields are optional but required for salary negotiation mode.

### Interview Session

User can create a session with:

- Mode: HR, technical, behavioral, or salary negotiation
- Difficulty: beginner, intermediate, or advanced
- Target role
- Skills context

Session behavior:

- AI generates one question at a time.
- User answers with text.
- AI can ask follow-up questions in later iterations.
- Each answer receives structured feedback.

### Answer Evaluation

Each evaluated answer must include:

- Overall score from 0 to 100
- Category scores from 0 to 100
- Strengths
- Weaknesses
- Improved answer
- Readiness level
- Estimated selection chance as a non-guaranteed estimate
- Next practice step

The system must validate the AI response before saving it.

### Dashboard

Dashboard must show:

- Current readiness score
- Average score
- Recent sessions
- Weakest categories
- Strongest categories
- Recommended next practice mode

### Session History

User can review:

- Past sessions
- Questions asked
- Answers submitted
- Feedback received
- Score trend

## AI Requirements

### Question Generation

Input:

- Target role
- Experience level
- Skills
- Interview mode
- Difficulty
- Previous questions in the same session

Output:

```json
{
  "question": "string",
  "intent": "string",
  "difficulty": "beginner | intermediate | advanced",
  "evaluationFocus": ["string"]
}
```

Rules:

- Do not repeat questions in the same session.
- Keep questions appropriate for the user's experience level.
- Technical questions must match the target skills.
- HR questions should be realistic and concise.

### Answer Scoring

Input:

- Question
- User answer
- Target role
- Experience level
- Interview mode
- Evaluation rubric

Output:

```json
{
  "overallScore": 78,
  "categoryScores": {
    "clarity": 82,
    "relevance": 80,
    "confidence": 74,
    "structure": 76,
    "technicalDepth": 70
  },
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvedAnswer": "string",
  "readinessLevel": "Needs Foundation | Developing | Moderate | Strong | Interview Ready",
  "estimatedSelectionChance": 65,
  "nextPracticeStep": "string"
}
```

Rules:

- Return strict JSON.
- Scores must be integers between 0 and 100.
- Feedback must be specific to the submitted answer.
- Do not overpromise hiring outcomes.
- For very short or irrelevant answers, score strictly and explain why.
- For technical questions, do not reward confident but incorrect answers.

### Salary Negotiation Scoring

Salary negotiation should score:

- Confidence
- Professional tone
- Market reasoning
- Flexibility
- Clarity
- Value justification

The AI should coach the user toward firm, respectful negotiation instead of aggressive or desperate language.

## Readiness Calculation

Suggested formula for MVP:

```text
readinessScore =
  average(last 5 overall interview scores) * 0.7
  + average(last 5 consistency scores) * 0.2
  + profileCompletenessScore * 0.1
```

If there are fewer than 3 completed evaluations, show:

- "Not enough data yet"
- Best available session score
- Prompt to complete more practice

Readiness labels:

- 0-40: Needs Foundation
- 41-60: Developing
- 61-75: Moderate
- 76-88: Strong
- 89-100: Interview Ready

## Non-Functional Requirements

### Security

- Keep API keys server-side only.
- Never expose AI provider credentials to the browser.
- Validate all request bodies with schema validation.
- Enforce user ownership on session and history reads.
- Do not store unnecessary sensitive personal data.

### Reliability

- Handle AI timeout gracefully.
- Handle invalid AI JSON with retry or fallback error.
- Store every completed evaluation transactionally.
- Avoid duplicate submissions from double-clicking.

### Performance

- Dashboard should load from stored data, not live AI calls.
- Evaluation calls should show clear loading state.
- Cache or store generated questions per session.

### Cost Control

- Limit free daily sessions.
- Use short prompts.
- Use structured outputs.
- Store feedback instead of regenerating.
- Add usage tracking per user.

### Responsible AI

- Selection chance must be framed as a coaching estimate.
- The app must not claim guaranteed job outcomes.
- Feedback should be constructive and non-discriminatory.
- Avoid collecting protected attributes for scoring.

## Suggested Pages

### Public

- `/`
- `/demo`
- `/sign-in`
- `/sign-up`

### Authenticated

- `/dashboard`
- `/onboarding`
- `/practice`
- `/practice/[sessionId]`
- `/sessions`
- `/sessions/[sessionId]`
- `/salary-practice`
- `/settings`

## Suggested API Routes

```text
POST /api/profile
GET  /api/profile

POST /api/interview-sessions
GET  /api/interview-sessions
GET  /api/interview-sessions/:id

POST /api/interview-sessions/:id/questions
POST /api/interview-sessions/:id/evaluate

POST /api/salary-sessions
POST /api/salary-sessions/:id/evaluate

GET  /api/dashboard/summary
```

## Suggested Database Entities

### Profile

- id
- userId
- fullName
- targetRole
- experienceLevel
- skills
- preferredLocation
- expectedSalaryMin
- expectedSalaryMax
- interviewGoal
- createdAt
- updatedAt

### InterviewSession

- id
- userId
- mode
- difficulty
- targetRole
- status
- startedAt
- completedAt
- createdAt
- updatedAt

### InterviewMessage

- id
- sessionId
- role
- content
- metadata
- createdAt

### AnswerEvaluation

- id
- sessionId
- question
- answer
- overallScore
- categoryScores
- strengths
- weaknesses
- improvedAnswer
- readinessLevel
- estimatedSelectionChance
- nextPracticeStep
- rubricVersion
- createdAt

## MVP Acceptance Criteria

The MVP is ready when:

- A user can create an account.
- A user can complete onboarding.
- A user can start a mock interview session.
- AI can generate a relevant question.
- User can submit a text answer.
- AI returns validated structured feedback.
- Feedback is stored in the database.
- Dashboard summarizes scores from stored sessions.
- User can review past session history.
- Salary negotiation mode works with structured scoring.
- API keys are never exposed in client code.
- Basic error states are handled.

## Recommended Build Order

1. Scaffold Next.js app with TypeScript and Tailwind.
2. Add shadcn/ui and base layout.
3. Add auth.
4. Add Prisma and PostgreSQL schema.
5. Build onboarding.
6. Build interview session creation.
7. Add AI question generation.
8. Add AI answer evaluation with validation.
9. Add dashboard.
10. Add session history.
11. Add salary negotiation mode.
12. Add polish, loading states, and empty states.

## Open Decisions

1. Should one free demo interview be allowed before login?
2. Should the app require resume upload in MVP, or only ask profile questions?
3. Should the first UI feel more like a dashboard or more like a guided coach?
4. Should salary negotiation be free or premium later?
5. Should the initial build use Clerk or NextAuth?


