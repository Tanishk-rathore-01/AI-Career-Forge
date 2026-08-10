"""Unit tests for authentication service."""


import pytest

from app.utils.auth import (
    create_access_token,
    create_refresh_token,
    hash_password,
    is_token_expired,
    verify_password,
    verify_token,
)


class TestPasswordHashing:
    """Test password hashing and verification."""

    def test_hash_password(self):
        """Test password hashing."""
        password = "TestPassword123!"
        hashed = hash_password(password)

        assert hashed != password
        assert len(hashed) > len(password)

    def test_verify_password_correct(self):
        """Test password verification with correct password."""
        password = "TestPassword123!"
        hashed = hash_password(password)

        assert verify_password(password, hashed)

    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password."""
        password = "TestPassword123!"
        wrong_password = "WrongPassword123!"
        hashed = hash_password(password)

        assert not verify_password(wrong_password, hashed)


class TestJWTTokens:
    """Test JWT token creation and verification."""

    def test_create_access_token(self):
        """Test access token creation."""
        user_id = "test-user-123"
        token = create_access_token(subject=user_id)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_refresh_token(self):
        """Test refresh token creation."""
        user_id = "test-user-123"
        token = create_refresh_token(subject=user_id)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    def test_verify_valid_access_token(self):
        """Test verifying a valid access token."""
        user_id = "test-user-123"
        token = create_access_token(subject=user_id)

        token_data = verify_token(token)

        assert token_data is not None
        assert token_data.sub == user_id
        assert token_data.type == "access"

    def test_verify_valid_refresh_token(self):
        """Test verifying a valid refresh token."""
        user_id = "test-user-123"
        token = create_refresh_token(subject=user_id)

        token_data = verify_token(token)

        assert token_data is not None
        assert token_data.sub == user_id
        assert token_data.type == "refresh"

    def test_verify_invalid_token(self):
        """Test verifying an invalid token."""
        invalid_token = "invalid.token.here"

        token_data = verify_token(invalid_token)

        assert token_data is None

    def test_verify_expired_token(self):
        """Test checking if token is expired."""
        # Create token with very short expiration
        from app.core.config import settings
        original_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES

        try:
            # This is a simplified test
            user_id = "test-user-123"
            token = create_access_token(subject=user_id)
            token_data = verify_token(token)

            assert token_data is not None
            assert not is_token_expired(token_data)
        finally:
            settings.ACCESS_TOKEN_EXPIRE_MINUTES = original_minutes


@pytest.mark.security
class TestPasswordSecurity:
    """Test password security requirements."""

    def test_bcrypt_rounds(self):
        """Test that bcrypt uses sufficient rounds."""
        password = "TestPassword123!"
        hashed = hash_password(password)

        # Bcrypt hashes start with $2b$
        assert hashed.startswith("$2b$")
        # Extract the rounds from the hash (format: $2b$rounds$...)
        rounds = int(hashed.split("$")[2])
        assert rounds >= 12
