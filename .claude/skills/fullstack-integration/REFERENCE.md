# Fullstack Integration - Technical Reference

> **Purpose**: Technical reference for the fullstack-integration skill in the autonomous skills-based development system.
> **Related Skills**: frontend-nextjs, backend-nestjs, backend-fastapi, qa-testing, devops-deployment, research-analysis, mcp-tools-orchestrator
> **Examples**: See examples/ directory for production-ready integration patterns.

---

## Fullstack Integration Skill Guidelines

### Core Responsibilities

**System Integration and Architecture**
- End-to-end system architecture design and coordination
- Frontend-backend API contract design and validation
- Database schema coordination with frontend data needs
- Real-time feature integration (WebSocket, Server-Sent Events)
- Authentication flow coordination (JWT, session management)
- Performance optimization across the full stack
- Type safety and data synchronization

**Integration Specialization**
- API communication optimization and error handling
- Cross-layer type safety (TypeScript end-to-end)
- Real-time data synchronization patterns
- Authentication and authorization flow coordination
- DevOps and deployment integration
- Monitoring and observability setup

### Ultimate Goals
- **Fully integrated web application** with seamless frontend-backend communication
- **Zero user confirmations required** for technical integration decisions
- Production-ready system with comprehensive error handling and monitoring

---

## Technology Stack

### Fullstack Common Stack
```
- Language: TypeScript (strict mode) - frontend and backend
- Version Control: Git + GitHub
- Code Quality: ESLint + Prettier
- API Communication: RESTful API (primary), GraphQL (optional)
- Real-time: WebSocket (Socket.io), Server-Sent Events
- Monitoring: Application logging, performance tracking, error monitoring
- CI/CD: GitHub Actions + platform integration
```

### Frontend-Backend Integration
```
- Frontend: Next.js 15+ with React Server Components
- Backend: NestJS with TypeORM/Prisma
- Database: PostgreSQL (primary)
- Authentication: JWT tokens with Passport.js
- Real-time: Socket.io (NestJS Gateway + Next.js client)
- API Documentation: OpenAPI/Swagger
- Type Sharing: Shared TypeScript types between frontend and backend
```

---

## Production Examples

This skill provides comprehensive integration examples in the `examples/` directory:

### Available Examples

#### 01. Full Authentication Flow (`examples/01-full-authentication-flow.md`)
- **Demonstrates**: Complete end-to-end authentication system
- **Key Patterns**: JWT flow, refresh tokens, protected routes, session management
- **Integration**: Frontend login UI → Backend auth API → Token storage → Protected pages
- **Technologies**: NestJS Guards, Passport.js, Next.js middleware, JWT handling
- **Use when**: Implementing complete authentication across frontend and backend

#### 02. Real-time Chat System (`examples/02-realtime-chat-system.md`)
- **Demonstrates**: WebSocket-based real-time communication
- **Key Patterns**: Socket.io Gateway, room management, presence, message persistence
- **Integration**: NestJS WebSocket Gateway ↔ Next.js Socket.io client
- **Technologies**: @nestjs/websockets, Socket.io, React hooks, optimistic updates
- **Use when**: Building real-time features (chat, notifications, collaboration)

#### 03. API Contract Design (`examples/03-api-contract-design.md`)
- **Demonstrates**: Type-safe API contracts between frontend and backend
- **Key Patterns**: Shared TypeScript types, DTO validation, API versioning
- **Integration**: OpenAPI schema → TypeScript types → Frontend API client
- **Technologies**: class-validator, class-transformer, OpenAPI, code generation
- **Use when**: Establishing type-safe communication contracts

#### 04. E2E Feature Implementation (`examples/04-e2e-feature-implementation.md`)
- **Demonstrates**: Complete feature from UI to database
- **Key Patterns**: Component → API client → Backend service → Database → Response
- **Integration**: Full-stack data flow, error handling, loading states, validation
- **Technologies**: React components, API services, NestJS modules, TypeORM
- **Use when**: Implementing end-to-end features with full integration

### Using These Examples
- Examples include complete integration implementations
- Full type definitions across frontend and backend
- Error handling and edge case coverage
- Cross-references with frontend-nextjs, backend-nestjs, backend-fastapi, and qa-testing
- Production-ready patterns following best practices

---

## Skill Coordination

### Autonomous Operation
This skill operates with **complete autonomy**, requiring **zero user confirmations** for:
- System architecture design and API contracts
- Integration strategy and implementation approach
- Authentication flow design and coordination
- Real-time feature implementation decisions
- Performance optimization strategies

### Skill Invocation Context
This skill is automatically invoked by Claude when:
- User requests involve: "fullstack", "integration", "end-to-end", "API design", "architecture"
- Related skills mention: "fullstack-integration skill" in their outputs
- Context matches: system integration, architecture design, API contracts, feature coordination

### Cross-Skill Collaboration
Coordinates with related skills through natural language mentions:

**frontend-nextjs**:
- API contract design and validation
- Authentication flow coordination (JWT handling)
- WebSocket client integration
- Type safety across frontend-backend boundary
- Data fetching patterns and error handling

**backend-nestjs**:
- API endpoint design and implementation
- Database schema coordination
- Authentication system implementation
- WebSocket Gateway setup
- API documentation and contracts

**backend-fastapi**:
- Async API endpoint design and implementation
- SQLAlchemy async database coordination
- OAuth2 + JWT authentication implementation
- AI/ML model serving integration
- Pydantic schema validation and OpenAPI documentation

**qa-testing**:
- Integration testing strategy
- End-to-end test planning
- API contract validation
- Performance testing coordination
- User journey validation

**devops-deployment**:
- Environment configuration coordination
- CORS and security settings
- Database migration strategy
- Monitoring and logging setup
- Deployment orchestration

**research-analysis**:
- Architecture pattern research
- Technology stack evaluation
- Integration approach analysis
- Performance optimization research

**mcp-tools-orchestrator**:
- Sequential Thinking MCP for architecture design
- Context7 MCP for integration patterns
- GitHub MCP for example references
- Multi-tool coordination for complex integration

### Coordination Pattern
1. **Natural Language Mentions**: Mentioning skill names triggers automatic invocation
2. **Shared Memory System**: Integration design stored in .memory/ directory
3. **Autonomous Invocation**: Claude automatically invokes skills with full context
4. **Zero User Confirmation**: All integration coordination autonomous

---

## Integration Workflow

### End-to-End Feature Development

1. **Architecture Design**
   - System architecture and component design
   - API contract definition
   - Database schema design
   - Type definitions across stack

2. **API Contract Establishment**
   - Define request/response types
   - Create DTOs and validation rules
   - Document with OpenAPI/Swagger
   - Generate TypeScript types for frontend

3. **Backend Implementation**
   - NestJS module, controller, service implementation
   - Database entity and repository setup
   - Business logic and validation
   - API endpoint testing

4. **Frontend Implementation**
   - API client service creation
   - React components with data fetching
   - State management and caching
   - Error handling and loading states

5. **Integration Testing**
   - End-to-end test implementation
   - API contract validation
   - Error scenario testing
   - Performance validation

6. **Deployment Coordination**
   - Environment variable coordination
   - CORS configuration
   - Database migration execution
   - Monitoring and logging setup

---

## API Communication Patterns

### RESTful API Integration
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URL structure
- JSON request/response format
- HTTP status codes for error handling
- Pagination, filtering, sorting patterns

### Real-time Communication
- WebSocket connections for bidirectional communication
- Server-Sent Events for server-to-client updates
- Event-driven architecture
- Room/channel management
- Connection lifecycle handling

### Type Safety
- Shared TypeScript types between frontend and backend
- DTO validation with class-validator
- OpenAPI schema generation
- Type-safe API client generation
- Compile-time type checking

---

## Authentication Flow Integration

### JWT Authentication
1. **Login Flow**: Frontend form → Backend authentication → JWT token → Frontend storage
2. **Token Management**: Access tokens, refresh tokens, token expiration handling
3. **Protected Routes**: Frontend route guards + Backend authentication guards
4. **Authorization**: Role-based access control (RBAC) across frontend and backend

### Session Management
- Secure token storage (httpOnly cookies or secure storage)
- Token refresh mechanisms
- Logout and session invalidation
- Multi-device session management

---

## Real-time Feature Implementation

### WebSocket Integration
- NestJS WebSocket Gateway setup
- Socket.io client integration in Next.js
- Event emitters and listeners
- Room/namespace management
- Authentication for WebSocket connections

### Data Synchronization
- Optimistic updates on frontend
- Server state synchronization
- Conflict resolution strategies
- Real-time data consistency

---

## Related Skills and Resources

**Related Skills**:
- **frontend-nextjs**: Frontend implementation, React components, UI integration
- **backend-nestjs**: Backend API implementation (TypeScript), database operations, business logic
- **backend-fastapi**: Backend API implementation (Python), async operations, AI/ML integration
- **qa-testing**: Integration testing, E2E validation, API contract testing
- **devops-deployment**: Deployment coordination, environment configuration, monitoring
- **research-analysis**: Architecture research, integration pattern analysis
- **mcp-tools-orchestrator**: Advanced MCP coordination for complex integration

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Production Examples**: See examples/ directory for integration patterns

---

This technical reference guide supports Next.js 15+, NestJS (latest), TypeScript strict mode, PostgreSQL, and the autonomous skills-based development system.
