"""Integration tests for authentication API."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.main import app
from app.models import User


@pytest.fixture
def client(db: Session):
    """Create test client."""
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


@pytest.mark.integration
class TestAuthenticationAPI:
    """Test authentication API endpoints."""

    def test_register_user_success(self, client, db: Session):
        """Test successful user registration."""
        response = client.post(
            "/api/auth/register",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "password": "SecurePass123!",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

        # Verify user was created
        user = db.query(User).filter(User.email == "test@example.com").first()
        assert user is not None
        assert user.name == "Test User"

    def test_register_duplicate_email(self, client, db: Session):
        """Test registration with duplicate email."""
        # Create first user
        client.post(
            "/api/auth/register",
            json={
                "name": "First User",
                "email": "duplicate@example.com",
                "password": "SecurePass123!",
            },
        )

        # Try to register with same email
        response = client.post(
            "/api/auth/register",
            json={
                "name": "Second User",
                "email": "duplicate@example.com",
                "password": "SecurePass123!",
            },
        )

        assert response.status_code == 409
        data = response.json()
        assert data["error"] == "CONFLICT"

    def test_login_success(self, client, db: Session):
        """Test successful login."""
        # Register user first
        client.post(
            "/api/auth/register",
            json={
                "name": "Login Test",
                "email": "login@example.com",
                "password": "SecurePass123!",
            },
        )

        # Login
        response = client.post(
            "/api/auth/login",
            json={
                "email": "login@example.com",
                "password": "SecurePass123!",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_password(self, client, db: Session):
        """Test login with invalid password."""
        # Register user first
        client.post(
            "/api/auth/register",
            json={
                "name": "Login Test",
                "email": "login@example.com",
                "password": "SecurePass123!",
            },
        )

        # Try login with wrong password
        response = client.post(
            "/api/auth/login",
            json={
                "email": "login@example.com",
                "password": "WrongPassword123!",
            },
        )

        assert response.status_code == 401
        data = response.json()
        assert data["error"] == "AUTHENTICATION_ERROR"

    def test_get_current_user(self, client, db: Session):
        """Test getting current user."""
        # Register and get token
        register_response = client.post(
            "/api/auth/register",
            json={
                "name": "Current User",
                "email": "current@example.com",
                "password": "SecurePass123!",
            },
        )
        access_token = register_response.json()["access_token"]

        # Get current user
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "current@example.com"
        assert data["name"] == "Current User"

    def test_refresh_token(self, client, db: Session):
        """Test token refresh."""
        # Register and get tokens
        register_response = client.post(
            "/api/auth/register",
            json={
                "name": "Refresh Test",
                "email": "refresh@example.com",
                "password": "SecurePass123!",
            },
        )
        refresh_token = register_response.json()["refresh_token"]

        # Refresh token
        response = client.post(
            "/api/auth/refresh",
            json={"refresh_token": refresh_token},
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
