"""Authentication API endpoints."""

import structlog
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.middleware.error_handler import AuthenticationError, ConflictError
from app.models import User
from app.schemas.auth import GoogleAuthCode, Token, TokenRefresh, UserCreate, UserLogin
from app.schemas.auth import User as UserSchema
from app.utils.auth import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
    verify_token,
)

logger = structlog.get_logger(__name__)
router = APIRouter()


@router.post("/register", response_model=Token, status_code=201)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
) -> Token:
    """Register a new user."""

    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        logger.warning("registration_attempted_existing_email", email=user_data.email)
        raise ConflictError("Email already registered")

    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    logger.info("user_registered", user_id=new_user.id, email=new_user.email)

    # Create tokens
    access_token = create_access_token(subject=new_user.id)
    refresh_token = create_refresh_token(subject=new_user.id)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
) -> Token:
    """Login user with email and password."""

    # Find user
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not user.password_hash or not verify_password(
        credentials.password, user.password_hash
    ):
        logger.warning("login_failed", email=credentials.email)
        raise AuthenticationError("Invalid email or password")

    logger.info("user_login_success", user_id=user.id, email=user.email)

    # Create tokens
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(
    token_data: TokenRefresh,
    db: Session = Depends(get_db)
) -> Token:
    """Refresh access token using refresh token."""

    # Verify refresh token
    token_info = verify_token(token_data.refresh_token)

    if not token_info or token_info.type != "refresh":
        logger.warning("invalid_refresh_token")
        raise AuthenticationError("Invalid refresh token")

    # Verify user still exists
    user = db.query(User).filter(User.id == token_info.sub).first()
    if not user:
        logger.warning("refresh_token_user_not_found", user_id=token_info.sub)
        raise AuthenticationError("User not found")

    # Create new access token
    new_access_token = create_access_token(subject=user.id)

    logger.info("token_refreshed", user_id=user.id)

    return Token(
        access_token=new_access_token,
        refresh_token=token_data.refresh_token,  # Return same refresh token
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/google", response_model=Token)
async def google_auth(
    auth_code: GoogleAuthCode,
    db: Session = Depends(get_db)
) -> Token:
    """Authenticate with Google OAuth2 code."""

    # TODO: Implement Google OAuth2 exchange
    # This requires exchanging the authorization code for tokens
    # and creating/updating user in database

    raise HTTPException(
        status_code=501,
        detail="Google authentication not yet implemented"
    )


@router.get("/me", response_model=UserSchema)
async def get_current_user(
    authorization: str | None = Header(None, alias="Authorization"),
    db: Session = Depends(get_db)
) -> UserSchema:
    """Get current authenticated user."""

    if not authorization or not authorization.startswith("Bearer "):
        raise AuthenticationError("Missing or invalid authorization header")

    token = authorization.replace("Bearer ", "")
    token_info = verify_token(token)

    if not token_info or token_info.type != "access":
        raise AuthenticationError("Invalid access token")

    user = db.query(User).filter(User.id == token_info.sub).first()
    if not user:
        raise AuthenticationError("User not found")

    return UserSchema.model_validate(user)


@router.post("/logout")
async def logout():
    """Logout user."""
    # In a stateless JWT system, logout is handled client-side
    # by discarding the token
    logger.info("user_logout")
    return {"message": "Logged out successfully"}
