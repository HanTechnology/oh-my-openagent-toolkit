# Example: Session Context Restoration

## Scenario

Developer returns to project after a break. Claude Code session starts and needs to restore full project context.

## Session Restoration Process

### Step 1: Detect Existing Memory

On session start, check for `.memory/` directory:

```python
# Pseudo-code for restoration logic
if exists(".memory/project-state.json"):
    restore_context()
else:
    await_user_instructions()
```

### Step 2: Read Core Memory Files

**Read in priority order:**

1. **project-state.json** - Quick metadata scan
```json
{
  "project": {
    "name": "E-Commerce Platform",
    "type": "web_application"
  },
  "lifecycle": {
    "state": "continuous_development",
    "current_version": "1.2.0"
  },
  "progress": {
    "overall": 85
  }
}
```

2. **active-context.md** - Current state details
```markdown
## Current Focus
- Implementing dark mode feature (FR-023)
- 70% complete, frontend changes done
- Awaiting backend theme preference storage

## Active Skills
- frontend-nextjs: Dark mode components (completed)
- backend-nestjs: User preferences API (in progress)

## Blockers
- Backend deployment pending PR review
```

3. **session-history.json** - Last session details
```json
{
  "sessions": [
    {
      "id": "session-2025-01-14-002",
      "start": "2025-01-14T14:00:00Z",
      "end": "2025-01-14T17:30:00Z",
      "summary": "Implemented dark mode frontend components",
      "files_modified": [
        "workspace/frontend/src/components/ThemeProvider.tsx",
        "workspace/frontend/src/app/layout.tsx"
      ],
      "next_tasks": [
        "Complete backend user preferences API",
        "Add E2E tests for theme switching"
      ]
    }
  ]
}
```

### Step 3: Reconstruct Context Summary

**Generate restoration summary for Claude:**

```
PROJECT CONTEXT RESTORED
========================
Project: E-Commerce Platform
Type: web_application
Version: 1.2.0
Lifecycle: continuous_development

CURRENT STATE
-------------
Phase: Feature Development (FR-023: Dark Mode)
Progress: 70% complete
Last Activity: 2025-01-14 17:30 UTC (yesterday)

ACTIVE WORK
-----------
- Dark mode frontend: COMPLETED
- User preferences API: IN PROGRESS
- E2E tests: PENDING

NEXT TASKS
----------
1. Complete backend user preferences API
2. Add E2E tests for theme switching
3. Update documentation

ACTIVE SKILLS
-------------
- frontend-nextjs (completed current task)
- backend-nestjs (in progress)
- qa-testing (pending)

FILES RECENTLY MODIFIED
-----------------------
- workspace/frontend/src/components/ThemeProvider.tsx
- workspace/frontend/src/app/layout.tsx

BLOCKERS
--------
- Backend deployment pending PR review
========================
```

### Step 4: Reactivate Skills

Based on `active-context.md`, mention required skills:

```
pm-orchestrator: "Resuming dark mode feature development. 
Backend-nestjs skill should complete user preferences API.
QA-testing skill will be needed for E2E tests after backend completion."
```

### Step 5: Update Session History

Record new session start:

```json
{
  "id": "session-2025-01-15-001",
  "start": "2025-01-15T09:00:00Z",
  "restored_from": "session-2025-01-14-002",
  "restoration_summary": "Dark mode feature 70% complete, continuing backend work"
}
```

## Result

**Context Restoration Time**: <2 seconds
**Files Read**: 4 (project-state.json, active-context.md, session-history.json, collaboration.log.md)
**Skills Reactivated**: backend-nestjs, qa-testing (pending)

**Output to User**:
```
Context restored. Project E-Commerce Platform at v1.2.0.
Last activity: Dark mode frontend completed.
Resuming from: User preferences API implementation.
```

## Edge Cases Handled

### Corrupted Memory File
If any core file is corrupted, attempt recovery from session-history.json or prompt user.

### Missing Memory Directory
If `.memory/` doesn't exist but project files exist, offer to initialize memory from existing code analysis.

### Very Old Session
If last session was >30 days ago, provide extended summary and suggest reviewing decisions.md for context.
