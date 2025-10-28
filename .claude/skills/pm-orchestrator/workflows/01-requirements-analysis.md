# Requirements Analysis Workflow

## Overview

- **Primary Skill**: pm-orchestrator
- **Supporting Skills**: research-analysis, fullstack-integration, qa-testing, mcp-tools-orchestrator
- **Dependencies**: None (starting workflow)
- **Parallel Execution**: Can run parallel with research-analysis workflow

## Workflow Steps

### Phase 1: Memory System Initialization

**Objective**: Set up project context and memory structure

**Actions**:
1. Mention **memory-manager** skill to initialize project
2. memory-manager creates .memory/ directory with core files:
   - active-context.md (current status)
   - decisions.md (decision history)
   - collaboration.log.md (skill coordination)
   - project-state.json (comprehensive metrics)
   - session-history.json (session continuity)
3. memory-manager creates project-type-specific memory files based on project-detector results
4. memory-manager initializes logging system (.logs/)

**Success Criteria**:
- ✅ .memory/ directory exists with all core files
- ✅ Project-specific memory files created
- ✅ Logging system initialized and integrated

### Phase 2: Requirements Analysis Execution

**Objective**: Systematically analyze and document user requirements

**Actions**:
1. **Use Sequential Thinking MCP** for deep analysis:
   ```
   - Break down user request into functional requirements
   - Identify non-functional requirements (performance, security, scalability)
   - Determine project scope and boundaries
   - Assess technical complexity and feasibility
   - Identify ambiguities and assumptions
   ```

2. **Extract Key Information**:
   - Core features and functionality
   - Target users and use cases
   - Performance requirements
   - Security and compliance needs
   - Scalability expectations
   - Timeline and constraints

3. **Clarify Ambiguities** (if needed):
   - Identify unclear requirements
   - Make reasonable assumptions based on best practices
   - Document assumptions in decisions.md

### Phase 3: Cross-Skill Collaboration

**Objective**: Validate technical feasibility and gather insights

**When to Collaborate**:
- Technical feasibility questions arise
- Market intelligence needed
- Architecture complexity requires validation
- Quality requirements need clarification

**Collaboration Pattern**:
1. **Market/Technology Research**:
   - Mention **research-analysis** skill for:
     - Market landscape analysis
     - Technology stack recommendations
     - Competitive feature analysis
     - Risk assessment

2. **Technical Feasibility**:
   - Mention **fullstack-integration** skill for:
     - Architecture feasibility validation
     - Technology compatibility assessment
     - Performance feasibility analysis

3. **Quality Planning**:
   - Mention **qa-testing** skill for:
     - Testing strategy initial planning
     - Quality requirement validation
     - Accessibility considerations

**Collaboration Documentation**:
- Update .memory/collaboration.log.md with all coordination
- Record insights in .memory/decisions.md
- Track collaboration efficiency in .memory/project-state.json

### Phase 4: Documentation Creation

**Objective**: Create comprehensive requirements documentation

**Deliverables**:

1. **workspace/docs/analysis.md**:
   ```markdown
   # Project Requirements Analysis

   ## Functional Requirements
   1. [Feature 1]: [Description]
   2. [Feature 2]: [Description]
   ...

   ## Non-Functional Requirements
   - Performance: [Targets]
   - Security: [Requirements]
   - Scalability: [Goals]
   - Accessibility: [Standards]

   ## User Stories
   - As a [user type], I want [goal] so that [benefit]
   ...

   ## Technical Constraints
   - [Constraint 1]
   - [Constraint 2]

   ## Assumptions
   - [Assumption 1]: [Rationale]
   ...

   ## Out of Scope
   - [Item 1]
   - [Item 2]

   ## Risks and Mitigation
   - Risk: [Description] | Mitigation: [Strategy]
   ...
   ```

2. **workspace/backlog/epics.yaml**:
   ```yaml
   epics:
     - id: epic-001
       title: "User Authentication System"
       description: "Complete authentication with JWT, refresh tokens, password reset"
       priority: high
       estimated_complexity: medium
       user_stories:
         - "User registration with email validation"
         - "User login with JWT tokens"
         - "Password reset workflow"
       dependencies: []

     - id: epic-002
       title: "Core Feature Implementation"
       description: "Main application features"
       priority: high
       estimated_complexity: high
       dependencies: ["epic-001"]
   ```

### Phase 5: Memory System Updates

**Objective**: Update memory with requirements analysis results

**Memory Updates** (via memory-manager):

1. **Update .memory/active-context.md**:
   ```markdown
   ## Current Phase
   Phase: requirements_completed
   Progress: 15%

   ## Completed Tasks
   - ✅ Requirements analysis
   - ✅ Epic backlog creation

   ## Next Milestones
   1. Research analysis (parallel - in progress)
   2. Architecture design (after requirements)

   ## Key Requirements Summary
   - [Requirement 1]
   - [Requirement 2]
   ...
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "currentPhase": "requirements_completed",
     "progress": {
       "overall": 15,
       "phases": {
         "requirements_analysis": 100,
         "research_analysis": 50,
         "architecture_design": 0
       }
     },
     "expert_engagement_status": {
       "pm": { "status": "active", "completion": 100 },
       "research": { "status": "active", "completion": 50 }
     }
   }
   ```

3. **Update .memory/decisions.md**:
   ```markdown
   ## [YYYY-MM-DD] Requirements Analysis Decisions

   ### Scope Definition
   **Decision**: Focus on [core features] for MVP
   **Rationale**: [Explanation]
   **Alternatives Considered**: [Other approaches]
   **Impact**: Affects timeline and resource allocation

   ### Technical Constraints
   **Decision**: [Technology/approach choice]
   **Rationale**: [Why this choice]
   **Impact**: [How it affects architecture]
   ```

## Completion Criteria

**All criteria must be met before proceeding**:

- ✅ **Analysis Document Created**: workspace/docs/analysis.md exists with comprehensive requirements
- ✅ **Epic Backlog Defined**: workspace/backlog/epics.yaml with prioritized epics
- ✅ **Requirements Clarity**: No major ambiguities remaining (assumptions documented)
- ✅ **Technical Feasibility Confirmed**: Collaboration with relevant skills completed
- ✅ **Memory System Updated**: All .memory/ files reflect requirements completion
- ✅ **Quality Requirements Established**: Quality standards identified and documented

## Verification Steps

1. **Document Completeness**:
   - Confirm workspace/docs/analysis.md contains specific, actionable requirements
   - Verify workspace/backlog/epics.yaml has prioritized epic list with dependencies

2. **Context Preservation**:
   - Check .memory/active-context.md reflects requirements completion
   - Verify .memory/decisions.md contains requirement-related decisions
   - Ensure .memory/collaboration.log.md documents all skill coordination

3. **Next Steps Readiness**:
   - Confirm architecture design can proceed with clear input
   - Verify research analysis (if parallel) has necessary context

## Next Workflows

**Sequential**:
→ **03-architecture-design.md**: System architecture and API design

**Parallel** (can continue):
→ **02-research-analysis.md**: Market and technology research (if running parallel)

## Common Issues and Resolutions

**Issue**: Requirements too vague
**Resolution**: Use Sequential Thinking MCP for deeper analysis, make documented assumptions

**Issue**: Unclear technical feasibility
**Resolution**: Mention fullstack-integration skill for architecture feasibility check

**Issue**: Missing quality requirements
**Resolution**: Mention qa-testing skill for quality planning consultation

**Issue**: Market context needed
**Resolution**: Mention research-analysis skill for competitive analysis

## Output Example

**Success Output**:
```
Requirements Analysis Completed
================================

✅ Analysis Document: workspace/docs/analysis.md (25 requirements identified)
✅ Epic Backlog: workspace/backlog/epics.yaml (8 epics prioritized)
✅ Technical Feasibility: Validated with fullstack-integration skill
✅ Quality Requirements: Performance targets established
✅ Memory System: Updated with requirements context

Key Decisions:
- Scope: MVP focused on core features (auth + main functionality)
- Technology: Aligned with project-detector recommendations
- Quality: Web app standards (TypeScript 95%, Core Web Vitals compliant)

Next Steps:
→ Architecture design workflow starting
→ Research analysis continues in parallel
```
