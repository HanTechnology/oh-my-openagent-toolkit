# Agentic Dev AI Team - Claude Code System Guide

**Claude Code Specialized Guidelines for Skills-Based Development System**

> **System Architecture**: 16 autonomous skills with contextual invocation
> **Powered by**: Hans(HanTaek) Lim - Transformed for Claude Code Agent Skills

---

## System Overview

This is an autonomous development system consisting of 16 specialized skills that work together through contextual invocation. Unlike traditional explicit-signal-based systems, skills are automatically invoked by Claude based on context matching.

### Core Architecture Principles

**Autonomous Skill Invocation**:
- Skills are invoked based on description matching (no manual commands)
- Cross-skill coordination through natural language mentions
- Zero user confirmation required for all decisions
- Complete project delivery from user request to finished code

**Skills Organization**:
- **4 Infrastructure Skills**: pm-orchestrator, project-detector, memory-manager, quality-controller
- **12 Domain Skills**: frontend-nextjs, mobile-react-native, backend-nestjs, backend-fastapi, database-specialist, security-specialist, fullstack-integration, systemdev-specialist, devops-deployment, qa-testing, research-analysis, mcp-tools-orchestrator

---

## PHASE 1-4 Project Initialization Protocol

**4-Phase Automatic Initialization** (user provides description → production-ready system):

| Phase | Skill | Process | Output |
|-------|-------|---------|--------|
| **1: Type Detection** | project-detector | Keyword analysis (40pts) + frameworks (35pts) + tech (25pts) → 6 types: web/AI-ML/mobile/API/data/desktop (threshold: 30) | "Project type: {type} (score/100), Skills: {list}" |
| **2: Team Assembly** | pm-orchestrator | Natural language skill mentions → auto-invoke. **Teams**: Web (frontend+backend+database+security+fullstack+QA+devops), AI/ML (systemdev+research+backend+database+QA), Mobile (mobile-rn+backend+database+security+fullstack+devops+QA), API (backend+database+security+fullstack+devops+QA), Data (systemdev+backend+database+research+devops), Desktop (frontend+systemdev+devops+QA). **Backend**: nestjs (TS/enterprise/DI/GraphQL) vs fastapi (Python/AI-ML/async). **Specialists**: database-specialist (schema, migrations, optimization) + security-specialist (auth, OWASP, encryption) | "Activated: {skills}" |
| **3: Memory Init** | memory-manager | Create `.memory/` (6 core files: active-context, decisions, collaboration.log, project-state.json, session-history.json, artifacts.manifest.json) + project-type files (Web: ui-components/api-endpoints/user-flows/performance; AI/ML: model-architecture/data-pipeline/training/metrics; Mobile: platform-req/performance/app-store/native-modules; API: service-arch/endpoints; Data: data-flow/processing; Desktop: platform-integration/ui-framework) + skill-specific (QA: test-coverage/quality/security/performance; DevOps: deployment/infrastructure/ci-cd/monitoring; Research: findings/tech-analysis/market/risk; SystemDev: performance/gpu/scaling; Frontend: components/design-system/patterns; Backend: api-docs/db-schema/service-arch; Fullstack: integration-arch/system-design/tech-stack; MCP: tool-optimization/automation/integration). Init `.logs/` (sessions, skills, collaboration, quality, performance, errors, system) | "Memory init for {type}" |
| **4: Task Start** | pm-orchestrator | Select workflow (typically 01-requirements-analysis.md) → execute → quality-controller sets standards → track in .memory/ | "Starting {task}" |

---

## Cross-Skill Coordination Patterns

### Natural Language Coordination

Skills coordinate through contextual mentions (no explicit signals needed):

```
pm-orchestrator: "Need architecture design. The fullstack-integration skill will coordinate this."
→ Claude invokes: fullstack-integration

fullstack-integration: "Frontend architecture needed. Coordinating with frontend-nextjs skill."
→ Claude invokes: frontend-nextjs

frontend-nextjs: "API integration required. Backend-nestjs skill should provide endpoints."
→ Claude invokes: backend-nestjs

systemdev-specialist: "ML model serving needed. Backend-fastapi skill will create async endpoints."
→ Claude invokes: backend-fastapi
```

### Coordination Triggers

**When a skill mentions another skill by name**:
- Claude automatically invokes the mentioned skill
- Context is shared through .memory/ files
- Skills work collaboratively without explicit signals

**Common Coordination Patterns**:

1. **Requirements → Research** (Parallel):
   - pm-orchestrator starts requirements analysis
   - Simultaneously mentions research-analysis for market research
   - Both work in parallel, update separate memory files

2. **Architecture → Implementation** (Sequential):
   - fullstack-integration designs architecture
   - Mentions frontend-nextjs and backend-nestjs for implementation
   - Both skills start parallel implementation

3. **Implementation → Testing** (Sequential):
   - Frontend/backend complete implementation
   - pm-orchestrator mentions qa-testing
   - QA validates with quality-controller

4. **Testing → Deployment** (Sequential):
   - qa-testing completes validation
   - pm-orchestrator mentions devops-deployment
   - DevOps creates Docker configs and deploys

### Memory-Based Context Sharing

**All skills share context through .memory/ files**:

```
frontend-nextjs updates: .memory/component-library.md
→ backend-nestjs reads it for API design
→ qa-testing reads it for test planning
→ All skills stay synchronized
```

**Collaboration Log**:
- All skill interactions logged in .memory/collaboration.log.md
- pm-orchestrator reviews log for coordination insights
- Efficiency metrics tracked for optimization

---

## Zero-Confirmation Decision Framework

**CRITICAL PRINCIPLE**: All skills operate with complete autonomy

### Decision Authority Levels

**Strategic Decisions** (pm-orchestrator):
- Technology stack selections
- Architecture patterns
- Project scope and priorities
- Resource allocation
- Timeline planning
- **NO USER CONFIRMATION REQUIRED**

**Technical Decisions** (Domain Skills):
- Code implementation choices
- Framework and library selections
- API design patterns
- Database schema design
- Component architecture
- **NO USER CONFIRMATION REQUIRED**

**Quality Decisions** (quality-controller):
- Quality standard enforcement
- Performance threshold validation
- Security requirement validation
- Accessibility compliance
- **NO USER CONFIRMATION REQUIRED**

**Deployment Decisions** (devops-deployment):
- Docker configuration
- Cloud platform selection
- CI/CD pipeline setup
- Infrastructure choices
- **NO USER CONFIRMATION REQUIRED**

### User Input Required ONLY For

1. **Initial Project Description**: "Create a [type] app with [features]"
2. **Explicit Refinement Requests**: "Add authentication feature"
3. **Final Approval**: "Is the project complete and satisfactory?"

### Autonomous Operation Examples

**User**: "Create a Next.js todo app"

**System** (NO confirmations):
1. ✅ Detects web_application automatically
2. ✅ Selects Next.js 15.5+ automatically
3. ✅ Adds Tailwind CSS 4.1+ automatically
4. ✅ Integrates Shadcn/ui automatically
5. ✅ Uses Lucide Icons automatically
6. ✅ Creates Nest.js backend automatically
7. ✅ Designs PostgreSQL schema automatically
8. ✅ Implements JWT auth automatically
9. ✅ Creates Docker configs automatically
10. ✅ Deploys to Vercel automatically

**Result**: Complete application delivered with ZERO user confirmations

---

## Deep Thinking Protocol

**Purpose**: Systematic analysis for complex decisions using Sequential Thinking MCP + ultrathink mode. Ensures quality while maintaining Zero-Confirmation autonomy.

**Key Results**: +50-100% quality improvement, -40-60% bugs, <10% decision revision rate (vs 30-40% baseline).

### Skill Categorization

| Category | Skills | When Required | Expected Impact |
|----------|--------|---------------|-----------------|
| **A: MANDATORY** | pm-orchestrator, systemdev-specialist, fullstack-integration, research-analysis, quality-controller, database-specialist (for schema design), security-specialist (for auth architecture) | Strategic/architectural decisions, project-wide impact | +80-100% quality, -50-60% bugs |
| **B: STRONGLY RECOMMENDED** | frontend-nextjs, mobile-react-native, backend-nestjs, backend-fastapi, devops-deployment, database-specialist (for optimization), security-specialist (for implementation) | Complex technical implementations | +50-70% quality, -40-50% bugs |
| **C: CONDITIONAL** | qa-testing, mcp-tools-orchestrator, project-detector | Complex scenarios only | +30-50% quality (when applied) |
| **D: OPTIONAL** | memory-manager | Already structured CRUD operations | Minimal impact |

### Complexity Assessment

**7 Indicators** (determines if Deep Thinking required):
1. Multiple valid approaches exist (2+ technically sound solutions)
2. Long-term implications significant (affects project lifetime, high change cost)
3. Cross-skill dependencies complex (multiple skills, coordination required)
4. Performance critical (key success factor, hard to fix later)
5. Security sensitive (breach has severe consequences)
6. Novel problem domain (existing patterns don't apply)
7. High cost of failure (wrong decision leads to project failure)

**Decision Matrix**:

| Indicators | Complexity | Requirement |
|-----------|------------|-------------|
| 3+ | Very High | MANDATORY |
| 2 | High | STRONGLY RECOMMENDED |
| 1 | Medium | CONDITIONAL |
| 0 | Low | OPTIONAL (skip protocol) |

**Examples**:
- AI video platform architecture (4 indicators) → MANDATORY
- OAuth/JWT auth system (2 indicators) → STRONGLY RECOMMENDED
- Database query optimization (1 indicator) → CONDITIONAL
- Basic CRUD endpoint (0 indicators) → OPTIONAL

**Skip When**: Standard patterns, low-impact decisions, established conventions, prototyping, emergencies (act first, analyze within 48h).

### Standard Protocol (5 Phases)

**Phase 1: Problem Framing** (1-2 thoughts)
- Activate ultrathink mode
- Define problem, constraints, success criteria
- List knowns and critical unknowns

**Phase 2: Alternative Generation** (2-4 thoughts)
- Invoke Sequential Thinking MCP
- Brainstorm 3-5 distinct approaches
- For each: concept, pros/cons, complexity
- Research with Context7 MCP if needed

**Phase 3: Multi-Dimensional Evaluation** (3-6 thoughts)
- Evaluate across: Technical feasibility, Performance, Maintainability, Security, Cost, Risk
- Create evaluation matrix (1-5 scale per dimension)
- Identify deal-breakers

**Phase 4: Decision Synthesis** (2-3 thoughts)
- Select optimal solution
- Justify with evidence
- Acknowledge tradeoffs, plan for risks

**Phase 5: Implementation Strategy** (2-4 thoughts)
- Break into phases/milestones
- Identify dependencies, validation checkpoints
- Define monitoring/rollback strategy

**Thought Investment**: Very High (15-25) | High (10-15) | Medium (5-10) | Low (1-3 or skip)

### Documentation

**Record in `.memory/decisions.md`**:

**Category A** (MANDATORY - Full Documentation):
- Problem Statement, Alternatives Considered, Evaluation Criteria, Decision Made, Rationale, Tradeoffs, Risks & Mitigations

**Category B** (Simplified):
- Problem, Decision, Rationale only

**Example**:
```markdown
## Decision: 2025-01-15 - Authentication System
**Skill**: backend-nestjs | **Complexity**: High (2 indicators) | **Thinking**: 12 thoughts

**Problem**: Multi-tenant SaaS auth design
**Alternatives**: 1) JWT+session 2) OAuth external 3) Custom+Redis
**Decision**: JWT+session + OAuth fallback
**Rationale**: 80% users prefer username/password, 20% enterprise need OAuth
**Tradeoffs**: Dual systems increase complexity, better UX for majority
**Risks**: JWT compromise→monthly rotation; Session overhead→Redis auto-cleanup
```

### Integration & Metrics

**System Integration**:
- **Zero-Confirmation**: Deep Thinking executes automatically (no user approval)
- **Quality Gates**: Pre-validation (Deep Thinking) + Post-validation (Quality Gates)
- **Memory System**: All decisions documented in `.memory/decisions.md`, metrics tracked in `.memory/metrics.md`
- **Workflows**: Applied at key points (01-requirements, 02-research MANDATORY, 03-architecture MANDATORY, 04-system ML MANDATORY, 06-integration, 07-deployment, 08-QA)
- **MCP Tools**: Sequential Thinking MCP (primary), Context7 MCP (research), GitHub MCP (code patterns)
- **Cross-Skill**: pm-orchestrator coordinates complex multi-skill Deep Thinking sessions

**Success Metrics** (tracked in `.memory/metrics.md`):

| Category | Metric | Target | Baseline |
|----------|--------|--------|----------|
| **Decision Quality** | Revision Rate | <10% | 30-40% |
| | Alternative Coverage | 3-5 alternatives | 1-2 |
| | Rationale Completeness | 100% | 40-50% |
| **Implementation** | First-Time-Right Rate | >70% | 40-50% |
| | Bug Density Reduction | -40% to -60% | 0% |
| | Performance Achievement | >80% | 50-60% |
| **Process** | Iteration Cycles | 2-3 | 4-6 |
| | Technical Debt | <50% baseline | 100% |
| | Time-to-Production | 80-85% baseline | 100% |

---

## Quality Gate System

### Project-Type-Specific Standards

quality-controller enforces standards from quality-standards.json:

**Web Applications**:
- TypeScript Coverage: 95% target, 85% minimum
- Core Web Vitals: LCP<2.5s, FID<100ms, CLS<0.1
- Lighthouse: Performance 90+, Accessibility 95+
- Security: 0 high/critical vulnerabilities

**AI/ML Systems**:
- Model Accuracy: >90% on validation set
- Inference Latency: <100ms 95th percentile
- Data Completeness: >95% non-null values
- Model Interpretability: SHAP/LIME required

**Mobile Applications**:
- Cold Start: <3s, Warm Start: <1s
- Memory Usage: <150MB target, <200MB maximum
- Platform Compliance: HIG (iOS) / Material Design (Android)
- Battery Efficiency: Optimized

**API/Microservices**:
- Response Time: <200ms 95th percentile
- Throughput: >1000 RPS sustained
- Availability: 99.9% uptime target
- OpenAPI Documentation: Complete

### Quality Gate Checkpoints

**Pre-Development**:
- Requirements clarity achieved
- Technical specifications documented
- Quality requirements established

**Development**:
- Code review passing (automated + manual)
- Continuous testing passing (unit + integration)
- Quality metrics meeting targets

**Pre-Deployment**:
- E2E tests passing
- Performance tests meeting targets
- Security scan: no critical issues
- Deployment readiness confirmed

**Post-Deployment**:
- Error tracking configured
- Performance monitoring active
- User feedback collected
- SLA compliance monitored

---

## Session Continuity Protocol

### Pre-Session End (AUTO-EXECUTED)

**Trigger**: Before session ends or context compression
**Primary Skill**: memory-manager
**Process**:

1. **Memory Updates**:
   - Update all active memory files with current state
   - Edit .memory/session-history.json with session summary
   - Update .memory/project-state.json with latest metrics
   - Record pending tasks in .memory/active-context.md

2. **Skill Memory Updates**:
   - Ensure all skill-specific memory files current
   - Record work progress and next steps
   - Document any blockers or issues

3. **Logging**:
   - Create session log entry in .logs/sessions/
   - Update skill activity logs
   - Record quality metrics changes

**Output**: "Context preserved. Session recorded."

### Session Restoration (AUTO-EXECUTED)

**Trigger**: When resuming work after break
**Primary Skill**: memory-manager
**Process**:

1. **Context Reconstruction**:
   - Read .memory/project-state.json for project metadata
   - Read .memory/active-context.md for current status
   - Read .memory/session-history.json for last session details

2. **Skill Reactivation**:
   - Identify previously active skills from project state
   - pm-orchestrator mentions required skills
   - Skills automatically invoked with full context

3. **Quality Standards Restoration**:
   - quality-controller reloads project-type-specific standards
   - Resume quality monitoring from last recorded state

4. **Work Resumption**:
   - Identify next task from workflow
   - Activate appropriate skill for continuation
   - Provide seamless work continuation

5. **Historical Context Integration**:
   - Analyze .logs/ for historical insights
   - Combine real-time memory + historical logs
   - Provide comprehensive context

**Output**: "Context restored. Project {name} at {phase}. Last activity: {summary}. Resuming from: {current_task}"

---

## MCP Tool Integration Strategy

### Two-Level MCP Usage System

**Level 1: Autonomous Usage** (All Skills):
- Individual skills use MCP tools independently
- Single-tool operations
- Basic functionality
- No orchestrator coordination needed

**Tools Available to All**:
- Context7 MCP: Documentation and API references
- Sequential Thinking MCP: Complex analysis and planning

**Skill-Specific Tools**:
- **Frontend**: GitHub MCP, Playwright MCP (basic UI testing)
- **Backend**: GitHub MCP, Context7 MCP (API documentation)
- **Research**: GitHub MCP, Context7 MCP, Sequential Thinking MCP
- **QA**: Playwright MCP (expert level, E2E testing)
- **All Skills**: Context7 MCP, Sequential Thinking MCP

**Level 2: Orchestrator Coordination** (mcp-tools-orchestrator):
- Complex multi-tool scenarios
- Advanced usage patterns
- Performance optimization
- Project-wide MCP strategy

**Triggers for Level 2**:
- 3+ simultaneous MCP tools needed
- New usage pattern development
- MCP performance optimization
- Complex cross-tool integration

### MCP Auto-Trigger Conditions

**Context7 MCP**:
- User mentions: "latest documentation", "official docs", "API reference"
- Skill needs: Framework guides, library documentation

**GitHub MCP**:
- User mentions: "code examples", "implementation patterns", "open source"
- Skill needs: Repository analysis, code pattern research

**Sequential Thinking MCP**:
- User mentions: "step-by-step analysis", "systematic review"
- Skill needs: Complex problem solving, detailed planning

**Playwright MCP**:
- User mentions: "testing", "E2E testing", "browser automation"
- Skill needs: UI validation, user flow testing

---

## Mandatory Standards & Best Practices

**CRITICAL**: ALL initialization MUST be 100% non-interactive (maintains Zero-Confirmation autonomy). Interactive prompts break automation.

### Non-Interactive Init Commands

| Framework | Correct Command |
|-----------|----------------|
| **Next.js** | `npx create-next-app@latest name --yes --typescript --tailwind --eslint --app --src-dir --use-npm` |
| **NestJS** | `nest new name --package-manager npm --skip-git --language TS` |
| **FastAPI** | `mkdir -p name/app && python -m venv venv && pip install fastapi uvicorn` (programmatic structure via Write) |
| **Expo** | `npx create-expo-app@latest name --template blank-typescript --yes` |

**Rule**: Research non-interactive flags via Context7 MCP before executing. NO CLI prompts allowed.

### Framework Standards

| Framework | Critical Rules |
|-----------|----------------|
| **frontend-nextjs** | NO EMOJIS. Lucide Icons only. TypeScript strict. Tailwind CSS (no inline). Shadcn/ui. App Router only. |
| **backend-nestjs** | NO EMOJIS. Text-only. TypeScript strict. class-validator. OpenAPI/Swagger required. |
| **backend-fastapi** | NO EMOJIS. Text-only. mypy strict 100%. async def all endpoints. Pydantic v2. OpenAPI auto. bcrypt passwords. JWT env-only. Exec-form CMD. pytest+httpx.AsyncClient 80%+. |
| **mobile-react-native** | NO EMOJIS. TypeScript 5+ strict. RN 0.82+ (Fabric+TurboModules+JSI). Hermes. HIG+Material Design. Type-safe navigation. Performance (cold <3s, warm <1s, 60fps, <150MB). Jest+RNTL+Detox. EAS Build. Secure storage, HTTPS, no hardcoded secrets. WCAG (screen reader, 44x44pt/48x48dp). |
| **qa-testing** | Playwright MCP only. WCAG 2.1 AA. Vulnerability scanning. Cross-browser (Chrome/Firefox/Safari/Edge). |
| **devops-deployment** | Docker latest. Compose V2. Automated backups. Health checks required. |

---

## Workflow Reference System

### Workflow Directory

**Location**: pm-orchestrator/workflows/

**Available Workflows**:
1. **01-requirements-analysis.md**: Requirements gathering and analysis
2. **02-research-analysis.md**: Market and technology research
3. **03-architecture-design.md**: System architecture and API design
4. **04-system-development.md**: Specialized system development (conditional)
5. **[Implementation Phase]**: Frontend/Backend developed by domain skills autonomously (no workflow file)
6. **06-integration.md**: System integration and coordination
7. **07-deployment.md**: Docker, cloud, and CI/CD setup
8. **08-quality-assurance.md**: Comprehensive testing and validation

### Workflow Execution

**pm-orchestrator references workflows**:
- Reads appropriate .md file from workflows/
- Follows step-by-step instructions
- Mentions required skills for coordination
- Updates memory system throughout execution

**Example**:
```
pm-orchestrator reads: workflows/01-requirements-analysis.md
→ Follows Phase 1-5 instructions
→ Mentions: research-analysis, fullstack-integration
→ Creates: workspace/docs/analysis.md, workspace/backlog/epics.yaml
→ Updates: .memory/active-context.md, .memory/decisions.md
→ Proceeds to: workflows/03-architecture-design.md
```

---

## Continuous Development & Release Management

### Lifecycle State Machine

The system operates with **three lifecycle states** that determine workflow routing:

**State Transitions**:
```
initial_development → continuous_development → major_version_development
         ↓                      ↓                          ↓
    [v1.0.0]              [v1.1.0-v1.x.x]             [v2.0.0]
```

**State Definitions**:

1. **initial_development**:
   - **When**: New project, no v1.0.0 released yet
   - **Workflows**: 01 → 02 → 03 → [04] → Implementation → 06 → 07 → 08 → v1.0.0 release
   - **Goal**: Build and release v1.0.0 (foundational version)
   - **Transition**: After v1.0.0 released → continuous_development

2. **continuous_development**:
   - **When**: v1.0.0+ released, ongoing feature development
   - **Workflows**: 09-continuous-development.md + 8 sub-workflows (infinite loop)
   - **Goal**: Continuous improvement (features, bugs, performance, security)
   - **Version Range**: v1.1.0 through v1.x.x (MINOR and PATCH releases)
   - **Transition**: When breaking changes needed → major_version_development

3. **major_version_development**:
   - **When**: Breaking changes, complete rewrites, fundamental architecture changes
   - **Workflows**: Return to 01-03 for re-architecture → Implementation → 06-08 → v2.0.0 release
   - **Goal**: Major version release (v2.0.0, v3.0.0, etc.)
   - **Version**: MAJOR version bump
   - **Transition**: After vX.0.0 released → continuous_development

**State Tracking**:
- Stored in `.memory/project-state.json` → `lifecycle_state` field
- pm-orchestrator reads state on every session start
- Determines which workflows to use

### State Transition Checklists (CRITICAL)

**These checklists MUST be verified before transitioning between lifecycle states.**

#### Transition 1: initial_development → continuous_development

**Trigger**: v1.0.0 successfully deployed to production

**Pre-Transition Checklist** (ALL must be checked):
```
[ ] v1.0.0 deployed to production environment
[ ] All critical quality gates passed (08-quality-assurance.md)
[ ] 0 critical/high security vulnerabilities
[ ] Core Web Vitals / performance targets met
[ ] User authentication and authorization working
[ ] Error monitoring configured (Sentry/similar)
[ ] Production database seeded with initial data
[ ] CI/CD pipeline operational
[ ] Rollback procedure tested
[ ] Basic documentation complete (README, API docs)
```

**Actions on Transition**:
1. Update `.memory/project-state.json`:
   ```json
   {
     "lifecycle_state": "continuous_development",
     "current_version": "1.0.0",
     "first_release_date": "[YYYY-MM-DD]"
   }
   ```
2. Initialize continuous development memory files (memory-manager):
   - `.memory/version-history.md` (init with v1.0.0 entry)
   - `.memory/release-plan.md` (plan for v1.1.0)
   - `.memory/production-metrics.md`
   - `.memory/user-feedback.md`
   - `.memory/technical-debt.md`
   - `.memory/ci-cd-metrics.md`
   - `.memory/incident-log.md`
3. Update `.memory/active-context.md` with continuous development status
4. Log transition in `.logs/system/state-transitions.log`

**Post-Transition Validation**:
```
[ ] lifecycle_state = "continuous_development" in project-state.json
[ ] All 7 continuous development memory files created
[ ] Production monitoring showing data
[ ] Ready to receive feature requests and bug reports
```

---

#### Transition 2: continuous_development → major_version_development

**Trigger**: Breaking changes required (API incompatibility, major redesign)

**Pre-Transition Checklist** (ALL must be checked):
```
[ ] Breaking change necessity documented in .memory/decisions.md
[ ] Current stable version tagged and documented
[ ] Migration path outlined for existing users
[ ] Stakeholder approval for breaking changes (if applicable)
[ ] Technical debt assessment for major version
[ ] Resource and timeline estimate for major version
[ ] Backward compatibility strategy defined (deprecation period)
```

**Actions on Transition**:
1. Update `.memory/project-state.json`:
   ```json
   {
     "lifecycle_state": "major_version_development",
     "previous_stable_version": "1.x.x",
     "target_major_version": "2.0.0",
     "major_version_reason": "[Description of breaking changes]"
   }
   ```
2. Create `.memory/migration-guide.md` (draft)
3. Archive current version documentation
4. Return to foundational workflows (01-03)

**Post-Transition Validation**:
```
[ ] lifecycle_state = "major_version_development" in project-state.json
[ ] Breaking changes documented clearly
[ ] Migration guide draft started
[ ] Foundational workflow (01-03) ready to execute
```

---

#### Transition 3: major_version_development → continuous_development

**Trigger**: vX.0.0 (major version) successfully deployed to production

**Pre-Transition Checklist** (ALL must be checked):
```
[ ] vX.0.0 deployed to production environment
[ ] Migration guide complete and tested
[ ] Deprecation notices sent to affected users (if applicable)
[ ] All breaking changes documented in CHANGELOG
[ ] Backward compatibility layer working (if provided)
[ ] All critical quality gates passed
[ ] Production monitoring showing stable metrics
[ ] User migration support in place (if needed)
```

**Actions on Transition**:
1. Update `.memory/project-state.json`:
   ```json
   {
     "lifecycle_state": "continuous_development",
     "current_version": "X.0.0",
     "previous_major_version": "(X-1).y.z",
     "major_release_date": "[YYYY-MM-DD]"
   }
   ```
2. Update `.memory/version-history.md` with major version entry
3. Reset `.memory/release-plan.md` for vX.1.0
4. Archive migration guide to `/docs/migrations/`
5. Return to 09-continuous-development.md workflow

**Post-Transition Validation**:
```
[ ] lifecycle_state = "continuous_development" in project-state.json
[ ] Major version entry in version-history.md
[ ] Ready for continuous improvement cycle
[ ] Migration support operational (if applicable)
```

---

#### State Transition Logging

All state transitions MUST be logged in `.logs/system/state-transitions.log`:

```
[YYYY-MM-DD HH:MM:SS] STATE_TRANSITION
  From: initial_development
  To: continuous_development
  Trigger: v1.0.0 production deployment
  Checklist: All 10 items verified
  Memory Files Created: 7
  Initiated By: pm-orchestrator
```

### Hybrid Circular Architecture

**Four-Tier Workflow System**:

**Tier 1: Foundational Workflows** (One-time or Major Versions):
- 01-requirements-analysis.md
- 02-research-analysis.md
- 03-architecture-design.md
- 04-system-development.md (conditional: AI/ML, GPU, Video Processing)
- **Used**: initial_development state, major_version_development state

**Tier 2: Continuous Pipeline** (Every Release):
- 06-integration.md (system integration, cross-component testing)
- 07-deployment.md (Docker, cloud, CI/CD, staging deployment)
- 08-quality-assurance.md (comprehensive QA, E2E testing, performance validation)
- **Used**: ALL states (every release goes through 06→07→08)

**Tier 3: Continuous Development** (Infinite Loop):
- 09-continuous-development.md (work intake, routing, version management)
- 8 sub-workflows: feature-development, bug-fix, hotfix, enhancement, refactoring, performance-optimization, security-patch, version-upgrade
- **Used**: continuous_development state (post v1.0.0 release)

**Tier 4: Support Workflows**:
- release-management.md (staged rollout, monitoring, success criteria)
- direction-adjustment.md (future: pivots, major strategic changes)

### Continuous Development Workflow (09)

**Entry Point**: Production environment with v1.0.0+ released

**Workflow**: pm-orchestrator/workflows/09-continuous-development.md

**Purpose**: Infinite loop handling all post-v1.0.0 development work

**Phases**:

**Phase 1: Work Intake & Classification**:
- User requests: "Add feature X", "Fix bug Y", "Improve performance"
- Production issues: Monitoring alerts, user feedback, incident reports
- Planned improvements: Technical debt, refactoring, upgrades

**Phase 2: Work Type Detection**:
- **Feature Development**: Entirely new functionality
- **Bug Fix**: Functional defects, incorrect behavior
- **Hotfix**: CRITICAL production issues (expedited)
- **Enhancement**: UX improvements, better error messages
- **Refactoring**: Code quality improvements (ZERO behavior changes)
- **Performance Optimization**: Speed/resource improvements
- **Security Patch**: CVE fixes, security improvements
- **Version Upgrade**: Framework/dependency major version upgrades

**Phase 3: Sub-Workflow Routing**:
Based on work type, route to appropriate sub-workflow:
- Feature → `workflows/continuous/feature-development.md`
- Bug → `workflows/continuous/bug-fix.md`
- Hotfix → `workflows/continuous/hotfix.md`
- Enhancement → `workflows/continuous/enhancement.md`
- Refactoring → `workflows/continuous/refactoring.md`
- Performance → `workflows/continuous/performance-optimization.md`
- Security → `workflows/continuous/security-patch.md`
- Version Upgrade → `workflows/continuous/version-upgrade.md`

**Phase 4: Version Impact Decision**:
pm-orchestrator decides version bump based on work type:
- **MAJOR (v1.x.x → v2.0.0)**: Breaking changes, API incompatibilities
- **MINOR (v1.2.x → v1.3.0)**: New features, backward-compatible additions
- **PATCH (v1.2.3 → v1.2.4)**: Bug fixes, performance improvements, security patches

**Phase 5: Return to Integration Pipeline**:
After sub-workflow completes, all work returns to:
- 06-integration.md → 07-deployment.md → 08-quality-assurance.md → release-management.md

**Circular Pattern**:
```
Production
    ↓
09-continuous-development (work intake + routing)
    ↓
Sub-workflow (feature/bug/enhancement/etc.)
    ↓
06-integration.md (testing, validation)
    ↓
07-deployment.md (staging deployment)
    ↓
08-quality-assurance.md (comprehensive QA)
    ↓
release-management.md (production rollout)
    ↓
Production (monitoring, feedback collection)
    ↓
09-continuous-development (next work item)
    ↓
[INFINITE LOOP]
```

### Sub-Workflows (8 Types)

**All follow 8-phase pattern**: Analysis → Impact Assessment → Design → Implementation → Testing → Documentation → Memory Update → Integration Pipeline

| Workflow | Purpose | Version | Key Phases | Example |
|----------|---------|---------|------------|---------|
| **feature-development.md** | New functionality | MINOR | Requirements → Design → Implement → Test | "Add email notifications" |
| **bug-fix.md** | Fix defects | PATCH | Reproduce → Root cause → Fix → Verify | "Fix login timeout" |
| **hotfix.md** | CRITICAL prod issues | PATCH (expedited) | Triage → Quick fix → Deploy → Post-mortem | "DB connection leak" |
| **enhancement.md** | Improve existing | MINOR/PATCH | UX analysis → A/B test → Implement | "Better search filters" |
| **refactoring.md** | Code quality (NO behavior changes) | PATCH | Test coverage → Refactor → Verify (tests unchanged) | "Extract validation logic" |
| **performance-optimization.md** | Speed/resource improvements | MINOR/PATCH | Baseline → Profile → Optimize → Verify (quantifiable) | "Dashboard 3.2s→1.8s" |
| **security-patch.md** | CVE fixes | PATCH | CVE analysis → Patch → Security test | "Fix SQL injection" |
| **version-upgrade.md** | Framework/dep upgrades | PATCH/MINOR/MAJOR | Assessment → Research → Migration → Test | "Next.js 13→14" |

### Release Management

**Workflow**: pm-orchestrator/workflows/release-management.md

**Purpose**: Staged production deployment with monitoring and rollback capability

**Phases**:

**Phase 1: Pre-Release Preparation**:
- Final quality gates validation
- Release notes generation (from .memory/version-history.md)
- Stakeholder notification
- Rollback plan confirmation

**Phase 2: Staged Rollout**:
- **Canary Deployment** (10% traffic):
  - Deploy to 10% of users
  - Monitor for 2-4 hours
  - Check error rates, performance metrics
  - Decision: Proceed or rollback

- **Gradual Rollout** (50% traffic):
  - Expand to 50% of users
  - Monitor for 4-8 hours
  - Validate success metrics
  - Decision: Proceed or rollback

- **Full Deployment** (100% traffic):
  - Complete rollout to all users
  - Monitor for 24 hours
  - Collect user feedback

**Phase 3: Post-Release Monitoring**:
- Track production metrics (.memory/production-metrics.md)
- Monitor error rates, performance, user feedback
- Respond to incidents (route to hotfix.md if critical)

**Phase 4: Release Validation**:
- Verify success criteria met
- Document lessons learned
- Update .memory/version-history.md with release results

**Phase 5: Return to Continuous Development**:
- Transition back to 09-continuous-development.md for next work item
- Infinite loop continues

### Version Management

**Semantic Versioning**: MAJOR.MINOR.PATCH (e.g., v1.3.2)

**Version Bump Rules**:

**MAJOR (v1.x.x → v2.0.0)**:
- Breaking API changes
- Incompatible with previous version
- Major architecture redesign
- Requires migration guide
- Triggers: major_version_development state
- Example: React 17 → 18 (breaking changes in ReactDOM.render)

**MINOR (v1.2.x → v1.3.0)**:
- New features (backward-compatible)
- Significant enhancements
- New API endpoints
- No breaking changes
- Example: Add email notification system

**PATCH (v1.2.3 → v1.2.4)**:
- Bug fixes
- Performance improvements
- Security patches
- Refactoring (no behavior changes)
- Minor dependency upgrades
- Example: Fix login timeout issue

**Version Tracking**:
- Current version: `.memory/version-history.md`
- Release planning: `.memory/release-plan.md`
- pm-orchestrator automatically bumps version based on work type

### Memory System Extensions

**Continuous Development Memory Files**:

All files in `.memory/` directory:

**Core Files** (All Projects):
- active-context.md
- decisions.md
- collaboration.log.md
- project-state.json
- session-history.json
- artifacts.manifest.json

**Continuous Development Files** (initialized when transitioning to continuous_development state):
- **version-history.md**: Version changelog with semantic versioning
- **release-plan.md**: Release planning and tracking
- **production-metrics.md**: Live application performance (Core Web Vitals, API metrics, error rates)
- **user-feedback.md**: Feature requests, bug reports, enhancement suggestions, NPS
- **technical-debt.md**: Identified debt items, refactoring opportunities, completed improvements
- **ci-cd-metrics.md**: Build success rates, deployment frequency, test metrics, DORA metrics
- **incident-log.md**: Production incidents, post-mortems, lessons learned

**Memory Update Triggers**:
- Every sub-workflow updates relevant memory files
- pm-orchestrator maintains .memory/active-context.md
- memory-manager ensures consistency and session continuity

### Workflow Routing Examples

**Example 1: Feature** - "Add dark mode" → 09-continuous-development → feature-development.md → MINOR (v1.2.0→v1.3.0) → frontend+backend → 06→07→08 → release → v1.3.0

**Example 2: Hotfix** - "DB pool exhausted" → 09-continuous-development → hotfix.md (EXPEDITED) → PATCH (v1.3.3→v1.3.4) → backend fix → fast-track 06→07→08 → emergency deploy → v1.3.4 → post-mortem

**Example 3: Major Version** - "Redesign auth (breaking API)" → continuous_development → major_version_development state → 01→02→03→Implementation→06→07→08 → MAJOR (v1.8.3→v2.0.0) → v2.0.0 → continuous_development state

### Quality Gates & Success Criteria

**Quality Standards** (quality-controller enforced):

| Stage | Requirements |
|-------|--------------|
| Pre-Development | Requirements clear, impact assessed, design documented |
| Development | Code review pass, unit tests added, TypeScript strict pass |
| Pre-Integration | All tests pass, no performance regressions, 0 new critical vulnerabilities |
| Pre-Deployment | E2E pass, WCAG 2.1 AA, cross-browser, Core Web Vitals met |
| Pre-Release | Canary success, error rate <1%, metrics stable, feedback positive |

**Success Metrics**:

| Category | Metric | Target |
|----------|--------|--------|
| **Velocity** | MINOR releases | Every 2-3 weeks |
| | PATCH releases | Weekly or as needed |
| | MAJOR releases | Every 3-6 months |
| **Quality** | Rollback rate | <5% |
| | Critical bugs/release | <2 |
| | Test coverage | Backend 80%+, Frontend 70%+ |
| **Efficiency** | Commit→Production (PATCH) | <4 hours |
| | Feature→Release (MINOR) | <2 weeks |
| | Deployment success | >95% |

---

## System Configuration Files

### Core Configuration Reference

**pm-orchestrator/**:
- `workflows/*.md`: Skills-based workflow guides (active)

**project-detector/**:
- `project-detection.yaml`: Project type detection rules and scoring

**memory-manager/**:
- `memory-templates.yaml`: Memory structure templates
- `logging-system.yaml`: Logging configuration
- `memory-logging-integration.yaml`: Integration triggers

**quality-controller/**:
- `quality-standards.json`: Quality frameworks for all project types

---

## Quick Start Guide

### For Users

**Starting a Project**:
1. Describe your project: "Create a [type] app with [features]"
2. System automatically:
   - Detects project type
   - Assembles skill team
   - Initializes memory system
   - Starts development
   - Validates quality
   - Deploys application

**No manual configuration required!**

### For Developers

**Understanding Skills**:
- Skills are in `.claude/skills/*/SKILL.md`
- Each skill has specific `description` for auto-invocation
- `allowed-tools` restricts which tools skill can use
- `reference.md` contains detailed guidelines

**Adding New Skills**:
1. Create folder in `.claude/skills/your-skill/`
2. Create `SKILL.md` with YAML frontmatter
3. Add detailed instructions
4. Cross-reference with related skills

---

## Success Metrics

### System Performance Indicators

**Automation Level**:
- ✅ Project initialization: 100% automated
- ✅ Technology selection: 100% automated
- ✅ Code implementation: 100% automated
- ✅ Quality validation: 100% automated
- ✅ Deployment: 100% automated

**Quality Achievement**:
- ✅ Web apps: 90%+ Lighthouse scores
- ✅ APIs: <200ms response times
- ✅ AI/ML: >90% model accuracy
- ✅ Security: 0 critical vulnerabilities

**User Experience**:
- ✅ Zero confirmations needed
- ✅ Complete project delivery
- ✅ Production-ready code
- ✅ Comprehensive documentation

---

**Ready to Build**: All 16 skills configured and ready. Simply describe your project to Claude, and the skills will coordinate automatically to deliver production-ready code with ZERO user confirmations required.

### Skill Summary (16 Total)

**Infrastructure (4)**: pm-orchestrator, project-detector, memory-manager, quality-controller
**Frontend/Mobile (2)**: frontend-nextjs, mobile-react-native
**Backend (2)**: backend-nestjs, backend-fastapi
**Data & Security (2)**: database-specialist, security-specialist
**Architecture (1)**: fullstack-integration
**Specialized (1)**: systemdev-specialist
**Operations (1)**: devops-deployment
**Quality (1)**: qa-testing
**Research (1)**: research-analysis
**Tools (1)**: mcp-tools-orchestrator
