"""Pydantic schemas for interview endpoints."""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class InterviewModeEnum(str, Enum):
    """Interview mode enumeration."""
    HR = "HR"
    TECHNICAL = "TECHNICAL"
    BEHAVIORAL = "BEHAVIORAL"
    SALARY = "SALARY"
    RESUME_MATCH = "RESUME_MATCH"
    COMPANY_PREP = "COMPANY_PREP"


class DifficultyEnum(str, Enum):
    """Difficulty level enumeration."""
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


class SessionStatusEnum(str, Enum):
    """Session status enumeration."""
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    ABANDONED = "ABANDONED"


class ReadinessLevelEnum(str, Enum):
    """Readiness level enumeration."""
    NEEDS_FOUNDATION = "NEEDS_FOUNDATION"
    DEVELOPING = "DEVELOPING"
    MODERATE = "MODERATE"
    STRONG = "STRONG"
    INTERVIEW_READY = "INTERVIEW_READY"


class InterviewSessionCreate(BaseModel):
    """Create interview session schema."""
    mode: InterviewModeEnum
    difficulty: DifficultyEnum
    target_role: str
    target_field: Optional[str] = None
    company: Optional[str] = None


class InterviewMessage(BaseModel):
    """Interview message schema."""
    role: str
    content: str
    metadata: Optional[Dict[str, Any]] = None


class InterviewMessageCreate(BaseModel):
    """Create interview message schema."""
    role: str  # USER, AI, SYSTEM
    content: str


class InterviewSessionResponse(BaseModel):
    """Interview session response schema."""
    id: str
    mode: str
    difficulty: str
    target_role: str
    target_field: Optional[str] = None
    company: Optional[str] = None
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AnswerEvaluationCreate(BaseModel):
    """Create answer evaluation schema."""
    question: str
    answer: str
    session_id: str


class CategoryScore(BaseModel):
    """Category score in evaluation."""
    category: str
    score: int
    feedback: str


class AnswerEvaluationResponse(BaseModel):
    """Answer evaluation response schema."""
    id: str
    question: str
    answer: str
    overall_score: int
    category_scores: Dict[str, Any]
    strengths: List[str]
    weaknesses: List[str]
    improved_answer: str
    readiness_level: str
    estimated_selection_chance: int
    next_practice_step: str
    model: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class InterviewQuestionRequest(BaseModel):
    """Request for interview question."""
    session_id: str


class InterviewQuestionResponse(BaseModel):
    """Interview question response."""
    session_id: str
    question: str
    message_id: str
