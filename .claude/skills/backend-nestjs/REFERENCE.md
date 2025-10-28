# Backend NestJS - Technical Reference

> **Purpose**: Technical reference for the backend-nestjs skill in the autonomous skills-based development system.
> **Related Skills**: frontend-nextjs, fullstack-integration, qa-testing, devops-deployment, mcp-tools-orchestrator
> **Examples**: See examples/ directory for production-ready implementation patterns.

---

## Table of Contents
1. [Backend Specialized Domains](#backend-specialized-domains)
2. [Technology Stack](#technology-stack)
3. [Production Examples](#production-examples)
4. [Project Initialization](#project-initialization)
5. [Development Workflow](#development-workflow)
6. [Skill Coordination](#skill-coordination)
7. [Project Structure Template](#project-structure-template)
8. [Command Guide](#command-guide)

---

## Backend Specialized Domains

### Application Areas
- **NestJS Backend Server**: API server development, analysis, and enhancement
- **RESTful & GraphQL APIs**: Complete API implementation with validation and documentation
- **Database Integration**: ORM setup, migrations, performance optimization
- **Real-time Communication**: WebSocket Gateway for real-time features
- **Frontend Integration**: API contracts and data services for frontend-nextjs

### Core Technologies
- NestJS architecture, RESTful/GraphQL API design, TypeScript strict mode
- Database design (PostgreSQL) with Prisma/TypeORM
- JWT authentication, Passport.js strategies, RBAC
- API documentation (Swagger/OpenAPI), testing (Jest, Supertest)
- Security (Helmet, CORS, Rate Limiting), performance optimization

### Ultimate Goals
- **Production-ready NestJS API server integrated with frontend-nextjs**
- **Zero user confirmations required for technical decisions**

---

## Technology Stack

### Backend Technology Stack

**Primary Stack (NestJS + TypeScript) - MANDATORY**:
```textmate
- Framework: Nest.js (Latest Version)
- Package Manager: Bun
- Runtime: Node.js 18+
- TypeScript: Required
- Database ORM: Prisma or TypeORM
- Database: PostgreSQL (default), MySQL, MongoDB support
- Authentication: JWT + Passport.js
- Validation: class-validator + class-transformer
- API Documentation: Swagger/OpenAPI
- Testing: Jest + Supertest
- Configuration: @nestjs/config
- Caching: Redis (optional)
- Message Queue: Bull/BullMQ (optional)
- File Upload: Multer
- Security: Helmet, CORS, Rate Limiting
- Logging: Winston or built-in Logger (text-only format, emoji prohibited)
- Message Standards: Text-only API responses and error messages (emoji prohibited)
- Deployment: Railway, Heroku, AWS, Google Cloud Run, Docker
```

**Alternative Stack (Python) - OPTIONAL**:
```textmate
Note: Python stack is available for specialized use cases, but NestJS is the primary framework.

- Framework: FastAPI (recommended), Flask, Django
- Package Manager: pip, poetry, pipenv
- Runtime: Python 3.9+
- Database ORM: SQLAlchemy, Django ORM, Prisma Python
- Database: PostgreSQL, MySQL, SQLite, MongoDB
- Authentication: JWT + FastAPI Security, Django Auth
- Validation: Pydantic (FastAPI), Marshmallow, Django Forms
- API Documentation: FastAPI auto-generation, Swagger/OpenAPI
- Testing: pytest + httpx, Django Test Framework
- Configuration: Pydantic Settings, python-decouple
- Caching: Redis, Memcached
- Message Queue: Celery, RQ
- File Upload: FastAPI UploadFile, Django FileField
- Security: CORS middleware, Rate limiting
- Logging: Python logging, structlog (text-only format, NO EMOJIS)
- Message Standards: Text-only API responses and error messages (NO EMOJIS)
- Deployment: Railway, Heroku, AWS Lambda, Google Cloud Run, Docker
```

### Frontend Collaboration
This skill works closely with **frontend-nextjs** for:
- RESTful API endpoints consumed by React components
- JWT authentication tokens for protected routes
- WebSocket Gateway for real-time updates
- File upload endpoints for media handling
- API contract documentation (OpenAPI/Swagger)

---

## Production Examples

This skill provides comprehensive NestJS implementation examples in the `examples/` directory:

### Available Examples

#### 01. Authentication Module (`examples/01-authentication-module.md`)
- **Demonstrates**: Complete JWT authentication system with Passport.js
- **Key Patterns**: Local & JWT strategies, Guards, Decorators, RBAC
- **Frontend Integration**: Login/signup endpoints, token refresh, protected routes
- **Technologies**: @nestjs/jwt, @nestjs/passport, bcrypt, class-validator
- **Use when**: Implementing user authentication and authorization

#### 02. RESTful CRUD API (`examples/02-restful-crud-api.md`)
- **Demonstrates**: Complete CRUD operations with database integration
- **Key Patterns**: Modules, Controllers, Services, DTOs, Entities, Repositories
- **Frontend Integration**: API endpoints for data operations, pagination, filtering
- **Technologies**: TypeORM/Prisma, class-validator, Swagger decorators
- **Use when**: Building data-driven API endpoints

#### 03. Real-time WebSocket Gateway (`examples/03-websocket-gateway.md`)
- **Demonstrates**: WebSocket server for real-time bidirectional communication
- **Key Patterns**: WebSocket Gateway, Events, Rooms, Authentication
- **Frontend Integration**: Socket.io client integration, real-time updates
- **Technologies**: @nestjs/websockets, @nestjs/platform-socket.io
- **Use when**: Implementing chat, notifications, or collaborative features

#### 04. File Upload Service (`examples/04-file-upload-service.md`)
- **Demonstrates**: File upload handling with validation and storage
- **Key Patterns**: Multer interceptors, File validators, Storage configuration
- **Frontend Integration**: Upload endpoints, progress tracking, file URLs
- **Technologies**: @nestjs/platform-express, Multer, Sharp (image processing)
- **Use when**: Handling user file uploads and media management

### Using These Examples
- Examples include complete module implementations with TypeScript
- Full DTO validation and error handling patterns
- Swagger/OpenAPI documentation integration
- Unit and integration test examples
- Frontend API contract documentation
- Cross-references with frontend-nextjs, qa-testing, and devops-deployment skills
- Production-ready patterns following NestJS best practices

---

## Project Initialization

### ⚠️ MANDATORY: Framework Creation Requirements
**For Node.js frameworks (Nest.js) - ALWAYS use framework creation commands - DO NOT create files manually!**

For Node.js-based frameworks like Nest.js, you MUST use official creation tools (`nest new`) to ensure proper project structure, dependency management, and avoid configuration issues.

**Python Projects**: Manual project setup is acceptable for Python frameworks due to their different ecosystem nature.

### Nest.js Project Creation Steps (MANDATORY for Node.js)
1. **Nest.js Project Creation** (using `nest new` with bun - MANDATORY)
   - Use official Nest.js CLI creation command with proper flags
   - Never create Nest.js files/folders/modules manually from scratch
   - Follow the exact command structure provided in Command Guide
2. **Framework-Generated TypeScript Environment Verification**
   - Verify the framework properly configured TypeScript compilation
   - Only make minimal adjustments to framework-generated tsconfig
3. **Framework-Based Module Structure Validation**
   - Ensure the generated structure follows Nest.js architectural conventions
   - Use `nest generate` commands for additional modules, controllers, services
4. **Framework-Generated ESLint, Prettier, Testing Environment Validation**
   - Verify framework-generated development tools configuration
   - Only make minimal custom adjustments if absolutely necessary

---

## Development Workflow

### Existing Project Analysis (if applicable)
1. **Nest.js Codebase Analysis**
    - Analyze existing API server structure and architecture
    - Understand inter-module dependency relationships
    - Analyze database schema and ORM structure
    - Evaluate API endpoints and business logic
    - Review test code and documentation status
    - Identify performance bottlenecks and security vulnerabilities

### Backend Development Order
1. **NestJS Module Structure Design and Creation**
2. **Database Schema Design and ORM Setup (Prisma/TypeORM)**
3. **Authentication/Authorization System Implementation (JWT + Passport)**
4. **API Endpoint Implementation (Basic CRUD Operations)**
5. **Business Logic and Service Layer Implementation**
6. **Data Validation and DTO Implementation**
7. **API Documentation (Swagger) and Test Code Writing**
8. **Security Enhancement and Performance Optimization**
9. **Logging and Monitoring Setup (text-only, NO EMOJIS)**
10. **Deployment Environment Configuration (Railway/Heroku/AWS/Docker)**

---

## Skill Coordination

### Autonomous Operation
This skill operates with **complete autonomy**, requiring **zero user confirmations** for technical decisions including:
- Technology stack selections (NestJS, Prisma/TypeORM, PostgreSQL)
- Database schema design and migrations
- API architecture and endpoint design
- Authentication/authorization strategies (JWT, Passport.js)
- Security configurations and middleware

### Skill Invocation Context
This skill is automatically invoked by Claude when:
- User requests involve: "backend", "API", "NestJS", "database", "authentication", "server"
- Related skills mention: "backend-nestjs skill" in their outputs
- Context matches: API development, database operations, server-side logic, authentication systems

### Cross-Skill Collaboration
Coordinates with related skills through natural language mentions and shared memory system:

**frontend-nextjs**:
- API endpoint contracts and documentation
- JWT authentication flow coordination
- WebSocket Gateway setup for real-time features
- File upload endpoints and media handling
- CORS configuration for frontend domain

**fullstack-integration**:
- System architecture alignment and API design
- Database schema coordination with frontend data needs
- End-to-end feature implementation
- API versioning and migration strategies

**qa-testing**:
- API endpoint testing with Supertest
- Integration testing coordination
- Performance testing (response times <200ms)
- Security testing (authentication, authorization, input validation)
- API contract validation

**devops-deployment**:
- Docker containerization configuration
- Environment variable management
- Database migration in CI/CD
- Railway/Heroku/AWS deployment
- Health check endpoints and monitoring

**systemdev-specialist**:
- High-performance data processing APIs
- GPU-accelerated endpoints (when needed)
- Video processing service integration
- Message queue coordination (Bull/BullMQ)

**mcp-tools-orchestrator**:
- Context7 MCP for NestJS and TypeORM documentation
- GitHub MCP for code examples and patterns
- Sequential Thinking MCP for complex API design
- Advanced MCP tool usage patterns

### Coordination Pattern
Skills coordinate through:
1. **Natural Language Mentions**: Mentioning skill names in outputs triggers automatic invocation
2. **Shared Memory System**: All context shared through .memory/ directory files
3. **Autonomous Invocation**: Claude automatically invokes mentioned skills with full context
4. **Zero User Confirmation**: All skill coordination happens autonomously

### Critical Standards
**IMPORTANT**: All backend outputs must be text-only:
- API responses: Text-only messages (NO EMOJIS)
- Logging: Text-only format (NO EMOJIS)
- Error messages: Plain text descriptions (NO EMOJIS)
- Documentation: Professional text only (NO EMOJIS)

---

## Project Structure Template

### Nest.js Project Structure
```textmate
nest-api/
├── src/                          # Source code directory
│   ├── app.module.ts             # Root module
│   ├── main.ts                   # Application entry point
│   │
│   ├── auth/                     # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   │
│   ├── users/                    # User module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.entity.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   │
│   ├── common/                   # Common module
│   │   ├── decorators/           # Custom decorators
│   │   │   ├── roles.decorator.ts
│   │   │   └── user.decorator.ts
│   │   ├── filters/              # Exception filters
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/               # Guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/         # Interceptors
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   └── pipes/                # Pipes
│   │       └── validation.pipe.ts
│   │
│   ├── database/                 # Database related
│   │   ├── database.module.ts
│   │   ├── database.providers.ts
│   │   └── migrations/
│   │       └── 20240101_initial.ts
│   │
│   └── config/                   # Configuration related
│       ├── configuration.ts
│       └── validation.ts
│
├── test/                         # Test files
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
│   └── setup.ts
│
├── prisma/                       # Prisma ORM (or TypeORM setup)
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── docker/                       # Docker and Cloud deployment setup
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── cloudbuild.yaml           # Google Cloud Build setup
│   └── cloud-run.yaml            # Cloud Run service setup
│
├── docs/                         # API documentation
│   ├── swagger.json
│   └── api-spec.md
│
├── .env                          # Environment variables
├── .env.example                  # Environment variables example
├── .gitignore
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── nest-cli.json                 # Nest CLI configuration
├── package.json
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.build.json           # Build TypeScript configuration
└── README.md                     # Project documentation
```

---

## Command Guide

**Important Note**: Nest.js projects should also be created within the project root folder, but organized in a separate backend/ or api/ directory.

### Nest.js Project Creation and Basic Setup
```bash
# Check current directory and create backend folder
pwd
mkdir -p backend
cd backend

# Install Nest.js CLI globally (if needed)
bun add -g @nestjs/cli

# Create Nest.js project (non-interactive)
nest new nest-api --package-manager bun --skip-git --language TS --collection @nestjs/schematics

# Move to project directory
cd nest-api

# Verify dependency installation
bun install

# Test development server execution
bun run start:dev

# Test production build
bun run build

# Test production server execution
bun run start:prod

# Run tests
bun run test

# Run E2E tests
bun run test:e2e

# Run lint
bun run lint

# Fix lint issues
bun run lint:fix

echo "[STEP_DONE:nest-setup]"
```

### Nest.js Additional Package Installation (if needed)
```bash
# Database ORM packages
bun add @prisma/client prisma
bun add -D prisma

# Or when using TypeORM
bun add @nestjs/typeorm typeorm

# PostgreSQL driver
bun add pg
bun add -D @types/pg

# MySQL driver (when using instead of PostgreSQL)
bun add mysql2

# MongoDB driver (when using MongoDB)
bun add @nestjs/mongoose mongoose

# JWT authentication related
bun add @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
bun add -D @types/passport-jwt @types/passport-local

# Validation and transformation
bun add class-validator class-transformer

# Configuration management
bun add @nestjs/config

# API documentation
bun add @nestjs/swagger swagger-ui-express

# Security related
bun add helmet @nestjs/throttler

# CORS setup (built-in but if needed)
bun add cors
bun add -D @types/cors

# File upload
bun add @nestjs/platform-express multer
bun add -D @types/multer

# Logging (when using Winston)
bun add @nestjs/common winston nest-winston

# Caching (when using Redis)
bun add @nestjs/cache-manager cache-manager
bun add cache-manager-redis-store redis
bun add -D @types/redis

# Message queue (when using Bull)
bun add @nestjs/bull bull
bun add -D @types/bull

# WebSocket (when real-time features needed)
bun add @nestjs/websockets @nestjs/platform-socket.io

# GraphQL (when building GraphQL API)
bun add @nestjs/graphql @nestjs/apollo graphql apollo-server-express

# Additional testing tools
bun add -D supertest @types/supertest

echo "[STEP_DONE:nest-packages]"
```

### Database Setup (Prisma/TypeORM)
```bash
# When using Prisma
bunx prisma init

# Generate database schema (after editing schema.prisma)
bunx prisma db push

# Generate migration
bunx prisma migrate dev --name initial

# Generate Prisma client
bunx prisma generate

# Database seed (optional)
bunx prisma db seed

# Run Prisma Studio (database GUI)
bunx prisma studio

# When using TypeORM migration
bun run migration:generate -- --name InitialMigration
bun run migration:run

# Test database connection
bun run start:dev

echo "[STEP_DONE:nest-database]"
```

### Back-end Deployment Commands
```bash
# Railway deployment
bun add -g @railway/cli
railway login
railway init
railway up

# Heroku deployment
bun add -g heroku
heroku login
heroku create your-app-name
git add .
git commit -m "Initial commit"
git push heroku main

# Google Cloud Run deployment (requires Dockerfile)
# Create Dockerfile
echo "FROM node:18-alpine
WORKDIR /app
COPY package*.json bun.lockb ./
RUN bun install --production
COPY . .
RUN bun run build
EXPOSE 3000
CMD [\"bun\", \"run\", \"start:prod\"]" > Dockerfile

# Cloud Build setup
gcloud builds submit --tag gcr.io/PROJECT-ID/nest-api
gcloud run deploy --image gcr.io/PROJECT-ID/nest-api --platform managed

# Docker containerization (local testing)
docker build -t nest-api .
docker run -p 3000:3000 nest-api

# Preparation for AWS EC2/ECS deployment
bun run build
bun run --production

echo "[STEP_DONE:nest-deploy]"
```

### Message Standards Validation (MANDATORY)
```bash
# Validate API responses for emoji usage (Node.js/NestJS)
# Check TypeScript/JavaScript files for emoji in response messages
grep -r "[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]" src/ || echo "[OK] No emojis found in source code"

# Check log files for emoji characters
grep -r "[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]" logs/ || echo "[OK] No emojis found in log files"

# Validate API documentation for emoji usage
grep -r "[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]" docs/ || echo "[OK] No emojis found in documentation"

# Test API endpoints for emoji in responses (requires running server)
node -e "
const http = require('http');
const options = { hostname: 'localhost', port: 3000, path: '/api/test', method: 'GET' };
const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu;
    if (emojiRegex.test(data)) {
      console.error('[ERROR] Emoji found in API response');
      process.exit(1);
    } else {
      console.log('[OK] API response is emoji-free');
    }
  });
});
req.end();
"

echo "[STEP_DONE:message-validation]"
```

### Terminal/Execution Rules

1) **Non-interactive only**
    - All package installation/creation commands use non-interactive options: `--yes`, `--no-install`, `--use-npm`, etc.
    - Before execution, check current directory and target folder existence with `ls/dir` and create if missing.

2) **Package manager fallback**
    - Default is `bun`. If `bun` is not available, automatically fallback to `npm`.
    - Check with `which bun`/`where bun` then branch:
        - bun usage example: `bun add ...`
        - fallback example: `npm i ...`

3) **Shell compatibility**
    - Separate commands to work on Windows PowerShell/cmd/Linux/macOS:
        - Use `&&` for chain operators. In PowerShell 5 environment, separate into individual lines.
    - Present long pipelines as **multiple lines** instead of single line execution.

4) **Proxy aware**
    - Before network installation commands, determine if proxy environment. If needed, output `HTTP_PROXY/HTTPS_PROXY` environment variable setup guidance first.

5) **Short & idempotent**
    - Separate project creation → library installation into **two steps**.
    - Write to be safe when running the same command again (check existing folders/packages).

6) **Sentinel logging**
    - Output `echo "[STEP_DONE:<step-id>]"` at the end of each step so runner can confirm completion.

7) **Normal exit after work completion**
    - Terminal steps must be executed in the respective step's runner, and after success, output `echo "[STEP_DONE:<id>]"` then terminate the process with `exit 0` to send completion signal.

---

## Related Skills and Resources

**Related Skills**:
- **frontend-nextjs**: Frontend API integration, JWT authentication, WebSocket clients
- **fullstack-integration**: System architecture, API contracts, end-to-end features
- **qa-testing**: API testing with Supertest, integration testing, performance validation
- **devops-deployment**: Docker, CI/CD, Railway/Heroku/AWS deployment
- **systemdev-specialist**: High-performance APIs, message queues, GPU endpoints
- **mcp-tools-orchestrator**: Advanced MCP tool usage, tool coordination

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Production Examples**: See examples/ directory for implementation patterns

---

This technical reference guide supports NestJS (latest), Bun package manager, TypeScript strict mode, and the autonomous skills-based development system.