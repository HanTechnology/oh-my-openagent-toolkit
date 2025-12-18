# Architecture Design Workflow

## Overview

- **Primary Skill**: fullstack-integration
- **Supporting Skills**: pm-orchestrator, backend-nestjs, backend-fastapi, frontend-nextjs, database-specialist, security-specialist, systemdev-specialist
- **Dependencies**: requirements-analysis (must be complete)
- **Parallel Execution**: Cannot run in parallel (requires requirements)

## Workflow Steps

### Phase 1: Context Loading and Requirements Review

**Objective**: Load all necessary context for architecture design

**Actions**:
1. **Read Requirements Documentation**:
   - workspace/docs/analysis.md (functional and non-functional requirements)
   - workspace/backlog/epics.yaml (project scope and features)
   - .memory/active-context.md (current project status)

2. **Read Research Insights** (if available):
   - .memory/tech-stack-analysis.md (technology recommendations)
   - .memory/architecture-patterns.md (pattern recommendations)
   - .memory/risk-assessment.md (risk considerations)

3. **Understand Quality Requirements**:
   - .memory/quality-metrics.md (quality standards)
   - Project-type-specific performance targets

### Phase 2: Architecture Analysis and Planning

**Objective**: Systematically analyze and plan system architecture

**Actions**:
1. **Use Sequential Thinking MCP** for architecture design:
   ```
   - Analyze functional requirements for system components
   - Determine data flow and integration patterns
   - Identify performance and scalability requirements
   - Assess security and compliance needs
   - Evaluate technology stack suitability
   - Plan component boundaries and interfaces
   ```

2. **System Decomposition**:
   - Identify major system components
   - Define component responsibilities
   - Determine component boundaries
   - Plan inter-component communication

3. **Data Architecture Planning** (coordinate with **database-specialist**):
   - Entity relationship design
   - Data flow patterns
   - Storage requirements
   - Caching strategy
   - Indexing strategy
   - Migration planning

### Phase 3: Frontend Architecture Design

**Objective**: Design frontend application architecture

**Actions**:
1. **Component Hierarchy Design**:
   - Page structure and routing
   - Component composition strategy
   - Shared component library planning
   - Layout and navigation architecture

2. **State Management Strategy**:
   - Local vs global state identification
   - State management approach (Context API, Zustand, etc.)
   - Server state management (React Query, SWR)
   - Form state handling

3. **UI/UX Architecture**:
   - Design system foundation
   - Responsive design approach
   - Accessibility architecture (WCAG 2.1 AA)
   - Theme and styling strategy

4. **Performance Optimization Planning**:
   - Code splitting strategy
   - Lazy loading approach
   - Image optimization
   - Bundle size management
   - Server Components vs Client Components (Next.js 15.5+)

5. **Routing Structure**:
   ```
   /app
   ├── (auth)
   │   ├── login
   │   └── register
   ├── (dashboard)
   │   ├── page.tsx
   │   └── [feature]
   └── api
       └── [routes]
   ```

### Phase 4: Backend Architecture Design

**Objective**: Design backend API and service architecture

**Actions**:
1. **API Endpoint Structure**:
   - RESTful API design principles
   - Resource-based routing
   - Versioning strategy
   - Endpoint organization

2. **Database Schema Design** (coordinate with **database-specialist**):
   - Entity models and relationships
   - Indexing strategy (primary keys, foreign keys, composite indexes)
   - Migration planning (zero-downtime migrations, rollback strategy)
   - Data validation rules
   - Query optimization considerations
   - Normalization vs denormalization decisions

3. **Authentication & Authorization** (coordinate with **security-specialist**):
   - Authentication strategy (JWT, session-based)
   - Authorization model (RBAC, ABAC)
   - Token management
   - Security best practices (OWASP Top 10)
   - Security headers configuration
   - Encryption strategy (at rest, in transit)

4. **Business Logic Organization**:
   - Service layer architecture
   - Repository pattern implementation
   - Dependency injection strategy
   - Error handling approach

5. **Module Structure** (Nest.js):
   ```
   src/
   ├── auth/
   │   ├── auth.module.ts
   │   ├── auth.controller.ts
   │   ├── auth.service.ts
   │   ├── strategies/
   │   └── guards/
   ├── users/
   │   ├── users.module.ts
   │   ├── users.controller.ts
   │   ├── users.service.ts
   │   └── entities/
   ├── [feature]/
   └── common/
       ├── filters/
       ├── interceptors/
       └── pipes/
   ```

### Phase 5: Integration Architecture Design

**Objective**: Design frontend-backend integration and data flow

**Actions**:
1. **Communication Patterns**:
   - HTTP REST API integration
   - Real-time communication (WebSocket/SSE if needed)
   - File upload and download flows
   - Error handling and retry strategies

2. **Error Handling Strategy**:
   - Frontend error boundaries
   - Backend exception filters
   - User-facing error messages
   - Error logging and monitoring

3. **Validation Architecture**:
   - Frontend input validation
   - Backend DTO validation
   - Schema validation consistency
   - Validation error handling

4. **Real-time Features** (if needed):
   - WebSocket architecture
   - Server-Sent Events (SSE)
   - Real-time data synchronization
   - Connection management

5. **File Handling** (if needed):
   - Upload architecture
   - Storage strategy (local, S3, CDN)
   - Processing pipelines
   - Download and streaming

### Phase 6: System Development Requirements Evaluation

**Objective**: Determine if specialized system development is needed

**Actions**:
1. **Assess Specialized Requirements**:
   - AI/ML processing needs
   - Video processing requirements
   - 3D conversion needs
   - High-performance computing
   - Real-time streaming
   - GPU acceleration

2. **If Specialized Requirements Exist**:
   - Mention **systemdev-specialist** skill
   - Document requirements in architecture
   - Plan integration with main application
   - Define API contracts for system services

3. **Document System Integration**:
   - System service architecture
   - API endpoints for specialized services
   - Data flow between main app and system services
   - Performance requirements

### Phase 7: Cross-Skill Collaboration for Validation

**Objective**: Validate architecture with implementation experts

**Collaboration Pattern**:
1. **Backend Validation**:
   - Mention **backend-nestjs** skill for:
     - API design feasibility
     - Module organization
     - Performance feasibility

2. **Database Validation**:
   - Mention **database-specialist** skill for:
     - Database schema validation
     - Query performance analysis
     - Indexing strategy review
     - Migration feasibility

3. **Security Validation**:
   - Mention **security-specialist** skill for:
     - Authentication/authorization architecture review
     - OWASP Top 10 compliance check
     - Security headers validation
     - Encryption strategy review

4. **Frontend Validation**:
   - Mention **frontend-nextjs** skill for:
     - Component architecture feasibility
     - State management approach validation
     - Performance optimization validation
     - UX pattern validation

5. **System Development Validation** (if needed):
   - Mention **systemdev-specialist** skill for:
     - Specialized technology feasibility
     - Integration pattern validation
     - Performance requirement validation

6. **Collaboration Documentation**:
   - Update .memory/collaboration.log.md with validation results
   - Record architectural decisions in .memory/decisions.md
   - Track validation effectiveness

### Phase 8: Architecture Documentation Creation

**Objective**: Create comprehensive architecture specifications

**Deliverables**:

1. **.memory/integration-architecture.md**:
   ```markdown
   # System Integration Architecture

   ## System Overview
   - High-level architecture diagram
   - Component interaction overview
   - Technology stack summary

   ## Frontend-Backend Integration
   - API communication patterns
   - Authentication flow
   - Error handling strategy
   - Real-time communication (if applicable)

   ## Data Flow Architecture
   - Request/response flow diagrams
   - State management data flow
   - Cache invalidation strategy

   ## Security Architecture
   - Authentication mechanism
   - Authorization flows
   - API security (CORS, rate limiting)
   - Data encryption (in transit, at rest)

   ## Performance Architecture
   - Caching strategy (frontend + backend)
   - CDN usage
   - Database query optimization
   - API response optimization

   ## Integration Patterns
   - API integration approach
   - Error handling and recovery
   - Retry and fallback strategies
   ```

2. **.memory/service-architecture.md**:
   ```markdown
   # Service Architecture

   ## Frontend Architecture
   ### Routing Structure
   - Page hierarchy
   - Route protection
   - Navigation patterns

   ### Component Architecture
   - Component hierarchy
   - Shared components
   - Composition patterns

   ### State Management
   - Global state approach
   - Server state management
   - Form state handling

   ### Performance Optimization
   - Code splitting points
   - Lazy loading strategy
   - Bundle optimization

   ## Backend Architecture
   ### API Structure
   - Endpoint organization
   - Versioning approach
   - Request/response patterns

   ### Database Architecture
   - Schema design
   - Relationship mappings
   - Indexing strategy
   - Migration approach

   ### Business Logic
   - Service layer organization
   - Repository pattern
   - Transaction management

   ### Authentication & Authorization
   - Auth mechanism details
   - Token management
   - Permission model

   ## System Services (if applicable)
   - AI/ML service architecture
   - Video processing pipeline
   - Real-time streaming setup
   - Integration with main application
   ```

3. **workspace/specs/openapi.yaml**:
   ```yaml
   openapi: 3.0.0
   info:
     title: [Project Name] API
     version: 1.0.0
     description: Complete API specification

   servers:
     - url: http://localhost:3001/api
       description: Development server

   paths:
     /auth/login:
       post:
         summary: User login
         tags: [Authentication]
         requestBody:
           required: true
           content:
             application/json:
               schema:
                 type: object
                 required: [email, password]
                 properties:
                   email:
                     type: string
                     format: email
                   password:
                     type: string
                     format: password
         responses:
           200:
             description: Login successful
             content:
               application/json:
                 schema:
                   type: object
                   properties:
                     accessToken:
                       type: string
                     refreshToken:
                       type: string
           401:
             description: Invalid credentials

     # [Additional endpoints...]

   components:
     schemas:
       # [Schema definitions...]
     securitySchemes:
       bearerAuth:
         type: http
         scheme: bearer
         bearerFormat: JWT
   ```

### Phase 9: Memory System Updates

**Objective**: Update memory with architecture completion

**Memory Updates**:

1. **Update .memory/active-context.md**:
   ```markdown
   ## Current Phase
   Phase: architecture_completed
   Progress: 35%

   ## Completed Tasks
   - ✅ Requirements analysis
   - ✅ Research analysis
   - ✅ Architecture design

   ## Next Milestones
   1. Implementation (frontend + backend parallel)
   2. Integration and testing

   ## Architecture Summary
   - Frontend: Next.js 15.5+ App Router, Tailwind CSS, Shadcn/ui
   - Backend: Nest.js, PostgreSQL, JWT auth
   - Integration: REST API, real-time [WebSocket if applicable]
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "currentPhase": "architecture_completed",
     "progress": {
       "overall": 35,
       "phases": {
         "requirements_analysis": 100,
         "research_analysis": 100,
         "architecture_design": 100,
         "implementation": 0
       }
     },
     "expert_engagement_status": {
       "pm": { "status": "active", "completion": 100 },
       "research": { "status": "completed", "completion": 100 },
       "fullstack": { "status": "completed", "completion": 100 }
     }
   }
   ```

3. **Update .memory/decisions.md**:
   ```markdown
   ## [YYYY-MM-DD] Architecture Design Decisions

   ### Frontend Architecture
   **Decision**: Next.js 15.5+ App Router with Server Components
   **Rationale**: Best performance, SEO, and developer experience
   **Alternatives Considered**: Pages Router (deprecated)
   **Impact**: Component structure, data fetching patterns

   ### Backend Architecture
   **Decision**: Nest.js with modular architecture
   **Rationale**: Type safety, scalability, maintainability
   **Alternatives Considered**: Express.js (less structure)
   **Impact**: Code organization, testing strategy

   ### Database Design
   **Decision**: PostgreSQL with Prisma ORM
   **Rationale**: Type safety, migrations, query builder
   **Impact**: Database operations, schema management

   ### Authentication Strategy
   **Decision**: JWT with refresh tokens
   **Rationale**: Stateless, scalable, secure
   **Impact**: Auth flows, token management
   ```

## Completion Criteria

**All criteria must be met before proceeding**:

- ✅ **Integration Architecture Complete**: .memory/integration-architecture.md with comprehensive system design
- ✅ **Service Architecture Complete**: .memory/service-architecture.md with frontend and backend specs
- ✅ **API Specification Created**: workspace/specs/openapi.yaml with complete endpoint definitions
- ✅ **Frontend Architecture Validated**: Component and routing structure confirmed
- ✅ **Backend Architecture Validated**: API and database design confirmed
- ✅ **Expert Validation Complete**: Collaboration with implementation experts done
- ✅ **System Development Identified**: Specialized requirements documented (if applicable)
- ✅ **Memory System Updated**: All .memory/ files reflect architecture completion

## Verification Steps

1. **Documentation Completeness**:
   - Confirm architecture documents provide clear implementation guidance
   - Verify OpenAPI spec is valid and complete
   - Check that all requirements are addressed in architecture

2. **Implementation Readiness**:
   - Verify backend and frontend can implement independently
   - Check that integration points are clearly defined
   - Ensure system development can proceed (if needed)

3. **Context Preservation**:
   - Check .memory/active-context.md reflects architecture completion
   - Verify .memory/decisions.md contains architectural decisions
   - Ensure .memory/collaboration.log.md documents validation discussions

## Next Workflows

**Sequential** (if system development needed):
→ **04-system-development.md**: Specialized system development (AI/ML, video, etc.)

**Sequential** (standard path):
→ **05-implementation.md**: Frontend and backend parallel implementation

## Common Issues and Resolutions

**Issue**: Requirements too vague for architecture design
**Resolution**: Mention pm-orchestrator to refine requirements, make documented assumptions

**Issue**: Technology choices conflict with architecture patterns
**Resolution**: Review .memory/tech-stack-analysis.md, adjust architecture or technology to align

**Issue**: Performance requirements unclear
**Resolution**: Establish performance targets based on project type quality standards

**Issue**: Integration complexity underestimated
**Resolution**: Break down into smaller integration points, use Sequential Thinking MCP for detailed planning

## Output Example

**Success Output**:
```
Architecture Design Completed
==============================

✅ Integration Architecture: .memory/integration-architecture.md (complete system design)
✅ Service Architecture: .memory/service-architecture.md (frontend + backend specs)
✅ API Specification: workspace/specs/openapi.yaml (25 endpoints defined)
✅ Frontend Validation: Component architecture confirmed
✅ Backend Validation: API and database design confirmed
✅ Memory System: Updated with architecture decisions

Architecture Summary:
- Frontend: Next.js 15.5+ App Router, 15 pages, 40+ components planned
- Backend: Nest.js modular architecture, 8 modules, PostgreSQL schema
- Integration: REST API with JWT auth, real-time WebSocket for notifications
- Performance: Server Components, code splitting, optimistic updates

Next Steps:
→ Implementation workflow starting (frontend + backend parallel)
```
