# Implementation Workflow

## Overview

- **Primary Skill**: pm-orchestrator (coordination)
- **Domain Skills**: frontend-nextjs, mobile-react-native, backend-nestjs, backend-fastapi, database-specialist, security-specialist, fullstack-integration
- **Dependencies**: architecture-design (03) must be complete; system-development (04) if applicable
- **Parallel Execution**: Frontend and Backend can run in PARALLEL after architecture design

## Workflow Purpose

This workflow coordinates the **parallel implementation phase** where domain skills autonomously develop frontend, backend, and other components. The key challenge is ensuring multiple skills work cohesively without blocking each other.

## Domain Skill Coordination Matrix

### Skill Responsibilities

| Skill | Primary Responsibility | Output Artifacts | Blocks On |
|-------|----------------------|------------------|-----------|
| **frontend-nextjs** | UI components, pages, client-side logic | `/workspace/frontend/` | API contracts (can mock) |
| **mobile-react-native** | Mobile app, native modules | `/workspace/mobile/` | API contracts (can mock) |
| **backend-nestjs** | REST/GraphQL API, business logic | `/workspace/backend/` | Database schema |
| **backend-fastapi** | Python API, AI/ML endpoints | `/workspace/api/` | Database schema |
| **database-specialist** | Schema design, migrations, query optimization | `/workspace/backend/migrations/` | Architecture design |
| **security-specialist** | Auth module, security config, guards | `/workspace/backend/src/security/` | Architecture design |
| **fullstack-integration** | Architecture oversight, type sharing | Shared types, contracts | None |

### Parallel Execution Pattern

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Phase 1: Shared Types First                       │
│                  fullstack-integration creates                       │
│                    /workspace/shared/types/                          │
└─────────────────────────────────────────────────────────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │  Frontend Impl  │ │  Backend Impl   │ │  Mobile Impl    │
    │  (frontend-*)   │ │  (backend-*)    │ │  (mobile-*)     │
    │  PARALLEL       │ │  PARALLEL       │ │  PARALLEL       │
    └─────────────────┘ └─────────────────┘ └─────────────────┘
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  ▼
                    ┌─────────────────────────┐
                    │   Integration Phase     │
                    │   (06-integration.md)   │
                    └─────────────────────────┘
```

## Workflow Steps

### Phase 1: Implementation Planning and Contract Definition

**Objective**: Establish shared contracts and interfaces before parallel implementation

**Primary Skill**: fullstack-integration

**Actions**:

1. **Read Architecture Documentation**:
   - `.memory/integration-architecture.md` (system architecture)
   - `.memory/api-endpoints.md` (API contract definitions)
   - `.memory/database-schema.md` (data models)
   - `.memory/active-context.md` (project context)

2. **Create Shared Type Definitions**:
   ```
   workspace/
   ├── shared/
   │   ├── types/
   │   │   ├── api.types.ts       # API request/response types
   │   │   ├── domain.types.ts    # Domain entity types
   │   │   ├── auth.types.ts      # Authentication types
   │   │   └── index.ts           # Export barrel
   │   └── contracts/
   │       ├── endpoints.json     # OpenAPI-lite endpoint definitions
   │       └── events.json        # WebSocket event contracts
   ```

3. **Define API Contracts**:
   For each endpoint, define:
   - HTTP method and path
   - Request body schema
   - Response schema
   - Error response formats
   - Authentication requirements

4. **Establish Mock Data**:
   Create mock data files for frontend development:
   ```
   workspace/shared/mocks/
   ├── users.mock.json
   ├── [entity].mock.json
   └── responses.mock.ts
   ```

**Output**:
- Shared type definitions created
- API contracts documented
- Mock data available for frontend

### Phase 2: Backend Implementation (Parallel Track A)

**Objective**: Implement complete backend API and business logic

**Primary Skills**: backend-nestjs OR backend-fastapi (based on project type)

**Actions**:

1. **Project Initialization**:
   
   **NestJS** (TypeScript/Enterprise):
   ```bash
   cd workspace
   nest new backend --package-manager npm --skip-git --language TS
   ```
   
   **FastAPI** (Python/AI-ML):
   ```bash
   cd workspace
   mkdir -p api/app/{routers,models,schemas,services,core}
   python -m venv venv
   pip install fastapi uvicorn sqlalchemy pydantic[email] python-jose passlib bcrypt
   ```

2. **Core Module Implementation**:
   
   **Module Priority Order**:
   1. **Database Configuration** - Connection, migrations, ORM setup (coordinate with **database-specialist**)
   2. **Authentication Module** - JWT, sessions, guards (coordinate with **security-specialist**)
   3. **User Module** - Registration, profile, management
   4. **Domain Modules** - Core business logic entities
   5. **Integration Points** - WebSockets, file upload, external APIs
   
   **Specialist Coordination**:
   - **database-specialist** reviews and optimizes schema design, creates migrations, advises on indexing
   - **security-specialist** reviews auth implementation, configures security headers, validates OWASP compliance

3. **For Each Module**:
   ```
   1. Create entity/model (database schema)
   2. Create DTOs/schemas (validation)
   3. Create service (business logic)
   4. Create controller/router (API endpoints)
   5. Create unit tests
   6. Update OpenAPI documentation
   ```

4. **Security Implementation**:
   - Password hashing (bcrypt)
   - JWT token generation and validation
   - Route guards and decorators
   - Input validation (class-validator / Pydantic)
   - Rate limiting

5. **API Documentation**:
   - Swagger/OpenAPI auto-generation
   - All endpoints documented with examples
   - Authentication requirements specified

**Memory Updates During Implementation**:
```markdown
# Update .memory/api-endpoints.md as endpoints are implemented:

## Implemented Endpoints

### Auth Module
- [x] POST /api/auth/register - User registration
- [x] POST /api/auth/login - User login
- [x] POST /api/auth/refresh - Token refresh
- [x] POST /api/auth/logout - User logout

### User Module
- [x] GET /api/users/me - Current user profile
- [x] PATCH /api/users/me - Update profile
- [ ] ... (update as implemented)
```

### Phase 3: Frontend Implementation (Parallel Track B)

**Objective**: Implement complete frontend UI and client-side logic

**Primary Skill**: frontend-nextjs OR mobile-react-native

**Actions**:

1. **Project Initialization**:
   
   **Next.js**:
   ```bash
   cd workspace
   npx create-next-app@latest frontend --yes --typescript --tailwind --eslint --app --src-dir --use-npm
   cd frontend
   npx shadcn@latest init -d
   npm install lucide-react @tanstack/react-query axios
   ```
   
   **React Native (Expo)**:
   ```bash
   cd workspace
   npx create-expo-app@latest mobile --template blank-typescript --yes
   cd mobile
   npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
   ```

2. **Core Setup**:
   - API client configuration (axios instance)
   - Authentication context/store
   - Theme and design tokens
   - Layout components
   - Error boundary

3. **Page/Screen Implementation Priority**:
   ```
   1. Layout Components - Navigation, headers, footers
   2. Auth Pages - Login, register, forgot password
   3. Dashboard/Home - Main landing after auth
   4. Domain Pages - Core feature pages
   5. Settings - User preferences, profile
   6. Error Pages - 404, 500, error states
   ```

4. **For Each Page/Component**:
   ```
   1. Create page/screen component
   2. Add responsive layout (Tailwind / StyleSheet)
   3. Implement data fetching (React Query / hooks)
   4. Add loading and error states
   5. Implement form validation
   6. Add accessibility attributes
   7. Create component tests
   ```

5. **API Integration (with mocks initially)**:
   ```typescript
   // Use mock data initially, switch to real API when ready
   const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
   
   // Can develop with mocks
   const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
   ```

**Memory Updates During Implementation**:
```markdown
# Update .memory/ui-components.md as components are implemented:

## Implemented Components

### Layout
- [x] MainLayout - Primary app layout with navigation
- [x] AuthLayout - Login/register page layout
- [x] DashboardLayout - Dashboard with sidebar

### Authentication
- [x] LoginForm - Email/password login
- [x] RegisterForm - User registration
- [ ] ... (update as implemented)
```

### Phase 4: Mobile Implementation (Parallel Track C - if applicable)

**Objective**: Implement mobile application alongside web frontend

**Primary Skill**: mobile-react-native

**Actions**:
1. Follow React Native/Expo initialization from Phase 3
2. Share types and API client patterns with web frontend
3. Implement platform-specific navigation (React Navigation)
4. Add native module integrations as needed
5. Ensure performance targets (cold start <3s, 60fps)

### Phase 5: Coordination Checkpoints

**Objective**: Synchronize parallel tracks at key milestones

**Primary Skill**: pm-orchestrator

**Checkpoint Schedule**:

| Checkpoint | Trigger | Validation |
|------------|---------|------------|
| **CP1: Foundation** | After core modules | Shared types match, auth pattern aligned |
| **CP2: Entities** | After domain modules | API contracts match frontend expectations |
| **CP3: Features** | After main features | End-to-end flow possible (manual test) |
| **CP4: Polish** | Before integration | All modules complete, ready for integration |

**At Each Checkpoint**:

1. **Read Memory Files**:
   - `.memory/api-endpoints.md` - Backend progress
   - `.memory/ui-components.md` - Frontend progress
   - `.memory/active-context.md` - Overall status

2. **Validate Alignment**:
   - API contracts match frontend usage
   - Type definitions consistent
   - Authentication flow compatible
   - Error handling patterns aligned

3. **Resolve Misalignments**:
   - If contract mismatch: Update shared types, notify both tracks
   - If blocking dependency: Prioritize unblocking work
   - If scope creep: Document in decisions.md, adjust plan

4. **Update Memory**:
   ```markdown
   # .memory/collaboration.log.md
   
   ## Checkpoint CP2: Entity Implementation
   Date: [YYYY-MM-DD]
   
   ### Status
   - Backend: Users, Auth, [Entity1] complete
   - Frontend: Auth pages, Dashboard complete
   
   ### Alignment Check
   - [x] User entity types match
   - [x] Auth tokens handled consistently
   - [x] Error response format aligned
   
   ### Actions
   - Backend to add pagination to list endpoints
   - Frontend to implement loading states
   
   ### Next Checkpoint: CP3 (after main features)
   ```

### Phase 6: Parallel Conflict Resolution

**Objective**: Handle conflicts that arise during parallel development

**Common Conflict Patterns**:

| Conflict Type | Detection | Resolution |
|--------------|-----------|------------|
| **Type Mismatch** | Checkpoint validation | Update shared types, both tracks update |
| **API Contract Change** | Backend modifies endpoint | Notify frontend, update mocks, frontend adapts |
| **Schema Migration** | Database structure change | Run migration, update types, notify all tracks |
| **Feature Dependency** | Frontend needs backend feature | Backend prioritizes, frontend uses mock temporarily |

**Resolution Protocol**:

1. **Detect**: During checkpoint or when skill encounters blocker
2. **Document**: Add to `.memory/decisions.md` with impact assessment
3. **Notify**: Mention affected skill(s) in coordination message
4. **Resolve**: Affected skills adapt to resolution
5. **Validate**: Confirm resolution at next checkpoint

### Phase 7: Implementation Quality Gates

**Objective**: Ensure quality standards during implementation (not just at end)

**Per-Module Quality Checks**:

**Backend Module Complete When**:
- [ ] All endpoints implemented per contract
- [ ] Input validation on all endpoints
- [ ] Error handling with consistent format
- [ ] Unit tests for service layer (80%+ coverage)
- [ ] OpenAPI documentation updated
- [ ] No TypeScript/mypy errors

**Frontend Component Complete When**:
- [ ] Responsive design (mobile-first)
- [ ] Loading and error states
- [ ] Accessibility attributes (WCAG 2.1 AA)
- [ ] No emojis in code (Lucide Icons only)
- [ ] Component tests
- [ ] No TypeScript errors

**Run Quality Validation**:
```bash
# Backend (NestJS)
cd workspace/backend && npm run lint && npm run test:cov && npm run build

# Backend (FastAPI)
cd workspace/api && mypy --strict . && pytest --cov=.

# Frontend
cd workspace/frontend && npm run lint && npm run test && npm run build

# Mobile
cd workspace/mobile && npm run lint && npm run test
```

### Phase 8: Implementation Completion

**Objective**: Finalize implementation phase and prepare for integration

**Actions**:

1. **Final Implementation Review**:
   - All planned modules implemented
   - All API endpoints operational
   - All UI pages/screens complete
   - All tests passing
   - No critical linting errors

2. **Documentation Update**:
   
   **Create/Update `.memory/implementation-status.md`**:
   ```markdown
   # Implementation Status
   
   ## Backend Implementation
   Skill: backend-nestjs
   Status: COMPLETE
   
   ### Modules Implemented
   - [x] Database Configuration (PostgreSQL + TypeORM)
   - [x] Authentication (JWT + Refresh Tokens)
   - [x] User Management (CRUD + Profile)
   - [x] [Domain Module 1] ([Feature description])
   - [x] [Domain Module 2] ([Feature description])
   
   ### API Endpoints
   - Total: 24 endpoints
   - Documented: 24/24
   - Tested: 22/24 (92%)
   
   ### Quality Metrics
   - Test Coverage: 85%
   - TypeScript Errors: 0
   - Lint Errors: 0
   
   ## Frontend Implementation
   Skill: frontend-nextjs
   Status: COMPLETE
   
   ### Pages Implemented
   - [x] Authentication (login, register, forgot-password)
   - [x] Dashboard (overview, widgets)
   - [x] [Feature Pages] ([Page list])
   - [x] Settings (profile, preferences)
   - [x] Error Pages (404, 500)
   
   ### Components
   - Total: 45 components
   - Documented: 40/45
   - Tested: 38/45 (84%)
   
   ### Quality Metrics
   - TypeScript Errors: 0
   - Lint Errors: 0
   - Accessibility: WCAG 2.1 AA compliant
   
   ## Mobile Implementation (if applicable)
   [Similar structure]
   
   ## Ready for Integration
   - [x] All backend endpoints operational
   - [x] All frontend pages complete
   - [x] Shared types synchronized
   - [x] API contracts finalized
   - [x] Mock data can be replaced with real API
   ```

3. **Memory System Updates**:

   **Update `.memory/active-context.md`**:
   ```markdown
   ## Current Phase
   Phase: implementation_completed
   Progress: 60%
   
   ## Completed Tasks
   - [x] Requirements analysis
   - [x] Research analysis
   - [x] Architecture design
   - [x] Backend implementation
   - [x] Frontend implementation
   - [x] Mobile implementation (if applicable)
   
   ## Implementation Summary
   - Backend: 24 endpoints, 85% test coverage
   - Frontend: 45 components, WCAG compliant
   - Mobile: [Summary if applicable]
   
   ## Next Milestones
   1. Integration testing (06-integration.md)
   2. Quality assurance
   3. Deployment preparation
   ```

   **Update `.memory/project-state.json`**:
   ```json
   {
     "currentPhase": "implementation_completed",
     "progress": {
       "overall": 60,
       "phases": {
         "requirements_analysis": 100,
         "research_analysis": 100,
         "architecture_design": 100,
         "implementation": 100,
         "integration": 0,
         "quality_assurance": 0,
         "deployment": 0
       }
     },
     "implementation": {
       "backend": {
         "status": "complete",
         "endpoints": 24,
         "testCoverage": 85
       },
       "frontend": {
         "status": "complete",
         "components": 45,
         "pages": 12
       },
       "mobile": {
         "status": "complete|not_applicable",
         "screens": 10
       }
     }
   }
   ```

## Completion Criteria

**All criteria must be met before proceeding to integration**:

- [ ] **Backend Complete**: All API endpoints implemented and documented
- [ ] **Frontend Complete**: All pages/components implemented
- [ ] **Mobile Complete**: All screens implemented (if applicable)
- [ ] **Tests Passing**: Unit tests passing for all tracks
- [ ] **Types Synchronized**: Shared types match across all tracks
- [ ] **Quality Gates Passed**: Lint, type-check, build all passing
- [ ] **Documentation Updated**: Implementation status and decisions documented
- [ ] **Memory Updated**: All implementation context recorded

## Verification Steps

1. **Build Verification**:
   ```bash
   # All builds must succeed
   cd workspace/backend && npm run build
   cd workspace/frontend && npm run build
   cd workspace/mobile && npm run build  # if applicable
   ```

2. **Test Verification**:
   ```bash
   # All tests must pass
   cd workspace/backend && npm run test
   cd workspace/frontend && npm run test
   cd workspace/mobile && npm run test  # if applicable
   ```

3. **Type Verification**:
   ```bash
   # No type errors
   cd workspace/backend && npx tsc --noEmit
   cd workspace/frontend && npx tsc --noEmit
   ```

## Next Workflows

**Sequential**:
→ **06-integration.md**: System integration and end-to-end testing

## Common Issues and Resolutions

**Issue**: Frontend blocked waiting for backend API
**Resolution**: Use mock data with matching contract, implement API client with mock toggle

**Issue**: Type definitions diverged between frontend and backend
**Resolution**: Single source of truth in /workspace/shared/types/, generate from OpenAPI

**Issue**: Database schema changed mid-implementation
**Resolution**: Run migration, update types, notify frontend to update affected components

**Issue**: Feature scope expanded during implementation
**Resolution**: Document in decisions.md, assess impact, adjust timeline or defer to next iteration

**Issue**: Performance issues in implementation
**Resolution**: Address critical issues now, document non-critical for optimization phase

## Output Example

**Success Output**:
```
Implementation Phase Completed
==============================

Backend Implementation (backend-nestjs):
✅ Project: NestJS 10.x + TypeORM + PostgreSQL
✅ Modules: auth, users, [domain1], [domain2], [domain3]
✅ Endpoints: 24 total, all documented
✅ Test Coverage: 85% (target: 80%)
✅ Build: Successful

Frontend Implementation (frontend-nextjs):
✅ Project: Next.js 15 + Tailwind 4 + Shadcn/ui
✅ Pages: 12 routes implemented
✅ Components: 45 total, all documented
✅ Accessibility: WCAG 2.1 AA compliant
✅ Build: Successful

Mobile Implementation (mobile-react-native):
✅ Project: Expo 52 + React Navigation
✅ Screens: 10 screens implemented
✅ Performance: Cold start <3s, 60fps maintained
✅ Build: Successful

Shared Contracts:
✅ Types: 15 shared type definitions
✅ API Contract: OpenAPI 3.0 spec generated
✅ Mocks: All entities mocked for testing

Quality Gates:
✅ TypeScript: 0 errors across all tracks
✅ ESLint: 0 errors, 3 warnings (non-critical)
✅ Tests: 156 passing, 0 failing
✅ Build: All tracks build successfully

Next Steps:
→ Proceeding to integration workflow (06-integration.md)
→ Frontend will connect to real backend API
→ End-to-end testing will validate full flows
```
