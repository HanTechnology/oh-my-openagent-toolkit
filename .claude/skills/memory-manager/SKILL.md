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

## Memory Preservation Best Practices

1. **Update Frequently**: Keep memory current, don't batch updates
2. **Be Specific**: Record specific decisions with rationale, not vague summaries
3. **Track Changes**: Note what changed and why in update records
4. **Maintain Relationships**: Link decisions to requirements and impacts
5. **Preserve Context**: Include enough context for future restoration
6. **Use Timestamps**: Always timestamp changes for historical analysis
