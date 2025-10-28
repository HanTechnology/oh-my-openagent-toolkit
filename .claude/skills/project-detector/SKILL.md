---
name: project-detector
description: "Automatic project type detection and skill team recommendation based on user requirements. Use when: starting new projects, analyzing project requirements to determine technology stack, identifying which development skills are needed, unclear project classification. Analyzes keywords, frameworks, and technologies to score and classify projects."
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
