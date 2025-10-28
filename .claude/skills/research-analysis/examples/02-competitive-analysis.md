# Competitive Analysis Using WebSearch and GitHub MCP

## Overview

This example demonstrates comprehensive competitive analysis using WebSearch for market research and GitHub MCP for technical feature analysis. Research analysts use this approach to understand competitive landscape, identify differentiation opportunities, and inform product strategy.

**Analysis Framework**:
1. Market Landscape Mapping
2. Feature Comparison Matrix
3. Technical Architecture Analysis
4. Pricing and Business Model Research
5. Customer Sentiment Analysis
6. Differentiation Opportunities

**Tools Used**:
- **WebSearch**: Market data, customer reviews, pricing, press releases
- **GitHub MCP**: Open-source competitors, feature analysis, technical depth
- **Playwright MCP**: Competitor website analysis, UX research

## Competitive Analysis Example: SaaS Project Management Tools

### Step 1: Identify Competitors

```typescript
// scripts/identify-competitors.ts
/**
 * Systematic competitor identification
 */

interface Competitor {
  name: string;
  website: string;
  category: 'direct' | 'indirect' | 'potential';
  githubOrg?: string;
  marketPosition: 'leader' | 'challenger' | 'niche' | 'emerging';
}

async function identifyCompetitors(productCategory: string): Promise<Competitor[]> {
  return {
    prompt_for_claude: `
      Identify competitors in the "${productCategory}" category:

      1. Use WebSearch to find market leaders:
         - Query: "${productCategory} software comparison ${new Date().getFullYear()}"
         - Query: "${productCategory} alternatives"
         - Query: "best ${productCategory} tools"
         - Query: "site:g2.com ${productCategory}"
         - Query: "site:capterra.com ${productCategory}"

      2. Extract competitor lists from:
         - G2 comparison pages
         - Capterra directories
         - AlternativeTo.net
         - Product Hunt collections

      3. Categorize competitors:
         - Direct: Same target market and feature set
         - Indirect: Different approach, overlapping use cases
         - Potential: Adjacent markets that could expand

      4. For each competitor, gather:
         - Company name
         - Website URL
         - Funding/company size (if public)
         - Market position
         - GitHub organization (if open source or public repos)

      Return structured list for further analysis.
    `
  };
}

// Example output:
const competitorsList: Competitor[] = [
  {
    name: "Linear",
    website: "https://linear.app",
    category: "direct",
    githubOrg: "linear",
    marketPosition: "emerging"
  },
  {
    name: "Asana",
    website: "https://asana.com",
    category: "direct",
    marketPosition: "leader"
  },
  {
    name: "ClickUp",
    website: "https://clickup.com",
    category: "direct",
    marketPosition: "challenger"
  },
  {
    name: "Monday.com",
    website: "https://monday.com",
    category: "direct",
    marketPosition: "leader"
  },
  {
    name: "Notion",
    website: "https://notion.so",
    category: "indirect",
    marketPosition: "leader"
  }
];

export { identifyCompetitors, competitorsList };
```

### Step 2: Feature Comparison Matrix

```typescript
// scripts/feature-analysis.ts
/**
 * Comprehensive feature comparison
 */

interface FeatureSet {
  competitor: string;
  coreFeatures: {
    taskManagement: boolean;
    kanbanBoards: boolean;
    ganttCharts: boolean;
    timeTracking: boolean;
    resourceManagement: boolean;
    customFields: boolean;
    automation: boolean;
    integrations: number;  // count
    mobileApps: boolean;
    offlineMode: boolean;
  };
  collaboration: {
    comments: boolean;
    mentions: boolean;
    realTimeCollaboration: boolean;
    videoConferencing: boolean;
    sharedCalendar: boolean;
    guestAccess: boolean;
  };
  advanced: {
    customDashboards: boolean;
    advancedReporting: boolean;
    apiAccess: boolean;
    webhooks: boolean;
    customBranding: boolean;
    sso: boolean;
    auditLogs: boolean;
  };
}

async function analyzeFeatures(competitor: Competitor): Promise<FeatureSet> {
  return {
    prompt_for_claude: `
      Analyze features for ${competitor.name}:

      1. Official Website Analysis:
         Use WebSearch to find feature pages:
         - Query: "site:${competitor.website} features"
         - Query: "site:${competitor.website} pricing" (features often listed by tier)
         - Extract feature list from pricing/features pages

      2. Documentation Research:
         - Query: "site:${competitor.website} documentation"
         - Query: "${competitor.name} API documentation"
         - Check for API docs, integration guides

      3. Review Sites:
         Use WebSearch for user-reported features:
         - Query: "site:g2.com ${competitor.name} features"
         - Query: "site:capterra.com ${competitor.name} review"
         - Extract commonly mentioned features from reviews

      4. Comparison Articles:
         - Query: "${competitor.name} vs [our product] features"
         - Query: "${competitor.name} feature comparison"
         - Third-party comparisons often have detailed feature matrices

      5. GitHub Analysis (if applicable):
         If ${competitor.githubOrg} exists:
         - Use mcp__github__search_repositories to find public repos
         - Use mcp__github__get_file_contents to read README.md
         - Look for feature lists, roadmaps in repos
         - Check issue labels for feature requests

      6. Video Demos:
         - Query: "site:youtube.com ${competitor.name} demo"
         - Watch product tours to identify features

      Create comprehensive feature checklist with verification sources.
    `
  };
}

/**
 * Generate feature comparison matrix
 */

async function generateFeatureMatrix(competitors: Competitor[]): Promise<string> {
  return {
    prompt_for_claude: `
      Create feature comparison matrix in Markdown format:

      | Feature | ${competitors.map(c => c.name).join(' | ')} | Notes |
      |---------|${competitors.map(() => '-----').join('|')}|-------|
      | Task Management | ✓ | ✓ | ✓ | ✓ | All support |
      | Kanban Boards | ✓ | ✓ | ✓ | ✓ | Universal |
      | Gantt Charts | ✗ | ✓ | ✓ | ✓ | Linear lacks |
      | Time Tracking | ✗ | ✓ | ✓ | ✓ | Linear lacks |
      | Custom Fields | ✓ | ✓ | ✓ | ✓ | All support |
      | Automation | ✓ | ✓ | ✓ | ✓ | Varies in depth |
      | Integrations | 50+ | 200+ | 1000+ | 100+ | ClickUp leads |
      | API Access | ✓ | ✓ | ✓ | ✓ | All have APIs |
      | Offline Mode | ✗ | ✗ | ✓ | ✗ | ClickUp only |

      Use:
      - ✓ for available
      - ✗ for not available
      - ⚠ for partial/limited support
      - Actual numbers for countable features

      Include "Notes" column for important context.
    `
  };
}

export { analyzeFeatures, generateFeatureMatrix };
```

### Step 3: Pricing Analysis

```typescript
// scripts/pricing-analysis.ts
/**
 * Pricing and business model analysis
 */

interface PricingTier {
  name: string;
  price: number;  // monthly, USD
  annualPrice?: number;
  features: string[];
  limits: {
    users?: number;
    projects?: number;
    storage?: string;
  };
}

interface PricingModel {
  competitor: string;
  freeTier: PricingTier | null;
  tiers: PricingTier[];
  businessModel: 'freemium' | 'subscription' | 'per-seat' | 'usage-based' | 'hybrid';
  discounts: {
    annual: number;  // percentage
    nonprofits: boolean;
    education: boolean;
    startups: boolean;
  };
}

async function analyzePricing(competitor: Competitor): Promise<PricingModel> {
  return {
    prompt_for_claude: `
      Analyze pricing for ${competitor.name}:

      1. Direct Pricing Page:
         Use WebSearch:
         - Query: "site:${competitor.website} pricing"
         - Extract all pricing tiers
         - Note any annual vs monthly differences

      2. Free Tier Analysis:
         - Check if free tier exists
         - What are the limitations?
         - Is it time-limited or feature-limited?

      3. Enterprise Pricing:
         - Query: "${competitor.name} enterprise pricing"
         - Look for case studies mentioning costs
         - Check if "contact sales" or public pricing

      4. Historical Pricing:
         - Query: "${competitor.name} pricing change"
         - Query: "${competitor.name} price increase"
         - Identify pricing trends

      5. Discounts and Special Offers:
         - Check for startup programs
         - Educational discounts
         - Nonprofit pricing
         - Annual payment discounts

      6. Hidden Costs:
         - Add-on features with extra cost
         - Integration costs
         - Support tier costs
         - Implementation fees

      Create structured pricing model with all tiers and conditions.
    `
  };
}

/**
 * Generate pricing comparison
 */

async function generatePricingComparison(models: PricingModel[]): Promise<string> {
  return {
    prompt_for_claude: `
      Create pricing comparison table:

      ## Pricing Comparison

      ### Entry-Level Tier
      | Competitor | Free Tier | Starter Price | Users | Storage | Key Limitations |
      |------------|-----------|---------------|-------|---------|-----------------|
      | Linear | ✓ Unlimited | $8/user | Unlimited | 10GB | No Gantt, no time tracking |
      | Asana | ✓ Up to 15 | $10.99/user | Unlimited | 100GB | Limited automation |
      | ClickUp | ✓ Unlimited | $5/user | Unlimited | 100MB | Limited storage |
      | Monday.com | ✗ 14-day trial | $8/user | 3+ users | 5GB | Minimum 3 seats |

      ### Mid-Tier (Most Popular)
      | Competitor | Tier Name | Price/User | Key Features |
      |------------|-----------|------------|--------------|
      | Linear | Plus | $14 | Advanced automation, priority support |
      | Asana | Advanced | $24.99 | Advanced reporting, workload mgmt |
      | ClickUp | Unlimited | $9 | Unlimited storage, advanced dashboards |

      ### Value Analysis
      - Best Value for Small Teams: ClickUp ($5/user)
      - Best Free Tier: Linear (unlimited users)
      - Best for Enterprise: Asana (robust at scale)

      Calculate:
      - Cost for 10 users
      - Cost for 50 users
      - Cost for 200 users
      - Feature parity at each tier
    `
  };
}

export { analyzePricing, generatePricingComparison };
```

### Step 4: Customer Sentiment Analysis

```typescript
// scripts/sentiment-analysis.ts
/**
 * Customer sentiment and satisfaction analysis
 */

interface SentimentData {
  competitor: string;
  ratings: {
    g2: number;  // out of 5
    capterra: number;
    trustpilot?: number;
    averageRating: number;
  };
  reviewCount: {
    g2: number;
    capterra: number;
    total: number;
  };
  sentimentBreakdown: {
    positive: string[];  // common praise
    negative: string[];  // common complaints
    requested: string[];  // feature requests
  };
  nps?: number;  // Net Promoter Score if available
}

async function analyzeSentiment(competitor: Competitor): Promise<SentimentData> {
  return {
    prompt_for_claude: `
      Analyze customer sentiment for ${competitor.name}:

      1. Review Platforms:
         Use WebSearch to gather ratings:
         - Query: "site:g2.com ${competitor.name}"
         - Query: "site:capterra.com ${competitor.name}"
         - Query: "site:trustpilot.com ${competitor.name}"
         - Extract star ratings and review counts

      2. Positive Sentiment:
         - Query: "${competitor.name} best features"
         - Query: "${competitor.name} why we chose"
         - Query: "switched to ${competitor.name} from"
         - Identify common praise points from reviews

      3. Negative Sentiment:
         - Query: "${competitor.name} problems"
         - Query: "${competitor.name} worst features"
         - Query: "switched from ${competitor.name} to"
         - Identify common complaints and pain points

      4. Feature Requests:
         If GitHub available:
         - Use mcp__github__search_issues:
           q: "repo:${competitor.githubOrg}/* label:enhancement"
         - Analyze most-requested features

         Otherwise use WebSearch:
         - Query: "${competitor.name} feature request"
         - Query: "site:reddit.com ${competitor.name} missing feature"

      5. Customer Success Stories:
         - Query: "${competitor.name} case study"
         - Query: "${competitor.name} customer success"
         - Identify ideal customer profiles

      6. Support Quality:
         - Query: "${competitor.name} customer support review"
         - Query: "${competitor.name} response time"
         - Assess support satisfaction

      Synthesize into structured sentiment analysis with examples.
    `
  };
}

/**
 * Generate sentiment report
 */

async function generateSentimentReport(sentiments: SentimentData[]): Promise<string> {
  return {
    prompt_for_claude: `
      Create customer sentiment comparison:

      ## Customer Satisfaction Analysis

      ### Overall Ratings
      | Competitor | G2 Rating | Capterra | Reviews | Overall |
      |------------|-----------|----------|---------|---------|
      | Linear | 4.6/5 | N/A | 120 | 4.6 |
      | Asana | 4.3/5 | 4.5/5 | 9,500+ | 4.4 |
      | ClickUp | 4.7/5 | 4.6/5 | 3,800+ | 4.65 |
      | Monday.com | 4.6/5 | 4.6/5 | 8,200+ | 4.6 |

      ### Common Praise (Top 3 per competitor)
      **Linear**:
      1. "Incredibly fast and responsive interface"
      2. "Clean, minimalist design - no clutter"
      3. "Keyboard shortcuts save so much time"

      **Asana**:
      1. "Great for cross-functional teams"
      2. "Excellent reporting and dashboards"
      3. "Robust integration ecosystem"

      **ClickUp**:
      1. "Unbeatable value for price"
      2. "Highly customizable to any workflow"
      3. "All-in-one tool replaces 5 others"

      ### Common Complaints (Top 3 per competitor)
      **Linear**:
      1. "Missing Gantt charts"
      2. "No built-in time tracking"
      3. "Limited reporting for executives"

      **Asana**:
      1. "Expensive for large teams"
      2. "Can be overwhelming for beginners"
      3. "Automation is limited on lower tiers"

      **ClickUp**:
      1. "UI can feel cluttered with all features"
      2. "Occasional performance issues"
      3. "Learning curve due to customization"

      ### Most Requested Features
      Identify gaps and opportunities:
      - Linear users want: Time tracking, Gantt charts
      - Asana users want: Better mobile app, faster UI
      - ClickUp users want: Simplified UI, better docs

      ### Support Satisfaction
      - Fastest response: Linear (avg 2 hours)
      - Best documentation: Asana
      - Most community help: ClickUp (active Discord)
    `
  };
}

export { analyzeSentiment, generateSentimentReport };
```

### Step 5: Technical Architecture Analysis

```typescript
// scripts/technical-analysis.ts
/**
 * Technical stack and architecture analysis
 * (For competitors with open-source components or public tech stacks)
 */

interface TechStack {
  competitor: string;
  frontend: {
    framework: string[];
    stateManagement?: string;
    uiLibrary?: string;
  };
  backend: {
    language: string[];
    framework?: string[];
    database?: string[];
  };
  infrastructure: {
    hosting?: string;
    cdn?: string;
    monitoring?: string;
  };
  mobile: {
    ios?: string;  // Native, React Native, etc.
    android?: string;
  };
}

async function analyzeTechStack(competitor: Competitor): Promise<TechStack> {
  return {
    prompt_for_claude: `
      Analyze technical stack for ${competitor.name}:

      1. Job Postings Analysis:
         Use WebSearch:
         - Query: "${competitor.name} job openings engineer"
         - Query: "site:linkedin.com jobs ${competitor.name}"
         - Extract required tech skills from job descriptions
         - This reveals their tech stack

      2. BuiltWith Analysis:
         - Query: "site:builtwith.com ${competitor.website}"
         - Extract detected technologies

      3. Wappalyzer/SimilarTech:
         - Query: "${competitor.name} tech stack"
         - Find published technology profiles

      4. Engineering Blog:
         - Query: "site:${competitor.website} engineering blog"
         - Query: "${competitor.name} architecture"
         - Look for architecture decision records

      5. GitHub Analysis (if open source):
         If ${competitor.githubOrg}:
         - Use mcp__github__search_repositories to find repos
         - Use mcp__github__get_file_contents for package.json, go.mod, etc.
         - Analyze dependencies to infer stack

      6. Conference Talks:
         - Query: "site:youtube.com ${competitor.name} architecture"
         - Engineers often present their tech choices

      7. Network Analysis:
         Use Playwright MCP to visit ${competitor.website}:
         - Inspect loaded scripts (React, Vue, Angular detection)
         - Check API response headers (server info)
         - Analyze network requests (CDN, hosting)

      Create technical profile with confidence levels for each finding.
    `
  };
}

export { analyzeTechStack };
```

### Step 6: SWOT Analysis

```typescript
// scripts/swot-analysis.ts
/**
 * SWOT (Strengths, Weaknesses, Opportunities, Threats) Analysis
 */

interface SWOT {
  competitor: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];  // for them
  threats: string[];  // to them
}

async function generateSWOT(competitor: Competitor, allData: any): Promise<SWOT> {
  return {
    prompt_for_claude: `
      Generate SWOT analysis for ${competitor.name} based on:
      - Feature analysis
      - Pricing model
      - Customer sentiment
      - Technical architecture

      **Strengths** (what they do well):
      - Unique capabilities
      - Strong market position
      - Technical advantages
      - Customer loyalty factors

      **Weaknesses** (what they lack):
      - Missing features vs competitors
      - Customer complaints
      - Pricing disadvantages
      - Technical debt/limitations

      **Opportunities** (growth potential):
      - Underserved market segments
      - Emerging feature trends
      - Partnership possibilities
      - Geographic expansion

      **Threats** (risks to their position):
      - New entrants
      - Customer churn risks
      - Technology shifts
      - Competitive pressures

      Create actionable SWOT with specific examples.
    `
  };
}

export { generateSWOT };
```

### Final Competitive Analysis Report

```markdown
# Competitive Analysis Report: Project Management SaaS

## Executive Summary

**Analysis Date**: 2024-01-15
**Market Segment**: Project Management Software
**Competitors Analyzed**: Linear, Asana, ClickUp, Monday.com, Notion
**Key Finding**: Market fragmented by user type - technical teams (Linear), enterprise (Asana), SMBs (ClickUp)

## Market Landscape

### Market Leaders
1. **Asana** - Enterprise leader, 119,000 paying customers
2. **Monday.com** - SMB/Mid-market leader, 152,000 customers
3. **ClickUp** - Fast-growing challenger, 800,000 teams

### Emerging Players
1. **Linear** - Technical teams, product-led growth
2. **Notion** - Indirect competitor, all-in-one workspace

## Feature Gap Analysis

### Differentiation Opportunities
Based on feature matrix analysis:

1. **AI-Powered Features** - Currently limited across all competitors
   - ClickUp has basic AI, but shallow integration
   - Opportunity: Deep AI integration for task prioritization, time estimation, risk detection

2. **Real-time Collaboration** - Linear excels, others lag
   - Linear's instant updates create superior UX
   - Opportunity: Match or exceed Linear's collaboration speed

3. **Advanced Analytics** - Asana leads, others lack depth
   - Opportunity: Developer-friendly analytics API
   - Custom metrics and KPIs

### Feature Comparison Matrix

| Feature Category | Linear | Asana | ClickUp | Monday | Our Opportunity |
|------------------|--------|-------|---------|--------|-----------------|
| Task Management | ✓✓✓ | ✓✓✓ | ✓✓✓ | ✓✓✓ | Baseline |
| Gantt Charts | ✗ | ✓✓ | ✓✓✓ | ✓✓✓ | Not differentiating |
| Time Tracking | ✗ | ✓ | ✓✓✓ | ✓✓ | Built-in advanced |
| Automation | ✓✓ | ✓✓✓ | ✓✓✓ | ✓✓✓ | AI-powered automation |
| Integrations | ✓✓ (50+) | ✓✓✓ (200+) | ✓✓✓✓ (1000+) | ✓✓✓ (100+) | Quality over quantity |
| Real-time Collab | ✓✓✓✓ | ✓✓ | ✓✓ | ✓✓ | Match Linear |
| API | ✓✓✓ | ✓✓ | ✓✓ | ✓✓ | GraphQL + REST |
| Mobile Apps | ✓✓✓ | ✓✓ | ✓✓ | ✓✓ | Native performance |
| AI Features | ✗ | ✗ | ✓ | ✗ | **Core differentiator** |

Legend: ✓✓✓✓ = Excellent, ✓✓✓ = Good, ✓✓ = Average, ✓ = Basic, ✗ = Missing

## Pricing Analysis

### Price Positioning

| Competitor | Entry Price | Mid-Tier | Enterprise | Target Market |
|------------|-------------|----------|------------|---------------|
| Linear | $8/user | $14/user | Custom | Technical teams |
| Asana | $10.99/user | $24.99/user | Custom | Enterprise |
| ClickUp | $5/user | $9/user | $19/user | SMB/Agencies |
| Monday.com | $8/user | $10/user | $16/user | SMB/Mid-market |

### Recommended Positioning
- Entry: $7/user (undercut slightly)
- Professional: $15/user (match value)
- Enterprise: Custom (competitive with Asana)

**Rationale**:
- Compete on value, not lowest price
- Professional tier is decision point
- Enterprise custom pricing for flexibility

## Customer Sentiment Insights

### What Customers Love

**Linear** (4.6/5 - 120 reviews):
- "Blazing fast performance"
- "Keyboard shortcuts everywhere"
- "Clean, minimal interface"

**Asana** (4.4/5 - 9,500+ reviews):
- "Excellent for cross-functional teams"
- "Best-in-class reporting"
- "Robust integration ecosystem"

**ClickUp** (4.65/5 - 3,800+ reviews):
- "Best value for money"
- "Replaces 5 tools in one"
- "Highly customizable"

### What Customers Hate

**Common Complaints Across All**:
1. "Too complex for simple use cases"
2. "Mobile apps lag behind web"
3. "Pricing gets expensive at scale"

**Linear-Specific**:
- Missing time tracking
- No Gantt charts
- Limited reporting

**Opportunity**: Build comprehensive tool that's still simple for basic use.

## Technical Differentiation

### Technology Stack Comparison

| Aspect | Linear | Asana | ClickUp | Opportunity |
|--------|--------|-------|---------|-------------|
| Frontend | React | React | React+Vue | Modern React 18 |
| State Mgmt | GraphQL | REST | REST | GraphQL + Subscriptions |
| Real-time | WebSockets | Polling | WebSockets | WebSockets + CRDT |
| Mobile | React Native | Native | React Native | Native (better perf) |
| Performance | Excellent | Good | Fair | Match Linear |

### Performance Benchmarks
- Linear: Sub-100ms interactions (best)
- Asana: 200-500ms (acceptable)
- ClickUp: 300-800ms (slower)

**Target**: Match Linear's < 100ms interaction latency

## SWOT Summary

### Our Competitive Position

**Strengths to Leverage**:
1. AI-first approach (competitors lack this)
2. Technical team building for technical teams
3. Modern tech stack from day one
4. No legacy codebase constraints

**Weaknesses to Address**:
1. No brand recognition (yet)
2. Limited initial integration ecosystem
3. Smaller team vs incumbents

**Opportunities to Pursue**:
1. Developer-first features (CI/CD integration, GitHub sync)
2. AI-powered insights (risk detection, estimation)
3. Superior mobile experience
4. Modern collaboration (video, async)

**Threats to Mitigate**:
1. Incumbents adding AI features
2. Linear expanding feature set
3. Economic downturn reducing software spend

## Strategic Recommendations

### 1. Target Market Selection
**Primary**: Engineering and product teams (10-50 people)
- Underserved by Asana (too generic)
- Growing out of Linear (missing features)
- Prefer quality over ClickUp's quantity

### 2. Differentiation Strategy
**Core Differentiators**:
1. AI-powered project intelligence
2. Developer-first integrations (GitHub, GitLab, CI/CD)
3. Linear-quality UX + Asana-level features
4. Modern real-time collaboration

### 3. Go-to-Market Approach
- Product-led growth (like Linear)
- Free tier with generous limits
- Technical content marketing
- GitHub integration as hook

### 4. Roadmap Priorities

**Phase 1 (Months 1-6)**: Feature Parity
- Core task management
- Real-time collaboration
- GitHub integration
- Basic automation

**Phase 2 (Months 7-12)**: AI Differentiation
- AI task estimation
- Smart prioritization
- Risk detection
- Automated reporting

**Phase 3 (Months 13-18)**: Enterprise Features
- Advanced permissions
- SSO
- Audit logs
- Custom branding

## Appendix: Research Methodology

**Data Sources**:
- WebSearch: 150+ queries for reviews, pricing, features
- GitHub MCP: Repository analysis for Linear (open-source components)
- Playwright MCP: Website analysis for UX patterns
- G2.com: 22,500+ customer reviews analyzed
- Capterra: 15,000+ reviews analyzed

**Analysis Period**: December 2023 - January 2024

**Confidence Levels**:
- Pricing data: High (publicly available)
- Feature data: High (verified via trials)
- Sentiment data: High (thousands of reviews)
- Technical stacks: Medium (inferred from job postings, blogs)

---

**Report Prepared By**: Claude Code Research Team
**Next Review**: Quarterly (April 2024)
```

## Related Examples

- **Technology Research**: `research-analysis/examples/01-technology-stack-research.md` - Tech evaluation methodology
- **Risk Assessment**: `research-analysis/examples/03-risk-assessment.md` - Competitive risk analysis

## Key Takeaways

1. **Multi-Source Research**: Combine WebSearch (market data) + GitHub MCP (technical analysis) + Playwright MCP (UX analysis)
2. **Structured Framework**: Use consistent framework (features, pricing, sentiment, technical, SWOT)
3. **Customer Voice**: Reviews reveal real pain points and opportunities
4. **Quantitative + Qualitative**: Numbers (ratings, prices) + insights (complaints, praise)
5. **Technical Depth**: For tech products, understand competitor architecture
6. **Pricing Psychology**: Position strategically, not just by cost
7. **Differentiation Clarity**: Identify specific, defensible advantages
8. **Continuous Updates**: Markets change, research quarterly
9. **Actionable Insights**: Convert analysis into strategy and roadmap
10. **Source Transparency**: Document confidence levels and data sources

Competitive analysis drives product strategy, positioning, and market differentiation.
