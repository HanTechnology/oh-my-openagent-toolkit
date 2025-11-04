# Version Upgrade Sub-Workflow

## Overview

- **Primary Skill**: pm-orchestrator (coordination), domain skills (implementation)
- **Parent Workflow**: 09-continuous-development.md
- **Work Type**: Framework, language, or dependency major version upgrades
- **Version Impact**: PATCH (minor deps), MINOR (framework), MAJOR (breaking changes)
- **Priority**: Low-Medium (unless security-related)
- **Return To**: 06-integration.md

## Purpose

Upgrade frameworks, languages, or dependencies to newer major versions. This workflow handles Next.js upgrades, React upgrades, Node.js upgrades, database upgrades, and other technology stack updates that may introduce breaking changes.

## Entry Conditions

- Routed from 09-continuous-development.md Phase 3
- Work type: Version upgrade
- Priority: Low-Medium (High if security-related)
- Version: Depends on breaking changes (PATCH/MINOR/MAJOR)
- Trigger: New version available, security advisory, end-of-life warning

## Workflow Steps

### Phase 1: Upgrade Assessment

**Objective**: Evaluate the upgrade and its impact

**Actions**:

1. **Read Upgrade Context**:
   - Release notes of new version
   - Migration guide (if available)
   - Breaking changes documentation
   - Community feedback (GitHub issues, discussions)
   - .memory/technical-debt.md (planned upgrades)

2. **Upgrade Classification**:

   **By Component Type**:
   - **Frontend Framework**: Next.js, React, Vue
   - **Backend Framework**: NestJS, Express, FastAPI
   - **Language/Runtime**: Node.js, Python, TypeScript
   - **Database**: PostgreSQL, MongoDB, Redis
   - **Dependencies**: Major version of npm packages

   **By Impact**:
   - **Minor Dependency Upgrade**: Single package, no breaking changes
   - **Framework Upgrade**: May have breaking changes, migration needed
   - **Language Upgrade**: Ecosystem-wide impact, extensive testing needed
   - **Database Upgrade**: Data migration, backup/restore planning

3. **Motivation Assessment**:
   Why upgrade?
   - Security (CVEs fixed in new version)
   - Performance improvements
   - New features needed
   - Bug fixes
   - End-of-life approaching (forced upgrade)
   - Ecosystem compatibility (other deps require it)

4. **Version Impact Decision**:

   **PATCH version** (v1.2.3 → v1.2.4):
   - Minor dependency upgrades
   - No breaking changes
   - No user-facing changes
   - Example: lodash 4.17.20 → 4.17.21

   **MINOR version** (v1.2.0 → v1.3.0):
   - Framework minor version upgrades
   - Some API deprecations but not breaking
   - New features available
   - Example: Next.js 14.0 → 14.1

   **MAJOR version** (v1.0.0 → v2.0.0):
   - Framework major version upgrades with breaking changes
   - API breaking changes required
   - Significant refactoring needed
   - Example: Next.js 13 → 14 (App Router), React 17 → 18

### Phase 2: Upgrade Research & Planning

**Objective**: Understand breaking changes and plan migration

**Actions**:

1. **Breaking Changes Analysis**:
   Read official migration guides:
   - What APIs removed/changed?
   - What configuration changes required?
   - What code patterns need updating?
   - What new best practices recommended?

2. **Dependency Compatibility Check**:
   ```bash
   # Check for compatibility issues
   npm outdated

   # Check peer dependency conflicts
   npm ls

   # Test upgrade in isolated environment
   npm install package@next --dry-run
   ```

3. **Impact Scope Estimation**:
   - How many files need changes?
   - What components/modules affected?
   - Database schema changes needed?
   - Configuration file updates needed?
   - Build tool changes needed?

4. **Risk Assessment**:
   **Low Risk**:
   - Minor version upgrades
   - Good test coverage (>80%)
   - Small codebase
   - Active community support
   - Rollback easy

   **Medium Risk**:
   - Major version upgrades
   - Medium test coverage (60-80%)
   - Medium codebase
   - Breaking changes documented
   - Migration guide available

   **High Risk**:
   - Major breaking changes
   - Low test coverage (<60%)
   - Large codebase
   - Limited migration documentation
   - Database schema changes
   - Multiple interdependent upgrades

5. **Upgrade Strategy**:

   **Incremental Approach** (preferred for major upgrades):
   - Upgrade one component at a time
   - Test thoroughly after each upgrade
   - Commit after each successful upgrade
   - Rollback if issues

   **All-at-Once Approach** (for minor upgrades):
   - Upgrade all dependencies together
   - Test comprehensively
   - Single deployment

### Phase 3: Upgrade Preparation

**Objective**: Prepare for safe upgrade

**Actions**:

1. **Backup Creation**:
   - Backup database (if database upgrade)
   - Tag current stable version in git
   - Document current working state
   - Create rollback plan

2. **Test Coverage Enhancement**:
   If test coverage inadequate:
   - Add tests for critical functionality
   - Add integration tests
   - Document test scenarios
   - Target: >70% coverage before major upgrade

3. **Development Environment Setup**:
   ```bash
   # Create upgrade branch
   git checkout -b upgrade/[framework-version]

   # Create backup branch
   git checkout -b backup/pre-upgrade-[date]
   git checkout upgrade/[framework-version]
   ```

4. **Skill Coordination**:
   Mention required skills based on upgrade type:
   - Frontend framework → **frontend-nextjs** or **mobile-react-native**
   - Backend framework → **backend-nestjs** or **backend-fastapi**
   - Database → **backend-nestjs** or **backend-fastapi** + **devops-deployment**
   - Full-stack impact → **fullstack-integration**

### Phase 4: Upgrade Implementation

**Objective**: Perform the upgrade

**Actions**:

1. **Dependency Upgrade**:
   ```bash
   # Upgrade specific package
   npm install package-name@latest

   # For framework upgrades, follow official migration
   # Example: Next.js upgrade
   npm install next@latest react@latest react-dom@latest

   # Install peer dependencies
   npm install

   # Check for conflicts
   npm ls
   ```

2. **Code Migration**:
   Follow migration guide to update code:

   **Example: React 17 → 18 Migration**:
   ```typescript
   // Before (React 17):
   import ReactDOM from 'react-dom'
   ReactDOM.render(<App />, document.getElementById('root'))

   // After (React 18):
   import { createRoot } from 'react-dom/client'
   const root = createRoot(document.getElementById('root')!)
   root.render(<App />)
   ```

   **Example: Next.js 13 → 14 (Pages → App Router)**:
   ```typescript
   // Before (Pages Router):
   // pages/dashboard.tsx
   export default function Dashboard() {
     return <div>Dashboard</div>
   }

   // After (App Router):
   // app/dashboard/page.tsx
   export default function DashboardPage() {
     return <div>Dashboard</div>
   }
   ```

3. **Configuration Updates**:
   Update configuration files:
   - package.json (scripts, engines)
   - tsconfig.json (TypeScript config)
   - next.config.js / vite.config.ts (build config)
   - .eslintrc (linting rules)
   - Jest config (testing)

4. **Deprecation Fixes**:
   Fix all deprecation warnings:
   - Replace deprecated APIs
   - Update to new patterns
   - Remove obsolete code

5. **Incremental Testing**:
   After each change:
   ```bash
   # Run tests
   npm test

   # Run type checking
   npm run type-check

   # Build application
   npm run build

   # Test manually
   npm run dev
   ```

### Phase 5: Comprehensive Testing

**Objective**: Verify upgrade successful and stable

**Actions**:

1. **Automated Testing**:
   ```bash
   # Unit tests
   npm test

   # Integration tests
   npm run test:integration

   # E2E tests
   npm run test:e2e

   # Type checking
   npm run type-check

   # Linting
   npm run lint

   # Build verification
   npm run build
   ```

2. **Manual Testing**:
   - Test all critical user flows
   - Test all major features
   - Check for visual regressions
   - Test on multiple browsers/devices
   - Verify performance (no degradation)

3. **Performance Testing**:
   - Compare bundle sizes (before/after)
   - Measure page load times
   - Check API response times
   - Monitor memory usage
   - Ensure no performance regressions

4. **Compatibility Testing**:
   - Test on target browsers
   - Test on target devices
   - Verify backward compatibility
   - Check third-party integrations

### Phase 6: Database Migration (if applicable)

**Objective**: Safely migrate database to new version

**Actions**:

1. **Database Backup**:
   ```bash
   # PostgreSQL backup
   pg_dump dbname > backup.sql

   # MongoDB backup
   mongodump --db dbname --out backup/
   ```

2. **Test Migration**:
   - Test on staging database first
   - Verify data integrity
   - Measure migration time
   - Test rollback procedure

3. **Production Migration** (coordinate with devops-deployment):
   - Schedule maintenance window (if needed)
   - Run database upgrade
   - Verify application connectivity
   - Monitor for issues

### Phase 7: Documentation

**Objective**: Document the upgrade

**Actions**:

1. **Upgrade Documentation**:
   Create workspace/docs/upgrades/[framework]-[version].md:
   ```markdown
   # Next.js 13 → 14 Upgrade

   ## Upgrade Date
   2025-01-22

   ## Motivation
   - Performance improvements (Turbopack)
   - Better TypeScript support
   - Server Actions stable

   ## Breaking Changes Addressed
   1. Migrated Pages Router to App Router
   2. Updated image optimization API
   3. Updated font optimization

   ## Files Changed
   - 45 files modified
   - 12 files moved (pages/ → app/)
   - 3 configuration files updated

   ## Testing Results
   - All 150 unit tests passing
   - All 45 integration tests passing
   - Manual testing complete
   - Performance improved by 15%

   ## Issues Encountered
   - Image loader needed update (fixed)
   - Font optimization syntax changed (fixed)

   ## Rollback Plan
   - Git tag: pre-nextjs14-upgrade
   - Estimated rollback time: 10 minutes
   ```

2. **Changelog Entry**:
   Add to .memory/version-history.md:
   ```markdown
   ## v1.3.0 (Planned - 2025-01-25) OR v2.0.0 (if breaking)
   ### Upgraded
   - Upgraded Next.js from 13.5 to 14.1
   - Upgraded React from 18.2 to 18.3
   - Migrated from Pages Router to App Router
   - Performance improved by 15%

   ### Breaking Changes (if MAJOR version)
   - API routes moved from pages/api to app/api
   - Some deprecated features removed
   - See migration guide for details
   ```

### Phase 8: Memory System Updates

**Objective**: Update memory with upgrade context

**Memory Updates**:

1. **Update .memory/active-context.md**:
   ```markdown
   ## Current Work
   - Upgrade: Next.js 13 → 14
   - Status: Complete and tested
   - Target Version: v1.3.0 (or v2.0.0 if breaking)
   - Impact: 45 files changed, performance +15%
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "current_work": {
       "type": "version_upgrade",
       "upgrade": "nextjs-13-to-14",
       "status": "complete",
       "target_version": "1.3.0",
       "metrics": {
         "files_changed": 45,
         "performance_improvement": "15%",
         "test_pass_rate": "100%"
       }
     },
     "technology_stack": {
       "frontend": {
         "framework": "Next.js 14.1",
         "react": "18.3",
         "typescript": "5.3"
       }
     }
   }
   ```

3. **Update .memory/technical-debt.md**:
   Mark planned upgrade as complete

### Phase 9: Return to Integration Pipeline

**Objective**: Hand off to quality assurance

**Actions**:

1. **Commit Changes**:
   ```bash
   git add .
   git commit -m "upgrade: Next.js 13 → 14, React 18.2 → 18.3

   - Migrated from Pages Router to App Router
   - Updated image optimization API
   - Updated font optimization
   - Updated configuration files

   Performance improvements:
   - 15% faster page loads
   - Improved TypeScript support
   - Better error messages

   Breaking changes:
   - API routes location changed
   - See docs/upgrades/nextjs-13-14.md for details

   Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   git push origin upgrade/[framework-version]
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
   - Integration (extensive testing) → Deployment (staged rollout) → QA (comprehensive) → Release
   - Monitor closely post-deployment

## Completion Criteria

- ✅ Upgrade completed successfully
- ✅ All breaking changes addressed
- ✅ All tests passing
- ✅ No regressions (functionality or performance)
- ✅ Documentation complete
- ✅ Rollback plan ready
- ✅ Database migrated (if applicable)
- ✅ Code committed to upgrade branch
- ✅ Memory system updated
- ✅ Ready for integration testing

## Return To

**Next Workflow**: 06-integration.md (comprehensive testing)

**After Full Pipeline**:
06-integration.md → 07-deployment.md (staged rollout) → 08-quality-assurance.md (extensive testing) → release-management.md → Production → 09-continuous-development.md

## Version Upgrade Examples

### Example 1: Next.js 14 → 15 (Minor)

**Motivation**: Performance improvements, new features

**Execution**:
1. Phase 1: Assessment - Minor upgrade, some deprecations
2. Phase 2: Research - Read migration guide
3. Phase 3: Preparation - Enhance test coverage
4. Phase 4: Implement - npm install next@15, fix deprecations
5. Phase 5: Testing - All tests pass, performance improved
6. Phase 6: N/A (no database changes)
7. Phase 7: Documentation
8. Phase 8: Memory updates (v1.4.0 → v1.5.0)
9. Phase 9: Return to integration

**Version**: v1.4.0 → v1.5.0 (MINOR)

### Example 2: Node.js 18 → 20 (Major - but PATCH for app)

**Motivation**: Performance, security, new features

**Execution**:
1. Phase 1: Assessment - Language upgrade, extensive testing needed
2. Phase 2: Research - Read Node 20 changelog
3. Phase 3: Preparation - Update CI/CD, Docker images
4. Phase 4: Implement - Update Dockerfile, package.json engines
5. Phase 5: Testing - Extensive testing, no issues found
6. Phase 6: N/A
7. Phase 7: Documentation
8. Phase 8: Memory updates (v1.5.3 → v1.5.4)
9. Phase 9: Return to integration

**Version**: v1.5.3 → v1.5.4 (PATCH - infrastructure upgrade)

### Example 3: React 17 → 18 (Major for app)

**Motivation**: Concurrent features, performance

**Execution**:
1. Phase 1: Assessment - Major upgrade with breaking changes
2. Phase 2: Research - Migration guide, breaking changes
3. Phase 3: Preparation - Backup, enhance tests
4. Phase 4: Implement - Update ReactDOM.render, fix Suspense usage
5. Phase 5: Testing - Fix type errors, test extensively
6. Phase 6: N/A
7. Phase 7: Documentation - Breaking changes documented
8. Phase 8: Memory updates (v1.9.5 → v2.0.0)
9. Phase 9: Return to integration

**Version**: v1.9.5 → v2.0.0 (MAJOR - breaking changes)

## Common Issues and Resolutions

**Issue**: Breaking changes not fully documented
**Resolution**: Community research, trial-and-error testing, incremental approach

**Issue**: Dependency conflicts after upgrade
**Resolution**: Update conflicting dependencies, find compatible versions, or delay upgrade

**Issue**: Performance regression after upgrade
**Resolution**: Profile and optimize, or rollback and investigate

**Issue**: Tests fail after upgrade
**Resolution**: Fix code to match new API, update test utilities

**Issue**: Multiple interdependent upgrades needed
**Resolution**: Plan sequence carefully, upgrade incrementally

## Success Metrics

- Upgrade completed without data loss
- All tests passing
- No functionality regressions
- Performance maintained or improved
- Zero downtime deployment
- Rollback plan available and tested
