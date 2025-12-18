# Skill Manifest Specification v1.0

## Purpose

This specification defines a formal schema for skill definitions in the Agentic Dev AI Team. The manifest enables:
- **Deterministic Invocation**: Reduce ambiguity in skill selection
- **Type Safety**: Explicit input/output contracts
- **Dependency Management**: Clear skill dependencies and prerequisites
- **Risk Assessment**: Operational risk classification

## Manifest Structure

### YAML Frontmatter Schema

Every `SKILL.md` file MUST include a YAML frontmatter block with the following schema:

```yaml
---
# REQUIRED FIELDS
name: string                    # Unique skill identifier (kebab-case)
version: string                 # Semver version (e.g., "1.0.0")
description: string             # One-line description for context matching
category: enum                  # infrastructure | domain | support

# INVOCATION CONTROL
triggers:                       # Conditions that invoke this skill
  keywords: string[]            # Keywords that trigger invocation
  file_patterns: string[]       # File patterns (glob) that trigger
  project_types: string[]       # Project types (from project-detector)
  explicit_mention: boolean     # Requires explicit mention to invoke

# CAPABILITIES
inputs:                         # What this skill requires
  required: InputSpec[]         # Required inputs
  optional: InputSpec[]         # Optional inputs

outputs:                        # What this skill produces
  artifacts: OutputSpec[]       # Files/artifacts created
  memory_updates: string[]      # Memory files updated
  side_effects: string[]        # External side effects

# DEPENDENCIES
dependencies:
  skills: SkillDependency[]     # Other skills this depends on
  workflows: string[]           # Required workflow completions
  memory_files: string[]        # Memory files that must exist
  tools: string[]               # MCP tools used

# OPERATIONAL CHARACTERISTICS
risk_level: enum                # low | medium | high | critical
execution_mode: enum            # autonomous | supervised | manual
parallel_safe: boolean          # Can run in parallel with other skills
idempotent: boolean             # Safe to run multiple times

# TOOL RESTRICTIONS
allowed-tools: string[]         # Allowed Claude Code tools

# METADATA
author: string                  # Skill author
last_updated: date              # Last modification date
---
```

### Type Definitions

```typescript
// Input specification
interface InputSpec {
  name: string;                 // Input parameter name
  type: 'string' | 'file' | 'json' | 'memory_ref';
  description: string;          // What this input is for
  validation?: string;          // Validation rule or regex
  default?: any;                // Default value if optional
}

// Output specification
interface OutputSpec {
  name: string;                 // Output artifact name
  type: 'file' | 'directory' | 'memory_update' | 'log';
  path: string;                 // Path template (supports {variables})
  description: string;          // What this output is
}

// Skill dependency
interface SkillDependency {
  skill: string;                // Skill name
  relationship: 'requires' | 'recommends' | 'conflicts';
  reason: string;               // Why this dependency exists
}
```

## Category Definitions

### Infrastructure Skills (4 total)

Infrastructure skills manage system-level concerns:

| Skill | Purpose | Risk Level |
|-------|---------|------------|
| `pm-orchestrator` | Project coordination, workflow routing | critical |
| `memory-manager` | Memory system operations | medium |
| `project-detector` | Project type detection | low |
| `quality-controller` | Quality gate enforcement | medium |

### Domain Skills (10 total)

Domain skills implement specific technical capabilities:

| Skill | Domain | Risk Level |
|-------|--------|------------|
| `frontend-nextjs` | Next.js web UI | medium |
| `mobile-react-native` | React Native mobile | medium |
| `backend-nestjs` | NestJS APIs | medium |
| `backend-fastapi` | FastAPI Python APIs | medium |
| `fullstack-integration` | System architecture | high |
| `systemdev-specialist` | AI/ML, GPU, Video | high |
| `devops-deployment` | Docker, CI/CD | high |
| `qa-testing` | E2E testing | low |
| `research-analysis` | Technology research | low |
| `mcp-tools-orchestrator` | MCP tool coordination | medium |

## Risk Level Definitions

| Level | Definition | Autonomy | Review Required |
|-------|------------|----------|-----------------|
| `low` | Read-only, no side effects | Full | None |
| `medium` | File modifications, reversible | Full | Self-review |
| `high` | External systems, hard to reverse | Supervised | Checkpoint review |
| `critical` | Project-wide impact, irreversible | Manual confirmation | Always |

### Risk Level Guidelines

**Low Risk**:
- Reading files and memory
- Generating reports
- Research and analysis
- Running read-only queries

**Medium Risk**:
- Writing source code files
- Updating memory files
- Running tests
- Generating configurations

**High Risk**:
- Database migrations
- External API integrations
- Infrastructure changes
- Security-sensitive operations

**Critical Risk**:
- Production deployments
- Data deletion
- Authentication system changes
- Breaking API changes

## Execution Modes

### Autonomous Mode
- Skill executes without user confirmation
- Default for low/medium risk operations
- Results reviewed post-execution

### Supervised Mode
- Skill announces intent before major actions
- Checkpoint confirmations at key milestones
- Default for high risk operations

### Manual Mode
- Requires explicit user approval for each step
- Used for critical risk operations
- pm-orchestrator coordinates approval flow

## Example Manifests

### Example 1: backend-nestjs

```yaml
---
name: backend-nestjs
version: "1.2.0"
description: "NestJS backend API development with TypeScript, TypeORM, and OpenAPI documentation"
category: domain

triggers:
  keywords:
    - "backend"
    - "API"
    - "NestJS"
    - "REST"
    - "GraphQL"
    - "endpoint"
    - "controller"
    - "service"
  file_patterns:
    - "workspace/backend/**/*.ts"
    - "**/nest-cli.json"
    - "**/*.controller.ts"
    - "**/*.service.ts"
  project_types:
    - "web_application"
    - "api_microservice"
  explicit_mention: false

inputs:
  required:
    - name: "architecture_context"
      type: "memory_ref"
      description: "Architecture design from .memory/integration-architecture.md"
      validation: "file_exists"
  optional:
    - name: "api_spec"
      type: "file"
      description: "OpenAPI specification file"
      default: null

outputs:
  artifacts:
    - name: "backend_project"
      type: "directory"
      path: "workspace/backend/"
      description: "Complete NestJS project structure"
    - name: "openapi_spec"
      type: "file"
      path: "workspace/backend/openapi.json"
      description: "Generated OpenAPI specification"
  memory_updates:
    - ".memory/api-endpoints.md"
    - ".memory/database-schema.md"
    - ".memory/service-architecture.md"
  side_effects:
    - "Database migrations may be created"
    - "npm packages installed"

dependencies:
  skills:
    - skill: "fullstack-integration"
      relationship: "requires"
      reason: "Architecture design must be complete"
    - skill: "devops-deployment"
      relationship: "recommends"
      reason: "Deployment configuration coordination"
  workflows:
    - "03-architecture-design"
  memory_files:
    - ".memory/integration-architecture.md"
    - ".memory/active-context.md"
  tools:
    - "Context7"
    - "GitHub"

risk_level: medium
execution_mode: autonomous
parallel_safe: true
idempotent: false

allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep

author: "agentic-dev-ai-team"
last_updated: 2025-01-15
---
```

### Example 2: pm-orchestrator

```yaml
---
name: pm-orchestrator
version: "2.0.0"
description: "Central project coordinator managing workflows, skill coordination, and strategic decisions. Always invoked first for new projects and major decisions."
category: infrastructure

triggers:
  keywords:
    - "create project"
    - "start development"
    - "new feature"
    - "project plan"
    - "coordinate"
    - "workflow"
  file_patterns:
    - ".memory/project-state.json"
    - ".memory/active-context.md"
  project_types:
    - "*"  # All project types
  explicit_mention: false

inputs:
  required:
    - name: "user_request"
      type: "string"
      description: "User's project request or instruction"
      validation: "non_empty"
  optional:
    - name: "project_context"
      type: "memory_ref"
      description: "Existing project state"
      default: null

outputs:
  artifacts:
    - name: "project_structure"
      type: "directory"
      path: "workspace/"
      description: "Project workspace directory"
  memory_updates:
    - ".memory/active-context.md"
    - ".memory/project-state.json"
    - ".memory/decisions.md"
    - ".memory/collaboration.log.md"
  side_effects:
    - "Invokes other skills"
    - "Creates project structure"
    - "Initializes memory system"

dependencies:
  skills:
    - skill: "project-detector"
      relationship: "requires"
      reason: "Needs project type for team assembly"
    - skill: "memory-manager"
      relationship: "requires"
      reason: "Memory system initialization"
    - skill: "quality-controller"
      relationship: "requires"
      reason: "Quality standards setup"
  workflows: []  # No workflow dependencies - this skill RUNS workflows
  memory_files: []  # Creates memory files, doesn't require them
  tools:
    - "Sequential Thinking"
    - "Context7"

risk_level: critical
execution_mode: autonomous  # Despite critical, operates autonomously (Zero-Confirmation principle)
parallel_safe: false  # Central coordinator - one at a time
idempotent: false

allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Sequential Thinking MCP
  - Context7 MCP

author: "agentic-dev-ai-team"
last_updated: 2025-01-15
---
```

### Example 3: quality-controller

```yaml
---
name: quality-controller
version: "1.1.0"
description: "Quality gate enforcement with project-type-specific validation. Validates code quality, performance, security, and accessibility."
category: infrastructure

triggers:
  keywords:
    - "quality check"
    - "validate"
    - "quality gate"
    - "code review"
    - "lint"
    - "test coverage"
  file_patterns:
    - "**/quality-standards.json"
    - "**/*.test.ts"
    - "**/*.spec.ts"
  project_types:
    - "*"
  explicit_mention: false

inputs:
  required:
    - name: "project_type"
      type: "string"
      description: "Project type for standards selection"
      validation: "enum:web_application,ai_ml_system,mobile_application,api_microservice,data_processing,desktop_application"
  optional:
    - name: "validation_scope"
      type: "string"
      description: "Specific validation to run"
      default: "full"

outputs:
  artifacts:
    - name: "quality_report"
      type: "file"
      path: "workspace/reports/quality-report-{timestamp}.json"
      description: "Quality validation results"
  memory_updates:
    - ".memory/quality-metrics.md"
  side_effects:
    - "May fail build if quality gates not met"

dependencies:
  skills:
    - skill: "project-detector"
      relationship: "requires"
      reason: "Need project type for standards"
  workflows: []
  memory_files:
    - ".memory/project-state.json"
  tools: []

risk_level: low
execution_mode: autonomous
parallel_safe: true
idempotent: true

allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob

author: "agentic-dev-ai-team"
last_updated: 2025-01-15
---
```

## Invocation Algorithm

### Priority-Based Selection

When multiple skills match a request:

```python
def select_skill(request: str, context: ProjectContext) -> Skill:
    candidates = []
    
    for skill in all_skills:
        score = 0
        
        # Keyword matching (0-40 points)
        keyword_matches = count_keyword_matches(request, skill.triggers.keywords)
        score += min(keyword_matches * 10, 40)
        
        # File pattern matching (0-30 points)
        if context.active_files:
            pattern_matches = count_pattern_matches(context.active_files, skill.triggers.file_patterns)
            score += min(pattern_matches * 15, 30)
        
        # Project type matching (0-20 points)
        if context.project_type in skill.triggers.project_types or "*" in skill.triggers.project_types:
            score += 20
        
        # Explicit mention bonus (0-10 points)
        if skill_mentioned_by_name(request, skill.name):
            score += 10
        
        if score > 0:
            candidates.append((skill, score))
    
    # Sort by score descending
    candidates.sort(key=lambda x: x[1], reverse=True)
    
    # Return highest scoring skill
    if candidates:
        return candidates[0][0]
    
    return None
```

### Dependency Resolution

Before invoking a skill:

```python
def resolve_dependencies(skill: Skill, context: ProjectContext) -> List[Skill]:
    required_skills = []
    
    for dep in skill.dependencies.skills:
        if dep.relationship == "requires":
            # Check if dependency is satisfied
            if not is_dependency_satisfied(dep.skill, context):
                required_skills.append(get_skill(dep.skill))
    
    # Check workflow dependencies
    for workflow in skill.dependencies.workflows:
        if not is_workflow_complete(workflow, context):
            raise WorkflowDependencyError(f"Workflow {workflow} must be complete")
    
    # Check memory file dependencies
    for memory_file in skill.dependencies.memory_files:
        if not file_exists(memory_file):
            raise MemoryDependencyError(f"Memory file {memory_file} must exist")
    
    return required_skills
```

## Validation Rules

### Manifest Validation

Every skill manifest is validated on load:

```python
def validate_manifest(manifest: dict) -> List[str]:
    errors = []
    
    # Required fields
    required_fields = ['name', 'version', 'description', 'category', 'allowed-tools']
    for field in required_fields:
        if field not in manifest:
            errors.append(f"Missing required field: {field}")
    
    # Name format
    if not re.match(r'^[a-z][a-z0-9-]*$', manifest.get('name', '')):
        errors.append("Name must be kebab-case")
    
    # Version format
    if not re.match(r'^\d+\.\d+\.\d+$', manifest.get('version', '')):
        errors.append("Version must be semver format")
    
    # Category validation
    valid_categories = ['infrastructure', 'domain', 'support']
    if manifest.get('category') not in valid_categories:
        errors.append(f"Category must be one of: {valid_categories}")
    
    # Risk level validation
    valid_risk_levels = ['low', 'medium', 'high', 'critical']
    if manifest.get('risk_level') not in valid_risk_levels:
        errors.append(f"Risk level must be one of: {valid_risk_levels}")
    
    return errors
```

## Migration Guide

### Updating Existing Skills

To migrate existing SKILL.md files to this specification:

1. **Add Required Fields**: Ensure all required YAML frontmatter fields are present
2. **Define Triggers**: Add explicit trigger conditions
3. **Specify I/O**: Document all inputs and outputs
4. **Declare Dependencies**: List skill and workflow dependencies
5. **Set Risk Level**: Classify operational risk
6. **Validate**: Run manifest validation

### Backward Compatibility

Skills without the new manifest fields will continue to work with defaults:
- `triggers.explicit_mention`: `false`
- `risk_level`: `medium`
- `execution_mode`: `autonomous`
- `parallel_safe`: `true`
- `idempotent`: `false`

## Changelog

### v1.0.0 (2025-01-15)
- Initial specification
- Core schema definition
- Invocation algorithm
- Risk level system
- Dependency management
