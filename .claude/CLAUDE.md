# Agentic Dev AI Team - Claude Code System Guide

**Claude Code Specialized Guidelines for Skills-Based Development System**

> **System Architecture**: 14 autonomous skills with contextual invocation
> **Powered by**: Hans(HanTaek) Lim - Transformed for Claude Code Agent Skills

---

## System Overview

This is an autonomous development system consisting of 14 specialized skills that work together through contextual invocation. Unlike traditional explicit-signal-based systems, skills are automatically invoked by Claude based on context matching.

### Core Architecture Principles

**Autonomous Skill Invocation**:
- Skills are invoked based on description matching (no manual commands)
- Cross-skill coordination through natural language mentions
- Zero user confirmation required for all decisions
- Complete project delivery from user request to finished code

**Skills Organization**:
- **4 Infrastructure Skills**: pm-orchestrator, project-detector, memory-manager, quality-controller
- **10 Domain Skills**: frontend-nextjs, mobile-react-native, backend-nestjs, backend-fastapi, fullstack-integration, systemdev-specialist, devops-deployment, qa-testing, research-analysis, mcp-tools-orchestrator

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

### PHASE 2: Skill Team Assembly (AUTO-COORDINATED)

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
   - **Mobile App**: mobile-react-native, backend-nestjs OR backend-fastapi, fullstack-integration, devops-deployment, qa-testing
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
   - **Mobile**: platform-requirements.md (iOS/Android versions, device support), performance-targets.md (startup time, memory, fps), app-store-metadata.md (descriptions, screenshots), native-modules.md (custom native code tracking)
   - **API**: service-architecture.md, endpoint-specifications.md
   - **Data**: data-flow-architecture.md, processing-pipeline.md
   - **Desktop**: platform-integration.md, ui-framework.md

3. **Skill-Specific Memory**:
   - QA: test-coverage.md, quality-metrics.md, security-testing.md, performance-validation.md
   - DevOps: deployment-config.md, infrastructure-state.md, ci-cd-workflows.md, monitoring-metrics.md
   - Research: research-findings.md, technology-analysis.md, market-analysis.md, risk-assessment.md
   - SystemDev: system-performance.md, gpu-optimization.md, infrastructure-scaling.md
   - Frontend: component-library.md, design-system.md, ui-patterns.md
   - Mobile: component-library.md (reusable mobile components), navigation-structure.md (screen hierarchy), platform-integration.md (native module usage), performance-metrics.md (app metrics)
   - Backend: api-documentation.md, database-schema.md, service-architecture.md
   - Fullstack: integration-architecture.md, system-design.md, technology-stack.md
   - MCP: tool-usage-optimization.md, automation-workflows.md, integration-patterns.md

4. **Logging System Initialization**:
   - Create `.logs/` directory structure:
     - sessions/ (session-level logs)
     - skills/ (skill activity logs)
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
   - Selects first workflow: typically "01-requirements-analysis.md"

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

## Deep Thinking Protocol

### Protocol Overview

This system implements a **Deep Thinking Protocol** combining Sequential Thinking MCP with Claude Code's ultrathink mode to ensure highest quality autonomous decisions. Based on extensive testing, this combination consistently produces superior results with 50-100% quality improvement and 40-60% bug reduction compared to standard analysis approaches.

**Core Principle**: Complex decisions require systematic, multi-dimensional analysis before implementation. Deep Thinking Protocol provides structured methodology ensuring thorough evaluation while maintaining Zero-Confirmation autonomy.

**Relationship to Zero-Confirmation Framework**: Deep Thinking Protocol IS the quality assurance mechanism for autonomous decisions. Skills make decisions independently (no user confirmation), but use Deep Thinking to ensure decision quality meets production standards.

**Key Benefits**:
- Reduced decision revision rate (<10% vs 30-40% baseline)
- Higher first-time-right implementation rate (>70%)
- Fewer post-production issues (-40-60% bugs)
- Better long-term architecture (lower technical debt)
- Faster overall time-to-production (despite upfront thinking time)

### Skill Categorization

All 13 skills are categorized based on decision complexity and impact scope:

#### Category A: MANDATORY Deep Thinking

Skills where complex strategic/architectural decisions are mission-critical:

| Skill | Why MANDATORY |
|-------|---------------|
| **pm-orchestrator** | Project-wide coordination, workflow management, strategic decisions affect entire project |
| **systemdev-specialist** | AI/ML, GPU, video processing architectures require upfront optimization (no trial-and-error) |
| **fullstack-integration** | System architecture decisions are hard to reverse, foundation for all implementation |
| **research-analysis** | Technology selection and market strategy require thorough analysis |
| **quality-controller** | Quality standards definition affects entire project quality assurance |

**Expected Impact**: +80-100% quality improvement, -50-60% bug reduction

#### Category B: STRONGLY RECOMMENDED

Skills with complex technical implementations:

| Skill | Why STRONGLY RECOMMENDED |
|-------|--------------------------|
| **frontend-nextjs** | React patterns, performance optimization complex; simple CRUD straightforward |
| **mobile-react-native** | Navigation architecture, native modules, performance optimization complex; simple screens straightforward |
| **backend-nestjs** | DI patterns, microservices complex; standard REST endpoints straightforward |
| **backend-fastapi** | Async architecture, high-performance design complex; basic endpoints straightforward |
| **devops-deployment** | Security, scaling strategies complex; basic deployment standardized |

**Expected Impact**: +50-70% quality improvement, -40-50% bug reduction

#### Category C: CONDITIONAL

Skills where Deep Thinking needed only for complex scenarios:

| Skill | When to Apply |
|-------|---------------|
| **qa-testing** | Complex test strategies, performance/security testing; standard tests follow patterns |
| **mcp-tools-orchestrator** | Novel multi-tool coordination (3+ tools); single tool usage straightforward |
| **project-detector** | Ambiguous/hybrid project types; clear types match patterns |

**Expected Impact**: +30-50% quality improvement for complex cases

#### Category D: OPTIONAL

Skills with already structured operations:

| Skill | Why OPTIONAL |
|-------|--------------|
| **memory-manager** | Memory operations follow clear templates and file structures (mostly CRUD) |

**Note**: Each skill's SKILL.md provides specific Deep Thinking guidelines and examples for its domain.

### When to Apply Deep Thinking

Use the **Complexity Indicators** to determine when Deep Thinking is required:

#### 7 Complexity Indicators

1. **Multiple Valid Approaches Exist**: 2+ technically sound solutions, requiring systematic evaluation
2. **Long-term Implications Significant**: Decision affects project lifetime, high change cost
3. **Cross-Skill Dependencies Complex**: Multiple skills involved, requires coordination
4. **Performance Critical**: Performance is key success factor, issues hard to fix later
5. **Security Sensitive**: Security breach has severe consequences, one mistake can compromise system
6. **Novel Problem Domain**: New to team/system, existing patterns don't apply
7. **High Cost of Failure**: Wrong decision leads to project failure, very difficult to reverse

#### Task Complexity Matrix

| Complexity Level | Indicators Present | Deep Thinking Requirement |
|-----------------|-------------------|---------------------------|
| **Very High** | 3+ indicators | MANDATORY |
| **High** | 2 indicators | STRONGLY RECOMMENDED |
| **Medium** | 1 indicator | CONDITIONAL |
| **Low** | 0 indicators | OPTIONAL |

#### Examples by Complexity Level

**Very High Complexity** (3+ indicators - MANDATORY):
```
Task: "Design system architecture for AI-powered video processing platform"
Indicators: Multiple approaches ✓, Long-term implications ✓, Performance critical ✓, Novel domain ✓
Requirement: MANDATORY Deep Thinking
```

**High Complexity** (2 indicators - STRONGLY RECOMMENDED):
```
Task: "Implement authentication system with OAuth and JWT"
Indicators: Long-term implications ✓, Security sensitive ✓
Requirement: STRONGLY RECOMMENDED Deep Thinking
```

**Medium Complexity** (1 indicator - CONDITIONAL):
```
Task: "Optimize database query performance for user dashboard"
Indicators: Performance critical ✓
Requirement: CONDITIONAL Deep Thinking
```

**Low Complexity** (0 indicators - OPTIONAL):
```
Task: "Create basic CRUD endpoint for user profile"
Indicators: None (standard pattern)
Requirement: OPTIONAL (standard implementation sufficient)
```

#### When NOT to Use Deep Thinking

- **Standard patterns** with established best practices
- **Low-impact decisions** that are easily reversible
- **Following existing** team conventions
- **Exploratory prototyping** phase (exploration over optimization)
- **Emergency situations** (production down - act first, analyze later within 48 hours)

### How to Apply: Standard Protocol

**5-Phase Deep Thinking Approach**

All skills follow this standardized protocol when Deep Thinking is required:

#### Phase 1: Problem Framing (1-2 thoughts)
**Purpose**: Clear problem definition, constraints identification, success criteria

**Steps**:
1. Activate **ultrathink mode** in Claude Code
2. State problem clearly and concisely
3. Identify constraints (technical, business, time, resource)
4. Define success criteria and metrics
5. List known information and critical unknowns

**Output**: Clear problem statement

#### Phase 2: Alternative Generation (2-4 thoughts)
**Purpose**: Identify all viable approaches, explore creative solutions

**Steps**:
1. Invoke **Sequential Thinking MCP** for systematic analysis
2. Brainstorm 3-5 distinct approaches
3. For each approach, outline:
   - Core concept and key technologies
   - Preliminary pros and cons
   - Implementation complexity estimate
4. Research best practices using Context7 MCP if needed

**Output**: 3-5 documented alternatives

#### Phase 3: Multi-Dimensional Evaluation (3-6 thoughts)
**Purpose**: Systematic evaluation across critical dimensions

**Evaluation Dimensions**:
- **Technical Feasibility**: Implementation complexity, technology maturity, team expertise
- **Performance**: Speed, scalability, resource usage
- **Maintainability**: Code complexity, documentation, community support
- **Security**: Vulnerability surface, compliance, best practices
- **Cost**: Development time, infrastructure, maintenance
- **Risk**: Failure probability, failure impact, mitigation options

**Steps**:
1. Create evaluation matrix
2. Score each alternative (1-5 scale) per dimension
3. Identify deal-breakers
4. Apply weighted scoring if priorities clear

**Output**: Detailed evaluation matrix

#### Phase 4: Decision Synthesis (2-3 thoughts)
**Purpose**: Select optimal solution with clear justification

**Steps**:
1. Compare evaluation results
2. Consider project-specific priorities
3. Identify recommended approach
4. Justify decision with evidence
5. Acknowledge tradeoffs explicitly
6. Plan for identified risks

**Output**: Clear decision with rationale

#### Phase 5: Implementation Strategy (2-4 thoughts)
**Purpose**: Actionable implementation plan

**Steps**:
1. Break down into phases/milestones
2. Identify dependencies
3. Plan validation checkpoints
4. Document implementation guidelines
5. Define monitoring/rollback strategy

**Output**: Actionable implementation plan

**Total Thought Investment by Complexity**:
- Very High Complexity: 15-25 thoughts
- High Complexity: 10-15 thoughts
- Medium Complexity: 5-10 thoughts
- Low Complexity: 1-3 thoughts (or skip protocol)

#### Documentation Requirements

After completing Deep Thinking, document in **`.memory/decisions.md`**:

**Required Fields** (Category A - MANDATORY):
1. **Problem Statement**: What was being decided
2. **Alternatives Considered**: What options were evaluated
3. **Evaluation Criteria**: What dimensions were assessed
4. **Decision Made**: What was chosen
5. **Rationale**: Why this choice was optimal
6. **Tradeoffs**: What was sacrificed
7. **Risks & Mitigations**: Known risks and mitigation plans

**Simplified Fields** (Category B - STRONGLY RECOMMENDED):
- Problem, Decision, Rationale only

**Example Documentation**:
```markdown
## Decision: 2025-01-15 - Authentication System Architecture

**Skill**: backend-nestjs
**Complexity**: High (2 indicators: Long-term implications, Security sensitive)
**Deep Thinking**: 12 thoughts via Sequential Thinking MCP

**Problem**: Design authentication for multi-tenant SaaS platform

**Alternatives Considered**:
1. JWT with session storage
2. OAuth 2.0 with external provider
3. Custom token system with Redis

**Evaluation**: [matrix with scores across 6 dimensions]

**Decision**: JWT with session storage + OAuth fallback

**Rationale**: Primary users prefer username/password (80%), OAuth needed
for enterprise (20%). JWT provides security-simplicity balance.

**Tradeoffs**: Maintaining two auth systems increases complexity, but better
UX for majority while meeting enterprise requirements.

**Risks & Mitigations**:
- JWT secret compromise → Monthly rotation, short expiry
- Session storage overhead → Redis with auto-cleanup

**Implementation**: See workspace/backlog/auth-epic.yaml
```

#### Adoption Strategy

**Progressive Implementation**: Start with Category A skills (MANDATORY), expand to Category B after 2 weeks, full system-wide adoption after 4 weeks.

**Learning Support**: Each skill's SKILL.md provides concrete examples, templates, and detailed guidelines for applying Deep Thinking Protocol in specific contexts.

### Integration with System Components

Deep Thinking Protocol integrates seamlessly with existing system architecture:

#### 1. Zero-Confirmation Decision Framework
**Relationship**: Deep Thinking is the quality assurance mechanism for autonomous decisions

- Maintains Zero-Confirmation principle: Deep Thinking executes automatically, no user approval needed
- Each skill retains decision authority in its domain
- Difference: Systematic analysis replaces simple heuristics

#### 2. Quality Gate System
**Relationship**: Pre-validation (Deep Thinking) + Post-validation (Quality Gates)

- **Pre-Development**: Requirements clarity + Deep Thinking for architecture
- **Development**: Code review + Continuous testing
- **Pre-Deployment**: E2E tests + Deep Thinking for deployment strategy
- **Post-Deployment**: Monitoring + Performance tracking

Deep Thinking prevents quality issues; Quality Gates catch remaining issues.

#### 3. Memory System
**Relationship**: Decision transparency and session continuity

- `.memory/decisions.md`: All Deep Thinking results documented
- Session restoration: Previous decision rationale available
- Learning: Historical decisions inform future choices
- Metrics tracking: Decision outcomes measured in `.memory/metrics.md`

#### 4. Workflow System
**Relationship**: Deep Thinking applied at key decision points in workflows

- **01-requirements-analysis.md**: Requirement prioritization, scope decisions
- **02-research-analysis.md**: Technology evaluation (MANDATORY)
- **03-architecture-design.md**: System architecture (MANDATORY), database design
- **04-system-development.md**: ML model selection (if AI/ML - MANDATORY)
- **Implementation Phase**: Complex component architecture
- **06-integration.md**: Integration patterns
- **07-deployment.md**: Infrastructure architecture, security strategy
- **08-quality-assurance.md**: Test strategy design

#### 5. MCP Tool Integration Strategy
**Relationship**: Sequential Thinking MCP is core Deep Thinking tool

- **Sequential Thinking MCP**: Primary tool for structured analysis
- **Context7 MCP**: Supporting research during Deep Thinking
- **GitHub MCP**: Code pattern research during Deep Thinking
- All MCP tools used autonomously by skills during Deep Thinking process

#### 6. Cross-Skill Coordination Patterns
**Relationship**: pm-orchestrator leads complex cross-skill Deep Thinking

- **Single-skill decisions**: Skill performs own Deep Thinking
- **Cross-skill decisions**: pm-orchestrator coordinates unified Deep Thinking session
- Prevents duplicate analysis across skills
- Documented as cross-skill decision in `.memory/decisions.md`

**Example**: Real-time collaboration feature architecture involves frontend, backend, and fullstack skills → pm-orchestrator leads unified Deep Thinking with all stakeholders.

### Success Metrics

Deep Thinking Protocol effectiveness is measured through comprehensive metrics tracked in **`.memory/metrics.md`**:

#### Decision Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Decision Revision Rate** | <10% | % of decisions changed after initial choice (tracked in .memory/decisions.md) |
| **Alternative Evaluation Coverage** | 3-5 alternatives | Avg number of alternatives evaluated per high-complexity decision |
| **Rationale Completeness** | 100% | % of Category A decisions with complete documentation |

**Baseline (without Deep Thinking)**: 30-40% revision rate, 1-2 alternatives, 40-50% completeness

#### Implementation Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **First-Time-Right Rate** | >70% | % of implementations reaching production without major refactoring |
| **Bug Density Reduction** | -40% to -60% | Bugs per 1000 LOC compared to baseline |
| **Performance Target Achievement** | >80% | % of performance-critical features meeting targets on first implementation |

**Baseline**: 40-50% first-time-right, standard bug density, 50-60% performance target achievement

#### Process Efficiency Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Iteration Cycles** | 2-3 cycles | Avg iterations from requirements to completion |
| **Technical Debt** | <50% of baseline | "TODO/FIXME/HACK" comments + known architectural issues |
| **Time-to-Production** | 80-85% of baseline | Despite upfront thinking, reduced rework speeds overall delivery |

**Baseline**: 4-6 iteration cycles, high technical debt, 100% time reference

#### Tracking and Review

- **Continuous Tracking**: Metrics updated throughout project in `.memory/metrics.md`
- **Quality Gate Reviews**: Metrics reviewed at each Quality Gate checkpoint
- **Continuous Improvement**: Patterns analyzed to refine categorization and guidelines
- **Skill-specific Tuning**: Adjust MANDATORY vs RECOMMENDED based on outcomes

**Example `.memory/metrics.md`**:
```markdown
# Deep Thinking Protocol Metrics

## Decision Quality (Target: High)
- Decision Revision Rate: 8% ✅ (Target: <10%)
- Avg Alternatives Evaluated: 4.2 ✅ (Target: 3-5)
- Rationale Completeness: 98% ✅ (Target: 100%)

## Implementation Quality (Target: High)
- First-Time-Right Rate: 75% ✅ (Target: >70%)
- Bug Density: 0.5X baseline ✅ (Target: 0.4-0.6X)
- Performance Achievement: 85% ✅ (Target: >80%)

## Process Efficiency (Target: Optimal)
- Avg Iteration Cycles: 2.5 ✅ (Target: 2-3)
- Technical Debt: 40% of baseline ✅ (Target: <50%)
- Time-to-Production: 82% ✅ (Target: 80-85%)

Last Updated: 2025-01-15
```

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

### Project Initialization (ALL Frameworks)

**CRITICAL SYSTEM-WIDE POLICY**: All framework and project initialization MUST be 100% non-interactive to maintain Zero-Confirmation autonomy.

**Core Principle**: Interactive CLI prompts BREAK autonomous operation by requiring user input. This violates the Zero-Confirmation Decision Framework and prevents complete automation.

#### Non-Interactive Requirements

**MANDATORY for all skills**:
- ✅ **Always use non-interactive flags** when initializing projects via CLI
- ✅ **Never use interactive commands** that prompt for user input
- ✅ **Specify all options explicitly** via command-line flags
- ❌ **NEVER rely on prompts** for package manager, TypeScript, configuration choices

#### Framework-Specific Commands

**Next.js** (frontend-nextjs):
```bash
# CORRECT: Non-interactive with --yes flag
npx create-next-app@latest project-name --yes --typescript --tailwind --eslint --app --src-dir --use-npm

# WRONG: Interactive (prompts for options)
❌ npx create-next-app@latest project-name
```

**NestJS** (backend-nestjs):
```bash
# CORRECT: Non-interactive with --package-manager flag
nest new project-name --package-manager npm --skip-git --language TS

# WRONG: Interactive (prompts for package manager)
❌ nest new project-name
```

**FastAPI** (backend-fastapi):
```bash
# CORRECT: Direct project structure creation (no CLI prompts)
mkdir -p project-name/app && cd project-name
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install fastapi uvicorn

# Create project structure programmatically via Write tool
```

**React Native / Expo** (mobile-react-native):
```bash
# CORRECT: Non-interactive with --template and --yes flags
npx create-expo-app@latest project-name --template blank-typescript --yes

# WRONG: Interactive (prompts for template selection)
❌ npx create-expo-app@latest project-name
```

**General Rule**: If a framework has a CLI initialization tool, research and use its non-interactive flags via Context7 MCP before executing.

#### Rationale

Interactive prompts require human intervention, which:
1. Breaks Zero-Confirmation autonomy principle
2. Prevents CI/CD automation
3. Causes workflow interruptions
4. Violates "Complete project delivery from user request to finished code" promise

**Success Criteria**: User should NEVER see a CLI prompt during project initialization. All decisions must be made autonomously using best practices and explicit flags.

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

### Mobile Development (mobile-react-native)

**CRITICAL RULES**:
- ❌ **NO EMOJIS**: Anywhere in code, UI, or messages
- ✅ **TypeScript Strict**: Always enabled (TypeScript 5.x+)
- ✅ **React Native 0.82+**: New Architecture (Fabric + TurboModules + JSI)
- ✅ **Hermes Engine**: Mandatory JavaScript engine
- ✅ **Platform Guidelines**: iOS HIG + Android Material Design compliance
- ✅ **Type-Safe Navigation**: Typed routes and navigation params
- ✅ **Performance**: Cold start <3s, warm start <1s, 60fps UI, memory <150MB
- ✅ **Testing**: Jest + React Native Testing Library + Detox
- ✅ **EAS Build**: For app store builds (not manual Xcode/Android Studio)
- ✅ **Security**: Secure storage for sensitive data, HTTPS only, no hardcoded secrets
- ✅ **Accessibility**: Screen reader support, minimum touch targets 44x44pt/48x48dp

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

**Ready to Build**: All 13 skills configured and ready. Simply describe your project to Claude, and the skills will coordinate automatically to deliver production-ready code with ZERO user confirmations required.
