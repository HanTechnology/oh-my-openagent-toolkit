---
name: mcp-tools-orchestrator
description: "Advanced MCP tool coordination and optimization for complex multi-tool scenarios, tool performance optimization, and cross-tool integration patterns. Use when: complex operations require multiple MCP tools, advanced MCP usage patterns needed, tool performance optimization required, troubleshooting MCP tool issues, developing new MCP usage patterns. Enhances tool utilization efficiency."
allowed-tools:
  - Read
  - Write
  - Edit
  - mcp__sequential-thinking__sequentialthinking
  - mcp__context7__*
  - mcp__github__*
  - mcp__playwright__*
---

# MCP Tools Orchestrator - Advanced Tool Coordination

**Purpose**: Coordinate advanced MCP tool usage patterns and optimize tool efficiency across the project.

## Core Responsibilities

**CRITICAL**: All automation scripts and MCP patterns MUST be placed in `workspace/ops/` directory.

- **Advanced Tool Coordination**: Complex multi-tool scenarios
- **Tool Performance Optimization**: Improve tool usage efficiency
- **Pattern Development**: Create reusable MCP patterns → `workspace/ops/mcp-patterns/`
- **Troubleshooting**: Resolve MCP tool issues
- **Expert Tool Support**: Assist other skills with tool usage
- **Integration Patterns**: Cross-tool coordination strategies → `workspace/ops/automation/`

**Operations Directory Structure**:
```
workspace/ops/
├── mcp-patterns/
│   ├── multi-tool-workflows/
│   │   ├── research-and-implement.md
│   │   └── test-and-deploy.md
│   ├── optimization/
│   │   ├── context7-caching.md
│   │   └── github-search-patterns.md
│   └── examples/
│       ├── playwright-automation.md
│       └── sequential-thinking-templates.md
├── automation/
│   ├── scripts/
│   │   ├── setup.sh
│   │   └── deploy.sh
│   ├── workflows/
│   └── tools/
├── monitoring/
│   ├── mcp-usage-stats.md
│   └── performance-metrics.md
└── documentation/
    ├── best-practices.md
    └── troubleshooting.md
```

## Deep Thinking Protocol

**CONDITIONAL**: mcp-tools-orchestrator should use Sequential Thinking MCP + ultrathink only when coordinating 3+ MCP tools with complex dependencies or developing novel coordination patterns. Single-tool and simple two-tool usage is handled autonomously by individual skills.

### When to Apply Deep Thinking

**Use Deep Thinking when**:
- **Multi-Tool Coordination (3+ tools)**: Complex scenarios requiring coordination of 3 or more MCP tools simultaneously with dependencies
- **Novel MCP Usage Patterns**: New coordination patterns not yet documented or established in the system
- **Project-Wide MCP Strategy**: Optimizing MCP tool usage across entire project for efficiency
- **Complex Cross-Tool Integration**: Tools depend on each other's outputs requiring careful orchestration

**Do NOT use for** (most cases):
- Single MCP tool usage (Context7, GitHub, Playwright individually)
- Standard two-tool combinations (GitHub + Context7 for research)
- Following established MCP patterns already documented
- Basic tool coordination handled by other skills

### Complexity Threshold

Use Deep Thinking only when:
1. **3+ simultaneous tools** with dependencies between them
2. **Novel coordination pattern** (not yet documented in system)
3. **Performance-critical** orchestration (reducing redundant API calls)
4. **Project-wide MCP strategy** optimization needed

### Deep Thinking Application Protocol

Follow the 5-Phase approach with MCP-orchestrator-specific focus:

**Evaluation Dimensions**:
- **Coordination Efficiency** (30%): How well tools work together, reducing redundancy
- **Performance** (25%): Tool usage speed, avoiding redundant API calls
- **Coverage** (20%): Comprehensive use of available MCP tools
- **Innovation** (15%): Novel patterns that benefit project
- **Maintainability** (10%): Team can follow and reuse pattern

**Expected Thought Investment**: 8-12 thoughts for complex MCP orchestration decisions

### Documentation Requirements

Document in `.memory/decisions.md` with minimal format:
- **Problem**: What MCP coordination challenge was addressed
- **Decision**: What orchestration pattern was chosen

### Domain-Specific Example

#### Multi-Source Framework Research Orchestration

**Problem**: Research frontend framework using GitHub MCP (search 50+ repositories for patterns), Context7 MCP (fetch documentation for top 10 candidates), Sequential Thinking MCP (analyze findings), and WebFetch MCP (validate community sentiment) - all coordinated with caching to avoid redundant API calls

**Complexity**: High (4 tools with dependencies, novel pattern, performance optimization needed)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements - Comprehensive framework research, 50+ repo analysis, documentation validation, community sentiment, avoid redundant calls
- Thoughts 3-5: Alternatives - Sequential tool usage (slow), Parallel without coordination (redundant calls), Coordinated with caching layer
- Thoughts 6-9: Evaluation - Sequential takes 45+ minutes, Parallel causes redundant API calls (80+ calls), Coordinated caching optimal
- Thoughts 10-12: Implementation - GitHub MCP parallel searches → deduplicate results → Context7 MCP batch fetch → Sequential Thinking analysis → WebFetch validation for top 3

**Decision**: Sequential orchestration with deduplication caching layer - GitHub MCP (parallel searches) → deduplicate → Context7 MCP (batch fetch) → Sequential Thinking MCP (analysis) → WebFetch MCP (top 3 validation)

**Rationale**: Parallel GitHub searches (10 concurrent) reduce time from 15min to 3min. Deduplication layer prevents redundant Context7 fetches (60% reduction in API calls). Sequential Thinking analyzes consolidated data. WebFetch validates only top 3 candidates (not all 50). Caching prevents re-fetching during iterative analysis.

**Impact**: Research completed in 12 minutes (vs 45 minutes sequential). 60% reduction in API calls through deduplication. Comprehensive findings with 15+ validated data points. Pattern documented for reuse by research-analysis skill.

### Quality Validation

After Deep Thinking, validate:
- [ ] Tool coordination reduces redundancy (>30% efficiency gain)
- [ ] Pattern documented for team reuse
- [ ] Performance improvement measurable
- [ ] No unnecessary tool invocations

Coordinate with **research-analysis** for research workflows, **quality-controller** for quality tool patterns, and **pm-orchestrator** for project-wide MCP strategy.

### Success Metrics

Track in `.memory/metrics.md`:
- Tool coordination efficiency: Target >70% (vs individual usage)
- API call reduction: Target >40% through optimization
- Pattern reusability: Target >3 reuses per novel pattern

## MCP Tool Categories

### Research & Documentation
- **Context7 MCP**: Latest documentation, API references, framework guides
- **GitHub MCP**: Code examples, implementation patterns, repository analysis

### Analysis & Planning
- **Sequential Thinking MCP**: Step-by-step analysis, complex problem solving

### Testing & Validation
- **Playwright MCP**: Browser automation, E2E testing, UI validation

## Two-Level MCP Usage System

### Level 1: Autonomous Usage (All Skills)
- Single tool operations
- Basic MCP functions
- Individual skill scope
- No orchestrator needed

### Level 2: Orchestrator Coordination
- Multi-tool combinations
- Advanced usage patterns
- Complex cross-tool scenarios
- Performance optimization

## MCP Tool Mapping

All skills can autonomously use:
- Context7 MCP (documentation)
- Sequential Thinking MCP (analysis)

Skill-specific autonomous tools:
- Frontend: GitHub MCP, Playwright MCP (basic)
- Backend: GitHub MCP, Context7 MCP (advanced)
- Research: GitHub MCP, Context7 MCP, Sequential Thinking MCP
- QA: Playwright MCP (expert), GitHub MCP

## Orchestrator Invocation Triggers

Other skills request orchestrator when:
- 3+ simultaneous MCP tools needed
- New usage pattern development
- MCP performance optimization
- Project-wide MCP strategy

## Related Skills

- **All skills**: Provides advanced MCP support
- **pm-orchestrator**: Tool strategy coordination
- **research-analysis**: Research tool optimization
- **qa-testing**: Testing tool coordination

## Examples

The following examples demonstrate advanced MCP tool orchestration patterns:

### 01. Multi-Tool Research Pattern
**File**: `examples/01-multi-tool-research-pattern.md`
**Demonstrates**: Orchestrating GitHub MCP, Context7 MCP, WebSearch, and Playwright MCP together for comprehensive research workflows, including parallel execution, sequential chaining, conditional branching, and multi-source validation.

### 02. Advanced Testing Pattern
**File**: `examples/02-advanced-testing-pattern.md`
**Demonstrates**: Coordinating Playwright MCP with GitHub MCP and IDE MCP for intelligent test orchestration, including automated failure analysis, GitHub issue creation, PR commenting, and auto-fix suggestions.

## Using These Examples

These examples represent meta-level patterns showing how to combine multiple MCP tools effectively. Use these when individual tool usage is insufficient and complex multi-tool coordination is needed.

Refer to reference.md for complete MCP tools guidelines.

---

## Enterprise Standards Compliance

This skill follows team-wide enterprise standards.

**Required References** (`../ENTERPRISE-STANDARDS.md`):
- [Documentation Standards](../ENTERPRISE-STANDARDS.md#documentation-standards) - MCP pattern documentation
- [Logging Standards](../ENTERPRISE-STANDARDS.md#logging-standards) - MCP usage logging, performance metrics
- [Error Handling](../ENTERPRISE-STANDARDS.md#error-handling) - MCP tool error handling
- [Git Conventions](../ENTERPRISE-STANDARDS.md#git-conventions) - MCP pattern commits

**Domain-Specific Standards** (see Deep Thinking Protocol section in this document):
- Tool coordination reduces redundancy (>30% efficiency gain)
- Pattern documented for team reuse
- Performance improvement measurable
- No unnecessary tool invocations
- API call reduction target >40% through optimization
