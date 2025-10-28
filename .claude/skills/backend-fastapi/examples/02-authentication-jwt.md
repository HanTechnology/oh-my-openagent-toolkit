# OAuth2 + JWT Authentication Implementation

> **Demonstrates**: Complete authentication system with OAuth2 Password Flow and JWT tokens
> **Technologies**: python-jose[cryptography], passlib[bcrypt], OAuth2PasswordBearer, FastAPI security
> **Integration**: Protected routes, RBAC, token refresh, secure password handling
> **Use when**: Implementing user authentication and authorization in FastAPI

---

## Overview

This example implements production-ready authentication with:
- OAuth2 Password Flow (FastAPI recommended pattern)
- JWT access and refresh tokens
- Secure password hashing with bcrypt
- Protected routes with dependency injection
- Role-based access control (RBAC)

## Implementation

### 1. Security Utilities (app/core/security.py)

```python
from datetime import datetime, timedelta
from typing import Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    return pwd_context.hash(password)

def create_access_token(
    subject: str | int,
    expires_delta: timedelta | None = None,
    scopes: list[str] | None = None,
) -> str:
    """Create JWT access token."""
    settings = get_settings()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.jwt_expiration_minutes)

    to_encode: dict[str, Any] = {
        "exp": expire,
        "sub": str(subject),
        "type": "access",
    }

    if scopes:
        to_encode["scopes"] = scopes

    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret,
        algorithm="HS256",
    )
    return encoded_jwt

def create_refresh_token(subject: str | int, expires_delta: timedelta | None = None) -> str:
    """Create JWT refresh token."""
    settings = get_settings()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)  # Longer expiration for refresh

    to_encode: dict[str, Any] = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh",
    }

    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret,
        algorithm="HS256",
    )
    return encoded_jwt

def decode_token(token: str) -> dict[str, Any]:
    """Decode and validate JWT token."""
    settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=["HS256"],
        )
        return payload
    except JWTError:
        raise ValueError("Invalid token")
```

### 2. Authentication Schemas (app/api/v1/schemas/auth.py)

```python
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: int | None = None
    scopes: list[str] = []

class RefreshTokenRequest(BaseModel):
    refresh_token: str
```

### 3. User Schema Updates (app/api/v1/schemas/user.py)

Add role field to User model:

```python
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"

class UserOut(UserBase):
    id: int
    is_active: bool
    role: UserRole
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
```

### 4. User Model Updates (app/db/models/user.py)

Add role field:

```python
from sqlalchemy import Enum as SQLEnum
import enum

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    password_hash: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole, name="user_role"),
        default=UserRole.USER,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
```

### 5. Authentication Dependencies (app/api/v1/deps.py)

```python
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError
from app.db.session import get_db
from app.db.models.user import User, UserRole
from app.core.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/token",
    scopes={
        "user": "Basic user access",
        "admin": "Admin access",
        "moderator": "Moderator access",
    },
)

async def get_current_user(
    security_scopes: SecurityScopes,
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Get current authenticated user from JWT token."""
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )

    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")

        if user_id is None or token_type != "access":
            raise credentials_exception

        token_scopes = payload.get("scopes", [])
    except (JWTError, ValueError):
        raise credentials_exception

    # Fetch user from database
    user = await db.get(User, int(user_id))
    if user is None:
        raise credentials_exception

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    # Verify scopes
    for scope in security_scopes.scopes:
        if scope not in token_scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )

    return user

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Get current active user."""
    return current_user

def require_role(required_role: UserRole):
    """Dependency to require specific user role."""
    async def role_checker(
        current_user: Annotated[User, Depends(get_current_user)],
    ) -> User:
        if current_user.role != required_role and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {required_role.value} required",
            )
        return current_user
    return role_checker

async def get_current_admin(
    current_user: Annotated[User, Depends(require_role(UserRole.ADMIN))],
) -> User:
    """Get current user with admin role."""
    return current_user
```

### 6. Authentication Router (app/api/v1/routers/auth.py)

```python
from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.user_repo import UserRepository
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.api.v1.schemas.auth import Token, RefreshTokenRequest
from app.api.v1.schemas.user import UserOut
from app.api.v1.deps import get_current_user
from app.db.models.user import User

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post(
    "/token",
    response_model=Token,
    summary="Login to get access token",
    description="OAuth2 compatible token endpoint. Use email as username.",
)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Login with email and password to get JWT tokens."""
    repo = UserRepository(db)

    # Get user by email (username field contains email)
    user = await repo.get_by_email(form_data.username)

    # Verify user exists and password is correct
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    # Create tokens with user role as scope
    access_token = create_access_token(
        subject=user.id,
        scopes=[user.role.value],
    )
    refresh_token = create_refresh_token(subject=user.id)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )

@router.post(
    "/refresh",
    response_model=Token,
    summary="Refresh access token",
    description="Use refresh token to get new access and refresh tokens.",
)
async def refresh_token(
    refresh_request: RefreshTokenRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Refresh access token using refresh token."""
    try:
        payload = decode_token(refresh_request.refresh_token)
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")

        if user_id is None or token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    # Verify user still exists and is active
    user = await db.get(User, int(user_id))
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    # Create new tokens
    access_token = create_access_token(
        subject=user.id,
        scopes=[user.role.value],
    )
    new_refresh_token = create_refresh_token(subject=user.id)

    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
    )

@router.get(
    "/me",
    response_model=UserOut,
    summary="Get current user",
    description="Get currently authenticated user information.",
)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)],
):
    """Get current user profile."""
    return current_user
```

### 7. Protected Route Examples (app/api/v1/routers/users.py)

Update users router with authentication:

```python
from app.api.v1.deps import get_current_user, get_current_admin

# Protected route - any authenticated user
@router.get(
    "/{user_id}",
    response_model=UserOut,
    summary="Get user by ID",
    description="Get user information. Requires authentication.",
)
async def get_user(
    user_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[UserService, Depends(get_user_service)],
):
    """Get user by ID. Requires authentication."""
    user = await service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Users can only see their own profile unless they're admin
    if current_user.id != user_id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")

    return user

# Admin-only route
@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user (admin only)",
    description="Delete a user account. Requires admin role.",
)
async def delete_user(
    user_id: int,
    admin_user: Annotated[User, Depends(get_current_admin)],
    service: Annotated[UserService, Depends(get_user_service)],
):
    """Delete user. Admin only."""
    try:
        await service.delete_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
```

### 8. Configuration Updates (app/core/config.py)

Add JWT configuration:

```python
class AppSettings(BaseSettings):
    # ... existing fields ...

    # JWT Configuration
    jwt_secret: str  # NEVER hardcode, use environment variable
    jwt_expiration_minutes: int = 30
    jwt_algorithm: str = "HS256"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )
```

### 9. Environment Variables (.env.example)

```
# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRATION_MINUTES=30
JWT_ALGORITHM=HS256
```

### 10. Dependencies Update (requirements.txt)

```
# ... existing dependencies ...
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.6
```

## Usage Examples

### 1. Register and Login

```bash
# Register new user
curl -X POST "http://localhost:8000/api/v1/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "Test User",
    "password": "securepass123"
  }'

# Login to get tokens
curl -X POST "http://localhost:8000/api/v1/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=securepass123"

# Response:
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### 2. Access Protected Routes

```bash
# Get current user info
curl "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer eyJhbGc..."

# Access protected endpoint
curl "http://localhost:8000/api/v1/users/1" \
  -H "Authorization: Bearer eyJhbGc..."
```

### 3. Refresh Token

```bash
curl -X POST "http://localhost:8000/api/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "eyJhbGc..."}'
```

### 4. Admin-Only Route

```bash
# Delete user (admin only)
curl -X DELETE "http://localhost:8000/api/v1/users/2" \
  -H "Authorization: Bearer <admin-token>"
```

## Frontend Integration

### JavaScript/TypeScript Example

```typescript
// Login
const loginResponse = await fetch('http://localhost:8000/api/v1/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    username: 'user@example.com',
    password: 'securepass123',
  }),
});

const { access_token, refresh_token } = await loginResponse.json();

// Store tokens (use httpOnly cookies in production)
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);

// Make authenticated request
const userResponse = await fetch('http://localhost:8000/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${access_token}`,
  },
});

const user = await userResponse.json();
```

### Token Refresh Logic

```typescript
async function refreshAccessToken() {
  const refresh_token = localStorage.getItem('refresh_token');

  const response = await fetch('http://localhost:8000/api/v1/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token }),
  });

  if (response.ok) {
    const { access_token, refresh_token: new_refresh_token } = await response.json();
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', new_refresh_token);
    return access_token;
  } else {
    // Refresh failed, redirect to login
    window.location.href = '/login';
  }
}

// Intercept 401 responses and retry with refreshed token
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let access_token = localStorage.getItem('access_token');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${access_token}`,
    },
  });

  if (response.status === 401) {
    // Try to refresh token
    access_token = await refreshAccessToken();

    // Retry original request
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${access_token}`,
      },
    });
  }

  return response;
}
```

## Security Best Practices

1. **JWT Secrets**: Use strong, random secrets (min 32 characters)
2. **Token Expiration**: Short-lived access tokens (15-30 min), longer refresh tokens (7 days)
3. **HTTPS Only**: Always use HTTPS in production
4. **Password Policies**: Enforce strong passwords (min 8 chars, complexity)
5. **Rate Limiting**: Implement rate limiting on /token endpoint
6. **Refresh Token Rotation**: Issue new refresh token on each refresh
7. **Token Storage**: Use httpOnly cookies or secure storage (not localStorage in production)
8. **Revocation**: Implement token blacklist or refresh token storage for revocation

## Testing Authentication

```python
# tests/api/v1/test_auth.py
import pytest
from httpx import AsyncClient

@pytest.mark.anyio
async def test_login_success(async_client: AsyncClient, test_user):
    response = await async_client.post(
        "/api/v1/auth/token",
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
async def test_login_invalid_credentials(async_client: AsyncClient):
    response = await async_client.post(
        "/api/v1/auth/token",
        data={
            "username": "wrong@example.com",
            "password": "wrongpassword",
        },
    )
    assert response.status_code == 401

@pytest.mark.anyio
async def test_get_current_user(async_client: AsyncClient, auth_headers):
    response = await async_client.get(
        "/api/v1/auth/me",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert "email" in data
    assert "id" in data

@pytest.mark.anyio
async def test_protected_route_without_token(async_client: AsyncClient):
    response = await async_client.get("/api/v1/auth/me")
    assert response.status_code == 401
```

## Key Takeaways

1. **OAuth2 Password Flow**: Standard authentication pattern for FastAPI
2. **JWT Tokens**: Stateless authentication with access and refresh tokens
3. **Password Security**: bcrypt hashing, NEVER plain text
4. **Dependency Injection**: Clean authentication with `Depends(get_current_user)`
5. **RBAC**: Role-based access control with scopes
6. **Token Refresh**: Implement refresh token flow for better UX
7. **Security Headers**: Proper WWW-Authenticate headers
8. **Type Safety**: Full type hints for security functions

This authentication system is production-ready and follows FastAPI best practices.
