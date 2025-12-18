# Example: Web Application Memory Initialization

## Scenario

User requests: "Create a Next.js e-commerce app with user authentication and Stripe payments"

## Memory Initialization Process

### Step 1: Detect Project Type
project-detector identifies: `web_application` (confidence: 95/100)

### Step 2: Initialize Core Memory Files

**Create `.memory/` directory structure:**

```
.memory/
├── active-context.md
├── decisions.md
├── collaboration.log.md
├── project-state.json
├── session-history.json
└── artifacts.manifest.json
```

### Step 3: Populate Core Files

#### active-context.md
```markdown
# E-Commerce Platform - Active Context

**Last Updated**: 2025-01-15 09:30:00 UTC
**Current Phase**: 03-Architecture Design (45% complete)
**Lifecycle State**: initial_development

## Current Focus
- Designing system architecture for e-commerce platform
- Defining API contracts between frontend and backend
- Planning database schema for products, users, and orders

## Active Skills
- pm-orchestrator: Coordinating workflow
- fullstack-integration: Designing architecture
- frontend-nextjs: (pending activation)
- backend-nestjs: (pending activation)

## Next Milestones
1. Complete architecture documentation
2. Define database schema
3. Start frontend implementation

## Blockers
- None currently

## Recent Changes
- [2025-01-15 09:15] Architecture design initiated
- [2025-01-15 09:00] Project detection completed
- [2025-01-15 08:45] Memory system initialized
```

#### project-state.json
```json
{
  "project": {
    "id": "ecommerce-platform-2025",
    "name": "E-Commerce Platform",
    "type": "web_application",
    "description": "Next.js e-commerce app with authentication and Stripe payments",
    "created_at": "2025-01-15T08:45:00Z",
    "updated_at": "2025-01-15T09:30:00Z"
  },
  "lifecycle": {
    "state": "initial_development",
    "target_version": "1.0.0",
    "current_workflow": "03-architecture-design"
  },
  "progress": {
    "overall": 15,
    "phases": {
      "01-requirements": 100,
      "02-research": 100,
      "03-architecture": 45,
      "04-implementation": 0,
      "06-integration": 0,
      "07-deployment": 0,
      "08-qa": 0
    }
  },
  "quality": {
    "target_coverage": 80,
    "current_coverage": 0,
    "lighthouse_target": 90,
    "security_issues": 0
  },
  "skills": {
    "active": ["pm-orchestrator", "fullstack-integration"],
    "pending": ["frontend-nextjs", "backend-nestjs", "qa-testing", "devops-deployment"],
    "completed": ["project-detector", "memory-manager"]
  }
}
```

#### decisions.md
```markdown
# E-Commerce Platform - Decisions Log

## Decision: 2025-01-15 - Technology Stack Selection

**Context**: Initial technology stack selection for e-commerce platform

**Decision**: 
- Frontend: Next.js 15.5+ with App Router, TypeScript strict, Tailwind CSS 4.1+, Shadcn/ui
- Backend: NestJS with TypeScript, PostgreSQL, TypeORM
- Payments: Stripe with webhook integration
- Auth: JWT with Passport.js

**Rationale**:
- Next.js chosen for SSR benefits, SEO optimization for e-commerce
- NestJS provides TypeScript-first backend with enterprise patterns
- PostgreSQL for relational data (products, orders, users)
- Stripe is industry standard for payments

**Trade-offs**:
- NestJS has steeper learning curve vs Express, but better long-term maintainability
- PostgreSQL chosen over MongoDB for transaction support in order processing

**Impact**: Foundation for all subsequent development decisions
```

### Step 4: Initialize Project-Type Specific Files

For web_application, also create:
```
.memory/
├── component-library.md       # UI component tracking
├── api-documentation.md       # API endpoint documentation
├── user-flows.md              # User journey documentation
└── performance-metrics.md     # Core Web Vitals tracking
```

### Step 5: Initialize Logging System

Create `.logs/` structure:
```
.logs/
├── sessions/
│   └── 2025-01-15-session-001.log
├── skills/
│   └── skill-activity.log
├── collaboration/
│   └── coordination.log
└── quality/
    └── metrics.log
```

## Result

Memory system fully initialized. Project ready for architecture design phase.

**Files Created**: 10 core + 4 project-type specific + 4 log directories
**Time**: ~5 seconds
**Next Action**: pm-orchestrator continues with 03-architecture-design workflow
