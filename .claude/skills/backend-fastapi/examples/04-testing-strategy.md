# Example 04: Testing Strategy with pytest and httpx

> **Focus**: Comprehensive testing strategy for FastAPI applications
> **Prerequisites**: pytest, httpx, async testing knowledge
> **Related Examples**: 01-complete-fastapi-setup.md, 02-authentication-jwt.md, 03-async-database-operations.md

---

## Table of Contents

1. [Testing Setup and Configuration](#1-testing-setup-and-configuration)
2. [Test Fixtures](#2-test-fixtures)
3. [Dependency Override Patterns](#3-dependency-override-patterns)
4. [API Endpoint Testing](#4-api-endpoint-testing)
5. [Authentication Testing](#5-authentication-testing)
6. [Integration Testing](#6-integration-testing)
7. [Coverage and CI/CD](#7-coverage-and-cicd)
8. [Best Practices](#8-best-practices)

---

## 1. Testing Setup and Configuration

### 1.1. Dependencies

**`requirements-dev.txt`**:
```txt
# Core testing
pytest==8.3.5
pytest-anyio==0.0.0
pytest-cov==6.0.0
pytest-mock==3.14.0

# HTTP client for API testing
httpx==0.28.1

# Test database
asyncpg==0.30.0
sqlalchemy[asyncio]==2.0.36

# Code quality
mypy==1.15.0
ruff==0.9.1
```

### 1.2. pytest Configuration

**`pyproject.toml`**:
```toml
[tool.pytest.ini_options]
# Async test support
asyncio_mode = "auto"

# Test discovery
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]

# Output
addopts = [
    "-v",                           # Verbose output
    "--strict-markers",             # Strict marker validation
    "--tb=short",                   # Short traceback format
    "--cov=app",                    # Coverage for app directory
    "--cov-report=term-missing",    # Show missing lines
    "--cov-report=html",            # HTML coverage report
    "--cov-report=xml",             # XML for CI/CD
    "--cov-fail-under=80",          # Minimum 80% coverage
]

# Markers
markers = [
    "unit: Unit tests",
    "integration: Integration tests",
    "slow: Slow tests",
]

# Ignore warnings
filterwarnings = [
    "ignore::DeprecationWarning",
]
```

**Alternative: `pytest.ini`**:
```ini
[pytest]
asyncio_mode = auto
testpaths = tests
python_files = test_*.py *_test.py
python_classes = Test*
python_functions = test_*

addopts =
    -v
    --strict-markers
    --tb=short
    --cov=app
    --cov-report=term-missing
    --cov-report=html
    --cov-report=xml
    --cov-fail-under=80

markers =
    unit: Unit tests
    integration: Integration tests
    slow: Slow tests

filterwarnings =
    ignore::DeprecationWarning
```

### 1.3. Test Database Configuration

**`tests/conftest.py`** (shared fixtures):
```python
import os
from typing import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from app.database.base import Base
from app.database.engine import get_db
from app.main import app


# Test database URL
TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql+asyncpg://user:password@localhost:5432/test_db",
)


@pytest.fixture(scope="session")
async def engine() -> AsyncGenerator[AsyncEngine, None]:
    """
    Create test database engine for the entire test session.

    Scope: session (created once for all tests)
    """
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,  # Disable SQL logging in tests
        pool_pre_ping=True,
    )

    yield engine

    await engine.dispose()


@pytest.fixture(scope="function")
async def db_session(engine: AsyncEngine) -> AsyncGenerator[AsyncSession, None]:
    """
    Create a clean database session for each test.

    Scope: function (new session for each test)

    This fixture:
    1. Creates all tables before test
    2. Yields clean session
    3. Rolls back all changes after test
    4. Drops all tables after test
    """
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create session
    SessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
        autocommit=False,
    )

    async with SessionLocal() as session:
        yield session
        await session.rollback()

    # Drop tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Create HTTP client with test database dependency override.

    Scope: function (new client for each test)

    This fixture:
    1. Overrides get_db dependency with test session
    2. Creates async HTTP client with ASGITransport
    3. Automatically handles cookies (authentication)
    """

    # Override database dependency
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    # Create async client
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac

    # Clean up dependency overrides
    app.dependency_overrides.clear()
```

---

## 2. Test Fixtures

### 2.1. Model Fixtures

**`tests/fixtures/user_fixtures.py`**:
```python
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole
from app.security.password import hash_password


@pytest.fixture
async def test_user(db_session: AsyncSession) -> User:
    """
    Create a test user in the database.

    Returns user instance with known credentials:
    - email: test@example.com
    - password: testpassword123
    """
    user = User(
        email="test@example.com",
        username="testuser",
        password_hash=hash_password("testpassword123"),
        full_name="Test User",
        role=UserRole.USER,
        is_active=True,
    )

    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    return user


@pytest.fixture
async def test_admin(db_session: AsyncSession) -> User:
    """
    Create a test admin user in the database.

    Returns admin user with known credentials:
    - email: admin@example.com
    - password: adminpassword123
    """
    admin = User(
        email="admin@example.com",
        username="adminuser",
        password_hash=hash_password("adminpassword123"),
        full_name="Admin User",
        role=UserRole.ADMIN,
        is_active=True,
    )

    db_session.add(admin)
    await db_session.commit()
    await db_session.refresh(admin)

    return admin


@pytest.fixture
async def test_users(db_session: AsyncSession) -> list[User]:
    """
    Create multiple test users for batch testing.

    Returns list of 5 users.
    """
    users = [
        User(
            email=f"user{i}@example.com",
            username=f"user{i}",
            password_hash=hash_password(f"password{i}"),
            full_name=f"User {i}",
            role=UserRole.USER,
            is_active=True,
        )
        for i in range(1, 6)
    ]

    db_session.add_all(users)
    await db_session.commit()

    for user in users:
        await db_session.refresh(user)

    return users
```

### 2.2. Authentication Fixtures

**`tests/fixtures/auth_fixtures.py`**:
```python
import pytest
from httpx import AsyncClient

from app.models.user import User


@pytest.fixture
async def user_token(client: AsyncClient, test_user: User) -> str:
    """
    Get access token for test user.

    Returns JWT access token.
    """
    response = await client.post(
        "/auth/token",
        data={
            "username": test_user.email,
            "password": "testpassword123",
        },
    )

    assert response.status_code == 200

    data = response.json()
    return data["access_token"]


@pytest.fixture
async def admin_token(client: AsyncClient, test_admin: User) -> str:
    """
    Get access token for test admin.

    Returns JWT access token.
    """
    response = await client.post(
        "/auth/token",
        data={
            "username": test_admin.email,
            "password": "adminpassword123",
        },
    )

    assert response.status_code == 200

    data = response.json()
    return data["access_token"]


@pytest.fixture
async def auth_headers(user_token: str) -> dict[str, str]:
    """
    Get authorization headers for test user.

    Returns headers dict with Bearer token.
    """
    return {"Authorization": f"Bearer {user_token}"}


@pytest.fixture
async def admin_headers(admin_token: str) -> dict[str, str]:
    """
    Get authorization headers for test admin.

    Returns headers dict with Bearer token.
    """
    return {"Authorization": f"Bearer {admin_token}"}
```

---

## 3. Dependency Override Patterns

### 3.1. Database Dependency Override

**Already shown in `conftest.py`, but here's the pattern**:

```python
from app.database.engine import get_db
from app.main import app


# Override in fixture
async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    yield test_db_session

app.dependency_overrides[get_db] = override_get_db

# Clean up after test
app.dependency_overrides.clear()
```

### 3.2. Service Dependency Override

**`tests/test_dependency_override.py`**:
```python
import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock

from app.dependencies.services import get_user_service
from app.main import app


@pytest.mark.anyio
async def test_with_mocked_service(client: AsyncClient):
    """
    Test endpoint with mocked service dependency.
    """
    # Create mock service
    mock_service = AsyncMock()
    mock_service.get_user.return_value = {
        "id": 1,
        "email": "mock@example.com",
        "username": "mockuser",
    }

    # Override dependency
    async def override_get_user_service():
        return mock_service

    app.dependency_overrides[get_user_service] = override_get_user_service

    # Make request
    response = await client.get("/users/1")

    assert response.status_code == 200
    assert response.json()["email"] == "mock@example.com"

    # Verify mock was called
    mock_service.get_user.assert_called_once_with(1)

    # Clean up
    app.dependency_overrides.clear()
```

### 3.3. Configuration Override

**`tests/test_config_override.py`**:
```python
import pytest
from httpx import AsyncClient

from app.config.settings import get_settings, Settings
from app.main import app


@pytest.mark.anyio
async def test_with_custom_config(client: AsyncClient):
    """
    Test with custom configuration settings.
    """
    # Create custom settings
    test_settings = Settings(
        database_url="postgresql+asyncpg://test:test@localhost/test",
        jwt_secret="test_secret",
        jwt_expiration_minutes=5,
    )

    # Override dependency
    def override_get_settings():
        return test_settings

    app.dependency_overrides[get_settings] = override_get_settings

    # Test code here
    # ...

    # Clean up
    app.dependency_overrides.clear()
```

---

## 4. API Endpoint Testing

### 4.1. Basic CRUD Testing

**`tests/test_users.py`**:
```python
import pytest
from httpx import AsyncClient

from app.models.user import User


@pytest.mark.anyio
@pytest.mark.unit
async def test_create_user(client: AsyncClient):
    """
    Test POST /users - Create new user.
    """
    payload = {
        "email": "newuser@example.com",
        "username": "newuser",
        "password": "newpassword123",
        "full_name": "New User",
    }

    response = await client.post("/users", json=payload)

    assert response.status_code == 201

    data = response.json()
    assert data["email"] == payload["email"]
    assert data["username"] == payload["username"]
    assert "password" not in data  # Password should not be in response
    assert "password_hash" not in data  # Password hash should not be in response
    assert "id" in data


@pytest.mark.anyio
@pytest.mark.unit
async def test_create_user_duplicate_email(client: AsyncClient, test_user: User):
    """
    Test POST /users - Duplicate email should fail.
    """
    payload = {
        "email": test_user.email,  # Duplicate email
        "username": "differentuser",
        "password": "password123",
    }

    response = await client.post("/users", json=payload)

    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


@pytest.mark.anyio
@pytest.mark.unit
async def test_get_user(client: AsyncClient, test_user: User):
    """
    Test GET /users/{id} - Get user by ID.
    """
    response = await client.get(f"/users/{test_user.id}")

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == test_user.id
    assert data["email"] == test_user.email
    assert data["username"] == test_user.username


@pytest.mark.anyio
@pytest.mark.unit
async def test_get_user_not_found(client: AsyncClient):
    """
    Test GET /users/{id} - Non-existent user should return 404.
    """
    response = await client.get("/users/99999")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


@pytest.mark.anyio
@pytest.mark.unit
async def test_list_users(client: AsyncClient, test_users: list[User]):
    """
    Test GET /users - List all users with pagination.
    """
    response = await client.get("/users?skip=0&limit=10")

    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) == len(test_users)


@pytest.mark.anyio
@pytest.mark.unit
async def test_update_user(client: AsyncClient, test_user: User, auth_headers: dict):
    """
    Test PUT /users/{id} - Update user.
    """
    payload = {
        "full_name": "Updated Name",
        "bio": "Updated bio",
    }

    response = await client.put(
        f"/users/{test_user.id}",
        json=payload,
        headers=auth_headers,
    )

    assert response.status_code == 200

    data = response.json()
    assert data["full_name"] == payload["full_name"]
    assert data["bio"] == payload["bio"]


@pytest.mark.anyio
@pytest.mark.unit
async def test_delete_user(client: AsyncClient, test_user: User, admin_headers: dict):
    """
    Test DELETE /users/{id} - Delete user (admin only).
    """
    response = await client.delete(
        f"/users/{test_user.id}",
        headers=admin_headers,
    )

    assert response.status_code == 204

    # Verify user is deleted
    response = await client.get(f"/users/{test_user.id}")
    assert response.status_code == 404
```

### 4.2. Validation Testing

**`tests/test_validation.py`**:
```python
import pytest
from httpx import AsyncClient


@pytest.mark.anyio
@pytest.mark.unit
async def test_create_user_invalid_email(client: AsyncClient):
    """
    Test POST /users - Invalid email format should fail.
    """
    payload = {
        "email": "invalid-email",  # Invalid format
        "username": "testuser",
        "password": "password123",
    }

    response = await client.post("/users", json=payload)

    assert response.status_code == 422
    errors = response.json()["detail"]
    assert any("email" in str(error).lower() for error in errors)


@pytest.mark.anyio
@pytest.mark.unit
async def test_create_user_missing_required_fields(client: AsyncClient):
    """
    Test POST /users - Missing required fields should fail.
    """
    payload = {
        "email": "test@example.com",
        # Missing username and password
    }

    response = await client.post("/users", json=payload)

    assert response.status_code == 422
    errors = response.json()["detail"]
    assert len(errors) >= 2  # username and password missing


@pytest.mark.anyio
@pytest.mark.unit
async def test_create_user_password_too_short(client: AsyncClient):
    """
    Test POST /users - Short password should fail.
    """
    payload = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "short",  # Too short
    }

    response = await client.post("/users", json=payload)

    assert response.status_code == 422
    errors = response.json()["detail"]
    assert any("password" in str(error).lower() for error in errors)
```

---

## 5. Authentication Testing

### 5.1. Login Testing

**`tests/test_auth.py`**:
```python
import pytest
from httpx import AsyncClient

from app.models.user import User


@pytest.mark.anyio
@pytest.mark.unit
async def test_login_success(client: AsyncClient, test_user: User):
    """
    Test POST /auth/token - Successful login.
    """
    response = await client.post(
        "/auth/token",
        data={
            "username": test_user.email,
            "password": "testpassword123",
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.anyio
@pytest.mark.unit
async def test_login_invalid_credentials(client: AsyncClient, test_user: User):
    """
    Test POST /auth/token - Invalid password should fail.
    """
    response = await client.post(
        "/auth/token",
        data={
            "username": test_user.email,
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401
    assert "incorrect" in response.json()["detail"].lower()


@pytest.mark.anyio
@pytest.mark.unit
async def test_login_nonexistent_user(client: AsyncClient):
    """
    Test POST /auth/token - Non-existent user should fail.
    """
    response = await client.post(
        "/auth/token",
        data={
            "username": "nonexistent@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 401


@pytest.mark.anyio
@pytest.mark.unit
async def test_get_current_user(client: AsyncClient, test_user: User, auth_headers: dict):
    """
    Test GET /auth/me - Get current authenticated user.
    """
    response = await client.get("/auth/me", headers=auth_headers)

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == test_user.id
    assert data["email"] == test_user.email


@pytest.mark.anyio
@pytest.mark.unit
async def test_get_current_user_no_token(client: AsyncClient):
    """
    Test GET /auth/me - No token should return 401.
    """
    response = await client.get("/auth/me")

    assert response.status_code == 401


@pytest.mark.anyio
@pytest.mark.unit
async def test_get_current_user_invalid_token(client: AsyncClient):
    """
    Test GET /auth/me - Invalid token should return 401.
    """
    headers = {"Authorization": "Bearer invalid_token"}

    response = await client.get("/auth/me", headers=headers)

    assert response.status_code == 401
```

### 5.2. Authorization Testing (RBAC)

**`tests/test_authorization.py`**:
```python
import pytest
from httpx import AsyncClient

from app.models.user import User


@pytest.mark.anyio
@pytest.mark.unit
async def test_admin_only_endpoint_as_admin(
    client: AsyncClient,
    test_admin: User,
    admin_headers: dict,
):
    """
    Test admin-only endpoint with admin user (should succeed).
    """
    response = await client.get("/admin/users", headers=admin_headers)

    assert response.status_code == 200


@pytest.mark.anyio
@pytest.mark.unit
async def test_admin_only_endpoint_as_user(
    client: AsyncClient,
    test_user: User,
    auth_headers: dict,
):
    """
    Test admin-only endpoint with regular user (should fail).
    """
    response = await client.get("/admin/users", headers=auth_headers)

    assert response.status_code == 403
    assert "permission" in response.json()["detail"].lower()


@pytest.mark.anyio
@pytest.mark.unit
async def test_delete_own_user(
    client: AsyncClient,
    test_user: User,
    auth_headers: dict,
):
    """
    Test user can delete their own account.
    """
    response = await client.delete(
        f"/users/{test_user.id}",
        headers=auth_headers,
    )

    assert response.status_code == 204


@pytest.mark.anyio
@pytest.mark.unit
async def test_delete_other_user_as_non_admin(
    client: AsyncClient,
    test_user: User,
    test_users: list[User],
    auth_headers: dict,
):
    """
    Test user cannot delete other users' accounts.
    """
    other_user = test_users[0]

    response = await client.delete(
        f"/users/{other_user.id}",
        headers=auth_headers,
    )

    assert response.status_code == 403
```

---

## 6. Integration Testing

### 6.1. End-to-End Flow Testing

**`tests/test_integration.py`**:
```python
import pytest
from httpx import AsyncClient


@pytest.mark.anyio
@pytest.mark.integration
async def test_user_registration_and_login_flow(client: AsyncClient):
    """
    Test complete user registration and login flow.

    Steps:
    1. Register new user
    2. Login with credentials
    3. Access protected endpoint with token
    """
    # Step 1: Register user
    register_payload = {
        "email": "integration@example.com",
        "username": "integrationuser",
        "password": "integrationpass123",
        "full_name": "Integration Test User",
    }

    register_response = await client.post("/users", json=register_payload)
    assert register_response.status_code == 201

    user_data = register_response.json()
    user_id = user_data["id"]

    # Step 2: Login
    login_response = await client.post(
        "/auth/token",
        data={
            "username": register_payload["email"],
            "password": register_payload["password"],
        },
    )
    assert login_response.status_code == 200

    token_data = login_response.json()
    access_token = token_data["access_token"]

    # Step 3: Access protected endpoint
    headers = {"Authorization": f"Bearer {access_token}"}

    me_response = await client.get("/auth/me", headers=headers)
    assert me_response.status_code == 200

    me_data = me_response.json()
    assert me_data["id"] == user_id
    assert me_data["email"] == register_payload["email"]


@pytest.mark.anyio
@pytest.mark.integration
async def test_create_and_retrieve_posts(
    client: AsyncClient,
    test_user: User,
    auth_headers: dict,
):
    """
    Test creating and retrieving posts for a user.

    Steps:
    1. Create multiple posts
    2. Retrieve all posts for user
    3. Retrieve individual post
    4. Verify post data
    """
    # Step 1: Create posts
    post_ids = []

    for i in range(3):
        post_payload = {
            "title": f"Test Post {i}",
            "content": f"Content for test post {i}",
        }

        response = await client.post(
            "/posts",
            json=post_payload,
            headers=auth_headers,
        )

        assert response.status_code == 201
        post_ids.append(response.json()["id"])

    # Step 2: Retrieve all posts for user
    response = await client.get(
        f"/users/{test_user.id}/posts",
        headers=auth_headers,
    )

    assert response.status_code == 200
    posts = response.json()
    assert len(posts) == 3

    # Step 3: Retrieve individual post
    response = await client.get(f"/posts/{post_ids[0]}")

    assert response.status_code == 200
    post_data = response.json()
    assert post_data["title"] == "Test Post 0"
    assert post_data["author_id"] == test_user.id
```

---

## 7. Coverage and CI/CD

### 7.1. Running Tests Locally

**Run all tests**:
```bash
pytest
```

**Run with coverage**:
```bash
pytest --cov=app --cov-report=html --cov-report=term-missing
```

**Run specific test types**:
```bash
# Unit tests only
pytest -m unit

# Integration tests only
pytest -m integration

# Exclude slow tests
pytest -m "not slow"
```

**Run specific test file**:
```bash
pytest tests/test_users.py
```

**Run specific test**:
```bash
pytest tests/test_users.py::test_create_user
```

### 7.2. Coverage Configuration

**`.coveragerc`**:
```ini
[run]
source = app
omit =
    */tests/*
    */venv/*
    */__pycache__/*
    */site-packages/*

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise AssertionError
    raise NotImplementedError
    if __name__ == .__main__.:
    if TYPE_CHECKING:
    @abstractmethod
```

### 7.3. CI/CD Integration (GitHub Actions)

**`.github/workflows/test.yml`**:
```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run mypy
        run: mypy app

      - name: Run ruff
        run: ruff check app

      - name: Run tests with coverage
        env:
          TEST_DATABASE_URL: postgresql+asyncpg://test:test@localhost:5432/test_db
        run: |
          pytest --cov=app --cov-report=xml --cov-report=term-missing

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage.xml
          fail_ci_if_error: true
```

---

## 8. Best Practices

### 8.1. Test Organization

**Do**:
- ✅ Use `conftest.py` for shared fixtures
- ✅ Organize tests by feature/module
- ✅ Use descriptive test names (test_what_when_expected)
- ✅ Use pytest markers to categorize tests
- ✅ Isolate tests (each test should be independent)

**Don't**:
- ❌ Share mutable state between tests
- ❌ Depend on test execution order
- ❌ Use production database for tests
- ❌ Skip cleanup in fixtures

### 8.2. Async Testing

**Do**:
- ✅ Use `@pytest.mark.anyio` for async tests
- ✅ Use `AsyncClient` with `ASGITransport` for API tests
- ✅ Properly await all async operations
- ✅ Use `async with` for context managers

**Don't**:
- ❌ Mix sync and async incorrectly
- ❌ Forget to await async functions
- ❌ Use blocking operations in async tests

### 8.3. Database Testing

**Do**:
- ✅ Use separate test database
- ✅ Create/drop tables per test function
- ✅ Use transactions for test isolation
- ✅ Override database dependency in fixtures

**Don't**:
- ❌ Use production database
- ❌ Leave test data in database
- ❌ Share database session between tests

### 8.4. Coverage Goals

**Targets**:
- Overall coverage: 80% minimum, 90%+ target
- Critical paths: 100% coverage (authentication, payments)
- New code: 100% coverage required

**Exclude from coverage**:
- `__repr__` methods
- Abstract methods
- Type checking blocks (`if TYPE_CHECKING:`)
- Main entry points (`if __name__ == "__main__":`)

---

## Summary

This example demonstrates:

1. **Testing Setup**: pytest configuration, test database, async support
2. **Test Fixtures**: Reusable test data, authentication fixtures
3. **Dependency Overrides**: Mock services, configurations, database
4. **API Testing**: CRUD operations, validation, error handling
5. **Authentication Testing**: Login, tokens, protected endpoints
6. **Integration Testing**: End-to-end flows, multi-step scenarios
7. **Coverage & CI/CD**: Coverage tracking, GitHub Actions integration
8. **Best Practices**: Test organization, async patterns, isolation

**Key Takeaways**:
- Use `httpx.AsyncClient` with `ASGITransport` for API testing
- Override dependencies in fixtures for test isolation
- Use separate test database with clean state per test
- Organize tests with markers (unit, integration, slow)
- Achieve 80%+ code coverage with meaningful tests
- Integrate with CI/CD for continuous quality validation

For more examples, see:
- `01-complete-fastapi-setup.md`: Full project structure
- `02-authentication-jwt.md`: OAuth2 and JWT implementation
- `03-async-database-operations.md`: Database patterns and optimization
