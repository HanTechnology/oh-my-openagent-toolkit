# Release Management Workflow

## Overview

- **Primary Skill**: pm-orchestrator
- **Supporting Skills**: devops-deployment, quality-controller, memory-manager
- **Dependencies**: 08-quality-assurance.md (must be complete and passing)
- **Purpose**: Coordinate production release and version management
- **Execution Mode**: Every release (both initial and continuous development)

## Purpose

Manage the final steps of releasing software to production, including version bumping, changelog generation, deployment coordination, and post-release verification. This workflow bridges QA completion and production deployment.

## Workflow Entry

**Entry Condition**: Quality assurance complete (08-quality-assurance.md)

**Quality Gate Verification**:
Before proceeding, verify ALL quality gates passed:
- ✅ E2E tests: 90%+ coverage
- ✅ Performance: Core Web Vitals green, Lighthouse 90+
- ✅ Accessibility: WCAG 2.1 AA compliant
- ✅ Security: 0 critical/high vulnerabilities
- ✅ Cross-browser: Tested and compatible
- ✅ No release-blocking bugs

**If any gate failed**: DO NOT PROCEED. Return to appropriate workflow for fixes.

## Workflow Steps

### Phase 1: Release Preparation

**Objective**: Prepare all release artifacts

**Actions**:

1. **Version Determination**:
   Read .memory/project-state.json for target version:
   ```json
   {
     "version": {
       "current": "1.2.3",
       "next_planned": "1.3.0"
     }
   }
   ```

   Verify version bump appropriate:
   - MAJOR (v2.0.0): Breaking changes, architecture redesign
   - MINOR (v1.3.0): New features, backward-compatible
   - PATCH (v1.2.4): Bug fixes only

2. **Version Bump**:
   Update version in all relevant files:
   - package.json (frontend and backend)
   - Mobile: app.json (Expo), package.json
   - Any version constants in code
   - API version headers (if applicable)

   ```bash
   # Update package.json version
   npm version [major|minor|patch] --no-git-tag-version
   ```

3. **Changelog Generation**:
   Generate changelog from .memory/version-history.md:

   Create/update CHANGELOG.md:
   ```markdown
   # Changelog

   All notable changes to this project will be documented in this file.

   ## [1.3.0] - 2025-01-22

   ### Added
   - Email notification system with user preferences
   - Export reports to PDF functionality
   - Dark mode theme support

   ### Changed
   - Improved dashboard performance (30% faster)
   - Updated notification UI for better UX

   ### Fixed
   - Login timeout on slow networks
   - Incorrect revenue calculation in dashboard

   ### Security
   - Updated dependencies with security patches

   ## [1.2.3] - 2025-01-14

   ### Fixed
   - Critical bug in user authentication flow
   ```

4. **Release Notes Creation**:
   Create user-friendly release notes:

   workspace/releases/v1.3.0-release-notes.md:
   ```markdown
   # Version 1.3.0 Release Notes

   Release Date: January 22, 2025

   ## What's New

   ### Email Notifications
   Stay updated with email notifications for important events.
   Configure your preferences in Settings > Notifications.

   ### PDF Export
   Export your reports as PDF for easy sharing and archival.
   Look for the "Export PDF" button on any report page.

   ### Dark Mode
   Reduce eye strain with our new dark mode theme.
   Toggle in Settings > Appearance.

   ## Improvements

   - Dashboard loads 30% faster
   - Better notification design
   - Improved error messages

   ## Bug Fixes

   - Fixed login issues on slow connections
   - Corrected dashboard revenue calculations

   ## Upgrade Notes

   No special actions required. All changes are backward-compatible.
   ```

5. **Git Tag Creation**:
   Create git tag for release:
   ```bash
   git tag -a v1.3.0 -m "Release v1.3.0 - Email notifications, PDF export, Dark mode"
   git push origin v1.3.0
   ```

### Phase 2: Pre-Deployment Verification

**Objective**: Final checks before production

**Actions**:

1. **Staging Environment Verification**:
   - Application deployed on staging (from 07-deployment.md)
   - All tests passed on staging
   - Performance acceptable on staging
   - No errors in staging logs

2. **Database Migration Review** (if applicable):
   - Migrations tested on staging
   - Rollback procedures prepared
   - Backup procedures verified
   - No data loss scenarios

3. **Deployment Plan Review**:
   - Deployment method confirmed (blue-green, canary, rolling)
   - Deployment window scheduled (if needed)
   - Rollback plan ready
   - Monitoring plan ready

4. **Communication Plan**:
   - User communication prepared (if user-facing changes)
   - Support team notified (if needed)
   - Stakeholders informed
   - Status page updated (if exists)

### Phase 3: Production Deployment

**Objective**: Deploy to production safely

**Actions**:

1. **Pre-Deployment Checklist**:
   - [ ] All quality gates passed
   - [ ] Staging verified
   - [ ] Version bumped
   - [ ] Changelog updated
   - [ ] Git tag created
   - [ ] Rollback plan ready
   - [ ] Monitoring configured

2. **Database Migration** (if needed):
   Execute via **devops-deployment** skill:
   ```bash
   # Production database migration
   - Backup database
   - Run migrations
   - Verify migration success
   - Test application connectivity
   ```

3. **Application Deployment**:
   Mention **devops-deployment** skill for deployment:

   **Deployment Methods**:

   **Blue-Green Deployment** (preferred for major releases):
   ```
   1. Deploy new version to "green" environment
   2. Run smoke tests on green
   3. Switch traffic from blue to green
   4. Monitor for issues
   5. Keep blue ready for rollback
   ```

   **Canary Deployment** (preferred for gradual rollout):
   ```
   1. Deploy to 5% of servers
   2. Monitor metrics for 15-30 minutes
   3. If healthy: Deploy to 25%
   4. If healthy: Deploy to 50%
   5. If healthy: Deploy to 100%
   6. Rollback at any sign of issues
   ```

   **Rolling Deployment** (standard for updates):
   ```
   1. Deploy to server 1, verify healthy
   2. Deploy to server 2, verify healthy
   3. Continue until all servers updated
   4. Load balancer ensures no downtime
   ```

4. **Deployment Execution**:
   devops-deployment executes deployment:
   - Pull latest code from git tag
   - Build production artifacts
   - Deploy to production infrastructure
   - Run post-deployment health checks
   - Verify application responsive

### Phase 4: Post-Deployment Verification

**Objective**: Verify production deployment successful

**Actions**:

1. **Health Check Verification**:
   - Application accessible
   - API endpoints responding
   - Database connections healthy
   - External integrations working

2. **Smoke Testing**:
   Quick verification of critical flows:
   - User can log in
   - Core features functional
   - No JavaScript errors
   - API responses normal

3. **Performance Monitoring** (first 30 minutes):
   - Response times acceptable
   - Error rates normal (<1%)
   - Resource usage (CPU, memory) normal
   - Database performance normal

4. **User Impact Assessment**:
   - User reports monitored
   - Support tickets monitored
   - Error tracking (Sentry, etc.)
   - Analytics normal

5. **Rollback Decision Point** (30 minutes post-deployment):
   **CRITICAL DECISION**: Is deployment successful?

   **Success Indicators**:
   - ✅ No increase in error rate
   - ✅ Performance acceptable
   - ✅ No critical user reports
   - ✅ Core functionality working

   **Rollback Indicators**:
   - ❌ Error rate spike (>2%)
   - ❌ Performance degradation (>20%)
   - ❌ Critical functionality broken
   - ❌ Data integrity issues

   **If rollback needed**:
   ```bash
   # Execute immediate rollback
   - Switch traffic back to previous version
   - Rollback database migrations (if any)
   - Verify previous version healthy
   - Log incident
   - Plan fix for next release
   ```

### Phase 5: Release Finalization

**Objective**: Complete release process

**Actions**:

1. **Memory System Updates**:

   Update .memory/version-history.md:
   ```markdown
   ## v1.3.0 (Released: 2025-01-22)
   ### Added
   - Email notification system
   - PDF export functionality
   - Dark mode theme

   ### Performance
   - Dashboard 30% faster

   ### Fixed
   - Login timeout issues
   - Revenue calculation bug

   Deployment: Successful
   Release Time: 2025-01-22 14:30 UTC
   Rollbacks: 0
   ```

   Update .memory/project-state.json:
   ```json
   {
     "version": {
       "current": "1.3.0",
       "previous": "1.2.3",
       "next_planned": "1.4.0"
     },
     "lifecycle_state": "continuous_development",
     "currentPhase": "monitoring",
     "last_release": {
       "version": "1.3.0",
       "date": "2025-01-22T14:30:00Z",
       "status": "successful",
       "deployment_duration_minutes": 25,
       "rollback_needed": false
     }
   }
   ```

   Update .memory/active-context.md:
   ```markdown
   ## Current Status
   Phase: Production Monitoring
   Version: v1.3.0 (deployed successfully)
   Last Release: 2025-01-22

   ## Recent Changes
   - v1.3.0: Email notifications, PDF export, Dark mode

   ## Next Planned
   - v1.4.0: Social features, planned for 2025-02-05
   ```

   Update .memory/release-plan.md:
   ```markdown
   ## Completed Releases
   - v1.3.0: Email notifications ✅ Released 2025-01-22

   ## Next Release: v1.4.0 (Target: 2025-02-05)
   Features:
   - Social sharing
   - User mentions
   - Activity feed

   Status: Planning (0% complete)
   ```

2. **User Communication**:
   - Post release notes to users (email, in-app, blog)
   - Update documentation site
   - Announce on social media (if applicable)
   - Update status page: "All systems operational"

3. **Team Communication**:
   - Notify development team of successful release
   - Thank contributors
   - Share release metrics
   - Celebrate success

4. **Monitoring Setup**:
   Enhanced monitoring for first 48 hours:
   - Error tracking active
   - Performance monitoring active
   - User feedback collection active
   - Support ticket monitoring

### Phase 6: Post-Release Monitoring

**Objective**: Ensure release stability

**Actions**:

1. **First 24 Hours Monitoring**:
   - Check every 4-6 hours
   - Error rate tracking
   - Performance metrics
   - User feedback collection
   - Support ticket monitoring

2. **First Week Monitoring**:
   - Daily health checks
   - Weekly metrics review
   - User adoption tracking
   - Performance trend analysis

3. **Release Metrics Collection**:
   Track in .memory/production-metrics.md:
   ```markdown
   ## Release v1.3.0 Metrics

   ### Deployment Metrics
   - Deployment Duration: 25 minutes
   - Downtime: 0 seconds (blue-green deployment)
   - Rollbacks: 0

   ### Performance Metrics (First Week)
   - Error Rate: 0.3% (normal)
   - Response Time: 150ms avg (10% improvement)
   - Core Web Vitals: All green
   - Uptime: 99.98%

   ### Feature Adoption (First Week)
   - Dark Mode: 35% users enabled
   - PDF Export: 120 reports exported
   - Email Notifications: 60% users configured

   ### Issues
   - 2 minor bugs reported (non-critical)
   - 0 critical issues
   - 1 performance optimization identified

   ### User Feedback
   - Positive: 85%
   - Neutral: 10%
   - Negative: 5%
   ```

4. **Post-Release Retrospective** (within 1 week):
   Document in .memory/decisions.md:
   ```markdown
   ## Release v1.3.0 Retrospective

   ### What Went Well
   - Smooth deployment (zero downtime)
   - All quality gates passed
   - No rollback needed
   - Positive user feedback

   ### What Could Improve
   - Staging testing could be more comprehensive
   - Release notes could be clearer
   - Communication to support team earlier

   ### Action Items
   - [ ] Add more E2E tests for edge cases
   - [ ] Create release notes template
   - [ ] Improve support team notification process
   ```

### Phase 7: Return to Continuous Development

**Objective**: Resume development cycle

**Actions**:

1. **Update Project State**:
   ```json
   {
     "lifecycle_state": "continuous_development",
     "currentPhase": "monitoring",
     "active_workflow": "09-continuous-development.md"
   }
   ```

2. **Route Back to Continuous Development**:
   - Return to 09-continuous-development.md Phase 1 (Monitoring)
   - Await next user request or planned feature
   - Continue circular development loop

## Completion Criteria

- ✅ Version bumped correctly
- ✅ Changelog updated
- ✅ Release notes created
- ✅ Git tag created
- ✅ Deployed to production successfully
- ✅ Post-deployment verification passed
- ✅ No rollback needed
- ✅ Memory system updated
- ✅ Users notified
- ✅ Monitoring configured

## Next Workflows

**Always Returns To**: 09-continuous-development.md (continuous loop)

**Emergency Path**: If rollback needed → hotfix.md (plan proper fix)

## Release Types

### Regular Release (MINOR version)
- New features added
- Backward-compatible changes
- Follow complete workflow (all 7 phases)
- Full communication plan

### Patch Release (PATCH version)
- Bug fixes only
- Small changes
- Expedited deployment (can skip some communication)
- Focus on verification

### Emergency Release (HOTFIX)
- Critical production fix
- Expedited all phases
- Maximum monitoring
- Immediate communication

### Major Release (MAJOR version)
- Breaking changes
- Architecture updates
- Extended testing
- Migration guides
- Enhanced communication

## Success Metrics

Track in .memory/production-metrics.md:
- Deployment success rate: Target >95%
- Deployment duration: Target <30 minutes
- Rollback rate: Target <5%
- Zero-downtime deployments: Target 100%
- Post-release issues: Target <3 minor bugs
- Mean time to deployment (from QA pass): Target <2 hours
