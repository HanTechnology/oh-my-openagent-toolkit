# Technology Stack Research Using GitHub and Context7 MCP

## Overview

This example demonstrates comprehensive technology stack research using **GitHub MCP** for repository analysis and **Context7 MCP** for library documentation. Research analysts use these MCP tools to evaluate technologies, compare alternatives, and make informed architectural decisions.

**Research Process**:
1. Identify candidate technologies
2. Search and analyze GitHub repositories
3. Retrieve up-to-date documentation via Context7
4. Evaluate criteria (popularity, maintenance, performance, ecosystem)
5. Generate comparative analysis report

**MCP Tools Used**:
- **GitHub MCP**: Repository search, file analysis, issue tracking, community health
- **Context7 MCP**: Library documentation, API references, code examples
- **Web Search**: Industry trends, benchmark comparisons, expert opinions

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Research Workflow                            │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Technology  │  │  Repository  │  │  Documentation  │   │
│  │ Identification│  │   Analysis   │  │    Research     │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    MCP Tool Integration                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GitHub MCP                                           │  │
│  │  • search_repositories    • get_file_contents        │  │
│  │  • list_issues            • search_code              │  │
│  │  • list_pull_requests     • list_commits             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Context7 MCP                                         │  │
│  │  • resolve-library-id     • get-library-docs         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  WebSearch                                            │  │
│  │  • Benchmarks • Articles • Best Practices            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Analysis & Reporting                       │
│  • Comparison Matrix       • Risk Assessment                │
│  • Recommendation Report   • Migration Strategy             │
└─────────────────────────────────────────────────────────────┘
```

## Example 1: Researching State Management Libraries for React

### Step 1: Identify Candidate Technologies

```markdown
**Research Request**: "Evaluate state management solutions for a large-scale React application"

**Initial Candidates**:
1. Redux + Redux Toolkit
2. Zustand
3. Jotai
4. MobX
5. Recoil
6. XState

**Evaluation Criteria**:
- Community adoption (GitHub stars, npm downloads)
- Active maintenance (recent commits, issue response time)
- Performance (bundle size, runtime overhead)
- Developer experience (API simplicity, TypeScript support)
- Ecosystem (devtools, middleware, integrations)
- Learning curve
- Production readiness
```

### Step 2: GitHub Repository Analysis

```typescript
// scripts/research-state-management.ts
/**
 * Research script using GitHub MCP to analyze state management libraries
 *
 * Claude Code Execution Flow:
 * 1. User: "Research state management libraries using GitHub MCP"
 * 2. Claude Code reads this script
 * 3. Claude Code executes research steps using GitHub MCP tools
 * 4. Claude Code generates comparative analysis
 */

interface RepositoryMetrics {
  name: string;
  owner: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastCommit: string;
  contributors: number;
  weeklyCommits: number;
  license: string;
  topics: string[];
}

interface IssueMetrics {
  totalOpen: number;
  avgResponseTime: number;  // hours
  avgResolutionTime: number;  // days
  openBugs: number;
  openFeatures: number;
}

interface CodeQualityMetrics {
  hasTypeScriptSupport: boolean;
  hasTests: boolean;
  testCoverage?: number;
  hasCI: boolean;
  hasDocumentation: boolean;
}

// Step 1: Search and retrieve repositories
const candidates = [
  'reduxjs/redux-toolkit',
  'pmndrs/zustand',
  'pmndrs/jotai',
  'mobxjs/mobx',
  'facebookexperimental/Recoil',
  'statelyai/xstate'
];

/**
 * Claude Code uses mcp__github__search_repositories to find libraries
 *
 * Example Claude Code conversation:
 * User: "Search for React state management libraries"
 * Claude: "I'll use the GitHub MCP search_repositories tool"
 * [Invokes mcp__github__search_repositories]
 */

async function searchStateManagementLibraries() {
  // Claude Code would invoke:
  // mcp__github__search_repositories({
  //   query: "react state management stars:>5000 language:typescript"
  // })

  return {
    prompt_for_claude: `
      Use mcp__github__search_repositories to search for:
      - Query: "react state management stars:>5000 language:typescript"
      - Sort by: stars
      - Per page: 20

      Then filter results to identify the top state management libraries.
    `
  };
}

/**
 * Step 2: Analyze each repository's metrics
 *
 * Claude Code invokes multiple GitHub MCP tools:
 * - mcp__github__get_file_contents (owner, repo, path: "package.json")
 * - mcp__github__list_issues (owner, repo, state: "open")
 * - mcp__github__list_commits (owner, repo)
 */

async function analyzeRepository(owner: string, repo: string): Promise<RepositoryMetrics> {
  // Claude Code conversation flow:
  // User: "Analyze the Redux Toolkit repository"
  // Claude: "I'll gather repository metrics using GitHub MCP tools"

  return {
    prompt_for_claude: `
      For repository ${owner}/${repo}, gather the following data:

      1. Repository Overview:
         - Use GitHub API to get stars, forks, open issues
         - Get last commit date from mcp__github__list_commits
         - Extract topics and license

      2. Package Information:
         - Use mcp__github__get_file_contents to read package.json
         - Extract dependencies, bundle size from package.json

      3. Activity Metrics:
         - Count commits in last 3 months using mcp__github__list_commits
         - Count contributors

      Store results in structured format for comparison.
    `
  };
}

/**
 * Step 3: Analyze issue/PR health
 */

async function analyzeIssueHealth(owner: string, repo: string): Promise<IssueMetrics> {
  return {
    prompt_for_claude: `
      For ${owner}/${repo}, analyze issue/PR health:

      1. Use mcp__github__list_issues with filters:
         - state: "open"
         - labels: "bug"
         - Get count of open bugs

      2. Use mcp__github__list_issues with filters:
         - state: "open"
         - labels: "feature" or "enhancement"
         - Get count of feature requests

      3. Sample 20 recently closed issues:
         - Use mcp__github__list_issues (state: "closed", per_page: 20)
         - Calculate average time from created to closed
         - This indicates maintainer responsiveness

      4. Check PR activity:
         - Use mcp__github__list_pull_requests
         - Count open vs merged PRs
         - Check average merge time
    `
  };
}

/**
 * Step 4: Code quality assessment
 */

async function assessCodeQuality(owner: string, repo: string): Promise<CodeQualityMetrics> {
  return {
    prompt_for_claude: `
      Assess code quality for ${owner}/${repo}:

      1. TypeScript Support:
         - Use mcp__github__get_file_contents to check for tsconfig.json
         - Check package.json for @types/* dependencies

      2. Testing:
         - Use mcp__github__search_code to find test files:
           q: "repo:${owner}/${repo} filename:test extension:ts extension:tsx"
         - Check for jest.config.js, vitest.config.ts
         - Look for coverage reports in CI configuration

      3. CI/CD:
         - Use mcp__github__get_file_contents for .github/workflows/
         - Check for automated testing, linting, type checking

      4. Documentation:
         - Check for README.md, docs/ directory
         - Look for API documentation, examples
         - Check if documentation is up-to-date (recent commits to docs/)
    `
  };
}

export {
  searchStateManagementLibraries,
  analyzeRepository,
  analyzeIssueHealth,
  assessCodeQuality
};
```

### Step 3: Documentation Research via Context7 MCP

```typescript
// scripts/research-documentation.ts
/**
 * Use Context7 MCP to get up-to-date documentation
 *
 * Context7 provides library-specific documentation, API references, and examples
 */

/**
 * Step 1: Resolve library IDs
 *
 * Context7 uses specific library identifiers.
 * First, resolve the library name to Context7-compatible ID.
 */

async function resolveLibraryDocumentation(libraryName: string) {
  return {
    prompt_for_claude: `
      Use mcp__context7__resolve-library-id to find the Context7 ID for "${libraryName}".

      Example:
      - Input: "zustand"
      - Output: "/pmndrs/zustand" (Context7-compatible library ID)

      Then use this ID for documentation retrieval.
    `
  };
}

/**
 * Step 2: Retrieve documentation
 */

interface DocumentationResearch {
  library: string;
  gettingStarted: string;
  apiReference: string;
  codeExamples: string[];
  bestPractices: string[];
  migrationGuides: string[];
}

async function retrieveDocumentation(libraryId: string): Promise<DocumentationResearch> {
  return {
    prompt_for_claude: `
      For library ID ${libraryId}, retrieve comprehensive documentation:

      1. Getting Started Guide:
         Use mcp__context7__get-library-docs with:
         - context7CompatibleLibraryID: "${libraryId}"
         - topic: "getting started"
         - tokens: 3000

      2. API Reference:
         Use mcp__context7__get-library-docs with:
         - context7CompatibleLibraryID: "${libraryId}"
         - topic: "api reference"
         - tokens: 5000

      3. Code Examples:
         Use mcp__context7__get-library-docs with:
         - context7CompatibleLibraryID: "${libraryId}"
         - topic: "examples"
         - tokens: 4000

      4. Best Practices:
         Use mcp__context7__get-library-docs with:
         - context7CompatibleLibraryID: "${libraryId}"
         - topic: "best practices performance"
         - tokens: 3000

      5. TypeScript Integration:
         Use mcp__context7__get-library-docs with:
         - context7CompatibleLibraryID: "${libraryId}"
         - topic: "typescript"
         - tokens: 2000

      Extract key information:
      - Learning curve (beginner-friendly vs advanced)
      - API complexity (# of core APIs, patterns)
      - TypeScript quality (type safety, inference)
      - Performance considerations
      - Common patterns and anti-patterns
    `
  };
}

/**
 * Step 3: Compare API surface and patterns
 */

interface APIComparison {
  library: string;
  coreAPIs: string[];
  helperAPIs: string[];
  middlewareSupport: boolean;
  asyncSupport: boolean;
  reactIntegration: string;  // hooks, HOC, render props
  typescriptInference: 'excellent' | 'good' | 'fair' | 'poor';
}

async function compareAPIs(libraries: string[]): Promise<APIComparison[]> {
  return {
    prompt_for_claude: `
      For each library in ${libraries.join(', ')}, analyze API surface:

      1. Retrieve API docs for each library using Context7 MCP

      2. Extract and categorize APIs:
         - Core APIs (essential for basic usage)
         - Helper/utility APIs
         - Advanced APIs

      3. Analyze patterns:
         - How state is defined
         - How state is updated
         - How components subscribe to state
         - How to handle async operations
         - Middleware/plugin system

      4. TypeScript analysis:
         - Type inference quality
         - Generic usage
         - Complexity of type definitions

      Create side-by-side comparison showing code examples for:
      - Defining a store
      - Reading state in component
      - Updating state
      - Async operation (API call)
      - TypeScript usage
    `
  };
}

export {
  resolveLibraryDocumentation,
  retrieveDocumentation,
  compareAPIs
};
```

### Step 4: Benchmark and Performance Research

```typescript
// scripts/research-performance.ts
/**
 * Research performance characteristics using web search and GitHub
 */

interface PerformanceMetrics {
  library: string;
  bundleSize: {
    min: number;  // KB
    gzip: number;  // KB
  };
  renderPerformance: {
    reRenderCount: number;  // in benchmark scenario
    updateLatency: number;  // ms
  };
  memoryUsage: {
    baseline: number;  // MB
    with1000Items: number;  // MB
  };
  benchmarkSource: string;
}

async function researchPerformance(libraries: string[]): Promise<PerformanceMetrics[]> {
  return {
    prompt_for_claude: `
      Research performance for: ${libraries.join(', ')}

      1. Bundle Size Analysis:
         For each library, use mcp__github__get_file_contents to read package.json
         - Check "main", "module", "exports" fields
         - Look for size badges in README.md
         - Search for "bundle size" or "size" in docs

         Use WebSearch to find bundlephobia.com data:
         - Query: "site:bundlephobia.com ${libraries[0]}"
         - Extract minified and gzipped sizes

      2. Performance Benchmarks:
         Use WebSearch to find existing benchmarks:
         - Query: "react state management benchmark ${new Date().getFullYear()}"
         - Query: "zustand vs redux performance"
         - Look for:
           * GitHub repos with benchmark suites
           * Blog posts with measurements
           * Official performance docs

      3. Real-world Performance:
         Use mcp__github__search_code to find benchmark files:
         - q: "react state management benchmark filename:benchmark"
         - Analyze benchmark methodologies and results

      4. GitHub Issues Search:
         Use mcp__github__search_issues:
         - q: "repo:${owner}/${repo} performance slow label:performance"
         - Count performance-related issues
         - Check if resolved or still open

      Synthesize findings into performance comparison table.
    `
  };
}

/**
 * Analyze bundle size impact
 */

async function analyzeBundleImpact(libraries: string[]): Promise<void> {
  return {
    prompt_for_claude: `
      For each library, calculate bundle impact:

      1. Tree-shaking support:
         - Check if library exports ES modules
         - Use mcp__github__get_file_contents for package.json
         - Look for "sideEffects": false

      2. Dependencies:
         - Read package.json dependencies
         - Check if any heavy dependencies
         - Count total dependency tree size

      3. Code splitting compatibility:
         - Research if library supports dynamic imports
         - Check documentation for code splitting guidance

      Generate report showing:
      - Minimal viable bundle size (core only)
      - Full featured bundle size
      - Additional cost per feature
    `
  };
}

export { researchPerformance, analyzeBundleImpact };
```

### Step 5: Community and Ecosystem Analysis

```typescript
// scripts/research-ecosystem.ts
/**
 * Analyze community health and ecosystem
 */

interface EcosystemMetrics {
  library: string;
  community: {
    npmDownloadsWeekly: number;
    githubStars: number;
    contributors: number;
    dependents: number;  // packages depending on this
  };
  ecosystem: {
    devtools: boolean;
    middlewareLibraries: number;
    thirdPartyIntegrations: number;
    officialExamples: number;
  };
  learning: {
    tutorials: number;
    courses: number;
    books: number;
    stackoverflow: number;
  };
}

async function analyzeEcosystem(library: string, owner: string, repo: string): Promise<EcosystemMetrics> {
  return {
    prompt_for_claude: `
      Comprehensive ecosystem analysis for ${library}:

      1. npm Statistics:
         Use WebSearch:
         - Query: "site:npmjs.com ${library}"
         - Extract weekly downloads from npm page

      2. GitHub Dependents:
         Use GitHub MCP or WebSearch:
         - Navigate to https://github.com/${owner}/${repo}/network/dependents
         - Count public repositories using this library

      3. DevTools and Extensions:
         Use mcp__github__search_repositories:
         - q: "${library} devtools"
         - q: "${library} extension"
         - Count official and community devtools

      4. Middleware/Plugin Ecosystem:
         Use mcp__github__search_repositories:
         - q: "${library} middleware"
         - q: "${library} plugin"
         - Analyze variety and quality of extensions

      5. Integration Libraries:
         Use mcp__github__search_code:
         - q: "import ${library} language:typescript"
         - Sample popular projects using this library
         - Check for common integration patterns

      6. Learning Resources:
         Use WebSearch:
         - Query: "${library} tutorial ${new Date().getFullYear()}"
         - Query: "site:udemy.com ${library}"
         - Query: "site:egghead.io ${library}"
         - Query: "site:stackoverflow.com ${library}"
         - Count and categorize resources

      7. Community Activity:
         Use GitHub MCP:
         - mcp__github__list_issues (check recent activity)
         - Check for Discord/Slack community links in README
         - Look for "CONTRIBUTING.md" file

      Generate ecosystem health score (1-10) based on:
      - Download trends
      - Dependent projects
      - Extension ecosystem
      - Learning resources availability
      - Community engagement
    `
  };
}

export { analyzeEcosystem };
```

### Step 6: Generate Comparative Analysis Report

```markdown
# State Management Library Research Report

## Executive Summary

**Research Date**: 2024-01-15
**Evaluated Libraries**: Redux Toolkit, Zustand, Jotai, MobX, Recoil, XState
**Recommendation**: Zustand for new projects, Redux Toolkit for large teams with existing Redux

## Comparison Matrix

| Library | GitHub Stars | Bundle Size (gzip) | Weekly Downloads | TypeScript | Learning Curve | Verdict |
|---------|-------------|-------------------|------------------|------------|----------------|---------|
| Redux Toolkit | 9.8k | 12.4 KB | 3.2M | ✓ Excellent | Medium | Proven, comprehensive |
| Zustand | 34.2k | 1.2 KB | 1.1M | ✓ Excellent | Easy | Lightweight, simple |
| Jotai | 15.1k | 3.1 KB | 180K | ✓ Excellent | Easy | Atomic, React-first |
| MobX | 26.8k | 16.2 KB | 890K | ✓ Good | Medium | OOP-style, reactive |
| Recoil | 19.2k | 14.5 KB | 320K | ✓ Good | Medium | Experimental, Facebook |
| XState | 25.1k | 21.3 KB | 420K | ✓ Excellent | Steep | State machines, complex |

## Detailed Analysis

### Redux Toolkit

**Pros**:
- Industry standard with massive ecosystem
- Excellent DevTools (Redux DevTools Extension)
- Comprehensive middleware ecosystem (thunk, saga, observable)
- Great for large teams with complex state requirements
- Time-travel debugging
- Well-documented patterns for async, normalization, etc.

**Cons**:
- Larger bundle size (12.4 KB)
- More boilerplate than alternatives (despite "toolkit" improvements)
- Steeper learning curve
- Overkill for simple state needs

**GitHub Analysis** (via GitHub MCP):
- Stars: 9,841
- Recent activity: 156 commits in last 3 months
- Open issues: 89 (avg response time: 8 hours)
- Contributors: 200+
- Issue resolution: Excellent (avg 3.2 days for bugs)

**Documentation** (via Context7 MCP):
- Getting Started: Comprehensive 15-page guide
- API Reference: Complete with TypeScript signatures
- Examples: 20+ official examples including real-world apps
- Migration guides: From Redux, from MobX

**Use Case Fit**:
- Large applications (1000+ components)
- Teams with existing Redux knowledge
- Need for advanced debugging and time-travel
- Complex async workflows

### Zustand

**Pros**:
- Minimal bundle size (1.2 KB - smallest!)
- Extremely simple API (one hook: `create`)
- No boilerplate
- Great TypeScript inference
- No context providers needed
- Good performance (minimal re-renders)

**Cons**:
- Smaller ecosystem than Redux
- Less mature DevTools
- Limited middleware options
- Less opinionated (more decisions to make)

**GitHub Analysis**:
- Stars: 34,213 (highest!)
- Very active: 89 commits in last month
- Responsive maintenance: avg 12 hour response to issues
- Growing fast: +8k stars in last year

**Documentation** (via Context7 MCP):
- Getting Started: Simple 5-minute guide
- API: Only 4 main APIs to learn
- Recipes: Excellent recipe collection for common patterns
- TypeScript: Perfect inference, minimal manual typing

**Performance Benchmark** (found via WebSearch):
Source: https://github.com/jack-pope/react-state-library-benchmark
- Re-renders: 12 (best in test)
- Update latency: 2.3ms
- Bundle size: 1.2KB gzip (smallest)

**Use Case Fit**:
- Small to medium apps
- Need for minimal bundle size
- Teams wanting simple, maintainable code
- Projects without complex async requirements

### Jotai

**Pros**:
- Atomic state model (like Recoil but more stable)
- Zero boilerplate
- Great for React Concurrent Mode
- Suspense-ready
- Derived state is simple

**Cons**:
- Smaller community than Redux/Zustand
- Fewer resources/tutorials
- Atom-based pattern requires mindset shift

**GitHub Analysis**:
- Stars: 15,184
- Active development: 200+ commits in 3 months
- Responsive: Issues addressed within 24 hours
- Growing ecosystem: 15+ official integrations

**Use Case Fit**:
- React 18+ applications
- Need for Suspense integration
- Derived/computed state heavy applications

### Final Recommendation

**For New Projects**:
- **Choose Zustand** if:
  - Bundle size matters
  - Team prefers simplicity
  - Simple to moderate complexity

- **Choose Redux Toolkit** if:
  - Large team (5+ developers)
  - Complex async workflows
  - Need for robust debugging

- **Choose Jotai** if:
  - Using React 18+ with Suspense
  - Heavy use of derived state
  - Prefer atomic state model

**Migration Risk Assessment**:
- Zustand: LOW - Simple API, easy to adopt incrementally
- Redux Toolkit: MEDIUM - Learning curve, but well-documented
- Jotai: MEDIUM - Requires understanding atomic model

## Implementation Plan

**Phase 1: Prototype** (Week 1-2)
- Build small prototype with top 2 choices (Zustand, Redux Toolkit)
- Implement 3-4 key features
- Measure bundle size impact
- Evaluate developer experience

**Phase 2: Team Training** (Week 3)
- Create internal documentation
- Run workshop for team
- Build pattern library

**Phase 3: Gradual Adoption** (Week 4+)
- Start with new features
- Migrate one module at a time
- Monitor performance impact

## Appendix: Research Methodology

**Data Sources**:
- GitHub MCP: Repository metrics, code analysis, issue tracking
- Context7 MCP: Library documentation, API references
- WebSearch: Benchmarks, community sentiment, tutorials
- npm: Download statistics

**Research Tools**:
- GitHub MCP tools: search_repositories, get_file_contents, list_issues, search_code
- Context7 MCP tools: resolve-library-id, get-library-docs
- WebSearch: Benchmark sites, tutorial platforms, community forums

**Evaluation Criteria Weight**:
- Bundle Size: 20%
- Developer Experience: 25%
- Performance: 20%
- Community/Ecosystem: 20%
- Documentation: 15%

---

**Report Generated**: 2024-01-15
**Researcher**: Claude Code with GitHub & Context7 MCP
**Review Status**: Ready for Technical Review
```

## Example Claude Code Conversation

```
User: Research state management libraries for our React app. We need something lightweight but scalable.

Claude Code:
I'll conduct comprehensive research using GitHub MCP and Context7 MCP to evaluate state management options.

Let me start by searching for popular React state management libraries:

[Invokes mcp__github__search_repositories]
Query: "react state management stars:>5000 language:typescript"

Found 47 repositories. Let me analyze the top candidates:
1. reduxjs/redux-toolkit (9.8k stars)
2. pmndrs/zustand (34.2k stars)
3. pmndrs/jotai (15.1k stars)
4. mobxjs/mobx (26.8k stars)
5. facebookexperimental/Recoil (19.2k stars)
6. statelyai/xstate (25.1k stars)

Now analyzing each repository's health metrics:

[Invokes mcp__github__get_file_contents for each repo's package.json]
[Invokes mcp__github__list_issues to check maintenance]
[Invokes mcp__github__list_commits for activity metrics]

Results:
- Redux Toolkit: 156 commits last 3 months, 89 open issues (8hr avg response)
- Zustand: 89 commits last month, very responsive (12hr avg response)
- Jotai: 200+ commits last 3 months, 24hr response time

Now retrieving documentation via Context7 MCP:

[Invokes mcp__context7__resolve-library-id for "zustand"]
Resolved ID: /pmndrs/zustand

[Invokes mcp__context7__get-library-docs]
Retrieved: Getting started guide, API reference, TypeScript examples

Key finding: Zustand has only 4 core APIs vs Redux Toolkit's 15+

[Invokes WebSearch for performance benchmarks]
Found benchmark: https://github.com/jack-pope/react-state-library-benchmark

Performance data:
- Zustand: 1.2KB gzip, 2.3ms update latency
- Redux Toolkit: 12.4KB gzip, 4.1ms update latency
- Jotai: 3.1KB gzip, 2.8ms update latency

Based on your requirement for "lightweight but scalable":

**Recommendation: Zustand**

Reasons:
1. Smallest bundle (1.2KB vs 12.4KB for Redux)
2. Simplest API (4 core APIs)
3. Excellent TypeScript support
4. Scalable (used in production by Vercel, AWS Amplify)
5. Active maintenance (89 commits last month)

Alternative if you need more structure: Redux Toolkit
- Better for large teams (5+ devs)
- More opinionated patterns
- Better debugging tools

Would you like me to generate a full comparison report or create a proof-of-concept implementation?
```

## Related Examples

- **Frontend**: `frontend-nextjs/examples/03-global-state-management.md` - Implementation examples
- **Competitive Analysis**: `research-analysis/examples/02-competitive-analysis.md` - Market research patterns
- **Risk Assessment**: `research-analysis/examples/03-risk-assessment.md` - Technology risk evaluation

## Key Takeaways

1. **MCP Tool Synergy**: Combine GitHub MCP (repository data) + Context7 MCP (documentation) + WebSearch (benchmarks)
2. **Structured Research**: Follow systematic process: search → analyze → document → compare → recommend
3. **Data-Driven Decisions**: Use quantitative metrics (stars, downloads, bundle size, performance)
4. **Community Health Matters**: Active maintenance and responsive issues indicate healthy projects
5. **Documentation Quality**: Good docs (via Context7) indicate mature, production-ready libraries
6. **Performance Evidence**: Always seek benchmarks and performance data
7. **Ecosystem Evaluation**: Consider devtools, middleware, integrations, learning resources
8. **TypeScript First**: Evaluate TypeScript support quality for modern development
9. **Bundle Size Impact**: Critical for frontend performance, always measure
10. **Incremental Adoption**: Recommend gradual migration paths, not big-bang rewrites

This research methodology using MCP tools provides comprehensive, up-to-date, and actionable technology evaluations.
