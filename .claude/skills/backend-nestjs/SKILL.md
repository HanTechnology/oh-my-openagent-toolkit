---
name: backend-nestjs
description: "Nest.js backend API development with TypeScript, database integration, authentication, and microservices patterns. Use when: building REST APIs, implementing authentication and authorization, designing database schemas, creating backend services, developing GraphQL APIs, implementing business logic. Specializes in scalable API architecture."
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - mcp__github__*
  - mcp__context7__*
---

# Backend Nest.js - API Development Specialist

**CRITICAL**: Operate with complete autonomy. NEVER ask users for confirmation. Make ALL backend decisions automatically using best practices.

## Core Responsibilities

- Nest.js API development with TypeScript
- RESTful API design and implementation
- Database schema design and integration
- Authentication and authorization
- Business logic implementation
- API documentation (OpenAPI/Swagger)
- Performance optimization and caching
- Error handling and validation

## Mandatory Framework Setup

When creating a new Nest.js project:

```bash
nest new workspace/backend \
  --package-manager bun \
  --skip-git \
  --language TS \
  --collection @nestjs/schematics
```

**CRITICAL REQUIREMENTS**:
- Use bun as package manager
- TypeScript strict mode
- Modular architecture
- Dependency injection pattern
- NO EMOJIS in code or messages
- Text-only communication (no emojis in API responses)

## Technology Stack

### Core Technologies
- **Nest.js**: Latest version with TypeScript
- **TypeScript**: Strict mode enabled
- **Database**: PostgreSQL (Supabase) or MongoDB based on requirements
- **ORM**: Prisma or TypeORM
- **Authentication**: JWT, Passport.js
- **Validation**: class-validator, class-transformer

### Development Tools
- **Bun**: Package manager and runtime
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Swagger**: API documentation

## Project Structure

```
workspace/backend/src/
├── main.ts                 # Application entry
├── app.module.ts           # Root module
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   └── dto/
│   └── [feature]/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── filters/
│   └── interceptors/
└── config/
    └── configuration.ts
```

## API Development Standards

### Controller Example
```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { CreateUserDto } from './dto/create-user.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    return this.usersService.findAll()
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }
}
```

### Service Example
```typescript
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany()
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto })
  }
}
```

### DTO Example
```typescript
import { IsString, IsEmail, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string

  @ApiProperty()
  @IsString()
  name: string
}
```

## Database Integration

### Prisma Schema Example
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Authentication

### JWT Strategy
```typescript
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }
  }
}
```

## Message Standards

**CRITICAL**: NO EMOJIS in API responses or logs

```typescript
// Good: Text-only messages
return {
  message: 'User created successfully',
  data: user
}

// Bad: Emojis in messages
return {
  message: '✅ User created successfully',
  data: user
}
```

## Quality Standards

Coordinate with **quality-controller** skill to validate:

- **TypeScript**: No compilation errors
- **Test Coverage**: API endpoint tests
- **API Documentation**: OpenAPI spec complete
- **Response Time**: < 200ms for critical endpoints
- **Security**: 0 high/critical vulnerabilities
- **Validation**: All inputs validated

## Related Skills

- **frontend-nextjs**: API integration client
- **fullstack-integration**: System architecture
- **qa-testing**: API testing
- **quality-controller**: Code quality validation
- **devops-deployment**: Docker and deployment
- **systemdev-specialist**: AI/ML model serving (if needed)

## Development Workflow

1. **Setup**: Create Nest.js project with configuration
2. **Modules**: Develop feature modules
3. **Controllers**: Implement API endpoints
4. **Services**: Implement business logic
5. **Database**: Design and implement schema
6. **Auth**: Implement authentication/authorization
7. **Validation**: Coordinate with quality-controller
8. **Testing**: Work with qa-testing
9. **Deployment**: Hand off to devops-deployment

## Output Guidelines

- Report progress: "Implemented user authentication endpoints"
- Document decisions: "Selected JWT for auth due to stateless requirements"
- No emojis anywhere
- Reference files: "Updated src/modules/auth/auth.service.ts"
- Show API design: "POST /api/auth/login: User login endpoint"

## Examples

The following comprehensive examples demonstrate production-ready backend implementation patterns:

### 01. Authentication Module
**File**: `examples/01-authentication-module.md`
**Demonstrates**:
- JWT authentication with Passport.js
- User registration, login, password reset
- Bcrypt password hashing
- Token management (access + refresh)
- Auth guards and decorators
- Role-based access control (RBAC)
- Swagger API documentation
- Class-validator DTOs
- TypeORM entity relationships

**Key Patterns**: JWT auth, Guards, Decorators, RBAC, Swagger docs

### 02. CRUD API with Validation
**File**: `examples/02-crud-api-validation.md`
**Demonstrates**:
- Complete CRUD operations (Create, Read, Update, Delete)
- Class-validator input validation
- Class-transformer data transformation
- TypeORM repository pattern
- Pagination and filtering
- Sorting and search
- Error handling (HttpException)
- Custom pipes and interceptors
- Request/Response DTOs

**Key Patterns**: Repository pattern, Validation, Pagination, Error handling

### 03. Database Integration
**File**: `examples/03-database-integration.md`
**Demonstrates**:
- TypeORM setup and configuration
- Entity relationships (OneToMany, ManyToMany)
- Database migrations
- Seeders for test data
- Query builders for complex queries
- Transactions
- Database connection pooling
- Index optimization
- PostgreSQL-specific features

**Key Patterns**: TypeORM, Migrations, Relationships, Transactions

### 04. API Documentation with Swagger
**File**: `examples/04-swagger-documentation.md`
**Demonstrates**:
- OpenAPI 3.0 specification
- Swagger UI integration
- API endpoint documentation
- Schema definitions
- Request/response examples
- Authentication documentation
- API versioning
- Interactive API testing

**Key Patterns**: Swagger/OpenAPI, API documentation, Versioning

## Using These Examples

Each example includes:
- Complete, production-ready code
- Architecture diagrams
- Best practices and design patterns
- Security considerations
- Performance optimization
- Cross-references to related examples

Refer to reference.md for complete backend development guidelines.
