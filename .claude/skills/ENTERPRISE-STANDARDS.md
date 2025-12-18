# Enterprise Standards - Cross-Skill Reference

**Version**: 1.0.0
**Last Updated**: 2025-01-18
**Status**: Normative

This document defines enterprise-grade quality standards referenced by all development skills.
Each skill's SKILL.md references this via `See: ENTERPRISE-STANDARDS.md#section-name`.

---

## 1. Code Conventions {#code-conventions}

### 1.1 Naming Conventions

#### TypeScript/JavaScript (Frontend, NestJS)

| Type | Convention | Example |
|------|------------|---------|
| **Files** | kebab-case | `user-profile.component.tsx` |
| **Components** | PascalCase | `UserProfile` |
| **Functions** | camelCase | `getUserById` |
| **Constants** | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| **Interfaces** | PascalCase (no I prefix) | `UserProfile` |
| **Types** | PascalCase | `ApiResponse<T>` |
| **Enums** | PascalCase (members: PascalCase) | `UserRole.Admin` |
| **Private fields** | Leading underscore | `_internalState` |

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  fullName: string;
  createdAt: Date;
}

const MAX_RETRY_COUNT = 3;

function getUserById(userId: string): Promise<UserProfile> { ... }

// ❌ Bad
interface IUserProfile { ... }  // No I prefix
const maxRetryCount = 3;        // Constants should be SCREAMING_SNAKE
function GetUserById() { ... }  // Functions should be camelCase
```

#### Python (FastAPI, System Dev)

| Type | Convention | Example |
|------|------------|---------|
| **Files** | snake_case | `user_service.py` |
| **Classes** | PascalCase | `UserService` |
| **Functions** | snake_case | `get_user_by_id` |
| **Constants** | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| **Variables** | snake_case | `user_profile` |
| **Private** | Leading underscore | `_internal_method` |

```python
# ✅ Good
MAX_RETRY_COUNT = 3

class UserService:
    def get_user_by_id(self, user_id: str) -> UserProfile:
        ...

# ❌ Bad
class userService:  # Classes should be PascalCase
    def GetUserById(self):  # Functions should be snake_case
```

#### SQL/Database

| Type | Convention | Example |
|------|------------|---------|
| **Tables** | snake_case (plural) | `user_profiles` |
| **Columns** | snake_case | `created_at` |
| **Primary Keys** | `id` or `table_id` | `id`, `user_id` |
| **Foreign Keys** | `referenced_table_id` | `user_id`, `order_id` |
| **Indexes** | `idx_table_column(s)` | `idx_users_email` |
| **Constraints** | `type_table_column` | `pk_users_id`, `fk_orders_user` |

```sql
-- ✅ Good
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- ❌ Bad
CREATE TABLE UserProfile (  -- Should be snake_case plural
    ID UUID,                -- Should be lowercase
    CreatedAt TIMESTAMP     -- Should be snake_case
);
```

### 1.2 File Structure

#### Frontend (Next.js)

```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── loading.tsx
│   └── api/               # API routes
├── components/
│   ├── ui/                # Base UI components (buttons, inputs)
│   │   ├── button.tsx
│   │   └── input.tsx
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, API clients
├── types/                 # TypeScript types
└── styles/                # Global styles
```

#### Backend (NestJS)

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/
│   │   └── strategies/
│   └── users/
│       ├── users.module.ts
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── entities/
│       │   └── user.entity.ts
│       └── dto/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
└── main.ts
```

#### Backend (FastAPI)

```
src/
├── api/
│   ├── v1/
│   │   ├── endpoints/
│   │   │   ├── auth.py
│   │   │   └── users.py
│   │   └── router.py
│   └── deps.py            # Dependencies
├── core/
│   ├── config.py
│   ├── security.py
│   └── exceptions.py
├── models/                # SQLAlchemy models
├── schemas/               # Pydantic schemas
├── services/              # Business logic
├── repositories/          # Data access layer
└── main.py
```

### 1.3 Import Order

Follow this order in all languages:

1. **Standard library** imports
2. **Third-party** imports
3. **Local application** imports (absolute)
4. **Relative** imports

Insert blank line between each group.

#### TypeScript

```typescript
// 1. Node built-ins (rare in frontend)
import { readFile } from 'fs';

// 2. Third-party packages
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 3. Local absolute imports
import { AppConfig } from '@/config/app.config';
import { UserEntity } from '@/modules/users/entities/user.entity';

// 4. Relative imports
import { CreateUserDto } from './dto/create-user.dto';
import { USER_CONSTANTS } from './constants';
```

#### Python

```python
# 1. Standard library
import os
from datetime import datetime
from typing import Optional

# 2. Third-party
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# 3. Local application
from app.core.config import settings
from app.core.security import get_password_hash

# 4. Relative
from .schemas import UserCreate, UserResponse
from .service import UserService
```

---

## 2. Type Safety {#type-safety}

### 2.1 TypeScript Strict Mode

**MANDATORY**: All TypeScript projects MUST enable strict mode.

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Prohibited Patterns**:

```typescript
// ❌ NEVER use these
const data = response as any;           // Type assertion to any
// @ts-ignore                           // Ignoring type errors
// @ts-expect-error                     // Expecting type errors
const value: any = getValue();          // Explicit any type

// ✅ Use proper typing
const data: ApiResponse<User> = response;
const value: unknown = getValue();      // Use unknown, then narrow
```

### 2.2 Python Type Hints

**MANDATORY**: 100% type hint coverage with mypy strict mode.

```python
# pyproject.toml or mypy.ini
[tool.mypy]
python_version = "3.11"
strict = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
no_implicit_optional = true
```

```python
# ✅ Good
def get_user_by_id(user_id: str) -> Optional[User]:
    ...

async def create_user(data: UserCreate) -> User:
    ...

# ❌ Bad
def get_user_by_id(user_id):  # Missing type hints
    ...
```

---

## 3. Error Handling {#error-handling}

### 3.1 Frontend Error Handling

#### React Error Boundaries

```typescript
// components/error-boundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Send to error tracking service (Sentry, etc.)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorFallback />;
    }
    return this.props.children;
  }
}
```

#### API Error Handling

```typescript
// lib/api-client.ts
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

class ApiClient {
  async request<T>(config: RequestConfig): Promise<T> {
    try {
      const response = await fetch(config.url, config.options);
      
      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new ApiException(error.code, error.message, response.status);
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      // Network error or other unexpected error
      throw new ApiException('NETWORK_ERROR', 'Network request failed', 0);
    }
  }
}
```

### 3.2 Backend Error Handling

#### NestJS Exception Filters

```typescript
// common/filters/http-exception.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, body } = this.getErrorResponse(exception);

    this.logger.error({
      message: body.message,
      path: request.url,
      method: request.method,
      statusCode: status,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(body);
  }

  private getErrorResponse(exception: unknown): { status: number; body: ErrorResponse } {
    if (exception instanceof HttpException) {
      return {
        status: exception.getStatus(),
        body: {
          code: exception.name,
          message: exception.message,
          timestamp: new Date().toISOString(),
        },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
```

#### FastAPI Exception Handlers

```python
# core/exceptions.py
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

class AppException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code

async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.error(f"{exc.code}: {exc.message}", extra={
        "path": request.url.path,
        "method": request.method,
    })
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.code,
            "message": exc.message,
            "timestamp": datetime.utcnow().isoformat(),
        }
    )

# main.py
app.add_exception_handler(AppException, app_exception_handler)
```

### 3.3 Error Response Format

All APIs use the same error response format:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "timestamp": "2025-01-18T12:00:00.000Z",
  "details": {
    "field": "email",
    "reason": "Invalid email format"
  }
}
```

---

## 4. Testing Standards {#testing-standards}

### 4.1 Test Coverage Targets

| Test Type | Minimum | Target | Critical Paths |
|-----------|---------|--------|----------------|
| Unit Tests | 70% | 80% | 90% |
| Integration Tests | 60% | 70% | 80% |
| E2E Tests | Critical paths | Core flows | 100% |

### 4.2 Test File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Unit | `*.spec.ts` / `*_test.py` | `user.service.spec.ts` |
| Integration | `*.integration.spec.ts` | `auth.integration.spec.ts` |
| E2E | `*.e2e.spec.ts` | `login.e2e.spec.ts` |

### 4.3 Test Structure (AAA Pattern)

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Arrange
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      // Act
      const result = await userService.createUser(createDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(createDto.email);
      expect(result.id).toBeDefined();
    });

    it('should throw ConflictException for duplicate email', async () => {
      // Arrange
      const existingUser = await createTestUser();

      // Act & Assert
      await expect(
        userService.createUser({ email: existingUser.email, password: 'pass' })
      ).rejects.toThrow(ConflictException);
    });
  });
});
```

### 4.4 Test Isolation

- Each test must be independently runnable
- No shared state between tests
- Database tests use transaction rollback or test DB
- External services must be mocked

---

## 5. Logging Standards {#logging-standards}

### 5.1 Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| **ERROR** | Immediate action required | Database connection failed |
| **WARN** | Potential issue, needs monitoring | High memory usage detected |
| **INFO** | Key business events | User registered, Order placed |
| **DEBUG** | Development/debugging info | Function parameters, intermediate state |

### 5.2 Structured Logging Format

All logs use structured JSON format:

```json
{
  "timestamp": "2025-01-18T12:00:00.000Z",
  "level": "INFO",
  "service": "user-service",
  "message": "User registered",
  "context": {
    "userId": "uuid-123",
    "email": "user@example.com",
    "method": "POST",
    "path": "/api/users",
    "duration": 45
  },
  "traceId": "abc-123-xyz"
}
```

### 5.3 Logging Implementation

#### NestJS

```typescript
// common/interceptors/logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log({
          message: `${method} ${url}`,
          method,
          path: url,
          duration,
          statusCode: context.switchToHttp().getResponse().statusCode,
        });
      }),
    );
  }
}
```

#### FastAPI

```python
# core/logging.py
import logging
import json
from datetime import datetime

class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "service": "api-service",
            "message": record.getMessage(),
            "module": record.module,
        }
        if hasattr(record, "extra"):
            log_data["context"] = record.extra
        return json.dumps(log_data)

# Usage
logger = logging.getLogger(__name__)
logger.info("User registered", extra={"userId": user.id, "email": user.email})
```

### 5.4 Sensitive Data

**NEVER include in logs:**

- Passwords, API keys, tokens
- PII (SSN, credit card numbers)
- Authentication credentials

```typescript
// ✅ Good
logger.log({ userId: user.id, email: maskEmail(user.email) });

// ❌ Bad
logger.log({ user: user }); // May contain password hash, tokens, etc.
```

---

## 6. Git Conventions {#git-conventions}

### 6.1 Branch Naming

```
<type>/<ticket>-<short-description>
```

| Type | Usage | Example |
|------|-------|---------|
| `feature/` | New feature | `feature/AUTH-123-social-login` |
| `fix/` | Bug fix | `fix/BUG-456-login-redirect` |
| `hotfix/` | Urgent fix | `hotfix/CRIT-789-security-patch` |
| `refactor/` | Refactoring | `refactor/TECH-321-auth-cleanup` |
| `docs/` | Documentation | `docs/DOC-111-api-guide` |

### 6.2 Commit Message Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

#### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code formatting (no functional change) |
| `refactor` | Refactoring |
| `test` | Add/modify tests |
| `chore` | Build, config changes |
| `perf` | Performance improvement |
| `security` | Security-related changes |

#### Examples

```
feat(auth): add social login with Google OAuth

- Implement Google OAuth 2.0 flow
- Add user profile sync from Google
- Add tests for OAuth callback handling

Closes AUTH-123
```

```
fix(api): resolve N+1 query in user listing

The user listing endpoint was making N+1 queries for roles.
Added eager loading to resolve the performance issue.

Fixes BUG-456
```

### 6.3 Pull Request Guidelines

#### Title Format
```
[<type>] <Short description> (#<ticket>)
```

Example: `[feat] Add social login with Google (#AUTH-123)`

#### PR Description Template

```markdown
## Summary
Brief description of changes (1-3 sentences)

## Changes
- List of specific changes made

## Testing
- How this was tested
- Test commands run

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Security implications considered
```

---

## 7. Code Quality {#code-quality}

### 7.1 Linter Configuration

#### ESLint (TypeScript)

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

#### Ruff (Python)

```toml
# pyproject.toml
[tool.ruff]
line-length = 88
select = [
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "F",    # pyflakes
    "I",    # isort
    "C90",  # mccabe complexity
    "N",    # pep8-naming
    "S",    # bandit (security)
    "B",    # bugbear
]

[tool.ruff.per-file-ignores]
"tests/*" = ["S101"]  # Allow assert in tests
```

### 7.2 Formatter Configuration

#### Prettier (TypeScript/JavaScript)

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

#### Black (Python)

```toml
# pyproject.toml
[tool.black]
line-length = 88
target-version = ["py311"]
```

### 7.3 Complexity Limits

| Metric | Warning | Maximum |
|--------|---------|---------|
| Cyclomatic Complexity | 10 | 15 |
| Function Length (lines) | 30 | 50 |
| File Length (lines) | 300 | 500 |
| Function Parameters | 4 | 6 |

---

## 8. Documentation Standards {#documentation-standards}

### 8.1 Code Comments

#### When to Comment

- **DO**: Complex business logic, non-obvious algorithms, workarounds
- **DON'T**: Obvious code, getters/setters, simple CRUD

```typescript
// ✅ Good - explains WHY
// Using setTimeout to debounce rapid API calls during typing
// This prevents exceeding the rate limit of 100 req/min
const debouncedSearch = useMemo(
  () => debounce(searchApi, 300),
  []
);

// ❌ Bad - explains WHAT (obvious from code)
// Increment counter by 1
counter += 1;
```

### 8.2 Function Documentation

#### TypeScript (TSDoc)

```typescript
/**
 * Creates a new user account with the provided credentials.
 *
 * @param data - User registration data
 * @returns The created user object without sensitive fields
 * @throws {ConflictException} If email already exists
 * @throws {ValidationException} If data validation fails
 *
 * @example
 * ```ts
 * const user = await createUser({
 *   email: 'user@example.com',
 *   password: 'SecurePass123!'
 * });
 * ```
 */
async function createUser(data: CreateUserDto): Promise<UserResponse> {
  // ...
}
```

#### Python (Google Style)

```python
def create_user(data: UserCreate) -> User:
    """Creates a new user account with the provided credentials.

    Args:
        data: User registration data containing email and password.

    Returns:
        The created User object without sensitive fields.

    Raises:
        ConflictError: If email already exists in the database.
        ValidationError: If data validation fails.

    Example:
        >>> user = await create_user(UserCreate(
        ...     email="user@example.com",
        ...     password="SecurePass123!"
        ... ))
    """
```

### 8.3 API Documentation

All API endpoints must comply with OpenAPI 3.0 spec:

```yaml
# openapi.yaml
paths:
  /api/users:
    post:
      summary: Create a new user
      description: Creates a new user account with email and password
      operationId: createUser
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '400':
          $ref: '#/components/responses/ValidationError'
        '409':
          $ref: '#/components/responses/ConflictError'
```

---

## 9. Performance Standards {#performance-standards}

### 9.1 Web Application Metrics

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5s - 4.0s | > 4.0s |
| FID (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |
| TTFB (Time to First Byte) | < 200ms | 200ms - 500ms | > 500ms |

### 9.2 API Performance Targets

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| P50 Latency | < 50ms | 50-100ms | > 100ms |
| P95 Latency | < 200ms | 200-500ms | > 500ms |
| P99 Latency | < 500ms | 500ms-1s | > 1s |
| Error Rate | < 0.1% | 0.1-1% | > 1% |

### 9.3 Database Query Performance

| Query Type | Target | Warning | Critical |
|------------|--------|---------|----------|
| Simple SELECT | < 10ms | 10-50ms | > 50ms |
| Complex JOIN | < 100ms | 100-500ms | > 500ms |
| Aggregation | < 500ms | 500ms-2s | > 2s |

---

## 10. Security Standards {#security-standards}

### 10.1 Authentication

| Requirement | Standard |
|-------------|----------|
| Password Hashing | bcrypt (cost >= 12) or argon2 |
| JWT Access Token | Expiry < 15 minutes |
| JWT Refresh Token | Expiry < 7 days, one-time use |
| Session | HTTP-only, Secure, SameSite=Strict cookies |

### 10.2 Authorization

- Default deny (allowlist approach)
- Validate resource ownership
- Log all access control failures
- Rate limit on sensitive endpoints

### 10.3 Input Validation

- Validate ALL user inputs (server-side, never trust client)
- Use allowlists, not blocklists
- Parameterized queries only (no string concatenation)
- Sanitize output based on context (HTML, SQL, etc.)

### 10.4 Security Headers

```typescript
// Required security headers (Helmet.js)
{
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
}
```

### 10.5 Secrets Management

- **NEVER** hardcode secrets in code
- Use environment variables for configuration
- Use secret management services (AWS Secrets Manager, HashiCorp Vault)
- Rotate secrets regularly
- Different secrets per environment

---

## 11. Accessibility Standards {#accessibility-standards}

### 11.1 WCAG 2.1 AA Compliance

| Principle | Requirements |
|-----------|-------------|
| **Perceivable** | Alt text, color contrast (4.5:1), captions |
| **Operable** | Keyboard navigation, no seizure-inducing content |
| **Understandable** | Readable text, predictable navigation |
| **Robust** | Valid HTML, ARIA when needed |

### 11.2 Implementation Checklist

- [ ] All images have meaningful alt text
- [ ] Forms have associated labels
- [ ] Color is not the only means of conveying information
- [ ] Focus states are visible
- [ ] Skip navigation links present
- [ ] Page has proper heading hierarchy (h1 → h2 → h3)
- [ ] Interactive elements are keyboard accessible
- [ ] ARIA attributes used correctly (not overused)

---

## 12. CI/CD Standards {#ci-cd-standards}

### 12.1 Pipeline Stages

```yaml
stages:
  - lint        # Code quality checks
  - test        # Unit & integration tests
  - security    # Vulnerability scanning
  - build       # Build artifacts
  - deploy      # Deploy to environment
```

### 12.2 Required Checks

| Check | Stage | Blocking |
|-------|-------|----------|
| Linter | lint | Yes |
| Type Check | lint | Yes |
| Unit Tests | test | Yes |
| Integration Tests | test | Yes (for main/prod) |
| Dependency Audit | security | Yes (critical/high) |
| Code Coverage | test | Yes (if below threshold) |

### 12.3 Branch Protection

- `main` branch: Protected, requires PR, requires all checks pass
- `develop` branch: Protected, requires PR
- Feature branches: No protection, auto-delete after merge

---

## Usage in Skills

Each skill's SKILL.md references as follows:

```markdown
## Enterprise Standards Compliance

This skill follows team-wide enterprise standards.

**Required References**:
- [Code Conventions](./ENTERPRISE-STANDARDS.md#code-conventions)
- [Error Handling](./ENTERPRISE-STANDARDS.md#error-handling)
- [Testing Standards](./ENTERPRISE-STANDARDS.md#testing-standards)
- [Logging Standards](./ENTERPRISE-STANDARDS.md#logging-standards)
- [Git Conventions](./ENTERPRISE-STANDARDS.md#git-conventions)

**Domain-Specific Standards**:
- (Skill-specific domain standards here)
```
