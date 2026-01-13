---
name: research-analysis
version: "1.0.0"
description: |
  Strategic research and technology evaluation specialist for data-driven decision making.

  This skill is automatically invoked when:
  - User mentions: "research", "evaluate", "compare", "analyze", "benchmark", "best practice", "market"
  - Project requires: Technology evaluation, competitive analysis, architecture research, risk assessment
  - Context involves: Framework comparison, market positioning, vendor selection, performance benchmarks

  Core expertise:
  - Technology stack evaluation (framework comparison, performance benchmarks)
  - Market intelligence (competitive landscape, user research, market trends)
  - Architecture pattern research (design patterns, scalability analysis)
  - Risk assessment (technical and business risks, mitigation strategies)
  - Vendor/service selection (payment processors, cloud platforms, APIs)
  - GitHub repository research (similar projects, code patterns, examples)
  - Data-driven recommendations (evidence-based strategic decisions)
  - Documentation research (official docs, community resources)

  Technology stack:
  - Context7 MCP (library documentation)
  - GitHub MCP (repository research, code examples)
  - Sequential Thinking MCP (deep analysis)
  - Comparative analysis frameworks
  - Risk assessment matrices

  Related skills: pm-orchestrator (strategic decisions), fullstack-integration (architecture), all domain skills (technology consumers)

category: domain

triggers:
  keywords:
    - "research"
    - "evaluate"
    - "compare"
    - "analyze"
    - "benchmark"
    - "best practice"
    - "market"
    - "competitive"
  file_patterns:
    - "workspace/docs/research/**/*"
  project_types:
    - "web_application"
    - "api_microservice"
    - "ai_ml_system"
    - "mobile_application"
  explicit_mention: false

inputs:
  required:
    - name: "research_topic"
      type: "string"
      description: "Topic or question to research"
  optional:
    - name: "constraints"
      type: "string"
      description: "Constraints or requirements for the research"

outputs:
  artifacts:
    - name: "research_report"
      type: "directory"
      path: "workspace/docs/research/"
  memory_updates:
    - ".memory/core/decisions.md"

dependencies:
  skills:
    - skill: "pm-orchestrator"
      relationship: "serves"
      reason: "Provides research for strategic decisions"
  workflows: []
  memory_files:
    - ".memory/core/project.json"

risk_level: low
execution_mode: autonomous
parallel_safe: true
idempotent: true

allowed-tools:
  - Read
  - Write
  - Edit
  - mcp__github__*
  - mcp__context7__*
  - mcp__sequential-thinking__sequentialthinking
---

# Research Analysis - Strategic Research Specialist

**CRITICAL**: Conduct comprehensive research to inform strategic decisions.

## Core Responsibilities

**CRITICAL**: All research documentation MUST be placed in `workspace/docs/research/` directory.

- **GitHub Repository Research**: Similar projects, code patterns, implementation examples
- **Technology Stack Analysis**: Framework comparisons, performance benchmarks, compatibility
- **Market Intelligence**: Competitive landscape, user experience, market trends
- **Risk Assessment**: Technical and business risk identification with mitigation
- **Architecture Pattern Research**: Design patterns, scalability analysis, best practices
- **Strategic Recommendations**: Data-driven insights for decisions

**Research Directory Structure**:
```
workspace/docs/research/
├── market-analysis/
│   ├── competitive-landscape.md
│   ├── user-research.md
│   └── market-trends.md
├── technology/
│   ├── tech-stack-evaluation.md
│   ├── framework-comparison.md
│   └── performance-benchmarks.md
├── architecture/
│   ├── design-patterns.md
│   ├── scalability-analysis.md
│   └── best-practices.md
├── risks/
│   ├── technical-risks.md
│   ├── business-risks.md
│   └── mitigation-strategies.md
├── implementation/
│   ├── methodology.md
│   └── roadmap.md
└── reports/
    ├── research-summary.md
    └── executive-brief.md
```

## Deep Thinking Protocol

**MANDATORY REQUIREMENT**: research-analysis MUST use Sequential Thinking MCP + ultrathink for ALL strategic research and technology evaluation decisions. Research quality determines success or failure of project-wide technology choices and strategic directions.

### Why MANDATORY for Research Analysis

Research Analysis provides the **evidence foundation for strategic decisions** that affect entire project direction and long-term viability. Wrong technology selections or poor market positioning based on shallow research lead to catastrophic project failures months down the line. These decisions cannot be fixed through iteration—they require thorough, evidence-based analysis upfront.

**Impact**: Poor research leading to wrong technology choice can make project requirements impossible to meet, requiring complete system redesign and 3-6 month delays.

### When to Apply Deep Thinking

**ALWAYS Required for**:
- **Technology Stack Evaluation**: Primary framework, backend platform, database selection for production system
- **Market Positioning Strategy**: Target audience, competitive differentiation, go-to-market approach
- **Framework Comparison for Critical Components**: State management, authentication, real-time communication libraries
- **Cloud Platform Selection**: AWS vs Azure vs GCP, deployment architecture decisions
- **Architecture Pattern Evaluation**: Microservices vs monolith, serverless vs traditional, edge computing
- **Vendor/Service Selection**: Payment processors, analytics platforms, infrastructure providers (long-term commitment)
- **Major Library/Tool Adoption**: Core dependencies that affect entire codebase architecture
- **Security Framework Selection**: Authentication systems, encryption libraries, security architectures
- **Data Storage Strategy**: Database architecture, caching strategies, data warehousing approaches
- **Performance Optimization Strategy**: CDN selection, caching layers, optimization techniques

**Standard Protocol Exemptions**:
- Supplementary library research (non-critical dependencies)
- Documentation lookup for well-established technologies
- Minor tool comparisons with easy reversibility

### Deep Thinking Application Protocol

Follow the 5-Phase approach with Research-specific focus:

#### 1. Problem Framing (1-2 thoughts)
**Research-specific questions**:
- What strategic decision depends on this research?
- What are the evidence requirements (quantitative data, benchmarks, user feedback)?
- What is the time horizon for this decision (1 year, 3 years, 5+ years)?
- What are the costs of being wrong (switching costs, technical debt)?
- Who are the stakeholders affected by this research?
- What level of confidence is required for decision-making?

#### 2. Alternative Generation (2-4 thoughts)
**Research-specific alternatives**:
- Identify 3-5 viable options through GitHub MCP repository research
- For each option, collect evidence from multiple sources:
  - Official documentation (Context7 MCP)
  - Community adoption metrics (GitHub stars, npm downloads, PyPI stats)
  - Real-world implementations (GitHub code search)
  - Performance benchmarks (published studies, vendor claims)
  - Community sentiment (issue quality, response times, community health)
- Document evidence quality: Primary source vs secondary, quantitative vs qualitative

#### 3. Multi-Dimensional Evaluation (3-6 thoughts)
**Research-specific evaluation dimensions**:
- **Market Fit** (20%): Aligns with target audience needs, competitive positioning strength
- **Technology Maturity** (20%): Production-readiness, stability, breaking change frequency
- **Community Support** (15%): Active maintenance, documentation quality, ecosystem size
- **Performance** (15%): Benchmarks vs alternatives, scalability evidence
- **Cost** (15%): Licensing, infrastructure, learning curve (team productivity impact)
- **Risk** (15%): Vendor stability, long-term viability, migration difficulty

**Evidence Quality Weighting**:
- Primary sources (official docs, benchmarks): 100% weight
- Secondary sources (blog posts, tutorials): 50% weight
- Tertiary sources (opinions, anecdotes): 25% weight

**Confidence Level Specification**:
- **High Confidence** (>80%): Multiple primary sources, quantitative data, proven in production
- **Medium Confidence** (50-80%): Mixed sources, some quantitative data, emerging adoption
- **Low Confidence** (<50%): Limited evidence, qualitative only, unproven at scale

#### 4. Decision Synthesis (2-3 thoughts)
**Research-specific criteria**:
- Evidence must support decision with high/medium confidence (document assumptions if low)
- Consider 3-year Total Cost of Ownership (TCO): licensing + infrastructure + team training + maintenance
- Evaluate vendor lock-in risk and exit strategy
- Balance cutting-edge vs proven-stable based on project risk tolerance
- Identify decision sensitivity: Which factors would change recommendation if values shifted?

Document recommendation with confidence level and key assumptions.

#### 5. Implementation Strategy (2-4 thoughts)
**Research-specific considerations**:
- Plan Proof-of-Concept (POC) if Medium/Low confidence on critical factor
- Document technology adoption roadmap (learning, POC, pilot, production)
- Establish monitoring metrics for validating research predictions
- Define fallback strategy if chosen option fails expectations
- Create knowledge transfer plan for team adoption

**Expected Thought Investment**: 15-25 thoughts for typical Research Analysis decisions

### Documentation Requirements

All decisions MUST be documented in `.memory/decisions.md` AND comprehensive research report in `workspace/docs/research/[topic].md`. See CLAUDE.md Deep Thinking Protocol section for full template.

**Research Report Template** (workspace/docs/research/):
```markdown
# [Technology/Strategy] Research Report

## Executive Summary
- **Recommendation**: [Primary choice]
- **Confidence**: [High/Medium/Low]
- **Key Rationale**: [1-2 sentences]

## Research Scope
- **Decision Context**: [What decision depends on this]
- **Alternatives Evaluated**: [List of options]
- **Evidence Sources**: [GitHub, Context7, benchmarks, etc.]
- **Research Date**: [YYYY-MM-DD]

## Detailed Analysis
### Option 1: [Name]
- **Evidence**: [Sources and data]
- **Pros**: [Strengths with evidence]
- **Cons**: [Weaknesses with evidence]
- **Evaluation Score**: [X/100]

[Repeat for each option]

## Decision Matrix
[Evaluation matrix with scores across dimensions]

## Recommendation
**Selected**: [Choice]
**Rationale**: [Detailed justification with evidence citations]
**Confidence**: [High/Medium/Low] - [Reasoning]

## Implementation Plan
- **POC Required**: [Yes/No]
- **Adoption Roadmap**: [Steps]
- **Success Metrics**: [How to validate]
- **Fallback Strategy**: [If recommendation fails]

## Assumptions and Risks
- **Key Assumptions**: [What we're assuming is true]
- **Risks**: [What could go wrong]
- **Mitigation**: [How to reduce risk]
```

### Domain-Specific Examples

#### Example 1: Frontend Framework Selection for Enterprise SaaS

**Problem**: Select frontend framework for multi-tenant enterprise SaaS platform (5-year commitment)

**Complexity**: Very High (5 indicators: Multiple approaches, Long-term implications, Performance critical, Cross-skill dependencies, High cost of failure)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements framing - Enterprise SSO, complex forms, real-time collaboration, sub-second interactivity, 5-year support horizon
- Thoughts 3-7: Alternatives - React + framework (Next.js, Remix), Vue 3 (Nuxt), Svelte (SvelteKit), Angular 17
- Thoughts 8-16: Evidence collection - npm downloads, GitHub adoption (Context7 MCP), enterprise adoption patterns (GitHub code search), performance benchmarks, TypeScript quality, SSR capabilities
- Thoughts 17-20: Multi-dimensional evaluation with evidence weighting
- Thoughts 21-23: Decision synthesis with 3-year TCO analysis
- Thoughts 24-27: POC plan for top 2 choices, adoption roadmap

**Decision**: Next.js 15 with React 19

**Rationale**: **Evidence Quality: High Confidence (85%)**
- Market fit: Enterprise adoption by Vercel, Netflix, TikTok proves scalability (primary source: Vercel showcase)
- Technology maturity: React 19 stable, Next.js 15 production-ready, 7-year track record
- Community: 120K+ GitHub stars, 7M+ weekly npm downloads, comprehensive ecosystem
- Performance: Server Components enable <1s LCP (benchmark: Vercel Edge Network)
- Cost: Zero licensing, Vercel free tier for POC, strong TypeScript support reduces bugs (-40%)
- Risk: Vercel-backed with $300M funding, large community reduces vendor lock-in

**Alternative Considered**: Remix scored 75/100 (newer, smaller ecosystem) vs Next.js 88/100

**Impact**: POC validated <1s load times. Production achieved 95+ Lighthouse score. Zero framework-related blockers in 18 months. Team productivity +30% vs previous jQuery project.

#### Example 2: Database Selection for Real-time Collaboration App

**Problem**: Choose database for real-time collaborative document editing (100 concurrent users per document)

**Complexity**: Very High (4 indicators: Multiple approaches, Long-term implications, Performance critical, Novel domain requirements)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements - <100ms read latency, ACID transactions, real-time subscriptions, horizontal scaling to 10K users
- Thoughts 3-6: Alternatives - PostgreSQL + pg_notify, MongoDB + Change Streams, Supabase (PostgreSQL + Realtime), Firebase Realtime DB, Redis + PostgreSQL hybrid
- Thoughts 7-14: Evidence collection - Latency benchmarks (GitHub research), scaling case studies (Context7 docs), cost analysis, operational complexity
- Thoughts 15-18: Multi-dimensional evaluation with confidence levels
- Thoughts 19-21: Decision synthesis with vendor stability analysis
- Thoughts 22-25: Migration strategy and fallback plan

**Decision**: PostgreSQL 16 + Supabase Realtime

**Rationale**: **Evidence Quality: High Confidence (90%)**
- Performance: PostgreSQL <50ms queries at 10K QPS (benchmark: pgbench results), Supabase Realtime <100ms push latency (primary source: Supabase docs)
- Scalability: Horizontal read replicas proven to 1M concurrent connections (case study: Instagram on PostgreSQL)
- Technology maturity: PostgreSQL 30+ year track record, ACID compliance battle-tested
- Cost: Supabase free tier for POC, $25/month for production start, predictable scaling
- Community: 13K+ GitHub stars (Supabase), massive PostgreSQL ecosystem
- Risk: Open source (PostgreSQL), self-hostable (Supabase), no vendor lock-in

**Alternatives Considered**: Firebase (90/100 score, but vendor lock-in concern), MongoDB (70/100, weaker ACID)

**Impact**: POC achieved 45ms average latency. Production scaled to 500 concurrent users per document. Zero data loss incidents. Cost $50/month at 5K users (vs Firebase projected $800/month).

### Quality Validation

After Deep Thinking, validate:
- [ ] 3-5 alternatives evaluated with evidence from multiple sources
- [ ] Evidence quality documented (primary/secondary/tertiary sources)
- [ ] Confidence level specified (High/Medium/Low) with justification
- [ ] 3-year TCO calculated for major technology decisions
- [ ] Quantitative data collected (performance benchmarks, adoption metrics)
- [ ] Vendor stability and exit strategy evaluated
- [ ] POC plan established if Medium/Low confidence on critical factors

Coordinate with **pm-orchestrator** for strategic alignment and **quality-controller** for research quality standards.

### Integration with Research Workflow

**Deep Thinking checkpoints**:
- **Technology Stack Evaluation** (Workflow 02): Framework selection (MANDATORY), Database choice (MANDATORY), Cloud platform (MANDATORY)
- **Architecture Pattern Research**: Design patterns (MANDATORY if novel), Scalability approach (MANDATORY if high-scale)
- **Market Intelligence**: Competitive positioning (MANDATORY), Target audience validation (STRONGLY RECOMMENDED)
- **Risk Assessment**: Technical risks (MANDATORY for critical components), Business risks (MANDATORY for strategic decisions)
- **Vendor/Service Selection**: Long-term commitment services (MANDATORY), Supplementary tools (CONDITIONAL)

**Critical**: Do not proceed with major technology recommendations without Deep Thinking validation. Research quality determines project success.

### Success Metrics

Track in `.memory/metrics.md`:
- Research accuracy: Target >85% (% of recommendations meeting expectations after 6 months)
- Confidence calibration: High confidence predictions should succeed >85%, Medium >70%, Low >50%
- Evidence quality: Target >70% primary sources for MANDATORY decisions
- Recommendation adoption rate: Target >80% (research recommendations accepted by team)
- Decision revision rate: Target <15% (% of research decisions changed later)

## Research Tools

- **GitHub MCP**: Repository analysis, code pattern research
- **Context7 MCP**: Official documentation, API references
- **Sequential Thinking MCP**: Complex analysis coordination

## Research Deliverables

Creates comprehensive research documentation in `workspace/docs/research/`:
- `workspace/docs/research/market-analysis/`: Competitive landscape and positioning
- `workspace/docs/research/technology/`: Technology evaluation and recommendations
- `workspace/docs/research/architecture/`: Design patterns and approaches
- `workspace/docs/research/risks/`: Risk analysis and mitigation
- `workspace/docs/research/implementation/`: Development methodology recommendations
- `workspace/docs/research/reports/research-summary.md`: Executive summary and roadmap

**Note**: Research summaries are also stored in `.memory/research-findings.md` for quick reference, but full research documentation lives in `workspace/docs/research/`.

## Research Workflow

1. **Scope Definition**: Define research questions and objectives
2. **Data Collection**: GitHub repos, documentation, industry reports
3. **Analysis**: Comparative analysis, benchmarking, trend identification
4. **Validation**: Cross-expert verification of findings
5. **Documentation**: Comprehensive research reports
6. **Recommendations**: Actionable strategic insights

## Related Skills

- **pm-orchestrator**: Strategic alignment and priority setting
- **fullstack-integration**: Architecture feasibility validation
- **systemdev-specialist**: Specialized technology research
- **quality-controller**: Quality benchmark research

## Examples

The following examples demonstrate comprehensive research methodologies using multiple MCP tools:

### 01. Technology Stack Research
**File**: `examples/01-technology-stack-research.md`
**Demonstrates**: Evaluating technology options using GitHub MCP (repository analysis), Context7 MCP (documentation research), and WebSearch (benchmarks and community sentiment) to make informed architectural decisions.

### 02. Competitive Analysis
**File**: `examples/02-competitive-analysis.md`
**Demonstrates**: Comprehensive competitive analysis using WebSearch for market data, GitHub MCP for technical analysis, and Playwright MCP for UX research to understand competitive landscape and identify differentiation opportunities.

### 03. Risk Assessment
**File**: `examples/03-risk-assessment.md`
**Demonstrates**: Technology risk assessment covering technical risks (scalability, performance), security risks (vulnerabilities, compliance), business risks (vendor stability, licensing), and operational risks (availability, support).

## Using These Examples

Each example demonstrates multi-source research patterns combining GitHub MCP, Context7 MCP, WebSearch, and Sequential Thinking MCP for comprehensive, evidence-based analysis.

Refer to reference.md for complete research analysis guidelines.

---

## Enterprise Standards Compliance

This skill follows team-wide enterprise standards.

**Required References** (`../ENTERPRISE-STANDARDS.md`):
- [Documentation Standards](../ENTERPRISE-STANDARDS.md#documentation-standards) - Research report formatting, evidence documentation
- [Logging Standards](../ENTERPRISE-STANDARDS.md#logging-standards) - Research decision logging
- [Git Conventions](../ENTERPRISE-STANDARDS.md#git-conventions) - Research artifact commits
- [Code Conventions](../ENTERPRISE-STANDARDS.md#code-conventions) - Consistent naming in research outputs

**Domain-Specific Standards** (see Deep Thinking Protocol section in this document):
- 3-5 alternatives evaluated with evidence for major decisions
- Evidence quality documented (primary/secondary/tertiary sources)
- Confidence level specified (High/Medium/Low) with justification
- 3-year TCO calculated for major technology decisions
- POC plan established if Medium/Low confidence on critical factors
