# Bug Fix Sub-Workflow

## Overview

- **Primary Skill**: pm-orchestrator (coordination), domain skills (implementation)
- **Parent Workflow**: 09-continuous-development.md
- **Work Type**: Bug fixes, defect resolution
- **Version Impact**: PATCH version bump (e.g., v1.2.3 → v1.2.4)
- **Priority**: High
- **Return To**: 06-integration.md

## Purpose

Fix bugs and defects in the application. This workflow handles non-critical issues that affect functionality but do not require immediate emergency deployment (use hotfix.md for critical production issues).

## Entry Conditions

- Routed from 09-continuous-development.md Phase 3
- Work type: Bug fix
- Priority: High (but not critical)
- Version: Patch version increment planned

## Workflow Steps

### Phase 1: Bug Analysis

**Objective**: Understand the bug and its root cause

**Actions**:

1. **Read Bug Report**:
   - .memory/user-feedback.md for user-reported bugs
   - .memory/incident-log.md for logged incidents
   - User request with bug description
   - QA test failure reports

2. **Bug Information Gathering**:
   Required information:
   - What is the expected behavior?
   - What is the actual behavior?
   - How to reproduce the bug? (steps)
   - What environment? (browser, OS, device)
   - Error messages or stack traces?
   - When did this start happening? (recent deployment?)

3. **Impact Assessment**:
   - How many users affected?
   - Severity: Critical / High / Medium / Low
   - Workaround available?
   - Data loss or corruption possible?
   - Security implications?

4. **Categorization**:
   - Frontend bug (UI, behavior, display)
   - Backend bug (API, logic, database)
   - Integration bug (frontend-backend communication)
   - Performance bug (slow, timeout)
   - Data bug (incorrect data, corruption)

### Phase 2: Root Cause Analysis

**Objective**: Find the source of the bug

**Actions**:

1. **Code Investigation**:
   Use Sequential Thinking MCP to systematically investigate:
   - Review recent changes (check .memory/version-history.md)
   - Check related code files
   - Review error logs (.memory/incident-log.md)
   - Trace execution flow
   - Identify the defect location

2. **Reproduction**:
   - Reproduce the bug locally or in staging
   - Document exact reproduction steps
   - Verify bug exists in current version
   - Check if already fixed in development branch

3. **Root Cause Identification**:
   Common root causes:
   - Logic error in code
   - Missing validation
   - Incorrect data handling
   - Race condition
   - Missing error handling
   - Dependency issue
   - Configuration error
   - Integration problem

4. **Regression Check**:
   - Is this a regression (previously working)?
   - Which version introduced the bug?
   - What change caused it?

### Phase 3: Fix Design

**Objective**: Plan the fix approach

**Actions**:

1. **Fix Strategy**:
   - Simplest fix that addresses root cause
   - Avoid over-engineering
   - Maintain backward compatibility
   - Consider edge cases
   - Plan testing approach

2. **Skill Coordination**:
   Based on bug location, mention required skill:
   - Frontend bug → **frontend-nextjs** or **mobile-react-native**
   - Backend bug → **backend-nestjs** or **backend-fastapi**
   - Integration bug → **fullstack-integration**
   - Multiple components → Coordinate multiple skills

3. **Impact Analysis of Fix**:
   - What code will change?
   - Will this affect other features?
   - Performance impact of fix?
   - Testing scope required?

### Phase 4: Implementation

**Objective**: Fix the bug

**Actions**:

1. **Create Bug Fix Branch**:
   ```bash
   git checkout -b fix/[bug-description]
   ```

2. **Implement Fix**:
   Mention appropriate skill to implement:

   **Frontend Bug Fix**:
   - Locate defective component/logic
   - Implement fix
   - Add defensive coding (validation, error handling)
   - Add regression test
   - Verify fix with reproduction steps

   **Backend Bug Fix**:
   - Locate defective service/controller
   - Implement fix
   - Add input validation if missing
   - Add error handling if missing
   - Add unit test for bug scenario
   - Verify fix with API testing

   **Database Bug Fix**:
   - Identify data issue
   - Create migration if schema fix needed
   - Fix data integrity issues
   - Add constraints if missing
   - Test migration (up and down)

3. **Regression Testing**:
   - Verify bug no longer occurs
   - Test related functionality not broken
   - Run existing test suites
   - Add new test case for this bug

### Phase 5: Verification

**Objective**: Confirm fix works correctly

**Actions**:

1. **Bug Verification**:
   - Reproduce original bug scenario
   - Verify fixed behavior matches expected
   - Test edge cases
   - Test on affected environments (browsers/devices)

2. **Regression Verification**:
   - Run full test suite
   - Verify no new bugs introduced
   - Check related features still work
   - Performance regression check

3. **Code Review**:
   - Self-review code changes
   - Ensure code quality maintained
   - Check for similar bugs elsewhere
   - Verify error handling added

### Phase 6: Documentation

**Objective**: Document the bug and fix

**Actions**:

1. **Bug Documentation**:
   Create workspace/docs/bugs/[bug-id].md:
   ```markdown
   # Bug: [Bug Description]

   ## Symptoms
   [What users experienced]

   ## Root Cause
   [Technical explanation]

   ## Fix Applied
   [What was changed]

   ## Affected Versions
   - Introduced in: v1.2.0
   - Fixed in: v1.2.4

   ## Verification
   [How to verify fix]
   ```

2. **Changelog Entry**:
   Add to .memory/version-history.md:
   ```markdown
   ## v1.2.4 (Planned - 2025-01-16)
   ### Fixed
   - [Bug description] ([issue reference if exists])
   ```

3. **User Communication** (if user-reported):
   Update .memory/user-feedback.md:
   - Mark bug as fixed
   - Note fix version
   - Prepare user notification (if applicable)

### Phase 7: Memory System Updates

**Objective**: Update memory with bug fix context

**Memory Updates**:

1. **Update .memory/active-context.md**:
   ```markdown
   ## Current Work
   - Bug Fix: [Bug description]
   - Status: Fix implemented and verified
   - Target Version: v1.2.4
   - Next: Integration testing
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "current_work": {
       "type": "bug_fix",
       "bug": "[bug-description]",
       "status": "fix_verified",
       "target_version": "1.2.4",
       "severity": "high"
     }
   }
   ```

3. **Update .memory/incident-log.md**:
   ```markdown
   ## [2025-01-15] Bug: [Description]
   - Severity: High
   - Impact: [User impact]
   - Root Cause: [Cause]
   - Fix: [Solution]
   - Status: Fixed in v1.2.4
   ```

### Phase 8: Return to Integration Pipeline

**Objective**: Hand off to quality assurance pipeline

**Actions**:

1. **Commit Changes**:
   ```bash
   git add .
   git commit -m "fix: [bug description]

   - Root cause: [Brief explanation]
   - Fix: [What was changed]
   - Closes: [issue reference if exists]

   Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   git push origin fix/[bug-description]
   ```

2. **Update Project State**:
   ```json
   {
     "currentPhase": "integration",
     "active_workflow": "06-integration.md"
   }
   ```

3. **Route to Integration**:
   - Return control to pm-orchestrator
   - pm-orchestrator routes to 06-integration.md
   - Integration → Deployment → QA → Release
   - After release: Return to 09-continuous-development.md

4. **Priority Deployment**:
   High-severity bugs may warrant expedited release:
   - Fast-track through QA (focus on regression)
   - Deploy to staging immediately
   - Release quickly after validation
   - Monitor closely post-deployment

## Completion Criteria

- ✅ Bug reproduced and root cause identified
- ✅ Fix implemented
- ✅ Bug verified as fixed
- ✅ Regression tests pass
- ✅ New test case added for bug
- ✅ Documentation updated
- ✅ Code committed to fix branch
- ✅ Memory system updated
- ✅ Ready for integration testing

## Return To

**Next Workflow**: 06-integration.md (integration testing)

**After Full Pipeline**:
06-integration.md → 07-deployment.md → 08-quality-assurance.md → release-management.md → Production → 09-continuous-development.md

## Bug Fix Examples

### Example 1: Login Timeout on Slow Networks

**Bug Report**: "Users on slow networks can't log in - they get timeout error"

**Execution**:
1. Phase 1: Bug analysis (authentication flow timing out after 5 seconds)
2. Phase 2: Root cause (hardcoded 5s timeout, inadequate for slow networks)
3. Phase 3: Fix design (increase timeout to 30s, add retry logic)
4. Phase 4: Implementation
   - Backend: Increase timeout configuration
   - Frontend: Add retry logic, better loading states
5. Phase 5: Verification (test on throttled network, verify works)
6. Phase 6: Documentation (document timeout settings)
7. Phase 7: Memory updates (v1.2.3 → v1.2.4)
8. Phase 8: Return to integration pipeline

**Severity**: High (blocks user access)
**Version**: v1.2.3 → v1.2.4

### Example 2: Incorrect Data Display in Dashboard

**Bug Report**: "Dashboard shows wrong numbers for monthly revenue"

**Execution**:
1. Phase 1: Bug analysis (revenue calculation incorrect)
2. Phase 2: Root cause (date range query using wrong timezone)
3. Phase 3: Fix design (use UTC for date comparisons, convert for display)
4. Phase 4: Implementation
   - Backend: Fix date range query logic
   - Add unit tests for date handling
5. Phase 5: Verification (test with different timezones, verify accuracy)
6. Phase 6: Documentation (document timezone handling approach)
7. Phase 7: Memory updates (v1.3.1 → v1.3.2)
8. Phase 8: Return to integration pipeline

**Severity**: High (data accuracy issue)
**Version**: v1.3.1 → v1.3.2

## Common Issues and Resolutions

**Issue**: Cannot reproduce bug
**Resolution**: Request more information from user, check production logs, test in production-like environment

**Issue**: Fix breaks other functionality
**Resolution**: Redesign fix approach, expand test coverage, consider root cause analysis deeper

**Issue**: Bug is actually a feature request
**Resolution**: Reclassify as feature, route to feature-development.md, update release plan

**Issue**: Bug requires architecture change
**Resolution**: Escalate to major version if breaking change needed

**Issue**: Multiple related bugs discovered
**Resolution**: Fix all in same patch version, batch together for testing efficiency

**Issue**: Bug fix performance impact
**Resolution**: Optimize fix, add performance tests, monitor after deployment

## Success Metrics

- Bug fixed within target timeline (±1-2 days)
- No regression (fix doesn't break other features)
- Zero reopened bugs (fix is complete)
- User confirms fix works
- Test coverage increased (new test cases added)
