"""AI Service for integrating with Gemini and OpenAI providers."""

import json
from typing import Any, Dict, Optional

import httpx
import structlog

from app.core.config import settings

logger = structlog.get_logger(__name__)


class AIProvider:
    """Base AI provider interface."""

    async def generate_interview_question(
        self,
        interview_mode: str,
        difficulty: str,
        target_role: str,
        target_field: Optional[str] = None,
        company: Optional[str] = None,
    ) -> str:
        """Generate interview question."""
        raise NotImplementedError

    async def evaluate_answer(
        self,
        question: str,
        answer: str,
        interview_mode: str,
        difficulty: str,
        target_role: str,
    ) -> Dict[str, Any]:
        """Evaluate interview answer."""
        raise NotImplementedError


class GeminiAIProvider(AIProvider):
    """Google Gemini AI provider."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.client = httpx.AsyncClient()

    async def generate_interview_question(
        self,
        interview_mode: str,
        difficulty: str,
        target_role: str,
        target_field: Optional[str] = None,
        company: Optional[str] = None,
    ) -> str:
        """Generate interview question using Gemini."""

        difficulty_map = {
            "BEGINNER": "beginner level",
            "INTERMEDIATE": "intermediate level",
            "ADVANCED": "advanced level",
        }

        prompt = f"""You are an expert interview coach. Generate a single {interview_mode.lower()} interview question for a {target_role} position at {difficulty_map.get(difficulty, difficulty.lower())} difficulty.

Target Role: {target_role}
Target Field: {target_field or 'Not specified'}
Company: {company or 'Not specified'}
Interview Type: {interview_mode}
Difficulty: {difficulty}

Generate only the question without any explanation or numbering. Make it clear and professional."""

        try:
            response = await self.client.post(
                f"{self.base_url}/{self.model}:generateContent",
                params={"key": self.api_key},
                json={
                    "contents": [
                        {
                            "parts": [{"text": prompt}]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 500,
                    },
                },
            )

            response.raise_for_status()
            data = response.json()

            # Extract text from response
            question = data["candidates"][0]["content"]["parts"][0]["text"]

            logger.info(
                "question_generated",
                provider="gemini",
                mode=interview_mode,
                difficulty=difficulty,
            )

            return question

        except Exception as e:
            logger.error("gemini_question_generation_failed", exc_info=e)
            raise

    async def evaluate_answer(
        self,
        question: str,
        answer: str,
        interview_mode: str,
        difficulty: str,
        target_role: str,
    ) -> Dict[str, Any]:
        """Evaluate interview answer using Gemini."""

        evaluation_prompt = f"""You are an expert interview evaluator. Evaluate the following answer to an interview question.

Interview Type: {interview_mode}
Difficulty: {difficulty}
Target Role: {target_role}

Question: {question}

Candidate's Answer: {answer}

Provide a detailed evaluation in JSON format with the following structure:
{{
    "overall_score": <1-100>,
    "category_scores": {{
        "technical_knowledge": <1-100>,
        "communication": <1-100>,
        "problem_solving": <1-100>,
        "confidence": <1-100>,
        "clarity": <1-100>
    }},
    "strengths": [<list of strengths>],
    "weaknesses": [<list of weaknesses>],
    "improved_answer": "<a better version of the answer>",
    "readiness_level": "<NEEDS_FOUNDATION|DEVELOPING|MODERATE|STRONG|INTERVIEW_READY>",
    "estimated_selection_chance": <percentage 0-100>,
    "next_practice_step": "<suggestion for next practice>",
    "feedback": "<detailed feedback>"
}}

Return ONLY valid JSON, no additional text."""

        try:
            response = await self.client.post(
                f"{self.base_url}/{self.model}:generateContent",
                params={"key": self.api_key},
                json={
                    "contents": [
                        {
                            "parts": [{"text": evaluation_prompt}]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.3,
                        "maxOutputTokens": 2000,
                    },
                },
            )

            response.raise_for_status()
            data = response.json()

            # Extract JSON from response
            response_text = data["candidates"][0]["content"]["parts"][0]["text"]
            evaluation = json.loads(response_text)

            logger.info(
                "answer_evaluated",
                provider="gemini",
                mode=interview_mode,
                score=evaluation.get("overall_score"),
            )

            return evaluation

        except Exception as e:
            logger.error("gemini_answer_evaluation_failed", exc_info=e)
            raise


class OpenAIProvider(AIProvider):
    """OpenAI AI provider."""

    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        self.base_url = "https://api.openai.com/v1"
        self.client = httpx.AsyncClient()

    async def generate_interview_question(
        self,
        interview_mode: str,
        difficulty: str,
        target_role: str,
        target_field: Optional[str] = None,
        company: Optional[str] = None,
    ) -> str:
        """Generate interview question using OpenAI."""

        difficulty_map = {
            "BEGINNER": "beginner level",
            "INTERMEDIATE": "intermediate level",
            "ADVANCED": "advanced level",
        }

        prompt = f"""You are an expert interview coach. Generate a single {interview_mode.lower()} interview question for a {target_role} position at {difficulty_map.get(difficulty, difficulty.lower())} difficulty.

Target Role: {target_role}
Target Field: {target_field or 'Not specified'}
Company: {company or 'Not specified'}
Interview Type: {interview_mode}
Difficulty: {difficulty}

Generate only the question without any explanation or numbering. Make it clear and professional."""

        try:
            response = await self.client.post(
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": "You are an expert interview coach."},
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.7,
                    "max_tokens": 500,
                },
            )

            response.raise_for_status()
            data = response.json()

            question = data["choices"][0]["message"]["content"]

            logger.info(
                "question_generated",
                provider="openai",
                mode=interview_mode,
                difficulty=difficulty,
            )

            return question

        except Exception as e:
            logger.error("openai_question_generation_failed", exc_info=e)
            raise

    async def evaluate_answer(
        self,
        question: str,
        answer: str,
        interview_mode: str,
        difficulty: str,
        target_role: str,
    ) -> Dict[str, Any]:
        """Evaluate interview answer using OpenAI."""

        evaluation_prompt = f"""You are an expert interview evaluator. Evaluate the following answer to an interview question.

Interview Type: {interview_mode}
Difficulty: {difficulty}
Target Role: {target_role}

Question: {question}

Candidate's Answer: {answer}

Provide a detailed evaluation in JSON format with the following structure:
{{
    "overall_score": <1-100>,
    "category_scores": {{
        "technical_knowledge": <1-100>,
        "communication": <1-100>,
        "problem_solving": <1-100>,
        "confidence": <1-100>,
        "clarity": <1-100>
    }},
    "strengths": [<list of strengths>],
    "weaknesses": [<list of weaknesses>],
    "improved_answer": "<a better version of the answer>",
    "readiness_level": "<NEEDS_FOUNDATION|DEVELOPING|MODERATE|STRONG|INTERVIEW_READY>",
    "estimated_selection_chance": <percentage 0-100>,
    "next_practice_step": "<suggestion for next practice>",
    "feedback": "<detailed feedback>"
}}

Return ONLY valid JSON, no additional text."""

        try:
            response = await self.client.post(
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": "You are an expert interview evaluator."},
                        {"role": "user", "content": evaluation_prompt},
                    ],
                    "temperature": 0.3,
                    "max_tokens": 2000,
                },
            )

            response.raise_for_status()
            data = response.json()

            response_text = data["choices"][0]["message"]["content"]
            evaluation = json.loads(response_text)

            logger.info(
                "answer_evaluated",
                provider="openai",
                mode=interview_mode,
                score=evaluation.get("overall_score"),
            )

            return evaluation

        except Exception as e:
            logger.error("openai_answer_evaluation_failed", exc_info=e)
            raise


class AIProviderFactory:
    """Factory for creating AI provider instances."""

    _providers = {
        "gemini": GeminiAIProvider,
        "openai": OpenAIProvider,
    }

    @classmethod
    def get_provider(cls, provider_name: Optional[str] = None) -> AIProvider:
        """Get AI provider instance."""
        provider = provider_name or settings.AI_PROVIDER

        if provider not in cls._providers:
            logger.error("unknown_ai_provider", provider=provider)
            raise ValueError(f"Unknown AI provider: {provider}")

        return cls._providers[provider]()

    @classmethod
    def get_fallback_providers(cls) -> list:
        """Get list of fallback providers."""
        primary = settings.AI_PROVIDER
        fallbacks = [p for p in cls._providers.keys() if p != primary]
        return [cls._providers[p]() for p in [primary] + fallbacks]


async def generate_interview_question_with_fallback(
    interview_mode: str,
    difficulty: str,
    target_role: str,
    target_field: Optional[str] = None,
    company: Optional[str] = None,
) -> Optional[str]:
    """Generate interview question with fallback to other providers."""

    for provider in AIProviderFactory.get_fallback_providers():
        try:
            logger.info("generating_question", provider=provider.__class__.__name__)
            question = await provider.generate_interview_question(
                interview_mode=interview_mode,
                difficulty=difficulty,
                target_role=target_role,
                target_field=target_field,
                company=company,
            )
            return question
        except Exception as e:
            logger.warning(
                "provider_failed_trying_next",
                provider=provider.__class__.__name__,
                error=str(e),
            )
            continue

    logger.error("all_providers_failed")
    return None


async def evaluate_answer_with_fallback(
    question: str,
    answer: str,
    interview_mode: str,
    difficulty: str,
    target_role: str,
) -> Optional[Dict[str, Any]]:
    """Evaluate answer with fallback to other providers."""

    for provider in AIProviderFactory.get_fallback_providers():
        try:
            logger.info("evaluating_answer", provider=provider.__class__.__name__)
            evaluation = await provider.evaluate_answer(
                question=question,
                answer=answer,
                interview_mode=interview_mode,
                difficulty=difficulty,
                target_role=target_role,
            )
            return evaluation
        except Exception as e:
            logger.warning(
                "provider_failed_trying_next",
                provider=provider.__class__.__name__,
                error=str(e),
            )
            continue

    logger.error("all_providers_failed")
    return None
