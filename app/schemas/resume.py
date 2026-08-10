"""Pydantic schemas for resume matching endpoints."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ResumeMatchCreate(BaseModel):
    """Create resume match schema."""
    resume_text: str
    job_description_text: str
    target_role: str


class ResumeMatchResponse(BaseModel):
    """Resume match response schema."""
    id: str
    resume_text: str
    job_description_text: str
    target_role: str
    match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]
    raw_feedback: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ResumeEvaluateRequest(BaseModel):
    """Resume evaluation request."""
    resume_text: str
    job_description_text: str
    target_role: str
