# Agentic Dev AI Team - Claude Code System Guide

**Claude Code Specialized Guidelines for Skills-Based Development System**

> **System Architecture**: 13 autonomous skills with contextual invocation
> **Powered by**: Hans(HanTaek) Lim - Transformed for Claude Code Agent Skills

---

## System Overview

This is an autonomous development system consisting of 13 specialized skills that work together through contextual invocation. Unlike traditional explicit-signal-based systems, skills are automatically invoked by Claude based on context matching.

### Core Architecture Principles

**Autonomous Skill Invocation**:
- Skills are invoked based on description matching (no manual commands)
- Cross-skill coordination through natural language mentions
- Zero user confirmation required for all decisions
- Complete project delivery from user request to finished code

**Skills Organization**:
- **4 Infrastructure Skills**: pm-orchestrator, project-detector, memory-manager, quality-controller
- **9 Domain Skills**: frontend-nextjs, backend-nestjs, backend-fastapi, fullstack-integration, systemdev-specialist, devops-deployment, qa-testing, research-analysis, mcp-tools-orchestrator

---

## PHASE 1-4 Project Initialization Protocol

### PHASE 1: Project Type Detection (AUTO-TRIGGERED)

**When**: User provides initial project description
**Primary Skill**: project-detector
**Process**:

1. **Keyword Analysis**:
   - Extract keywords from user request (lowercase conversion)
   - Match against 6 project types: web_application, ai_ml_system, mobile_application, api_microservice, data_processing_system, desktop_application

2. **Scoring Algorithm**:
   - Keywords: 40 points
   - Frameworks: 35 points
   - Technologies: 25 points
   - Minimum threshold: 30 points

3. **Type Selection**:
   - Highest scoring type selected
   - Fallback to web_application if score < 30

4. **Skill Recommendations**:
   - project-detector outputs recommended skills based on detected type
   - pm-orchestrator receives recommendations

**Output**: "Project type: {type} (score: {score}/100), Recommended skills: {skills}"

### PHASE 2: Expert Team Assembly (AUTO-COORDINATED)

**When**: Immediately after project detection
**Primary Skill**: pm-orchestrator
**Process**:

1. **Skill Activation**:
   - pm-orchestrator mentions recommended skills in natural language
   - Example: "The frontend-nextjs skill will handle UI development"
   - Claude automatically invokes mentioned skills

2. **Skill Team by Project Type**:
   - **Web Application**: frontend-nextjs, backend-nestjs OR backend-fastapi, fullstack-integration, qa-testing, devops-deployment
   - **AI/ML System**: systemdev-specialist, research-analysis, backend-nestjs OR backend-fastapi, qa-testing
   - **Mobile App**: frontend-nextjs, backend-nestjs OR backend-fastapi, devops-deployment, qa-testing
   - **API Service**: backend-nestjs OR backend-fastapi, fullstack-integration, devops-deployment, qa-testing
   - **Data Processing**: systemdev-specialist, backend-nestjs OR backend-fastapi, research-analysis, devops-deployment
   - **Desktop App**: frontend-nextjs, systemdev-specialist, devops-deployment, qa-testing

   **Backend Selection Criteria**:
   - **backend-nestjs**: TypeScript full-stack, enterprise architecture, Angular-style DI, GraphQL primary
   - **backend-fastapi**: Python ecosystem, AI/ML integration, async performance, scientific computing

3. **Coordination Matrix**:
   - All skills remain available throughout project lifecycle
   - Skills can mention each other for collaboration
   - pm-orchestrator maintains overall coordination

**Output**: "Activated skills: {skill_list}"

### PHASE 3: Memory System Initialization (AUTO-EXECUTED)

**When**: After team assembly
**Primary Skill**: memory-manager
**Process**:

1. **Memory Structure Creation**:
   - Create `.memory/` directory
   - Initialize core memory files:
     - active-context.md (current project status)
     - decisions.md (decision history)
     - collaboration.log.md (skill coordination)
     - project-state.json (comprehensive metrics)
     - session-history.json (session continuity)
     - artifacts.manifest.json (generated files tracking)

2. **Project-Type-Specific Files**:
   - **Web App**: ui-components.md, api-endpoints.md, user-flows.md, performance-targets.md
   - **AI/ML**: model-architecture.md, data-pipeline.md, training-requirements.md, performance-metrics.md
   - **Mobile**: platform-requirements.md, performance-targets.md
   - **API**: service-architecture.md, endpoint-specifications.md
   - **Data**: data-flow-architecture.md, processing-pipeline.md
   - **Desktop**: platform-integration.md, ui-framework.md

3. **Expert-Specific Memory**:
   - QA: test-coverage.md, quality-metrics.md, security-testing.md, performance-validation.md
   - DevOps: deployment-config.md, infrastructure-state.md, ci-cd-workflows.md, monitoring-metrics.md
   - Research: research-findings.md, technology-analysis.md, market-analysis.md, risk-assessment.md
   - SystemDev: system-performance.md, gpu-optimization.md, infrastructure-scaling.md
   - Frontend: component-library.md, design-system.md, ui-patterns.md
   - Backend: api-documentation.md, database-schema.md, service-architecture.md
   - Fullstack: integration-architecture.md, system-design.md, technology-stack.md
   - MCP: tool-usage-optimization.md, automation-workflows.md, integration-patterns.md

4. **Logging System Initialization**:
   - Create `.logs/` directory structure:
     - sessions/ (session-level logs)
     - experts/ (skill activity logs)
     - collaboration/ (cross-skill coordination)
     - quality/ (quality metrics evolution)
     - performance/ (performance tracking)
     - errors/ (error logs)
     - system/ (system events)

5. **Memory-Logging Integration**:
   - Configure automatic triggers: memory updates → log entries
   - Set up feedback mechanisms: log analysis → memory optimization
   - Activate hybrid complementary system

**Output**: "Memory system initialized for {project_type}"

### PHASE 4: First Task Initiation (AUTO-STARTED)

**When**: After memory initialization
**Primary Skill**: pm-orchestrator
**Process**:

1. **Workflow Selection**:
   - pm-orchestrator references workflows/ directory
   - Selects first workflow: typically "requirements-analysis"

2. **Task Execution**:
   - pm-orchestrator (or designated skill) begins task
   - Follows workflow steps from workflows/ directory
   - Updates memory system throughout execution

3. **Quality Standards Setup**:
   - pm-orchestrator mentions quality-controller
   - quality-controller establishes project-type-specific standards
   - Quality gates configured for continuous validation

4. **Progress Tracking**:
   - Real-time updates to .memory/active-context.md
   - Collaboration logged in .memory/collaboration.log.md
   - Metrics tracked in .memory/project-state.json

**Output**: "Starting {task_name} workflow"

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

2. **Expert Memory Updates**:
   - Ensure all expert-specific memory files current
   - Record work progress and next steps
   - Document any blockers or issues

3. **Logging**:
   - Create session log entry in .logs/sessions/
   - Update expert activity logs
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

### Frontend Development (frontend-nextjs)

**CRITICAL RULES**:
- ❌ **NO EMOJIS**: Anywhere in code or UI
- ✅ **Lucide Icons ONLY**: No other icon libraries allowed
- ✅ **TypeScript Strict**: Always enabled
- ✅ **Tailwind CSS**: All styling (no inline styles)
- ✅ **Shadcn/ui**: Component base
- ✅ **App Router**: Next.js App Router only (not Pages Router)

### Backend Development (backend-nestjs)

**CRITICAL RULES**:
- ❌ **NO EMOJIS**: In messages or API responses
- ✅ **Text-Only**: All communication text-based
- ✅ **TypeScript Strict**: Always enabled
- ✅ **Validation**: All inputs validated (class-validator)
- ✅ **Documentation**: OpenAPI/Swagger specs required

### Backend Development (backend-fastapi)

**CRITICAL RULES**:
- ❌ **NO EMOJIS**: In messages or API responses
- ✅ **Text-Only**: All communication text-based
- ✅ **Type Hints**: 100% coverage with mypy strict mode
- ✅ **Async-First**: All endpoints use async def
- ✅ **Validation**: Pydantic v2 models for all inputs
- ✅ **Documentation**: OpenAPI/Swagger automatic generation
- ✅ **Security**: Passwords with bcrypt, JWT secrets in environment only
- ✅ **Docker**: Exec-form CMD for graceful shutdown (CRITICAL)
- ✅ **Testing**: pytest with httpx.AsyncClient, 80%+ coverage

### Testing (qa-testing)

**CRITICAL RULES**:
- ✅ **Playwright MCP ONLY**: No external testing packages
- ✅ **WCAG 2.1 AA**: Accessibility compliance minimum
- ✅ **Security**: Vulnerability scanning mandatory
- ✅ **Cross-Browser**: Chrome, Firefox, Safari, Edge

### Deployment (devops-deployment)

**CRITICAL RULES**:
- ✅ **Docker Latest**: Modern Docker standards compliance
- ✅ **Compose V2**: Latest Docker Compose specification
- ✅ **Automated Backups**: Before any production changes
- ✅ **Health Checks**: All containers must have health checks

---

## Workflow Reference System

### Workflow Directory

**Location**: pm-orchestrator/workflows/

**Available Workflows**:
1. **requirements-analysis.md**: Requirements gathering and analysis
2. **research-analysis.md**: Market and technology research
3. **architecture-design.md**: System architecture and API design
4. **system-development.md**: Specialized system development (conditional)
5. **implementation.md**: Frontend and backend implementation
6. **integration.md**: System integration and coordination
7. **deployment.md**: Docker, cloud, and CI/CD setup
8. **quality-assurance.md**: Comprehensive testing and validation

### Workflow Execution

**pm-orchestrator references workflows**:
- Reads appropriate .md file from workflows/
- Follows step-by-step instructions
- Mentions required skills for coordination
- Updates memory system throughout execution

**Example**:
```
pm-orchestrator reads: workflows/requirements-analysis.md
→ Follows Phase 1-5 instructions
→ Mentions: research-analysis, fullstack-integration
→ Creates: workspace/docs/analysis.md, workspace/backlog/epics.yaml
→ Updates: .memory/active-context.md, .memory/decisions.md
→ Proceeds to: workflows/architecture-design.md
```

---

## System Configuration Files

### Core Configuration Reference

**pm-orchestrator/**:
- `orchestration-legacy.yaml`: Original expert-based workflows (reference only)
- `workflows/*.md`: Skills-based workflow guides (active)
- `team.yaml`: Original expert definitions (reference)

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

**Ready to Build**: All 13 skills configured and ready. Simply describe your project to Claude, and the skills will coordinate automatically to deliver production-ready code with ZERO user confirmations required.
