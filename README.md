# PrepPilot

PrepPilot is a full-stack AI career preparation platform for mock interviews, salary negotiation practice, resume and job-description matching, structured performance scoring, and readiness insights.

It is built as a serious, polished AI career coach for students, interns, freshers, and experienced professionals across India-focused and international interview contexts.

## Tech Stack

- Next.js App Router
- React UI components with TSX/JSX and HTML semantics
- TypeScript
- Tailwind CSS and global CSS
- Framer Motion
- Prisma + PostgreSQL
- NextAuth/Auth.js
- Free-first Gemini AI provider, optional OpenAI provider, and deterministic local fallbacks with Zod validation

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` for local development and fill the required values:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/preppilot?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/preppilot?sslmode=require"
AUTH_SECRET="replace-with-a-secure-secret"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AI_PROVIDER="gemini"
GEMINI_API_KEY=""
GEMINI_MODEL="gemini-2.5-flash"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4.1-mini"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

`AUTH_SECRET` can be generated locally. Gemini, Google OAuth, OpenAI, Neon, and Vercel keys must come from your own accounts. Do not commit real keys.

3. For Neon, use the pooled connection string as `DATABASE_URL` and the direct connection string as `DIRECT_URL`. Prisma uses `DIRECT_URL` for migrations and `DATABASE_URL` for runtime queries.

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Apply migrations:

```bash
npm run prisma:deploy
```

6. Run the app:

```bash
npm run dev
```

## Google OAuth Setup

Configure these redirect URIs in Google Cloud OAuth:

```text
http://localhost:3000/api/auth/callback/google
https://<your-vercel-domain>/api/auth/callback/google
```

Use the Google client ID and secret as `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

## AI Provider Setup

PrepPilot is configured as a free-first AI app:

- `AI_PROVIDER="gemini"` uses Gemini first when `GEMINI_API_KEY` is configured.
- `OPENAI_API_KEY` is optional and can be used as a secondary provider.
- If no live AI key is configured, deterministic local fallback scoring still works.

Create a Gemini key in Google AI Studio and paste it into `.env.local` as `GEMINI_API_KEY`. Free tiers have model-specific rate limits and are not a production reliability guarantee. Keep all AI keys server-side only.

## Vercel Deployment

Set these environment variables in Vercel for Production, Preview, and Development:

```text
DATABASE_URL
DIRECT_URL
AUTH_SECRET
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
AI_PROVIDER
GEMINI_API_KEY
GEMINI_MODEL
OPENAI_API_KEY
OPENAI_MODEL
NEXT_PUBLIC_APP_URL
```

Run `npm run prisma:deploy` against the production Neon database before serving real users. The app never exposes secret values through health or settings screens; it only reports whether required variables are configured.

The physical workspace folder is still named `AI-Career-Forge` because renaming the active workspace root can disrupt the running editor/session. Internal project references have been renamed to `PrepPilot`.

## Planning Documents

- [Product Blueprint](docs/PRODUCT_BLUEPRINT.md)
- [Decision Record](docs/DECISION_RECORD.md)
- [MVP Requirements](docs/MVP_REQUIREMENTS.md)
- [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md)
- [AI Workflows and Prompts](docs/AI_WORKFLOWS_AND_PROMPTS.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
