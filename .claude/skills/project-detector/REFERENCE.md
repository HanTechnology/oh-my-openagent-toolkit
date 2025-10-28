# Project Detector - Technical Reference

> **Purpose**: Technical reference for the project-detector skill in the autonomous skills-based development system.
> **Related Skills**: pm-orchestrator (coordination), memory-manager (initialization), quality-controller (standards)
> **Configuration**: project-detection.yaml defines detection rules and scoring.

---

## Project Detector Skill Guidelines

### Core Responsibilities

**CRITICAL**: Operate with complete autonomy for project type detection

**Project Type Detection**
- **Automatic Classification**: Keyword-based scoring to classify projects into 6 categories
- **Scoring Algorithm**: Multi-dimensional analysis (keywords, frameworks, technologies)
- **Skill Recommendations**: Automatic skill team assembly based on project type
- **Memory Template Selection**: Project-type-specific memory structure
- **Quality Framework Mapping**: Quality standards based on project type

**Technology Leadership**
- Autonomous project type selection
- Intelligent fallback for ambiguous cases
- Dynamic reclassification support
- Edge case handling and resolution

### Ultimate Goals
- **Accurate project detection** with intelligent scoring
- **Zero user confirmations required** for type classification
- Seamless integration with pm-orchestrator for team assembly

---

## Skill Coordination

### Autonomous Operation
This skill operates with **complete autonomy**, requiring **zero user confirmations** for:
- Project type classification
- Scoring and threshold evaluation
- Skill team recommendations
- Memory template selection
- Quality framework selection
- Fallback type selection

### Skill Invocation Context
This skill is automatically invoked by Claude when:
- User provides initial project description
- pm-orchestrator requests project type detection
- Context matches: project initialization, type classification needed

### Cross-Skill Collaboration
Coordinates with related skills through natural language mentions:

**pm-orchestrator**:
- Receives user project description
- Returns detected type and skill recommendations
- Coordinates initial project setup
- Provides classification results for team assembly

**memory-manager**:
- Provides memory template selection for project type
- Coordinates memory structure initialization
- Supports dynamic reclassification if needed

**quality-controller**:
- Provides quality framework selection for project type
- Ensures appropriate quality standards applied
- Coordinates quality target setting

### Coordination Pattern
1. **Natural Language Mentions**: pm-orchestrator mentions project-detector for classification
2. **Automatic Detection**: Classification happens autonomously
3. **Result Handoff**: Results passed to pm-orchestrator for team assembly
4. **Zero User Confirmation**: All detection happens autonomously

---

## Detection Algorithm Overview

The project detection system uses keyword-based scoring to automatically classify development projects into one of six categories. This enables automatic assembly of the appropriate development skill team.

## Detection Algorithm Details

### Scoring Formula

```
Total Score = (Keyword Matches × 0.40) + (Framework Matches × 0.35) + (Technology Matches × 0.25)
Maximum Score = 100 points
Minimum Threshold = 30 points
```

### Matching Process

1. **Text Normalization**:
   - Convert user request to lowercase
   - Tokenize into individual words and phrases
   - Remove common stop words

2. **Keyword Matching** (40 points max):
   - Match against project_type.keywords arrays
   - Examples: "web app", "website", "dashboard", "mobile", "AI", "machine learning"
   - Partial matches count (e.g., "webapp" matches "web app")
   - Case-insensitive matching

3. **Framework Matching** (35 points max):
   - Match against project_type.frameworks arrays
   - Examples: "Next.js", "React", "Flutter", "TensorFlow", "Express"
   - Exact name matching (case-insensitive)
   - Version numbers ignored (e.g., "Next.js 15" matches "Next.js")

4. **Technology Matching** (25 points max):
   - Match against project_type.technologies arrays
   - Examples: "TypeScript", "Docker", "PostgreSQL", "WebSocket", "CUDA"
   - Category-based matching (databases, APIs, protocols, etc.)

### Decision Logic

```
IF total_score >= 30:
    selected_type = highest_scoring_type
ELSE:
    selected_type = fallback_type (web_application)

RETURN {
    "detected_type": selected_type,
    "score": total_score,
    "recommended_skills": auto_experts[selected_type],
    "memory_template": memory_templates[selected_type],
    "quality_framework": quality_frameworks[selected_type]
}
```

## Project Type Definitions

### 1. Web Application
**Indicators**:
- Keywords: web app, website, dashboard, portal, platform, SaaS
- Frameworks: Next.js, React, Vue, Angular, Svelte
- Technologies: SSR, SSG, ISR, SEO, responsive design

**Common Patterns**:
- "Create a Next.js landing page"
- "Build a React dashboard with authentication"
- "Develop a corporate website with CMS"

### 2. AI/ML System
**Indicators**:
- Keywords: AI, machine learning, deep learning, neural network, model
- Frameworks: TensorFlow, PyTorch, scikit-learn, Keras, Hugging Face
- Technologies: GPU, CUDA, model training, inference, data pipeline

**Common Patterns**:
- "Build an image classification model"
- "Create a chatbot with NLP"
- "Develop a recommendation system"

### 3. Mobile Application
**Indicators**:
- Keywords: mobile, app, iOS, Android, cross-platform
- Frameworks: React Native, Flutter, Expo, Ionic
- Technologies: native modules, push notifications, offline storage

**Common Patterns**:
- "Create a React Native shopping app"
- "Build a Flutter fitness tracker"
- "Develop an iOS/Android social app"

### 4. API/Microservice
**Indicators**:
- Keywords: API, microservice, REST, GraphQL, backend service
- Frameworks: Express, Nest.js, FastAPI, Flask, Spring Boot
- Technologies: OpenAPI, Swagger, gRPC, message queues

**Common Patterns**:
- "Build a RESTful API for user management"
- "Create a GraphQL service"
- "Develop microservices architecture"

### 5. Data Processing System
**Indicators**:
- Keywords: data pipeline, ETL, big data, data processing, analytics
- Frameworks: Apache Spark, Apache Kafka, Airflow, Pandas
- Technologies: stream processing, batch processing, data warehouse

**Common Patterns**:
- "Build a data pipeline for analytics"
- "Create an ETL process for data migration"
- "Develop real-time data processing system"

### 6. Desktop Application
**Indicators**:
- Keywords: desktop, GUI, native application, desktop app
- Frameworks: Electron, Tauri, Qt, JavaFX
- Technologies: system integration, file system, IPC

**Common Patterns**:
- "Create an Electron desktop app"
- "Build a cross-platform GUI tool"
- "Develop a native desktop application"

## Skill Team Assembly Logic

Based on detected project type, the system recommends specific skills:

### Core Skills (All Projects)
- **pm-orchestrator**: Always included for coordination
- **mcp-tools-orchestrator**: Always available for tool support

### Conditional Skills

**Frontend-Required Projects** (web_application, mobile_application, desktop_application):
- **frontend-nextjs**: UI development
- **qa-testing**: UI/UX testing

**Backend-Required Projects** (web_application, ai_ml_system, mobile_application, api_microservice, data_processing_system):
- **backend-nestjs**: API/service development

**Integration-Required Projects** (web_application, api_microservice):
- **fullstack-integration**: System architecture

**System Development Projects** (ai_ml_system, data_processing_system):
- **systemdev-specialist**: AI/ML, high-performance systems

**Research-Intensive Projects** (ai_ml_system, data_processing_system):
- **research-analysis**: Technology and architecture research

**Deployment-All Projects**:
- **devops-deployment**: Containerization, cloud deployment

## Memory Template Mapping

Each project type has a corresponding memory template structure:

- **web_application** → "web-app" template (.memory/ui-components.md, .memory/api-endpoints.md, .memory/user-flows.md)
- **ai_ml_system** → "ai-system" template (.memory/model-architecture.md, .memory/data-pipeline.md, .memory/training-requirements.md)
- **mobile_application** → "mobile-app" template (.memory/platform-requirements.md, .memory/performance-targets.md)
- **api_microservice** → "api-service" template (.memory/service-architecture.md, .memory/endpoint-specifications.md)
- **data_processing_system** → "data-system" template (.memory/data-flow-architecture.md, .memory/processing-pipeline.md)
- **desktop_application** → "desktop-app" template (.memory/platform-integration.md, .memory/ui-framework.md)

## Quality Framework Mapping

Each project type has specific quality standards:

- **web_application**: TypeScript coverage 95%, Core Web Vitals (LCP<2.5s, FID<100ms, CLS<0.1), Lighthouse 90+
- **ai_ml_system**: Model accuracy >90%, inference latency <100ms, data completeness >95%
- **mobile_application**: App launch time <3s, memory usage <150MB, battery efficiency optimized
- **api_microservice**: Response time <200ms, throughput >1000 RPS, availability 99.9%
- **data_processing_system**: Data accuracy >99%, processing throughput optimized, error handling comprehensive
- **desktop_application**: Launch time <5s, cross-platform compatibility, performance optimized

## Edge Cases and Handling

### Ambiguous Projects
If a user request contains indicators for multiple project types:
- Calculate scores for all types
- Select highest score
- If scores are close (within 10 points), prefer web_application as most common

### Insufficient Information
If user request is very brief or vague:
- Score will be low (likely <30 points)
- Fallback to web_application (most versatile)
- pm-orchestrator can request clarification if needed

### Multi-Type Projects
For projects combining multiple types (e.g., "AI-powered web app"):
- Both types will score high
- Select primary type (highest score)
- pm-orchestrator coordinates skills from both categories

### Dynamic Reclassification
If project requirements change during development:
- project-detector can be re-invoked
- New skill recommendations generated
- memory-manager updates project type context

## Configuration File Reference

The **project-detection.yaml** file contains:

```yaml
project_types:
  web_application:
    keywords: [...]
    frameworks: [...]
    technologies: [...]

  ai_ml_system:
    keywords: [...]
    frameworks: [...]
    technologies: [...]

  # ... other project types

scoring_weights:
  keywords: 40
  frameworks: 35
  technologies: 25

minimum_score: 30
fallback_type: "web_application"

auto_experts:
  web_application: ["pm", "frontend", "backend", "fullstack", "qa", "devops", "mcp"]
  # ... mappings for all types

memory_templates:
  web_application: "web-app"
  # ... templates for all types

quality_frameworks:
  web_application: "web_application"
  # ... frameworks for all types
```

Refer to project-detection.yaml for complete keyword lists and configurations.

---

## Related Skills and Resources

**Related Skills**:
- **pm-orchestrator**: Receives detection results, coordinates team assembly
- **memory-manager**: Uses memory template selection for project initialization
- **quality-controller**: Uses quality framework selection for standards setup
- **All specialist skills**: Activated based on project type detection

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Configuration**: project-detection.yaml defines all detection rules, scoring weights, and mappings

---

This technical reference guide supports autonomous project type detection, skill team recommendations, and the skills-based development system.
