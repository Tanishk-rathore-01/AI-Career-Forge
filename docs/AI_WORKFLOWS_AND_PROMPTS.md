# PrepPilot AI Workflows and Prompt Specification

## Purpose

This document defines how AI should behave inside PrepPilot. The goal is to make the AI layer reliable, measurable, safe, and cost-aware.

The platform should not behave like an open-ended chatbot. It should behave like a structured interview coach with clear task boundaries.

## Core AI Principles

- Separate question generation, answer evaluation, salary simulation, and recommendation generation.
- Require strict JSON for any result that will be stored or scored.
- Validate all AI responses before saving them.
- Treat selection chance as a coaching estimate, not a real-world hiring prediction.
- Keep AI calls server-side.
- Store rubric versions with evaluations so scores remain explainable later.
- Prefer deterministic formulas for dashboard metrics before adding AI-generated analytics.

## AI Workflow Overview

```text
User Profile
  -> Session Setup
  -> Question Generation
  -> User Answer
  -> Answer Evaluation
  -> Stored Feedback
  -> Dashboard Summary
  -> Next Practice Recommendation
```

Salary negotiation follows a similar flow, but the AI role becomes recruiter or HR instead of interviewer.

## Workflow 1: Interview Question Generation

### Goal

Generate one useful interview question for the user's selected mode, role, skills, experience level, and difficulty.

### Input

```json
{
  "targetRole": "Frontend Developer",
  "experienceLevel": "Fresher",
  "skills": ["React", "JavaScript", "CSS"],
  "mode": "technical",
  "difficulty": "beginner",
  "previousQuestions": [
    "What is the difference between props and state in React?"
  ]
}
```

### Output

```json
{
  "question": "How would you optimize a React component that re-renders too often?",
  "intent": "Test practical understanding of React rendering and optimization basics.",
  "difficulty": "beginner",
  "evaluationFocus": [
    "Identifies unnecessary re-renders",
    "Mentions memoization or component structure",
    "Explains tradeoffs clearly"
  ]
}
```

### System Prompt Draft

```text
You are an expert interview coach for early-career candidates.
Generate exactly one interview question for the provided candidate profile.
The question must match the selected mode, role, skills, experience level, and difficulty.
Do not repeat previous questions.
Keep the question realistic, concise, and answerable by the candidate.
Return only strict JSON matching the provided schema.
Do not include markdown, commentary, or extra keys.
```

### User Prompt Template

```text
Candidate profile:
- Target role: {{targetRole}}
- Experience level: {{experienceLevel}}
- Skills: {{skills}}
- Interview mode: {{mode}}
- Difficulty: {{difficulty}}

Previous questions in this session:
{{previousQuestions}}

Return one new interview question.
```

### Validation Rules

- `question` must be non-empty.
- `difficulty` must match one of the allowed enum values.
- `evaluationFocus` must contain at least two items.
- The question must not duplicate a previous question.

## Workflow 2: Interview Answer Evaluation

### Goal

Score one answer and return specific coaching feedback.

### Input

```json
{
  "targetRole": "Frontend Developer",
  "experienceLevel": "Fresher",
  "mode": "technical",
  "question": "How would you optimize a React component that re-renders too often?",
  "answer": "I would use memo and check state changes. I can also split components."
}
```

### Output

```json
{
  "overallScore": 68,
  "categoryScores": {
    "clarity": 72,
    "relevance": 76,
    "confidence": 62,
    "structure": 58,
    "technicalDepth": 70
  },
  "strengths": [
    "Mentions memoization",
    "Recognizes component splitting as an optimization option"
  ],
  "weaknesses": [
    "Does not explain how to identify unnecessary re-renders",
    "Does not mention profiling or dependency management"
  ],
  "improvedAnswer": "First, I would identify what is causing the component to re-render by checking state, props, and parent renders, and by using React DevTools Profiler. Then I would reduce unnecessary updates by moving state closer to where it is needed, splitting large components, using React.memo for stable child components, and using useMemo or useCallback only when there is a clear performance reason. I would also check dependency arrays and avoid premature optimization.",
  "readinessLevel": "Moderate",
  "estimatedSelectionChance": 58,
  "nextPracticeStep": "Practice explaining how you diagnose performance issues before jumping to optimization techniques."
}
```

### System Prompt Draft

```text
You are a strict but constructive AI interview evaluator.
Evaluate the candidate's answer for the given role, experience level, mode, and question.
Score only based on the submitted answer.
For technical questions, do not reward confident but incorrect claims.
For very short, generic, or irrelevant answers, score strictly.
Give actionable feedback that helps the candidate improve.
The estimated selection chance is only a practice-based coaching estimate, not a hiring guarantee.
Return only strict JSON matching the provided schema.
Do not include markdown, commentary, or extra keys.
```

### User Prompt Template

```text
Evaluate this interview answer.

Candidate context:
- Target role: {{targetRole}}
- Experience level: {{experienceLevel}}
- Interview mode: {{mode}}

Question:
{{question}}

Candidate answer:
{{answer}}

Scoring rubric:
- Clarity: Is the answer understandable and well-expressed?
- Relevance: Does the answer directly address the question?
- Confidence: Does the answer sound calm and credible without exaggeration?
- Structure: Is the answer organized with a clear flow?
- Technical depth: Is the technical content correct and appropriately detailed?

Return strict JSON only.
```

### Validation Rules

- All scores must be integers from 0 to 100.
- `readinessLevel` must match a supported label.
- `strengths` and `weaknesses` must each contain at least one item.
- `improvedAnswer` must be specific and non-empty.
- `estimatedSelectionChance` must be an integer from 0 to 100.
- Do not store the evaluation if validation fails.

## Workflow 3: Behavioral Answer Evaluation

Behavioral interviews should use STAR scoring.

### STAR Categories

- Situation: Did the user explain the context?
- Task: Did the user explain their responsibility?
- Action: Did the user explain what they personally did?
- Result: Did the user explain the outcome?
- Reflection: Did the user show learning or improvement?

### Additional Output Fields

Behavioral evaluation may add:

```json
{
  "starBreakdown": {
    "situation": 70,
    "task": 65,
    "action": 76,
    "result": 52,
    "reflection": 60
  }
}
```

For MVP, this can be stored inside `metadata` or included later as a typed field.

## Workflow 4: Salary Negotiation Simulation

### Goal

Simulate realistic HR salary conversation and coach the user toward firm, respectful negotiation.

### Input

```json
{
  "targetRole": "Frontend Developer",
  "experienceLevel": "Fresher",
  "preferredLocation": "Bengaluru",
  "salaryCurrency": "INR",
  "expectedSalaryMin": 600000,
  "expectedSalaryMax": 800000,
  "conversationHistory": []
}
```

### Recruiter Prompt Output

```json
{
  "message": "What salary range are you expecting for this role?",
  "intent": "Open negotiation and understand candidate expectations.",
  "pressureLevel": "low"
}
```

### User Response Evaluation Output

```json
{
  "overallScore": 74,
  "categoryScores": {
    "confidence": 76,
    "professionalTone": 84,
    "marketReasoning": 65,
    "flexibility": 70,
    "clarity": 78,
    "valueJustification": 68
  },
  "strengths": [
    "Professional tone",
    "Clear salary range"
  ],
  "weaknesses": [
    "Needs stronger value justification",
    "Could mention skills, projects, or market research"
  ],
  "improvedResponse": "Based on my React projects, JavaScript skills, and the responsibilities of this frontend role in Bengaluru, I am looking for a range of INR 6-8 LPA. I am open to discussing the full compensation structure, but I would like the offer to reflect the role expectations and the value I can contribute.",
  "nextRecruiterMessage": "That range is slightly above our fresher budget. What makes you confident that this compensation is justified?"
}
```

### Salary Negotiation Rules

- The AI should be realistic but not hostile.
- It should not pressure users into accepting unfair offers.
- It should encourage calm, evidence-based negotiation.
- It should explain how to justify salary with skills, projects, responsibilities, and market context.

## Workflow 5: Readiness Recommendation

### Goal

Recommend the next practice mode from stored score data.

MVP recommendation should be deterministic:

```text
If technicalDepth is the lowest category -> recommend technical practice.
If clarity or structure is lowest -> recommend HR or behavioral practice.
If confidence is lowest -> recommend HR or salary negotiation.
If user has no salary session and profile has salary data -> recommend salary negotiation.
If fewer than 3 sessions exist -> recommend completing more interviews.
```

AI-generated recommendations can come later.

## Model Routing

Initial model routing:

- Question generation: fast, cost-efficient model
- HR and behavioral scoring: fast, cost-efficient model with structured output support
- Technical scoring: stronger model if answer complexity is high
- Salary negotiation: fast model unless conversation becomes complex

Routing should be hidden behind service functions so provider/model changes do not affect the UI.

## Retry and Repair Strategy

If AI output fails validation:

1. Retry once with a repair instruction and the invalid output.
2. If the second attempt fails, return a controlled error.
3. Do not store invalid or partial AI output as an evaluation.

Controlled user-facing error:

```text
The AI response could not be scored correctly. Please try again.
```

## Abuse and Cost Controls

Required controls:

- Limit demo sessions by IP or browser session.
- Limit daily free authenticated evaluations.
- Reject empty answers.
- Reject extremely long answers above configured limits.
- Store AI usage events.
- Avoid re-scoring identical answer/question pairs.

Suggested MVP limits:

- Demo: 1 evaluated answer
- Free user: 5 evaluations per day
- Answer length: 50 to 4,000 characters

## Privacy Boundaries

Do not ask for:

- Caste
- Religion
- Political affiliation
- Health data
- Government ID
- Exact home address
- Bank details

Do not use protected attributes for scoring or recommendations.

## Rubric Versioning

Every saved evaluation should include:

- `rubricVersion`
- `model`
- `promptVersion`
- `createdAt`

This makes future scoring changes auditable.

Suggested initial versions:

```text
interview-question-v1
interview-evaluation-v1
salary-simulation-v1
salary-evaluation-v1
readiness-formula-v1
```

## Acceptance Criteria

The AI layer is MVP-ready when:

- Question generation returns validated JSON.
- Answer evaluation returns validated JSON.
- Salary negotiation returns validated JSON.
- Invalid AI output is not stored.
- Selection chance is framed as an estimate.
- AI calls are server-side only.
- Usage events can be recorded.
- Prompt versions and rubric versions are stored.


