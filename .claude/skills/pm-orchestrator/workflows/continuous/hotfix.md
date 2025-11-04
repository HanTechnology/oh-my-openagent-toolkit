# Hotfix Sub-Workflow

## Overview

- **Primary Skill**: pm-orchestrator (coordination), domain skills (implementation)
- **Parent Workflow**: 09-continuous-development.md
- **Work Type**: Critical production fixes, emergencies
- **Version Impact**: PATCH version bump (e.g., v1.2.3 → v1.2.4)
- **Priority**: CRITICAL (highest)
- **Return To**: 06-integration.md (expedited)

## Purpose

Fix CRITICAL production issues that require immediate deployment. This workflow is streamlined for speed while maintaining essential quality gates. Use this ONLY for production emergencies.

## Critical Issue Criteria

**Use hotfix.md when**:
- ❌ Production system down or unavailable
- ❌ Security vulnerability actively exploited
- ❌ Data loss or corruption occurring
- ❌ Critical functionality completely broken
- ❌ Severe performance degradation (system unusable)
- ❌ Legal/compliance violation occurring

**Do NOT use for**:
- ✅ Regular bugs (use bug-fix.md)
- ✅ Feature requests (use feature-development.md)
- ✅ Performance improvements (use performance-optimization.md)
- ✅ Non-critical issues (use appropriate workflow)

## Entry Conditions

- Routed from 09-continuous-development.md Phase 3
- Work type: Hotfix
- Priority: CRITICAL
- Production impact: Severe
- Version: Emergency patch version increment

## Workflow Steps (EXPEDITED)

### Phase 1: Emergency Assessment (FAST)

**Objective**: Quickly understand the critical issue

**Time Limit**: 10-15 minutes

**Actions**:

1. **Immediate Impact Assessment**:
   - What is broken?
   - How many users affected? (all, subset, specific scenario)
   - Is data at risk?
   - Is security compromised?
   - Can users work around it?

2. **Severity Confirmation**:
   Verify this is truly critical:
   - System unavailable? → CRITICAL
   - Security breach? → CRITICAL
   - Data loss? → CRITICAL
   - Annoying but functional? → NOT CRITICAL (use bug-fix.md instead)

3. **Quick Root Cause Identification**:
   - Check recent deployments (.memory/version-history.md)
   - Review error logs (.memory/incident-log.md)
   - Identify likely cause quickly
   - Don't spend excessive time on deep analysis (fix first, analyze later)

4. **Rollback Decision**:
   **CRITICAL DECISION**: Can we rollback instead of hotfix?
   - If issue introduced in last deployment → ROLLBACK (faster, safer)
   - If issue existed before → HOTFIX
   - If rollback breaks other things → HOTFIX

   **Rollback Procedure** (if chosen):
   ```bash
   # Execute via devops-deployment skill
   - Rollback to previous version
   - Verify system healthy
   - Log incident
   - Plan proper fix for next release
   - Return to 09-continuous-development.md
   ```

5. **Update Incident Log**:
   Add to .memory/incident-log.md immediately:
   ```markdown
   ## [CRITICAL] [2025-01-15 14:30] Production Down
   - Severity: CRITICAL
   - Impact: All users unable to access system
   - Status: HOTFIX IN PROGRESS
   - ETA: 1-2 hours
   ```

### Phase 2: Rapid Fix Design (FAST)

**Objective**: Plan minimal fix to restore service

**Time Limit**: 10-20 minutes

**Actions**:

1. **Minimal Fix Strategy**:
   - What is the MINIMAL change to restore service?
   - Avoid comprehensive solutions (fix properly later)
   - Avoid refactoring (do it later)
   - Focus: Restore service NOW

2. **Risk Assessment of Fix**:
   - Will this fix break anything else?
   - Is this fix safe to deploy quickly?
   - Do we need database migration? (avoid if possible)
   - Can we deploy without downtime?

3. **Skill Coordination**:
   Mention ONLY skills absolutely necessary:
   - Frontend critical issue → **frontend-nextjs** or **mobile-react-native**
   - Backend critical issue → **backend-nestjs** or **backend-fastapi**
   - Both → Coordinate with **fullstack-integration**

4. **Expedited Plan**:
   - Fix approach: [Quick description]
   - Files to change: [Minimal set]
   - Testing approach: [Critical path only]
   - Deployment approach: [Fast and safe]

### Phase 3: Emergency Implementation (FAST)

**Objective**: Implement fix quickly and safely

**Time Limit**: 30-60 minutes

**Actions**:

1. **Create Hotfix Branch**:
   ```bash
   git checkout -b hotfix/[critical-issue]
   ```

2. **Implement Minimal Fix**:
   Mention appropriate skill to implement MINIMAL fix:

   - Make ONLY necessary changes
   - Avoid code cleanup
   - Avoid optimization
   - Add minimal error handling
   - Focus on restoring service

3. **Critical Path Testing ONLY**:
   - Test fix resolves issue
   - Test critical user flows work
   - Skip comprehensive testing (expedited QA later)
   - Verify no obvious regressions

4. **Code Review (Self-Review)**:
   Quick self-review:
   - Fix is minimal
   - No obvious mistakes
   - Won't break other things
   - Safe to deploy

### Phase 4: Expedited Integration & Deployment

**Objective**: Deploy fix to production ASAP

**Time Limit**: 30-60 minutes

**Actions**:

1. **Commit Changes**:
   ```bash
   git add .
   git commit -m "hotfix: [critical issue description]

   CRITICAL: [Brief explanation of emergency]
   Fix: [What was changed]

   Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   git push origin hotfix/[critical-issue]
   ```

2. **Expedited Pipeline**:
   Route to integration/deployment with EXPEDITED flag:

   **06-integration.md** (EXPEDITED):
   - Critical path integration tests only
   - Skip non-essential tests
   - Fast validation
   - Time limit: 15-20 minutes

   **07-deployment.md** (EXPEDITED):
   - Deploy to staging
   - Smoke test staging (critical flows only)
   - Deploy to production immediately if staging passes
   - Time limit: 20-30 minutes

   **08-quality-assurance.md** (EXPEDITED):
   - Critical E2E tests only
   - Security scan (if security issue)
   - Basic regression tests
   - Time limit: 30 minutes
   - NOTE: Full QA post-deployment

3. **Production Deployment**:
   Deploy via **devops-deployment** skill:
   - Use safest deployment method (blue-green if available)
   - Monitor deployment closely
   - Have rollback ready
   - Verify fix immediately after deployment

### Phase 5: Post-Deployment Verification (FAST)

**Objective**: Confirm fix works in production

**Time Limit**: 15-30 minutes

**Actions**:

1. **Immediate Verification**:
   - Is system accessible?
   - Is critical functionality working?
   - Are users able to work?
   - Are error rates normal?
   - Is performance acceptable?

2. **Monitoring**:
   - Watch error logs closely (30-60 minutes)
   - Monitor performance metrics
   - Track user reports
   - Be ready to rollback if issues

3. **User Communication**:
   - Update status page (if exists)
   - Notify affected users (if applicable)
   - Communicate resolution
   - Apologize for inconvenience

### Phase 6: Documentation & Follow-Up

**Objective**: Document incident and plan proper fix

**Actions**:

1. **Incident Documentation**:
   Update .memory/incident-log.md:
   ```markdown
   ## [CRITICAL - RESOLVED] [2025-01-15] Production Down
   - Severity: CRITICAL
   - Impact: All users unable to access system (45 minutes)
   - Root Cause: [Technical explanation]
   - Hotfix Applied: v1.2.4
   - Resolution Time: 1.5 hours
   - Users Affected: ~500 active users
   - Status: RESOLVED

   ### Timeline
   - 14:30: Issue detected
   - 14:35: Hotfix initiated
   - 15:15: Fix deployed to staging
   - 15:30: Fix deployed to production
   - 15:45: Verified resolved
   - 16:00: All systems normal

   ### Post-Incident Actions
   - [ ] Conduct post-mortem
   - [ ] Plan comprehensive fix (v1.3.0)
   - [ ] Improve monitoring to detect earlier
   - [ ] Add preventive tests
   ```

2. **Version Documentation**:
   Update .memory/version-history.md:
   ```markdown
   ## v1.2.4 (Emergency Hotfix - 2025-01-15)
   ### Fixed
   - **[CRITICAL]** [Issue description]
   - Restored service availability
   - Emergency deployment

   ### Notes
   - This is a minimal hotfix
   - Comprehensive fix planned for v1.3.0
   - Post-mortem scheduled
   ```

3. **Post-Mortem Planning**:
   Schedule post-mortem (within 48 hours):
   - What happened?
   - Why did it happen?
   - How was it detected?
   - How was it fixed?
   - How do we prevent this?
   - What improvements needed?

4. **Comprehensive Fix Planning**:
   Add to .memory/technical-debt.md:
   ```markdown
   ## Hotfix Follow-Up: [Issue]
   - Hotfix Version: v1.2.4
   - Hotfix was minimal emergency fix
   - Comprehensive fix needed:
     - [Proper solution approach]
     - [Root cause elimination]
     - [Preventive measures]
   - Target: v1.3.0
   - Priority: High
   ```

5. **Preventive Measures**:
   Plan improvements:
   - Add monitoring/alerting
   - Add preventive tests
   - Improve error handling
   - Review similar code for same issue

### Phase 7: Return to Continuous Development

**Objective**: Resume normal operations

**Actions**:

1. **Update Project State**:
   ```json
   {
     "lifecycle_state": "continuous_development",
     "currentPhase": "monitoring",
     "active_workflow": "09-continuous-development.md",
     "last_hotfix": {
       "version": "1.2.4",
       "issue": "[description]",
       "deployed": "2025-01-15T15:30:00Z",
       "resolution_time_minutes": 90
     }
   }
   ```

2. **Plan Follow-Up Work**:
   Create work items for follow-up:
   - Comprehensive fix (feature or refactoring workflow)
   - Preventive improvements (enhancement workflow)
   - Monitoring improvements (devops task)

3. **Return to Normal Flow**:
   - Return to 09-continuous-development.md
   - Resume normal development priorities
   - Complete full QA on hotfix (post-deployment)

## Completion Criteria

- ✅ Critical issue resolved in production
- ✅ Service restored
- ✅ Users can work normally
- ✅ Error rates normal
- ✅ Performance acceptable
- ✅ Incident documented
- ✅ Follow-up work planned
- ✅ Post-mortem scheduled

## Return To

**Immediate**: 06-integration.md (EXPEDITED) → 07-deployment.md (EXPEDITED) → 08-quality-assurance.md (EXPEDITED) → Production

**After Resolution**: 09-continuous-development.md (continuous monitoring)

## Time Targets

**Total Hotfix Timeline**:
- Assessment: 10-15 minutes
- Fix Design: 10-20 minutes
- Implementation: 30-60 minutes
- Deployment: 30-45 minutes
- Verification: 15-30 minutes
- **TOTAL: 1.5-3 hours** (depending on complexity)

**Maximum Acceptable Downtime**:
- Critical systems: <2 hours
- High-priority systems: <4 hours
- Normal systems: <8 hours

## Hotfix Examples

### Example 1: Production Database Connection Failure

**Incident**: All API requests failing with database connection errors

**Execution**:
1. Phase 1: Assessment (15 min) - Database connection pool exhausted
2. Phase 2: Design (10 min) - Increase connection pool size, add connection timeout
3. Phase 3: Implementation (30 min) - Update database config, deploy
4. Phase 4: Deployment (30 min) - Deploy to production, verify
5. Phase 5: Verification (20 min) - Monitor for 20 minutes, all normal
6. Phase 6: Documentation - Log incident, plan proper connection management for v1.3.0
7. Phase 7: Return to continuous development

**Resolution Time**: 1 hour 45 minutes
**Version**: v1.2.3 → v1.2.4

### Example 2: Security Vulnerability Exploit

**Incident**: SQL injection vulnerability being actively exploited

**Execution**:
1. Phase 1: Assessment (10 min) - SQL injection in search endpoint
2. Phase 2: Design (5 min) - Add parameterized queries immediately
3. Phase 3: Implementation (20 min) - Fix vulnerable endpoint, verify no others
4. Phase 4: Deployment (20 min) - Emergency deploy, verify exploit blocked
5. Phase 5: Verification (30 min) - Security test, monitor for attacks
6. Phase 6: Documentation - Full security audit planned, notify users
7. Phase 7: Return to continuous development

**Resolution Time**: 1 hour 25 minutes
**Version**: v1.2.3 → v1.2.4

## Common Issues and Resolutions

**Issue**: Can't identify root cause quickly
**Resolution**: Deploy rollback immediately, investigate offline, proper fix later

**Issue**: Fix more complex than expected
**Resolution**: Deploy workaround if possible, comprehensive fix in next release

**Issue**: Hotfix introduces new issue
**Resolution**: Rollback hotfix, use alternative approach or rollback to pre-issue version

**Issue**: Multiple critical issues simultaneously
**Resolution**: Triage by user impact, fix highest impact first, parallel teams if available

## Success Metrics

- Resolution time: <2 hours for critical issues
- Zero hotfix-caused regressions
- User downtime minimized
- Proper follow-up completed (post-mortem, comprehensive fix)
- Preventive measures implemented
