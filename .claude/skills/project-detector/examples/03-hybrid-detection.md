# Hybrid Project Detection Example

## User Request

"Create a Next.js e-commerce platform with AI-powered product recommendations"

## Detection Process

### Step 1: Extract Keywords
```
Extracted keywords (lowercase):
- "nextjs" (framework)
- "e-commerce" → "ecommerce" (keyword)
- "platform" (keyword)
- "ai-powered" → "ai" (keyword)
- "product recommendations" → "recommendation" (keyword)
```

### Step 2: Match Against Project Types

#### Web Application Match
```yaml
Keywords Match (40 points max):
- "nextjs": ✅ Match
- "ecommerce": ✅ Match (web app keyword)
- "platform": ✅ Match (web service)
Points: 40/40

Frameworks Match (35 points max):
- "nextjs": ✅ Match
Points: 35/35

Technologies Match (25 points max):
- Implied: "javascript", "typescript", "react"
Points: 25/25

Total Score: 100/100
```

#### AI/ML System Match
```yaml
Keywords Match (40 points max):
- "ai": ✅ Match
- "recommendation": ✅ Match ("recommendation system" in ai_ml_system keywords)
Points: 30/40

Frameworks Match (35 points max):
- None explicitly mentioned
Points: 0/35

Technologies Match (25 points max):
- Implied: "python" (for recommendation engine)
Points: 10/25

Total Score: 40/100
```

#### Other Type Matches
```
Mobile Application: 0 (no mobile keywords)
API/Microservice: 20 (platform implies backend services)
Data Processing: 15 (recommendations need data)
Desktop Application: 0 (no desktop keywords)
```

### Step 3: Hybrid Project Detection

**Primary Type**: `web_application` (100/100)
**Secondary Type**: `ai_ml_system` (40/100)

**Detection Mode**: Hybrid (primary_secondary)
**Reasoning**:
- Core project is a web application (e-commerce platform)
- AI recommendation is a feature, not the primary focus
- Recommendation engine is a specialized component

## Recommended Skills

Combined from both types with de-duplication:

**From web_application**:
- pm-orchestrator
- frontend-nextjs
- backend-nestjs
- fullstack-integration
- qa-testing
- devops-deployment
- mcp-tools-orchestrator

**Additionally from ai_ml_system**:
- systemdev-specialist (for recommendation engine)
- research-analysis (for recommendation algorithm research)

**Final Skill Team**:
```yaml
skills:
  - pm-orchestrator (coordination)
  - frontend-nextjs (Next.js e-commerce UI)
  - backend-nestjs (e-commerce API, business logic)
  - systemdev-specialist (AI recommendation engine)
  - fullstack-integration (system architecture, integration)
  - research-analysis (recommendation algorithm research)
  - qa-testing (testing across web + AI components)
  - devops-deployment (deployment with AI services)
  - mcp-tools-orchestrator (tool coordination)
```

## Memory Template

**Primary**: `web-app`
**Enhanced with AI-specific files**:
- model-architecture.md (recommendation engine design)
- system-specs.md (recommendation service specs)

Combined memory structure:
```
.memory/
├── active-context.md
├── decisions.md
├── collaboration.log.md
├── project-state.json
├── ui-components.md (web app)
├── api-endpoints.md (web app)
├── user-flows.md (web app)
├── performance-targets.md (web app)
├── model-architecture.md (AI component)
├── system-specs.md (AI component)
├── test-coverage.md
└── deployment-config.md
```

## Architecture Strategy

### Two-Tier Architecture

**Tier 1: E-commerce Web Application** (Primary)
- Frontend: Next.js 15.5+ with product catalog, cart, checkout
- Backend: Nest.js with product management, orders, users
- Database: PostgreSQL for e-commerce data

**Tier 2: AI Recommendation Service** (Secondary/Specialized)
- Technology: Python + scikit-learn/TensorFlow (collaborative filtering)
- API: FastAPI for recommendation endpoint
- Integration: Backend calls recommendation service
- Data: User behavior tracking, product features

### Integration Pattern
```
User browses product
    ↓
Frontend displays product
    ↓
Frontend requests recommendations
    ↓
Backend API (/recommendations)
    ↓
Nest.js calls AI Service
    ↓
AI Recommendation Engine
    ↓
Returns recommended products
    ↓
Backend enriches with product data
    ↓
Frontend displays recommendations
```

## Workflow Priority

Adjusted for hybrid project:
```yaml
workflow_priority:
  1. requirements_analysis (both web + AI requirements)
  2. research_analysis (recommendation algorithm research, parallel)
  3. architecture_design (integrated architecture for web + AI)
  4. frontend_implementation (e-commerce UI)
  5. backend_implementation (e-commerce API)
  6. system_development (recommendation engine)
  7. integration_orchestration (connect web app + AI service)
  8. deployment_pipeline (deploy both tiers)
  9. quality_assurance (test integrated system)
```

## Output

```
Project Type Detected: Hybrid Project
Primary Type: Web Application (score: 100/100)
Secondary Type: AI/ML System (score: 40/100)
Confidence: High (hybrid detection)

Project Classification: E-commerce Web Application with AI Features

Recommended Skills:
✅ pm-orchestrator (coordination and planning)
✅ frontend-nextjs (e-commerce UI, product catalog, cart)
✅ backend-nestjs (e-commerce API, business logic, orders)
✅ systemdev-specialist (AI recommendation engine)
✅ fullstack-integration (web app + AI service architecture)
✅ research-analysis (recommendation algorithm research)
✅ qa-testing (testing across all components)
✅ devops-deployment (Docker deployment for both tiers)
✅ mcp-tools-orchestrator (tool coordination)

Technology Stack Recommendations:

Web Application Tier:
- Frontend: Next.js 15.5+, React 19, Tailwind CSS 4.1+, Shadcn/ui
- Backend: Nest.js, PostgreSQL
- E-commerce: Stripe/PayPal integration, cart management
- Authentication: JWT

AI Recommendation Tier:
- Framework: scikit-learn (collaborative filtering) or TensorFlow
- API: FastAPI (Python)
- Algorithm: Collaborative filtering, content-based, or hybrid
- Data: User behavior tracking, product features

Integration:
- Backend-to-AI: REST API communication
- Caching: Redis for recommendation caching
- Fallback: Rule-based recommendations if AI unavailable

Quality Requirements:
- Web App: Standard web application metrics
- Recommendation Quality: Precision@K >0.3, diverse recommendations
- Recommendation Latency: <200ms for recommendation call
- Overall API Response: <500ms including recommendations

Memory System: Initialized with hybrid web-app + AI template
Workflow: Starting with requirements_analysis (both web + AI requirements)

Next Steps:
1. Analyze e-commerce requirements (product catalog, cart, checkout)
2. Research recommendation algorithms (collaborative vs content-based)
3. Design integrated architecture (web app + recommendation service)
4. Plan phased implementation (web app first, then AI enhancement)
```

## Validation

**Is Detection Correct?** ✅ Yes
- Primary focus is e-commerce web application
- AI recommendations are an enhancement feature
- Hybrid detection appropriate

**Are Recommended Skills Appropriate?** ✅ Yes
- Core web development skills for e-commerce
- systemdev-specialist for recommendation engine
- research-analysis for algorithm selection
- All skills have clear responsibilities

**Is Architecture Strategy Appropriate?** ✅ Yes
- Separation of concerns (web app vs AI service)
- AI service can be developed/deployed independently
- Clear integration pattern
- Scalable architecture

## Implementation Strategy

### Phase 1: Core E-commerce (Weeks 1-4)
1. Frontend: Product catalog, cart, checkout
2. Backend: Product management, order processing, user accounts
3. Payment integration
4. Basic "popular products" recommendation (rule-based)

### Phase 2: AI Enhancement (Weeks 5-6)
1. Collect user behavior data
2. Develop recommendation model
3. Create recommendation service
4. Integrate with backend
5. A/B testing setup

### Benefits of Hybrid Approach
- ✅ Can launch e-commerce without AI (Phase 1 complete)
- ✅ AI can be developed in parallel or after launch
- ✅ Independent scaling of web app and AI service
- ✅ Easier testing and deployment
- ✅ Graceful degradation if AI service unavailable

## Recommendation Algorithm Options

### Option 1: Collaborative Filtering
- **Pros**: Discovers patterns, personalized
- **Cons**: Cold start problem, needs user data
- **Best for**: Established platforms with user history

### Option 2: Content-Based Filtering
- **Pros**: No cold start, works immediately
- **Cons**: Limited discovery, needs product features
- **Best for**: New platforms, specific product features

### Option 3: Hybrid Approach (Recommended)
- Combine collaborative + content-based
- Content-based for new users
- Collaborative filtering for returning users
- Fallback to popularity-based

## Expected Outcomes

**E-commerce Platform**:
- Full product catalog with search and filters
- Shopping cart and checkout flow
- Order management
- User accounts
- Payment processing

**AI Recommendations**:
- "Recommended for you" section
- "Customers also bought" suggestions
- "Similar products" recommendations
- Personalized homepage

**Performance Targets**:
- Page load: <2s
- Checkout flow: <5s end-to-end
- Recommendation generation: <200ms
- 99.9% uptime for core e-commerce
- 99% uptime for recommendations (graceful degradation)
