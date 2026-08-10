"""Main FastAPI application instance and router setup."""


import structlog
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.gzip import GZipMiddleware

from app.api import auth, dashboard, health, interviews, profile, resume, salary, sessions
from app.core.config import settings
from app.core.logger import setup_logging
from app.middleware.error_handler import error_handler
from app.middleware.security_headers import SecurityHeadersMiddleware

# Setup logging
setup_logging()
logger = structlog.get_logger(__name__)


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""

    app = FastAPI(
        title="AI Career Forge API",
        description="AI-powered career preparation platform",
        version="0.1.0",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
    )

    # Middleware stack (order matters)

    # Security headers
    app.add_middleware(SecurityHeadersMiddleware)

    # GZIP compression
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    # Trusted hosts
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception handlers
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(
            "validation_error",
            path=request.url.path,
            method=request.method,
            errors=exc.errors(),
        )
        return JSONResponse(
            status_code=422,
            content={
                "detail": "Validation error",
                "errors": exc.errors(),
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(
            "unhandled_exception",
            path=request.url.path,
            method=request.method,
            exc_info=exc,
        )
        return await error_handler(request, exc)

    # Include routers
    app.include_router(health.router, prefix="/api", tags=["health"])
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(interviews.router, prefix="/api/interviews", tags=["interviews"])
    app.include_router(resume.router, prefix="/api/resume-match", tags=["resume"])
    app.include_router(salary.router, prefix="/api/salary", tags=["salary"])
    app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
    app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
    app.include_router(sessions.router, prefix="/api/sessions", tags=["sessions"])

    logger.info("FastAPI application created", version="0.1.0")
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
