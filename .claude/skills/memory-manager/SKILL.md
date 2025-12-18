---
name: memory-manager
description: "Project memory and logging system management for context preservation and session continuity. Use when: initializing new projects, restoring project context after breaks, updating project state and decisions, preserving context before session ends, managing project memory and history. Maintains the hybrid memory-logging system for real-time state and historical analysis."
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
---

# Memory Manager - Project Context & Session Continuity

**Purpose**: Manage the hybrid memory-logging system that combines real-time active state management (.memory/ folder) with historical audit trails and analysis (.logs/ folder).

## Hybrid Memory-Logging System

This skill implements a sophisticated dual-system approach:

### Memory System (Real-Time Active State)
**Location**: `.memory/` folder
**Purpose**: Immediate context restoration and active project state
**Functions**:
- Immediate context restoration after session breaks
- Expert coordination and task assignment
- Active quality gate validation
- Current performance monitoring
- Real-time collaboration tracking

### Logging System (Historical Analysis)
**Location**: `.logs/` folder
**Purpose**: Historical audit trails and trend analysis
**Functions**:
- Performance trend analysis and optimization planning
- Expert productivity analysis and recommendations
- Quality improvement tracking and pattern analysis
- Audit trails and compliance reporting
- Long-term learning and optimization

### Integration Approach
**Hybrid Complementary System**:
- Memory updates automatically trigger log entries
- Log analysis feeds back into memory optimization
- Both systems work together for comprehensive project management

## Deep Thinking Protocol

**OPTIONAL**: memory-manager Deep Thinking is rarely needed. 99% of memory operations follow clear templates and structured file operations. Use Deep Thinking only for rare edge cases involving novel memory structures or complex integration patterns not covered by existing templates.

### Rare Use Cases for Deep Thinking

**Consider Deep Thinking only when**:
- **Novel Memory Structure Design**: Entirely new memory architecture not template-based (e.g., distributed memory system, custom integration with external context stores)
- **Complex Memory-Logging Integration**: Custom integration triggers beyond standard memory update → log entry patterns
- **Multi-Project Memory Management**: Novel patterns for managing shared context across multiple related projects
- **Performance-Critical Memory Strategy**: Optimizing memory operations for very large projects (>10K files, >100MB memory state)

**Do NOT use for** (99% of cases - standard operations):
- Standard memory file updates (active-context.md, decisions.md, collaboration.log.md, etc.)
- Session history recording (follows clear template)
- Standard logging integration (auto-triggered from memory-logging-integration.yaml)
- File manifest updates (straightforward CRUD)
- Project initialization with existing templates
- Context restoration (follows structured protocol)
- All standard CRUD operations on memory files

### Complexity Threshold

Use Deep Thinking only when:
1. **No existing template** covers the memory structure needed
2. **Custom integration logic** required (not in memory-logging-integration.yaml)
3. **Multi-project coordination** with shared memory context
4. **Performance optimization** for extreme-scale projects (>10K files)

**Expected Scenarios**: <1% of memory-manager invocations (most projects use standard templates)

### Deep Thinking Application Protocol

Follow the 5-Phase approach with memory-manager-specific focus:

**Evaluation Dimensions**:
- **Clarity** (30%): Memory structure clarity for human developers
- **Efficiency** (25%): File operation performance, storage optimization
- **Maintainability** (20%): Ease of updates, template consistency
- **Session Continuity** (15%): Context restoration reliability
- **Integration** (10%): Logging and cross-skill coordination

**Expected Thought Investment**: 5-8 thoughts for rare novel memory patterns

### Documentation Requirements

Document in `.memory/decisions.md` with minimal format:
- **Problem**: What novel memory challenge was encountered
- **Decision**: What memory structure/pattern was created

**Example** (Brief - Rare Scenario):

**Problem**: Design memory structure for distributed AI model training coordination across 4 geographic regions with separate model versions and training state synchronization

**Complexity**: Medium (1 indicator: Novel domain - distributed training memory not covered by templates)

**Decision**: Regional memory shards (.memory/regions/{region-id}/) with centralized coordination file (.memory/coordination.json) and sync protocol

**Rationale**: Standard single-project memory insufficient for distributed training. Regional shards reduce latency for local teams (Asia, Europe, US-East, US-West). Centralized coordination.json tracks version consistency and synchronization state across regions.

**Impact**: Enabled distributed training with <5s sync latency. Each region maintains local context. Zero conflicts from 300+ daily memory updates across 4 regions.

### Quality Validation

After Deep Thinking (rare cases), validate:
- [ ] Memory structure documented clearly in .memory/ README
- [ ] Template created for reuse if pattern generalizable
- [ ] Integration with logging system maintained
- [ ] Session continuity tested (restore context from new structure)

Coordinate with **pm-orchestrator** for project-wide memory strategies and **quality-controller** for memory quality standards validation.

### Success Metrics

Track in `.memory/metrics.md` (only when Deep Thinking applied):
- Template coverage: Target >95% (how many projects use standard templates)
- Context restoration success: Target 100% (restore works reliably)
- Memory operation efficiency: Target <100ms for standard operations

## Core Memory Files

### Project Initialization

When initializing a new project, create these core files in `.memory/`:

1. **active-context.md**: Real-time project status
   - Current phase and active tasks
   - Next milestones and blockers
   - Recent decisions and changes

2. **decisions.md**: Decision history with rationale
   - Technical decisions and trade-offs
   - Architecture choices and justifications
   - Technology stack selections

3. **collaboration.log.md**: Expert/skill coordination tracking
   - Skill invocation history
   - Coordination patterns and outcomes
   - Cross-skill communication notes

4. **project-state.json**: Comprehensive project metrics
   - Project metadata and identifiers
   - Phase progress percentages
   - Expert engagement status
   - Quality metrics and targets

5. **session-history.json**: Session continuity data
   - Session start/end times
   - Work completed per session
   - Next steps and handoff notes

6. **artifacts.manifest.json**: Generated artifact tracking
   - File paths and descriptions
   - Creation timestamps
   - Dependencies between artifacts

## Project-Type-Specific Memory Files

Based on project type detected by project-detector skill, create additional files:

### Web Application
- `.memory/ui-components.md`: Component library and patterns
- `.memory/api-endpoints.md`: API integration documentation
- `.memory/user-flows.md`: User journey and flow diagrams
- `.memory/performance-targets.md`: Web vitals and optimization goals

### AI/ML System
- `.memory/model-architecture.md`: Model design and specifications
- `.memory/data-pipeline.md`: Data processing workflow
- `.memory/training-requirements.md`: Training configuration and resources
- `.memory/performance-metrics.md`: Accuracy, latency, throughput metrics

### Mobile Application
- `.memory/platform-requirements.md`: iOS/Android specific requirements
- `.memory/performance-targets.md`: App performance goals

### API/Microservice
- `.memory/service-architecture.md`: Service design and patterns
- `.memory/endpoint-specifications.md`: API contract details

### Data Processing System
- `.memory/data-flow-architecture.md`: Data pipeline architecture
- `.memory/processing-pipeline.md`: Processing stages and transformations

### Desktop Application
- `.memory/platform-integration.md`: OS integration details
- `.memory/ui-framework.md`: Desktop UI framework choices

## Expert-Specific Memory Files

Create domain-specific memory files for specialized tracking:

### QA Expert Memory
- `.memory/test-coverage.md`: Test coverage metrics and gaps
- `.memory/quality-metrics.md`: Quality scores and trends
- `.memory/security-testing.md`: Security validation results
- `.memory/performance-validation.md`: Performance test results

### DevOps Expert Memory
- `.memory/deployment-config.md`: Deployment configuration and history
- `.memory/infrastructure-state.md`: Infrastructure status and resources
- `.memory/ci-cd-workflows.md`: CI/CD pipeline configuration
- `.memory/monitoring-metrics.md`: System monitoring and alerts

### Research Expert Memory
- `.memory/research-findings.md`: Research insights and recommendations
- `.memory/technology-analysis.md`: Technology evaluation results
- `.memory/market-analysis.md`: Market research and competitive analysis
- `.memory/risk-assessment.md`: Risk identification and mitigation

### SystemDev Expert Memory
- `.memory/system-performance.md`: System performance benchmarks
- `.memory/gpu-optimization.md`: GPU utilization and optimization
- `.memory/infrastructure-scaling.md`: Scaling configuration and limits
- `.memory/performance-benchmarks.md`: Benchmark results and analysis

### Frontend Expert Memory
- `.memory/component-library.md`: Component documentation and usage
- `.memory/design-system.md`: Design tokens and patterns
- `.memory/ui-patterns.md`: UI/UX patterns and guidelines

### Backend Expert Memory
- `.memory/api-documentation.md`: API design and endpoints
- `.memory/database-schema.md`: Database structure and relationships
- `.memory/service-architecture.md`: Backend service architecture

### Fullstack Expert Memory
- `.memory/integration-architecture.md`: System integration design
- `.memory/system-design.md`: Overall system architecture
- `.memory/technology-stack.md`: Technology choices and rationale

### MCP Expert Memory
- `.memory/tool-usage-optimization.md`: MCP tool efficiency improvements
- `.memory/automation-workflows.md`: Automated workflow patterns
- `.memory/integration-patterns.md`: Tool integration strategies
- `.memory/expert-tool-support.md`: Tool assistance history

## Continuous Development Memory Files

**Initialized When**: Transitioning from `initial_development` to `continuous_development` state (after v1.0.0 release)

**Purpose**: Track production application state, user feedback, technical debt, and ongoing development metrics for the infinite continuous improvement loop.

**Trigger**: pm-orchestrator invokes memory-manager when:
- v1.0.0 successfully deployed to production
- `.memory/project-state.json` → `lifecycle_state` transitions to `"continuous_development"`
- 08-quality-assurance.md completes for initial release

### Core Continuous Development Files

These files are created in `.memory/` and maintained throughout the continuous development lifecycle:

1. **version-history.md**: Version changelog and release tracking
   - **Purpose**: Complete history of all releases with semantic versioning
   - **Structure**: Chronological version entries (newest first)
   - **Content**:
     - Current version
     - Version timeline with Added/Changed/Fixed/Security/Performance/Breaking Changes
     - Planned versions
     - Release metrics (rollback rate, deployment time, critical bugs)
     - Deprecation schedule
   - **Updated By**: pm-orchestrator after each release
   - **Used In**: release-management.md (release notes generation), 09-continuous-development.md (version decisions)
   - **Template**: `templates/continuous-development/version-history.md`

2. **release-plan.md**: Release planning and feature tracking
   - **Purpose**: Plan upcoming releases and track feature development
   - **Structure**: Next release → Future releases → Backlog
   - **Content**:
     - Next release with features, status, progress percentage
     - Release criteria checklist
     - Future releases (v1.x+1, v1.x+2, etc.)
     - Backlog (unscheduled features, technical debt, user requests)
     - Release frequency guidelines (PATCH/MINOR/MAJOR)
   - **Updated By**: pm-orchestrator during sprint planning and work intake
   - **Used In**: 09-continuous-development.md (work prioritization), release-management.md
   - **Template**: `templates/continuous-development/release-plan.md`

3. **production-metrics.md**: Live application performance metrics
   - **Purpose**: Track production health, performance, and user engagement
   - **Structure**: Real-time metrics dashboard
   - **Content**:
     - System health status (🟢 Healthy / 🟡 Degraded / 🔴 Critical)
     - Core Web Vitals (LCP, FID, CLS)
     - API performance (response times, throughput, error rates)
     - User metrics (DAU, WAU, MAU, session duration)
     - Infrastructure metrics (CPU, memory, disk usage)
     - Uptime and reliability (MTBF, MTTR, MTTD)
     - Historical trends (performance over time)
   - **Updated By**: devops-deployment (automatic metrics collection), systemdev-specialist
   - **Used In**: performance-optimization.md (baseline metrics), hotfix.md (incident severity), release-management.md (release validation)
   - **Template**: `templates/continuous-development/production-metrics.md`
   - **Update Frequency**: Real-time (via monitoring integration), summary updates hourly

4. **user-feedback.md**: Feature requests, bug reports, and user insights
   - **Purpose**: Centralized tracking of user feedback and requests
   - **Structure**: Categorized by type and priority
   - **Content**:
     - Feature requests (high/medium/low priority with request count)
     - Bug reports (by severity: CRITICAL/HIGH/MEDIUM/LOW)
     - Enhancement suggestions (UI/UX, performance, accessibility)
     - User testimonials and praise
     - Pain points and complaints
     - NPS scores and satisfaction surveys
     - Churn reasons and retention insights
   - **Updated By**: pm-orchestrator (user feedback collection), qa-testing (bug reports), frontend/mobile skills (UX insights)
   - **Used In**: 09-continuous-development.md (work prioritization), feature-development.md, enhancement.md, bug-fix.md
   - **Template**: `templates/continuous-development/user-feedback.md`
   - **Update Frequency**: Daily (user feedback review), weekly summary

5. **technical-debt.md**: Technical debt tracking and refactoring planning
   - **Purpose**: Identify, prioritize, and track resolution of technical debt
   - **Structure**: Active debt → Refactoring opportunities → Completed improvements
   - **Content**:
     - Active technical debt by priority (HIGH/MEDIUM/LOW)
     - Debt categories (code quality, architecture, performance, security, testing, documentation)
     - Debt prioritization matrix (impact vs. effort)
     - Refactoring opportunities with ROI estimates
     - Debt accumulation causes and prevention strategies
     - Debt reduction plan (this sprint, next sprint, long-term)
     - Completed debt resolution history
     - Metrics (debt accumulation rate, resolution velocity, aging debt)
   - **Updated By**: All domain skills (identify debt), pm-orchestrator (prioritization), refactoring.md (resolution tracking)
   - **Used In**: refactoring.md (debt resolution), 09-continuous-development.md (refactoring work intake), sprint planning
   - **Template**: `templates/continuous-development/technical-debt.md`
   - **Update Frequency**: Weekly review, real-time additions

6. **ci-cd-metrics.md**: Build, test, and deployment metrics
   - **Purpose**: Track CI/CD pipeline health and efficiency
   - **Structure**: Build → Test → Deployment metrics
   - **Content**:
     - Build metrics (success rate, duration, frequency)
     - Test metrics (execution times, pass rates, coverage, flaky tests)
     - Deployment metrics (frequency, success rate, duration, MTTD)
     - Failure analysis (top failure reasons, MTTR)
     - Quality gates (pre-deployment checks, code quality)
     - Pipeline performance (stage durations, bottlenecks, cache hit rate)
     - Security metrics (vulnerability scans, dependency audits)
     - DORA metrics (lead time, deployment frequency, MTTR, change failure rate)
     - Optimization opportunities
   - **Updated By**: devops-deployment (automatic pipeline metrics), qa-testing (test metrics)
   - **Used In**: 07-deployment.md (pipeline optimization), 06-integration.md (test analysis), pm-orchestrator (velocity tracking)
   - **Template**: `templates/continuous-development/ci-cd-metrics.md`
   - **Update Frequency**: Automatic (every build/deployment), weekly summary

7. **incident-log.md**: Production incidents, post-mortems, and lessons learned
   - **Purpose**: Track production issues and prevent recurrence
   - **Structure**: Active incidents → Historical incidents → Lessons learned
   - **Content**:
     - Active incidents by severity (CRITICAL/HIGH/MEDIUM/LOW)
     - Incident timeline (detected → acknowledged → mitigated → resolved)
     - Impact assessment (users affected, services down, duration, data loss)
     - Root cause analysis
     - Response actions and mitigation strategy
     - Permanent fix and prevention measures
     - Lessons learned and action items
     - Incident categories (performance, outage, security, data loss, integration)
     - Response metrics (MTTD, MTTA, MTTM, MTTR)
     - SLA compliance tracking
   - **Updated By**: pm-orchestrator (incident management), hotfix.md (critical incidents), backend/frontend skills (resolution)
   - **Used In**: hotfix.md (incident response), security-patch.md (security incidents), post-mortem analysis
   - **Template**: `templates/continuous-development/incident-log.md`
   - **Update Frequency**: Real-time (during incidents), weekly review

### Initialization Workflow

**When**: After v1.0.0 production deployment succeeds

**pm-orchestrator triggers memory-manager**:

```
1. Read .memory/project-state.json
2. Verify lifecycle_state = "continuous_development"
3. Create continuous development memory files:
   - Copy template from templates/continuous-development/version-history.md → .memory/version-history.md
   - Copy template from templates/continuous-development/release-plan.md → .memory/release-plan.md
   - Copy template from templates/continuous-development/production-metrics.md → .memory/production-metrics.md
   - Copy template from templates/continuous-development/user-feedback.md → .memory/user-feedback.md
   - Copy template from templates/continuous-development/technical-debt.md → .memory/technical-debt.md
   - Copy template from templates/continuous-development/ci-cd-metrics.md → .memory/ci-cd-metrics.md
   - Copy template from templates/continuous-development/incident-log.md → .memory/incident-log.md

4. Initialize version-history.md with v1.0.0 release entry
5. Create initial release-plan.md for v1.1.0
6. Configure production metrics collection integration
7. Set up user feedback collection channels
8. Initialize CI/CD metrics tracking
9. Output: "Continuous development memory initialized - 7 files created"
```

### Update Patterns

**During Continuous Development Lifecycle** (09-continuous-development.md + sub-workflows):

**version-history.md**:
- Updated by: pm-orchestrator after each release
- Frequency: Every release (PATCH/MINOR/MAJOR)
- Pattern: Add new version entry at top, update "Current Version"

**release-plan.md**:
- Updated by: pm-orchestrator during work intake and sprint planning
- Frequency: Weekly (sprint planning), daily (work intake)
- Pattern: Move features between releases, update progress percentages

**production-metrics.md**:
- Updated by: devops-deployment (automatic), systemdev-specialist (analysis)
- Frequency: Hourly (automatic), daily summary
- Pattern: Real-time metrics updates, weekly trend analysis

**user-feedback.md**:
- Updated by: pm-orchestrator (feedback collection), qa-testing (bug reports)
- Frequency: Daily (feedback review)
- Pattern: Add new feedback items, update status (New → Planned → In Progress → Completed)

**technical-debt.md**:
- Updated by: All skills (identify debt), refactoring.md (resolution)
- Frequency: Weekly review, real-time additions
- Pattern: Add new debt items, update status, move to completed section

**ci-cd-metrics.md**:
- Updated by: devops-deployment (automatic pipeline integration)
- Frequency: Automatic (every build/test/deployment)
- Pattern: Automatic metrics aggregation, weekly summary generation

**incident-log.md**:
- Updated by: pm-orchestrator (incident management), hotfix.md
- Frequency: Real-time (during incidents)
- Pattern: Create incident entry → Update timeline → Add resolution → Post-mortem → Close

### Integration with Workflows

**09-continuous-development.md**:
- Reads: user-feedback.md, technical-debt.md, release-plan.md, production-metrics.md
- Updates: release-plan.md (work intake), active-context.md (current work)

**Sub-Workflows** (feature-development, bug-fix, hotfix, enhancement, refactoring, performance-optimization, security-patch, version-upgrade):
- All read: version-history.md (current version), production-metrics.md (baseline)
- All update: version-history.md (after completion via pm-orchestrator)
- Specific updates:
  - bug-fix.md → user-feedback.md (mark bug resolved)
  - hotfix.md → incident-log.md (incident tracking)
  - refactoring.md → technical-debt.md (mark debt resolved)
  - performance-optimization.md → production-metrics.md (performance improvements)
  - security-patch.md → incident-log.md (security incidents)

**release-management.md**:
- Reads: version-history.md (release notes), release-plan.md (release checklist)
- Updates: production-metrics.md (post-release metrics), version-history.md (release validation)

**08-quality-assurance.md**:
- Reads: release-plan.md (release criteria)
- Updates: version-history.md (quality validation results)

### Memory File Lifecycle

**Creation**: After v1.0.0 release (state transition to continuous_development)

**Active Use**: Throughout continuous development lifecycle (v1.x.x → v2.x.x → v3.x.x)

**Persistence**: Permanent (never deleted, grows over project lifetime)

**Archival**: Monthly summaries archived to `.logs/memory-snapshots/` for historical analysis

**Migration**: When transitioning to major version (v1.x.x → v2.0.0), maintain continuity but start new sections for v2.x.x lifecycle

## Logging System Structure

Create and maintain `.logs/` directory with subdirectories:

### Log Directory Structure
```
.logs/
├── sessions/              # Session-level logs
│   └── session-{YYYYMMDD-HHMMSS}.log
├── experts/               # Expert-specific activity logs
│   ├── pm-{YYYYMMDD}.log
│   ├── frontend-{YYYYMMDD}.log
│   ├── backend-{YYYYMMDD}.log
│   └── ... (all experts)
├── collaboration/         # Skill coordination logs
│   ├── collab-requests-{YYYYMMDD}.log
│   └── collab-conversations-{YYYYMMDD}.log
├── quality/              # Quality metrics and validation logs
│   ├── quality-metrics-{YYYYMMDD}.log
│   └── compliance-{YYYYMMDD}.log
├── performance/          # Performance tracking logs
│   └── timing-{YYYYMMDD}.log
├── errors/               # Error and warning logs
│   └── errors-{YYYYMMDD}.log
└── system/               # System event logs
    └── system-events-{YYYYMMDD}.log
```

## Memory-Logging Integration Triggers

### Automatic Integration (from memory-logging-integration.yaml)

**Memory Update → Log Entry**:
- Expert memory file update → Expert log entry
- Quality metrics update → Quality log entry
- Collaboration event → Collaboration log entry
- Performance change → Performance log entry

**Log Analysis → Memory Optimization**:
- Daily log analysis → Memory improvement recommendations
- Expert productivity analysis → Expert memory enhancements
- Quality trends → Memory-based quality strategy updates
- Performance insights → Memory optimization guidance

## Memory System Operations

### 1. Project Initialization

When invoked for a new project:

```
1. Read memory-templates.yaml to get project-type template
2. Create .memory/ directory
3. Create core memory files with template content:
   - active-context.md
   - decisions.md
   - collaboration.log.md
   - project-state.json
   - session-history.json
   - artifacts.manifest.json

4. Create project-specific memory files based on detected type
5. Create expert-specific memory files for active skills
6. Initialize .logs/ directory structure
7. Configure memory-logging integration triggers
8. Output: "Memory system initialized for {project_type}"
```

### 2. Context Update

When skills need to update project state:

```
1. Receive update request with content and target file
2. Edit appropriate memory file (e.g., .memory/active-context.md)
3. Update timestamp and change history
4. Trigger automatic log entry in corresponding .logs/ file
5. Output confirmation of update
```

### 3. Session Restoration

When resuming a project after a break:

```
1. Read .memory/project-state.json for project metadata
2. Read .memory/active-context.md for current status
3. Read .memory/session-history.json for last session details
4. Provide comprehensive context summary:
   - Project type and current phase
   - Last completed tasks
   - Current active tasks
   - Next planned milestones
   - Any blockers or issues
5. Analyze .logs/ for historical insights
6. Output: "Context restored. Project {name} at {phase}. Last activity: {summary}"
```

### 4. Pre-Session Preservation

Before session ends or context compression:

```
1. Update all active memory files with current state
2. Edit .memory/session-history.json with session summary
3. Update .memory/project-state.json with latest metrics
4. Record any pending tasks in .memory/active-context.md
5. Ensure all expert-specific memory files are current
6. Create session log entry in .logs/sessions/
7. Output: "Context preserved. Session recorded."
```

## Template System

Uses **memory-templates.yaml** which contains:

- **core_templates**: Standard memory file templates for all projects
- **project_type_templates**: Project-specific memory structures
- **expert_memory_templates**: Expert domain-specific templates
- **template_content**: Default content and placeholders for each file

## Integration with Other Skills

### PM Orchestrator
- Requests memory initialization for new projects
- Updates memory with strategic decisions and milestones
- Coordinates memory updates across skills

### Project Detector
- Provides detected project type for appropriate memory template selection

### Quality Controller
- Updates quality metrics in memory
- Triggers quality log entries via integration

### Domain Skills (Frontend, Backend, etc.)
- Update their expert-specific memory files
- Record decisions and progress in memory
- Trigger automatic logging through integration

## Configuration Files

This skill includes:

- **memory-templates.yaml**: All memory templates and structures
- **logging-system.yaml**: Logging configuration and directory structure
- **memory-logging-integration.yaml**: Integration triggers and feedback mechanisms

## Output Guidelines

- Provide clear memory operation confirmations
- Show what was updated: "Updated .memory/active-context.md with architecture decision"
- Indicate triggering integrations: "Triggered log entry in .logs/experts/fullstack-{date}.log"
- Report context restoration status: "Context restored from session-{id}"

## Related Skills

- **pm-orchestrator**: Coordinates memory updates during project execution
- **project-detector**: Provides project type for memory template selection
- **quality-controller**: Integrates quality metrics into memory system
- All domain skills: Update their expert-specific memory files

## Atomic Write Protocol (CRITICAL for Data Integrity)

**Purpose**: Prevent data corruption during concurrent memory operations, especially when multiple skills write to memory files simultaneously.

### Problem: Race Condition Risk

When multiple skills update memory files concurrently:
```
Skill A reads .memory/active-context.md (v1)
Skill B reads .memory/active-context.md (v1)
Skill A writes changes → (v2)
Skill B writes changes (based on v1) → OVERWRITES Skill A's changes!
```

### Solution: Atomic Write Pattern

**MANDATORY for all memory file updates**:

```bash
# Atomic write pattern (temp file → fsync → rename)
1. Write content to temporary file: .memory/.{filename}.tmp
2. Call fsync() to ensure data is flushed to disk
3. Atomic rename: mv .memory/.{filename}.tmp → .memory/{filename}
4. Verify final file exists and is readable
```

### Implementation Protocol

**For Claude Code Write/Edit Operations**:

When updating any `.memory/` file, follow this sequence:

1. **Read Current State**: Always read the latest version before modification
2. **Compute Changes**: Merge your updates with current state
3. **Write Atomically**: Use the pattern below

**Atomic Write Sequence**:
```
# Step 1: Write to temporary file
Write content to: .memory/.{original-filename}.tmp.{timestamp}

# Step 2: Verify temporary file
Read back .memory/.{original-filename}.tmp.{timestamp}
Confirm content matches expected output

# Step 3: Atomic rename (overwrite original)
Rename .memory/.{original-filename}.tmp.{timestamp} → .memory/{original-filename}

# Step 4: Cleanup on success
Temporary file automatically replaced by rename
```

### Lock-Free Conflict Resolution

**When parallel writes occur** (detected by timestamp comparison):

1. **Optimistic Concurrency**: Assume no conflict, proceed with write
2. **Post-Write Validation**: After atomic rename, verify expected state
3. **Conflict Detection**: If final state != expected (another skill wrote):
   - Re-read the current state
   - Merge your changes with the new state
   - Retry atomic write (max 3 retries)
4. **Conflict Resolution**: If conflict persists after retries:
   - Log conflict in `.logs/errors/memory-conflicts-{date}.log`
   - Preserve both versions: `{filename}.conflict.{timestamp}`
   - Alert pm-orchestrator for manual resolution

### File-Level Granularity Guidelines

**To minimize conflicts, use appropriate file granularity**:

| Scenario | Recommendation |
|----------|----------------|
| High-frequency updates (active-context) | Single atomic file, frequent small updates |
| Parallel skill updates | Separate files per skill domain |
| Shared state (project-state.json) | Atomic JSON patches, not full rewrites |
| Append-only data (collaboration.log) | Append-only writes with timestamps |

### Memory File Update Categories

**Category A: Single-Writer Files** (no atomic complexity needed):
- `.memory/session-history.json` - memory-manager only
- `.memory/artifacts.manifest.json` - memory-manager only

**Category B: Multi-Writer Files** (MUST use atomic pattern):
- `.memory/active-context.md` - All skills update
- `.memory/decisions.md` - Multiple skills record decisions
- `.memory/project-state.json` - Progress updates from many skills
- `.memory/collaboration.log.md` - All skills log interactions

**Category C: Append-Only Files** (atomic append, never overwrite):
- `.logs/**/*.log` - Always append with timestamp, never modify existing

### Validation Checklist

Before completing any memory write operation, verify:
- [ ] Read latest state before modification
- [ ] Temporary file created successfully
- [ ] Atomic rename completed
- [ ] Final file readable and contains expected content
- [ ] No `.tmp.*` files left behind (cleanup)

### Error Recovery

**If atomic write fails**:
1. Check for leftover `.tmp` files → Clean up
2. Verify original file still intact → Preserve
3. Log failure in `.logs/errors/`
4. Retry with fresh read (handle stale state)
5. If persistent failure → Alert pm-orchestrator

## Memory Preservation Best Practices

1. **Update Frequently**: Keep memory current, don't batch updates
2. **Be Specific**: Record specific decisions with rationale, not vague summaries
3. **Track Changes**: Note what changed and why in update records
4. **Maintain Relationships**: Link decisions to requirements and impacts
5. **Preserve Context**: Include enough context for future restoration
6. **Use Timestamps**: Always timestamp changes for historical analysis
7. **Use Atomic Writes**: Follow atomic write protocol for all multi-writer files (CRITICAL)
