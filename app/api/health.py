"""Health check endpoints."""

import structlog
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db

logger = structlog.get_logger(__name__)
router = APIRouter()


@router.get("/health")
async def health_check():
    """Basic health check."""
    return {
        "status": "healthy",
        "version": settings.PROJECT_VERSION,
    }


@router.get("/health/db")
async def health_check_db(db: Session = Depends(get_db)):
    """Database health check."""
    try:
        # Execute simple query to check database connection
        result = db.execute(text("SELECT 1")).scalar()
        if result == 1:
            return {
                "status": "healthy",
                "database": "connected",
            }
        else:
            return {
                "status": "unhealthy",
                "database": "query_failed",
            }
    except Exception as e:
        logger.error("database_health_check_failed", exc_info=e)
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e) if settings.DEBUG else "Connection failed",
        }


@router.get("/env")
async def get_environment():
    """Get current environment configuration (only in debug mode)."""
    if not settings.DEBUG:
        return {"error": "Not available in production"}

    return {
        "debug": settings.DEBUG,
        "database_url": settings.DATABASE_URL.replace(settings.DATABASE_URL.split("//")[1].split(":")[0], "***"),
        "ai_provider": settings.AI_PROVIDER,
        "api_v1_str": settings.API_V1_STR,
    }
