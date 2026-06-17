# PrepPilot

PrepPilot is a full-stack AI career preparation platform for mock interviews, salary negotiation practice, resume and job-description matching, structured performance scoring, and readiness insights.

It is built as a serious, polished AI career coach for students, interns, freshers, and experienced professionals across India-focused and international interview contexts.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma + PostgreSQL
- NextAuth/Auth.js
- OpenAI server-side AI services with Zod validation

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill the required values:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/preppilot?schema=public"
AUTH_SECRET="replace-with-a-secure-secret"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
OPENAI_API_KEY=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run the app:

```bash
npm run dev
```

The physical workspace folder is still named `AI-Career-Forge` because renaming the active workspace root can disrupt the running editor/session. Internal project references have been renamed to `PrepPilot`.

## Planning Documents

- [Product Blueprint](docs/PRODUCT_BLUEPRINT.md)
- [Decision Record](docs/DECISION_RECORD.md)
- [MVP Requirements](docs/MVP_REQUIREMENTS.md)
- [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md)
- [AI Workflows and Prompts](docs/AI_WORKFLOWS_AND_PROMPTS.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
