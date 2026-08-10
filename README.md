# AI-Career-Forge Backend

A secure, scalable backend API for AI-powered interview practice, resume matching, salary negotiation, and career readiness tracking.

## Overview

AI-Career-Forge provides a Python FastAPI backend designed for production deployment with PostgreSQL, Redis, and modern security practices. This repository contains the backend API and developer tooling; frontend applications may be connected separately.

## Key Features

- FastAPI backend with async endpoints
- JWT-based authentication and refresh tokens
- PostgreSQL database with SQLAlchemy ORM
- OpenAPI documentation and schema generation
- Environment-driven configuration with Pydantic
- Docker containerization and Docker Compose setup
- GitHub Actions CI/CD workflows for testing and security
- Security headers, input validation, and error handling
- AI provider integration with Google Gemini / OpenAI patterns

## Quick Start

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/Tanishk-rathore-01/AI-Career-Forge.git
cd AI-Career-Forge
```

2. Install Python dependencies:

```bash
python -m pip install --user poetry
python -m poetry install --with dev
```

3. Copy the environment template and update secrets:

```bash
cp .env.example .env
# Edit .env with your database, secrets, and AI provider values
```

4. Run database migrations:

```bash
python -m alembic upgrade head
```

5. Start the backend:

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

6. Open API docs:

- `http://localhost:8000/api/docs`
- `http://localhost:8000/api/openapi.json`

### Docker Development

```bash
docker-compose up -d
```

Then run migrations from the backend container:

```bash
docker-compose exec backend alembic upgrade head
```

### Recommended Workflow

- `poetry run ruff check app/ tests/`
- `poetry run black app/ tests/ --check`
- `poetry run mypy app/`
- `poetry run pytest tests/ -v`

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Interview Practice

- `POST /api/interviews/sessions`
- `GET /api/interviews/sessions/{session_id}`
- `POST /api/interviews/sessions/{session_id}/question`
- `POST /api/interviews/sessions/{session_id}/evaluate`
- `POST /api/interviews/sessions/{session_id}/complete`

### Resume Matching

- `POST /api/resume-match/evaluate`
- `GET /api/resume-match/{match_id}`
- `GET /api/resume-match/history`

### Salary Negotiation

- `POST /api/salary/negotiate`
- `GET /api/salary/market-data/{role}`
- `POST /api/salary/evaluate`

### Profile & Dashboard

- `POST /api/profile/`
- `GET /api/profile/`
- `PUT /api/profile/`
- `DELETE /api/profile/`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/stats`
- `GET /api/dashboard/streak`
- `GET /api/dashboard/recent-activities`

### Session Management

- `GET /api/sessions/`
- `GET /api/sessions/{session_id}`
- `POST /api/sessions/{session_id}/abandon`
- `DELETE /api/sessions/{session_id}`

### Health Check

- `GET /api/health`
- `GET /api/health/db`
- `GET /api/env`

## Deployment

This repository is designed to deploy as a backend service. Use Docker for local development and production containerization.

### GitHub Actions

The repository includes CI workflows that run on pushes and pull requests to the `main` branch. They include linting, formatting checks, type checking, security scans, and tests.

## Security

- JWT access and refresh tokens
- Bcrypt password hashing
- Security headers middleware
- Input validation via Pydantic
- Centralized settings validation
- Database connection pooling with SQLAlchemy

## Notes

- The backend is built as an API-first service. A separate frontend can consume the endpoints using the documented API routes.
- Some service routes are scaffolded and ready for implementation by connecting business logic to the existing route structure.

## Contact

For backend issues, inspect `app/main.py`, `app/core/config.py`, and `app/api/auth.py` as the primary entry points.
