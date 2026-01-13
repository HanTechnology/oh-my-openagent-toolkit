---
name: project-detector
version: "1.0.0"
description: |
  Automatic project type detection and skill team assembly specialist.

  This skill is automatically invoked when:
  - User mentions: "new project", "build", "create", "develop", unclear project description
  - Project requires: Type classification, technology stack identification, skill team recommendation
  - Context involves: Keyword analysis, framework detection, hybrid project handling

  Core expertise:
  - Project type classification (7 types: web, mobile, API, AI/ML, data, desktop, Rust)
  - Keyword-based scoring algorithm (keywords 40%, frameworks 35%, technologies 25%)
  - Hybrid project detection (multiple types >40 score, primary-secondary handling)
  - Skill team assembly (auto_experts mapping based on detected type)
  - Technology stack inference (framework → technology → project type)
  - Ambiguity resolution (Deep Thinking for <50 score projects)
  - File pattern recognition (package.json, Cargo.toml, requirements.txt)

  Technology stack:
  - project-detection.yaml configuration file
  - Scoring algorithm (minimum threshold: 30 points)
  - Fallback type handling (web_application default)
  - Multi-type detection support

  Related skills: pm-orchestrator (receives classification), all domain skills (assembly targets)

category: core

triggers:
  keywords:
    - "new project"
    - "build"
    - "create"
    - "develop"
    - "start"
    - "setup"
  file_patterns:
    - "package.json"
    - "Cargo.toml"
    - "requirements.txt"
    - "pyproject.toml"
    - "pubspec.yaml"
  project_types:
    - "web_application"
    - "mobile_application"
    - "api_microservice"
    - "ai_ml_system"
    - "data_processing_system"
    - "desktop_application"
    - "rust_systems"
  explicit_mention: false

inputs:
  required:
    - name: "user_request"
      type: "string"
      description: "User's project description or requirements"
  optional:
    - name: "existing_files"
      type: "array"
      description: "Existing project files for pattern matching"

outputs:
  artifacts:
    - name: "detected_type"
      type: "string"
      description: "Classified project type"
    - name: "recommended_skills"
      type: "array"
      description: "List of recommended skills for the project"
  memory_updates:
    - ".memory/core/project.json"

dependencies:
  skills:
    - skill: "pm-orchestrator"
      relationship: "serves"
      reason: "Provides classification for team assembly"
  workflows: []
  memory_files: []

risk_level: low
execution_mode: autonomous
parallel_safe: true
idempotent: true

allowed-tools:
  - Read
---

# Project Detector - Automatic Project Type Detection

**Purpose**: Automatically detect project type from user requirements and recommend appropriate development skills for the project.

## How Project Detection Works

This skill implements a sophisticated keyword-based scoring algorithm to classify projects into one of 6 types:

1. **web_application**: Web apps, dashboards, websites
2. **ai_ml_system**: AI models, machine learning, data analysis
3. **mobile_application**: Mobile apps (iOS/Android/React Native/Flutter)
4. **api_microservice**: RESTful APIs, GraphQL services, microservices
5. **data_processing_system**: Data pipelines, ETL, big data
6. **desktop_application**: Desktop GUI apps (Electron/Tauri)

## Detection Algorithm

### Scoring System (100 points maximum)
- **Keywords Match**: 40 points
- **Frameworks Match**: 35 points
- **Technologies Match**: 25 points

### Detection Process

1. **Analyze User Request**:
   - Extract keywords from user's project description
   - Convert all text to lowercase for matching
   - Identify mentioned frameworks and technologies

2. **Score Each Project Type**:
   - Match keywords against project_types definitions in project-detection.yaml
   - Calculate weighted score based on matches
   - Minimum threshold: 30 points for valid detection

3. **Select Project Type**:
   - Choose project type with highest score
   - If score < 30: Use fallback type (web_application)
   - Return detected type with confidence score

4. **Recommend Skills**:
   - Based on detected project type, recommend appropriate skills
   - Use auto_experts mapping from project-detection.yaml

## Deep Thinking Protocol

**CONDITIONAL**: project-detector should use Sequential Thinking MCP + ultrathink only when encountering ambiguous, hybrid, or novel project types. Clear project types (>70 score) use standard detection algorithm efficiently.

### When to Apply Deep Thinking

**Use Deep Thinking when**:
- **Ambiguous Project Type**: Scoring <50 points, unclear signals from user description
- **Hybrid Projects**: Multiple project types score >40 (e.g., AI-powered mobile web app)
- **Novel Project Categories**: Project doesn't fit standard 6 types clearly
- **Conflicting Skill Recommendations**: Detected type doesn't match actual technical needs

**Do NOT use for** (most cases - ~90%):
- Clear project type match (>70 score)
- Standard technology stacks clearly mentioned
- Obvious skill requirements
- Projects matching established patterns

### Complexity Threshold

Use Deep Thinking only when:
1. **Project score <50** (ambiguous type detection)
2. **Multiple types score >40** (hybrid project characteristics)
3. **Novel requirements** not matching standard 6 types
4. **Skill recommendation conflicts** with project needs

### Deep Thinking Application Protocol

Follow the 5-Phase approach with project-detector-specific focus:

**Evaluation Dimensions**:
- **Accuracy** (40%): Correct project type detection
- **Skill Recommendation Quality** (30%): Appropriate team assembly
- **Ambiguity Resolution** (20%): Handling unclear requirements
- **Speed** (10%): Quick detection for clear cases

**Expected Thought Investment**: 8-12 thoughts for ambiguous project detection

### Documentation Requirements

Document in `.memory/decisions.md` with minimal format:
- **Problem**: What project type ambiguity encountered
- **Decision**: What type and skills chosen

### Domain-Specific Example

#### Hybrid AI Video Platform with Multi-Platform Apps

**Problem**: Detect project type for "AI-powered video processing platform with real-time collaborative editing, iOS/Android mobile apps, and desktop app for professionals with GPU acceleration"

**Complexity**: Very High (Multiple types score high: ai_ml_system 65, mobile_application 55, desktop_application 45, web_application 40 - hybrid project)

**Deep Thinking Process**:
- Thoughts 1-2: Analysis - AI/ML video processing (primary), mobile apps (secondary), desktop app (tertiary), real-time web features (supporting)
- Thoughts 3-5: Type scoring validation - AI/ML highest but mobile/desktop significant, not standard single-type
- Thoughts 6-8: Skill requirements analysis - systemdev-specialist (AI/video lead), frontend-nextjs (web), backend-fastapi (async AI serving), research-analysis, devops-deployment
- Thoughts 9-12: Team assembly decision - Lead with AI/ML specialty, support with multi-platform skills

**Decision**: Primary type: **ai_ml_system** (score: 65), Secondary: **mobile_application** (score: 55)

**Recommended Skills**: systemdev-specialist (lead - AI/video processing), frontend-nextjs (web UI), backend-fastapi (async model serving), research-analysis (AI frameworks), devops-deployment (GPU infrastructure), qa-testing

**Rationale**: AI video processing is core value proposition (primary type). Mobile/desktop are delivery platforms (secondary consideration). Skill team reflects this: systemdev-specialist leads with AI/ML/video expertise, backend-fastapi handles async model serving, frontend-nextjs for web interface, research-analysis for framework selection.

**Impact**: Correct detection enabled proper skill team assembly with AI/video expertise leading. Project completed successfully with specialized team. Alternative incorrect detection as "mobile_application" would have missed critical AI/video requirements.

### Quality Validation

After Deep Thinking, validate:
- [ ] Detected type aligns with core project value
- [ ] Skill recommendations cover all technical requirements
- [ ] Hybrid characteristics properly identified
- [ ] Team assembly practical and balanced

Coordinate with **pm-orchestrator** for team assembly approval and **research-analysis** for technology validation when novel requirements identified.

### Success Metrics

Track in `.memory/metrics.md`:
- Detection accuracy: Target >95% (correct type for project)
- Skill recommendation quality: Target >90% (team satisfaction)
- Ambiguity resolution rate: Target >85% (successful hybrid/novel handling)

## Skill Recommendations by Project Type

### Web Application
**Recommended Skills**:
- pm-orchestrator (coordination)
- frontend-nextjs (UI development)
- backend-nestjs (API development)
- fullstack-integration (architecture)
- qa-testing (testing)
- devops-deployment (deployment)
- mcp-tools-orchestrator (tool support)

### AI/ML System
**Recommended Skills**:
- pm-orchestrator (coordination)
- systemdev-specialist (AI/ML development)
- research-analysis (strategic research)
- backend-nestjs (model serving)
- qa-testing (model validation)
- mcp-tools-orchestrator (tool support)

### Mobile Application
**Recommended Skills**:
- pm-orchestrator (coordination)
- frontend-nextjs (React Native development)
- backend-nestjs (mobile API)
- devops-deployment (mobile deployment)
- qa-testing (mobile testing)
- mcp-tools-orchestrator (tool support)

### API/Microservice
**Recommended Skills**:
- pm-orchestrator (coordination)
- backend-nestjs (API development)
- fullstack-integration (architecture)
- devops-deployment (containerization)
- qa-testing (API testing)
- mcp-tools-orchestrator (tool support)

### Data Processing System
**Recommended Skills**:
- pm-orchestrator (coordination)
- systemdev-specialist (data pipeline development)
- backend-nestjs (data services)
- research-analysis (architecture research)
- devops-deployment (data infrastructure)
- mcp-tools-orchestrator (tool support)

### Desktop Application
**Recommended Skills**:
- pm-orchestrator (coordination)
- frontend-nextjs (Electron/UI development)
- systemdev-specialist (native integration)
- devops-deployment (desktop deployment)
- qa-testing (desktop testing)
- mcp-tools-orchestrator (tool support)

## Example Detection Scenarios

### Example 1: Web Application
**User Request**: "Create a Next.js dashboard with user authentication and data visualization"

**Detection Process**:
- Keywords: "dashboard" (web app indicator) = 40 points
- Frameworks: "Next.js" (React-based framework) = 35 points
- Technologies: "authentication", "data visualization" = 25 points
- **Total Score**: 100 points
- **Detected Type**: web_application
- **Recommended Skills**: pm-orchestrator, frontend-nextjs, backend-nestjs, fullstack-integration, qa-testing, devops-deployment

### Example 2: AI/ML System
**User Request**: "Build an image classification model using TensorFlow"

**Detection Process**:
- Keywords: "model", "classification" = 40 points
- Frameworks: "TensorFlow" = 35 points
- Technologies: "machine learning", "image processing" = 25 points
- **Total Score**: 100 points
- **Detected Type**: ai_ml_system
- **Recommended Skills**: pm-orchestrator, systemdev-specialist, research-analysis, backend-nestjs, qa-testing

### Example 3: Mobile App
**User Request**: "Create a React Native shopping app for iOS and Android"

**Detection Process**:
- Keywords: "app", "shopping" = 40 points
- Frameworks: "React Native" = 35 points
- Technologies: "iOS", "Android" = 25 points
- **Total Score**: 100 points
- **Detected Type**: mobile_application
- **Recommended Skills**: pm-orchestrator, frontend-nextjs, backend-nestjs, devops-deployment, qa-testing

## Output Format

When invoked, this skill outputs:

```
Project Type Detection Results:
- Detected Type: {project_type}
- Confidence Score: {score}/100
- Recommended Skills:
  * pm-orchestrator (project coordination)
  * {skill-1} ({purpose})
  * {skill-2} ({purpose})
  * ...

Memory Template: {memory_template_name}
Quality Standards: {quality_framework_name}
```

## Integration with PM Orchestrator

The pm-orchestrator skill invokes project-detector at the start of new projects:

1. PM orchestrator receives user request
2. Invokes project-detector skill
3. Receives detection results and skill recommendations
4. Coordinates recommended skills for project execution
5. Passes detected type to memory-manager for appropriate memory structure

## Configuration Reference

This skill uses **project-detection.yaml** which contains:

- **project_types**: All 6 project type definitions with keywords, frameworks, technologies
- **scoring_weights**: Keyword (40%), framework (35%), technology (25%) weights
- **minimum_score**: 30 points threshold for valid detection
- **fallback_type**: web_application if detection fails
- **auto_experts**: Skill mapping for each project type
- **memory_templates**: Memory structure names for each type
- **quality_frameworks**: Quality standard names for each type

## Related Skills

- **pm-orchestrator**: Coordinates skills based on detection results
- **memory-manager**: Initializes appropriate memory structure based on project type
- **quality-controller**: Applies project-type-specific quality standards

## Usage by Other Skills

Other skills can reference this skill when:
- Project type is ambiguous or needs reclassification
- User pivots to different project requirements mid-development
- Multi-project scenarios require classification
