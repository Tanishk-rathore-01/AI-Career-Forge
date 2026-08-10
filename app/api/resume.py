"""Resume matching API endpoints."""

import structlog
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.resume import ResumeEvaluateRequest, ResumeMatchResponse

logger = structlog.get_logger(__name__)
router = APIRouter()


@router.post("/evaluate", status_code=201)
async def evaluate_resume(
    request: ResumeEvaluateRequest,
    db: Session = Depends(get_db)
):
    """Evaluate resume against job description."""
    # TODO: Implement resume matching using AI
    raise HTTPException(status_code=501, detail="Not yet implemented")


@router.get("/{match_id}", response_model=ResumeMatchResponse)
async def get_resume_match(
    match_id: str,
    db: Session = Depends(get_db)
):
    """Get resume match details."""
    # TODO: Implement retrieval
    raise HTTPException(status_code=501, detail="Not yet implemented")


@router.get("/history")
async def get_resume_match_history(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get user's resume match history."""
    # TODO: Implement history retrieval
    raise HTTPException(status_code=501, detail="Not yet implemented")
