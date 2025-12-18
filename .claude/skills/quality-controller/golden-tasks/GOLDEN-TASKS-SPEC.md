# Golden Tasks Test Harness Specification

## Purpose

Golden Tasks are standardized test scenarios that verify the Agentic Dev AI Team's skill coordination, workflow execution, and output quality. They serve as regression tests to ensure system upgrades don't break existing functionality.

## Benefits

1. **Regression Detection**: Catch breaking changes before they impact users
2. **Quality Baseline**: Establish measurable quality expectations
3. **Skill Validation**: Verify each skill produces expected outputs
4. **Workflow Testing**: Validate end-to-end workflow execution
5. **Performance Monitoring**: Track execution time trends

## Golden Task Structure

### Task Definition Schema

```yaml
# golden-task-{id}.yaml
id: string                      # Unique identifier (e.g., "GT-001")
name: string                    # Human-readable name
version: string                 # Task version (semver)
category: enum                  # skill_unit | workflow | integration | e2e
description: string             # What this task tests

# Input specification
input:
  user_prompt: string           # The user request that triggers the task
  project_type: string          # Expected project type detection
  initial_state: object|null    # Pre-existing memory state (if any)
  
# Expected behavior
expectations:
  skills_invoked: string[]      # Skills expected to be invoked
  workflows_executed: string[]  # Workflows expected to run
  artifacts_created: string[]   # Files/directories that should be created
  memory_updates: string[]      # Memory files that should be updated
  quality_gates: object         # Quality thresholds that must be met

# Validation rules
validation:
  required_outputs: OutputSpec[]  # Outputs that MUST exist
  forbidden_outputs: string[]     # Outputs that must NOT exist
  content_checks: ContentCheck[]  # Content validation rules
  timing_budget_ms: number        # Maximum execution time

# Metadata
metadata:
  created: date
  last_run: date|null
  pass_rate: number|null        # Historical pass rate
  avg_duration_ms: number|null  # Average execution time
```

### Output Specification

```yaml
OutputSpec:
  path: string                  # File/directory path (supports globs)
  type: file|directory          # Expected type
  min_size_bytes: number|null   # Minimum file size
  max_size_bytes: number|null   # Maximum file size
  contains: string[]|null       # Strings that must be present
  not_contains: string[]|null   # Strings that must NOT be present
```

### Content Check

```yaml
ContentCheck:
  path: string                  # File to check
  rule: regex|contains|json_schema|typescript_valid|no_emojis
  value: string|object          # Rule-specific value
  error_message: string         # Message on failure
```

## Task Categories

### 1. Skill Unit Tests

Test individual skill functionality in isolation.

**Naming**: `GT-S{skill_number}-{test_number}`

**Example**:
- `GT-S01-001`: project-detector correctly identifies web application
- `GT-S02-001`: memory-manager initializes all core files
- `GT-S03-001`: frontend-nextjs creates valid Next.js structure

### 2. Workflow Tests

Test complete workflow execution.

**Naming**: `GT-W{workflow_number}-{test_number}`

**Example**:
- `GT-W01-001`: requirements-analysis produces valid analysis document
- `GT-W03-001`: architecture-design creates integration architecture
- `GT-W05-001`: implementation coordinates frontend and backend

### 3. Integration Tests

Test skill-to-skill coordination.

**Naming**: `GT-I{integration_number}-{test_number}`

**Example**:
- `GT-I01-001`: pm-orchestrator correctly routes to frontend-nextjs
- `GT-I02-001`: backend-nestjs and database-specialist coordinate
- `GT-I03-001`: quality-controller validates all skill outputs

### 4. End-to-End Tests

Test complete project creation from user prompt to deployment-ready code.

**Naming**: `GT-E2E-{test_number}`

**Example**:
- `GT-E2E-001`: Create todo app (web_application)
- `GT-E2E-002`: Create AI image classifier (ai_ml_system)
- `GT-E2E-003`: Create mobile expense tracker (mobile_application)

## Test Execution

### Execution Flow

```
1. Load golden task definition
2. Set up clean workspace (rm -rf workspace/*)
3. Initialize memory state (if specified)
4. Execute user prompt
5. Wait for completion (or timeout)
6. Run validation checks
7. Generate report
8. Clean up
```

### Execution Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `full` | Run complete task with all validations | CI/CD, release validation |
| `quick` | Run with reduced validation (structure only) | Development iteration |
| `dry-run` | Parse and validate task definition only | Task authoring |

### Parallel Execution

Golden tasks are designed to run in isolation:
- Each task uses a fresh workspace
- No shared state between tasks
- Can run multiple tasks in parallel

## Validation Rules

### Required Validations (Always Run)

1. **Artifact Existence**: All `required_outputs` must exist
2. **No Forbidden Outputs**: None of `forbidden_outputs` may exist
3. **TypeScript Validity**: All `.ts` files must pass `tsc --noEmit`
4. **No Emojis**: No emoji characters in source files
5. **Memory Consistency**: Memory files must be valid JSON/Markdown

### Optional Validations (Per-Task)

1. **Content Checks**: Custom regex/contains rules
2. **JSON Schema**: Validate JSON structure
3. **Test Passing**: `npm test` passes
4. **Build Success**: `npm run build` succeeds
5. **Lint Clean**: `npm run lint` has no errors

### Quality Gates

```yaml
quality_gates:
  typescript_errors: 0          # Must be exactly 0
  lint_errors: 0                # Must be exactly 0
  test_coverage_min: 70         # Minimum percentage
  lighthouse_performance_min: 80 # Minimum score
  security_critical: 0          # No critical vulnerabilities
  security_high: 0              # No high vulnerabilities
```

## Reporting

### Task Report Format

```json
{
  "task_id": "GT-E2E-001",
  "task_name": "Create todo app",
  "status": "PASS|FAIL|ERROR|TIMEOUT",
  "duration_ms": 45000,
  "timestamp": "2025-01-15T10:30:00Z",
  "validations": {
    "total": 15,
    "passed": 14,
    "failed": 1,
    "skipped": 0
  },
  "failures": [
    {
      "check": "content_check",
      "path": "workspace/frontend/src/app/page.tsx",
      "expected": "contains 'use client'",
      "actual": "not found",
      "message": "Client component directive missing"
    }
  ],
  "artifacts": {
    "created": ["workspace/frontend/", "workspace/backend/"],
    "missing": []
  },
  "skills_invoked": ["pm-orchestrator", "project-detector", "frontend-nextjs", "backend-nestjs"],
  "memory_state": {
    "files_created": 10,
    "files_updated": 3
  }
}
```

### Suite Report Format

```json
{
  "suite_name": "Golden Tasks Regression Suite",
  "timestamp": "2025-01-15T10:30:00Z",
  "duration_ms": 300000,
  "summary": {
    "total": 20,
    "passed": 18,
    "failed": 2,
    "error": 0,
    "timeout": 0,
    "pass_rate": 90.0
  },
  "by_category": {
    "skill_unit": { "total": 10, "passed": 10 },
    "workflow": { "total": 5, "passed": 4 },
    "integration": { "total": 3, "passed": 2 },
    "e2e": { "total": 2, "passed": 2 }
  },
  "tasks": [
    { "id": "GT-S01-001", "status": "PASS", "duration_ms": 5000 },
    { "id": "GT-W03-001", "status": "FAIL", "duration_ms": 25000 }
  ],
  "trends": {
    "pass_rate_7d": [88, 90, 92, 90, 91, 89, 90],
    "avg_duration_7d": [280000, 290000, 285000, 295000, 300000, 298000, 300000]
  }
}
```

## Usage

### Running Golden Tasks

```bash
# Run all golden tasks
./run-golden-tasks.sh --all

# Run specific category
./run-golden-tasks.sh --category e2e

# Run single task
./run-golden-tasks.sh --task GT-E2E-001

# Quick mode (structure validation only)
./run-golden-tasks.sh --all --mode quick

# Generate report
./run-golden-tasks.sh --all --report report.json
```

### Adding New Golden Tasks

1. Create task definition in `golden-tasks/tasks/`
2. Follow naming convention for category
3. Run in dry-run mode to validate definition
4. Run full execution to establish baseline
5. Update `golden-tasks/index.yaml` with new task

### CI/CD Integration

```yaml
# .github/workflows/golden-tasks.yml
name: Golden Tasks Regression
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  golden-tasks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Run Golden Tasks
        run: ./run-golden-tasks.sh --all --report report.json
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: golden-tasks-report
          path: report.json
      - name: Check Pass Rate
        run: |
          PASS_RATE=$(jq '.summary.pass_rate' report.json)
          if (( $(echo "$PASS_RATE < 95" | bc -l) )); then
            echo "Pass rate $PASS_RATE% below threshold (95%)"
            exit 1
          fi
```

## Maintenance

### Task Lifecycle

1. **Draft**: Task definition created, not yet validated
2. **Active**: Task passing, included in regression suite
3. **Flaky**: Task intermittently failing (needs investigation)
4. **Deprecated**: Task no longer relevant (pending removal)
5. **Archived**: Task removed from active suite

### Updating Tasks

When system behavior changes intentionally:
1. Update task expectations to match new behavior
2. Document reason for change
3. Increment task version
4. Re-baseline pass rate and timing

### Handling Flaky Tasks

1. Identify root cause (timing, environment, randomness)
2. Add appropriate retry logic or stabilization
3. If unfixable, mark as flaky and exclude from CI failure criteria
4. Track flaky rate separately

## Best Practices

1. **Atomic Tasks**: Each task tests one specific behavior
2. **Deterministic**: Same input should produce same validation result
3. **Fast Feedback**: Keep individual task duration under 60s
4. **Clear Failures**: Failure messages should indicate exact problem
5. **Version Tasks**: Update version when expectations change
6. **Document Intent**: Description should explain what and why
