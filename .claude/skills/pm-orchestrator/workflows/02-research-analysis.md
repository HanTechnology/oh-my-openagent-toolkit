# Research Analysis Workflow

## Overview

- **Primary Skill**: research-analysis
- **Supporting Skills**: pm-orchestrator, fullstack-integration, systemdev-specialist
- **Dependencies**: None (can run parallel with requirements-analysis)
- **Parallel Execution**: Can run alongside requirements analysis workflow

## Workflow Steps

### Phase 1: Research Scope Definition

**Objective**: Define research questions and objectives

**Actions**:
1. **Use Sequential Thinking MCP** for research planning:
   ```
   - Define key research questions from project requirements
   - Identify target markets and user segments
   - Determine competitive landscape scope
   - Identify technology evaluation criteria
   - Plan research methodology
   ```

2. **Extract Research Requirements**:
   - Market intelligence needs
   - Technology stack evaluation criteria
   - Competitive analysis requirements
   - Architecture pattern research needs
   - Risk assessment scope

### Phase 2: GitHub Repository Research

**Objective**: Analyze similar projects and implementation patterns

**Actions**:
1. **Use GitHub MCP** for repository analysis:
   - Search for similar projects: `mcp__github__search_repositories`
   - Analyze code patterns and architecture
   - Study implementation examples
   - Review best practices and common patterns
   - Identify proven solutions

2. **Extract Implementation Insights**:
   - Common architecture patterns
   - Popular library and framework choices
   - Performance optimization techniques
   - Security implementation patterns
   - Testing strategies used

### Phase 3: Technology Stack Analysis

**Objective**: Evaluate and compare technology options

**Actions**:
1. **Use Context7 MCP** for official documentation:
   - Research recommended frameworks
   - Study API references and capabilities
   - Compare framework features
   - Analyze performance benchmarks
   - Review compatibility requirements

2. **Technology Evaluation Matrix**:
   - Framework comparison (performance, community, maintenance)
   - Library ecosystem assessment
   - Integration capabilities
   - Learning curve and developer experience
   - Long-term viability and support

3. **Performance Benchmarking**:
   - Framework performance metrics
   - Scalability characteristics
   - Resource utilization patterns
   - Production deployment experiences

### Phase 4: Market Intelligence and Competitive Analysis

**Objective**: Understand market landscape and positioning

**Actions**:
1. **Market Landscape Analysis**:
   - Target user segment identification
   - Market size and opportunity assessment
   - User needs and pain points
   - Market trends and future directions

2. **Competitive Analysis**:
   - Identify direct and indirect competitors
   - Analyze competitor features and positioning
   - Study user experience and feedback
   - Identify differentiation opportunities
   - Assess competitive advantages

3. **Feature Prioritization Insights**:
   - Must-have features (table stakes)
   - Competitive differentiators
   - Innovation opportunities
   - User value analysis

### Phase 5: Architecture Pattern Research

**Objective**: Research proven architecture patterns and design approaches

**Actions**:
1. **Design Pattern Research**:
   - System architecture patterns
   - Microservices vs monolith evaluation
   - State management patterns
   - Data flow architectures
   - Integration patterns

2. **Scalability Analysis**:
   - Horizontal vs vertical scaling approaches
   - Caching strategies
   - Database scaling patterns
   - Load balancing techniques
   - Performance optimization patterns

3. **Security Architecture**:
   - Authentication and authorization patterns
   - API security best practices
   - Data encryption standards
   - Security compliance requirements

### Phase 6: Risk Assessment

**Objective**: Identify technical and business risks with mitigation strategies

**Actions**:
1. **Technical Risk Analysis**:
   - Technology maturity and stability risks
   - Integration complexity risks
   - Performance and scalability risks
   - Security and compliance risks
   - Technical debt potential

2. **Business Risk Analysis**:
   - Market timing and competition risks
   - Resource and timeline risks
   - User adoption risks
   - Regulatory and compliance risks

3. **Mitigation Strategy Development**:
   - Risk probability and impact assessment
   - Mitigation approach for each risk
   - Contingency planning
   - Risk monitoring metrics

### Phase 7: Cross-Skill Collaboration for Validation

**Objective**: Validate research findings with technical experts

**When to Collaborate**:
- Architecture feasibility needs validation
- Technology choices require technical confirmation
- System requirements need specialized expertise

**Collaboration Pattern**:
1. **Architecture Validation**:
   - Mention **fullstack-integration** skill for:
     - System architecture feasibility
     - Integration pattern validation
     - Technology compatibility confirmation

2. **Specialized Technology Validation**:
   - Mention **systemdev-specialist** skill for:
     - AI/ML technology validation
     - GPU/high-performance computing assessment
     - Video processing technology evaluation

3. **Collaboration Documentation**:
   - Update .memory/collaboration.log.md with expert consultations
   - Record validation results in research documents
   - Track collaboration effectiveness

### Phase 8: Research Documentation Creation

**Objective**: Create comprehensive research deliverables

**Deliverables**:

1. **.memory/market-analysis.md**:
   ```markdown
   # Market Analysis

   ## Market Landscape Overview
   - Market size and growth trends
   - Target user segments and personas
   - Market opportunities and gaps

   ## Competitive Positioning
   - Direct competitors analysis
   - Indirect competitors and alternatives
   - Competitive advantages and differentiators

   ## User Analysis
   - Target user needs and pain points
   - User experience expectations
   - Feature priorities from user perspective

   ## Market Trends
   - Emerging trends and technologies
   - Future market directions
   - Strategic positioning recommendations
   ```

2. **.memory/tech-stack-analysis.md**:
   ```markdown
   # Technology Stack Analysis

   ## Technology Comparison Matrix
   | Technology | Performance | Community | Maturity | Fit Score |
   |------------|-------------|-----------|----------|-----------|
   | [Tech 1]   | [Rating]    | [Rating]  | [Rating] | [Score]   |

   ## Recommended Technology Stack
   - Frontend: [Technology + Rationale]
   - Backend: [Technology + Rationale]
   - Database: [Technology + Rationale]
   - Infrastructure: [Technology + Rationale]

   ## Performance Benchmarks
   - [Benchmark 1]: [Results and analysis]
   - [Benchmark 2]: [Results and analysis]

   ## Integration Capabilities
   - API compatibility analysis
   - Ecosystem integration assessment
   - Third-party service compatibility
   ```

3. **.memory/architecture-patterns.md**:
   ```markdown
   # Architecture Patterns Research

   ## Recommended Architecture Patterns
   - **Pattern**: [Name]
   - **Use Case**: [When to use]
   - **Benefits**: [Advantages]
   - **Trade-offs**: [Considerations]

   ## Scalability Considerations
   - Horizontal scaling approach
   - Caching strategy recommendations
   - Database optimization patterns

   ## Security Architecture
   - Authentication pattern: [Recommendation]
   - Authorization approach: [Recommendation]
   - Data security: [Best practices]

   ## Implementation Best Practices
   - [Best practice 1]
   - [Best practice 2]
   - Code examples and references
   ```

4. **.memory/risk-assessment.md**:
   ```markdown
   # Risk Assessment

   ## Technical Risks
   - **Risk**: [Description]
   - **Probability**: [High/Medium/Low]
   - **Impact**: [High/Medium/Low]
   - **Mitigation**: [Strategy]

   ## Business Risks
   - **Risk**: [Description]
   - **Mitigation**: [Strategy]

   ## Timeline and Resource Risks
   - [Risk and mitigation]

   ## Technology and Market Risks
   - [Risk and mitigation]
   ```

5. **.memory/implementation-options.md**:
   ```markdown
   # Implementation Options

   ## Development Methodology
   - Recommended approach: [Agile/Scrum/Kanban/etc.]
   - Sprint planning recommendations
   - Development workflow suggestions

   ## Testing and Quality Assurance Strategy
   - Testing pyramid approach
   - Automation strategy
   - Quality gates and metrics

   ## Deployment and DevOps Approach
   - CI/CD recommendations
   - Infrastructure approach
   - Monitoring and observability

   ## Team Structure and Skills
   - Required skill sets
   - Team organization recommendations
   - Knowledge transfer needs
   ```

6. **.memory/research-summary.md**:
   ```markdown
   # Research Summary - Executive Overview

   ## Key Findings
   1. [Key finding 1]
   2. [Key finding 2]
   3. [Key finding 3]

   ## Strategic Recommendations
   - **Technology Stack**: [Recommendation with rationale]
   - **Architecture Approach**: [Recommendation with rationale]
   - **Market Positioning**: [Recommendation with rationale]

   ## Implementation Roadmap
   1. **Phase 1**: [Description]
   2. **Phase 2**: [Description]
   3. **Phase 3**: [Description]

   ## Success Metrics
   - [Metric 1]: [Target]
   - [Metric 2]: [Target]

   ## Next Steps and Decision Points
   - [Next step 1]
   - [Decision point 1]

   ## Critical Success Factors
   - [Factor 1]
   - [Factor 2]
   ```

### Phase 9: Memory System Updates

**Objective**: Update memory with research completion status

**Memory Updates**:

1. **Update .memory/active-context.md**:
   ```markdown
   ## Current Phase
   Phase: research_completed
   Progress: 25%

   ## Completed Tasks
   - ✅ Requirements analysis
   - ✅ Research analysis

   ## Next Milestones
   1. Architecture design (ready to start)
   2. Implementation planning

   ## Key Research Insights
   - Technology Stack: [Recommendation]
   - Architecture: [Approach]
   - Key Risks: [Summary]
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "currentPhase": "research_completed",
     "progress": {
       "overall": 25,
       "phases": {
         "requirements_analysis": 100,
         "research_analysis": 100,
         "architecture_design": 0
       }
     },
     "expert_engagement_status": {
       "pm": { "status": "active", "completion": 100 },
       "research": { "status": "completed", "completion": 100 }
     }
   }
   ```

3. **Update .memory/decisions.md**:
   ```markdown
   ## [YYYY-MM-DD] Research Analysis Decisions

   ### Technology Stack Selection
   **Decision**: Use [technology stack]
   **Rationale**: [Research-based reasoning]
   **Alternatives Considered**: [Other options evaluated]
   **Impact**: Affects architecture, development speed, scalability

   ### Architecture Pattern Choice
   **Decision**: [Architecture pattern]
   **Rationale**: [Why this pattern fits best]
   **Impact**: System design, scalability, maintainability

   ### Risk Mitigation Priorities
   **Decision**: Focus on [priority risks]
   **Rationale**: [Why these risks matter most]
   **Impact**: Development approach, testing strategy
   ```

## Completion Criteria

**All criteria must be met before proceeding**:

- ✅ **Market Analysis Complete**: .memory/market-analysis.md with competitive landscape
- ✅ **Technology Stack Evaluated**: .memory/tech-stack-analysis.md with recommendations
- ✅ **Architecture Patterns Researched**: .memory/architecture-patterns.md with best practices
- ✅ **Risk Assessment Complete**: .memory/risk-assessment.md with mitigation strategies
- ✅ **Implementation Options Documented**: .memory/implementation-options.md with methodology
- ✅ **Research Summary Created**: .memory/research-summary.md with executive overview
- ✅ **Expert Validation**: Collaboration with technical experts completed
- ✅ **Memory System Updated**: All .memory/ files reflect research completion

## Verification Steps

1. **Research Completeness**:
   - Confirm all research documents contain actionable insights
   - Verify technology recommendations are well-justified
   - Check risk assessment covers all major risks

2. **Context Preservation**:
   - Check .memory/active-context.md reflects research completion
   - Verify .memory/decisions.md contains research-based decisions
   - Ensure .memory/collaboration.log.md documents expert consultations

3. **Next Steps Readiness**:
   - Confirm architecture design can proceed with research inputs
   - Verify implementation team has necessary technology context

## Next Workflows

**Sequential**:
→ **03-architecture-design.md**: System architecture design with research insights

**Parallel** (may already be complete):
→ **01-requirements-analysis.md**: Requirements analysis (if running parallel)

## Common Issues and Resolutions

**Issue**: Insufficient market data available
**Resolution**: Use GitHub MCP for code pattern analysis, extrapolate from similar projects

**Issue**: Technology options too numerous to evaluate
**Resolution**: Use Sequential Thinking MCP to create evaluation criteria matrix, focus on top 3-5 options

**Issue**: Conflicting expert opinions on technology choices
**Resolution**: Document all perspectives in .memory/decisions.md, make data-driven decision based on project requirements

**Issue**: Risk assessment too generic
**Resolution**: Mention fullstack-integration or systemdev-specialist for specific technical risk validation

## Output Example

**Success Output**:
```
Research Analysis Completed
============================

✅ Market Analysis: .memory/market-analysis.md (5 competitors analyzed, 3 user segments identified)
✅ Technology Stack: .memory/tech-stack-analysis.md (Next.js 15.5+ + Nest.js recommended)
✅ Architecture Patterns: .memory/architecture-patterns.md (Microservices + Event-driven recommended)
✅ Risk Assessment: .memory/risk-assessment.md (8 risks identified, all mitigated)
✅ Implementation Options: .memory/implementation-options.md (Agile methodology recommended)
✅ Research Summary: .memory/research-summary.md (Executive overview complete)

Key Recommendations:
- Technology: Next.js 15.5+ frontend, Nest.js backend, PostgreSQL database
- Architecture: Modular monolith with microservices-ready design
- Market: Target B2B SaaS market, focus on enterprise features

Next Steps:
→ Architecture design workflow starting with research insights
```
