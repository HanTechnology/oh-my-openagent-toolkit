# Complete FastAPI Project Setup

> **Demonstrates**: Full project structure with layered architecture (routers → services → repositories)
> **Technologies**: FastAPI 0.115.x+, Python 3.10+, SQLAlchemy 2.x async, PostgreSQL, Docker
> **Integration**: Pydantic Settings, lifespan management, dependency injection
> **Use when**: Starting new FastAPI project or establishing production-ready architecture

---

## Overview

This example provides a complete, production-ready FastAPI project setup with:
- Layered architecture for maintainability
- SQLAlchemy 2.x async for high-performance database access
- Pydantic v2 for request/response validation
- Docker containerization with exec-form CMD
- Complete CRUD operations

## Project Structure

```
project-root/
├── app/
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py          # Pydantic Settings
│   │   └── security.py        # Password hashing utilities
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py         # Async engine and sessionmaker
│   │   └── models/
│   │       ├── __init__.py
│   │       └── user.py        # SQLAlchemy models
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── deps.py        # Shared dependencies
│   │       ├── routers/
│   │       │   ├── __init__.py
│   │       │   └── users.py   # User endpoints
│   │       └── schemas/
│   │           ├── __init__.py
│   │           └── user.py    # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   └── user_service.py    # Business logic
│   ├── repositories/
│   │   ├── __init__.py
│   │   └── user_repo.py       # Database operations
│   └── main.py                 # FastAPI app creation
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

## Implementation

### 1. Configuration (app/core/config.py)

```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class AppSettings(BaseSettings):
    # App
    app_name: str = "FastAPI App"
    env: str = "development"
    debug: bool = False

    # Database
    database_url: str

    # Security (NEVER hardcode secrets)
    jwt_secret: str
    jwt_expiration_minutes: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

@lru_cache
def get_settings() -> AppSettings:
    return AppSettings()
```

### 2. Database Setup (app/db/session.py)

```python
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)
from sqlalchemy.orm import declarative_base
from typing import AsyncGenerator
from app.core.config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
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

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

### 3. SQLAlchemy Model (app/db/models/user.py)

```python
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, Boolean
from datetime import datetime
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### 4. Pydantic Schemas (app/api/v1/schemas/user.py)

```python
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
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserList(BaseModel):
    users: list[UserOut]
    total: int
```

### 5. Repository Layer (app/repositories/user_repo.py)

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.models.user import User
from app.api.v1.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password

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

    async def create(self, user_data: UserCreate) -> User:
        password_hash = hash_password(user_data.password)
        user = User(
            email=user_data.email,
            name=user_data.name,
            password_hash=password_hash,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update(self, user: User, update_data: UserUpdate) -> User:
        if update_data.name is not None:
            user.name = update_data.name
        if update_data.email is not None:
            user.email = update_data.email

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete(self, user: User) -> bool:
        await self.db.delete(user)
        await self.db.commit()
        return True

    async def list(self, skip: int = 0, limit: int = 100) -> tuple[list[User], int]:
        # Get total count
        count_result = await self.db.execute(select(func.count(User.id)))
        total = count_result.scalar_one()

        # Get paginated results
        result = await self.db.execute(
            select(User).offset(skip).limit(limit)
        )
        users = list(result.scalars().all())

        return users, total
```

### 6. Service Layer (app/services/user_service.py)

```python
from app.repositories.user_repo import UserRepository
from app.api.v1.schemas.user import UserCreate, UserUpdate, UserOut, UserList

class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    async def create_user(self, user_data: UserCreate) -> UserOut:
        # Business validation
        existing = await self.repo.get_by_email(user_data.email)
        if existing:
            raise ValueError("Email already registered")

        user = await self.repo.create(user_data)
        return UserOut.model_validate(user)

    async def get_user(self, user_id: int) -> UserOut | None:
        user = await self.repo.get_by_id(user_id)
        if user:
            return UserOut.model_validate(user)
        return None

    async def update_user(self, user_id: int, update_data: UserUpdate) -> UserOut:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        updated_user = await self.repo.update(user, update_data)
        return UserOut.model_validate(updated_user)

    async def delete_user(self, user_id: int) -> bool:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        return await self.repo.delete(user)

    async def list_users(self, skip: int = 0, limit: int = 100) -> UserList:
        users, total = await self.repo.list(skip, limit)
        user_outs = [UserOut.model_validate(u) for u in users]
        return UserList(users=user_outs, total=total)
```

### 7. Dependencies (app/api/v1/deps.py)

```python
from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.repositories.user_repo import UserRepository
from app.services.user_service import UserService

async def get_user_repo(
    db: Annotated[AsyncSession, Depends(get_db)]
) -> UserRepository:
    return UserRepository(db)

async def get_user_service(
    repo: Annotated[UserRepository, Depends(get_user_repo)]
) -> UserService:
    return UserService(repo)
```

### 8. Router (app/api/v1/routers/users.py)

```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Annotated
from app.api.v1.deps import get_user_service
from app.services.user_service import UserService
from app.api.v1.schemas.user import UserCreate, UserUpdate, UserOut, UserList

router = APIRouter(prefix="/users", tags=["users"])

@router.post(
    "/",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user",
    description="Create a new user account with email and password."
)
async def create_user(
    user_data: UserCreate,
    service: Annotated[UserService, Depends(get_user_service)],
):
    try:
        return await service.create_user(user_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get(
    "/{user_id}",
    response_model=UserOut,
    summary="Get user by ID",
    description="Retrieve a specific user by their ID."
)
async def get_user(
    user_id: int,
    service: Annotated[UserService, Depends(get_user_service)],
):
    user = await service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get(
    "/",
    response_model=UserList,
    summary="List users",
    description="Get a paginated list of users."
)
async def list_users(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
    service: Annotated[UserService, Depends(get_user_service)],
):
    return await service.list_users(skip=skip, limit=limit)

@router.put(
    "/{user_id}",
    response_model=UserOut,
    summary="Update user",
    description="Update user information."
)
async def update_user(
    user_id: int,
    update_data: UserUpdate,
    service: Annotated[UserService, Depends(get_user_service)],
):
    try:
        return await service.update_user(user_id, update_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user",
    description="Delete a user account."
)
async def delete_user(
    user_id: int,
    service: Annotated[UserService, Depends(get_user_service)],
):
    try:
        await service.delete_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
```

### 9. Main Application (app/main.py)

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.api.v1.routers import users
from app.db.session import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    settings = get_settings()
    app.state.settings = settings

    # Test database connection
    async with engine.begin() as conn:
        print("Database connection established")

    yield  # Application is running

    # Shutdown
    await engine.dispose()
    print("Database connection closed")

app = FastAPI(
    title="FastAPI Complete Setup",
    version="1.0.0",
    description="Production-ready FastAPI application with layered architecture",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/v1")

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
```

### 10. Security Utilities (app/core/security.py)

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

### 11. Docker Configuration

**Dockerfile**:
```dockerfile
# Build stage
FROM python:3.11-slim as builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

COPY ./app ./app

# CRITICAL: Use exec-form CMD
CMD ["fastapi", "run", "app/main.py", "--port", "80", "--host", "0.0.0.0"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:80"
    environment:
      - DATABASE_URL=postgresql+asyncpg://user:password@db:5432/mydb
      - JWT_SECRET=your-secret-key-change-in-production
    depends_on:
      db:
        condition: service_healthy

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
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### 12. Dependencies (requirements.txt)

```
fastapi[standard]>=0.115.0
sqlalchemy[asyncio]>=2.0.0
asyncpg>=0.29.0
pydantic>=2.0.0
pydantic-settings>=2.0.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.6
uvicorn[standard]>=0.24.0
```

### 13. Environment Variables (.env.example)

```
# Application
APP_NAME=FastAPI App
ENV=development
DEBUG=true

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/mydb

# Security (NEVER commit actual secrets)
JWT_SECRET=your-super-secret-jwt-key-change-me
JWT_EXPIRATION_MINUTES=30
```

## Usage

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run with FastAPI CLI (auto-reload)
fastapi dev app/main.py

# Access API
# - Swagger UI: http://localhost:8000/docs
# - ReDoc: http://localhost:8000/redoc
# - Health check: http://localhost:8000/health
```

### Docker Development

```bash
# Start services
docker-compose up --build

# Access API at http://localhost:8000
```

### Production Deployment

```bash
# Build image
docker build -t my-fastapi-app .

# Run container
docker run -d -p 80:80 \
  -e DATABASE_URL=your-db-url \
  -e JWT_SECRET=your-secret \
  my-fastapi-app
```

## Testing the API

```bash
# Create user
curl -X POST "http://localhost:8000/api/v1/users" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"securepass123"}'

# Get user
curl "http://localhost:8000/api/v1/users/1"

# List users
curl "http://localhost:8000/api/v1/users?skip=0&limit=10"

# Update user
curl -X PUT "http://localhost:8000/api/v1/users/1" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Delete user
curl -X DELETE "http://localhost:8000/api/v1/users/1"
```

## Key Takeaways

1. **Layered Architecture**: Clear separation (routers → services → repositories)
2. **Async-First**: All database operations use async/await
3. **Type Safety**: Complete type hints with mypy validation
4. **Dependency Injection**: FastAPI Depends pattern throughout
5. **Pydantic v2**: Request/response validation with `.model_validate()`
6. **SQLAlchemy 2.x**: Modern async ORM with `Mapped` types
7. **Docker Ready**: Exec-form CMD for graceful shutdown
8. **Production Best Practices**: Configuration management, security, health checks

This complete setup provides a solid foundation for any FastAPI project.
