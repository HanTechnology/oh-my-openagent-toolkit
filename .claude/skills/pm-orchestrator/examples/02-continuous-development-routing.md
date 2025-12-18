# Example: Continuous Development Work Routing

## Scenario

Production e-commerce platform (v1.2.0) receives multiple work items:
1. User request: "Add dark mode toggle"
2. Bug report: "Login timeout on mobile Safari"
3. Production alert: "Database connection pool exhausted"

## Work Routing Process

### Step 1: Detect Lifecycle State

pm-orchestrator reads `.memory/project-state.json`:

```json
{
  "lifecycle": {
    "state": "continuous_development",
    "current_version": "1.2.0"
  }
}
```

**State**: continuous_development (post v1.0.0)
**Workflow**: 09-continuous-development.md

### Step 2: Work Intake & Classification

#### Work Item 1: "Add dark mode toggle"

**Analysis**:
- New functionality that doesn't exist
- User-facing feature
- No breaking changes expected

**Classification**: Feature Development
**Sub-workflow**: `workflows/continuous/feature-development.md`
**Version Impact**: MINOR (v1.2.0 → v1.3.0)

```markdown
## Work Classification: Dark Mode Toggle

Type: FEATURE_DEVELOPMENT
Priority: Medium
Impact: MINOR version bump

Routing Decision:
- Sub-workflow: feature-development.md
- Skills Required: frontend-nextjs, backend-nestjs (user preferences)
- Estimated Effort: 8-15 minutes
- Target Version: v1.3.0
```

#### Work Item 2: "Login timeout on mobile Safari"

**Analysis**:
- Existing functionality not working correctly
- User reports functional defect
- No new features involved

**Classification**: Bug Fix
**Sub-workflow**: `workflows/continuous/bug-fix.md`
**Version Impact**: PATCH (v1.2.0 → v1.2.1)

```markdown
## Work Classification: Login Timeout

Type: BUG_FIX
Priority: High
Impact: PATCH version bump

Routing Decision:
- Sub-workflow: bug-fix.md
- Skills Required: backend-nestjs, qa-testing
- Estimated Effort: 5-8 minutes
- Target Version: v1.2.1
```

#### Work Item 3: "Database connection pool exhausted"

**Analysis**:
- Production system affected
- Service availability at risk
- Requires immediate attention

**Classification**: HOTFIX (CRITICAL)
**Sub-workflow**: `workflows/continuous/hotfix.md`
**Version Impact**: PATCH (v1.2.0 → v1.2.1) - EXPEDITED

```markdown
## Work Classification: Database Pool Exhausted

Type: HOTFIX
Priority: CRITICAL
Impact: PATCH version bump (EXPEDITED)

Routing Decision:
- Sub-workflow: hotfix.md
- Skills Required: backend-nestjs, devops-deployment
- Estimated Effort: ASAP (15-minute MTTR target)
- Target Version: v1.2.1 (EXPEDITED RELEASE)
```

### Step 3: Priority-Based Execution Order

pm-orchestrator determines execution order:

```
1. HOTFIX: Database Pool (CRITICAL - IMMEDIATE)
   └── Start now, expedited pipeline
   
2. BUG_FIX: Login Timeout (HIGH)
   └── Start after hotfix deployed
   
3. FEATURE: Dark Mode (MEDIUM)
   └── Queue for v1.3.0 release cycle
```

### Step 4: Execute Hotfix (CRITICAL)

```markdown
## Hotfix Execution: Database Pool Exhausted

### Phase 1: Triage (2 min)
- Identified: Connection leak in error handler
- Affected: All API endpoints
- Impact: Service degradation

### Phase 2: Quick Fix (5 min)
backend-nestjs implements:
- Increase pool size: 100 → 200
- Add connection timeout: 30s
- Fix missing connection.release() in error handlers

### Phase 3: Expedited Deploy (5 min)
devops-deployment:
- Skip staging (CRITICAL)
- Direct production deployment
- Health check monitoring

### Phase 4: Verify (3 min)
- Connection pool: 45/200 (stable)
- Error rate: 0%
- Service: Healthy

### Phase 5: Post-Mortem
Record in .memory/incident-log.md:
- Root cause documented
- Permanent fix identified: Add connection lifecycle monitoring
- Follow-up: TD-005 created for technical debt
```

**Version Released**: v1.2.1 (HOTFIX)
**MTTR**: 15 minutes

### Step 5: Resume Normal Workflow

After hotfix deployed, continue with queued work:

```markdown
## Next Work Item: Bug Fix - Login Timeout

Routing: bug-fix.md
Skills: backend-nestjs, qa-testing

Execution:
1. Reproduce issue on Safari
2. Identify root cause (JWT expiration)
3. Implement fix (extend token, add refresh)
4. Add E2E test for Safari session
5. Integration pipeline (06 → 07 → 08)
6. Release v1.2.2 (PATCH)
```

### Step 6: Update Release Plan

```markdown
## Updated Release Plan

v1.2.1 - RELEASED (Hotfix: DB Pool)
v1.2.2 - IN PROGRESS (Bug: Login Timeout)
v1.3.0 - PLANNED (Feature: Dark Mode)
  - Queued features:
    - Dark mode toggle
    - [other v1.3.0 features]
```

## Result

**Work Items Routed**: 3
**Hotfix MTTR**: 15 minutes
**Bug Fix**: Queued (priority 2)
**Feature**: Queued for v1.3.0

**Memory Updates**:
- .memory/incident-log.md (hotfix recorded)
- .memory/version-history.md (v1.2.1 added)
- .memory/release-plan.md (updated queue)
- .memory/technical-debt.md (TD-005 added)
