"""Pydantic schemas for salary and profile endpoints."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# Salary Schemas
class SalaryNegotiationRequest(BaseModel):
    """Salary negotiation request."""
    target_role: str
    target_company: Optional[str] = None
    current_salary: Optional[int] = None
    experience_level: str
    market_focus: str = "INDIA"


class SalaryNegotiationResponse(BaseModel):
    """Salary negotiation response."""
    base_salary: Dict[str, Any]
    bonus_structure: Dict[str, Any]
    benefits: List[str]
    negotiation_tips: List[str]
    market_comparison: Dict[str, Any]
    session_id: Optional[str] = None


class SalaryEvaluationRequest(BaseModel):
    """Salary evaluation request."""
    session_id: str
    user_response: str


# Profile Schemas
class CandidateStageEnum(str):
    """Candidate stage enumeration."""
    STUDENT = "STUDENT"
    INTERN = "INTERN"
    FRESHER = "FRESHER"
    EXPERIENCED = "EXPERIENCED"


class MarketFocusEnum(str):
    """Market focus enumeration."""
    INDIA = "INDIA"
    INTERNATIONAL = "INTERNATIONAL"
    BOTH = "BOTH"


class ProfileCreate(BaseModel):
    """Create user profile schema."""
    full_name: str
    candidate_stage: str
    target_role: str
    target_field: str
    experience_years: int = 0
    skills: List[str] = []
    preferred_location: Optional[str] = None
    market_focus: str = "BOTH"
    salary_currency: str = "INR"
    expected_salary_min: Optional[int] = None
    expected_salary_max: Optional[int] = None
    target_companies: List[str] = []
    interview_goal: Optional[str] = None


class ProfileUpdate(BaseModel):
    """Update user profile schema."""
    full_name: Optional[str] = None
    target_role: Optional[str] = None
    target_field: Optional[str] = None
    experience_years: Optional[int] = None
    skills: Optional[List[str]] = None
    preferred_location: Optional[str] = None
    market_focus: Optional[str] = None
    expected_salary_min: Optional[int] = None
    expected_salary_max: Optional[int] = None
    target_companies: Optional[List[str]] = None
    interview_goal: Optional[str] = None


class ProfileResponse(BaseModel):
    """User profile response."""
    id: str
    user_id: str
    full_name: str
    candidate_stage: str
    target_role: str
    target_field: str
    experience_years: int
    skills: List[str]
    preferred_location: Optional[str]
    market_focus: str
    salary_currency: str
    expected_salary_min: Optional[int]
    expected_salary_max: Optional[int]
    target_companies: List[str]
    interview_goal: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
