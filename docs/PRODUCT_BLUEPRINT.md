# PrepPilot Product Blueprint

## Product Vision

PrepPilot is a full-stack AI career preparation platform that helps job seekers practice interviews, improve answers, prepare salary negotiation, and understand their readiness before a real interview.

The product should feel like a personal AI career coach, not a generic chatbot. Every session should produce structured feedback, a measurable score, and a clear next step.

## Primary Audience

Recommended first audience:

- Students
- Interns
- Freshers
- Experienced professionals from any field

This audience is the best starting point because they need practical interview confidence, salary coaching, and role-specific preparation across both India-focused and international opportunities.

Future expansion:

- Mid-career professionals
- Career switchers
- Senior candidates preparing for leadership interviews

## Core Problem

Most candidates do not know:

- Which questions they should practice for their target role
- Whether their answers are strong enough
- How to improve weak answers
- How to handle HR and salary negotiation conversations
- How ready they are for a real interview

PrepPilot solves this by giving users repeated practice, structured scoring, and personalized improvement plans.

## MVP Scope

The first version should focus on a complete interview preparation loop.

### Must-Have Features

1. User onboarding
   - Target role
   - Experience level
   - Skills
   - Preferred job location
   - Expected salary
   - Interview goal

2. AI mock interview
   - Role-specific questions
   - Behavioral, HR, and technical modes
   - Follow-up questions based on user answers
   - Text-based answers for MVP

3. AI answer evaluation
   - Overall score
   - Category scores
   - Strengths
   - Weaknesses
   - Improved answer
   - Actionable next step

4. Salary negotiation practice
   - AI acts as recruiter or HR
   - User practices expected salary, counter offers, and reasoning
   - AI scores negotiation confidence and professionalism

5. Dashboard
   - Average interview score
   - Recent sessions
   - Strongest areas
   - Weakest areas
   - Readiness level
   - Improvement trend

6. Session history
   - Previous questions
   - User answers
   - AI feedback
   - Scores over time

### Not in MVP

These are valuable, but should come after the first stable version:

- Video analysis
- Resume builder
- Job board integration
- Company-specific interview intelligence
- Recruiter matching
- Mobile app

## Interview Modes

### HR Interview

Example questions:

- Tell me about yourself.
- Why should we hire you?
- What are your strengths and weaknesses?
- Why do you want this role?
- Where do you see yourself in 5 years?

### Technical Interview

Questions should be generated from:

- Target role
- User-selected skills
- Experience level
- Difficulty level

Example for frontend developer:

- Explain the difference between server-side rendering and client-side rendering.
- How would you optimize a slow React page?
- What is debouncing, and where would you use it?

### Behavioral Interview

Use STAR-method scoring.

Example questions:

- Tell me about a time you solved a difficult problem.
- Describe a time you worked under pressure.
- Tell me about a conflict you handled in a team.

### Salary Negotiation

The AI should simulate realistic recruiter pressure.

Example recruiter prompts:

- What is your expected salary?
- Your expectation is above our budget. Can you justify it?
- We can offer less, but with learning opportunities. Are you open to that?
- Do you have any competing offers?

## AI Scoring Framework

Each interview answer should be evaluated with a structured JSON response.

```json
{
  "overallScore": 78,
  "categoryScores": {
    "clarity": 82,
    "relevance": 80,
    "confidence": 74,
    "technicalDepth": 70,
    "structure": 76
  },
  "strengths": [
    "Clear opening",
    "Relevant example"
  ],
  "weaknesses": [
    "Needs stronger measurable impact",
    "Conclusion could be sharper"
  ],
  "improvedAnswer": "A stronger version of the user's answer.",
  "readinessLevel": "Moderate",
  "estimatedSelectionChance": 65,
  "nextPracticeStep": "Practice adding metrics and outcomes to your examples."
}
```

Scoring must be positioned as an estimate, not a guaranteed prediction. The app should avoid claiming that it can know the exact hiring result.

## Readiness Levels

Suggested readiness bands:

- 0-40: Needs Foundation
- 41-60: Developing
- 61-75: Moderate
- 76-88: Strong
- 89-100: Interview Ready

The dashboard should show this in a simple, visual way.

## AI Architecture

### MVP AI Flow

1. User starts a session.
2. Backend sends role, skills, experience level, and session mode to the AI model.
3. AI generates the next question.
4. User submits an answer.
5. Backend sends the question, answer, role context, and scoring rubric to the AI model.
6. AI returns strict JSON feedback.
7. Backend validates the JSON and stores it in the database.
8. Dashboard calculates trends from stored results.

### Prompting Best Practices

- Use system prompts with a fixed evaluator role.
- Require strict JSON responses for scoring.
- Keep interview generation and answer evaluation as separate prompts.
- Store rubric versions so old scores remain explainable.
- Add validation before saving AI output.
- Use lower temperature for scoring and moderate temperature for question generation.

### Cost and Latency Controls

- Use short structured prompts for scoring.
- Store generated questions and feedback.
- Avoid re-evaluating the same answer repeatedly.
- Use cheaper models for simple HR scoring.
- Reserve stronger models for complex technical evaluation.
- Add per-user daily practice limits in the free plan.

## Recommended Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion for subtle micro-interactions

### Backend

- Next.js Route Handlers for MVP
- Server Actions where appropriate
- Zod for request and AI-response validation

### Database

- PostgreSQL
- Prisma ORM
- pgvector later for resume and job-description matching

### Auth

- NextAuth/Auth.js for modern App Router authentication
- Google OAuth plus email/password credentials for MVP

### AI

- OpenAI API for interview generation and scoring
- Structured outputs where available
- Separate prompts for interview, salary negotiation, and scoring

### Deployment

- Vercel for the app
- Neon or Supabase for PostgreSQL

## Initial Data Model

Core tables:

- users
- profiles
- interview_sessions
- interview_messages
- answer_evaluations
- salary_negotiation_sessions
- practice_recommendations

Important fields:

- targetRole
- experienceLevel
- skills
- expectedSalary
- sessionMode
- question
- answer
- score
- feedbackJson
- readinessLevel
- createdAt

## UX Direction

The UI should feel like a serious career cockpit, not a playful chatbot.

Recommended screens:

1. Landing page
   - Clear value proposition
   - Start practice CTA
   - Show sample score card

2. Onboarding
   - Step-by-step profile setup
   - Role and skill selection
   - Salary expectation setup

3. Practice room
   - Interview question panel
   - Answer input
   - Timer
   - Difficulty indicator
   - Submit answer action

4. Feedback panel
   - Score
   - Strengths
   - Weaknesses
   - Better answer
   - Retry question action

5. Dashboard
   - Readiness score
   - Progress chart
   - Weak areas
   - Recommended next session

## Monetization Ideas

Free plan:

- Limited mock interviews per day
- Basic feedback
- Basic readiness score

Premium plan:

- Unlimited practice
- Advanced feedback
- Salary negotiation simulator
- Resume and job description matching
- Company-specific preparation
- Progress reports

Institution plan:

- Colleges can buy access for students
- Admin dashboard for placement cells
- Batch-level readiness analytics

## Build Roadmap

### Phase 1: Product Foundation

- Define brand and audience
- Create app layout
- Build onboarding
- Set up database and auth

### Phase 2: AI Interview MVP

- Generate role-specific questions
- Submit text answers
- Evaluate with structured AI scoring
- Save sessions and feedback

### Phase 3: Dashboard

- Show scores and history
- Track readiness trend
- Recommend next practice mode

### Phase 4: Salary Negotiation

- Add recruiter simulation
- Add negotiation-specific scoring
- Add salary feedback and counter-offer coaching

### Phase 5: Advanced AI

- Resume parsing
- Job description matching
- Voice interview mode with confidence and filler-word detection
- Company-specific preparation
- Personalized learning plans

## Key Product Decisions Still Needed

1. Voice practice, confidence scoring, and filler-word detection are Phase 2.
2. Salary negotiation is free but limited, with premium-ready unlimited coaching later.
3. Resume and job description matching starts with pasted text, with file parsing and embeddings later.
4. One free demo interview is allowed before signup.
5. PrepPilot is the confirmed brand name.


