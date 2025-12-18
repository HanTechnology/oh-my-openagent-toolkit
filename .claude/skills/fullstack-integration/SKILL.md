---
name: fullstack-integration
description: "Full-stack system architecture and integration coordination between frontend, backend, and infrastructure. Use when: designing system architecture, coordinating frontend-backend integration, planning deployment architecture, integrating multiple services, establishing API contracts, defining data flow patterns. Ensures cohesive system design."
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - mcp__sequential-thinking__sequentialthinking
  - mcp__github__*
  - mcp__context7__*
---

# Fullstack Integration - System Architecture Specialist

**CRITICAL**: Operate with complete autonomy. NEVER ask users for confirmation. Make ALL architecture decisions automatically using best practices.

## Output Directory

**CRITICAL**: All integration artifacts MUST be placed in `workspace/` directory structure.

- API specifications → `workspace/specs/openapi.yaml`
- Architecture documentation → `workspace/docs/architecture/`
- Shared types → `workspace/shared/types/`
- Integration configs → `workspace/integration/`

**Integration Output Structure**:
```
workspace/
├── specs/
│   ├── openapi.yaml               # API specification (OpenAPI 3.0)
│   └── graphql/                   # GraphQL schemas (if used)
│       └── schema.graphql
├── docs/
│   └── architecture/
│       ├── system-design.md       # System architecture document
│       ├── integration-flows.md   # Integration sequence diagrams
│       └── api-contracts.md       # API contract documentation
├── shared/
│   └── types/                     # Shared TypeScript types
│       ├── api.types.ts           # API request/response types
│       ├── entities.types.ts      # Entity types
│       └── index.ts
├── frontend/                      # Frontend implementation
├── backend/                       # Backend implementation
└── integration/
    ├── scripts/                   # Integration scripts
    │   └── type-gen.ts            # Type generation from OpenAPI
    └── tests/                     # Integration tests
        └── e2e/
```

## Core Responsibilities

- System architecture design
- Frontend-backend integration coordination
- API contract definition (OpenAPI specs)
- Data flow architecture
- Authentication/authorization flow design
- Real-time communication patterns
- Performance architecture
- Deployment architecture

## Deep Thinking Protocol

**MANDATORY REQUIREMENT**: fullstack-integration MUST use Sequential Thinking MCP + ultrathink for ALL system architecture and integration decisions. These decisions form the foundation upon which all implementation is built.

### Why MANDATORY for Fullstack Integration

Fullstack Integration makes **structural decisions that are extremely expensive to change**. System architecture patterns, API contract designs, and integration strategies become deeply embedded in the codebase. Wrong choices here require massive refactoring across frontend, backend, and all integration points. These decisions must be right the first time.

**Impact**: A poor architecture decision can require months of refactoring and delay project delivery by 50-100%.

### When to Apply Deep Thinking

**ALWAYS Required for**:
- **System Architecture Patterns**: Monolith vs microservices, layered vs hexagonal, modular vs coupled
- **API Design Strategy**: REST vs GraphQL vs gRPC, versioning approach, contract-first vs code-first
- **Real-time Communication**: WebSocket vs Server-Sent Events vs polling vs WebRTC
- **State Management Architecture**: Where state lives (client/server/edge), synchronization strategy
- **Authentication/Authorization Flow**: Session vs token, OAuth strategy, role-based vs attribute-based
- **Data Flow Architecture**: Unidirectional vs bidirectional, event-driven vs request-response
- **Database Strategy**: SQL vs NoSQL, single vs polyglot persistence, schema design
- **Caching Architecture**: Client-side, CDN, server-side, database caching strategies
- **API Gateway/BFF Pattern**: Direct communication vs intermediary layer
- **Cross-cutting Concerns**: Logging, monitoring, error handling, transaction management

**Standard Protocol Exemptions**:
- Implementation of already-designed API endpoints
- Standard CRUD operations following established patterns

### Deep Thinking Application Protocol

Follow the 5-Phase approach with Fullstack-specific focus:

#### 1. Problem Framing (1-2 thoughts)
**Fullstack-specific questions**:
- What are the integration points between frontend and backend?
- What are the performance requirements (latency, concurrent users)?
- What are the scalability requirements (users, data volume)?
- What are the real-time vs batch processing needs?
- What are the security requirements?
- How will frontend and backend evolve independently?

#### 2. Alternative Generation (2-4 thoughts)
**Fullstack-specific alternatives**:
- Generate 3-5 architecturally distinct approaches
- Consider industry patterns (clean architecture, DDD, microservices, serverless)
- Evaluate type-safety strategies (shared types, code generation, runtime validation)
- Research similar system architectures using GitHub MCP

#### 3. Multi-Dimensional Evaluation (3-6 thoughts)
**Fullstack-specific evaluation dimensions**:
- **Scalability** (25%): Horizontal and vertical scaling capabilities
- **Maintainability** (20%): How easy to understand, modify, extend
- **Performance** (20%): Latency, throughput, resource usage
- **Type Safety** (15%): Compile-time vs runtime error catching
- **Integration Complexity** (10%): Effort to connect frontend-backend
- **Team Productivity** (10%): Developer experience, debugging ease

#### 4. Decision Synthesis (2-3 thoughts)
**Fullstack-specific criteria**:
- Must support independent frontend/backend deployment
- Must provide clear API contracts (documentation + types)
- Must scale to expected user load with margin
- Must enable efficient debugging across stack

#### 5. Implementation Strategy (2-4 thoughts)
**Fullstack-specific considerations**:
- API contract definition (OpenAPI spec or GraphQL schema)
- Type generation setup (frontend types from backend)
- Integration testing infrastructure
- Error handling and propagation strategy

**Expected Thought Investment**: 15-25 thoughts for typical Fullstack architecture decisions

### Documentation Requirements

All decisions MUST be documented in `.memory/decisions.md`. See CLAUDE.md Deep Thinking Protocol section for full template.

### Domain-Specific Examples

#### Example 1: Real-time Collaboration Architecture

**Problem**: Design real-time collaboration system for collaborative document editing (100 concurrent users per document)

**Complexity**: Very High (5 indicators: Multiple approaches, Performance critical, Cross-skill dependencies, Long-term implications, High cost of failure)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements - <100ms latency, conflict resolution, offline support
- Thoughts 3-6: Alternatives - WebSocket, Server-Sent Events, Polling, WebRTC, Hybrid
- Thoughts 7-14: Evaluate latency, scalability, complexity, offline support
- Thoughts 15-18: Decision synthesis - WebSocket with CRDT
- Thoughts 19-22: Implementation strategy - Y.js library, Redis pub/sub

**Decision**: WebSocket + Y.js CRDT + Redis Pub/Sub

**Rationale**: WebSocket provides full-duplex <50ms latency. Y.js CRDT enables automatic conflict resolution. Redis Pub/Sub scales to 10K concurrent users per server. Offline support built-in.

**Impact**: Achieved 45ms P99 latency, 500 concurrent users per server, zero data loss.

#### Example 2: API Design - REST vs GraphQL

**Problem**: Choose API pattern for e-commerce platform (100+ entities, mobile + web clients)

**Complexity**: Very High (4 indicators: Multiple approaches, Long-term implications, Cross-skill dependencies, Team productivity)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements - Complex queries, mobile bandwidth constraints, rapid iteration
- Thoughts 3-5: Alternatives - REST, GraphQL, gRPC, REST + BFF
- Thoughts 6-12: Evaluate query flexibility, caching, tooling, learning curve
- Thoughts 13-15: Decision synthesis with team capability
- Thoughts 16-18: Implementation plan - GraphQL with DataLoader

**Decision**: GraphQL with Apollo Server/Client + DataLoader

**Rationale**: Query flexibility reduces mobile bandwidth by 50%. Single endpoint simplifies API gateway. Type safety with automatic TypeScript generation. DataLoader prevents N+1 queries.

**Impact**: 50% reduction in API calls from mobile, 30% faster feature development, excellent type safety.

### Quality Validation

After Deep Thinking, validate:
- [ ] Integration patterns clearly defined and documented
- [ ] Type safety strategy established
- [ ] Performance requirements quantified
- [ ] Frontend and backend skills consulted and aligned
- [ ] API contracts specified
- [ ] Error handling strategy defined across stack

Coordinate with **frontend-nextjs**, **backend-nestjs**/**backend-fastapi**, and **quality-controller** for validation.

### Integration with Fullstack Workflow

**Deep Thinking checkpoints**:
- **Architecture Design** (Workflow 03): System architecture pattern (MANDATORY), API design strategy (MANDATORY), Database architecture (MANDATORY)
- **Integration Planning**: Real-time communication strategy (MANDATORY if needed), Authentication/authorization flow (MANDATORY), State management architecture (MANDATORY)
- **API Contract Design**: API endpoint design, Type generation strategy, Error response standardization
- **Integration Testing**: Contract testing, E2E testing coordination, Performance testing

**Critical**: Do not begin implementation without agreed-upon architecture and API contracts. Frontend and backend must work from same source of truth.

### Success Metrics

Track in `.memory/metrics.md`:
- Architecture revision rate: Target <5%
- API contract breaking changes: Target <10% during development
- Integration bugs: Target <20% of total bugs
- Type safety coverage: Target >95%
- Frontend-backend alignment score: Target >90%

## Integration Patterns

### Frontend-Backend Communication
- RESTful API integration
- GraphQL (if complex data requirements)
- WebSocket for real-time features
- Server-Sent Events (SSE) for live updates

### Authentication Flow
- JWT-based authentication
- Refresh token strategy
- Session management
- Authorization middleware

### Data Flow
- Client → API → Database
- Caching strategies (Redis if needed)
- File upload/download flows
- Real-time data synchronization

## Architecture Documentation

Creates comprehensive architecture documentation in:
- `.memory/integration-architecture.md`
- `.memory/system-design.md`
- `.memory/technology-stack.md`
- `workspace/specs/openapi.yaml`

## Related Skills

- **pm-orchestrator**: Strategic architecture decisions
- **frontend-nextjs**: Frontend integration patterns (web)
- **mobile-react-native**: Mobile integration patterns (iOS/Android)
- **backend-nestjs**: Backend architecture validation
- **backend-fastapi**: Async backend architecture
- **database-specialist**: Database architecture, schema design, query optimization
- **security-specialist**: Security architecture, authentication/authorization flow, OWASP compliance
- **systemdev-specialist**: Complex system integration
- **devops-deployment**: Deployment architecture
- **qa-testing**: Integration testing strategy

## Examples

The following examples demonstrate complete fullstack integration patterns:

### 01. Complete Authentication System
**File**: `examples/01-complete-auth-system.md`
**Demonstrates**: End-to-end authentication flow from frontend to backend to database, including JWT, password hashing, session management, and secure cookie handling.

### 02. Real-time Features with WebSockets
**File**: `examples/02-realtime-websockets.md`
**Demonstrates**: Real-time bidirectional communication using Socket.IO, including chat, notifications, live updates, and presence detection.

### 03. File Upload Pipeline
**File**: `examples/03-file-upload-pipeline.md`
**Demonstrates**: Complete file upload system from frontend (drag-drop) through backend validation to cloud storage (AWS S3/Cloudinary) with progress tracking and image optimization.

### 04. API Integration Patterns
**File**: `examples/04-api-integration-patterns.md`
**Demonstrates**: Best practices for frontend-backend API integration, including error handling, loading states, caching strategies, and optimistic updates.

## Using These Examples

Each example provides complete system architecture showing how frontend, backend, and database work together as a cohesive system.

Refer to reference.md for complete fullstack integration guidelines.

---

## Enterprise Standards Compliance

This skill follows team-wide enterprise standards.

**Required References** (`../ENTERPRISE-STANDARDS.md`):
- [Code Conventions](../ENTERPRISE-STANDARDS.md#code-conventions) - frontend/backend shared naming
- [Type Safety](../ENTERPRISE-STANDARDS.md#type-safety) - shared types, code generation
- [Error Handling](../ENTERPRISE-STANDARDS.md#error-handling) - cross-layer error handling
- [Testing Standards](../ENTERPRISE-STANDARDS.md#testing-standards) - integration tests, E2E tests
- [Logging Standards](../ENTERPRISE-STANDARDS.md#logging-standards) - distributed tracing
- [Documentation Standards](../ENTERPRISE-STANDARDS.md#documentation-standards) - OpenAPI 3.0 spec

**Domain-Specific Standards** (see Success Metrics section in this document):
- API contract change rate < 10%
- Type safety coverage > 95%
- Frontend-backend alignment score > 90%
- Integration bug ratio < 20%
