# Technical Debt

Last Updated: [YYYY-MM-DD]

---

## Summary

**Total Debt Items**: [Number]

**Priority Breakdown**:
- High Priority: [Number] items
- Medium Priority: [Number] items
- Low Priority: [Number] items

**Estimated Total Effort**: [X weeks/months]

---

## Active Technical Debt

### High Priority

#### DEBT-001: [Technical Debt Title]
- **Category**: Code Quality / Architecture / Performance / Security / Testing / Documentation
- **Identified**: [YYYY-MM-DD]
- **Impact**: [Description of negative impact]
- **Root Cause**: [Why this debt was created]
- **Affected Components**: [List of components/modules]
- **Estimated Effort**: [X hours/days]
- **Priority**: HIGH
- **Status**: New / Planned / In Progress / Resolved
- **Target Resolution**: [vX.Y.Z] or [YYYY-MM-DD]
- **Assigned To**: [Skill name if planned]
- **Related Issues**: [Links to bug reports, user feedback]

**Details**:
```typescript
// Current problematic code or pattern
// Example: Duplicated authentication logic across 5 controllers
```

**Proposed Solution**:
```typescript
// How we should refactor this
// Example: Extract to shared AuthService
```

**Migration Strategy**: [How to safely refactor without breaking]

---

#### DEBT-002: [Technical Debt Title]
- **Category**: [Category]
- **Identified**: [YYYY-MM-DD]
- **Impact**: [Impact description]
- **Estimated Effort**: [X hours/days]
- **Priority**: HIGH
- **Status**: [Status]
- **Target Resolution**: [vX.Y.Z]

---

### Medium Priority

#### DEBT-003: [Technical Debt Title]
- **Category**: [Category]
- **Identified**: [YYYY-MM-DD]
- **Impact**: [Impact description]
- **Estimated Effort**: [X hours/days]
- **Priority**: MEDIUM
- **Status**: [Status]
- **Target Resolution**: [vX.Y.Z] or [Not Scheduled]

---

### Low Priority

#### DEBT-004: [Technical Debt Title]
- **Category**: [Category]
- **Identified**: [YYYY-MM-DD]
- **Impact**: [Minor impact description]
- **Estimated Effort**: [X hours/days]
- **Priority**: LOW
- **Status**: [Status]
- **Target Resolution**: [Not Scheduled]

---

## Technical Debt by Category

### Code Quality Debt

**Test Coverage Gaps**:
- [Component/Module 1]: [XX%] coverage (target: 70%+)
- [Component/Module 2]: [XX%] coverage (target: 70%+)
- **Action**: Add unit tests (DEBT-005)

**Code Duplication**:
- [Pattern/Code 1]: Duplicated across [X] files
- [Pattern/Code 2]: Duplicated across [X] files
- **Action**: Extract to shared utilities (DEBT-006)

**Complex Functions**:
- [Function 1]: Cyclomatic complexity [X] (target: <10)
- [Function 2]: [XXX] lines (target: <100 lines)
- **Action**: Refactor and simplify (DEBT-007)

**Linting Violations**:
- Total violations: [Number]
- Critical: [Number]
- **Action**: Fix linting issues (DEBT-008)

---

### Architecture Debt

**Tight Coupling**:
- [Component A] tightly coupled to [Component B]
- Hard to test, hard to change
- **Action**: Introduce interface/abstraction (DEBT-009)

**Missing Abstractions**:
- [Business Logic] mixed with [UI Components]
- Violates separation of concerns
- **Action**: Extract business logic to services (DEBT-010)

**Monolithic Components**:
- [Component 1]: [XXX] lines, multiple responsibilities
- **Action**: Break into smaller components (DEBT-011)

**Circular Dependencies**:
- [Module A] → [Module B] → [Module A]
- **Action**: Restructure dependencies (DEBT-012)

---

### Performance Debt

**Unoptimized Queries**:
- [Query 1]: N+1 query problem
- [Query 2]: Missing indexes
- **Action**: Optimize database queries (DEBT-013)

**Missing Caching**:
- [API Endpoint 1]: Expensive computation, no caching
- **Action**: Implement caching layer (DEBT-014)

**Large Bundle Sizes**:
- [Bundle 1]: [XXX] KB (target: <150KB)
- **Action**: Code splitting and lazy loading (DEBT-015)

**Inefficient Algorithms**:
- [Function 1]: O(n²) complexity, should be O(n log n)
- **Action**: Implement efficient algorithm (DEBT-016)

---

### Security Debt

**Outdated Dependencies**:
- [Package 1]: [X] vulnerabilities (MEDIUM severity)
- [Package 2]: [X] vulnerabilities (LOW severity)
- **Action**: Update vulnerable dependencies (DEBT-017)

**Missing Security Headers**:
- CSP not configured
- HSTS not enabled
- **Action**: Implement security headers (DEBT-018)

**Weak Authentication**:
- Password policy not enforced
- No MFA support
- **Action**: Enhance authentication (DEBT-019)

---

### Testing Debt

**Missing Tests**:
- [Feature 1]: No integration tests
- [Feature 2]: No E2E tests
- **Action**: Add test coverage (DEBT-020)

**Flaky Tests**:
- [Test 1]: Fails intermittently
- [Test 2]: Timing-dependent
- **Action**: Fix flaky tests (DEBT-021)

**Outdated Test Data**:
- Test fixtures don't reflect production data
- **Action**: Update test fixtures (DEBT-022)

---

### Documentation Debt

**Missing API Documentation**:
- [Endpoint 1-10]: No OpenAPI/Swagger docs
- **Action**: Document REST API (DEBT-023)

**Outdated README**:
- Setup instructions outdated
- Missing troubleshooting section
- **Action**: Update documentation (DEBT-024)

**No Architecture Diagrams**:
- System architecture not documented
- **Action**: Create architecture diagrams (DEBT-025)

---

## Refactoring Opportunities

### Opportunity 1: Extract Shared Utilities
- **What**: Common date formatting logic duplicated across 8 components
- **Benefit**: DRY principle, maintainability
- **Effort**: 2 hours
- **Risk**: Low
- **Workflow**: refactoring.md
- **Target**: v1.4.0

### Opportunity 2: Migrate to TypeScript Strict Mode
- **What**: Enable TypeScript strict mode project-wide
- **Benefit**: Better type safety, catch bugs early
- **Effort**: 5 days
- **Risk**: Medium (requires fixing type errors)
- **Workflow**: refactoring.md
- **Target**: v2.0.0

### Opportunity 3: Consolidate State Management
- **What**: Unify Redux and Context API usage
- **Benefit**: Consistent state management, easier to understand
- **Effort**: 1 week
- **Risk**: Medium
- **Workflow**: refactoring.md
- **Target**: v2.0.0

---

## Debt Prioritization Matrix

| Priority | Impact | Effort | When to Address |
|----------|--------|--------|-----------------|
| P1 (High) | High | Low | Immediately or next sprint |
| P1 (High) | High | High | Plan carefully, schedule soon |
| P2 (Medium) | Medium | Low | Quick wins when available |
| P2 (Medium) | Medium | Medium | Schedule based on capacity |
| P3 (Low) | Low | High | Defer or decline |

---

## Debt Accumulation Causes

### Why Was This Debt Created?

1. **Deadline Pressure**:
   - DEBT-001, DEBT-005: Rushed to meet release deadline
   - **Mitigation**: Allocate refactoring time in future sprints

2. **Lack of Knowledge**:
   - DEBT-009: Team unfamiliar with design patterns at the time
   - **Mitigation**: Training and code reviews

3. **Changing Requirements**:
   - DEBT-011: Component grew organically as requirements evolved
   - **Mitigation**: Regular refactoring sprints

4. **Technical Limitations**:
   - DEBT-013: Framework limitations, now addressed in new version
   - **Mitigation**: Upgrade framework (version-upgrade.md)

5. **Strategic Decision**:
   - DEBT-015: Deliberately chose speed over optimization for MVP
   - **Mitigation**: Plan performance optimization phase

---

## Debt Reduction Plan

### This Sprint (vX.Y.Z)
- [ ] DEBT-001: [High priority item] - [Skill] - [X hours]
- [ ] DEBT-003: [Medium priority item] - [Skill] - [X hours]
- [ ] **Debt Capacity**: 20% of sprint time allocated to debt reduction

### Next Sprint (vX.Y+1.Z)
- [ ] DEBT-002: [High priority item]
- [ ] DEBT-007: [Medium priority item]

### Long-Term (3-6 months)
- [ ] DEBT-010: [Architecture refactoring]
- [ ] DEBT-019: [Security enhancement]

---

## Completed Debt Resolution

### Recently Resolved

#### DEBT-050: Authentication Logic Duplication (Resolved in v1.2.0)
- **Resolved**: 2025-01-15
- **Solution**: Extracted to shared AuthService
- **Effort**: 4 hours (estimated: 4 hours) ✅
- **Impact**: Reduced code duplication by 200 lines, improved maintainability
- **Workflow**: refactoring.md

#### DEBT-051: Database Query Optimization (Resolved in v1.1.5)
- **Resolved**: 2025-01-08
- **Solution**: Added indexes, fixed N+1 queries
- **Effort**: 8 hours (estimated: 6 hours)
- **Impact**: Dashboard load time reduced from 3.2s to 1.8s (44% improvement)
- **Workflow**: performance-optimization.md

---

## Metrics & Trends

### Debt Accumulation Rate
- **New Debt (Last 30 Days)**: [X] items
- **Resolved Debt (Last 30 Days)**: [X] items
- **Net Change**: +[X] items (Trend: Increasing/Decreasing/Stable)

### Debt by Age
- **0-30 days**: [X] items
- **31-90 days**: [X] items
- **91+ days**: [X] items (⚠️ Aging debt)

### Debt Reduction Velocity
- **Average Resolution Time**: [X] days
- **Debt Items Resolved per Sprint**: [X]

---

## Workflow Integration

### Trigger Refactoring Workflow
When ready to address debt item:
1. pm-orchestrator invoked with debt item
2. Route to: 09-continuous-development.md
3. Work type: "Refactoring"
4. Reference: This debt item (e.g., DEBT-001)
5. Execute: refactoring.md sub-workflow
6. Update: Mark debt item as "Resolved"

### Trigger Performance Optimization Workflow
For performance-related debt:
1. Route to: performance-optimization.md sub-workflow
2. Reference performance debt items (DEBT-013, DEBT-014, etc.)
3. Execute optimization with metrics
4. Update: Mark resolved and record improvements

---

## Examples

### Example 1: Code Quality Debt

#### DEBT-101: Duplicated Validation Logic
- **Category**: Code Quality
- **Identified**: 2025-01-10
- **Impact**:
  - Duplicated email validation logic across 5 components
  - Inconsistent error messages
  - Hard to maintain (changes need 5 places)
- **Root Cause**: Initial MVP rushed, no time to abstract
- **Affected Components**:
  - SignupForm.tsx
  - ProfileEditForm.tsx
  - InviteUserForm.tsx
  - AdminUserForm.tsx
  - EmailPreferencesForm.tsx
- **Estimated Effort**: 2 hours
- **Priority**: MEDIUM
- **Status**: Planned
- **Target Resolution**: v1.4.0
- **Assigned To**: frontend-nextjs

**Current Code**:
```typescript
// Duplicated in 5 places
const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
```

**Proposed Solution**:
```typescript
// shared/validators/email.ts
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email)) {
    return { valid: false, error: 'Invalid email format' }
  }
  return { valid: true }
}

// Usage in components
import { validateEmail } from '@/shared/validators/email'
const { valid, error } = validateEmail(email)
```

**Migration Strategy**:
1. Create shared validator utility
2. Update one component at a time
3. Run tests after each component
4. Remove old duplicated code
5. Zero behavior changes (tests should not need modification)

---

### Example 2: Architecture Debt

#### DEBT-102: Business Logic in UI Components
- **Category**: Architecture
- **Identified**: 2025-01-05
- **Impact**:
  - Payment processing logic embedded in CheckoutPage component
  - Hard to test (requires React rendering)
  - Hard to reuse (mobile app needs same logic)
  - Violates separation of concerns
- **Root Cause**: Rapid prototyping, no architecture planning
- **Affected Components**: CheckoutPage.tsx (350 lines)
- **Estimated Effort**: 1 day
- **Priority**: HIGH
- **Status**: In Progress
- **Target Resolution**: v1.3.0
- **Assigned To**: fullstack-integration

**Proposed Solution**:
```typescript
// services/PaymentService.ts
export class PaymentService {
  async processPayment(data: PaymentData): Promise<PaymentResult> {
    // Extract payment logic from UI component
    // Can be tested independently
    // Can be reused across web and mobile
  }
}

// CheckoutPage.tsx (now simplified)
const paymentService = new PaymentService()
const result = await paymentService.processPayment(data)
```

---

## Notes

- Review technical debt weekly in sprint planning
- Allocate 15-20% of sprint capacity to debt reduction
- High-priority debt should be addressed within 2 sprints
- Track debt trends to prevent accumulation
- Use refactoring.md workflow for systematic debt resolution
- Document lessons learned to prevent future debt
