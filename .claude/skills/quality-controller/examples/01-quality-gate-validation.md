# Example: Quality Gate Validation for Web Application

## Scenario

E-commerce platform ready for v1.0.0 deployment. quality-controller validates all quality gates before release.

## Quality Gate Validation Process

### Step 1: Load Project-Type Standards

quality-controller loads standards from `quality-standards.json`:

```json
{
  "web_application": {
    "typescript_coverage": {
      "target": 95,
      "minimum": 85,
      "blocking": true
    },
    "core_web_vitals": {
      "lcp": { "target": 2500, "blocking": true },
      "fid": { "target": 100, "blocking": true },
      "cls": { "target": 0.1, "blocking": true }
    },
    "lighthouse": {
      "performance": { "target": 90, "minimum": 80, "blocking": true },
      "accessibility": { "target": 95, "minimum": 90, "blocking": true },
      "best_practices": { "target": 90, "minimum": 85, "blocking": false },
      "seo": { "target": 90, "minimum": 85, "blocking": false }
    },
    "security": {
      "critical_vulnerabilities": { "target": 0, "blocking": true },
      "high_vulnerabilities": { "target": 0, "blocking": true }
    },
    "test_coverage": {
      "backend": { "target": 80, "minimum": 70, "blocking": true },
      "frontend": { "target": 70, "minimum": 60, "blocking": true }
    }
  }
}
```

### Step 2: Execute Pre-Deployment Quality Gates

#### Gate 1: TypeScript Coverage

```bash
# Check strict mode compliance
npx tsc --noEmit --strict
```

**Result**:
```
TypeScript Coverage Check
=========================
Total Files: 156
Strict Mode: Enabled
Errors: 0
Warnings: 2 (non-blocking)

Status: PASS ✅
```

#### Gate 2: Test Coverage

```bash
# Backend coverage
npm run test:cov --prefix workspace/backend

# Frontend coverage  
npm run test:cov --prefix workspace/frontend
```

**Result**:
```
Test Coverage Report
====================
Backend:
  - Statements: 82.5%
  - Branches: 78.3%
  - Functions: 85.1%
  - Lines: 82.0%
  Target: 80% | Status: PASS ✅

Frontend:
  - Statements: 73.2%
  - Branches: 68.5%
  - Functions: 75.8%
  - Lines: 72.1%
  Target: 70% | Status: PASS ✅
```

#### Gate 3: Core Web Vitals

```bash
# Run Lighthouse via Playwright MCP
mcp__playwright__evaluate --url "http://localhost:3000" --metrics "cwv"
```

**Result**:
```
Core Web Vitals Report
======================
LCP (Largest Contentful Paint):
  - Measured: 1,850ms
  - Target: <2,500ms
  - Status: PASS ✅

FID (First Input Delay):
  - Measured: 45ms
  - Target: <100ms
  - Status: PASS ✅

CLS (Cumulative Layout Shift):
  - Measured: 0.05
  - Target: <0.1
  - Status: PASS ✅
```

#### Gate 4: Lighthouse Audit

**Result**:
```
Lighthouse Audit Report
=======================
Performance:    94 (target: 90) ✅
Accessibility:  97 (target: 95) ✅
Best Practices: 92 (target: 90) ✅
SEO:            95 (target: 90) ✅

Overall Status: PASS ✅
```

#### Gate 5: Security Scan

```bash
# Dependency audit
npm audit --audit-level=high

# Container scan
docker scan ecommerce-backend:latest
```

**Result**:
```
Security Scan Report
====================
npm audit:
  - Critical: 0 (target: 0) ✅
  - High: 0 (target: 0) ✅
  - Moderate: 3 (non-blocking)
  - Low: 8 (non-blocking)

Container Scan:
  - Critical: 0 ✅
  - High: 0 ✅

Overall Status: PASS ✅
```

#### Gate 6: E2E Tests

```bash
# Run Playwright MCP E2E tests
mcp__playwright__test --config playwright.config.ts
```

**Result**:
```
E2E Test Report
===============
Total Tests: 48
Passed: 48
Failed: 0
Skipped: 0

Test Suites:
  - Authentication: 12/12 ✅
  - Product Catalog: 10/10 ✅
  - Shopping Cart: 8/8 ✅
  - Checkout: 10/10 ✅
  - Admin Dashboard: 8/8 ✅

Browser Coverage:
  - Chrome: ✅
  - Firefox: ✅
  - Safari: ✅
  - Edge: ✅

Status: PASS ✅
```

#### Gate 7: Accessibility (WCAG 2.1 AA)

**Result**:
```
Accessibility Report
====================
WCAG 2.1 AA Compliance:
  - Level A: 100% compliant ✅
  - Level AA: 100% compliant ✅

Issues Found: 0 critical, 0 serious
Warnings: 2 (minor - non-blocking)

Status: PASS ✅
```

### Step 3: Generate Quality Report

```markdown
# Quality Gate Report - E-Commerce Platform v1.0.0

**Generated**: 2025-01-15 15:30:00 UTC
**Project Type**: web_application
**Release Candidate**: v1.0.0

## Summary

| Gate | Status | Score/Value | Target | Blocking |
|------|--------|-------------|--------|----------|
| TypeScript Coverage | ✅ PASS | 100% | 95% | Yes |
| Backend Test Coverage | ✅ PASS | 82% | 80% | Yes |
| Frontend Test Coverage | ✅ PASS | 73% | 70% | Yes |
| LCP | ✅ PASS | 1,850ms | <2,500ms | Yes |
| FID | ✅ PASS | 45ms | <100ms | Yes |
| CLS | ✅ PASS | 0.05 | <0.1 | Yes |
| Lighthouse Performance | ✅ PASS | 94 | 90 | Yes |
| Lighthouse Accessibility | ✅ PASS | 97 | 95 | Yes |
| Lighthouse Best Practices | ✅ PASS | 92 | 90 | No |
| Lighthouse SEO | ✅ PASS | 95 | 90 | No |
| Security (Critical) | ✅ PASS | 0 | 0 | Yes |
| Security (High) | ✅ PASS | 0 | 0 | Yes |
| E2E Tests | ✅ PASS | 48/48 | 100% | Yes |
| WCAG 2.1 AA | ✅ PASS | 100% | 100% | Yes |

## Decision

**DEPLOYMENT APPROVED** ✅

All blocking quality gates passed. Project meets web_application quality standards.

## Recommendations (Non-Blocking)

1. Address 3 moderate npm vulnerabilities in next release cycle
2. Review 2 TypeScript warnings (non-critical)
3. Consider 2 minor accessibility warnings for enhanced UX
```

### Step 4: Update Memory

Update `.memory/ops/quality.json`:

```json
{
  "last_validation": "2025-01-15T15:30:00Z",
  "version": "1.0.0",
  "result": "APPROVED",
  "gates_passed": 14,
  "gates_failed": 0,
  "blocking_issues": 0,
  "non_blocking_issues": 5
}
```

## Result

**Quality Validation**: PASSED
**All Blocking Gates**: PASSED (14/14)
**Non-Blocking Issues**: 5 (deferred to next release)
**Decision**: DEPLOYMENT APPROVED

**Next Step**: Proceed to 07-deployment.md workflow
