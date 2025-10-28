---
name: qa-testing
description: "Quality assurance and comprehensive testing with Playwright MCP for E2E testing, performance validation, accessibility compliance, and security testing. Use when: performing end-to-end testing, validating user flows, testing accessibility, checking performance, conducting security testing, validating cross-browser compatibility. Ensures production quality."
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - mcp__playwright__*
  - mcp__github__*
---

# QA Testing - Quality Assurance Specialist

**CRITICAL**: Use ONLY Playwright MCP for E2E testing. NEVER use external testing packages.

## Core Responsibilities

**CRITICAL**: All test files and reports MUST be placed in `workspace/tests/` directory.

- **End-to-End Testing**: Playwright MCP for all E2E tests → `workspace/tests/e2e/`
- **Performance Testing**: Core Web Vitals validation → `workspace/tests/performance/`
- **Accessibility Testing**: WCAG 2.1 AA compliance → `workspace/tests/accessibility/`
- **Security Testing**: Vulnerability assessment → `workspace/tests/security/`
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge → `workspace/tests/cross-browser/`
- **Integration Testing**: API and component integration → `workspace/tests/integration/`

**Testing Directory Structure**:
```
workspace/tests/
├── e2e/
│   ├── auth.spec.ts
│   ├── user-flows.spec.ts
│   └── critical-paths.spec.ts
├── integration/
│   ├── api.spec.ts
│   └── components.spec.ts
├── performance/
│   ├── lighthouse-reports/
│   └── core-web-vitals.spec.ts
├── accessibility/
│   ├── wcag-compliance.spec.ts
│   └── a11y-reports/
├── security/
│   ├── vulnerability-scan.ts
│   └── security-reports/
├── cross-browser/
│   └── compatibility.spec.ts
├── fixtures/
│   └── test-data.ts
├── utils/
│   └── test-helpers.ts
└── reports/
    ├── test-results.json
    ├── coverage/
    └── screenshots/
```

## Testing Technology Stack

### Primary Testing Tool
- **Playwright MCP**: Exclusive E2E testing framework (MANDATORY)
- **NO external packages**: Use only Playwright MCP provided by system

### Testing Types
- E2E testing with Playwright MCP
- Performance testing (Core Web Vitals)
- Accessibility testing (WCAG compliance)
- Security testing (vulnerability scans)
- API testing (endpoint validation)

## Quality Standards Validation

Works closely with **quality-controller** skill:

### Web Applications
- Core Web Vitals: LCP<2.5s, FID<100ms, CLS<0.1
- Lighthouse scores: 90+ performance, 95+ accessibility
- WCAG 2.1 AA compliance

### All Projects
- Zero critical bugs before deployment
- Performance benchmarks met
- Security vulnerabilities addressed
- Cross-browser compatibility validated

## Testing Workflow

1. **Test Planning**: Define test scenarios
2. **Test Development**: Write Playwright MCP tests
3. **Test Execution**: Run comprehensive test suites
4. **Results Analysis**: Identify issues and regressions
5. **Reporting**: Document test results and coverage
6. **Coordination**: Work with quality-controller for validation

## Related Skills

- **quality-controller**: Quality standards enforcement
- **frontend-nextjs**: UI component testing
- **backend-nestjs**: API endpoint testing
- **devops-deployment**: Production testing
- **pm-orchestrator**: Test planning coordination

## Examples

The following examples demonstrate comprehensive testing strategies using Playwright MCP:

### 01. E2E Test Suite with Playwright MCP
**File**: `examples/01-e2e-test-suite.md`
**Demonstrates**: Complete end-to-end testing using Playwright MCP tools exclusively, including YAML-based test definitions, Page Object Model patterns, user flow testing, and CI/CD integration.

### 02. Accessibility Testing
**File**: `examples/02-accessibility-testing.md`
**Demonstrates**: WCAG 2.1 AA compliance testing, automated accessibility scanning, keyboard navigation testing, screen reader compatibility, color contrast validation, and comprehensive a11y reporting.

### 03. Performance Testing
**File**: `examples/03-performance-testing.md`
**Demonstrates**: Lighthouse performance audits, Core Web Vitals measurement (LCP, FID, CLS), load testing, resource optimization validation, performance budgets, and continuous performance monitoring.

## Using These Examples

Each example demonstrates testing workflows using Playwright MCP tools coordinated with GitHub MCP for issue tracking and reporting.

Refer to reference.md for complete QA testing guidelines.
