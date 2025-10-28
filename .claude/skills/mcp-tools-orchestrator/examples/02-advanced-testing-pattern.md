# Advanced Testing Orchestration with Playwright MCP

## Overview

This example demonstrates advanced testing workflows using **Playwright MCP** orchestrated with **GitHub MCP**, **WebSearch**, and **IDE MCP** for comprehensive quality assurance. The MCP Tools Orchestrator coordinates multi-layered testing: E2E, visual regression, accessibility, performance, and cross-browser validation.

**Testing Workflow**: Setup → Execute → Validate → Report → Fix → Verify

**MCP Tools Orchestrated**:
- **Playwright MCP**: Browser automation, E2E testing, visual testing
- **GitHub MCP**: Test result tracking, issue creation, PR checks
- **IDE MCP**: Diagnostics, code analysis, auto-fix suggestions
- **WebSearch**: Best practices, known issues, testing strategies

## Advanced Testing Orchestration Flow

```
Test Request
     ↓
┌────────────────────────────────────────────────────────────┐
│  PHASE 1: Test Environment Setup                          │
├────────────────────────────────────────────────────────────┤
│  [Playwright MCP] Initialize browser                       │
│  [IDE MCP] Check for diagnostics/errors                   │
│  [GitHub MCP] Get latest test files                       │
└────────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────────┐
│  PHASE 2: Multi-Layer Test Execution (Parallel)          │
├────────────────────────────────────────────────────────────┤
│  [Playwright] E2E Tests     [Playwright] A11y Tests       │
│  [Playwright] Visual Tests  [Playwright] Performance      │
└────────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────────┐
│  PHASE 3: Failure Analysis (Conditional)                  │
├────────────────────────────────────────────────────────────┤
│  IF failures detected:                                     │
│      [Playwright] Screenshot + console logs               │
│      [IDE MCP] Analyze related code                       │
│      [WebSearch] Research similar failures                │
└────────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────────┐
│  PHASE 4: Automated Reporting                             │
├────────────────────────────────────────────────────────────┤
│  [GitHub MCP] Create issues for failures                  │
│  [GitHub MCP] Comment on PR with results                  │
│  Generate HTML report with screenshots                     │
└────────────────────────────────────────────────────────────┘
```

## Orchestrated Testing Implementation

```typescript
// scripts/orchestrated-testing.ts
/**
 * Advanced multi-tool testing orchestration
 */

interface TestOrchestration {
  setup: () => Promise<TestEnvironment>;
  executeTests: () => Promise<TestResults>;
  analyzeFailures: (results: TestResults) => Promise<FailureAnalysis>;
  generateReport: (analysis: FailureAnalysis) => Promise<TestReport>;
  createGitHubIssues: (failures: TestFailure[]) => Promise<void>;
}

/**
 * PHASE 1: Intelligent Test Environment Setup
 *
 * Orchestrate Playwright + IDE + GitHub for environment validation
 */

async function setupTestEnvironment() {
  return {
    prompt_for_claude: `
      Orchestrate test environment setup:

      STEP 1: Code Health Check (Parallel)
      ====================================
      Execute in parallel:

      1. [IDE MCP] Check for compilation errors:
         mcp__ide__getDiagnostics()
         If errors found, STOP and report issues

      2. [GitHub MCP] Get latest test files:
         mcp__github__search_code({
           q: "repo:owner/repo filename:test extension:ts path:tests/"
         })
         Identify test files to run

      3. [Playwright MCP] Verify browser installation:
         mcp__playwright__browser_install()
         Ensure browsers are available

      STEP 2: Environment Validation
      ==============================
      1. Start application (via Bash)
      2. [Playwright MCP] Health check:
         mcp__playwright__browser_navigate({ url: "http://localhost:3000/health" })
         mcp__playwright__browser_snapshot()
         Verify application is responsive

      STEP 3: Baseline Capture (for visual regression)
      ===============================================
      If baseline screenshots don't exist:
      [Playwright MCP] Capture baselines:
      - Homepage
      - Dashboard
      - Key user flows

      Output: TestEnvironment object with readiness status
    `
  };
}

/**
 * PHASE 2: Multi-Layer Test Execution
 *
 * Orchestrate comprehensive testing across multiple dimensions
 */

async function executeTestSuite() {
  return {
    prompt_for_claude: `
      Execute multi-layer test suite:

      LAYER 1: E2E Functional Tests
      =============================
      [Playwright MCP] Execute core user journeys:

      Test 1: Login Flow
      ------------------
      1. mcp__playwright__browser_navigate({ url: "/auth/login" })
      2. mcp__playwright__browser_fill_form({
           fields: [
             { name: "email", value: "test@example.com", ref: "input[name=email]" },
             { name: "password", value: "password123", ref: "input[type=password]" }
           ]
         })
      3. mcp__playwright__browser_click({ element: "submit button", ref: "button[type=submit]" })
      4. mcp__playwright__browser_wait_for({ text: "Dashboard" })

      Assertions:
      - URL should contain "/dashboard"
      - User menu should be visible
      - No console errors

      Test 2: CRUD Operations
      -----------------------
      [Execute create, read, update, delete flows]

      Test 3: Error Handling
      ----------------------
      [Test validation, network errors, edge cases]

      LAYER 2: Accessibility Tests
      ============================
      [Playwright MCP] For each key page:

      1. mcp__playwright__browser_navigate({ url: page_url })
      2. mcp__playwright__browser_snapshot()
         Analyze for ARIA violations

      Check:
      - Keyboard navigation
      - Screen reader compatibility
      - Color contrast
      - Semantic HTML

      LAYER 3: Visual Regression Tests
      =================================
      [Playwright MCP] Compare with baselines:

      For each page:
      1. mcp__playwright__browser_take_screenshot({
           fullPage: true,
           filename: "current/page-name.png"
         })
      2. Compare with baseline/page-name.png
      3. Generate diff if > 0.1% different

      LAYER 4: Performance Tests
      ===========================
      [Playwright MCP] Measure key metrics:

      1. mcp__playwright__browser_navigate({ url: "/" })
      2. Measure:
         - First Contentful Paint
         - Largest Contentful Paint
         - Total Blocking Time
         - Cumulative Layout Shift

      3. mcp__playwright__browser_network_requests()
         Analyze: Request count, total size, caching

      LAYER 5: Cross-Browser Tests
      =============================
      [Playwright MCP] Repeat critical tests across browsers:
      - Chromium (default)
      - Firefox (via browser config)
      - WebKit (Safari)

      Output: Comprehensive TestResults with all layers
    `
  };
}

/**
 * PHASE 3: Intelligent Failure Analysis
 *
 * When tests fail, orchestrate tools to understand why
 */

async function analyzeTestFailures(failures: TestFailure[]) {
  return {
    prompt_for_claude: `
      Analyze test failures intelligently:

      For each failure in ${JSON.stringify(failures)}:

      STEP 1: Capture Failure Context (Playwright MCP)
      ================================================
      1. mcp__playwright__browser_take_screenshot({
           filename: "failures/failure-{test-id}.png"
         })

      2. mcp__playwright__browser_console_messages({ onlyErrors: true })
         Capture console errors

      3. mcp__playwright__browser_network_requests()
         Check for failed requests

      4. mcp__playwright__browser_snapshot()
         Get full page state

      STEP 2: Code Analysis (IDE MCP)
      ================================
      If failure is in specific component/page:

      1. mcp__ide__getDiagnostics({ uri: "file://path/to/component.tsx" })
         Check for TypeScript errors, linter warnings

      2. Analyze stack trace to identify:
         - Failing component
         - Related code files

      STEP 3: Historical Analysis (GitHub MCP)
      =========================================
      Research if this is a known issue:

      1. mcp__github__search_issues({
           q: "repo:owner/repo {error_message} label:bug",
           per_page: 5
         })
         Check for similar failures

      2. If similar issue exists:
         - Link to existing issue
         - Extract workarounds/fixes

      STEP 4: Best Practice Research (WebSearch)
      ===========================================
      If new failure pattern:

      1. WebSearch({
           query: "{error_message} {component_type} react nextjs"
         })
         Find solutions from community

      2. Extract:
         - Root cause explanations
         - Recommended fixes
         - Prevention strategies

      STEP 5: Synthesize Failure Report
      ==================================
      For each failure, generate:
      - What failed (test name, assertion)
      - Why it failed (root cause from analysis)
      - How to fix (actionable steps)
      - Related issues (GitHub links)
      - Screenshots and logs

      Output: DetailedFailureAnalysis with fix suggestions
    `
  };
}

/**
 * PHASE 4: Automated Issue Creation
 *
 * Create GitHub issues for failures automatically
 */

async function createGitHubIssuesForFailures(analysis: FailureAnalysis) {
  return {
    prompt_for_claude: `
      Automatically create GitHub issues for test failures:

      For each unique failure in analysis:

      STEP 1: Check for Existing Issues
      ==================================
      mcp__github__search_issues({
        q: "repo:owner/repo {failure.testName} is:open",
        per_page: 5
      })

      If existing issue found:
      - Add comment with new failure occurrence
      - Skip issue creation

      STEP 2: Create Detailed Issue
      ==============================
      If no existing issue:

      mcp__github__create_issue({
        owner: "owner",
        repo: "repo",
        title: "Test Failure: {test_name}",
        body: generateIssueBody(failure),
        labels: ["test-failure", "bug", "automated"]
      })

      Issue Body Format:
      ---
      ## Test Failure Report

      **Test**: {test_name}
      **Failed At**: {timestamp}
      **Browser**: {browser}
      **Environment**: {environment}

      ### Failure Details
      {failure_description}

      ### Error Message
      \`\`\`
      {error_stack}
      \`\`\`

      ### Console Errors
      {console_errors}

      ### Failed Network Requests
      {failed_requests}

      ### Screenshots
      ![Failure Screenshot](path/to/screenshot.png)

      ### Suggested Fix
      {ai_suggested_fix}

      ### Related Issues
      {links_to_similar_issues}

      ---
      *This issue was automatically created by test orchestration*
      ---

      STEP 3: Assign and Label
      =========================
      - Auto-assign to last person who modified the test file
      - Add priority label based on failure frequency
      - Add component label based on affected code

      Output: Created issue URLs
    `
  };
}

/**
 * PHASE 5: PR Comment with Test Results
 *
 * Post comprehensive test report as PR comment
 */

async function commentOnPullRequest(prNumber: number, results: TestResults) {
  return {
    prompt_for_claude: `
      Post test results as PR comment:

      mcp__github__add_issue_comment({
        owner: "owner",
        repo: "repo",
        issue_number: ${prNumber},
        body: generatePRComment(results)
      })

      Comment Format:
      ---
      ## Test Results Summary

      **Status**: {passed ? "✅ All tests passed" : "❌ Some tests failed"}
      **Total Tests**: {total}
      **Passed**: {passed} ({percentage}%)
      **Failed**: {failed}
      **Duration**: {duration}

      ### Test Breakdown
      | Layer | Passed | Failed | Duration |
      |-------|--------|--------|----------|
      | E2E | {e2e_passed}/{e2e_total} | {e2e_failed} | {e2e_duration} |
      | Accessibility | {a11y_passed}/{a11y_total} | {a11y_failed} | {a11y_duration} |
      | Visual Regression | {visual_passed}/{visual_total} | {visual_failed} | {visual_duration} |
      | Performance | {perf_passed}/{perf_total} | {perf_failed} | {perf_duration} |

      ### Failed Tests
      {if failures:}
      {for each failure:}
      #### {failure.test_name}
      - **Error**: {failure.error}
      - **File**: {failure.file}:{failure.line}
      - **Screenshot**: [View](url_to_screenshot)
      - **Issue**: #{created_issue_number}
      {end for}
      {end if}

      ### Performance Metrics
      - **LCP**: {lcp}ms (target: <2500ms)
      - **FCP**: {fcp}ms (target: <1800ms)
      - **TBT**: {tbt}ms (target: <200ms)

      ### Visual Changes
      {if visual_changes:}
      - {count} pages have visual differences
      - [View Visual Diff Report](url_to_report)
      {end if}

      ---
      *Test report generated by automated testing orchestration*
      ---

      Output: PR comment posted
    `
  };
}

/**
 * PHASE 6: Auto-Fix Simple Failures (Advanced)
 *
 * For certain failure types, attempt automated fixes
 */

async function attemptAutoFix(failure: TestFailure) {
  return {
    prompt_for_claude: `
      Attempt automated fix for simple failures:

      IF failure_type == "selector_not_found":
        STEP 1: Analyze Current Page
        =============================
        mcp__playwright__browser_snapshot()
        Find similar elements that might be the intended target

        STEP 2: Suggest Selector Update
        ================================
        Recommend more robust selector:
        - Use data-testid instead of class
        - Use accessible roles
        - Use text content

        STEP 3: Update Test File (with user approval)
        ==============================================
        Update test selector in code

      IF failure_type == "timing_issue":
        STEP 1: Add Explicit Wait
        ==========================
        mcp__playwright__browser_wait_for({
          text: expected_text,
          timeout: 10000
        })

      IF failure_type == "console_error":
        STEP 1: Identify Error Source
        ==============================
        mcp__ide__getDiagnostics()
        Find code causing console error

        STEP 2: Research Fix
        ====================
        WebSearch for solution

        STEP 3: Suggest Code Change
        ============================
        Provide specific code fix

      Output: Auto-fix suggestions or applied fixes
    `
  };
}

export {
  setupTestEnvironment,
  executeTestSuite,
  analyzeTestFailures,
  createGitHubIssuesForFailures,
  commentOnPullRequest,
  attemptAutoFix
};
```

## Complete Testing Workflow Example

```
User: Run comprehensive tests on the authentication feature and report results to PR #123

Claude Code:
I'll orchestrate a comprehensive testing workflow using multiple MCP tools.

PHASE 1: Environment Setup
===========================
[Invokes mcp__ide__getDiagnostics in parallel]
[Invokes mcp__github__search_code for test files in parallel]
[Invokes mcp__playwright__browser_install in parallel]

✓ No compilation errors
✓ Found 12 test files for authentication
✓ Chromium browser ready

Starting application...
[Invokes Bash to start dev server]
✓ Application running on http://localhost:3000

[Invokes mcp__playwright__browser_navigate]
[Invokes mcp__playwright__browser_snapshot]
✓ Health check passed

PHASE 2: Multi-Layer Test Execution
====================================

Layer 1: E2E Functional Tests (6 tests)
----------------------------------------
[Invokes mcp__playwright__browser_navigate to /auth/login]
[Invokes mcp__playwright__browser_fill_form for login]
[Invokes mcp__playwright__browser_click for submit]
[Invokes mcp__playwright__browser_wait_for for dashboard]

Test 1: Login with valid credentials ✓ PASSED (2.3s)
Test 2: Login with invalid password ✓ PASSED (1.8s)
Test 3: Registration flow ✓ PASSED (3.1s)
Test 4: Password reset ✓ PASSED (2.7s)
Test 5: Session persistence ✓ PASSED (1.5s)
Test 6: Logout flow ✓ PASSED (0.9s)

Layer 2: Accessibility Tests (3 pages)
---------------------------------------
[Invokes mcp__playwright__browser_navigate for each page]
[Invokes mcp__playwright__browser_snapshot for ARIA analysis]

Login page: ✓ No violations
Registration page: ❌ 2 violations found
  - Missing form labels (2 inputs)
  - Insufficient color contrast (submit button)

Dashboard page: ✓ No violations

Layer 3: Visual Regression (3 pages)
-------------------------------------
[Invokes mcp__playwright__browser_take_screenshot for each page]

Comparing with baselines...
Login page: ✓ No changes
Registration page: ⚠ 0.3% difference (within threshold)
Dashboard page: ✓ No changes

Layer 4: Performance Tests
---------------------------
[Measures Core Web Vitals]

Login page:
- LCP: 1.8s ✓ (target: <2.5s)
- FCP: 0.9s ✓ (target: <1.8s)
- TBT: 120ms ✓ (target: <200ms)
- CLS: 0.05 ✓ (target: <0.1)

Dashboard page:
- LCP: 2.1s ✓
- FCP: 1.2s ✓
- TBT: 95ms ✓
- CLS: 0.02 ✓

PHASE 3: Failure Analysis
==========================
Analyzing 2 accessibility failures...

[Invokes mcp__playwright__browser_take_screenshot]
Screenshot saved: failures/a11y-registration-labels.png

[Invokes mcp__playwright__browser_console_messages]
No console errors related to failure

[Invokes mcp__ide__getDiagnostics for components/RegistrationForm.tsx]
Found: TypeScript file has no errors

[Invokes mcp__github__search_issues]
Found similar issue: #89 "Form accessibility improvements"

[Invokes WebSearch]
Query: "react form accessibility missing labels best practices"
Found: WCAG 2.1 guideline for form labels

Analysis Complete:
------------------
Failure 1: Missing labels on email/password inputs
- Root Cause: Inputs use placeholder instead of label
- Fix: Add <label> elements with htmlFor
- Severity: MEDIUM (WCAG 2.1 A violation)
- Related: Issue #89

Failure 2: Color contrast on submit button
- Root Cause: Blue (#4285f4) on white fails 4.5:1 ratio
- Fix: Darken to #1a73e8 (meets 4.51:1)
- Severity: MEDIUM (WCAG 2.1 AA violation)

PHASE 4: Automated Issue Creation
==================================
[Invokes mcp__github__search_issues to check for existing]
Issue #89 exists but is about general a11y - creating specific issue

[Invokes mcp__github__create_issue]
Created: Issue #125 "Accessibility: Missing form labels in registration"
Created: Issue #126 "Accessibility: Submit button color contrast insufficient"

Both issues assigned to @frontend-team

PHASE 5: PR Comment
===================
[Invokes mcp__github__add_issue_comment on PR #123]

Posted comprehensive test report to PR #123 with:
- Test summary (8/10 passed)
- Detailed failure breakdown
- Performance metrics
- Links to created issues
- Visual diff report

SUMMARY
=======
✅ 6/6 E2E tests passed
❌ 2/3 Accessibility tests failed
✓ 3/3 Visual regression tests passed
✓ 2/2 Performance tests passed

Overall: 11/14 tests passed (78.6%)

Actions Taken:
- Created 2 GitHub issues (#125, #126)
- Posted report to PR #123
- Saved failure screenshots
- Generated HTML report

Recommendations:
1. Fix accessibility issues before merging (critical)
2. Consider auto-fixing with suggested code changes
3. Add a11y checks to pre-commit hooks

Would you like me to:
1. Generate code fixes for the accessibility issues?
2. Set up automated a11y testing in CI/CD?
3. Run tests again after fixes?
```

## Orchestration Patterns for Testing

### Pattern 1: Parallel Test Layers
Execute different test types simultaneously:
- E2E + Accessibility + Performance (all use Playwright MCP)
- Reduces total test time from 15 minutes to 6 minutes

### Pattern 2: Failure-Triggered Deep Dive
When test fails, automatically:
- Screenshot (Playwright)
- Console logs (Playwright)
- Code analysis (IDE MCP)
- Issue search (GitHub MCP)
- Solution research (WebSearch)

### Pattern 3: Smart Test Selection
Based on changed files (GitHub MCP):
- Only run tests related to modified components
- Full suite only on main branch

### Pattern 4: Auto-Remediation
For simple failures:
- Update selectors
- Add waits
- Fix timing issues
- Suggest code fixes

### Pattern 5: Cross-Tool Reporting
Test results flow to multiple destinations:
- GitHub PR comments
- GitHub Issues
- HTML reports
- Slack notifications (via webhooks)

## Related Examples

- **E2E Testing**: `qa-testing/examples/01-e2e-test-suite.md` - Playwright MCP testing basics
- **Accessibility**: `qa-testing/examples/02-accessibility-testing.md` - A11y test patterns
- **Performance**: `qa-testing/examples/03-performance-testing.md` - Performance test patterns
- **Multi-Tool Research**: `mcp-tools-orchestrator/examples/01-multi-tool-research-pattern.md` - Research orchestration

## Key Takeaways

1. **Multi-Layer Testing**: E2E + A11y + Visual + Performance in one orchestrated workflow
2. **Failure Intelligence**: Auto-analyze failures using multiple MCP tools
3. **Automated Issue Tracking**: Create GitHub issues automatically for failures
4. **PR Integration**: Post test results directly to pull requests
5. **Smart Test Selection**: Run only relevant tests based on changes
6. **Auto-Remediation**: Fix simple failures automatically
7. **Cross-Browser Coverage**: Test across Chromium, Firefox, WebKit
8. **Performance Validation**: Ensure Core Web Vitals meet targets
9. **Accessibility First**: Catch a11y violations in CI
10. **Comprehensive Reporting**: Screenshots, logs, metrics, and recommendations

Advanced testing orchestration transforms manual testing into intelligent, automated quality assurance.
