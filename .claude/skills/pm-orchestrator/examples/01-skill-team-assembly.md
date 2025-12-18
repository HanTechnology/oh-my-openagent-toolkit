# Example: Skill Team Assembly for Web Application

## Scenario

User requests: "Create a Next.js e-commerce app with user authentication and Stripe payments"

## Team Assembly Process

### Step 1: Project Detection

project-detector analyzes request and returns:

```
Project Type: web_application (confidence: 95/100)

Keyword Matches (40pts):
- "e-commerce" → web_application (15pts)
- "authentication" → web_application (10pts)
- "Next.js" → web_application (15pts)

Framework Detection (35pts):
- "Next.js" → frontend framework (35pts)

Technology Detection (25pts):
- "Stripe" → payment integration (15pts)
- "authentication" → security requirement (10pts)

Total Score: 100/100 → web_application
```

### Step 2: Skill Team Assembly

pm-orchestrator receives project type and assembles team:

```markdown
## Skill Team Assembly for: E-Commerce Platform (web_application)

### Infrastructure Skills (Always Active)
1. **pm-orchestrator**: Project coordination and workflow management
2. **project-detector**: Completed detection, standby for re-detection
3. **memory-manager**: Memory system initialization and maintenance
4. **quality-controller**: Quality standards enforcement

### Domain Skills (Contextually Activated)

**Core Development Team:**
1. **frontend-nextjs**: UI/UX implementation
   - Next.js 15.5+ with App Router
   - Tailwind CSS 4.1+, Shadcn/ui
   - Product catalog, cart, checkout UI

2. **backend-nestjs**: API development
   - NestJS with TypeScript
   - PostgreSQL with TypeORM
   - Stripe integration, JWT auth

3. **database-specialist**: Data architecture
   - Schema design for products, users, orders
   - Migration strategy
   - Query optimization

4. **security-specialist**: Security implementation
   - JWT authentication
   - Password hashing (bcrypt)
   - Stripe webhook security

**Integration & Operations Team:**
5. **fullstack-integration**: Architecture coordination
   - API contract design
   - Frontend-backend integration
   - Type-safe interfaces

6. **devops-deployment**: Infrastructure
   - Docker containerization
   - CI/CD with GitHub Actions
   - Cloud deployment (Railway)

7. **qa-testing**: Quality assurance
   - E2E testing with Playwright MCP
   - Performance testing
   - Accessibility validation (WCAG 2.1 AA)

### Skills NOT Activated (Not Required for This Project)
- mobile-react-native: No mobile app requirement
- backend-fastapi: Using NestJS (TypeScript preference)
- systemdev-specialist: No AI/ML or GPU requirements
- research-analysis: Standard e-commerce, no novel research needed
- mcp-tools-orchestrator: Standard MCP usage sufficient
```

### Step 3: Natural Language Coordination

pm-orchestrator initiates skill coordination:

```
pm-orchestrator: "E-commerce project initialized. Starting architecture design.
The fullstack-integration skill will coordinate system architecture.
Frontend-nextjs and backend-nestjs skills should prepare for implementation.
Database-specialist should plan the data model.
Security-specialist should design the authentication system."

→ Claude auto-invokes: fullstack-integration

fullstack-integration: "Designing system architecture for e-commerce.
Frontend-nextjs skill will implement Next.js 15.5+ UI with App Router.
Backend-nestjs skill will create NestJS REST API with PostgreSQL.
Database-specialist skill should design schema for products, users, orders."

→ Claude auto-invokes: frontend-nextjs, backend-nestjs, database-specialist
```

### Step 4: Quality Standards Activation

quality-controller sets standards for web_application:

```json
{
  "project_type": "web_application",
  "quality_standards": {
    "typescript_coverage": {
      "target": 95,
      "minimum": 85
    },
    "core_web_vitals": {
      "lcp": "<2.5s",
      "fid": "<100ms",
      "cls": "<0.1"
    },
    "lighthouse": {
      "performance": 90,
      "accessibility": 95,
      "best_practices": 90,
      "seo": 90
    },
    "security": {
      "high_severity": 0,
      "critical_severity": 0
    },
    "test_coverage": {
      "backend": 80,
      "frontend": 70
    }
  }
}
```

## Result

**Team Assembled**: 11 skills (4 infrastructure + 7 domain)
**Time**: ~2 seconds
**Memory Updated**: .memory/active-context.md, .memory/project-state.json
**Quality Standards**: web_application profile loaded

**Next Step**: Execute 01-requirements-analysis.md workflow
