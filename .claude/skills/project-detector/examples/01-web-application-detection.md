# Web Application Detection Example

## User Request

"Create a Next.js dashboard with user authentication and data visualization"

## Detection Process

### Step 1: Extract Keywords
```
Extracted keywords (lowercase):
- "nextjs" (framework)
- "dashboard" (keyword)
- "user authentication" → "authentication" (keyword)
- "data visualization" → "visualization" (keyword)
```

### Step 2: Match Against Project Types

#### Web Application Match
```yaml
Keywords Match (40 points max):
- "dashboard": ✅ Match (in web_application keywords)
- "nextjs": ✅ Match (framework, count as keyword)
Points: 40/40

Frameworks Match (35 points max):
- "nextjs": ✅ Match (in web_application frameworks)
Points: 35/35

Technologies Match (25 points max):
- Implied: "javascript", "typescript", "react" (Next.js stack)
Points: 25/25

Total Score: 100/100
```

#### Other Type Matches
```
AI/ML System: 0 (no AI/ML keywords)
Mobile Application: 0 (no mobile keywords)
API/Microservice: 15 (authentication implies API)
Data Processing: 10 (data visualization implies some data processing)
Desktop Application: 0 (no desktop keywords)
```

### Step 3: Type Selection

**Selected Type**: `web_application`
**Confidence**: Very High (100/100)
**Reasoning**: Perfect match with Next.js framework and dashboard keywords

## Recommended Skills

Based on web_application auto-skills:
```yaml
auto_skills: ["pm-orchestrator", "frontend-nextjs", "backend-nestjs", "fullstack-integration", "qa-testing", "devops-deployment", "mcp-tools-orchestrator"]
```

**Always Included**: pm-orchestrator, mcp-tools-orchestrator
**Conditional Included**:
- frontend-nextjs (Next.js mentioned)
- backend-nestjs (user authentication requires backend)
- fullstack-integration (frontend + backend coordination)
- qa-testing (quality assurance)
- devops-deployment (deployment required)

## Memory Template

Selected: `web-app`

Creates memory files:
- active-context.md
- decisions.md
- collaboration.log.md
- project-state.json
- ui-components.md
- api-endpoints.md
- user-flows.md
- performance-targets.md
- test-coverage.md
- deployment-config.md

## Workflow Priority

```yaml
workflow_priority:
  1. requirements_analysis
  2. architecture_design
  3. frontend_implementation (parallel)
  4. backend_implementation (parallel)
  5. integration_orchestration
  6. deployment_pipeline
  7. quality_assurance
```

## Output

```
Project Type Detected: Web Application
Confidence: Very High (score: 100/100)

Recommended Skills:
✅ pm-orchestrator (coordination)
✅ frontend-nextjs (Next.js 15.5+ development)
✅ backend-nestjs (API and authentication)
✅ fullstack-integration (system architecture)
✅ qa-testing (quality assurance)
✅ devops-deployment (Docker, cloud deployment)
✅ mcp-tools-orchestrator (tool coordination)

Technology Stack Recommendations:
- Frontend: Next.js 15.5+, React 19, Tailwind CSS 4.1+, Shadcn/ui
- Backend: Nest.js, PostgreSQL, JWT authentication
- Testing: Playwright MCP (E2E), Jest (unit)
- Deployment: Vercel (frontend), Railway (backend)

Memory System: Initialized with web-app template
Workflow: Starting with requirements_analysis

Next Steps: Analyzing requirements for dashboard features and authentication flows
```

## Validation

**Is Detection Correct?** ✅ Yes
- User wants a web application (dashboard)
- Next.js explicitly mentioned
- Requires frontend + backend
- Standard web app workflow applies

**Are Recommended Skills Appropriate?** ✅ Yes
- frontend-nextjs: Handles Next.js development
- backend-nestjs: Handles authentication API
- fullstack-integration: Coordinates architecture
- All necessary skills included

**Is Technology Stack Appropriate?** ✅ Yes
- Next.js 15.5+ matches user request
- Authentication requires backend API
- Dashboard requires data visualization libraries
- Stack is production-ready
