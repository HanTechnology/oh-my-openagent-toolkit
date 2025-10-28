# MCP Tools Orchestrator - Technical Reference

> **Purpose**: Technical reference for the mcp-tools-orchestrator skill in the autonomous skills-based development system.
> **Related Skills**: All skills (provides advanced MCP tool support)
> **Examples**: See examples/ directory for advanced MCP tool coordination patterns.

---

## MCP Tools Orchestrator Guidelines

### Core Responsibilities

**Advanced Tool Coordination**
- Complex multi-tool scenarios requiring 3+ MCP tools simultaneously
- Tool performance optimization and efficiency improvement
- Pattern development for reusable MCP coordination
- Troubleshooting MCP tool issues and integration problems
- Expert tool support for other skills
- Cross-tool integration strategies

### Two-Level MCP Usage System

**Level 1: Autonomous Usage (All Skills)**
- Single tool operations
- Basic MCP functions
- Individual skill scope
- No orchestrator needed

All skills can autonomously use:
- Context7 MCP (documentation)
- Sequential Thinking MCP (analysis)

Skill-specific autonomous tools:
- frontend-nextjs: GitHub MCP, Playwright MCP (basic)
- backend-nestjs: GitHub MCP, Context7 MCP (advanced)
- research-analysis: GitHub MCP, Context7 MCP, Sequential Thinking MCP
- qa-testing: Playwright MCP (expert), GitHub MCP

**Level 2: Orchestrator Coordination**
- Multi-tool combinations (3+ tools)
- Advanced usage patterns
- Complex cross-tool scenarios
- Performance optimization
- New pattern development

### Orchestrator Invocation Triggers

Other skills request orchestrator when:
- 3+ simultaneous MCP tools needed
- New usage pattern development required
- MCP performance optimization needed
- Project-wide MCP strategy coordination

---

## Production Examples

This skill provides advanced MCP tool orchestration patterns in the `examples/` directory:

### Available Examples

#### 01. Multi-Tool Research Pattern (`examples/01-multi-tool-research-pattern.md`)
- **Demonstrates**: Orchestrating GitHub MCP, Context7 MCP, WebSearch, and Playwright MCP together
- **Key Patterns**: Parallel execution, sequential chaining, conditional branching, multi-source validation
- **Integration**: Comprehensive research workflows combining multiple tools
- **Technologies**: GitHub MCP, Context7 MCP, WebSearch, Playwright MCP, Sequential Thinking MCP
- **Use when**: Complex research requiring multiple data sources and validation

#### 02. Advanced Testing Pattern (`examples/02-advanced-testing-pattern.md`)
- **Demonstrates**: Coordinating Playwright MCP with GitHub MCP and IDE MCP
- **Key Patterns**: Automated failure analysis, GitHub issue creation, PR commenting, auto-fix suggestions
- **Integration**: Intelligent test orchestration with feedback loops
- **Technologies**: Playwright MCP, GitHub MCP, IDE MCP integration
- **Use when**: Advanced testing workflows with automated reporting and fixing

### Using These Examples
- Examples represent meta-level patterns for multi-tool coordination
- Use when individual tool usage is insufficient
- Complex multi-tool coordination examples
- Production-ready orchestration patterns

---

## MCP Tool Categories

### Research & Documentation
**Context7 MCP**: Latest documentation, API references, framework guides
- Official documentation lookup
- Framework best practices
- API reference materials
- Integration patterns

**GitHub MCP**: Code examples, implementation patterns, repository analysis
- Similar project research
- Code pattern discovery
- Repository structure analysis
- Contribution patterns

### Analysis & Planning
**Sequential Thinking MCP**: Step-by-step analysis, complex problem solving
- Multi-step problem decomposition
- Systematic analysis workflows
- Complex decision-making
- Architecture planning

### Testing & Validation
**Playwright MCP**: Browser automation, E2E testing, UI validation
- CRITICAL: MCP ONLY (NO external packages)
- End-to-end testing
- Cross-browser validation
- Performance measurement
- Accessibility testing

---

## MCP Tool Specifications

### Sequential Thinking MCP

**Utilization Points**
- Complex requirement analysis
- Multi-step problem solving
- Architecture design
- Performance optimization strategy

**Main Uses**
- Step-by-step thinking for complex website structure design
- Logical structure analysis of multi-page sites
- Systematic approach for optimization strategy
- Converting user requirements to functional specifications

**Automatic Utilization Conditions**
- Requirements include 3+ complex features
- Multi-page structure design needed
- Performance optimization strategy required
- Complex architecture design

---

### Context7 MCP

**Utilization Points**
- Official documentation lookup
- Framework best practices research
- API reference materials
- Technology evaluation

**Main Uses**
- Next.js/React documentation reference
- NestJS/TypeORM documentation lookup
- Database pattern research
- Framework integration best practices
- Latest API references

**Automatic Utilization Conditions**
- Framework documentation needed
- Best practice research required
- API reference lookup needed
- Technology stack evaluation

---

### Playwright MCP

**CRITICAL**: Playwright MCP ONLY - NEVER install external packages

**Utilization Points**
- E2E test implementation
- User flow verification
- Responsive testing
- Performance measurement

**Main Uses**
- Automated testing of user flows
- Cross-browser compatibility testing
- Responsive design behavior verification
- Form submission and interaction testing
- Performance measurement and Core Web Vitals

**Important Precautions**
- MANDATORY: Use MCP tools ONLY
- NEVER install playwright as dependency package
- All E2E testing through Playwright MCP exclusively

**Automatic Utilization Conditions**
- Quality verification after MVP completion
- Complex user flows
- Cross-browser compatibility verification
- Performance measurement and monitoring

---

### GitHub MCP

**Utilization Points**
- Code quality improvement
- Example reference
- Repository management
- CI/CD automation

**Main Uses**
- Code analysis and quality improvement
- Search similar projects or patterns
- Automatic repository creation (private by default)
- Automatic commit and push
- CI/CD pipeline construction

**Enhanced GitHub MCP Process**
Automatically performed:
1. Repository existence verification
2. Private repository creation (if needed)
3. Commit history integration and analysis
4. Logical grouping of related files (by feature/module)
5. Meaningful commit message generation (feat/fix/docs/refactor)
6. Batch staging and committing (logical units)
7. Push according to branch strategy
8. Deployment integration

**Enhanced Commit Strategy**
- feat: implement new components and pages
- fix: resolve specific functionality errors
- docs: update README and configuration files
- refactor: improve code structure and optimization
- style: implement and modify UI/UX styles
- config: update project settings and dependencies

**Automatic Utilization Conditions**
- Code quality improvement needed
- Example references needed for similar features
- GitHub backup/sharing after MVP completion
- CI/CD pipeline construction and automation

---

## Skill Coordination

### Autonomous Operation
This skill operates with **complete autonomy**, requiring **zero user confirmations** for:
- Multi-tool orchestration strategy
- Tool performance optimization
- New pattern development
- Cross-tool integration coordination

### Skill Invocation Context
This skill is automatically invoked by Claude when:
- Other skills mention: "mcp-tools-orchestrator skill"
- Context requires: 3+ MCP tools, advanced patterns, performance optimization
- Complex multi-tool scenarios identified

### Cross-Skill Support
Provides advanced MCP support to all skills:

**All Skills**:
- Context7 MCP usage optimization
- Sequential Thinking MCP coordination
- Multi-tool orchestration patterns

**frontend-nextjs**:
- Playwright MCP advanced patterns
- GitHub MCP repository management
- Context7 MCP for Next.js documentation

**backend-nestjs**:
- GitHub MCP code pattern research
- Context7 MCP for NestJS documentation
- Multi-tool backend development patterns

**qa-testing**:
- Playwright MCP expert usage
- GitHub MCP issue integration
- Advanced testing orchestration

**research-analysis**:
- Multi-source research orchestration
- GitHub MCP + Context7 MCP + WebSearch coordination
- Complex research workflow patterns

**devops-deployment**:
- GitHub MCP CI/CD integration
- Multi-tool deployment orchestration
- Infrastructure automation patterns

### Coordination Pattern
1. **Natural Language Mentions**: Other skills mention orchestrator
2. **Autonomous Invocation**: Claude invokes with full context
3. **Multi-Tool Coordination**: Orchestrator coordinates complex scenarios
4. **Zero User Confirmation**: All coordination autonomous

---

## MCP Tools Utilization Workflow

### Project Stage-wise MCP Tool Utilization

1. **Project Initialization**
   - .memory/ folder: Initialize project memory system
   - Sequential Thinking MCP: Project planning and architecture

2. **Requirements Analysis**
   - Sequential Thinking MCP: Systematic requirement decomposition
   - .memory/ folder: Record analysis results

3. **Research & Analysis**
   - Context7 MCP: Documentation research
   - GitHub MCP: Code pattern research
   - WebSearch: Market and technology trends

4. **Frontend Development**
   - GitHub MCP: Pattern and example references
   - Context7 MCP: Next.js documentation
   - .memory/ folder: Progress tracking

5. **Backend Development**
   - GitHub MCP: NestJS pattern references
   - Context7 MCP: NestJS/TypeORM documentation
   - .memory/ folder: API design tracking

6. **Quality Assurance**
   - Playwright MCP: E2E testing and performance
   - Sequential Thinking MCP: Optimization strategy
   - GitHub MCP: Issue tracking

7. **CI/CD Automation**
   - GitHub MCP: Repository management
   - .memory/ folder: Deployment status tracking

---

## MCP Tool Mapping

### Skill-Specific MCP Tools

**frontend-nextjs**:
- Context7 MCP: Next.js, React, Tailwind documentation
- GitHub MCP: UI pattern research
- Playwright MCP: Basic UI testing

**backend-nestjs**:
- Context7 MCP: NestJS, TypeORM documentation
- GitHub MCP: API pattern research
- Sequential Thinking MCP: Complex API design

**research-analysis**:
- GitHub MCP: Repository analysis
- Context7 MCP: Technology documentation
- WebSearch: Market intelligence
- Sequential Thinking MCP: Complex analysis

**qa-testing**:
- Playwright MCP: Expert E2E testing
- GitHub MCP: Issue creation and tracking
- Sequential Thinking MCP: Test strategy

**devops-deployment**:
- GitHub MCP: CI/CD and repository management
- Context7 MCP: Deployment documentation
- Sequential Thinking MCP: Infrastructure planning

---

## Automatic Utilization Rules

### Sequential Thinking MCP
- Requirements with 3+ complex features
- Multi-page structure design
- Performance optimization strategy
- Complex architecture design

### Context7 MCP
- Framework documentation needed
- Best practice research required
- API reference lookup
- Technology evaluation

### Playwright MCP
- Quality verification after MVP
- Complex user flows
- Cross-browser compatibility
- Performance measurement

### GitHub MCP
- Code quality improvement
- Example reference needs
- Repository management
- CI/CD automation

---

## Related Skills and Resources

**Related Skills**:
- **All skills**: Provides advanced MCP tool support
- **pm-orchestrator**: Tool strategy coordination
- **research-analysis**: Research tool optimization
- **qa-testing**: Testing tool coordination

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Production Examples**: See examples/ directory for advanced patterns

---

This technical reference guide supports Context7 MCP, GitHub MCP, Sequential Thinking MCP, Playwright MCP, and the autonomous skills-based development system.
