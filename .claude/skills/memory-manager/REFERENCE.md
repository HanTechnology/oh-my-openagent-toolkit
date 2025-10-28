# Memory Manager - Technical Reference

> **Purpose**: Technical reference for the memory-manager skill in the autonomous skills-based development system.
> **Related Skills**: pm-orchestrator (coordination), project-detector (template selection), quality-controller (metrics tracking)
> **Configuration**: memory-templates.yaml, logging-system.yaml, memory-logging-integration.yaml

---

## Memory Manager Skill Guidelines

### Core Responsibilities

**CRITICAL**: Operate with complete autonomy for memory system management

**Memory System Management**
- **Real-Time State Management**: Maintain .memory/ directory for active context
- **Historical Logging**: Maintain .logs/ directory for audit trails and trends
- **Hybrid System Coordination**: Synchronize memory and logging systems
- **Template Initialization**: Create project-type-specific memory structures
- **Skill Memory Management**: Coordinate skill-specific memory files
- **Session Continuity**: Enable seamless context restoration

**Technology Leadership**
- Autonomous memory structure decisions
- Logging strategy optimization
- Performance monitoring and optimization
- Integration trigger management

### Ultimate Goals
- **Complete context preservation** for session continuity
- **Zero user confirmations required** for memory management
- Seamless integration with all skills for context sharing

---

## Skill Coordination

### Autonomous Operation
This skill operates with **complete autonomy**, requiring **zero user confirmations** for:
- Memory directory structure creation
- Logging system initialization
- Template selection and initialization
- Automatic memory updates and synchronization
- Log analysis and feedback generation
- Session end and restoration operations

### Skill Invocation Context
This skill is automatically invoked by Claude when:
- pm-orchestrator initializes project (PHASE 3)
- Project type detected and memory templates needed
- Session ending and context preservation required
- Session resuming and context restoration needed
- Other skills mention: "memory-manager skill"

### Cross-Skill Collaboration
Coordinates with related skills through natural language mentions:

**pm-orchestrator**:
- Receives initialization request with project type
- Creates .memory/ directory structure
- Initializes project-type-specific files
- Coordinates session continuity operations
- Provides context restoration on session resume

**project-detector**:
- Receives project type for template selection
- Uses memory_templates mapping for file creation
- Initializes appropriate skill memory files

**quality-controller**:
- Coordinates quality metrics tracking in memory
- Logs quality improvements for trend analysis
- Provides historical quality data

**All Skills**:
- Provides skill-specific memory files
- Tracks skill activities in collaboration.log.md
- Enables context sharing across skills
- Preserves decision history in decisions.md

### Coordination Pattern
1. **Natural Language Mentions**: Skills mention memory-manager for operations
2. **Automatic Triggers**: Memory updates trigger log entries automatically
3. **Feedback Loops**: Log analysis feeds back optimization to memory
4. **Zero User Confirmation**: All operations happen autonomously

---

## System Architecture Overview

The memory-logging hybrid system is a complementary dual-system approach that combines real-time active state management with historical audit trails and trend analysis.

### Design Philosophy

**Problem**: Traditional single-system approaches have limitations:
- Pure memory systems lose historical context and trends
- Pure logging systems are slow for real-time state restoration
- Neither alone provides optimal project management

**Solution**: Hybrid complementary system:
- **Memory (.memory/)**: Fast, real-time, active state management
- **Logging (.logs/)**: Historical, analytical, long-term insights
- **Integration**: Automatic synchronization and feedback loops

## Memory System Deep Dive

### Purpose and Responsibilities

**Primary Role**: Real-time active state management

**Key Functions**:
1. **Immediate Context Restoration**: Resume work instantly after breaks
2. **Skill Coordination**: Track which skills are active and their status
3. **Active Quality Gates**: Current quality metrics and validation status
4. **Current Performance**: Real-time performance monitoring
5. **Real-Time Collaboration**: Ongoing skill coordination tracking

### Memory File Categories

#### Core Files (Universal)

**active-context.md**:
```markdown
# Project Active Context

## Current Phase
Phase: implementation
Progress: 65%

## Active Tasks
- [IN_PROGRESS] Frontend component development (80% complete)
- [IN_PROGRESS] Backend API implementation (60% complete)
- [PENDING] Integration testing

## Next Milestones
1. Complete component library
2. Finalize API endpoints
3. Begin integration testing

## Recent Decisions
- Selected Tailwind CSS for styling (2025-01-21)
- Chose PostgreSQL for database (2025-01-20)

## Blockers
None currently

## Last Updated
2025-01-21T15:30:00Z
```

**decisions.md**:
```markdown
# Technical Decision Records

## [2025-01-21] Styling Framework Selection
**Decision**: Use Tailwind CSS 4.1
**Rationale**: Modern utility-first approach, excellent TypeScript support, performance benefits
**Alternatives Considered**:
- CSS Modules: Too verbose for this project scale
- Styled Components: Runtime performance concerns
**Impact**: Affects all component development
**Decided By**: Frontend Expert
**Quality Impact**: Improved development speed, consistent styling

## [2025-01-20] Database Selection
**Decision**: PostgreSQL with Supabase
**Rationale**: Robust relational database, excellent Next.js integration, built-in auth
**Alternatives Considered**:
- MongoDB: Project needs relational structure
- Prisma with raw PostgreSQL: Supabase provides more features
**Impact**: Backend architecture and deployment strategy
**Decided By**: Backend Expert + Fullstack Expert collaboration
**Quality Impact**: Enhanced security, scalability improvements
```

**collaboration.log.md**:
```markdown
# Skill Collaboration Log

## [2025-01-21 15:00] Frontend-Backend API Integration Discussion
**Participants**: frontend-nextjs, backend-nestjs
**Topic**: API endpoint design for user authentication
**Outcome**: Agreed on JWT-based auth with refresh tokens
**Next Steps**: Backend implements endpoints, Frontend updates login flow
**Coordination Efficiency**: High

## [2025-01-21 14:30] Architecture Review
**Participants**: pm-orchestrator, fullstack-integration, qa-testing
**Topic**: E2E testing strategy validation
**Outcome**: Confirmed Playwright MCP for all E2E tests
**Next Steps**: QA begins test development
**Coordination Efficiency**: High

## [2025-01-20 16:45] Technology Stack Consultation
**Participants**: pm-orchestrator, research-analysis, fullstack-integration
**Topic**: Database selection research
**Outcome**: Research recommended Supabase, Fullstack confirmed feasibility
**Decision**: Selected Supabase PostgreSQL
**Coordination Efficiency**: Very High
```

**project-state.json**:
```json
{
  "projectId": "proj-2025-01-21-webapp",
  "name": "Corporate Dashboard",
  "projectType": "web_application",
  "createdAt": "2025-01-20T10:00:00Z",
  "lastUpdated": "2025-01-21T15:30:00Z",

  "currentPhase": "implementation",
  "progress": {
    "overall": 65,
    "phases": {
      "requirements_analysis": 100,
      "research_analysis": 100,
      "architecture_design": 100,
      "frontend_implementation": 80,
      "backend_implementation": 60,
      "integration": 0,
      "testing": 0,
      "deployment": 0
    }
  },

  "expert_engagement_status": {
    "pm": {
      "status": "monitoring",
      "current_tasks": ["Progress tracking", "Quality oversight"],
      "last_active": "2025-01-21T15:00:00Z"
    },
    "frontend": {
      "status": "active",
      "current_tasks": ["Component library development", "UI implementation"],
      "completion": 80,
      "last_active": "2025-01-21T15:30:00Z"
    },
    "backend": {
      "status": "active",
      "current_tasks": ["API endpoint implementation", "Database schema"],
      "completion": 60,
      "last_active": "2025-01-21T15:20:00Z"
    },
    "fullstack": {
      "status": "on_call",
      "current_tasks": [],
      "last_active": "2025-01-21T14:00:00Z"
    },
    "qa": {
      "status": "pending",
      "current_tasks": ["Awaiting integration completion"],
      "last_active": "2025-01-21T14:30:00Z"
    }
  },

  "quality_metrics": {
    "typescript_coverage": 94,
    "test_coverage": 0,
    "lighthouse_score": 0,
    "security_vulnerabilities": 0,
    "code_quality_score": 92
  },

  "technology_stack": {
    "frontend": ["Next.js 15.5", "React 19", "Tailwind CSS 4.1", "TypeScript"],
    "backend": ["Nest.js", "PostgreSQL", "Supabase"],
    "testing": ["Playwright", "Jest"],
    "deployment": ["Docker", "Vercel"]
  }
}
```

#### Project-Type-Specific Files

Vary based on detected project type. Examples for web application:

**ui-components.md**:
```markdown
# UI Component Library

## Implemented Components
- Header: Navigation with responsive menu
- Hero: Landing section with CTA
- Footer: Site footer with links

## Planned Components
- Dashboard: Main dashboard layout
- DataTable: Sortable, filterable table
- Modal: Reusable modal dialog

## Component Patterns
- All components use Shadcn/ui base
- Lucide Icons for all icons (NO other icon libraries)
- Responsive by default (mobile-first)
- TypeScript strict mode
- NO emojis in any components
```

**api-endpoints.md**:
```markdown
# API Endpoints Documentation

## Authentication Endpoints
- POST /api/auth/login: User login (JWT token)
- POST /api/auth/register: User registration
- POST /api/auth/refresh: Refresh access token
- POST /api/auth/logout: User logout

## User Endpoints
- GET /api/users/me: Current user profile
- PATCH /api/users/me: Update profile
- GET /api/users: List users (admin only)

## Implementation Status
- Authentication: 100% (all endpoints implemented)
- User Management: 60% (profile endpoints done, admin pending)
```

#### Expert-Specific Files

Each expert/skill domain has specialized memory files for their work:

**test-coverage.md** (QA Expert):
```markdown
# Test Coverage Report

## Unit Tests
- Frontend Components: 0% (pending implementation completion)
- Backend Services: 0% (pending implementation completion)
- Utilities: 0%

## Integration Tests
- API Endpoints: 0%
- Database Operations: 0%

## E2E Tests
- User Flows: 0%

## Coverage Targets
- Unit Tests: 80% minimum
- Integration Tests: 70% minimum
- E2E Tests: Critical paths 100%
```

**deployment-config.md** (DevOps Expert):
```markdown
# Deployment Configuration

## Environment Setup
- Development: Local Docker containers
- Staging: Not yet configured
- Production: Not yet configured

## Docker Configuration
- Dockerfile: Pending creation
- docker-compose.yml: Pending creation

## CI/CD Pipeline
- GitHub Actions: Not configured
- Automated Tests: Not configured
- Deployment Automation: Not configured

## Next Steps
1. Create Dockerfile for Next.js app
2. Create Dockerfile for Nest.js API
3. Setup docker-compose for local development
4. Configure GitHub Actions workflow
```

## Logging System Deep Dive

### Purpose and Responsibilities

**Primary Role**: Historical audit trails and trend analysis

**Key Functions**:
1. **Performance Trend Analysis**: Track performance changes over time
2. **Expert Productivity Analysis**: Measure skill efficiency and collaboration patterns
3. **Quality Improvement Tracking**: Monitor quality metrics evolution
4. **Audit Trails**: Maintain compliance and change history records
5. **Long-Term Learning**: Identify patterns and optimization opportunities

### Log Categories

#### Session Logs
**Format**: `.logs/sessions/session-{YYYYMMDD-HHMMSS}.log`

**Content**:
```
[2025-01-21 10:00:00] SESSION_START id=session-001
[2025-01-21 10:05:00] TASK_STARTED task=frontend_component_development skill=frontend-nextjs
[2025-01-21 10:45:00] DECISION_RECORDED decision=tailwind-css-selection skill=frontend-nextjs
[2025-01-21 11:00:00] COLLAB_INITIATED from=frontend-nextjs to=backend-nestjs topic=api-integration
[2025-01-21 11:15:00] COLLAB_COMPLETED participants=[frontend,backend] outcome=api-contract-agreed
[2025-01-21 11:30:00] MILESTONE_REACHED milestone=component-library-80pct
[2025-01-21 12:00:00] SESSION_END id=session-001 tasks_completed=5
```

#### Expert Logs
**Format**: `.logs/experts/{skill}-{YYYYMMDD}.log`

**Content**:
```
[2025-01-21 10:05:00] TASK_START task=component-development
[2025-01-21 10:15:00] FILE_CREATED path=src/components/Header.tsx
[2025-01-21 10:30:00] FILE_UPDATED path=src/components/Header.tsx changes=responsive-menu-added
[2025-01-21 10:45:00] DECISION decision=tailwind-css rationale=modern-utility-first
[2025-01-21 11:00:00] COLLAB_REQUEST to=backend-nestjs topic=api-endpoints
[2025-01-21 11:30:00] QUALITY_CHECK typescript_coverage=94pct
[2025-01-21 12:00:00] TASK_PROGRESS task=component-development completion=80pct
```

#### Quality Logs
**Format**: `.logs/quality/quality-metrics-{YYYYMMDD}.log`

**Content**:
```
[2025-01-21 10:00:00] QUALITY_BASELINE typescript_coverage=0 test_coverage=0
[2025-01-21 10:30:00] QUALITY_UPDATE typescript_coverage=75
[2025-01-21 11:00:00] QUALITY_UPDATE typescript_coverage=88
[2025-01-21 11:30:00] QUALITY_UPDATE typescript_coverage=94 quality_gate=PASS
[2025-01-21 12:00:00] QUALITY_TREND trend=improving rate=+14pct/hour
```

#### Collaboration Logs
**Format**: `.logs/collaboration/collab-{YYYYMMDD}.log`

**Content**:
```
[2025-01-21 11:00:00] COLLAB_REQUEST id=collab-001 from=frontend-nextjs to=backend-nestjs
[2025-01-21 11:00:30] COLLAB_ACCEPTED id=collab-001 by=backend-nestjs
[2025-01-21 11:05:00] COLLAB_DISCUSSION id=collab-001 topic=jwt-auth-implementation
[2025-01-21 11:10:00] COLLAB_DECISION id=collab-001 decision=refresh-token-strategy
[2025-01-21 11:15:00] COLLAB_COMPLETED id=collab-001 duration=15min efficiency=HIGH
```

#### Performance Logs
**Format**: `.logs/performance/timing-{YYYYMMDD}.log`

**Content**:
```
[2025-01-21 10:00:00] TASK_TIMING task=component-creation duration=15min
[2025-01-21 10:30:00] BUILD_TIMING build_type=frontend duration=45sec
[2025-01-21 11:00:00] COLLAB_TIMING collab_id=001 duration=15min efficiency=HIGH
[2025-01-21 11:30:00] QUALITY_CHECK_TIMING check_type=typescript duration=5sec
```

### Log Analysis and Insights

Logs are analyzed to generate insights:

**Daily Analysis**:
- Expert productivity metrics
- Collaboration efficiency patterns
- Quality improvement trends
- Performance bottlenecks

**Weekly Analysis**:
- Progress velocity trends
- Skill utilization patterns
- Quality gate success rates
- Common collaboration patterns

**Insights Feed Back to Memory**:
- Update .memory/ with optimization recommendations
- Improve expert coordination strategies
- Refine quality enforcement approach
- Optimize workflow patterns

## Memory-Logging Integration

### Automatic Triggers

**From memory-logging-integration.yaml**:

#### Memory Update → Log Entry
```yaml
triggers:
  memory_to_log:
    - event: expert_memory_update
      source: .memory/{expert}-*.md
      destination: .logs/experts/{expert}-{date}.log

    - event: quality_metrics_update
      source: .memory/project-state.json.quality_metrics
      destination: .logs/quality/quality-metrics-{date}.log

    - event: collaboration_event
      source: .memory/collaboration.log.md
      destination: .logs/collaboration/collab-{date}.log

    - event: decision_recorded
      source: .memory/decisions.md
      destination: .logs/experts/{expert}-{date}.log
```

#### Log Analysis → Memory Optimization
```yaml
feedback_mechanisms:
  log_to_memory:
    - analysis: daily_productivity
      source: .logs/experts/*.log
      destination: .memory/optimization-recommendations.md

    - analysis: quality_trends
      source: .logs/quality/*.log
      destination: .memory/quality-improvement-strategy.md

    - analysis: collaboration_efficiency
      source: .logs/collaboration/*.log
      destination: .memory/collaboration-optimization.md
```

### Integration Examples

**Example 1: Frontend Expert Updates Component**

1. Frontend skill updates `.memory/component-library.md`
2. **Automatic Trigger**: Memory update detected
3. **Log Entry Created**: `.logs/experts/frontend-20250121.log`
   ```
   [15:30:00] FILE_UPDATED file=component-library.md component=Header changes=responsive-menu
   ```
4. **Quality Check**: If quality metrics updated, also log to `.logs/quality/`
5. **Analysis**: Daily analysis identifies component development velocity

**Example 2: Quality Controller Updates Metrics**

1. Quality controller updates `.memory/project-state.json` quality_metrics
2. **Automatic Trigger**: Quality metrics change detected
3. **Log Entry Created**: `.logs/quality/quality-metrics-20250121.log`
   ```
   [15:35:00] QUALITY_UPDATE typescript_coverage=94 test_coverage=0 trend=improving
   ```
4. **Trend Analysis**: Historical logs show +14% improvement over last hour
5. **Feedback to Memory**: Optimization recommendation added to memory

**Example 3: Cross-Skill Collaboration**

1. Frontend requests backend collaboration
2. **Memory Update**: `.memory/collaboration.log.md` updated with collaboration details
3. **Automatic Trigger**: Collaboration event detected
4. **Log Entries Created**:
   - `.logs/collaboration/collab-conversations-20250121.log`
   - `.logs/experts/frontend-20250121.log`
   - `.logs/experts/backend-20250121.log`
5. **Analysis**: Collaboration efficiency measured (duration, outcome quality)
6. **Feedback**: If collaboration highly efficient, pattern saved for future reference

## Memory Templates System

### Template Structure

From **memory-templates.yaml**:

```yaml
core_templates:
  active_context:
    filename: "active-context.md"
    template_content: |
      # Project Active Context

      ## Current Phase
      Phase: {current_phase}
      Progress: {overall_progress}%

      ## Active Tasks
      {active_tasks_list}

      ## Next Milestones
      {next_milestones}

      ## Recent Decisions
      {recent_decisions}

      ## Blockers
      {current_blockers}

      ## Last Updated
      {timestamp}

project_type_templates:
  web_application:
    core_files:
      - ui-components.md
      - api-endpoints.md
      - user-flows.md
      - performance-targets.md

  ai_ml_system:
    core_files:
      - model-architecture.md
      - data-pipeline.md
      - training-requirements.md
      - performance-metrics.md

expert_memory_templates:
  qa:
    - test-coverage.md
    - quality-metrics.md
    - security-testing.md
    - performance-validation.md

  devops:
    - deployment-config.md
    - infrastructure-state.md
    - ci-cd-workflows.md
    - monitoring-metrics.md
```

### Template Initialization Process

```
1. Receive project type from project-detector
2. Read memory-templates.yaml
3. Locate project_type_templates[project_type]
4. Create core template files with placeholders replaced
5. Create project-specific files from core_files list
6. For each active expert/skill:
   a. Locate expert_memory_templates[expert]
   b. Create expert-specific memory files
7. Initialize logging structure
8. Configure integration triggers
9. Return confirmation
```

## Best Practices

### Memory Management
1. **Update Immediately**: Don't batch memory updates, update as work progresses
2. **Be Specific**: Include rationale and context, not just facts
3. **Link Decisions**: Connect decisions to requirements and impacts
4. **Timestamp Everything**: Always include timestamps for historical analysis
5. **Preserve Context**: Include enough information for future restoration

### Logging Practices
1. **Consistent Format**: Use structured log formats for easy parsing
2. **Meaningful Events**: Log significant events, not trivial actions
3. **Include Context**: Each log entry should be self-explanatory
4. **Performance Logging**: Track timing for optimization analysis
5. **Error Logging**: Always log errors with full context

### Integration Optimization
1. **Selective Triggers**: Not every memory change needs logging
2. **Analysis Frequency**: Daily analysis for most projects, weekly for trends
3. **Feedback Loops**: Ensure log analysis actually improves memory strategies
4. **Storage Management**: Archive old logs periodically
5. **Query Performance**: Structure logs for efficient analysis queries

## Configuration Files Reference

### memory-templates.yaml
Contains all template definitions for:
- Core memory files (all projects)
- Project-type-specific files
- Expert-specific memory files
- Template content with placeholders

### logging-system.yaml
Defines logging structure:
- Directory structure (.logs/ subdirectories)
- Log file naming conventions
- Log format specifications
- Analysis protocols

### memory-logging-integration.yaml
Configures integration:
- Automatic trigger definitions
- Memory-to-log mappings
- Log-to-memory feedback mechanisms
- Analysis schedules and parameters

## Troubleshooting

### Memory Restoration Failures
**Symptom**: Context cannot be fully restored after session break
**Cause**: Incomplete memory updates before session end
**Solution**: Always invoke memory-manager before ending sessions

### Missing Expert Memory Files
**Symptom**: Expert-specific memory files don't exist
**Cause**: Expert joined project after initialization
**Solution**: Memory-manager creates missing files on-demand

### Log Integration Not Triggering
**Symptom**: Memory updates don't create log entries
**Cause**: Integration configuration not loaded
**Solution**: Re-initialize memory-manager to reload integration config

### Performance Degradation
**Symptom**: Memory/log operations becoming slow
**Cause**: Excessive log file size
**Solution**: Archive old logs, implement log rotation

---

## Related Skills and Resources

**Related Skills**:
- **pm-orchestrator**: Coordinates memory initialization and session continuity
- **project-detector**: Provides project type for template selection
- **quality-controller**: Uses memory for quality metrics tracking
- **All specialist skills**: Use skill-specific memory files for context

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Configuration Files**:
- **memory-templates.yaml**: Memory structure templates for all project types
- **logging-system.yaml**: Logging directory structure and formats
- **memory-logging-integration.yaml**: Integration triggers and feedback mechanisms

---

This technical reference guide supports the memory-logging hybrid system for complete context preservation, session continuity, and the autonomous skills-based development system.
