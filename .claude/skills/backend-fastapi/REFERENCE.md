# Backend FastAPI - Technical Reference

> **Purpose**: Technical reference for the backend-fastapi skill in the autonomous skills-based development system.
> **Related Skills**: fullstack-integration, frontend-nextjs, systemdev-specialist, devops-deployment, qa-testing, backend-nestjs (alternative)
> **Examples**: See examples/ directory for production-ready FastAPI patterns.

---

## Backend FastAPI Skill Guidelines

### Core Responsibilities

**CRITICAL**: Operate with complete autonomy for FastAPI backend development

**API Development Excellence**
- **FastAPI Application Architecture**: ASGI-based async web framework setup
- **Async-First Development**: All endpoints async def, AsyncSession, asyncio patterns
- **Request/Response Validation**: Pydantic v2 models for automatic validation
- **OpenAPI Documentation**: Automatic generation from type hints and Pydantic models
- **API Versioning**: Structured versioning strategy (/api/v1, /api/v2)
- **WebSocket Support**: Real-time bidirectional communication
- **Background Tasks**: Async task offloading for long-running operations

**Data Layer Mastery**
- **SQLAlchemy 2.x Async**: AsyncSession, async_sessionmaker, modern ORM patterns
- **PostgreSQL + asyncpg**: High-performance async database driver
- **Repository Pattern**: Clean abstraction for database operations
- **Alembic Migrations**: Version-controlled schema management
- **Query Optimization**: N+1 prevention, eager loading, indexing strategies
- **Connection Pooling**: Production-grade pool configuration

**Security & Authentication**
- **OAuth2 Password Flow**: Standard authentication pattern
- **JWT Tokens**: Stateless authentication with access and refresh tokens
- **Password Security**: bcrypt/passlib hashing (NEVER plain text)
- **Protected Routes**: Dependency injection for authentication
- **RBAC**: Role-based and scope-based authorization
- **Security Middleware**: CORS, rate limiting, security headers

**Technology Leadership**
- Autonomous technical decisions for FastAPI architecture
- Performance optimization strategies
- Security best practices enforcement
- Testing and quality assurance standards
- Deployment and operational excellence

### Ultimate Goals
- **Production-ready FastAPI applications** with world-class performance
- **Zero user confirmations required** for technical decisions
- Seamless integration with frontend, AI/ML, and deployment systems

---

## Production Examples

This skill provides comprehensive FastAPI implementation examples in the `examples/` directory:

### Available Examples

#### 01. Complete FastAPI Setup (`examples/01-complete-fastapi-setup.md`)
- **Demonstrates**: Full project structure with layered architecture
- **Key Patterns**: app/main.py, routers, services, repositories, schemas, core, db
- **Integration**: SQLAlchemy 2.x async, Pydantic Settings, lifespan management
- **Technologies**: FastAPI 0.115.x+, Python 3.10+, PostgreSQL, asyncpg, Docker
- **Use when**: Starting new FastAPI project or establishing architecture

#### 02. OAuth2 + JWT Authentication (`examples/02-authentication-jwt.md`)
- **Demonstrates**: Complete authentication system with OAuth2 and JWT
- **Key Patterns**: /token endpoint, OAuth2PasswordBearer, get_current_user dependency, RBAC
- **Integration**: Password hashing, JWT encoding/decoding, protected routes
- **Technologies**: python-jose, passlib[bcrypt], OAuth2PasswordRequestForm
- **Use when**: Implementing user authentication and authorization

#### 03. Async Database Operations (`examples/03-async-database-operations.md`)
- **Demonstrates**: SQLAlchemy 2.x async patterns and best practices
- **Key Patterns**: AsyncEngine, async_sessionmaker, repository pattern, migrations
- **Integration**: Dependency injection, transaction management, query optimization
- **Technologies**: SQLAlchemy 2.x, asyncpg, Alembic, PostgreSQL
- **Use when**: Implementing database access layer and complex queries

#### 04. Testing Strategy (`examples/04-testing-strategy.md`)
- **Demonstrates**: Comprehensive testing with pytest and httpx
- **Key Patterns**: pytest.mark.anyio, httpx.AsyncClient, dependency overrides, fixtures
- **Integration**: Test database, mock services, coverage tracking
- **Technologies**: pytest, pytest-anyio, httpx, coverage.py
- **Use when**: Establishing testing infrastructure and CI/CD

### Using These Examples
- Examples provide production-ready implementations
- Complete code with type hints and documentation
- Security best practices throughout
- Cross-references with fullstack-integration, devops-deployment, and qa-testing
- Performance optimization patterns included

---

## Skill Coordination

### Autonomous Operation
This skill operates with **complete autonomy**, requiring **zero user confirmations** for:
- FastAPI application architecture and structure
- Async vs sync implementation decisions
- Database schema design and migrations
- Authentication and authorization implementation
- Security configuration (password hashing, JWT)
- API versioning and endpoint design
- Testing strategy and coverage targets
- Docker configuration and deployment settings
- Performance optimization decisions

### Skill Invocation Context
This skill is automatically invoked by Claude when:
- User requests involve: "FastAPI", "Python backend", "Python API", "async Python", "Pydantic"
- Project requires: Python RESTful API, async database operations, AI/ML model serving
- Context matches: Python microservices, FastAPI development, Pydantic validation
- Related skills mention: "backend-fastapi skill" in their outputs

### Cross-Skill Collaboration
Coordinates with related skills through natural language mentions:

**fullstack-integration**:
- API contract design between FastAPI and Next.js
- Type mapping: Pydantic models → TypeScript interfaces
- Authentication flow coordination (JWT, refresh tokens)
- WebSocket integration for real-time features
- Environment variable management across stack
- Performance optimization across full stack

**frontend-nextjs**:
- RESTful API endpoint consumption patterns
- OpenAPI schema for TypeScript client generation
- JWT token management in frontend
- Error handling and validation messages
- CORS configuration for local development
- API client implementation patterns

**systemdev-specialist**:
- AI/ML model serving with FastAPI endpoints
- Async inference with BackgroundTasks
- GPU resource management patterns
- Batch processing optimization
- Python scientific libraries integration (numpy, pandas, sklearn)
- High-performance data processing

**devops-deployment**:
- Docker containerization (exec-form CMD critical)
- uvicorn production configuration
- Multi-worker deployment strategies
- Environment variable secrets management
- Health check endpoint implementation
- CI/CD pipeline integration (pytest, mypy, ruff)

**qa-testing**:
- pytest async test configuration
- httpx.AsyncClient testing patterns
- Dependency override for mocking
- Test database setup and fixtures
- Coverage tracking and quality gates
- Integration test strategies

**backend-nestjs (alternative/complement)**:
- Backend technology selection guidance
- Microservices architecture coordination
- Shared PostgreSQL database patterns
- Service-to-service authentication
- API gateway integration strategies

### Coordination Pattern
1. **Natural Language Mentions**: Skills mention backend-fastapi for Python API needs
2. **Autonomous Invocation**: Claude automatically invokes based on context
3. **Shared Memory System**: API contracts and decisions in .memory/ directory
4. **Zero User Confirmation**: All technical implementation autonomous

---

## Technology Stack

### Core Framework
```
FastAPI Stack:
- FastAPI: 0.115.x+ (latest stable with Pydantic v2)
- Python: 3.10+ strongly recommended (3.8+ minimum)
- Pydantic: v2 (automatic validation, settings, model_dump/model_validate)
- Starlette: ASGI foundation (included in FastAPI)
- uvicorn: Production ASGI server (with uvloop for performance)
```

### Database & ORM
```
Data Layer:
- PostgreSQL: Primary RDBMS (14+ recommended)
- SQLAlchemy: 2.x async API (AsyncSession, async_sessionmaker, AsyncEngine)
- asyncpg: High-performance async PostgreSQL driver
- Alembic: Database migration tool (async support)
- Connection Pooling: pool_size, max_overflow configuration
```

### Authentication & Security
```
Security Stack:
- OAuth2PasswordBearer: Token extraction from Authorization header
- python-jose[cryptography]: JWT token encoding/decoding
- passlib[bcrypt]: Secure password hashing (NEVER plain text)
- python-multipart: Form data parsing for OAuth2 flows
- CORS Middleware: Cross-origin resource sharing configuration
```

### Development & Quality Tools
```
Quality Tooling:
- pytest: Async testing framework
- pytest-anyio: Async test support (pytest.mark.anyio)
- httpx: Async HTTP client for API testing
- mypy: Static type checking (strict mode recommended)
- ruff or black: Code formatting and linting
- isort: Import statement sorting
- coverage.py: Code coverage measurement
```

### Configuration & Environment
```
Configuration Management:
- pydantic-settings: Type-safe environment variable loading
- python-dotenv: .env file support for local development
- BaseSettings: Pydantic class for configuration
- @lru_cache: Settings caching for performance
```

### Production & Deployment
```
Deployment Stack:
- Docker: Containerization (multi-stage builds)
- uvicorn[standard]: Production ASGI server with extras
- gunicorn: Optional process manager for uvicorn workers
- Exec-form CMD: Docker CMD for graceful shutdown (CRITICAL)
```

### Optional Extensions
```
AI/ML Integration:
- tensorflow or pytorch: ML model serving
- numpy, pandas: Data processing and scientific computing
- scikit-learn: ML model integration
- celery: Distributed task queue for heavy processing
- redis: Caching and task queue backend
```

---

## Layered Architecture Pattern

### Project Structure
```
app/
├── core/
│   ├── config.py          # Pydantic Settings (environment variables)
│   ├── security.py        # JWT, password hashing, auth utilities
│   └── logging.py         # Structured logging configuration
├── db/
│   ├── session.py         # AsyncEngine, async_sessionmaker setup
│   ├── models/            # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── item.py
│   └── migrations/        # Alembic migration files
│       ├── env.py
│       └── versions/
├── api/
│   └── v1/
│       ├── routers/       # API endpoint definitions
│       │   ├── __init__.py
│       │   ├── users.py
│       │   └── items.py
│       ├── schemas/       # Pydantic request/response models
│       │   ├── __init__.py
│       │   ├── user.py
│       │   └── item.py
│       └── deps.py        # Shared dependencies (get_db, get_current_user)
├── services/
│   ├── user_service.py    # Business logic for users
│   └── item_service.py    # Business logic for items
├── repositories/
│   ├── user_repo.py       # Database CRUD for users
│   └── item_repo.py       # Database CRUD for items
└── main.py                # FastAPI app creation, lifespan, routers

tests/
├── conftest.py            # pytest fixtures (async_client, test_db)
├── api/
│   └── v1/
│       ├── test_users.py
│       └── test_items.py
├── services/
│   ├── test_user_service.py
│   └── test_item_service.py
└── repositories/
    ├── test_user_repo.py
    └── test_item_repo.py

Dockerfile                  # Multi-stage build with exec-form CMD
docker-compose.yml          # Local development environment
requirements.txt or pyproject.toml
alembic.ini                 # Alembic configuration
.env.example                # Environment variable template
pytest.ini or pyproject.toml  # pytest configuration
```

### Layer Responsibilities

**Routers (API Layer)**:
- HTTP endpoint definitions only
- Request/response bindings with Pydantic models
- HTTP status codes
- Dependency injection (get_db, get_current_user, services)
- OpenAPI documentation (summary, description)
- NO business logic (call services instead)

**Services (Business Logic Layer)**:
- Domain rules and use cases
- Orchestration of multiple repositories
- Transaction coordination
- Business validation
- Domain events
- NO HTTP concerns, NO database queries

**Repositories (Data Access Layer)**:
- Database CRUD operations
- SQLAlchemy async queries
- Data persistence
- Query building
- NO business logic

**Schemas (Data Transfer Objects)**:
- Pydantic v2 models for validation
- Request models (Create, Update)
- Response models (Out, List)
- Shared query/header parameters
- NO business logic

**Core (Cross-cutting Concerns)**:
- Configuration (Pydantic Settings)
- Security (JWT, password hashing)
- Logging (structured JSON)
- Middleware
- Constants

**Database (Data Layer Setup)**:
- AsyncEngine configuration
- async_sessionmaker setup
- Base model definitions
- Alembic migrations

---

## Implementation Approaches

### 1. Async-First Development

**All Endpoints Must Be Async:**
```python
from fastapi import APIRouter, Depends, status
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.v1.deps import get_db
from app.api.v1.schemas.user import UserCreate, UserOut
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])

@router.post(
    "/",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user",
    description="Create a user account with email and password.",
)
async def create_user(
    payload: UserCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = UserService(db)
    user = await service.create_user(payload)
    return user
```

**Key Points:**
- `async def` for all endpoints
- `await` for all I/O operations (database, external APIs)
- `AsyncSession` from SQLAlchemy 2.x
- `Annotated` with `Depends` for dependency injection

### 2. Request/Response Flow

**Complete Flow Example:**
```
1. Client sends POST /api/v1/users with JSON body
2. FastAPI validates JSON against UserCreate Pydantic model
3. Router injects AsyncSession via get_db dependency
4. Router calls UserService.create_user()
5. Service validates business rules
6. Service calls UserRepository.create()
7. Repository executes SQLAlchemy INSERT with AsyncSession
8. Repository commits and returns User model
9. Service transforms to UserOut Pydantic model
10. FastAPI serializes UserOut to JSON response
11. Client receives HTTP 201 with user data
```

### 3. Dependency Injection Pattern

**Database Session Dependency:**
```python
# app/db/session.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from typing import AsyncGenerator

DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/db"

engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False,
    pool_size=5,
    max_overflow=10,
)

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

**Authentication Dependency:**
```python
# app/api/v1/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import get_settings
from app.db.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        settings = get_settings()
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Fetch user from database
    user = await db.get(User, user_id)
    if user is None:
        raise credentials_exception
    return user
```

### 4. Lifespan Management

**Startup/Shutdown with Lifespan:**
```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.config import get_settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup phase
    settings = get_settings()
    app.state.settings = settings

    # Warm up database connection pool
    from app.db.session import engine
    async with engine.begin() as conn:
        # Optionally create tables or check connection
        pass

    # Load ML models if needed
    # app.state.model = load_model()

    print("Application startup complete")

    yield  # Application is running

    # Shutdown phase
    # Clean up resources
    await engine.dispose()
    print("Application shutdown complete")

app = FastAPI(
    title="My API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)
```

### 5. Pydantic v2 Schemas

**Request/Response Models:**
```python
# app/api/v1/schemas/user.py
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=100)

class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=100)

class UserUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    email: EmailStr | None = None

class UserOut(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserList(BaseModel):
    users: list[UserOut]
    total: int
    page: int
    page_size: int
```

**Key Pydantic v2 Changes:**
- `model_config = ConfigDict(from_attributes=True)` (replaces `class Config: orm_mode = True`)
- `.model_dump()` (replaces `.dict()`)
- `.model_validate()` (replaces `.parse_obj()`)
- `str | None` (Python 3.10+ union syntax)

### 6. SQLAlchemy 2.x Async Patterns

**Model Definition:**
```python
# app/db/models/user.py
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime
from datetime import datetime

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
```

**Repository Pattern:**
```python
# app/repositories/user_repo.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.user import User
from app.api.v1.schemas.user import UserCreate

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: int) -> User | None:
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def create(self, user_data: UserCreate, password_hash: str) -> User:
        user = User(
            email=user_data.email,
            name=user_data.name,
            password_hash=password_hash,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def list(self, skip: int = 0, limit: int = 100) -> list[User]:
        result = await self.db.execute(
            select(User).offset(skip).limit(limit)
        )
        return list(result.scalars().all())
```

### 7. Testing with pytest and httpx

**Test Configuration:**
```python
# conftest.py
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.main import app
from app.db.session import Base
from app.api.v1.deps import get_db

TEST_DATABASE_URL = "postgresql+asyncpg://test:test@localhost:5432/test_db"

@pytest.fixture
async def test_engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest.fixture
async def test_db(test_engine):
    TestSessionLocal = async_sessionmaker(
        bind=test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with TestSessionLocal() as session:
        yield session

@pytest.fixture
async def override_get_db(test_db):
    async def _override_get_db():
        yield test_db
    app.dependency_overrides[get_db] = _override_get_db
    yield
    app.dependency_overrides.clear()

@pytest.fixture
async def async_client(override_get_db):
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
```

**Test Example:**
```python
# tests/api/v1/test_users.py
import pytest

@pytest.mark.anyio
async def test_create_user(async_client):
    response = await async_client.post(
        "/api/v1/users",
        json={
            "email": "test@example.com",
            "name": "Test User",
            "password": "securepassword123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert "password" not in data  # Security check
    assert "id" in data
    assert "created_at" in data
```

---

## Authentication & Security Implementation

### OAuth2 Password Flow + JWT

**Token Endpoint:**
```python
# app/api/v1/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.v1.deps import get_db
from app.core.security import verify_password, create_access_token
from app.repositories.user_repo import UserRepository
from app.api.v1.schemas.auth import Token

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/token", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    repo = UserRepository(db)
    user = await repo.get_by_email(form_data.username)  # username is email

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=30),
    )

    return {"access_token": access_token, "token_type": "bearer"}
```

**Security Utilities:**
```python
# app/core/security.py
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta) -> str:
    settings = get_settings()
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret,
        algorithm="HS256",
    )
    return encoded_jwt
```

**Protected Route Example:**
```python
@router.get("/me", response_model=UserOut)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    # Check if current_user has permission to delete
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Delete user logic
    ...
```

---

## Docker Deployment Configuration

### Multi-Stage Dockerfile

**CRITICAL: Use exec-form CMD:**
```dockerfile
# Build stage
FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Copy Python dependencies from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY ./app ./app

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:80/health')"

# CRITICAL: Use exec-form CMD (NOT shell-form)
# This ensures FastAPI receives signals and lifespan hooks run properly
CMD ["fastapi", "run", "app/main.py", "--port", "80", "--host", "0.0.0.0"]

# WRONG: CMD fastapi run app/main.py --port 80
# Shell-form prevents proper signal handling and graceful shutdown
```

**Why Exec-Form is CRITICAL:**
1. **Graceful Shutdown**: Process receives SIGTERM directly for proper cleanup
2. **Lifespan Hooks**: Shutdown code in lifespan context manager executes
3. **PID 1 Problem**: FastAPI becomes PID 1, not shell wrapper
4. **Signal Propagation**: Signals properly handled by FastAPI process

### docker-compose.yml for Development

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:80"
    environment:
      - DATABASE_URL=postgresql+asyncpg://user:password@db:5432/mydb
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRATION=30
      - ENV=development
    depends_on:
      db:
        condition: service_healthy
    command: ["fastapi", "dev", "app/main.py", "--port", "80", "--host", "0.0.0.0"]
    volumes:
      - ./app:/app/app

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## Performance Optimization

### Query Optimization

**N+1 Query Prevention:**
```python
from sqlalchemy.orm import selectinload

# Bad: N+1 queries
users = await session.execute(select(User))
for user in users.scalars():
    posts = await session.execute(select(Post).where(Post.user_id == user.id))
    # This causes N+1 queries

# Good: Eager loading
result = await session.execute(
    select(User).options(selectinload(User.posts))
)
users = result.scalars().all()
for user in users:
    posts = user.posts  # Already loaded, no additional query
```

**Connection Pooling:**
```python
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,           # Default connections in pool
    max_overflow=10,        # Additional connections under load
    pool_pre_ping=True,     # Verify connections before use
    pool_recycle=3600,      # Recycle connections after 1 hour
    echo=False,             # Disable SQL logging in production
)
```

### Async I/O Optimization

**Concurrent Operations:**
```python
import asyncio

async def process_multiple_items(item_ids: list[int], db: AsyncSession):
    # Process items concurrently
    tasks = [process_item(item_id, db) for item_id in item_ids]
    results = await asyncio.gather(*tasks)
    return results
```

**Background Tasks:**
```python
from fastapi import BackgroundTasks

@router.post("/send-email")
async def send_email_endpoint(
    email: EmailSchema,
    background_tasks: BackgroundTasks,
):
    # Return immediately, send email in background
    background_tasks.add_task(send_email, email.to, email.subject, email.body)
    return {"message": "Email will be sent"}
```

---

## Related Skills and Resources

**Related Skills**:
- **fullstack-integration**: API contract design, system architecture coordination
- **frontend-nextjs**: API consumption, JWT handling, real-time integration
- **systemdev-specialist**: AI/ML model serving, scientific computing, GPU optimization
- **devops-deployment**: Docker containerization, uvicorn configuration, CI/CD pipelines
- **qa-testing**: pytest strategies, httpx testing, coverage tracking
- **backend-nestjs**: Alternative TypeScript backend, microservices coordination

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Production Examples**: See examples/ directory for comprehensive FastAPI patterns

---

This technical reference guide supports FastAPI 0.115.x+, Python 3.10+, Pydantic v2, SQLAlchemy 2.x async, and the autonomous skills-based development system.
