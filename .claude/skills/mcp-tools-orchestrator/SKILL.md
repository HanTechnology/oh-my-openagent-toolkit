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
