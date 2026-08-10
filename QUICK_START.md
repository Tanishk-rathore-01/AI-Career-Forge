# AI-Career-Forge Backend Quick Start

This guide helps you get the AI-Career-Forge backend running locally and safely.

## What is included

- FastAPI backend service
- PostgreSQL database support
- Redis caching support
- JWT authentication
- Structured API routes for authentication, health checks, interviews, resume matching, salary negotiation, profile, dashboard, and sessions
- CI/CD workflows and security scans
- Docker development environment

## Setup

### 1. Install dependencies

```bash
python -m pip install --user poetry
python -m poetry install --with dev
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with correct database credentials and secrets.

### 3. Run database migrations

```bash
python -m alembic upgrade head
```

### 4. Start backend locally

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Verify the API

- Open `http://localhost:8000/api/docs`
- Confirm health check at `http://localhost:8000/api/health`

## Docker development

Start services with Docker Compose:

```bash
docker-compose up -d
```

Run migrations in the backend container:

```bash
docker-compose exec backend alembic upgrade head
```

## Recommended commands

- `python -m poetry run ruff check app/ tests/`
- `python -m poetry run black app/ tests/ --check`
- `python -m poetry run mypy app/`
- `python -m poetry run pytest tests/ -v`

## Project structure

- `app/` — main FastAPI application
- `app/api/` — API route handlers
- `app/core/` — configuration and logging
- `app/db/` — database session management
- `app/models/` — SQLAlchemy models
- `app/schemas/` — Pydantic schemas
- `app/services/` — business logic and AI integration
- `app/middleware/` — security and error handling middleware
- `app/utils/` — authentication and input utilities
- `tests/` — unit and integration tests

## Useful endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/health`
- `GET /api/health/db`

## Notes

- The backend is API-first and designed for integration with a separate frontend.
- Some routes are implemented as scaffolds and can be extended as needed.
- Keep secret values out of source control.
