# Continuous Development Workflow

## Overview

- **Primary Skill**: pm-orchestrator
- **Supporting Skills**: All domain skills (context-dependent)
- **Dependencies**: v1.0 deployed (08-quality-assurance.md completed)
- **Lifecycle State**: continuous_development
- **Execution Mode**: Infinite loop (circular workflow)

## Purpose

This workflow manages ALL post-deployment development activities including feature additions, bug fixes, enhancements, refactoring, and maintenance. It serves as the central hub for continuous application evolution.

## Workflow Entry Points

**Entry Condition**: Project has completed initial development (v1.0 deployed)

**How to Enter**:
1. Automatic: After 08-quality-assurance.md completes v1.0 deployment
2. User Request: User provides update/feature request after v1.0 exists
3. Session Resume: .memory/project-state.json shows "lifecycle_state": "continuous_development"

## Workflow Steps

### Phase 1: Production Monitoring & Feedback Collection

**Objective**: Gather information on what needs to be done next

**Actions**:

1. **Read Production Context**:
   - .memory/production-metrics.md (app performance, errors, usage)
   - .memory/user-feedback.md (user requests, bug reports)
   - .memory/ci-cd-metrics.md (build/deployment health)
   - .memory/incident-log.md (production incidents)
   - .memory/technical-debt.md (accumulated tech debt)
   - .memory/release-plan.md (planned features)
   - .memory/version-history.md (current version, history)

2. **User Input Analysis**:
   If user provided request:
   - Parse request type (feature, bug, enhancement, refactor, etc.)
   - Extract requirements
   - Assess urgency and priority

   If no user request:
   - Analyze production metrics for issues
   - Check planned features from release plan
   - Review technical debt backlog
   - Identify optimization opportunities

3. **Priority Assessment**:
   Categorize work by urgency:
   - **Critical (Hotfix)**: Production down, security vulnerability, data loss
   - **High (Bug Fix)**: Functionality broken, user-impacting bugs
   - **Medium (Feature/Enhancement)**: New features, improvements
   - **Low (Refactoring/Optimization)**: Code quality, performance tuning

### Phase 2: Work Item Triage & Planning

**Objective**: Determine what to build and how

**Actions**:

1. **Version Planning**:
   Read .memory/version-history.md for current version (e.g., v1.2.3)

   Determine version bump type:
   - **MAJOR (v2.0.0)**: Breaking changes, architecture redesign
     - Action: Transition to major_version_development state
     - Route to: 03-architecture-design.md (architecture redesign)

   - **MINOR (v1.3.0)**: New features, backward-compatible additions
     - Action: Increment minor version
     - Route to: Sub-workflow (feature-development.md)

   - **PATCH (v1.2.4)**: Bug fixes, hotfixes, security patches
     - Action: Increment patch version
     - Route to: Sub-workflow (bug-fix.md or hotfix.md)

2. **Impact Assessment**:
   - Which components will be affected?
   - Does this require database migrations?
   - Will this impact existing users?
   - Are there breaking changes?
   - Testing scope required?

3. **Resource Planning**:
   - Which skills needed? (frontend, backend, fullstack, qa, devops)
   - Estimated complexity (simple, medium, complex)
   - Estimated timeline
   - Dependencies on other work items

4. **Update Project State**:
   Update .memory/project-state.json:
   ```json
   {
     "lifecycle_state": "continuous_development",
     "currentPhase": "[work_type]",
     "active_workflow": "workflows/continuous/[sub-workflow].md",
     "version": {
       "current": "1.2.3",
       "next_planned": "1.3.0"
     },
     "current_work": {
       "type": "feature_development",
       "description": "Add notification system",
       "priority": "medium",
       "target_version": "1.3.0"
     }
   }
   ```

### Phase 3: Development Type Routing

**Objective**: Route to appropriate sub-workflow

**Routing Logic**:

**Critical Priority** → workflows/continuous/hotfix.md
- Production down
- Security vulnerability
- Data loss/corruption
- System unavailable

**Bug Fixes** → workflows/continuous/bug-fix.md
- Reported bugs
- Functionality not working as expected
- User-facing errors
- Non-critical issues

**New Features** → workflows/continuous/feature-development.md
- New functionality
- User-requested features
- Planned roadmap features
- Feature enhancements

**Improvements** → workflows/continuous/enhancement.md
- UX improvements
- UI refinements
- Workflow optimizations
- User experience enhancements

**Code Quality** → workflows/continuous/refactoring.md
- Technical debt reduction
- Code organization improvements
- Architecture refinements (non-breaking)
- Dead code removal

**Performance Issues** → workflows/continuous/performance-optimization.md
- Slow response times
- High resource usage
- Core Web Vitals degradation
- Database query optimization

**Security Updates** → workflows/continuous/security-patch.md
- Dependency vulnerabilities
- Security advisories
- Penetration test findings
- Security best practice updates

**Technology Updates** → workflows/continuous/version-upgrade.md
- Framework version upgrades
- Dependency updates (major versions)
- Language version upgrades
- Migration to new technologies

**Multiple Work Items**:
If multiple items exist:
1. Critical items first (hotfix)
2. Batch similar items (e.g., multiple bug fixes)
3. Prioritize by user impact
4. Update release plan with sequence

### Phase 4: Sub-Workflow Execution

**Objective**: Execute selected sub-workflow

**Process**:
1. pm-orchestrator mentions appropriate sub-workflow
2. Sub-workflow handles:
   - Detailed analysis
   - Implementation strategy
   - Skill coordination
   - Code changes
   - Memory updates
3. Sub-workflow completes and returns control

**Success Criteria**:
- Implementation complete
- Code changes committed
- Memory files updated
- Ready for integration testing

### Phase 5: Integration & Quality Pipeline

**Objective**: Ensure changes are production-ready

**Mandatory Sequence** (CANNOT BE SKIPPED):

1. **Integration Testing** → 06-integration.md
   - Frontend-backend integration validation
   - API contract verification
   - End-to-end flow testing
   - Regression testing

2. **Deployment** → 07-deployment.md
   - Staging deployment
   - Environment configuration
   - Database migrations (if any)
   - Deployment verification

3. **Quality Assurance** → 08-quality-assurance.md
   - E2E testing with Playwright MCP
   - Performance testing
   - Accessibility compliance
   - Security scanning
   - Cross-browser testing

**Quality Gates**:
All quality-controller standards must be met:
- TypeScript coverage: 95%+
- Core Web Vitals: Green
- Lighthouse scores: Performance 90+, Accessibility 95+
- Security: 0 critical/high vulnerabilities
- Test coverage: Backend 80%+, Frontend 70%+

**Gate Failure Handling**:
If quality gates fail:
- Do NOT proceed to production
- Route back to sub-workflow for fixes
- Re-run 06→07→08 pipeline
- Repeat until all gates pass

### Phase 6: Release Management & Production Deployment

**Objective**: Safely release to production

**Process**:

1. **Execute Release Management** → release-management.md
   - Version bump (update package.json, etc.)
   - Changelog generation
   - Release notes creation
   - Git tag creation
   - Production deployment
   - Health check validation

2. **Post-Release Monitoring**:
   - Monitor error rates
   - Track performance metrics
   - Collect user feedback
   - Watch CI/CD metrics

3. **Memory System Updates**:
   Update all relevant memory files:
   - .memory/version-history.md (record new version)
   - .memory/release-plan.md (mark completed, update next)
   - .memory/production-metrics.md (baseline new metrics)
   - .memory/active-context.md (current status)
   - .memory/project-state.json (update version, return to monitoring state)

**Production Verification**:
- Application healthy
- No critical errors
- Performance acceptable
- User flows working
- Rollback plan ready

### Phase 7: Loop Back to Monitoring

**Objective**: Return to continuous development cycle

**Actions**:

1. **Update Project State**:
   ```json
   {
     "lifecycle_state": "continuous_development",
     "currentPhase": "monitoring",
     "active_workflow": "09-continuous-development.md",
     "version": {
       "current": "1.3.0",
       "previous": "1.2.3"
     },
     "last_release": "2025-01-15T14:30:00Z",
     "next_planned": "1.4.0"
   }
   ```

2. **Await Next Input**:
   - User provides new request → Return to Phase 1
   - Production issues detected → Return to Phase 1
   - Scheduled features exist → Return to Phase 1
   - No pending work → Wait for user input

3. **Continuous Loop**:
   ```
   Production → Phase 1 (Monitoring) → Phase 2 (Triage) →
   Phase 3 (Routing) → Phase 4 (Sub-workflow) → Phase 5 (Pipeline) →
   Phase 6 (Release) → Phase 7 (Loop back) → Production
   ```

## Work Type Routing Examples

**Example 1: User requests "Add email notifications"**
- Phase 1: Parse user request
- Phase 2: Determine minor version (v1.3.0), new feature
- Phase 3: Route to workflows/continuous/feature-development.md
- Phase 4: Feature developed
- Phase 5: 06→07→08 pipeline
- Phase 6: Release v1.3.0 to production
- Phase 7: Return to monitoring

**Example 2: Production error detected**
- Phase 1: Read .memory/incident-log.md, identify critical bug
- Phase 2: Determine patch version (v1.2.4), hotfix priority
- Phase 3: Route to workflows/continuous/hotfix.md
- Phase 4: Fix implemented
- Phase 5: 06→07→08 pipeline (expedited)
- Phase 6: Release v1.2.4 to production immediately
- Phase 7: Return to monitoring

**Example 3: User requests "Redesign entire UI"**
- Phase 1: Parse user request, identify breaking changes
- Phase 2: Determine MAJOR version (v2.0.0)
- Phase 3: Transition to major_version_development state
- Special routing: Re-execute 03-architecture-design.md
- After architecture: Return to continuous development with v2.0.0
- Continue through normal pipeline

## Special Cases

### Major Version Development (v2.0)

When major architectural changes needed:

1. **Update Lifecycle State**:
   ```json
   {
     "lifecycle_state": "major_version_development",
     "currentPhase": "architecture_redesign",
     "active_workflow": "03-architecture-design.md"
   }
   ```

2. **Re-execute Foundational Workflows**:
   - 03-architecture-design.md (MANDATORY for major versions)
   - Optionally 01-requirements-analysis.md (if scope changed significantly)
   - Optionally 02-research-analysis.md (if new technologies)

3. **After Architecture Complete**:
   - Return to continuous_development state
   - Proceed through normal pipeline (06→07→08)
   - Release as v2.0.0

### Multiple Concurrent Work Items

When multiple features/fixes needed simultaneously:

1. **Prioritize by Impact**:
   - Critical (hotfix) → Immediate
   - High (bugs) → Next
   - Medium (features) → Batched
   - Low (refactoring) → Scheduled

2. **Batch Compatible Items**:
   - Group multiple bug fixes → Single v1.2.4 release
   - Group related features → Single v1.3.0 release
   - Separate incompatible changes → Multiple releases

3. **Update Release Plan**:
   Document in .memory/release-plan.md:
   ```markdown
   ## v1.3.0 (Target: 2025-01-22)
   - Feature: Email notifications
   - Feature: Push notifications
   - Enhancement: Improved error messages
   - Bug Fix: Login timeout issue
   ```

### Emergency Situations

When production is critically broken:

1. **Hotfix Priority Override**:
   - Skip Phase 2 triage (immediate action)
   - Route directly to workflows/continuous/hotfix.md
   - Expedited pipeline (06→07→08 with minimal delays)
   - Emergency deployment procedures

2. **Rollback if Needed**:
   - If fix fails, rollback to previous version
   - Document in .memory/incident-log.md
   - Plan proper fix for next release

## Memory System Integration

**Continuous Development Memory Files**:

1. **.memory/version-history.md**: Version changelog and timeline
2. **.memory/release-plan.md**: Upcoming releases and features
3. **.memory/production-metrics.md**: Live application metrics
4. **.memory/user-feedback.md**: User requests and bug reports
5. **.memory/technical-debt.md**: Accumulated technical debt
6. **.memory/ci-cd-metrics.md**: Build and deployment health
7. **.memory/incident-log.md**: Production incidents and resolutions

**Update Frequency**:
- After every release: version-history.md, release-plan.md
- Daily/Weekly: production-metrics.md, ci-cd-metrics.md
- As reported: user-feedback.md, incident-log.md
- Quarterly: technical-debt.md

## Success Metrics

Track in .memory/project-state.json:

```json
{
  "continuous_development_metrics": {
    "total_releases": 12,
    "releases_per_month": 3,
    "average_cycle_time_days": 5,
    "hotfixes_deployed": 2,
    "features_delivered": 8,
    "bugs_fixed": 15,
    "quality_gate_pass_rate": 0.95,
    "rollback_rate": 0.02,
    "user_satisfaction": 4.5
  }
}
```

## Completion Criteria

**There is NO completion for this workflow** - it runs continuously until the project is retired.

**Healthy Continuous Development Indicators**:
- ✅ Regular releases (2-4 per month for active projects)
- ✅ High quality gate pass rate (>90%)
- ✅ Low rollback rate (<5%)
- ✅ Fast cycle time (idea to production <2 weeks)
- ✅ Low critical incidents (<2 per month)
- ✅ Growing feature set
- ✅ Decreasing technical debt over time

## Next Workflows

**Always Returns To**: 09-continuous-development.md Phase 1 (this workflow, circular loop)

**Routes To** (based on work type):
- workflows/continuous/feature-development.md
- workflows/continuous/bug-fix.md
- workflows/continuous/hotfix.md
- workflows/continuous/enhancement.md
- workflows/continuous/refactoring.md
- workflows/continuous/performance-optimization.md
- workflows/continuous/security-patch.md
- workflows/continuous/version-upgrade.md

**Special Transitions**:
- 03-architecture-design.md (if major version)
- Project retirement (end of lifecycle)

## Output Example

**Continuous Development Cycle Output**:
```
Continuous Development - Monitoring Phase
==========================================

Production Status:
✅ v1.2.3 healthy (deployed: 2025-01-14)
✅ Error rate: 0.02% (normal)
✅ Performance: All Core Web Vitals green
✅ Uptime: 99.95%

User Feedback Collected:
→ 5 feature requests (email notifications most requested)
→ 2 bug reports (login timeout on slow networks)
→ 3 enhancement suggestions

Planned Work:
→ v1.3.0: Email notification system (target: 2025-01-22)
→ v1.2.4: Fix login timeout bug (target: 2025-01-16)

Next Action: Prioritizing work items...

Triage Result:
Priority 1: Bug fix (login timeout) → v1.2.4 patch release
Priority 2: Feature (notifications) → v1.3.0 minor release

Starting: workflows/continuous/bug-fix.md
Target Version: v1.2.4
Expected Release: 2025-01-16
```

## Common Issues and Resolutions

**Issue**: Too many concurrent work items, unclear priority
**Resolution**: Use priority matrix (urgency × impact), batch similar items, communicate with user if needed

**Issue**: Quality gates failing repeatedly
**Resolution**: Route back to sub-workflow, fix issues, do NOT bypass quality gates

**Issue**: Deployment frequency too high (release fatigue)
**Resolution**: Batch changes, establish release cadence (e.g., bi-weekly releases)

**Issue**: Deployment frequency too low (stagnation)
**Resolution**: Review release plan, prioritize features, reduce cycle time

**Issue**: High rollback rate
**Resolution**: Improve QA process, add more E2E tests, enhance staging validation
