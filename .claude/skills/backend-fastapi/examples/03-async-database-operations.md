# Example 03: SQLAlchemy 2.x Async Database Operations

> **Focus**: Comprehensive guide to async database operations with SQLAlchemy 2.x
> **Prerequisites**: Basic FastAPI knowledge, async/await understanding
> **Related Examples**: 01-complete-fastapi-setup.md, 02-authentication-jwt.md

---

## Table of Contents

1. [Database Setup and Configuration](#1-database-setup-and-configuration)
2. [SQLAlchemy 2.x Model Definitions](#2-sqlalchemy-2x-model-definitions)
3. [Async Session Management](#3-async-session-management)
4. [Repository Pattern Implementation](#4-repository-pattern-implementation)
5. [Transaction Management](#5-transaction-management)
6. [Query Optimization](#6-query-optimization)
7. [Alembic Migrations](#7-alembic-migrations)
8. [Best Practices](#8-best-practices)

---

## 1. Database Setup and Configuration

### 1.1. Dependencies

**`requirements.txt`**:
```txt
fastapi[standard]==0.115.5
sqlalchemy[asyncio]==2.0.36
asyncpg==0.30.0
alembic==1.14.0
pydantic==2.10.5
pydantic-settings==2.7.1
python-dotenv==1.0.1
```

### 1.2. Database Configuration

**`app/config/settings.py`**:
```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with database configuration."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Database configuration
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/dbname"

    # Connection pool settings
    db_pool_size: int = 5
    db_max_overflow: int = 10
    db_pool_pre_ping: bool = True
    db_echo: bool = False  # Set to True for SQL query logging

    # Connection pool timeout
    db_pool_recycle: int = 3600  # Recycle connections after 1 hour
    db_pool_timeout: int = 30  # Connection timeout in seconds


_settings: Settings | None = None


def get_settings() -> Settings:
    """Get cached settings instance."""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
```

### 1.3. AsyncEngine and Session Setup

**`app/database/engine.py`**:
```python
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config.settings import get_settings


# Global engine instance
engine: AsyncEngine | None = None
SessionLocal: async_sessionmaker[AsyncSession] | None = None


def get_engine() -> AsyncEngine:
    """
    Get or create the global async engine instance.

    Connection pool configuration:
    - pool_size: Number of persistent connections
    - max_overflow: Additional connections allowed
    - pool_pre_ping: Check connection health before use
    - pool_recycle: Recycle connections to prevent stale connections
    """
    global engine

    if engine is None:
        settings = get_settings()

        engine = create_async_engine(
            settings.database_url,
            echo=settings.db_echo,  # Log SQL queries (dev only)
            pool_size=settings.db_pool_size,  # Default: 5
            max_overflow=settings.db_max_overflow,  # Default: 10
            pool_pre_ping=settings.db_pool_pre_ping,  # Default: True
            pool_recycle=settings.db_pool_recycle,  # Default: 3600s
            pool_timeout=settings.db_pool_timeout,  # Default: 30s
        )

    return engine


def get_session_maker() -> async_sessionmaker[AsyncSession]:
    """
    Get or create the global async session maker.

    Session configuration:
    - expire_on_commit=False: Prevent automatic expiration after commit
    - autoflush=False: Manual control over flushing
    - autocommit=False: Explicit transaction control (CRITICAL)
    """
    global SessionLocal

    if SessionLocal is None:
        SessionLocal = async_sessionmaker(
            bind=get_engine(),
            class_=AsyncSession,
            expire_on_commit=False,  # Allow access after commit
            autoflush=False,  # Manual flush control
            autocommit=False,  # Manual transaction control
        )

    return SessionLocal


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for FastAPI routes to get database session.

    Usage:
        @router.get("/users")
        async def list_users(
            db: Annotated[AsyncSession, Depends(get_db)]
        ):
            ...
    """
    session_maker = get_session_maker()

    async with session_maker() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def dispose_engine() -> None:
    """
    Dispose of the global engine and close all connections.

    Call during application shutdown in lifespan manager.
    """
    global engine

    if engine is not None:
        await engine.dispose()
        engine = None
```

### 1.4. Lifespan Integration

**`app/main.py`**:
```python
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database.engine import dispose_engine, get_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.
    """
    # Startup: Initialize database connection
    engine = get_engine()

    async with engine.begin() as conn:
        print(f"Database connection established: {engine.url}")

    yield  # Application is running

    # Shutdown: Dispose of database connections
    await dispose_engine()
    print("Database connections closed")


app = FastAPI(
    title="FastAPI Async Database Example",
    version="1.0.0",
    lifespan=lifespan,
)
```

---

## 2. SQLAlchemy 2.x Model Definitions

### 2.1. Base Model with Mapped Types

**`app/database/base.py`**:
```python
from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy models.

    SQLAlchemy 2.x uses `Mapped` type annotations for type safety.
    """
    pass


class TimestampMixin:
    """
    Mixin to add created_at and updated_at timestamps to models.
    """

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
```

### 2.2. User Model with Relationships

**`app/models/user.py`**:
```python
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Boolean, Enum, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


class UserRole(str, PyEnum):
    """User role enumeration."""
    ADMIN = "admin"
    USER = "user"


class User(Base, TimestampMixin):
    """
    User model with SQLAlchemy 2.x Mapped types.

    Key features:
    - Mapped types for type safety
    - Relationships with lazy loading control
    - Indexes for query optimization
    - Enums for constrained values
    """
    __tablename__ = "users"

    # Primary key
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # Required fields
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,  # Index for frequent lookups
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    # Optional fields with defaults
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        default=UserRole.USER,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Optional nullable fields
    full_name: Mapped[str | None] = mapped_column(String(100), nullable=True)

    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    last_login: Mapped[datetime | None] = mapped_column(nullable=True)

    # Relationships (lazy loading control)
    posts: Mapped[list["Post"]] = relationship(
        "Post",
        back_populates="author",
        lazy="selectin",  # Eager load with selectinload
        cascade="all, delete-orphan",
    )

    # Composite indexes for multi-column queries
    __table_args__ = (
        Index("ix_user_email_active", "email", "is_active"),
        Index("ix_user_role_active", "role", "is_active"),
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
```

### 2.3. Post Model with Foreign Keys

**`app/models/post.py`**:
```python
from sqlalchemy import Boolean, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


class Post(Base, TimestampMixin):
    """
    Post model with foreign key relationship to User.
    """
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)

    content: Mapped[str] = mapped_column(Text, nullable=False)

    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Foreign key with explicit constraint name
    author_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Relationship (lazy loading control)
    author: Mapped["User"] = relationship(
        "User",
        back_populates="posts",
        lazy="joined",  # Eager load with joinedload
    )

    # Indexes for common queries
    __table_args__ = (
        Index("ix_post_author_published", "author_id", "is_published"),
        Index("ix_post_created", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Post(id={self.id}, title={self.title}, author_id={self.author_id})>"


class Comment(Base, TimestampMixin):
    """
    Comment model with foreign keys to User and Post.
    """
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    content: Mapped[str] = mapped_column(Text, nullable=False)

    # Foreign keys
    post_id: Mapped[int] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    author_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Composite index for common query pattern
    __table_args__ = (
        Index("ix_comment_post_author", "post_id", "author_id"),
    )

    def __repr__(self) -> str:
        return f"<Comment(id={self.id}, post_id={self.post_id}, author_id={self.author_id})>"
```

---

## 3. Async Session Management

### 3.1. Session Dependency

**`app/dependencies/database.py`**:
```python
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.engine import get_db


# Type alias for dependency injection
DatabaseSession = Annotated[AsyncSession, Depends(get_db)]
```

### 3.2. Using Sessions in Routes

**`app/routers/users.py`**:
```python
from fastapi import APIRouter, HTTPException, status

from app.dependencies.database import DatabaseSession
from app.schemas.user import UserCreate, UserOut
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    db: DatabaseSession,  # Type alias with Annotated
) -> UserOut:
    """
    Create a new user.

    Session is automatically provided by FastAPI dependency injection.
    Session is automatically closed after request completes.
    """
    service = UserService(db)

    user = await service.create_user(payload)

    return UserOut.model_validate(user)


@router.get("/{user_id}", response_model=UserOut)
async def get_user(
    user_id: int,
    db: DatabaseSession,
) -> UserOut:
    """
    Get user by ID.
    """
    service = UserService(db)

    user = await service.get_user(user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found",
        )

    return UserOut.model_validate(user)
```

---

## 4. Repository Pattern Implementation

### 4.1. Base Repository

**`app/repositories/base_repository.py`**:
```python
from typing import Any, Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """
    Base repository with common CRUD operations.

    Generic type ModelType ensures type safety for all operations.
    """

    def __init__(self, model: type[ModelType], db: AsyncSession):
        """
        Initialize repository with model type and database session.

        Args:
            model: SQLAlchemy model class
            db: Async database session
        """
        self.model = model
        self.db = db

    async def get_by_id(self, id: Any) -> ModelType | None:
        """
        Get a single record by primary key.

        Returns None if not found.
        """
        return await self.db.get(self.model, id)

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list[ModelType]:
        """
        Get all records with pagination.

        Args:
            skip: Number of records to skip (offset)
            limit: Maximum number of records to return

        Returns:
            List of model instances
        """
        stmt = select(self.model).offset(skip).limit(limit)

        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def create(self, **kwargs: Any) -> ModelType:
        """
        Create a new record.

        Args:
            **kwargs: Model field values

        Returns:
            Created model instance
        """
        instance = self.model(**kwargs)

        self.db.add(instance)
        await self.db.flush()  # Flush to get generated ID
        await self.db.refresh(instance)  # Refresh to get default values

        return instance

    async def update(
        self,
        instance: ModelType,
        **kwargs: Any,
    ) -> ModelType:
        """
        Update an existing record.

        Args:
            instance: Model instance to update
            **kwargs: Fields to update

        Returns:
            Updated model instance
        """
        for key, value in kwargs.items():
            setattr(instance, key, value)

        await self.db.flush()
        await self.db.refresh(instance)

        return instance

    async def delete(self, instance: ModelType) -> None:
        """
        Delete a record.

        Args:
            instance: Model instance to delete
        """
        await self.db.delete(instance)
        await self.db.flush()

    async def count(self) -> int:
        """
        Count total records.

        Returns:
            Total record count
        """
        from sqlalchemy import func

        stmt = select(func.count()).select_from(self.model)

        result = await self.db.execute(stmt)

        return result.scalar_one()
```

### 4.2. User Repository

**`app/repositories/user_repository.py`**:
```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user import User, UserRole
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    """
    User repository with specific query methods.
    """

    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> User | None:
        """
        Get user by email address.

        Returns None if not found.
        """
        stmt = select(User).where(User.email == email)

        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def get_by_username(self, username: str) -> User | None:
        """
        Get user by username.

        Returns None if not found.
        """
        stmt = select(User).where(User.username == username)

        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def get_by_role(
        self,
        role: UserRole,
        skip: int = 0,
        limit: int = 100,
    ) -> list[User]:
        """
        Get users by role with pagination.
        """
        stmt = (
            select(User)
            .where(User.role == role)
            .offset(skip)
            .limit(limit)
        )

        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_active_users(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list[User]:
        """
        Get active users with pagination.
        """
        stmt = (
            select(User)
            .where(User.is_active == True)
            .offset(skip)
            .limit(limit)
        )

        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_with_posts(self, user_id: int) -> User | None:
        """
        Get user with eagerly loaded posts.

        Uses selectinload to prevent N+1 query problem.
        """
        stmt = (
            select(User)
            .where(User.id == user_id)
            .options(selectinload(User.posts))
        )

        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def email_exists(self, email: str) -> bool:
        """
        Check if email already exists.

        Returns True if email exists, False otherwise.
        """
        user = await self.get_by_email(email)
        return user is not None

    async def username_exists(self, username: str) -> bool:
        """
        Check if username already exists.

        Returns True if username exists, False otherwise.
        """
        user = await self.get_by_username(username)
        return user is not None
```

### 4.3. Post Repository

**`app/repositories/post_repository.py`**:
```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.models.post import Post
from app.repositories.base_repository import BaseRepository


class PostRepository(BaseRepository[Post]):
    """
    Post repository with specific query methods.
    """

    def __init__(self, db: AsyncSession):
        super().__init__(Post, db)

    async def get_by_author(
        self,
        author_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Post]:
        """
        Get posts by author with pagination.
        """
        stmt = (
            select(Post)
            .where(Post.author_id == author_id)
            .offset(skip)
            .limit(limit)
        )

        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_published(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Post]:
        """
        Get published posts with pagination.
        """
        stmt = (
            select(Post)
            .where(Post.is_published == True)
            .offset(skip)
            .limit(limit)
        )

        result = await self.db.execute(stmt)

        return list(result.scalars().all())

    async def get_with_author(self, post_id: int) -> Post | None:
        """
        Get post with eagerly loaded author.

        Uses joinedload for one-to-one relationship.
        """
        stmt = (
            select(Post)
            .where(Post.id == post_id)
            .options(joinedload(Post.author))
        )

        result = await self.db.execute(stmt)

        return result.scalar_one_or_none()

    async def search_by_title(
        self,
        search_term: str,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Post]:
        """
        Search posts by title (case-insensitive).
        """
        stmt = (
            select(Post)
            .where(Post.title.ilike(f"%{search_term}%"))
            .offset(skip)
            .limit(limit)
        )

        result = await self.db.execute(stmt)

        return list(result.scalars().all())
```

---

## 5. Transaction Management

### 5.1. Manual Transaction Control

**`app/services/user_service.py`**:
```python
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate
from app.security.password import hash_password


class UserService:
    """
    User service with business logic and transaction management.
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = UserRepository(db)

    async def create_user(self, payload: UserCreate) -> User:
        """
        Create a new user with transaction management.

        Transaction is automatically managed by FastAPI dependency.
        If exception occurs, transaction is rolled back automatically.
        """
        # Check if email exists
        if await self.repository.email_exists(payload.email):
            raise ValueError(f"Email {payload.email} already exists")

        # Check if username exists
        if await self.repository.username_exists(payload.username):
            raise ValueError(f"Username {payload.username} already exists")

        # Hash password
        password_hash = hash_password(payload.password)

        # Create user
        user = await self.repository.create(
            email=payload.email,
            username=payload.username,
            password_hash=password_hash,
            full_name=payload.full_name,
            bio=payload.bio,
        )

        # Commit is handled by FastAPI dependency
        await self.db.commit()

        return user

    async def update_user(
        self,
        user_id: int,
        payload: UserUpdate,
    ) -> User:
        """
        Update user with transaction management.
        """
        user = await self.repository.get_by_id(user_id)

        if user is None:
            raise ValueError(f"User with id {user_id} not found")

        # Build update data
        update_data = payload.model_dump(exclude_unset=True)

        # Update user
        user = await self.repository.update(user, **update_data)

        await self.db.commit()

        return user

    async def delete_user(self, user_id: int) -> None:
        """
        Delete user with transaction management.
        """
        user = await self.repository.get_by_id(user_id)

        if user is None:
            raise ValueError(f"User with id {user_id} not found")

        await self.repository.delete(user)

        await self.db.commit()
```

### 5.2. Explicit Transaction Context

**`app/services/post_service.py`**:
```python
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.post import Post
from app.repositories.post_repository import PostRepository
from app.repositories.user_repository import UserRepository
from app.schemas.post import PostCreate


class PostService:
    """
    Post service with explicit transaction management.
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self.post_repository = PostRepository(db)
        self.user_repository = UserRepository(db)

    async def create_post_with_notification(
        self,
        author_id: int,
        payload: PostCreate,
    ) -> Post:
        """
        Create post and update user stats in a single transaction.

        Uses explicit transaction context for complex operations.
        """
        # Explicit transaction boundary
        async with self.db.begin():
            # Verify author exists
            author = await self.user_repository.get_by_id(author_id)

            if author is None:
                raise ValueError(f"Author with id {author_id} not found")

            # Create post
            post = await self.post_repository.create(
                title=payload.title,
                content=payload.content,
                author_id=author_id,
            )

            # Update user's last activity (example of multi-table transaction)
            from datetime import datetime
            author = await self.user_repository.update(
                author,
                last_login=datetime.utcnow(),
            )

            # If exception occurs here, both operations are rolled back

            # Transaction is committed automatically when exiting context

        return post

    async def bulk_publish_posts(self, post_ids: list[int]) -> list[Post]:
        """
        Publish multiple posts in a single transaction.

        If any operation fails, all changes are rolled back.
        """
        async with self.db.begin():
            posts = []

            for post_id in post_ids:
                post = await self.post_repository.get_by_id(post_id)

                if post is None:
                    raise ValueError(f"Post with id {post_id} not found")

                post = await self.post_repository.update(
                    post,
                    is_published=True,
                )

                posts.append(post)

            # All updates committed together

        return posts
```

### 5.3. Nested Transaction (Savepoints)

**`app/services/complex_service.py`**:
```python
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.post_repository import PostRepository
from app.repositories.user_repository import UserRepository


class ComplexService:
    """
    Service demonstrating nested transactions with savepoints.
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repository = UserRepository(db)
        self.post_repository = PostRepository(db)

    async def complex_operation_with_savepoint(
        self,
        user_id: int,
        post_data: dict,
    ) -> tuple:
        """
        Complex operation with nested transactions.

        Uses savepoint to partially rollback on error.
        """
        # Main transaction
        async with self.db.begin():
            # First operation: Update user
            user = await self.user_repository.get_by_id(user_id)

            if user is None:
                raise ValueError(f"User with id {user_id} not found")

            user = await self.user_repository.update(user, is_active=True)

            # Nested transaction (savepoint)
            async with self.db.begin_nested():
                try:
                    # Second operation: Create post (might fail)
                    post = await self.post_repository.create(
                        author_id=user_id,
                        **post_data,
                    )
                except Exception as e:
                    # Savepoint is rolled back, but user update remains
                    print(f"Post creation failed: {e}")
                    post = None

            # Main transaction continues
            # User update is committed even if post creation failed

        return user, post
```

---

## 6. Query Optimization

### 6.1. N+1 Query Prevention

**`app/repositories/optimized_queries.py`**:
```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.models.post import Post
from app.models.user import User


class OptimizedQueries:
    """
    Examples of optimized queries preventing N+1 problems.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_users_with_posts_bad(self) -> list[User]:
        """
        BAD EXAMPLE: N+1 query problem.

        - 1 query to get users
        - N queries to get posts for each user

        Total queries: 1 + N
        """
        stmt = select(User)
        result = await self.db.execute(stmt)
        users = list(result.scalars().all())

        # Each access to user.posts triggers a separate query
        for user in users:
            print(f"{user.username} has {len(user.posts)} posts")  # N queries!

        return users

    async def get_users_with_posts_good(self) -> list[User]:
        """
        GOOD EXAMPLE: Eager loading with selectinload.

        - 1 query to get users
        - 1 query to get all related posts

        Total queries: 2 (constant, not N+1)
        """
        stmt = select(User).options(selectinload(User.posts))

        result = await self.db.execute(stmt)
        users = list(result.scalars().all())

        # No additional queries needed
        for user in users:
            print(f"{user.username} has {len(user.posts)} posts")  # Already loaded!

        return users

    async def get_posts_with_authors_good(self) -> list[Post]:
        """
        GOOD EXAMPLE: Eager loading with joinedload for many-to-one.

        - 1 query with JOIN

        Total queries: 1
        """
        stmt = select(Post).options(joinedload(Post.author))

        result = await self.db.execute(stmt)
        posts = list(result.scalars().unique().all())  # unique() for joined queries

        # No additional queries needed
        for post in posts:
            print(f"{post.title} by {post.author.username}")  # Already loaded!

        return posts

    async def get_users_with_multiple_relations(self) -> list[User]:
        """
        GOOD EXAMPLE: Multiple eager loads.

        Loads users with all their posts eagerly.
        """
        stmt = (
            select(User)
            .options(
                selectinload(User.posts),  # Load posts
            )
        )

        result = await self.db.execute(stmt)

        return list(result.scalars().all())
```

### 6.2. Pagination with Count

**`app/repositories/pagination.py`**:
```python
from dataclasses import dataclass

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


@dataclass
class PaginatedResult:
    """Paginated result with metadata."""
    items: list
    total: int
    page: int
    page_size: int
    total_pages: int


class PaginationRepository:
    """
    Repository with optimized pagination.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_users_paginated(
        self,
        page: int = 1,
        page_size: int = 10,
    ) -> PaginatedResult:
        """
        Get paginated users with total count.

        Optimized: Count and data queries executed in parallel.
        """
        # Calculate offset
        offset = (page - 1) * page_size

        # Count query
        count_stmt = select(func.count()).select_from(User)

        # Data query
        data_stmt = select(User).offset(offset).limit(page_size)

        # Execute both queries (SQLAlchemy executes them sequentially)
        count_result = await self.db.execute(count_stmt)
        data_result = await self.db.execute(data_stmt)

        # Get results
        total = count_result.scalar_one()
        items = list(data_result.scalars().all())

        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size

        return PaginatedResult(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
```

### 6.3. Filtering and Sorting

**`app/repositories/filtering.py`**:
```python
from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole


class FilteringRepository:
    """
    Repository with advanced filtering and sorting.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_filtered_users(
        self,
        role: UserRole | None = None,
        is_active: bool | None = None,
        search: str | None = None,
        sort_by: str = "created_at",
        sort_desc: bool = True,
        skip: int = 0,
        limit: int = 100,
    ) -> list[User]:
        """
        Get users with advanced filtering and sorting.
        """
        # Build base query
        stmt = select(User)

        # Apply filters
        filters = []

        if role is not None:
            filters.append(User.role == role)

        if is_active is not None:
            filters.append(User.is_active == is_active)

        if search:
            # Search in username, email, or full_name
            search_filters = [
                User.username.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%"),
                User.full_name.ilike(f"%{search}%"),
            ]
            filters.append(or_(*search_filters))

        # Apply all filters
        if filters:
            stmt = stmt.where(and_(*filters))

        # Apply sorting
        sort_column = getattr(User, sort_by, User.created_at)

        if sort_desc:
            stmt = stmt.order_by(sort_column.desc())
        else:
            stmt = stmt.order_by(sort_column.asc())

        # Apply pagination
        stmt = stmt.offset(skip).limit(limit)

        # Execute query
        result = await self.db.execute(stmt)

        return list(result.scalars().all())
```

---

## 7. Alembic Migrations

### 7.1. Alembic Configuration

**`alembic.ini`**:
```ini
[alembic]
script_location = alembic
file_template = %%(year)d%%(month).2d%%(day).2d_%%(hour).2d%%(minute).2d_%%(slug)s
prepend_sys_path = .
version_path_separator = os

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

### 7.2. Async Environment Configuration

**`alembic/env.py`**:
```python
import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Import your models and Base
from app.database.base import Base
from app.models.user import User  # noqa
from app.models.post import Post, Comment  # noqa

# Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    This configures the context with just a URL and not an Engine.
    """
    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """Execute migrations with connection."""
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """
    Run migrations in 'online' mode with async engine.

    CRITICAL: Use async_engine_from_config for async migrations.
    """
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.
    """
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

### 7.3. Migration Workflow

**Create initial migration**:
```bash
# Set database URL in alembic.ini or environment variable
export DATABASE_URL="postgresql+asyncpg://user:password@localhost:5432/dbname"

# Generate initial migration
alembic revision --autogenerate -m "Initial migration"

# Review generated migration file in alembic/versions/

# Apply migration
alembic upgrade head
```

**Example migration file** (`alembic/versions/20250128_1234_initial_migration.py`):
```python
"""Initial migration

Revision ID: abc123
Revises:
Create Date: 2025-01-28 12:34:56.789012

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'abc123'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade database schema."""
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('username', sa.String(length=50), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('ADMIN', 'USER', name='userrole'), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('last_login', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_index('ix_user_email_active', 'users', ['email', 'is_active'], unique=False)
    op.create_index('ix_user_role_active', 'users', ['role', 'is_active'], unique=False)

    # Create posts table
    op.create_table(
        'posts',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('is_published', sa.Boolean(), nullable=False),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index(op.f('ix_posts_author_id'), 'posts', ['author_id'], unique=False)
    op.create_index('ix_post_author_published', 'posts', ['author_id', 'is_published'], unique=False)
    op.create_index('ix_post_created', 'posts', ['created_at'], unique=False)


def downgrade() -> None:
    """Downgrade database schema."""
    op.drop_index('ix_post_created', table_name='posts')
    op.drop_index('ix_post_author_published', table_name='posts')
    op.drop_index(op.f('ix_posts_author_id'), table_name='posts')
    op.drop_table('posts')

    op.drop_index('ix_user_role_active', table_name='users')
    op.drop_index('ix_user_email_active', table_name='users')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
```

**Common Alembic commands**:
```bash
# Create new migration
alembic revision --autogenerate -m "Add column to users"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show current revision
alembic current

# Show migration history
alembic history --verbose

# Rollback to specific revision
alembic downgrade abc123

# Apply specific migration
alembic upgrade abc123
```

---

## 8. Best Practices

### 8.1. Connection Pool Management

**Key Settings**:
```python
# Optimal connection pool settings
pool_size=5           # Number of persistent connections
max_overflow=10       # Additional connections allowed
pool_pre_ping=True    # Check connection health before use
pool_recycle=3600     # Recycle connections after 1 hour
pool_timeout=30       # Connection timeout in seconds
```

**Best Practices**:
- Set `pool_size` based on concurrent request load
- Use `pool_pre_ping=True` to handle stale connections
- Set `pool_recycle` to prevent long-lived connection issues
- Monitor connection usage with application metrics

### 8.2. Query Performance

**Do**:
- ✅ Use eager loading (`selectinload`, `joinedload`) to prevent N+1 queries
- ✅ Add indexes for frequently queried columns
- ✅ Use composite indexes for multi-column queries
- ✅ Paginate large result sets
- ✅ Use `scalar_one_or_none()` for single results
- ✅ Use `scalars().all()` for lists

**Don't**:
- ❌ Access relationships without eager loading (triggers N+1 queries)
- ❌ Use `all()` without pagination on large tables
- ❌ Create indexes on every column (index overhead)
- ❌ Use raw SQL unless absolutely necessary

### 8.3. Transaction Management

**Do**:
- ✅ Let FastAPI dependency handle transaction for simple operations
- ✅ Use `async with db.begin()` for explicit transaction control
- ✅ Use savepoints (`begin_nested()`) for partial rollback scenarios
- ✅ Commit explicitly with `await db.commit()`
- ✅ Rollback automatically handled by FastAPI on exceptions

**Don't**:
- ❌ Use `autocommit=True` (explicit transaction control required)
- ❌ Forget to commit after modifications
- ❌ Access expired objects after commit (set `expire_on_commit=False`)

### 8.4. Model Design

**Do**:
- ✅ Use `Mapped` types for type safety (SQLAlchemy 2.x)
- ✅ Add indexes for foreign keys
- ✅ Use composite indexes for multi-column queries
- ✅ Use `TimestampMixin` for audit trails
- ✅ Define explicit cascade rules for relationships
- ✅ Use Enums for constrained values

**Don't**:
- ❌ Use string annotations without `Mapped`
- ❌ Forget to set `nullable=False` for required fields
- ❌ Use bidirectional relationships without `back_populates`
- ❌ Access relationships without specifying `lazy` strategy

### 8.5. Testing

**`tests/test_database.py`**:
```python
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.database.base import Base
from app.models.user import User


# Test database URL
TEST_DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/test_db"


@pytest.fixture(scope="function")
async def db_session() -> AsyncSession:
    """
    Fixture for test database session.

    Creates tables before test and drops after test.
    """
    # Create test engine
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create session
    SessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async with SessionLocal() as session:
        yield session

    # Drop tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest.mark.anyio
async def test_create_user(db_session: AsyncSession):
    """Test user creation."""
    user = User(
        email="test@example.com",
        username="testuser",
        password_hash="hashed_password",
    )

    db_session.add(user)
    await db_session.commit()

    assert user.id is not None
    assert user.email == "test@example.com"
```

---

## Summary

This example demonstrates:

1. **Database Setup**: AsyncEngine, session management, connection pooling
2. **SQLAlchemy 2.x Models**: Mapped types, relationships, indexes
3. **Async Session Management**: Dependency injection, automatic cleanup
4. **Repository Pattern**: Base repository, specific repositories, type safety
5. **Transaction Management**: Manual commits, explicit contexts, savepoints
6. **Query Optimization**: N+1 prevention, eager loading, pagination
7. **Alembic Migrations**: Async configuration, migration workflow
8. **Best Practices**: Performance, security, testing

**Key Takeaways**:
- Always use `Mapped` types for type safety
- Prevent N+1 queries with eager loading (`selectinload`, `joinedload`)
- Configure connection pooling appropriately
- Use explicit transaction control for complex operations
- Add indexes for frequently queried columns
- Use Alembic for all schema changes
- Test with isolated database sessions

For more examples, see:
- `01-complete-fastapi-setup.md`: Full project structure
- `02-authentication-jwt.md`: OAuth2 and JWT authentication
- `04-testing-strategy.md`: Comprehensive testing patterns
