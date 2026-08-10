"""Error handling middleware."""

import traceback

import structlog
from fastapi import Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings

logger = structlog.get_logger(__name__)


class ApplicationError(Exception):
    """Base application error."""

    def __init__(self, message: str, status_code: int = 400, error_code: str = "APPLICATION_ERROR"):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(self.message)


class AuthenticationError(ApplicationError):
    """Authentication error."""

    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, 401, "AUTHENTICATION_ERROR")


class AuthorizationError(ApplicationError):
    """Authorization error."""

    def __init__(self, message: str = "Access denied"):
        super().__init__(message, 403, "AUTHORIZATION_ERROR")


class NotFoundError(ApplicationError):
    """Resource not found error."""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, 404, "NOT_FOUND")


class ConflictError(ApplicationError):
    """Resource conflict error."""

    def __init__(self, message: str = "Resource already exists"):
        super().__init__(message, 409, "CONFLICT")


class ApplicationValidationError(ApplicationError):
    """Validation error."""

    def __init__(self, message: str = "Validation failed", details: dict = None):
        super().__init__(message, 422, "VALIDATION_ERROR")
        self.details = details or {}


async def error_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle application errors and return appropriate response."""

    # Handle application errors
    if isinstance(exc, ApplicationError):
        logger.warning(
            "application_error",
            error_code=exc.error_code,
            status_code=exc.status_code,
            message=exc.message,
            path=request.url.path,
        )

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.error_code,
                "message": exc.message,
                "details": getattr(exc, "details", None),
            },
        )

    # Handle database errors
    if isinstance(exc, SQLAlchemyError):
        logger.error(
            "database_error",
            path=request.url.path,
            exc_info=exc,
        )

        if not settings.DEBUG:
            return JSONResponse(
                status_code=500,
                content={
                    "error": "DATABASE_ERROR",
                    "message": "A database error occurred",
                },
            )
        else:
            return JSONResponse(
                status_code=500,
                content={
                    "error": "DATABASE_ERROR",
                    "message": str(exc),
                    "detail": traceback.format_exc(),
                },
            )

    # Handle validation errors
    if isinstance(exc, ValidationError):
        logger.warning(
            "validation_error",
            path=request.url.path,
            errors=exc.details,
        )

        return JSONResponse(
            status_code=422,
            content={
                "error": "VALIDATION_ERROR",
                "message": "Validation failed",
                "details": jsonable_encoder(exc.details),
            },
        )

    # Handle unexpected errors
    logger.error(
        "unhandled_exception",
        path=request.url.path,
        method=request.method,
        exc_type=type(exc).__name__,
        exc_info=exc,
    )

    if settings.DEBUG:
        return JSONResponse(
            status_code=500,
            content={
                "error": "INTERNAL_SERVER_ERROR",
                "message": str(exc),
                "detail": traceback.format_exc(),
            },
        )

    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred",
        },
    )
