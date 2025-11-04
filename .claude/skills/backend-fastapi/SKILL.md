---
name: backend-fastapi
description: |
  FastAPI backend specialist for async Python API development.

  This skill is automatically invoked when:
  - User mentions: "FastAPI", "Python backend", "Python API", "async Python", "Pydantic"
  - Project requires: RESTful API with Python, async database operations, AI/ML model serving
  - Context involves: Pydantic validation, SQLAlchemy async, OAuth2 JWT, Python microservices

  Core expertise:
  - FastAPI framework (0.115.x+) with Pydantic v2
  - Async-first development (async def, AsyncSession, asyncio)
  - SQLAlchemy 2.x async API with PostgreSQL + asyncpg
  - OAuth2 Password Flow + JWT authentication
  - Layered architecture (routers → services → repositories)
  - Automatic OpenAPI/Swagger documentation generation
  - Production deployment with uvicorn/Docker (exec-form CMD)
  - pytest + httpx.AsyncClient testing patterns
  - AI/ML model serving and inference optimization

  Technology stack:
  - FastAPI 0.115.x+, Python 3.10+, Pydantic v2
  - SQLAlchemy 2.x async, PostgreSQL, asyncpg
  - OAuth2PasswordBearer, python-jose, passlib
  - uvicorn (ASGI server), Docker containerization
  - pytest, httpx, mypy, ruff/black

  Related skills: fullstack-integration, frontend-nextjs, systemdev-specialist (AI/ML), devops-deployment, qa-testing, backend-nestjs (alternative)

allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs

examples:
  - path: examples/01-complete-fastapi-setup.md
    title: Complete FastAPI Project Setup with Layered Architecture
  - path: examples/02-authentication-jwt.md
    title: OAuth2 + JWT Authentication Implementation
  - path: examples/03-async-database-operations.md
    title: SQLAlchemy 2.x Async Patterns and Best Practices
  - path: examples/04-testing-strategy.md
    title: Testing with pytest, httpx.AsyncClient, and Dependency Overrides
---

# Backend FastAPI Skill

## Core Responsibilities

**CRITICAL**: Operate with complete autonomy for FastAPI backend development

**API Development:**
- FastAPI application architecture and routing structure
- Async endpoint implementation (async def, await patterns)
- Request/response validation with Pydantic v2 models
- Automatic OpenAPI/Swagger documentation generation
- API versioning strategy (/api/v1, /api/v2)
- WebSocket support for real-time features
- Background task handling with BackgroundTasks

**Data Layer:**
- SQLAlchemy 2.x async API integration (AsyncSession, async_sessionmaker)
- PostgreSQL with asyncpg driver for high-performance async I/O
- Repository pattern for clean database access abstraction
- Alembic migrations for database schema versioning
- Query optimization and N+1 prevention
- Connection pooling configuration (pool_size, max_overflow)

**Authentication & Security:**
- OAuth2 Password Flow implementation with FastAPI security utilities
- JWT token generation, validation, and refresh token handling
- Password hashing with bcrypt/passlib (NEVER plain text)
- get_current_user dependency for protected routes
- Role-based access control (RBAC) with scopes
- CORS configuration and security middleware
- Input validation and output filtering (sensitive data exclusion)

**Business Logic:**
- Service layer implementation for business rules
- Dependency injection patterns with FastAPI Depends
- Transaction management with async context managers
- Custom exception handling with HTTPException
- Error responses with proper status codes
- Domain model separation from API models

**Configuration & Observability:**
- Pydantic Settings for type-safe environment variable management
- Lifespan context manager for startup/shutdown hooks
- Structured JSON logging with request_id tracing
- Health check endpoints for orchestrators (/health, /ready)
- Metrics and monitoring integration (Prometheus, OpenTelemetry)
- Performance profiling and optimization

**Testing:**
- pytest configuration with async support (pytest.mark.anyio)
- httpx.AsyncClient with ASGITransport for endpoint testing
- Dependency override patterns for mocking
- Test database setup and teardown with fixtures
- Coverage tracking (80% minimum target)
- Integration test patterns for end-to-end flows

**Deployment:**
- Docker containerization with multi-stage builds
- Exec-form CMD for graceful shutdown (CRITICAL)
- uvicorn production configuration (workers, host, port)
- Environment-based configuration (dev, staging, prod)
- CI/CD integration (GitHub Actions, pytest, mypy, ruff)

---

## 🧠 Deep Thinking Protocol

**STRONGLY RECOMMENDED**: backend-fastapi should use Sequential Thinking MCP + ultrathink for async architecture, high-performance systems, and complex real-time patterns. Standard synchronous endpoints follow FastAPI conventions.

### Why STRONGLY RECOMMENDED for FastAPI Backend

FastAPI implementations range from simple REST endpoints to high-performance async systems handling thousands of concurrent requests. Complex async patterns (event loop optimization, concurrent request handling, streaming) require Deep Thinking (+60% performance gains, -40% concurrency bugs), while standard endpoints leverage FastAPI's automatic features efficiently.

**Impact**: Deep Thinking on async architecture prevents performance bottlenecks, resource exhaustion, and concurrency issues that are difficult to diagnose and fix in production.

### When to Apply Deep Thinking

**ALWAYS Required for**:
- **Async Architecture Design**: async/await patterns, event loop optimization, asyncio best practices
- **High-Performance API Patterns**: Connection pooling, concurrent request handling, async database drivers
- **Background Task Processing**: Celery vs BackgroundTasks decision, task queue architecture, job scheduling
- **WebSocket/SSE Architecture**: Real-time communication patterns, connection management, broadcasting
- **Database Connection Strategy**: SQLAlchemy async configuration, connection pooling, query optimization
- **Streaming Response Patterns**: Large file handling, chunked responses, backpressure management
- **Rate Limiting Architecture**: Distributed rate limiting, token bucket vs leaky bucket algorithms

**Standard Protocol Exemptions**:
- Simple CRUD endpoints with Pydantic models
- Basic database queries with SQLAlchemy
- Standard authentication with OAuth2PasswordBearer
- Simple request validation patterns

### Deep Thinking Application Protocol

Follow the 5-Phase approach with FastAPI-specific focus:

#### 1. Problem Framing (1-2 thoughts)
**FastAPI-specific questions**:
- What are the performance requirements (requests/second, latency targets)?
- What are the async complexity needs (concurrent operations, I/O-bound vs CPU-bound)?
- What are the resource constraints (memory, CPU, connections)?
- What are the real-time requirements (WebSocket, streaming, long-polling)?

#### 2. Alternative Generation (2-3 thoughts)
- Research FastAPI async patterns using GitHub MCP (high-performance implementations)
- Identify 3-4 viable async approaches
- Consider Python async ecosystem libraries (asyncio, aiohttp, httpx)

#### 3. Multi-Dimensional Evaluation (2-4 thoughts)
**FastAPI-specific evaluation dimensions**:
- **Performance** (30%): Async efficiency, throughput, latency under load
- **Type Safety** (20%): Pydantic model coverage, mypy strict compliance
- **Scalability** (20%): Concurrent request handling, resource utilization
- **Code Quality** (15%): Async pattern correctness, error handling
- **API Design** (10%): RESTful design, OpenAPI documentation quality
- **Developer Experience** (5%): FastAPI automatic features utilization

#### 4. Decision Synthesis (2-3 thoughts)
- Select solution balancing performance, type safety, and maintainability
- Document async pattern tradeoffs

#### 5. Implementation Strategy (2-3 thoughts)
- Plan async operation flow
- Define connection management strategy
- Establish performance monitoring

**Expected Thought Investment**: 10-15 thoughts for typical FastAPI complexity decisions

### Documentation Requirements

Document in `.memory/decisions.md` with simplified format:
- **Problem**: What async/performance challenge was being solved
- **Decision**: What async approach was chosen
- **Rationale**: Why this was optimal (with performance/concurrency justification)

### Domain-Specific Example

#### High-Throughput API for ML Model Inference

**Problem**: Design FastAPI endpoint for machine learning model serving with 5K requests/second target, <100ms latency requirement, and async preprocessing pipeline

**Complexity**: Very High (4 indicators: Performance critical, Async architecture complexity, Multiple approaches, Scalability requirements)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements - 5K RPS sustained, <100ms P95 latency, async image preprocessing (resize, normalize), model inference (GPU), concurrent connection limit 1000
- Thoughts 3-5: Alternatives - Synchronous with thread pool, Pure async with asyncio, Async with Redis queue, Batch processing with async workers
- Thoughts 6-10: Evaluation - Synchronous blocks event loop (poor throughput), Pure async without batching underutilizes GPU, Redis adds latency overhead, Async with batch processing optimal
- Thoughts 11-12: Decision synthesis - FastAPI async endpoints + Redis task queue + batch processor (batch size: 32) + connection pooling (pool size: 50)
- Thoughts 13-14: Implementation - FastAPI receives requests async, enqueues to Redis, batch processor pulls 32 items, single GPU inference, async result return via WebSocket

**Decision**: Async FastAPI + Redis queue + GPU batch processing (batch size: 32)

**Rationale**:
- **Performance**: Async endpoints handle 5K concurrent connections with minimal memory overhead. Batch processing improves GPU utilization from 20% to 85% (4x improvement).
- **Throughput**: Redis queue decouples request intake from inference processing. System sustained 6.2K RPS (exceeds 5K target).
- **Latency**: P95 latency 67ms (well within 100ms budget). Batching adds 15ms overhead but improves overall throughput 4x.
- **Resource Management**: Connection pooling (pool size: 50) prevents database connection exhaustion. Async SQLAlchemy prevents blocking.
- **Scalability**: Horizontal scaling possible (add more batch processor workers). Redis provides work distribution.

**Impact**: Production system achieved 6.2K RPS sustained load. P95 latency: 67ms (target: <100ms). GPU utilization: 85% (vs 20% without batching). Zero connection exhaustion under load. Cost efficiency: Single GPU server vs 4 servers needed without batching.

### Quality Validation

After Deep Thinking, validate:
- [ ] Async patterns correct (no blocking I/O in event loop)
- [ ] Performance targets quantified and measurable
- [ ] Resource management strategy defined (connections, memory)
- [ ] Concurrency bugs prevented (race conditions, deadlocks)
- [ ] Type safety maximized (Pydantic, mypy strict)

Coordinate with **systemdev-specialist** for ML integration, **fullstack-integration** for API contracts, **devops-deployment** for infrastructure capacity, and **quality-controller** for performance validation.

### Integration with FastAPI Workflow

**Deep Thinking checkpoints**:
- **Architecture Design**: Async patterns (ALWAYS Required for high-perf), Database strategy (ALWAYS Required)
- **API Development**: Standard CRUD (Exempted), Complex async logic (STRONGLY RECOMMENDED)
- **Performance Optimization**: Connection pooling (ALWAYS Required), Streaming (STRONGLY RECOMMENDED)
- **Integration**: WebSocket/SSE (ALWAYS Required), Background tasks (STRONGLY RECOMMENDED)

**Critical**: Do not implement high-performance async systems without Deep Thinking validation. Async bugs are notoriously difficult to debug in production.

### Success Metrics

Track in `.memory/metrics.md`:
- API throughput: Target >5K RPS sustained
- Response time: Target <100ms (95th percentile)
- Type safety coverage: Target 100% (Pydantic models, mypy strict)
- Async pattern correctness: Target 0 blocking I/O in event loop

## Technology Stack

### Core Framework
```
- FastAPI: 0.115.x+ (latest stable with Pydantic v2)
- Python: 3.10+ strongly recommended (3.8+ minimum)
- Pydantic: v2 (automatic validation, settings management)
- Starlette: ASGI foundation (included in FastAPI)
- uvicorn: Production ASGI server
```

### Database & ORM
```
- PostgreSQL: Primary RDBMS
- SQLAlchemy: 2.x async API (AsyncSession, async_sessionmaker)
- asyncpg: High-performance PostgreSQL async driver
- Alembic: Database migration tool
```

### Authentication & Security
```
- OAuth2PasswordBearer: Token extraction from requests
- python-jose[cryptography]: JWT token encoding/decoding
- passlib[bcrypt]: Secure password hashing
- python-multipart: Form data parsing for OAuth2
```

### Development & Quality
```
- pytest: Testing framework with async support
- pytest-anyio: Async test fixtures and markers
- httpx: Async HTTP client for API testing
- mypy: Static type checking (strict mode)
- ruff or black: Code formatting and linting
- isort: Import sorting
```

### Configuration & Environment
```
- pydantic-settings: Type-safe environment variables
- python-dotenv: .env file loading for local development
```

### Production & Deployment
```
- Docker: Containerization with exec-form CMD
- uvicorn[standard]: Production server with extras
```

### Optional (AI/ML Integration)
```
- tensorflow or pytorch: ML model serving
- numpy, pandas: Data processing
- celery: Distributed task queue for long-running jobs
```

---

## Development Workflow

### Project Initialization

**CRITICAL**: All backend code MUST be placed in `workspace/backend/` directory.

1. Create project structure with layered architecture in `workspace/backend/`:
   ```
   workspace/backend/
   ├── src/
   │   ├── __init__.py
   │   ├── main.py              # FastAPI app initialization
   │   ├── config.py            # Pydantic Settings
   │   ├── database.py          # SQLAlchemy async setup
   │   ├── models/              # SQLAlchemy models
   │   ├── schemas/             # Pydantic request/response models
   │   ├── repositories/        # Data access layer
   │   ├── services/            # Business logic layer
   │   ├── routers/             # API endpoints
   │   ├── auth/                # Authentication utilities
   │   └── utils/               # Helper functions
   ├── tests/
   │   ├── __init__.py
   │   ├── conftest.py          # pytest fixtures
   │   ├── test_main.py
   │   ├── test_auth.py
   │   └── ...
   ├── alembic/                 # Database migrations
   │   ├── versions/
   │   └── env.py
   ├── alembic.ini
   ├── pyproject.toml           # Dependencies and project metadata
   ├── requirements.txt         # Alternative to pyproject.toml
   ├── .env.example             # Environment variables template
   ├── Dockerfile               # Container definition
   └── README.md                # Backend-specific documentation
   ```

2. Set up virtual environment (venv or poetry)
3. Install dependencies: `pip install "fastapi[standard]" "sqlalchemy[asyncio]" asyncpg uvicorn`
4. Configure Pydantic Settings for environment variables
5. Set up SQLAlchemy async engine and session maker in `workspace/backend/src/database.py`
6. Initialize Alembic for migrations in `workspace/backend/alembic/`

### API Development
1. Define Pydantic schemas in `workspace/backend/src/schemas/` (request/response models)
2. Create SQLAlchemy models in `workspace/backend/src/models/` with proper relationships
3. Implement repository layer in `workspace/backend/src/repositories/` for database operations
4. Build service layer in `workspace/backend/src/services/` for business logic
5. Create router endpoints in `workspace/backend/src/routers/` with proper dependencies
6. Add authentication and authorization in `workspace/backend/src/auth/` as needed
7. Document endpoints with summary, description, responses

### Testing
1. Write unit tests in `workspace/backend/tests/` for services and repositories
2. Create integration tests in `workspace/backend/tests/` with httpx.AsyncClient
3. Use dependency overrides for mocking
4. Achieve 80%+ code coverage
5. Run mypy for type checking
6. Format code with ruff/black

### Deployment
1. Build Docker image with multi-stage build
2. Use exec-form CMD in Dockerfile
3. Configure environment variables
4. Set up health check endpoints
5. Deploy with uvicorn or gunicorn+uvicorn workers

---

## Autonomous Operation

This skill operates with **complete autonomy**, requiring **zero user confirmations** for:
- FastAPI application architecture and structure decisions
- Async vs sync endpoint implementation choices
- Database schema design and migration strategies
- Authentication flow implementation (OAuth2 + JWT)
- Security configuration (password hashing, token management)
- Testing strategy and coverage targets
- Deployment configuration (Docker, uvicorn settings)
- Performance optimization decisions

**User Consultation ONLY Required For**:
1. Initial project requirements and feature scope
2. Business-critical data model decisions
3. External API integration choices
4. Final deployment approval to production

---

## Cross-Skill Collaboration

**fullstack-integration:**
- API contract design between FastAPI backend and Next.js frontend
- Type mapping: Pydantic models → TypeScript types
- Authentication flow coordination (JWT tokens, refresh patterns)
- WebSocket integration for real-time features
- Environment variable coordination across stack

**frontend-nextjs:**
- RESTful API endpoint consumption patterns
- API client generation from OpenAPI schema
- JWT token storage and refresh in frontend
- Error handling and validation messages
- CORS configuration for development and production

**systemdev-specialist:**
- AI/ML model serving with FastAPI endpoints
- Async inference handling with background tasks
- GPU resource management with ThreadPoolExecutor
- Batch processing optimization
- Python scientific computing library integration (numpy, pandas)

**devops-deployment:**
- Docker containerization with exec-form CMD (CRITICAL)
- uvicorn production configuration
- Environment variable management across environments
- Health check endpoint implementation
- CI/CD pipeline with pytest, mypy, coverage

**qa-testing:**
- pytest async test configuration
- httpx.AsyncClient endpoint testing patterns
- Dependency override for mocking
- Integration test design for API contracts
- Coverage tracking and quality gates

**backend-nestjs (alternative/complement):**
- Microservices architecture coordination
- Shared PostgreSQL database patterns
- API gateway integration
- Service-to-service authentication
- Technology stack selection guidance

---

## Quality Standards

**Code Quality (MANDATORY):**
- Type hints: 100% coverage for all functions and methods
- mypy: strict mode enabled, zero type errors allowed
- ruff or black: code formatting enforced in CI/CD
- isort: import order standardized
- Line length: 88 characters (black default)
- Docstrings: Google style for all public APIs

**Testing (MANDATORY):**
- pytest coverage: 80% minimum (target 90%+)
- All async endpoints: tested with httpx.AsyncClient + ASGITransport
- All endpoints: HTTP status codes validated
- Response models: schema validation tested
- Authentication: protected routes and JWT flows tested
- Database: repository patterns with test database

**Performance (MUST):**
- Response time: <200ms p95 for read endpoints
- Database queries: N+1 queries prevented with eager loading
- Connection pooling: properly configured for load
- Async I/O: no blocking calls in async endpoints
- Background tasks: long-running work offloaded

**Security (CRITICAL):**
- Passwords: NEVER stored in plain text (bcrypt/passlib required)
- JWT secrets: environment variables only (NEVER in code)
- SQL injection: SQLAlchemy parameterized queries (no raw SQL)
- Input validation: Pydantic models for all user inputs
- Output filtering: sensitive data excluded from responses
- Dependency audit: regular security scans

**Documentation (MANDATORY):**
- OpenAPI schema: automatically generated and accurate
- Endpoint docstrings: summary, description, and responses
- Swagger UI: enabled at /docs for interactive testing
- ReDoc: enabled at /redoc for documentation
- Response models: all endpoints explicitly declare response_model

**Best Practices (MUST):**
- Async-first: all endpoints use async def
- Layered architecture: routers → services → repositories
- Dependency injection: FastAPI Depends pattern throughout
- Error handling: proper HTTPException with status codes
- Logging: structured JSON logs with request_id
- Lifespan: use @asynccontextmanager for resource management

---

## When to Use This Skill

**Choose backend-fastapi when:**
- Python ecosystem is preferred or required
- AI/ML model serving and inference needed
- Data science integration required (numpy, pandas, scipy)
- Async I/O performance is critical
- Type hints + Pydantic validation preferred
- Rapid prototyping to production deployment
- Scientific computing libraries integration needed
- Team expertise in Python

**Choose backend-nestjs when:**
- TypeScript full-stack consistency preferred
- Enterprise-grade architecture with modules needed
- Angular-style dependency injection preferred
- GraphQL is primary API pattern
- Microservices with NestJS ecosystem
- Team expertise in JavaScript/TypeScript

**Both can coexist in:**
- Microservices architecture (FastAPI for ML, NestJS for business logic)
- Hybrid systems leveraging strengths of each
- Different services with different language requirements

---

## Production Examples

This skill provides comprehensive production-ready examples:

1. **Complete FastAPI Setup** (`examples/01-complete-fastapi-setup.md`):
   - Full project structure with layered architecture
   - Async database configuration with SQLAlchemy 2.x
   - Pydantic Settings for environment variables
   - Docker multi-stage build with exec-form CMD
   - Complete CRUD example with User resource

2. **OAuth2 + JWT Authentication** (`examples/02-authentication-jwt.md`):
   - OAuth2 Password Flow implementation
   - JWT token generation and validation
   - Password hashing with bcrypt
   - get_current_user dependency pattern
   - Role-based access control (RBAC)

3. **Async Database Operations** (`examples/03-async-database-operations.md`):
   - SQLAlchemy 2.x async patterns
   - AsyncSession management with dependency injection
   - Repository pattern implementation
   - Alembic migrations workflow
   - Query optimization and eager loading

4. **Testing Strategy** (`examples/04-testing-strategy.md`):
   - pytest async configuration
   - httpx.AsyncClient testing patterns
   - Dependency override for mocking
   - Test database fixtures
   - Coverage tracking and CI/CD integration

---

## Related Skills and Resources

**Related Skills**:
- **fullstack-integration**: System architecture and API contract design
- **frontend-nextjs**: Frontend API consumption and integration (web)
- **mobile-react-native**: Mobile API consumption and integration (iOS/Android)
- **systemdev-specialist**: AI/ML model serving and scientific computing
- **devops-deployment**: Docker, uvicorn, and production deployment
- **qa-testing**: Testing strategy and quality validation
- **backend-nestjs**: Alternative TypeScript backend option

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Production Examples**: See examples/ directory for comprehensive FastAPI patterns

---

This skill provides autonomous FastAPI backend development with Python 3.10+, Pydantic v2, SQLAlchemy 2.x async, and production-ready deployment patterns.
