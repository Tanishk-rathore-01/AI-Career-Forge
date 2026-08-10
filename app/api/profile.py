"""User profile API endpoints."""

import structlog
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.profile import ProfileCreate, ProfileResponse, ProfileUpdate

logger = structlog.get_logger(__name__)
router = APIRouter()


@router.post("/", response_model=ProfileResponse, status_code=201)
async def create_profile(
    profile_data: ProfileCreate,
    db: Session = Depends(get_db)
):
    """Create user profile."""
    # TODO: Implement profile creation
    raise HTTPException(status_code=501, detail="Not yet implemented")


@router.get("/", response_model=ProfileResponse)
async def get_profile(
    db: Session = Depends(get_db)
):
    """Get current user profile."""
    # TODO: Implement profile retrieval
    raise HTTPException(status_code=501, detail="Not yet implemented")


@router.put("/", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db)
):
    """Update user profile."""
    # TODO: Implement profile update
    raise HTTPException(status_code=501, detail="Not yet implemented")


@router.delete("/")
async def delete_profile(
    db: Session = Depends(get_db)
):
    """Delete user profile."""
    # TODO: Implement profile deletion
    raise HTTPException(status_code=501, detail="Not yet implemented")
