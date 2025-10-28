# Multi-Tool Research Orchestration Pattern

## Overview

This example demonstrates advanced MCP tool orchestration for comprehensive research workflows. The MCP Tools Orchestrator specialist coordinates **GitHub MCP**, **Context7 MCP**, **WebSearch**, and **Playwright MCP** to conduct thorough, multi-faceted research that would be impossible with a single tool.

**Orchestration Pattern**: Sequential + Parallel + Conditional tool invocation based on research requirements.

**MCP Tools Orchestrated**:
- **GitHub MCP**: Repository analysis, code search, issue tracking
- **Context7 MCP**: Library documentation, API references
- **WebSearch**: Market data, benchmarks, community sentiment
- **Playwright MCP**: Live application analysis, UX research

## Example: Comprehensive Framework Evaluation

**Research Question**: "Should we migrate from Redux to Zustand for state management?"

This requires:
1. Code analysis (GitHub MCP)
2. Documentation research (Context7 MCP)
3. Performance benchmarks (WebSearch)
4. Live demo analysis (Playwright MCP)

### Multi-Tool Orchestration Flow

```
User Question
     ↓
┌────────────────────────────────────────────────────────────┐
│  PHASE 1: Initial Discovery (Parallel)                    │
├────────────────────────────────────────────────────────────┤
│  [GitHub MCP]          [Context7 MCP]      [WebSearch]    │
│  Find repos            Get docs            Find benchmarks │
│     ↓                      ↓                      ↓        │
│  Repository data       Documentation       Benchmark data  │
└────────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────────┐
│  PHASE 2: Deep Analysis (Sequential)                      │
├────────────────────────────────────────────────────────────┤
│  [GitHub MCP] → Analyze codebase structure                │
│       ↓                                                     │
│  [Context7 MCP] → Get migration guides                    │
│       ↓                                                     │
│  [WebSearch] → Find migration case studies                │
└────────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────────┐
│  PHASE 3: Validation (Conditional)                        │
├────────────────────────────────────────────────────────────┤
│  IF live_demo_available:                                  │
│      [Playwright MCP] → Analyze real apps                 │
│  ELSE:                                                     │
│      [GitHub MCP] → Find open-source examples             │
└────────────────────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────────────────────┐
│  PHASE 4: Synthesis                                       │
├────────────────────────────────────────────────────────────┤
│  Combine all findings → Recommendation Report             │
└────────────────────────────────────────────────────────────┘
```

## Orchestration Implementation

```typescript
// scripts/orchestrated-research.ts
/**
 * Advanced MCP tool orchestration for framework migration research
 */

interface OrchestrationPlan {
  phases: ResearchPhase[];
  toolDependencies: Map<string, string[]>;
  parallelizableSteps: string[][];
}

interface ResearchPhase {
  name: string;
  tools: MCPTool[];
  execution: 'parallel' | 'sequential' | 'conditional';
  outputs: string[];
}

type MCPTool = 'github' | 'context7' | 'websearch' | 'playwright';

/**
 * PHASE 1: Initial Discovery (Parallel Execution)
 *
 * Execute multiple MCP tools in parallel for efficiency
 */

async function phase1_initialDiscovery() {
  return {
    prompt_for_claude: `
      Execute these MCP tool calls IN PARALLEL (single message, multiple tools):

      1. [GitHub MCP] Search for repositories:
         mcp__github__search_repositories({
           query: "zustand state management stars:>1000 language:typescript"
         })
         Store as: zustand_repos

      2. [GitHub MCP] Search for Redux repos:
         mcp__github__search_repositories({
           query: "redux toolkit state management stars:>1000"
         })
         Store as: redux_repos

      3. [Context7 MCP] Resolve library IDs:
         mcp__context7__resolve-library-id({ libraryName: "zustand" })
         mcp__context7__resolve-library-id({ libraryName: "redux" })
         Store as: library_ids

      4. [WebSearch] Find benchmarks:
         WebSearch({ query: "zustand vs redux performance benchmark 2024" })
         Store as: benchmark_results

      5. [WebSearch] Find migration articles:
         WebSearch({ query: "migrating from redux to zustand" })
         Store as: migration_articles

      IMPORTANT: Make all these calls in ONE message for parallel execution.

      Expected outputs:
      - zustand_repos: Top 20 Zustand repositories
      - redux_repos: Top 20 Redux repositories
      - library_ids: Context7-compatible library IDs
      - benchmark_results: Performance comparison data
      - migration_articles: Migration case studies
    `
  };
}

/**
 * PHASE 2: Repository Deep Dive (Sequential with GitHub MCP)
 *
 * Analyze the most popular repository in depth
 */

async function phase2_repositoryAnalysis() {
  return {
    prompt_for_claude: `
      Sequential analysis of top Zustand repository:

      Step 1: Get repository details
      Use mcp__github__get_file_contents to read:
      - package.json (dependencies, size)
      - README.md (features, examples)
      - CHANGELOG.md (version history)
      Store as: zustand_repo_details

      Step 2: Analyze code structure
      Use mcp__github__search_code to find:
      - q: "repo:pmndrs/zustand create filename:index"
      - q: "repo:pmndrs/zustand devtools"
      - q: "repo:pmndrs/zustand middleware"
      Store as: zustand_code_patterns

      Step 3: Check maintenance health
      Use mcp__github__list_issues to analyze:
      - Open issues count
      - Recent issue activity
      - Response times
      Use mcp__github__list_commits for:
      - Commit frequency last 3 months
      Store as: zustand_health_metrics

      Step 4: Repeat for Redux Toolkit
      [Same steps for reduxjs/redux-toolkit]
      Store as: redux_repo_details, redux_code_patterns, redux_health_metrics

      Synthesize: Compare code complexity, maintenance activity, issue responsiveness
    `
  };
}

/**
 * PHASE 3: Documentation Research (Context7 MCP)
 *
 * Get comprehensive documentation for both libraries
 */

async function phase3_documentationResearch() {
  return {
    prompt_for_claude: `
      Use Context7 MCP to retrieve detailed documentation:

      For Zustand (ID from Phase 1):
      1. mcp__context7__get-library-docs({
           context7CompatibleLibraryID: "/pmndrs/zustand",
           topic: "getting started migration",
           tokens: 5000
         })
         Store as: zustand_migration_docs

      2. mcp__context7__get-library-docs({
           context7CompatibleLibraryID: "/pmndrs/zustand",
           topic: "typescript api reference",
           tokens: 4000
         })
         Store as: zustand_api_docs

      3. mcp__context7__get-library-docs({
           context7CompatibleLibraryID: "/pmndrs/zustand",
           topic: "performance optimization",
           tokens: 3000
         })
         Store as: zustand_perf_docs

      For Redux Toolkit:
      [Similar queries for /reduxjs/redux-toolkit]
      Store as: redux_migration_docs, redux_api_docs, redux_perf_docs

      Analysis tasks:
      - Compare migration complexity
      - Compare API surface area
      - Compare TypeScript support quality
      - Extract performance recommendations
    `
  };
}

/**
 * PHASE 4: Performance Validation (WebSearch + GitHub)
 *
 * Find and verify performance claims
 */

async function phase4_performanceValidation() {
  return {
    prompt_for_claude: `
      Validate performance characteristics:

      1. [WebSearch] Find official benchmarks:
         - Query: "site:github.com zustand benchmark"
         - Query: "site:github.com redux performance test"
         Extract benchmark methodologies and results

      2. [GitHub MCP] Find benchmark repos:
         mcp__github__search_repositories({
           query: "react state management benchmark"
         })

      3. [GitHub MCP] Analyze benchmark code:
         For top benchmark repo, use mcp__github__get_file_contents to read:
         - Benchmark implementation
         - Results/data files
         - Verify methodology is sound

      4. [WebSearch] Find real-world performance reports:
         - Query: "zustand production performance"
         - Query: "redux performance issues"
         - Query: "site:reddit.com zustand vs redux speed"
         Extract community performance experiences

      Synthesize:
      - Bundle size comparison (verified)
      - Runtime performance (benchmarked)
      - Re-render efficiency
      - Memory usage patterns
    `
  };
}

/**
 * PHASE 5: Migration Complexity Analysis (Conditional + Multi-Tool)
 *
 * Conditional: If our codebase uses certain Redux features, research alternatives in Zustand
 */

async function phase5_migrationComplexity() {
  return {
    prompt_for_claude: `
      Conditional analysis based on current Redux usage:

      IF using Redux Toolkit + createAsyncThunk:
        1. [Context7 MCP] Research Zustand async patterns:
           mcp__context7__get-library-docs({
             context7CompatibleLibraryID: "/pmndrs/zustand",
             topic: "async actions middleware",
             tokens: 3000
           })

        2. [GitHub MCP] Find example implementations:
           mcp__github__search_code({
             q: "zustand async fetch language:typescript",
             per_page: 10
           })

        3. [WebSearch] Find migration guides:
           Query: "redux createAsyncThunk to zustand"

      IF using Redux DevTools extensively:
        1. [Context7 MCP] Research Zustand devtools:
           topic: "devtools middleware"

        2. [GitHub MCP] Check devtools integration quality:
           Search for devtools-related issues

      IF using Redux middleware (saga, observable):
        1. [WebSearch] Find Zustand middleware equivalents
        2. [GitHub MCP] Search for custom middleware examples

      Generate migration complexity score (1-10) with specific blockers identified.
    `
  };
}

/**
 * PHASE 6: Live Application Analysis (Playwright MCP - Conditional)
 *
 * If public demos exist, analyze real applications
 */

async function phase6_liveApplicationAnalysis() {
  return {
    prompt_for_claude: `
      Conditional: If live demos found in Phase 1

      IF zustand_demo_url exists:
        Use Playwright MCP to analyze demo application:

        1. mcp__playwright__browser_navigate({ url: zustand_demo_url })

        2. mcp__playwright__browser_snapshot()
           Analyze: UI complexity, feature count

        3. Monitor performance:
           - Page load time
           - Time to interactive
           - JavaScript bundle size

        4. Interact with state:
           mcp__playwright__browser_click({ element: "action-button" })
           Observe: Re-render behavior, state update speed

        5. mcp__playwright__browser_console_messages()
           Check for: Warnings, errors, performance hints

        6. mcp__playwright__browser_network_requests()
           Analyze: Bundle composition, lazy loading

      Compare with Redux demo (if available) using same methodology.

      Output: Real-world performance comparison, UX quality assessment
    `
  };
}

/**
 * PHASE 7: Final Synthesis (All Tool Data)
 *
 * Combine all findings into recommendation
 */

async function phase7_finalSynthesis() {
  return {
    prompt_for_claude: `
      Synthesize all findings from Phases 1-6:

      Data Sources:
      - GitHub MCP: Repository health, code complexity, maintenance
      - Context7 MCP: Documentation quality, API surface, migration guides
      - WebSearch: Performance benchmarks, community sentiment, case studies
      - Playwright MCP: Real-world performance, UX quality

      Generate recommendation report:

      ## Executive Summary
      - Clear recommendation (Migrate | Don't Migrate | Hybrid)
      - Key factors driving recommendation
      - Timeline estimate
      - Risk level

      ## Detailed Analysis
      ### Feature Parity
      - What Redux features have Zustand equivalents?
      - What would we lose?
      - What would we gain?

      ### Performance Impact
      - Bundle size reduction (MB)
      - Runtime performance improvement (%)
      - Development experience improvement

      ### Migration Effort
      - Complexity score (1-10)
      - Estimated hours
      - Team training needed
      - Testing required

      ### Risk Assessment
      - Technical risks
      - Business risks
      - Mitigation strategies

      ## Migration Plan (if recommended)
      ### Phase 1: Prototype
      - Migrate one small module
      - Measure impact
      - Team feedback

      ### Phase 2: Gradual Rollout
      - Coexistence strategy (Redux + Zustand)
      - Module-by-module migration
      - Testing at each step

      ### Phase 3: Completion
      - Remove Redux dependencies
      - Update documentation
      - Team training

      ## Appendix: Tool Usage
      - List all MCP tools used
      - Data sources consulted
      - Confidence levels for each finding
    `
  };
}

/**
 * Orchestration Coordinator
 *
 * Manages phase execution and data flow between phases
 */

async function coordinateResearch() {
  return {
    execution_plan: `
      Research Orchestration Plan
      ===========================

      Phase 1: Initial Discovery
      Tools: GitHub MCP (x2), Context7 MCP (x2), WebSearch (x2)
      Execution: PARALLEL (single message, 6 tool calls)
      Duration: ~30 seconds
      Output: Repository lists, library IDs, benchmark data, migration articles

      Phase 2: Repository Analysis
      Tools: GitHub MCP (sequential calls)
      Execution: SEQUENTIAL (depends on Phase 1 output)
      Duration: ~2 minutes
      Output: Code complexity, maintenance health

      Phase 3: Documentation Research
      Tools: Context7 MCP (x6)
      Execution: CAN BE PARALLEL (but sequential is fine for thoroughness)
      Duration: ~1 minute
      Output: Migration docs, API docs, performance docs

      Phase 4: Performance Validation
      Tools: WebSearch, GitHub MCP
      Execution: SEQUENTIAL (each step builds on previous)
      Duration: ~1 minute
      Output: Verified performance data

      Phase 5: Migration Complexity
      Tools: Context7 MCP, GitHub MCP, WebSearch
      Execution: CONDITIONAL (based on current codebase)
      Duration: ~1 minute
      Output: Migration complexity assessment

      Phase 6: Live Analysis
      Tools: Playwright MCP
      Execution: CONDITIONAL (if demos exist)
      Duration: ~2 minutes
      Output: Real-world performance data

      Phase 7: Synthesis
      Tools: None (analysis of collected data)
      Execution: SEQUENTIAL
      Duration: ~1 minute
      Output: Final recommendation report

      Total Research Time: ~8-10 minutes
      Total MCP Tool Calls: 20-30 (depending on conditionals)
      Confidence Level: HIGH (multi-source validation)
    `
  };
}

export {
  phase1_initialDiscovery,
  phase2_repositoryAnalysis,
  phase3_documentationResearch,
  phase4_performanceValidation,
  phase5_migrationComplexity,
  phase6_liveApplicationAnalysis,
  phase7_finalSynthesis,
  coordinateResearch
};
```

## Claude Code Execution Example

```
User: Should we migrate from Redux to Zustand?

Claude Code:
I'll conduct comprehensive research using multiple MCP tools. Let me orchestrate a
multi-phase analysis.

PHASE 1: Initial Discovery (Parallel Tool Execution)
====================================================
Executing 6 MCP tools in parallel...

[Invokes mcp__github__search_repositories for Zustand]
[Invokes mcp__github__search_repositories for Redux]
[Invokes mcp__context7__resolve-library-id for Zustand]
[Invokes mcp__context7__resolve-library-id for Redux]
[Invokes WebSearch for benchmarks]
[Invokes WebSearch for migration articles]

Results:
- Found 34,213-star Zustand repo (pmndrs/zustand)
- Found 9,841-star Redux Toolkit repo (reduxjs/redux-toolkit)
- Context7 IDs: /pmndrs/zustand, /reduxjs/redux-toolkit
- Found 15 benchmark comparisons
- Found 8 migration case studies

PHASE 2: Repository Deep Dive
==============================
[Invokes mcp__github__get_file_contents for Zustand package.json]
Analysis: Zustand bundle size: 1.2KB gzip, zero dependencies

[Invokes mcp__github__search_code for code patterns]
Analysis: Simple API surface - 4 core exports

[Invokes mcp__github__list_issues]
Analysis: 42 open issues, avg response time 12 hours

[Invokes mcp__github__list_commits]
Analysis: 89 commits last 3 months - actively maintained

[Repeating for Redux Toolkit...]
Analysis: Redux bundle size: 12.4KB gzip, 3 dependencies
         15 core APIs, 127 open issues, avg response 8 hours

PHASE 3: Documentation Research
================================
[Invokes mcp__context7__get-library-docs for Zustand migration]
Found: Comprehensive migration guide from Redux

[Invokes mcp__context7__get-library-docs for API reference]
API Complexity: Zustand has 4 core APIs vs Redux's 15

[Invokes mcp__context7__get-library-docs for performance]
Performance tips: Zustand's selector-based updates are efficient

PHASE 4: Performance Validation
================================
[Invokes WebSearch for benchmarks]
Found: Independent benchmark showing:
- Zustand: 2.3ms update latency, 12 re-renders
- Redux: 4.1ms update latency, 18 re-renders

[Invokes mcp__github__search_repositories for benchmark repos]
Found: react-state-benchmark repo with methodology

[Invokes mcp__github__get_file_contents to verify methodology]
Verified: Sound testing methodology, reproducible results

PHASE 5: Migration Complexity Analysis
=======================================
Analyzing your current Redux usage...

[Invokes mcp__context7__get-library-docs for async patterns]
Found: Zustand async patterns are simpler (no thunks needed)

[Invokes mcp__github__search_code for examples]
Found: 1,200+ examples of async patterns in Zustand

Migration Complexity Score: 4/10 (Relatively straightforward)

PHASE 6: Live Application Analysis
===================================
[Invokes mcp__playwright__browser_navigate to Zustand demo]
[Invokes mcp__playwright__browser_snapshot]
Observed: Clean UI, 15 interactive features

[Performance monitoring]
- Page load: 1.2s
- Time to interactive: 1.5s
- JS bundle: 245KB (with Zustand: 1.2KB)

[Invokes mcp__playwright__browser_network_requests]
Analysis: Efficient bundle splitting, lazy loading

PHASE 7: Synthesis
==================

## Recommendation: MIGRATE to Zustand

### Key Findings:

1. **Performance Improvement**:
   - 91% smaller bundle (1.2KB vs 12.4KB)
   - 43% faster updates (2.3ms vs 4.1ms)
   - 33% fewer re-renders

2. **Simpler API**:
   - 4 core APIs vs 15 in Redux
   - No boilerplate
   - Better TypeScript inference

3. **Active Maintenance**:
   - More GitHub stars (34k vs 9.8k)
   - Faster issue response (12hr vs 8hr)
   - Growing ecosystem

4. **Migration Effort**: MODERATE
   - Complexity: 4/10
   - Estimated: 40-60 hours for your codebase
   - Can be done incrementally

### Migration Plan:

**Week 1-2**: Prototype
- Migrate TodoSlice module
- Measure bundle size impact (-11KB expected)
- Team review

**Week 3-6**: Gradual Migration
- Coexist Redux + Zustand
- Migrate 1 slice per week
- Comprehensive testing

**Week 7-8**: Completion
- Remove Redux dependencies
- Update documentation
- Team training session

### Risks & Mitigations:

**Risk**: Team unfamiliarity
**Mitigation**: Zustand is simpler, 2-hour training sufficient

**Risk**: Missing Redux DevTools
**Mitigation**: Zustand has devtools middleware

**Risk**: Migration introduces bugs
**Mitigation**: Incremental migration with testing at each step

Would you like me to:
1. Generate detailed migration code examples?
2. Create a testing plan for the migration?
3. Research specific Redux features you're using?
```

## Orchestration Patterns Summary

### Pattern 1: Parallel Discovery
Execute independent MCP tools simultaneously for efficiency:
- GitHub search + Context7 ID resolution + WebSearch
- Reduces research time from 3 minutes to 30 seconds

### Pattern 2: Sequential Deep Dive
Chain MCP tool calls where each depends on previous results:
- Get repo → Read files → Analyze code → Check health

### Pattern 3: Conditional Branching
Execute tools based on intermediate findings:
- IF feature_x_used THEN research_alternative
- IF demo_exists THEN analyze_with_playwright

### Pattern 4: Multi-Source Validation
Cross-verify claims using multiple tools:
- Benchmark from WebSearch + Code from GitHub + Docs from Context7

### Pattern 5: Progressive Refinement
Start broad, narrow down iteratively:
- Search all → Filter top 5 → Deep dive on top 1

## Related Examples

- **Technology Research**: `research-analysis/examples/01-technology-stack-research.md` - Single-tool research patterns
- **Competitive Analysis**: `research-analysis/examples/02-competitive-analysis.md` - Multi-source comparison
- **Advanced Testing**: `mcp-tools-orchestrator/examples/02-advanced-testing-pattern.md` - Testing orchestration

## Key Takeaways

1. **Tool Parallelization**: Execute independent tool calls together (single message, multiple tools)
2. **Sequential Chaining**: Chain tools when output of one feeds input of next
3. **Conditional Logic**: Branch tool execution based on intermediate findings
4. **Multi-Source Validation**: Never rely on single source - cross-verify
5. **Progressive Refinement**: Broad search → filter → deep dive
6. **Data Synthesis**: Combine outputs from all tools into coherent recommendation
7. **Execution Planning**: Plan entire orchestration before executing
8. **Error Handling**: Have fallback strategies if tool fails
9. **Efficiency Optimization**: Minimize sequential steps, maximize parallel
10. **Confidence Tracking**: Note which findings are verified by multiple sources

Multi-tool orchestration enables research quality impossible with single-tool approaches.
