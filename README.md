# 🚀 PrepPilot: AI Career Coach

> **Professional AI-powered interview preparation platform with structured scoring, actionable feedback, and readiness assessment for students, interns, freshers, and experienced professionals.**

PrepPilot is a production-grade, full-stack AI career preparation platform that helps job seekers practice interviews, improve answers, negotiate salaries, and understand their readiness before real interviews. Built with modern tech (Next.js 16, React 19, TypeScript, Zod validation) and AI provider fallback chains (Gemini → OpenAI → deterministic scoring).

## 🎯 Key Features

- **🤖 AI Mock Interviews** — Role-specific questions across HR, technical, behavioral, salary, and company-prep modes
- **📊 Structured Scoring** — Overall scores, category breakdowns, strengths, weaknesses, and actionable improvement plans
- **💪 Salary Negotiation Practice** — Practice salary discussions with AI feedback on confidence and professionalism
- **📈 Dashboard & Analytics** — Track progress, session history, strongest/weakest areas, and readiness trends
- **🔐 Production-Ready Security** — Authentication (NextAuth.js), role-based access, IP+cookie rate limiting, Zod validation
- **🌍 International & India-Focused** — Context-aware questions for both markets
- **⚡ Intelligent Fallbacks** — Deterministic scoring when AI providers fail, ensuring reliability

## 📸 Site Preview

![PrepPilot Dashboard](./docs/images/dashboard-preview.png)
*PrepPilot dashboard showing interview scores, session history, and readiness metrics*

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐       │
│  │ React (19.2) │  │ Next.js 16   │  │  Tailwind CSS    │       │
│  │ TypeScript   │  │  App Router  │  │  Framer Motion   │       │
│  └──────────────┘  └──────────────┘  └──────────────────┘       │
└────────────────────────┬──────────────────────────────────────────┘
                         │
┌────────────────────────┴──────────────────────────────────────────┐
│                     API Layer (Next.js API Routes)                 │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ /api/interview/question      → Generate questions          │   │
│  │ /api/interview/evaluate      → Score answers              │   │
│  │ /api/salary/evaluate         → Salary practice            │   │
│  │ /api/resume-match/evaluate   → Resume matching            │   │
│  │ /api/auth/[...nextauth]      → Authentication             │   │
│  │ /api/dashboard/summary       → Analytics & metrics        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                         ▼                                          │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              Validation Layer (Zod)                        │   │
│  │  • Schema validation on every request boundary             │   │
│  │  • Type-safe parsing with clear error messages            │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────┬──────────────────────────────────────────┘
                         │
┌────────────────────────┴──────────────────────────────────────────┐
│                    AI Provider Layer                               │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐    │
│  │ Gemini 2.5     │→ │ OpenAI GPT-4   │→ │ Deterministic    │    │
│  │ (Primary)      │  │ (Secondary)    │  │ Fallbacks        │    │
│  │ 95% success    │  │ 4% success     │  │ (1% coverage)    │    │
│  └────────────────┘  └────────────────┘  └──────────────────┘    │
└────────────────────────┬──────────────────────────────────────────┘
                         │
┌────────────────────────┴──────────────────────────────────────────┐
│               Business Logic Layer                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ Interview        │  │ Salary Service   │  │ Resume Service   │ │
│  │ Service          │  │                  │  │                  │ │
│  │ • Questions      │  │ • Negotiation    │  │ • Matching       │ │
│  │ • Evaluations    │  │ • Score feedback │  │ • Recommendations│ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ Usage Service    │  │ Practice Service │  │ Streak Service   │ │
│  │ • Rate limiting  │  │ • Session mgmt   │  │ • Gamification   │ │
│  │ • Cost tracking  │  │ • History        │  │ • Motivation     │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
└────────────────────────┬──────────────────────────────────────────┘
                         │
┌────────────────────────┴──────────────────────────────────────────┐
│              Data & Persistence Layer                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Prisma ORM + PostgreSQL                                     │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐   │  │
│  │  │ Users          │  │ Interview      │  │ Usage Events │   │  │
│  │  │ • Profile      │  │ Sessions       │  │ • Rate Limits│   │  │
│  │  │ • Auth         │  │ • Evaluations  │  │ • Analytics  │   │  │
│  │  │ • Plan Tier    │  │ • Messages     │  │ • Costs      │   │  │
│  │  └────────────────┘  └────────────────┘  └──────────────┘   │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐   │  │
│  │  │ Resume Matches │  │ User Streaks   │  │ Sessions     │   │  │
│  │  │ • Scoring      │  │ • Current      │  │ • Auth       │   │  │
│  │  │ • Feedback     │  │ • Longest      │  │ • Tokens     │   │  │
│  │  └────────────────┘  └────────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Data Flow: Interview Evaluation

```mermaid
graph LR
    A["User Answer"] -->|POST /api/interview/evaluate| B["Zod Validation"]
    B -->|Valid| C["Rate Limit Check"]
    B -->|Invalid| D["400 Bad Request"]
    C -->|Allowed| E["AI Provider Chain"]
    C -->|Denied| F["429 Too Many Requests"]
    E -->|Gemini Success| G["Parse & Validate"]
    E -->|Gemini Fail| H["Try OpenAI"]
    E -->|Both Fail| I["Fallback Scoring"]
    H -->|Success| G
    H -->|Fail| I
    G -->|Valid JSON| J["Store in Database"]
    I -->|Deterministic| J
    J -->|Success| K["Return Evaluation<br/>+ Session ID"]
    K -->|Response| L["Frontend Update"]
```

### Request Flow: Rate Limiting

```mermaid
graph TD
    A["Request:<br/>POST /api/interview/evaluate"] --> B{"Authenticated?"}
    B -->|No| C["401 Unauthorized"]
    B -->|Yes| D{"Check Daily Limit"}
    D -->|Limit Exceeded| E["429 Too Many Requests"]
    D -->|Under Limit| F{"AI Provider Available?"}
    F -->|Yes| G["Generate Evaluation"]
    F -->|No| H["Use Fallback Scoring"]
    G -->|Success| I["Record Usage Event"]
    H -->|Success| I
    I -->|Complete| J["Return 200 OK<br/>+ Evaluation Data"]
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```mermaid
graph LR
    A["Push to main"] --> B["Lint & Type Check"]
    B --> C{"Tests Pass?"}
    C -->|No| D["❌ Build Failed<br/>Notify Developer"]
    C -->|Yes| E["Build Next.js"]
    E --> F{"Build Success?"}
    F -->|No| D
    F -->|Yes| G["Deploy to Vercel"]
    G --> H{"Deployment Success?"}
    H -->|No| I["⚠️ Deploy Failed<br/>Rollback"]
    H -->|Yes| J["🚀 Live on Production"]
    J --> K["Run E2E Tests"]
    K --> L["✅ All Clear"]
```

### Deployment Checklist

```yaml
Pre-Deployment:
  ✓ ESLint: npm run lint
  ✓ TypeScript: npm run typecheck
  ✓ Database: prisma migrate deploy
  ✓ Secrets: Verify all env vars in Vercel

Deployment:
  → Vercel auto-builds on GitHub push
  → Build logs visible on Vercel dashboard
  → Automatic rollback on build failure

Post-Deployment:
  ✓ Health check: /api/health/env
  ✓ Database connectivity verified
  ✓ AI providers responding
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19.2, Next.js 16 App Router | Component framework & routing |
| **Language** | TypeScript 5.8 | Type safety & developer experience |
| **Styling** | Tailwind CSS 3.4, Framer Motion | Utility CSS & animations |
| **UI Components** | Radix UI, Lucide Icons | Accessible, unstyled components |
| **State** | React Hooks, Next.js Server Components | State management & SSR |
| **Forms** | Zod + React forms | Validation & typed forms |
| **Database** | PostgreSQL (Neon) | Relational data storage |
| **ORM** | Prisma 6.16 | Type-safe database access |
| **Auth** | NextAuth.js (beta) | Authentication & sessions |
| **AI Providers** | Gemini 2.5, OpenAI GPT-4 mini | LLM integration with fallbacks |
| **Validation** | Zod | Runtime schema validation |
| **Deployment** | Vercel | Serverless deployment |
| **Dev Tools** | ESLint, TypeScript, Playwright | Code quality & testing |

---

## 📋 Installation & Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- Git

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Tanishk-rathore-01/AI-Career-Forge.git
cd AI-Career-Forge
npm install
```

### 2️⃣ Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the required values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/preppilot"
DIRECT_URL="postgresql://user:password@localhost:5432/preppilot"

# Authentication
AUTH_SECRET="$(openssl rand -base64 32)"
AUTH_GOOGLE_ID="your-google-oauth-id"
AUTH_GOOGLE_SECRET="your-google-oauth-secret"

# AI Providers
AI_PROVIDER="gemini"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4.1-mini"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3️⃣ Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed demo data
npm run prisma:seed
```

### 4️⃣ Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 5️⃣ Build for Production

```bash
npm run build
npm run start
```

---

## 🎮 Usage

### Create an Account

1. Visit the signup page
2. Enter email and password (or login with Google)
3. Complete profile onboarding:
   - Target role (e.g., "Senior React Developer")
   - Experience level (Student, Intern, Fresher, Experienced)
   - Skills
   - Market focus (India, International, Both)
   - Expected salary range

### Practice Interview

1. **Select Mode**: HR, Technical, Behavioral, Salary, or Company Prep
2. **Set Difficulty**: Beginner, Intermediate, Advanced
3. **Get Question**: AI generates a targeted question
4. **Record Answer**: Type your response (90-150 seconds typical)
5. **Get Feedback**: See score, strengths, weaknesses, and improvements

### Track Progress

- Dashboard shows trend of scores over time
- Session history with all previous questions & answers
- Readiness assessment for your target role
- Daily practice streaks

### Practice Salary Negotiation

1. Choose salary practice mode
2. Simulate a salary discussion
3. AI acts as HR/recruiter
4. Get feedback on negotiation confidence

---

## 📚 API Documentation

### Interview Endpoints

#### Generate Question
```
POST /api/interview/question
Content-Type: application/json

{
  "targetRole": "React Developer",
  "experienceLevel": "2 years",
  "mode": "technical",
  "difficulty": "intermediate",
  "marketFocus": "india"
}

Response:
{
  "question": "Walk me through a React state management decision...",
  "intent": "Assess technical depth and decision-making",
  "difficulty": "intermediate",
  "evaluationFocus": ["Technical correctness", "Tradeoff awareness"]
}
```

#### Evaluate Answer
```
POST /api/interview/evaluate
Content-Type: application/json

{
  "targetRole": "React Developer",
  "experienceLevel": "2 years",
  "mode": "technical",
  "question": "...",
  "answer": "I would use Context API because..."
}

Response:
{
  "overallScore": 78,
  "categoryScores": { "clarity": 82, "relevance": 75, ... },
  "strengths": ["Clear explanation", "Good examples"],
  "weaknesses": ["Could mention tradeoffs"],
  "improvedAnswer": "Here's how you could strengthen...",
  "readinessLevel": "Strong",
  "nextPracticeStep": "Practice salary negotiation"
}
```

### Rate Limits

| Endpoint | Free Tier | Premium |
|----------|-----------|---------|
| Question Generation | 5/day | Unlimited |
| Answer Evaluation | 5/day | Unlimited |
| Salary Practice | 2/day | Unlimited |
| Demo (No Auth) | 1/IP | N/A |

---

## 🔐 Security Features

- **NextAuth.js** — Secure session management
- **Zod Validation** — Type-safe input validation at every boundary
- **HTTP Only Cookies** — Protected authentication tokens
- **IP + Cookie Rate Limiting** — Prevents demo abuse (cookie clearing, incognito)
- **CSRF Protection** — Built-in Next.js protection
- **Role-Based Access** — Free vs Premium features
- **Password Hashing** — bcryptjs for secure password storage
- **SQL Injection Prevention** — Prisma parameterized queries

---

## 📊 Database Schema

Key entities:

```prisma
// User Account
model User {
  id               String
  email            String @unique
  passwordHash     String
  planTier         PlanTier (FREE | PREMIUM)
  profile          Profile?
  interviews       InterviewSession[]
  evaluations      AnswerEvaluation[]
  usageEvents      UsageEvent[]
  streak           UserStreak?
}

// Interview Session
model InterviewSession {
  id          String
  userId      String?
  mode        InterviewMode (HR | TECHNICAL | BEHAVIORAL | SALARY | RESUME_MATCH | COMPANY_PREP)
  difficulty  Difficulty (BEGINNER | INTERMEDIATE | ADVANCED)
  targetRole  String
  status      SessionStatus (ACTIVE | COMPLETED | ABANDONED)
  messages    InterviewMessage[]
  evaluations AnswerEvaluation[]
}

// Answer Evaluation
model AnswerEvaluation {
  id                  String
  sessionId           String
  question            String @db.Text
  answer              String @db.Text
  overallScore        Int
  categoryScores      Json
  strengths           String[]
  weaknesses          String[]
  readinessLevel      ReadinessLevel
  estimatedSelectionChance Int
  model               String? (gemini | openai | fallback)
}

// Usage Tracking
model UsageEvent {
  id              String
  userId          String?
  eventType       UsageEventType
  model           String?
  inputTokens     Int?
  outputTokens    Int?
  estimatedCost   Float?
  createdAt       DateTime @default(now())
}
```

---

## 🐛 Troubleshooting

### "Authentication required" error
- Ensure you're logged in: Visit `/sign-in`
- Check NextAuth session cookie

### "Rate limit exceeded"
- Free tier: 5 questions + 5 evaluations per day
- Clear cookies for demo (only allows 1 demo per IP)
- Consider upgrading to Premium

### AI provider not responding
- Check API keys in `.env.local`
- Verify Gemini/OpenAI quotas
- System will fallback to deterministic scoring

### Database connection error
- Verify `DATABASE_URL` in `.env.local`
- Check PostgreSQL is running
- Run `npm run prisma:generate`

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Required Environment Variables on Vercel:**
- All `.env` variables (see Environment Configuration above)
- Ensure Prisma migrations run: `vercel env pull` before `npm run prisma:deploy`

### Deploy to Other Platforms

PrepPilot is a standard Next.js 16 app. It works on:
- AWS Amplify
- Railway
- Render
- Heroku
- Self-hosted servers (Node.js 18+)

---

## 📝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/Tanishk-rathore-01/AI-Career-Forge/issues)
- **Email**: support@preppilot.dev
- **Docs**: [Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md)

---

## 👨‍💻 Author

**Tanishk Rathore**
- GitHub: [@Tanishk-rathore-01](https://github.com/Tanishk-rathore-01)
- LinkedIn: [Tanishk Rathore]()

---

**Made with ❤️ for job seekers everywhere**


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
