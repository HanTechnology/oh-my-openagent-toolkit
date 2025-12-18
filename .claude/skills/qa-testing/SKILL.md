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

## Deep Thinking Protocol

**CONDITIONAL**: qa-testing should use Sequential Thinking MCP + ultrathink only when designing complex, multi-layered testing strategies. Most standard testing follows established patterns and Playwright MCP best practices.

### When to Apply Deep Thinking

**Use Deep Thinking when**:
- **Multi-Layered Testing Strategy**: Coordinating unit + integration + E2E + performance + security testing layers
- **High-Scale Performance Testing**: Load testing for systems handling >5K concurrent users with complex patterns
- **Security Testing Beyond Standards**: Custom threat scenarios, penetration testing, advanced security validation
- **Novel Testing Patterns**: New technology stacks or unique project requirements without established patterns

**Do NOT use for** (most cases):
- Standard E2E tests with Playwright MCP (follows established patterns)
- Basic unit/integration tests
- Simple accessibility testing with axe-core
- Standard security scans with npm audit
- Performance testing with Lighthouse alone

### Complexity Threshold

Use Deep Thinking only when **2 or more** of these indicators apply:
1. Multiple testing layers requiring coordination
2. High-scale performance testing (>5K concurrent users)
3. Security testing beyond standard automation
4. Novel testing patterns for new technologies

### Deep Thinking Application Protocol

Follow the 5-Phase approach with QA-specific focus:

**Evaluation Dimensions**:
- **Test Coverage** (30%): Breadth and depth of testing across layers
- **Efficiency** (25%): Test execution time, parallelization effectiveness
- **Reliability** (20%): Flakiness rate, false positive/negative rate
- **Maintainability** (15%): Test code quality, ease of updates
- **ROI** (10%): Bug detection rate vs testing effort

**Expected Thought Investment**: 8-12 thoughts for complex testing strategy decisions

### Documentation Requirements

Document in `.memory/decisions.md` with minimal format:
- **Problem**: What testing challenge was addressed
- **Decision**: What testing strategy was chosen

### Domain-Specific Example

#### Comprehensive Testing for Real-Time Collaboration Platform

**Problem**: Design testing strategy for real-time collaboration platform requiring WebSocket testing, 10K concurrent users load testing, data encryption security testing, and cross-browser E2E validation

**Complexity**: High (3 indicators: Multi-layer testing coordination, High-scale performance >5K users, Security testing beyond standards)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements - WebSocket real-time testing, 10K user load simulation, end-to-end encryption validation, Chrome/Firefox/Safari compatibility
- Thoughts 3-5: Alternatives - Playwright alone, k6 + Playwright, Artillery + Playwright + OWASP ZAP, Custom test framework
- Thoughts 6-9: Evaluation - Playwright excellent for E2E + cross-browser, k6 superior for WebSocket load testing, OWASP ZAP for security, axe-core for accessibility
- Thoughts 10-12: Implementation strategy - Playwright E2E (cross-browser), k6 for load (WebSocket support), OWASP ZAP for security, axe-core for a11y

**Decision**: Playwright MCP (E2E + cross-browser) + k6 (load testing with WebSocket) + OWASP ZAP (security) + axe-core (accessibility)

**Rationale**: Playwright MCP provides comprehensive E2E testing with cross-browser support built-in. k6 specifically handles WebSocket load testing (10K users validated). OWASP ZAP performs security penetration testing beyond basic scans. axe-core validates WCAG AA compliance.

**Impact**: Achieved 95% test coverage across all layers. Detected 45 bugs during development (zero critical bugs reached production). Load testing validated 12K concurrent users (exceeds 10K target). Security scan found and fixed 8 vulnerabilities pre-launch.

### Quality Validation

After Deep Thinking, validate:
- [ ] Test coverage meets targets (>80% for critical paths)
- [ ] Performance testing validates actual capacity
- [ ] Security testing covers identified threat scenarios
- [ ] Cross-browser compatibility verified

Coordinate with **quality-controller** for quality gate validation and **frontend-nextjs/backend-nestjs/backend-fastapi** for integration testing requirements.

### Success Metrics

Track in `.memory/metrics.md`:
- Test coverage: Target >80% (critical paths)
- Bug detection rate: Target >90% (pre-production bug capture)
- Test reliability: Target <5% flakiness rate

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
- **database-specialist**: Database performance testing, query optimization validation
- **security-specialist**: Security testing, vulnerability scanning, penetration testing
- **frontend-nextjs**: UI component testing (web)
- **mobile-react-native**: Mobile app testing (Jest, RNTL, Detox)
- **backend-nestjs**: API endpoint testing
- **backend-fastapi**: Async API testing
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

---

## Enterprise Standards Compliance

This skill follows team-wide enterprise standards.

**Required References** (`../ENTERPRISE-STANDARDS.md`):
- [Testing Standards](../ENTERPRISE-STANDARDS.md#testing-standards) - coverage targets, test naming, AAA pattern
- [Code Conventions](../ENTERPRISE-STANDARDS.md#code-conventions) - test file naming
- [Performance Standards](../ENTERPRISE-STANDARDS.md#performance-standards) - Core Web Vitals, API latency
- [Accessibility Standards](../ENTERPRISE-STANDARDS.md#accessibility-standards) - WCAG 2.1 AA verification
- [Git Conventions](../ENTERPRISE-STANDARDS.md#git-conventions) - test type commits

**Domain-Specific Standards** (see Success Metrics section in this document):
- Test coverage > 80% (critical paths)
- Bug detection rate > 90% (pre-production)
- Test reliability < 5% flakiness rate
- Playwright MCP exclusive usage (E2E)
