# Feature Development Sub-Workflow

## Overview

- **Primary Skill**: pm-orchestrator (coordination), domain skills (implementation)
- **Parent Workflow**: 09-continuous-development.md
- **Work Type**: New features, backward-compatible additions
- **Version Impact**: MINOR version bump (e.g., v1.2.0 → v1.3.0)
- **Priority**: Medium
- **Return To**: 06-integration.md

## Purpose

Implement new features or functionality to the application while maintaining backward compatibility. This workflow handles feature additions requested by users or planned in the product roadmap.

## Entry Conditions

- Routed from 09-continuous-development.md Phase 3
- Work type: New feature implementation
- Priority: Medium (not critical/urgent)
- Version: Minor version increment planned

## Workflow Steps

### Phase 1: Feature Analysis

**Objective**: Understand feature requirements and scope

**Actions**:

1. **Read Context**:
   - User request or .memory/release-plan.md for planned feature
   - .memory/user-feedback.md for user needs
   - .memory/architecture.md for system architecture
   - .memory/active-context.md for current state

2. **Feature Specification**:
   Use Sequential Thinking MCP to analyze:
   - What is the feature?
   - Who will use it?
   - What problem does it solve?
   - What is the expected user experience?
   - What are the acceptance criteria?

3. **Requirements Documentation**:
   Create workspace/docs/features/[feature-name].md:
   ```markdown
   # Feature: [Feature Name]

   ## User Story
   As a [user type], I want [goal] so that [benefit]

   ## Functional Requirements
   1. [Requirement 1]
   2. [Requirement 2]

   ## Acceptance Criteria
   - [ ] Criterion 1
   - [ ] Criterion 2

   ## Out of Scope
   - [What this feature will NOT include]
   ```

### Phase 2: Impact Assessment

**Objective**: Assess impact on existing system

**Actions**:

1. **Component Impact Analysis**:
   - Frontend changes needed? (UI, components, routing)
   - Backend changes needed? (API endpoints, database, business logic)
   - Database changes needed? (schema changes, migrations)
   - Infrastructure changes needed? (services, deployment config)

2. **Dependency Analysis**:
   - Does this depend on other features?
   - Will this affect existing features?
   - Are there breaking changes? (if yes, reconsider as MAJOR version)
   - Backward compatibility maintained?

3. **Risk Assessment**:
   - Technical risks (complexity, unknowns)
   - User impact (affects existing workflows?)
   - Performance impact (slower response times?)
   - Security considerations (new attack surfaces?)

4. **Effort Estimation**:
   - Complexity: Simple / Medium / Complex
   - Estimated timeline: Days or weeks
   - Skills required: Which domain skills needed?

### Phase 3: Technical Design

**Objective**: Design feature implementation approach

**Actions**:

1. **Skill Coordination**:
   Based on impact assessment, mention required skills:

   - **Frontend Changes**: Mention **frontend-nextjs** or **mobile-react-native**
   - **Backend Changes**: Mention **backend-nestjs** or **backend-fastapi**
   - **Full-Stack Integration**: Mention **fullstack-integration**
   - **System-Level Changes**: Mention **systemdev-specialist**

2. **Architecture Design** (if needed):
   For complex features, coordinate with **fullstack-integration** skill:
   - API contract design (OpenAPI spec)
   - Data model design
   - Integration patterns
   - State management approach

3. **Database Schema Changes**:
   If database changes needed:
   - Design schema changes
   - Plan migrations (up and down)
   - Ensure backward compatibility
   - Document in workspace/docs/database/migrations/

4. **API Design** (if new endpoints):
   Design API endpoints:
   - Endpoint URLs and methods
   - Request/response schemas
   - Authentication/authorization requirements
   - Error handling
   - Document in workspace/specs/openapi.yaml

### Phase 4: Implementation

**Objective**: Implement the feature

**Actions**:

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/[feature-name]
   ```

2. **Backend Implementation** (if applicable):
   Mention **backend-nestjs** or **backend-fastapi** skill to implement:
   - Create new modules/controllers/services
   - Implement business logic
   - Create database migrations
   - Add input validation (DTOs)
   - Implement error handling
   - Add unit tests
   - Update API documentation (Swagger)

3. **Frontend Implementation** (if applicable):
   Mention **frontend-nextjs** or **mobile-react-native** skill to implement:
   - Create new components
   - Implement UI/UX
   - Add routing/navigation
   - Integrate with backend APIs
   - Add form validation
   - Implement loading/error states
   - Add component tests
   - Ensure accessibility (WCAG 2.1 AA)

4. **Integration** (if full-stack):
   Mention **fullstack-integration** skill to:
   - Connect frontend to backend
   - Verify API contracts
   - Test data flow
   - Handle error propagation
   - Implement optimistic updates (if applicable)

5. **Testing**:
   Implement tests at all levels:
   - Unit tests (backend services, frontend utilities)
   - Component tests (frontend components)
   - Integration tests (API integration)
   - Add to test suites

### Phase 5: Documentation

**Objective**: Document the feature for users and developers

**Actions**:

1. **User Documentation**:
   Update workspace/docs/user-guide.md or create feature-specific docs:
   - How to use the feature
   - Screenshots/examples
   - Common use cases
   - FAQ

2. **Developer Documentation**:
   - Update API documentation
   - Document new components/services
   - Add code comments
   - Update architecture diagrams (if changed)

3. **Changelog Entry**:
   Add to .memory/version-history.md:
   ```markdown
   ## v1.3.0 (Planned - 2025-01-22)
   ### Added
   - New feature: [Feature name] - [Brief description]
   ```

### Phase 6: Memory System Updates

**Objective**: Update memory with feature context

**Memory Updates**:

1. **Update .memory/active-context.md**:
   ```markdown
   ## Current Work
   - Feature: [Feature name]
   - Status: Implementation complete
   - Target Version: v1.3.0
   - Next: Integration testing
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "current_work": {
       "type": "feature_development",
       "feature": "[feature-name]",
       "status": "implementation_complete",
       "target_version": "1.3.0",
       "progress": 80
     }
   }
   ```

3. **Update .memory/decisions.md**:
   Document key technical decisions made during implementation

4. **Update .memory/release-plan.md**:
   Mark feature as implemented, update release timeline

### Phase 7: Return to Integration Pipeline

**Objective**: Hand off to quality assurance pipeline

**Actions**:

1. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add [feature-name]

   - [Key change 1]
   - [Key change 2]

   Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   git push origin feature/[feature-name]
   ```

2. **Update Project State**:
   ```json
   {
     "currentPhase": "integration",
     "active_workflow": "06-integration.md",
     "lifecycle_state": "continuous_development"
   }
   ```

3. **Route to Integration**:
   - Return control to pm-orchestrator
   - pm-orchestrator routes to 06-integration.md
   - Integration → Deployment → QA → Release
   - After release: Return to 09-continuous-development.md

## Completion Criteria

- ✅ Feature specification documented
- ✅ Implementation complete (frontend + backend)
- ✅ Tests written and passing
- ✅ Documentation updated
- ✅ Code committed to feature branch
- ✅ Memory system updated
- ✅ Ready for integration testing

## Return To

**Next Workflow**: 06-integration.md (integration testing)

**After Full Pipeline**:
06-integration.md → 07-deployment.md → 08-quality-assurance.md → release-management.md → Production → 09-continuous-development.md

## Feature Examples

### Example 1: Add Email Notifications

**User Request**: "Add email notifications when users receive messages"

**Execution**:
1. Phase 1: Analyze requirements (notification triggers, email content, user preferences)
2. Phase 2: Impact assessment (backend: email service + database, frontend: notification preferences UI)
3. Phase 3: Technical design (email service architecture, database schema for preferences)
4. Phase 4: Implementation
   - Backend: Email service (Nodemailer), notification preferences API
   - Frontend: Preferences UI, notification settings page
5. Phase 5: Documentation (user guide: how to manage notification preferences)
6. Phase 6: Memory updates (target v1.3.0)
7. Phase 7: Return to 06-integration.md

**Version**: v1.2.5 → v1.3.0 (minor bump)

### Example 2: Add Export to PDF Feature

**User Request**: "Allow users to export reports as PDF"

**Execution**:
1. Phase 1: Analyze (which reports? PDF format requirements? file download vs email?)
2. Phase 2: Impact (backend: PDF generation library, frontend: export button)
3. Phase 3: Design (PDF generation service, temporary file storage)
4. Phase 4: Implementation
   - Backend: PDF generation service (Puppeteer or library)
   - Frontend: Export button, download handling
5. Phase 5: Documentation (user guide: how to export reports)
6. Phase 6: Memory updates (target v1.4.0)
7. Phase 7: Return to integration pipeline

**Version**: v1.3.2 → v1.4.0 (minor bump)

## Common Issues and Resolutions

**Issue**: Feature scope too large
**Resolution**: Break into multiple smaller features, create epic in .memory/release-plan.md, implement incrementally

**Issue**: Breaking changes discovered during implementation
**Resolution**: Reconsider as MAJOR version, route to 03-architecture-design.md for redesign

**Issue**: Performance concerns
**Resolution**: Add performance testing to QA phase, consider caching or optimization strategies

**Issue**: Security vulnerabilities in new feature
**Resolution**: Address in implementation phase, add security testing in QA phase

**Issue**: Backward compatibility concerns
**Resolution**: Use feature flags, versioned APIs, or graceful degradation strategies

## Success Metrics

- Feature implemented in target timeline (±20%)
- Zero critical bugs in first week after release
- User adoption >50% within first month
- Performance impact <5% degradation
- Test coverage maintained (80%+ backend, 70%+ frontend)
