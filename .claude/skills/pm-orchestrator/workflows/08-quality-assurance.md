# Quality Assurance Workflow

## Overview

- **Primary Skill**: qa-testing
- **Supporting Skills**: pm-orchestrator, quality-controller, frontend-nextjs, backend-nestjs
- **Dependencies**: integration (must be complete), deployment (recommended)
- **Parallel Execution**: Can start during deployment, comprehensive testing after deployment

## Workflow Steps

### Phase 1: QA Planning and Test Strategy

**Objective**: Define comprehensive testing approach

**Actions**:
1. **Read Project Context**:
   - .memory/integration-status.md (integration completion)
   - .memory/user-flows.md (user flows to test)
   - .memory/deployment-config.md (deployment environments)
   - .memory/quality-metrics.md (quality standards)
   - .memory/active-context.md (current status)

2. **Review Quality Standards**:
   - Load project-type-specific standards from quality-standards.json
   - Web Application standards:
     - TypeScript Coverage: 95% target
     - Core Web Vitals: LCP<2.5s, FID<100ms, CLS<0.1
     - Lighthouse: 90+ performance, 95+ accessibility
     - Security: 0 high/critical vulnerabilities

3. **Define Test Scope**:
   - E2E testing coverage
   - Performance testing targets
   - Accessibility compliance (WCAG 2.1 AA)
   - Security testing scope
   - Cross-browser compatibility
   - Mobile responsiveness

### Phase 2: End-to-End Testing with Playwright MCP

**Objective**: Comprehensive E2E testing using Playwright MCP ONLY

**CRITICAL**: Use Playwright MCP ONLY - no external testing packages allowed

**Actions**:
1. **Setup Test Environment**:
   - Configure test against deployed staging/production
   - Setup test user accounts
   - Prepare test data

2. **Authentication Flow Testing**:
   ```
   Using Playwright MCP:
   1. mcp__playwright__browser_navigate to login page
   2. mcp__playwright__browser_snapshot to verify page loaded
   3. mcp__playwright__browser_fill_form for email and password
   4. mcp__playwright__browser_click on submit button
   5. mcp__playwright__browser_snapshot to verify dashboard loaded
   6. Validate authentication token stored
   7. Verify protected routes accessible
   ```

3. **User Registration Flow**:
   ```
   Using Playwright MCP:
   1. Navigate to registration page
   2. Fill registration form
   3. Submit and verify email validation (if applicable)
   4. Verify automatic login after registration
   5. Check welcome message or dashboard access
   ```

4. **Critical User Flows Testing**:
   For each major feature (from .memory/user-flows.md):
   - Navigate through complete flow
   - Test CRUD operations
   - Verify data persistence
   - Check error handling
   - Validate success messages
   - Screenshot critical states

5. **Form Validation Testing**:
   - Test client-side validation
   - Test server-side validation
   - Verify error message display
   - Test field-level validation
   - Test form submission with invalid data

6. **Navigation Testing**:
   - Test all navigation links
   - Verify route protection
   - Test breadcrumbs
   - Validate back button behavior
   - Test deep linking

7. **Data Operations Testing**:
   - Create entity → Verify in list
   - Update entity → Verify changes reflected
   - Delete entity → Verify removal
   - Test pagination
   - Test filtering and sorting
   - Test search functionality

8. **Error Scenarios Testing**:
   - Network offline scenario
   - Server error (500) response
   - Not found (404) pages
   - Unauthorized (401) access
   - Validation errors
   - Timeout scenarios

### Phase 3: Performance Testing

**Objective**: Validate application performance meets targets

**Actions**:
1. **Core Web Vitals Measurement**:
   Using Playwright MCP:
   - Measure Largest Contentful Paint (LCP) - Target: <2.5s
   - Measure First Input Delay (FID) - Target: <100ms
   - Measure Cumulative Layout Shift (CLS) - Target: <0.1
   - Test on multiple pages (home, dashboard, feature pages)

2. **Lighthouse Performance Testing**:
   - Run Lighthouse audit on key pages
   - Performance score target: 90+
   - Accessibility score target: 95+
   - Best Practices score target: 95+
   - SEO score target: 90+

3. **API Performance Testing**:
   - Measure API response times
   - Target: <200ms for 95th percentile
   - Test under various network conditions
   - Measure Time to First Byte (TTFB)

4. **Load Time Testing**:
   - Initial page load time
   - Subsequent page navigation time
   - Time to interactive
   - Asset loading time (images, fonts, scripts)

5. **Bundle Size Analysis**:
   - Frontend JavaScript bundle size
   - Check for code splitting effectiveness
   - Verify lazy loading implementation
   - Identify large dependencies

### Phase 4: Accessibility Testing

**Objective**: Ensure WCAG 2.1 AA compliance

**CRITICAL**: Accessibility is MANDATORY, not optional

**Actions**:
1. **Automated Accessibility Testing**:
   Using Playwright MCP:
   - Use mcp__playwright__browser_snapshot to capture accessibility tree
   - Test all pages for ARIA compliance
   - Verify semantic HTML structure
   - Check color contrast ratios
   - Validate form labels and descriptions

2. **Keyboard Navigation Testing**:
   Using Playwright MCP:
   - Test tab navigation order
   - Verify all interactive elements accessible
   - Test keyboard shortcuts
   - Verify focus indicators visible
   - Test escape key functionality (modals)

3. **Screen Reader Compatibility**:
   - Test with accessibility tree analysis
   - Verify ARIA labels present
   - Check heading hierarchy
   - Validate alt text on images
   - Test form field descriptions

4. **Focus Management**:
   - Modal focus trapping
   - Focus restoration after modal close
   - Skip navigation links
   - Focus visible on all interactive elements

5. **WCAG 2.1 AA Specific Tests**:
   - Color contrast (4.5:1 normal text, 3:1 large text)
   - Text resize up to 200%
   - No content loss at 400% zoom
   - Touch target size (44x44px minimum)
   - Consistent navigation
   - Error identification and suggestions

### Phase 5: Security Testing

**Objective**: Validate security implementation

**Actions**:
1. **Authentication Security**:
   - Test password strength requirements
   - Verify password hashing (not plain text)
   - Test JWT token expiration
   - Verify token refresh mechanism
   - Test logout functionality
   - Check for session fixation vulnerabilities

2. **Authorization Testing**:
   - Test role-based access control
   - Verify unauthorized access blocked
   - Test horizontal privilege escalation
   - Test vertical privilege escalation
   - Verify API endpoint protection

3. **Input Validation Testing**:
   - SQL injection attempts (if applicable)
   - XSS attack vectors
   - Command injection
   - Path traversal
   - File upload validation
   - Input sanitization

4. **Security Headers Validation**:
   - Content-Security-Policy present
   - X-Frame-Options configured
   - X-Content-Type-Options: nosniff
   - Strict-Transport-Security (HSTS)
   - Referrer-Policy configured

5. **HTTPS and SSL/TLS**:
   - Valid SSL certificate
   - HTTPS redirect working
   - No mixed content warnings
   - TLS version 1.2+ only

6. **Vulnerability Scanning**:
   - Run dependency vulnerability scan
   - Check for known CVEs
   - Target: 0 high/critical vulnerabilities
   - Document and plan fixes for medium/low

### Phase 6: Cross-Browser and Device Testing

**Objective**: Ensure compatibility across browsers and devices

**Actions**:
1. **Desktop Browser Testing**:
   Using Playwright MCP with different browser contexts:
   - Chrome/Chromium (latest)
   - Firefox (latest)
   - Safari (latest) - if accessible
   - Edge (latest)
   - Test critical user flows on each browser

2. **Responsive Design Testing**:
   Using Playwright MCP browser_resize:
   - Desktop (1920x1080, 1366x768)
   - Tablet (1024x768, 768x1024)
   - Mobile (375x667, 414x896)
   - Verify layout adapts properly
   - Check touch target sizes on mobile

3. **Mobile Browser Testing**:
   - iOS Safari
   - Android Chrome
   - Test touch interactions
   - Verify mobile-specific features

4. **Compatibility Issues**:
   - Document browser-specific issues
   - Test fallbacks for unsupported features
   - Verify polyfills working

### Phase 7: Usability and User Experience Testing

**Objective**: Validate user experience quality

**Actions**:
1. **User Flow Completeness**:
   - Can users complete primary tasks?
   - Are workflows intuitive?
   - Clear call-to-actions?
   - Helpful error messages?
   - Success feedback clear?

2. **Loading States**:
   - Skeleton loaders present
   - Loading spinners appropriate
   - Progress indicators for long operations
   - No "flash of unstyled content"

3. **Error States**:
   - User-friendly error messages
   - Clear recovery instructions
   - Error boundaries preventing app crashes
   - Validation errors helpful

4. **Empty States**:
   - Helpful empty state messages
   - Clear next actions
   - Appropriate illustrations/icons (Lucide only)

### Phase 8: Data Integrity and Business Logic Testing

**Objective**: Validate data accuracy and business rules

**Actions**:
1. **Data Persistence Testing**:
   - Create data → Verify in database
   - Update data → Verify changes persisted
   - Delete data → Verify removal
   - Test data relationships
   - Verify cascade operations

2. **Business Logic Validation**:
   - Test calculation accuracy
   - Verify workflow state transitions
   - Test business rule enforcement
   - Validate data constraints

3. **Concurrent User Testing**:
   - Test optimistic locking
   - Test conflict resolution
   - Verify data consistency
   - Test race conditions

### Phase 9: Quality Metrics Validation

**Objective**: Validate against quality-controller standards

**Collaboration Pattern**:
Mention **quality-controller** skill for:

1. **Code Quality Validation**:
   - TypeScript coverage check (95% target)
   - Linting compliance
   - Code complexity analysis
   - Dead code detection

2. **Test Coverage Validation**:
   - Backend test coverage (80%+ target)
   - Frontend test coverage (70%+ target)
   - Critical path coverage (100%)

3. **Performance Metrics Validation**:
   - API response times (<200ms 95th percentile)
   - Core Web Vitals compliance
   - Lighthouse scores (90+ performance, 95+ accessibility)

4. **Security Metrics Validation**:
   - Vulnerability scan results
   - Security header configuration
   - Dependency audit results

### Phase 10: Regression Testing

**Objective**: Ensure no existing functionality broken

**Actions**:
1. **Full Regression Suite**:
   - Run all E2E tests
   - Verify all user flows still working
   - Check previously fixed bugs not reappearing
   - Test critical integrations

2. **Smoke Testing** (after each deployment):
   - Core functionality working
   - Critical user flows operational
   - No major errors in logs

### Phase 11: Test Documentation and Reporting

**Objective**: Document all testing results

**Deliverables**:

1. **.memory/test-coverage.md**:
   ```markdown
   # Test Coverage Report

   ## E2E Testing (Playwright MCP)
   - Total Tests: 45
   - Passed: 43
   - Failed: 2
   - Coverage: 95% of user flows

   ### Test Results by Feature
   - Authentication: ✅ 5/5 passed
   - User Management: ✅ 8/8 passed
   - [Feature 1]: ⚠️ 9/10 passed (1 flaky test)
   - [Feature 2]: ✅ 12/12 passed

   ### Failed Tests
   1. Test: "Complex form submission with file upload"
      - Status: Failed (timeout)
      - Reason: File upload timeout in slow network
      - Fix: Increase timeout, optimize upload

   ## Unit/Integration Testing
   - Backend Coverage: 87% (target: 80%)
   - Frontend Coverage: 74% (target: 70%)
   ```

2. **.memory/performance-validation.md**:
   ```markdown
   # Performance Validation Report

   ## Core Web Vitals
   - LCP: 1.8s ✅ (target: <2.5s)
   - FID: 45ms ✅ (target: <100ms)
   - CLS: 0.05 ✅ (target: <0.1)

   ## Lighthouse Scores
   - Performance: 94 ✅ (target: 90+)
   - Accessibility: 98 ✅ (target: 95+)
   - Best Practices: 96 ✅ (target: 95+)
   - SEO: 92 ✅ (target: 90+)

   ## API Performance
   - Average Response: 145ms ✅
   - 95th Percentile: 190ms ✅ (target: <200ms)
   - 99th Percentile: 250ms ⚠️

   ## Bundle Sizes
   - Initial JS: 145KB (gzipped) ✅
   - Total JS: 380KB (gzipped) ✅
   - CSS: 12KB (gzipped) ✅
   ```

3. **.memory/security-testing.md**:
   ```markdown
   # Security Testing Report

   ## Vulnerability Scan
   - Critical: 0 ✅
   - High: 0 ✅
   - Medium: 2 ⚠️
   - Low: 5

   ### Medium Severity Issues
   1. Dependency: old-package@1.0.0
      - CVE: CVE-2024-XXXXX
      - Fix: Upgrade to 2.0.0
      - Status: Scheduled

   ## Security Headers
   - Content-Security-Policy: ✅ Configured
   - X-Frame-Options: ✅ DENY
   - X-Content-Type-Options: ✅ nosniff
   - Strict-Transport-Security: ✅ Configured

   ## Authentication Testing
   - Password Hashing: ✅ bcrypt
   - JWT Implementation: ✅ Secure
   - Token Expiration: ✅ Working
   - Refresh Mechanism: ✅ Functional

   ## Input Validation
   - XSS Prevention: ✅ Tested
   - SQL Injection: ✅ Protected (using ORM)
   - CSRF Protection: ✅ Implemented
   ```

### Phase 12: Bug Tracking and Issue Resolution

**Objective**: Document and track all discovered issues

**Actions**:
1. **Issue Documentation**:
   - Create detailed bug reports
   - Include reproduction steps
   - Attach screenshots/videos
   - Assign priority and severity

2. **Issue Triage**:
   - Critical: Block release, must fix
   - High: Should fix before release
   - Medium: Fix in next sprint
   - Low: Backlog for future

3. **Fix Verification**:
   - Retest after fixes
   - Verify no regression
   - Update test cases if needed

### Phase 13: User Acceptance Testing (UAT) Preparation

**Objective**: Prepare for final user validation

**Actions**:
1. **UAT Environment Setup**:
   - Clean test data
   - Create test user accounts
   - Prepare user documentation
   - Setup feedback collection

2. **UAT Test Cases**:
   - Document user scenarios
   - Create step-by-step guides
   - Define acceptance criteria

3. **Feedback Collection**:
   - Setup feedback mechanism
   - Plan user interviews
   - Prepare satisfaction surveys

### Phase 14: Memory System Updates

**Objective**: Update memory with QA completion

**Memory Updates**:

1. **Update .memory/active-context.md**:
   ```markdown
   ## Current Phase
   Phase: quality_assurance_completed
   Progress: 100%

   ## Quality Assurance Summary
   - E2E Tests: 95% coverage, 43/45 passing
   - Performance: All Core Web Vitals green
   - Accessibility: WCAG 2.1 AA compliant
   - Security: 0 critical/high vulnerabilities
   - Cross-Browser: Tested on 4 browsers

   ## Status
   ✅ Ready for production launch

   ## Outstanding Items
   - 2 flaky E2E tests (low priority)
   - 2 medium severity vulnerabilities (scheduled fixes)
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "currentPhase": "quality_assurance_completed",
     "progress": {
       "overall": 100,
       "phases": {
         "quality_assurance": 100
       }
     },
     "quality": {
       "e2e_tests": {
         "total": 45,
         "passed": 43,
         "failed": 2,
         "coverage": 95
       },
       "performance": {
         "lcp": 1.8,
         "fid": 45,
         "cls": 0.05,
         "lighthouse": 94
       },
       "accessibility": "WCAG_AA_compliant",
       "security": {
         "critical": 0,
         "high": 0,
         "medium": 2,
         "low": 5
       }
     }
   }
   ```

3. **Update .memory/quality-metrics.md**:
   ```markdown
   # Quality Metrics - Final Report

   ## Testing Metrics
   - E2E Test Coverage: 95%
   - Unit Test Coverage: 87% (backend), 74% (frontend)
   - Integration Test Coverage: 82%

   ## Performance Metrics
   - Core Web Vitals: All green
   - Lighthouse Performance: 94
   - API Response Time: 145ms avg

   ## Accessibility Compliance
   - WCAG 2.1 AA: ✅ Compliant
   - Keyboard Navigation: ✅ Full support
   - Screen Reader: ✅ Compatible

   ## Security Posture
   - Critical Vulnerabilities: 0
   - High Vulnerabilities: 0
   - Security Headers: All configured

   ## Code Quality
   - TypeScript Coverage: 96%
   - Linting: 0 errors
   - Code Complexity: Low

   ## Cross-Browser Compatibility
   - Chrome: ✅ Fully compatible
   - Firefox: ✅ Fully compatible
   - Safari: ✅ Fully compatible
   - Edge: ✅ Fully compatible
   ```

## Completion Criteria

**All criteria must be met for production release**:

- ✅ **E2E Testing Complete**: 90%+ user flow coverage, critical paths 100%
- ✅ **Performance Validated**: Core Web Vitals green, Lighthouse 90+
- ✅ **Accessibility Compliant**: WCAG 2.1 AA compliance achieved
- ✅ **Security Validated**: 0 critical/high vulnerabilities
- ✅ **Cross-Browser Tested**: Compatible with major browsers
- ✅ **Mobile Responsive**: Tested on multiple device sizes
- ✅ **Test Documentation Complete**: All test results documented
- ✅ **No Critical Bugs**: No release-blocking issues
- ✅ **Quality Metrics Met**: All project-type-specific standards achieved
- ✅ **Memory System Updated**: All QA context recorded

## Verification Steps

1. **Quality Gate Check**:
   - quality-controller validates all metrics
   - All standards from quality-standards.json met
   - No exceptions required

2. **Final Review**:
   - pm-orchestrator reviews completion
   - All deliverables present
   - Documentation complete

3. **Launch Readiness**:
   - All systems operational
   - Monitoring configured
   - Support prepared

## Next Steps & Circular Routing

### Lifecycle State-Based Routing

pm-orchestrator reads `.memory/project-state.json` → `lifecycle_state` field to determine next steps:

---

### Route 1: Initial Development State

**Condition**: `lifecycle_state = "initial_development"` (v1.0.0 release)

**After QA Passes** → **Production Launch (v1.0.0)**:

1. **Final Preparation**:
   - Stakeholder final review
   - Production deployment checklist complete
   - User communication prepared
   - Support team briefed

2. **Production Deployment**:
   - Deploy to production environment
   - Verify deployment successful
   - Enable monitoring and alerting
   - Activate user analytics

3. **v1.0.0 Release**:
   - Update `.memory/project-state.json`:
     - `current_version: "1.0.0"`
     - `lifecycle_state: "continuous_development"` ← **STATE TRANSITION**
   - Update `.memory/version-history.md` with v1.0.0 release
   - Celebrate launch!

4. **Post-Launch Activities**:
   - User onboarding and communication
   - Monitor production metrics closely (first 48 hours)
   - Collect user feedback
   - Address any immediate issues

5. **Transition to Continuous Development**:
   - Initialize continuous development memory files:
     - `.memory/production-metrics.md`
     - `.memory/user-feedback.md`
     - `.memory/technical-debt.md`
     - `.memory/ci-cd-metrics.md`
     - `.memory/incident-log.md`
     - `.memory/release-plan.md`
   - System now in **continuous_development state**
   - Ready for ongoing improvements

**Next Workflow**: Production → 09-continuous-development.md (infinite loop begins)

---

### Route 2: Continuous Development State

**Condition**: `lifecycle_state = "continuous_development"` (v1.x.x releases)

**After QA Passes** → **release-management.md** → **Production** → **09-continuous-development.md**:

1. **Hand Off to Release Management**:
   - pm-orchestrator routes to: `workflows/release-management.md`
   - Purpose: Staged production rollout with monitoring

2. **Release Management Workflow** (Automated):
   - **Pre-Release Preparation**:
     - Generate release notes from `.memory/version-history.md`
     - Notify stakeholders
     - Confirm rollback plan

   - **Staged Rollout**:
     - Canary deployment (10% traffic) → Monitor 2-4 hours
     - Gradual rollout (50% traffic) → Monitor 4-8 hours
     - Full deployment (100% traffic) → Monitor 24 hours

   - **Post-Release Monitoring**:
     - Track production metrics (`.memory/production-metrics.md`)
     - Monitor error rates, performance
     - Collect user feedback (`.memory/user-feedback.md`)

   - **Release Validation**:
     - Verify success criteria met
     - Document lessons learned
     - Update `.memory/version-history.md`

3. **Return to Continuous Development**:
   - After release validated and stable (24-48 hours)
   - pm-orchestrator routes to: `09-continuous-development.md`
   - **INFINITE LOOP**: Production → Work Intake → Sub-workflow → 06→07→08→ release → Production

**Circular Pattern**:
```
Production (v1.x.x stable)
    ↓
User feedback, monitoring, feature requests
    ↓
09-continuous-development.md (work intake + routing)
    ↓
Sub-workflow (feature/bug/enhancement/refactoring/performance/security/upgrade)
    ↓
06-integration.md (integration testing)
    ↓
07-deployment.md (staging deployment)
    ↓
08-quality-assurance.md (comprehensive QA) ← YOU ARE HERE
    ↓
release-management.md (staged production rollout)
    ↓
Production (v1.x+1.x deployed)
    ↓
[LOOP CONTINUES INFINITELY]
```

---

### Route 3: Major Version Development State

**Condition**: `lifecycle_state = "major_version_development"` (v2.0.0, v3.0.0, etc.)

**After QA Passes** → **release-management.md** → **Production vX.0.0** → **Transition to continuous_development**:

1. **Major Release Management**:
   - More cautious rollout strategy
   - Extended monitoring periods
   - Migration guide published
   - Backward compatibility warnings

2. **Production Deployment (vX.0.0)**:
   - Canary: 5% traffic → 24 hours monitoring
   - Gradual: 25% → 48 hours monitoring
   - Full: 100% → 7 days close monitoring
   - User migration support active

3. **State Transition After Major Release**:
   - Update `.memory/project-state.json`:
     - `current_version: "2.0.0"` (or v3.0.0, etc.)
     - `lifecycle_state: "continuous_development"` ← **STATE TRANSITION**
   - Update `.memory/version-history.md` with vX.0.0 release
   - Document breaking changes and migration

4. **Return to Continuous Development**:
   - After major version stable
   - pm-orchestrator routes to: `09-continuous-development.md`
   - Now developing v2.x.x releases (MINOR and PATCH)
   - Infinite loop continues for v2.x.x lifecycle

---

### Quality Gate Enforcement

**Before Routing to Release**:

quality-controller performs **final validation**:

```yaml
final_quality_gate:
  e2e_testing:
    status: PASS
    coverage: ">90%"
    critical_paths: "100%"

  performance:
    core_web_vitals: GREEN
    lighthouse_scores: ">90"
    api_response_time: "<200ms p95"

  accessibility:
    wcag_compliance: "AA"
    keyboard_navigation: PASS
    screen_reader: COMPATIBLE

  security:
    critical_vulnerabilities: 0
    high_vulnerabilities: 0
    security_headers: CONFIGURED

  cross_browser:
    chrome: COMPATIBLE
    firefox: COMPATIBLE
    safari: COMPATIBLE
    edge: COMPATIBLE

  code_quality:
    typescript_coverage: ">95%"
    test_coverage_backend: ">80%"
    test_coverage_frontend: ">70%"
    linting_errors: 0
```

**If ANY criterion fails**: QA workflow does NOT complete. Return to implementation or issue remediation.

**If ALL criteria pass**: Proceed to release management or production launch based on lifecycle state.

---

### Memory System Updates Before Routing

pm-orchestrator ensures `.memory/` files are up-to-date:

**Required Updates**:
1. **`.memory/project-state.json`**:
   - Update `current_phase: "release"`
   - Update `active_workflow: "release-management.md"` (or direct launch for v1.0.0)
   - Update `current_version` (pending release)

2. **`.memory/version-history.md`**:
   - Add new version entry with release notes
   - Document all changes (Added/Changed/Fixed/Security/Performance)

3. **`.memory/active-context.md`**:
   - Clear current work
   - Update status: "Ready for release"

4. **Quality Metrics**:
   - Update `.memory/test-coverage.md` (QA skill)
   - Update `.memory/quality-metrics.md` (QA skill)
   - Record final QA results

---

### Decision Matrix

| Lifecycle State | After QA Passes | Next Workflow | Version Example | Loop Behavior |
|----------------|-----------------|---------------|-----------------|---------------|
| initial_development | Production launch v1.0.0 | Transition to continuous_development → 09-continuous-development.md | v0.9.5 → v1.0.0 | Loop starts after v1.0.0 |
| continuous_development | release-management.md | 09-continuous-development.md | v1.2.4 → v1.2.5 (PATCH) or v1.2.0 → v1.3.0 (MINOR) | Infinite loop |
| major_version_development | release-management.md | Transition to continuous_development → 09-continuous-development.md | v1.8.3 → v2.0.0 | New loop for v2.x.x |

---

### Automatic Routing

**pm-orchestrator automatically determines routing**:

```javascript
// Pseudocode for pm-orchestrator routing logic
const projectState = readJSON('.memory/project-state.json')
const lifecycleState = projectState.lifecycle_state
const currentVersion = projectState.current_version

if (lifecycleState === 'initial_development') {
  // First-time production launch
  deployToProduction()
  updateVersion('1.0.0')
  transitionState('continuous_development')
  initializeContinuousDevelopmentMemory()
  routeTo('09-continuous-development.md')
}
else if (lifecycleState === 'continuous_development') {
  // Ongoing MINOR/PATCH releases
  routeTo('release-management.md')
  // After release-management.md completes, it routes back to 09-continuous-development.md
}
else if (lifecycleState === 'major_version_development') {
  // Major version release
  routeTo('release-management.md')
  // After major release stable, transition to continuous_development
  transitionState('continuous_development')
  routeTo('09-continuous-development.md')
}
```

---

### Post-QA Communication

**For Continuous Development** (infinite loop):

"Quality Assurance PASSED ✅

**Ready for Release**: v{current_version} → v{next_version}

**Next Step**: Routing to release-management.md for staged production rollout.

After deployment, the system will return to 09-continuous-development.md for the next work item.

**Continuous Development Cycle**: This release is part of the ongoing development loop. After production deployment and monitoring, we'll continue with the next feature, bug fix, or improvement."

---

**For Initial Development** (v1.0.0 launch):

"Quality Assurance PASSED ✅

**Ready for Production Launch**: v1.0.0 🎉

**Next Step**: Final preparation and production deployment.

After successful launch, the system will transition to **continuous_development state** and begin the infinite improvement loop via 09-continuous-development.md."

---

**For Major Version** (v2.0.0, v3.0.0):

"Quality Assurance PASSED ✅

**Ready for Major Release**: v{old_major}.x.x → v{new_major}.0.0

**Next Step**: Routing to release-management.md with extended monitoring periods.

After major version is stable, the system will transition back to **continuous_development state** for v{new_major}.x.x development cycle."

## Common Issues and Resolutions

**Issue**: Flaky E2E tests
**Resolution**: Add explicit waits, use waitForSelector, increase timeouts strategically

**Issue**: Performance degradation
**Resolution**: Optimize images, enable caching, implement code splitting, use CDN

**Issue**: Accessibility violations
**Resolution**: Add ARIA labels, fix color contrast, improve semantic HTML, test with keyboard

**Issue**: Security vulnerabilities
**Resolution**: Update dependencies, apply security patches, review code for vulnerabilities

**Issue**: Cross-browser compatibility issues
**Resolution**: Add polyfills, test on actual devices/browsers, use feature detection

## Output Example

**Success Output**:
```
Quality Assurance Completed
============================

E2E Testing (Playwright MCP):
✅ Total Tests: 45
✅ Passed: 43 (95.6%)
✅ Failed: 2 (flaky, non-critical)
✅ User Flow Coverage: 95%
✅ Critical Path Coverage: 100%

Performance Testing:
✅ Core Web Vitals: LCP 1.8s, FID 45ms, CLS 0.05 (all green)
✅ Lighthouse: Performance 94, Accessibility 98, Best Practices 96, SEO 92
✅ API Performance: 145ms avg, 190ms 95th percentile
✅ Bundle Size: 145KB initial JS (gzipped)

Accessibility Testing:
✅ WCAG 2.1 AA: Fully compliant
✅ Keyboard Navigation: All elements accessible
✅ Screen Reader: Compatible
✅ Color Contrast: All text meets 4.5:1 ratio
✅ Focus Management: Proper focus indicators

Security Testing:
✅ Vulnerabilities: 0 critical, 0 high, 2 medium (scheduled), 5 low
✅ Security Headers: All configured
✅ Authentication: Secure (bcrypt + JWT)
✅ Input Validation: XSS and SQL injection protected
✅ HTTPS: Valid SSL, HSTS enabled

Cross-Browser Testing:
✅ Chrome 120: Fully compatible
✅ Firefox 121: Fully compatible
✅ Safari 17: Fully compatible
✅ Edge 120: Fully compatible

Mobile Testing:
✅ Responsive Design: All breakpoints tested
✅ Touch Targets: All meet 44x44px minimum
✅ Mobile Performance: Core Web Vitals green

Code Quality:
✅ TypeScript Coverage: 96% (target: 95%)
✅ Test Coverage: Backend 87%, Frontend 74%
✅ Linting: 0 errors, 3 minor warnings
✅ Code Complexity: Low

Outstanding Items:
⚠️ 2 flaky E2E tests (non-blocking, documented)
⚠️ 2 medium severity vulnerabilities (patches scheduled)

Status: ✅ READY FOR PRODUCTION LAUNCH

Next Steps:
→ Final stakeholder review
→ Production launch preparation
→ User onboarding and communication
```
