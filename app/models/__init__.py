"""SQLAlchemy database models mirroring Prisma schema."""

import enum
import uuid

from sqlalchemy import (
    ARRAY,
    JSON,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()


class PlanTier(str, enum.Enum):
    """User plan tier."""
    FREE = "FREE"
    PREMIUM = "PREMIUM"


class CandidateStage(str, enum.Enum):
    """Candidate career stage."""
    STUDENT = "STUDENT"
    INTERN = "INTERN"
    FRESHER = "FRESHER"
    EXPERIENCED = "EXPERIENCED"


class MarketFocus(str, enum.Enum):
    """Job market focus."""
    INDIA = "INDIA"
    INTERNATIONAL = "INTERNATIONAL"
    BOTH = "BOTH"


class InterviewMode(str, enum.Enum):
    """Interview session mode."""
    HR = "HR"
    TECHNICAL = "TECHNICAL"
    BEHAVIORAL = "BEHAVIORAL"
    SALARY = "SALARY"
    RESUME_MATCH = "RESUME_MATCH"
    COMPANY_PREP = "COMPANY_PREP"


class Difficulty(str, enum.Enum):
    """Practice difficulty level."""
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


class SessionStatus(str, enum.Enum):
    """Interview session status."""
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    ABANDONED = "ABANDONED"


class MessageRole(str, enum.Enum):
    """Message role in interview."""
    SYSTEM = "SYSTEM"
    AI = "AI"
    USER = "USER"


class ReadinessLevel(str, enum.Enum):
    """Interview readiness level."""
    NEEDS_FOUNDATION = "NEEDS_FOUNDATION"
    DEVELOPING = "DEVELOPING"
    MODERATE = "MODERATE"
    STRONG = "STRONG"
    INTERVIEW_READY = "INTERVIEW_READY"


class UsageEventType(str, enum.Enum):
    """Usage tracking event type."""
    DEMO_EVALUATION = "DEMO_EVALUATION"
    INTERVIEW_QUESTION = "INTERVIEW_QUESTION"
    INTERVIEW_EVALUATION = "INTERVIEW_EVALUATION"
    SALARY_EVALUATION = "SALARY_EVALUATION"
    RESUME_MATCH = "RESUME_MATCH"
    COMPANY_PREP = "COMPANY_PREP"
    WEEKLY_REPORT = "WEEKLY_REPORT"
    CERTIFICATE = "CERTIFICATE"


class User(Base):
    """User model."""
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    email_verified = Column(DateTime, nullable=True)
    image = Column(String(512), nullable=True)
    password_hash = Column(String(255), nullable=True)
    plan_tier = Column(Enum(PlanTier), default=PlanTier.FREE)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    accounts = relationship("Account", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    interviews = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
    evaluations = relationship("AnswerEvaluation", back_populates="user", cascade="all, delete-orphan")
    resume_matches = relationship("ResumeMatch", back_populates="user", cascade="all, delete-orphan")
    usage_events = relationship("UsageEvent", back_populates="user", cascade="all, delete-orphan")
    streak = relationship("UserStreak", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Account(Base):
    """OAuth account linking."""
    __tablename__ = "accounts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)
    provider = Column(String(50), nullable=False)
    provider_account_id = Column(String(255), nullable=False)
    refresh_token = Column(Text, nullable=True)
    access_token = Column(Text, nullable=True)
    expires_at = Column(Integer, nullable=True)
    token_type = Column(String(50), nullable=True)
    scope = Column(Text, nullable=True)
    id_token = Column(Text, nullable=True)
    session_state = Column(String(255), nullable=True)

    # Relationships
    user = relationship("User", back_populates="accounts")

    # Constraints
    __table_args__ = (
        UniqueConstraint("provider", "provider_account_id", name="uq_provider_account"),
    )


class Session(Base):
    """Authentication session."""
    __tablename__ = "auth_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_token = Column(String(255), unique=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    expires = Column(DateTime, nullable=False)

    # Relationships
    user = relationship("User", back_populates="sessions")


class VerificationToken(Base):
    """Email verification token."""
    __tablename__ = "verification_tokens"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    identifier = Column(String(255), nullable=False)
    token = Column(String(255), unique=True, index=True)
    expires = Column(DateTime, nullable=False)

    __table_args__ = (
        UniqueConstraint("identifier", "token", name="uq_identifier_token"),
    )


class Profile(Base):
    """User profile with career information."""
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    candidate_stage = Column(Enum(CandidateStage), nullable=False)
    target_role = Column(String(255), nullable=False)
    target_field = Column(String(255), nullable=False)
    experience_years = Column(Integer, default=0)
    skills = Column(ARRAY(String), default=list)
    preferred_location = Column(String(255), nullable=True)
    market_focus = Column(Enum(MarketFocus), default=MarketFocus.BOTH)
    salary_currency = Column(String(10), default="INR")
    expected_salary_min = Column(Integer, nullable=True)
    expected_salary_max = Column(Integer, nullable=True)
    target_companies = Column(ARRAY(String), default=list)
    interview_goal = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="profile")


class InterviewSession(Base):
    """Interview practice session."""
    __tablename__ = "interview_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    demo_id = Column(String(36), nullable=True)
    mode = Column(Enum(InterviewMode), nullable=False)
    difficulty = Column(Enum(Difficulty), nullable=False)
    target_role = Column(String(255), nullable=False)
    target_field = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    market_focus = Column(Enum(MarketFocus), default=MarketFocus.BOTH)
    status = Column(Enum(SessionStatus), default=SessionStatus.ACTIVE)
    started_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="interviews")
    messages = relationship("InterviewMessage", back_populates="session", cascade="all, delete-orphan")
    evaluations = relationship("AnswerEvaluation", back_populates="session", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_user_created", "user_id", "created_at"),
        Index("idx_demo_id", "demo_id"),
    )


class InterviewMessage(Base):
    """Message in interview session."""
    __tablename__ = "interview_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False)
    role = Column(Enum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    message_metadata = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    session = relationship("InterviewSession", back_populates="messages")

    # Indexes
    __table_args__ = (
        Index("idx_session_created", "session_id", "created_at"),
    )


class AnswerEvaluation(Base):
    """Evaluation of interview answer."""
    __tablename__ = "answer_evaluations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    session_id = Column(String(36), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    overall_score = Column(Integer, nullable=False)
    category_scores = Column(JSON, nullable=False)
    strengths = Column(ARRAY(String), default=list)
    weaknesses = Column(ARRAY(String), default=list)
    improved_answer = Column(Text, nullable=False)
    readiness_level = Column(Enum(ReadinessLevel), nullable=False)
    estimated_selection_chance = Column(Integer, nullable=False)
    next_practice_step = Column(Text, nullable=False)
    rubric_version = Column(String(50), nullable=False)
    prompt_version = Column(String(50), nullable=False)
    model = Column(String(100), nullable=True)
    evaluation_metadata = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="evaluations")
    session = relationship("InterviewSession", back_populates="evaluations")

    # Indexes
    __table_args__ = (
        Index("idx_user_created", "user_id", "created_at"),
        Index("idx_session_created", "session_id", "created_at"),
    )


class ResumeMatch(Base):
    """Resume matching evaluation."""
    __tablename__ = "resume_matches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_text = Column(Text, nullable=False)
    job_description_text = Column(Text, nullable=False)
    target_role = Column(String(255), nullable=False)
    match_score = Column(Integer, nullable=False)
    matched_skills = Column(ARRAY(String), default=list)
    missing_skills = Column(ARRAY(String), default=list)
    recommendations = Column(ARRAY(String), default=list)
    raw_feedback = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="resume_matches")

    # Indexes
    __table_args__ = (
        Index("idx_user_created", "user_id", "created_at"),
    )


class UserStreak(Base):
    """User practice streak tracking."""
    __tablename__ = "user_streaks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_practice_date = Column(DateTime, nullable=True)
    points = Column(Integer, default=0)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="streak")


class UsageEvent(Base):
    """Usage tracking for analytics and billing."""
    __tablename__ = "usage_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    demo_id = Column(String(36), nullable=True)
    event_type = Column(Enum(UsageEventType), nullable=False)
    model = Column(String(100), nullable=True)
    input_tokens = Column(Integer, nullable=True)
    output_tokens = Column(Integer, nullable=True)
    estimated_cost = Column(Integer, nullable=True)
    event_metadata = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="usage_events")

    # Indexes
    __table_args__ = (
        Index("idx_user_created", "user_id", "created_at"),
        Index("idx_demo_created", "demo_id", "created_at"),
        Index("idx_event_type_created", "event_type", "created_at"),
    )
