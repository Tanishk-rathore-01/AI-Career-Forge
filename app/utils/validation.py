"""Validation utilities for API requests and responses."""

import json
import re
from typing import Any, Dict, Optional


def validate_json_response(response_text: str) -> Optional[Dict[str, Any]]:
    """Extract and validate JSON from response text."""
    try:
        # Try direct parsing first
        return json.loads(response_text)
    except json.JSONDecodeError:
        # Try to extract JSON from markdown code blocks
        json_match = re.search(r'```(?:json)?\s*({.*?})\s*```', response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass

        # Try to find JSON object in text
        start = response_text.find('{')
        if start != -1:
            try:
                return json.loads(response_text[start:])
            except json.JSONDecodeError:
                pass

    return None


def validate_interview_evaluation(data: Dict[str, Any]) -> bool:
    """Validate interview evaluation response structure."""
    required_fields = {
        "overall_score": int,
        "category_scores": dict,
        "strengths": list,
        "weaknesses": list,
        "improved_answer": str,
        "readiness_level": str,
        "estimated_selection_chance": int,
        "next_practice_step": str,
    }

    for field, expected_type in required_fields.items():
        if field not in data:
            return False
        if not isinstance(data[field], expected_type):
            return False

    # Validate score ranges
    if not 0 <= data["overall_score"] <= 100:
        return False
    if not 0 <= data["estimated_selection_chance"] <= 100:
        return False

    # Validate readiness level
    valid_levels = [
        "NEEDS_FOUNDATION",
        "DEVELOPING",
        "MODERATE",
        "STRONG",
        "INTERVIEW_READY",
    ]
    if data["readiness_level"] not in valid_levels:
        return False

    return True


def sanitize_user_input(text: str, max_length: int = 5000) -> str:
    """Sanitize user input by removing potential malicious content."""
    # Truncate
    text = text[:max_length]

    # Remove null bytes
    text = text.replace('\x00', '')

    # Strip leading/trailing whitespace
    text = text.strip()

    return text
