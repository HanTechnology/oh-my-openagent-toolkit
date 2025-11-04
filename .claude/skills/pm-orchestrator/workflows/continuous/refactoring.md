# Refactoring Sub-Workflow

## Overview

- **Primary Skill**: pm-orchestrator (coordination), domain skills (implementation)
- **Parent Workflow**: 09-continuous-development.md
- **Work Type**: Code quality improvements, technical debt reduction
- **Version Impact**: PATCH (no functional changes)
- **Priority**: Low-Medium
- **Return To**: 06-integration.md

## Purpose

Improve code quality, structure, and maintainability WITHOUT changing external behavior. This workflow handles technical debt reduction, code organization improvements, and internal refactoring that makes the codebase easier to work with.

## Critical Principle

**ZERO BEHAVIOR CHANGES**: Refactoring MUST NOT change how the application works from a user perspective. Any functional change is NOT refactoring - it's a feature or enhancement.

## Entry Conditions

- Routed from 09-continuous-development.md Phase 3
- Work type: Code refactoring, technical debt reduction
- Priority: Low-Medium
- Version: Patch version increment
- User impact: None (internal only)

## Workflow Steps

### Phase 1: Refactoring Analysis

**Objective**: Identify what needs to be refactored and why

**Actions**:

1. **Read Context**:
   - .memory/technical-debt.md (accumulated tech debt)
   - Code complexity metrics (if available)
   - Recent code reviews (identify patterns)
   - Developer feedback (pain points)

2. **Refactoring Identification**:
   Common refactoring candidates:
   - **Code Duplication**: Same code repeated multiple times
   - **Long Functions/Methods**: Functions >50 lines
   - **Large Components**: React components >300 lines
   - **Deep Nesting**: Nested conditions >3 levels deep
   - **Unclear Naming**: Variables/functions with unclear names
   - **Dead Code**: Unused functions, imports, variables
   - **Poor Organization**: Files in wrong directories
   - **Missing Abstractions**: Repeated patterns without extraction
   - **God Objects**: Classes/modules doing too much

3. **Benefit Assessment**:
   - Does this improve code readability?
   - Does this reduce maintenance burden?
   - Does this prevent future bugs?
   - Does this improve testability?
   - Will this make future features easier?

4. **Scope Definition**:
   Define clear boundaries:
   - What code will be refactored?
   - What will NOT be touched?
   - How many files affected?
   - Estimated complexity?

### Phase 2: Risk Assessment

**Objective**: Assess risk of breaking things

**Actions**:

1. **Test Coverage Check**:
   **CRITICAL**: Refactoring requires good test coverage
   - Check existing test coverage for target code
   - If coverage <70%: Write tests BEFORE refactoring
   - Ensure critical paths have tests
   - Document untested edge cases

2. **Impact Analysis**:
   - How many files will change?
   - How many components/modules affected?
   - Are there external dependencies?
   - Are there integration points?

3. **Risk Level Assessment**:
   **Low Risk**:
   - Small scope (<5 files)
   - High test coverage (>80%)
   - Internal modules only
   - Clear refactoring pattern

   **Medium Risk**:
   - Medium scope (5-15 files)
   - Medium test coverage (60-80%)
   - Some integration points
   - Multi-step refactoring

   **High Risk**:
   - Large scope (>15 files)
   - Low test coverage (<60%)
   - Core functionality
   - Complex dependencies

   **If High Risk**: Break into smaller refactoring chunks

4. **Rollback Plan**:
   - Git branch strategy
   - How to quickly revert if issues?
   - Can we deploy incrementally?

### Phase 3: Refactoring Design

**Objective**: Plan the refactoring approach

**Actions**:

1. **Refactoring Pattern Selection**:
   Common refactoring patterns:

   **Extract Function/Method**:
   - Before: Long function with multiple responsibilities
   - After: Multiple small functions, each with single responsibility

   **Extract Component** (React):
   - Before: Large component with mixed concerns
   - After: Smaller components, better composition

   **Rename for Clarity**:
   - Before: Unclear variable/function names
   - After: Self-documenting names

   **Remove Duplication**:
   - Before: Same logic repeated
   - After: Shared utility function/hook

   **Simplify Conditionals**:
   - Before: Nested if-else, complex conditions
   - After: Guard clauses, early returns, simplified logic

   **Organize Imports**:
   - Before: Messy imports, unused imports
   - After: Organized, categorized, clean imports

2. **Step-by-Step Plan**:
   For complex refactoring, define incremental steps:
   ```
   Step 1: Extract helper functions
   Step 2: Update call sites
   Step 3: Add JSDoc comments
   Step 4: Run tests, verify no regressions
   Step 5: Commit incremental progress
   ```

3. **Skill Coordination**:
   Mention required skill:
   - Frontend refactoring → **frontend-nextjs** or **mobile-react-native**
   - Backend refactoring → **backend-nestjs** or **backend-fastapi**
   - Cross-cutting refactoring → **fullstack-integration**

### Phase 4: Pre-Refactoring Test Addition

**Objective**: Ensure adequate test coverage BEFORE refactoring

**Actions**:

1. **Test Coverage Baseline**:
   - Measure current coverage for target code
   - Identify untested code paths
   - Document baseline metrics

2. **Add Missing Tests** (if coverage <70%):
   - Write unit tests for target functions/methods
   - Write component tests for target components
   - Write integration tests for critical paths
   - Ensure all edge cases covered

3. **Create Characterization Tests**:
   For legacy code without tests:
   - Write tests that document current behavior
   - Even if behavior is wrong, document it
   - These tests ensure refactoring doesn't change behavior

4. **Verify Tests Pass**:
   ```bash
   npm test
   # All tests must pass before refactoring begins
   ```

### Phase 5: Refactoring Implementation

**Objective**: Perform the refactoring

**Actions**:

1. **Create Refactoring Branch**:
   ```bash
   git checkout -b refactor/[refactoring-description]
   ```

2. **Implement Refactoring**:
   Mention appropriate skill to implement:

   **Frontend Refactoring**:
   - Extract reusable components
   - Simplify component logic
   - Improve naming
   - Organize file structure
   - Remove unused code
   - Improve type definitions
   - Run tests after each change

   **Backend Refactoring**:
   - Extract service methods
   - Simplify business logic
   - Improve data models
   - Organize module structure
   - Remove unused dependencies
   - Improve error handling patterns
   - Run tests after each change

   **Incremental Approach**:
   - Make small, verifiable changes
   - Run tests after each step
   - Commit frequently (every logical step)
   - If tests fail: Revert last change, try different approach

3. **Automated Refactoring Tools**:
   Use IDE refactoring features when possible:
   - Rename symbol (ensures all references updated)
   - Extract function/method
   - Move file (updates all imports)
   - Organize imports

4. **Code Quality Checks**:
   - Run linter: `npm run lint`
   - Run type checker: `tsc --noEmit` (TypeScript)
   - Run formatter: `npm run format`
   - Fix any issues introduced

### Phase 6: Comprehensive Testing

**Objective**: Verify zero behavior changes

**Actions**:

1. **Unit Test Verification**:
   ```bash
   npm test
   # All tests must still pass
   # No tests should need changes (if they do, behavior changed!)
   ```

2. **Integration Test Verification**:
   - Run integration tests
   - Verify API contracts unchanged
   - Verify data flow unchanged

3. **Manual Testing** (critical paths):
   - Test critical user flows manually
   - Verify UI still works (if frontend refactoring)
   - Verify API still works (if backend refactoring)
   - Check for any subtle behavior changes

4. **Performance Regression Check**:
   - Measure performance before/after
   - Ensure no performance degradation
   - If performance improved: Bonus! Document it

5. **Regression Test Results**:
   Document in refactoring notes:
   ```markdown
   ## Test Results
   - Unit Tests: ✅ 150/150 passing (no changes)
   - Integration Tests: ✅ 45/45 passing
   - Manual Testing: ✅ All critical flows working
   - Performance: ✅ No regression (same or better)
   ```

### Phase 7: Code Review & Documentation

**Objective**: Document refactoring and ensure quality

**Actions**:

1. **Self Code Review**:
   - Review all changes
   - Ensure refactoring goals achieved
   - Check for any accidental functional changes
   - Verify code quality improved

2. **Documentation Updates**:
   Update code documentation:
   - Add/update JSDoc comments
   - Update architecture docs (if structure changed)
   - Document new patterns introduced
   - Update developer guides (if applicable)

3. **Changelog Entry**:
   Add to .memory/version-history.md:
   ```markdown
   ## v1.2.4 (Planned - 2025-01-18)
   ### Refactored
   - Simplified authentication logic (reduced complexity by 40%)
   - Extracted reusable form components
   - Improved error handling patterns
   - Removed 500 lines of dead code
   ```

4. **Technical Debt Update**:
   Update .memory/technical-debt.md:
   ```markdown
   ## Completed Refactoring
   - ✅ Authentication module refactoring (2025-01-18)
     - Reduced complexity from 150 to 90 complexity score
     - Improved test coverage from 65% to 85%
     - Extracted 3 reusable components
   ```

### Phase 8: Memory System Updates

**Objective**: Update memory with refactoring context

**Memory Updates**:

1. **Update .memory/active-context.md**:
   ```markdown
   ## Current Work
   - Refactoring: Authentication module simplification
   - Status: Complete and tested
   - Target Version: v1.2.4
   - Impact: Reduced complexity 40%, improved test coverage to 85%
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "current_work": {
       "type": "refactoring",
       "refactoring": "authentication-module",
       "status": "complete",
       "target_version": "1.2.4",
       "metrics": {
         "complexity_reduction": "40%",
         "test_coverage_improvement": "65% → 85%",
         "lines_removed": 500
       }
     }
   }
   ```

3. **Update .memory/technical-debt.md**:
   Mark technical debt as resolved

### Phase 9: Return to Integration Pipeline

**Objective**: Hand off to quality assurance pipeline

**Actions**:

1. **Commit Changes**:
   ```bash
   git add .
   git commit -m "refactor: simplify authentication logic

   - Extract authentication utilities
   - Simplify password validation logic
   - Improve error handling patterns
   - Remove unused authentication methods
   - Add JSDoc comments

   ZERO behavior changes - all tests passing
   Complexity reduced by 40%

   Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   git push origin refactor/[refactoring-description]
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
   - Integration → Deployment → QA (with emphasis on regression testing) → Release
   - After release: Return to 09-continuous-development.md

## Completion Criteria

- ✅ Refactoring scope clearly defined
- ✅ Test coverage adequate (>70%)
- ✅ Refactoring implemented
- ✅ ALL tests still passing (no test changes required)
- ✅ Zero behavior changes verified
- ✅ No performance regressions
- ✅ Code quality metrics improved
- ✅ Documentation updated
- ✅ Technical debt reduced
- ✅ Code committed to refactor branch
- ✅ Memory system updated
- ✅ Ready for integration testing

## Return To

**Next Workflow**: 06-integration.md (integration testing with focus on regression)

**After Full Pipeline**:
06-integration.md → 07-deployment.md → 08-quality-assurance.md (heavy regression focus) → release-management.md → Production → 09-continuous-development.md

## Refactoring Examples

### Example 1: Extract Reusable Components

**Issue**: Form components duplicated across 5 different pages

**Execution**:
1. Phase 1: Identify duplicated form patterns
2. Phase 2: Risk assessment - Low risk, isolated components
3. Phase 3: Design - Extract FormField, FormGroup, FormSubmit components
4. Phase 4: Add tests for existing forms (baseline behavior)
5. Phase 5: Implement refactoring
   - Create reusable components
   - Replace duplicated code with reusable components
   - Run tests after each replacement
6. Phase 6: Comprehensive testing - All forms still work identically
7. Phase 7: Documentation - Component library docs updated
8. Phase 8: Memory updates (v1.2.3 → v1.2.4)
9. Phase 9: Return to integration pipeline

**Result**: Reduced code by 300 lines, improved consistency, easier to maintain

**Version**: v1.2.3 → v1.2.4 (PATCH - internal improvement)

### Example 2: Simplify Complex Function

**Issue**: calculateOrderTotal function is 150 lines with nested conditions

**Execution**:
1. Phase 1: Analyze complex function (cyclomatic complexity: 25)
2. Phase 2: Risk assessment - Medium risk, critical business logic
3. Phase 3: Design - Extract sub-functions for each calculation step
4. Phase 4: Add comprehensive tests (all edge cases)
5. Phase 5: Implement refactoring
   - Extract calculateSubtotal function
   - Extract calculateTaxes function
   - Extract calculateDiscounts function
   - Extract calculateShipping function
   - Simplify main function to orchestrate sub-functions
6. Phase 6: Comprehensive testing - All test cases pass, same results
7. Phase 7: Documentation - Add JSDoc comments
8. Phase 8: Memory updates (v1.2.4 → v1.2.5)
9. Phase 9: Return to integration pipeline

**Result**: Complexity reduced from 25 to 5, improved readability, easier to test

**Version**: v1.2.4 → v1.2.5 (PATCH - internal improvement)

### Example 3: Remove Dead Code

**Issue**: 1000+ lines of unused code identified by analysis tool

**Execution**:
1. Phase 1: Analyze unused code (imports, functions, components)
2. Phase 2: Risk assessment - Low risk if truly unused
3. Phase 3: Design - Incremental removal with verification
4. Phase 4: Verify test coverage adequate
5. Phase 5: Implement refactoring
   - Remove unused imports
   - Remove unused functions
   - Remove unused components
   - Run tests after each removal
   - If tests fail: Code not truly unused, keep it
6. Phase 6: Comprehensive testing - All tests pass
7. Phase 7: Documentation - Update component inventory
8. Phase 8: Memory updates (v1.2.5 → v1.2.6)
9. Phase 9: Return to integration pipeline

**Result**: Removed 1000 lines of dead code, reduced bundle size by 15KB

**Version**: v1.2.5 → v1.2.6 (PATCH - internal improvement)

## Common Issues and Resolutions

**Issue**: Tests fail after refactoring
**Resolution**: Behavior changed - this is NOT refactoring. Revert and redesign approach to maintain behavior

**Issue**: Test needs to change for refactoring to pass
**Resolution**: RED FLAG - behavior changed. Revert unless test was testing implementation details (bad test)

**Issue**: Refactoring too large, losing confidence
**Resolution**: Break into smaller chunks, commit more frequently, refactor incrementally

**Issue**: Performance regressed after refactoring
**Resolution**: Optimize or revert. Refactoring should not degrade performance

**Issue**: Unclear if behavior changed
**Resolution**: More comprehensive testing needed. Add characterization tests first

## Success Metrics

- Zero behavior changes (all tests pass without modification)
- Code quality improved (complexity, readability, maintainability)
- Test coverage maintained or improved
- No performance regressions
- Technical debt reduced
- Developer satisfaction improved (easier to work with)
