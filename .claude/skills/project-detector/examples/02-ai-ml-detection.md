# AI/ML System Detection Example

## User Request

"Build an image classification model using TensorFlow for product categorization"

## Detection Process

### Step 1: Extract Keywords
```
Extracted keywords (lowercase):
- "image classification" (keyword - computer vision)
- "model" (keyword - AI/ML)
- "tensorflow" (framework)
- "product categorization" → "categorization" (keyword)
```

### Step 2: Match Against Project Types

#### AI/ML System Match
```yaml
Keywords Match (40 points max):
- "image classification": ✅ Match ("computer vision" in ai_ml_system keywords)
- "model": ✅ Match ("model development" in ai_ml_system keywords)
- "categorization": ✅ Match (AI/ML task)
Points: 40/40

Frameworks Match (35 points max):
- "tensorflow": ✅ Match (in ai_ml_system frameworks)
Points: 35/35

Technologies Match (25 points max):
- Implied: "python", "gpu", "cuda" (TensorFlow stack)
Points: 25/25

Total Score: 100/100
```

#### Other Type Matches
```
Web Application: 0 (no web keywords)
Mobile Application: 0 (no mobile keywords)
API/Microservice: 25 (model serving might need API)
Data Processing: 30 (image processing involves data)
Desktop Application: 0 (no desktop keywords)
```

### Step 3: Type Selection

**Selected Type**: `ai_ml_system`
**Confidence**: Very High (100/100)
**Reasoning**: Perfect match with AI/ML and TensorFlow

## Recommended Skills

Based on ai_ml_system auto-skills:
```yaml
auto_skills: ["pm-orchestrator", "systemdev-specialist", "research-analysis", "backend-nestjs", "qa-testing", "mcp-tools-orchestrator"]
```

**Always Included**: pm-orchestrator, mcp-tools-orchestrator
**Conditional Included**:
- systemdev-specialist (AI/ML model development)
- research-analysis (model architecture research, dataset analysis)
- backend-nestjs (model serving API)
- qa-testing (model validation, API testing)
- devops-deployment (model deployment) - Added conditionally

## Memory Template

Selected: `ai-system`

Creates memory files:
- active-context.md
- decisions.md
- collaboration.log.md
- project-state.json
- model-architecture.md (AI-specific)
- data-pipeline.md (AI-specific)
- training-requirements.md (AI-specific)
- performance-metrics.md (AI-specific)
- test-coverage.md
- deployment-config.md
- system-performance.md

## Workflow Priority

```yaml
workflow_priority:
  1. requirements_analysis
  2. research_analysis (parallel)
  3. architecture_design
  4. system_development (model training and inference)
  5. backend_implementation (API for model serving)
  6. integration_orchestration
  7. deployment_pipeline
  8. quality_assurance
```

## Output

```
Project Type Detected: AI/ML System
Confidence: Very High (score: 100/100)

Recommended Skills:
✅ pm-orchestrator (coordination and planning)
✅ systemdev-specialist (TensorFlow model development)
✅ research-analysis (model architecture research, dataset evaluation)
✅ backend-nestjs (model serving API)
✅ qa-testing (model validation, performance testing)
✅ devops-deployment (Docker with GPU support)
✅ mcp-tools-orchestrator (tool coordination)

Technology Stack Recommendations:
- AI/ML Framework: TensorFlow 2.x
- Model Type: CNN for image classification
- Data Processing: OpenCV, PIL/Pillow, NumPy
- Model Serving: FastAPI or TensorFlow Serving
- Backend Integration: Nest.js for business logic
- Infrastructure: AWS EC2 with GPU (g4dn instances) or Railway
- Storage: S3 for images and model artifacts

Quality Requirements:
- Model Accuracy: >90% on validation set
- Inference Latency: <100ms (95th percentile)
- Model Interpretability: SHAP/LIME visualization
- Data Completeness: >95% non-null values

Memory System: Initialized with ai-system template
Workflow: Starting with requirements_analysis + research_analysis (parallel)

Next Steps:
1. Analyze image classification requirements (categories, accuracy targets)
2. Research dataset availability and augmentation strategies
3. Design model architecture (transfer learning vs custom CNN)
4. Plan training pipeline and validation strategy
```

## Validation

**Is Detection Correct?** ✅ Yes
- Clear AI/ML project (image classification)
- TensorFlow explicitly mentioned
- Requires specialized system development
- Not a standard web application

**Are Recommended Skills Appropriate?** ✅ Yes
- systemdev-specialist: Handles TensorFlow model development
- research-analysis: Critical for model architecture and dataset research
- backend-nestjs: Needed for model serving API
- qa-testing: Model validation is crucial

**Is Technology Stack Appropriate?** ✅ Yes
- TensorFlow matches user request
- GPU infrastructure necessary for training
- FastAPI or TensorFlow Serving for efficient inference
- S3 for scalable image storage

## Additional Considerations

### Dataset Requirements
- Need labeled product images
- Data augmentation for better generalization
- Train/validation/test split strategy

### Model Architecture Options
- Transfer Learning: Use pre-trained models (ResNet, EfficientNet, Vision Transformer)
- Custom CNN: Build from scratch if unique requirements
- Recommendation: Transfer learning for faster development

### Performance Optimization
- Model quantization for faster inference
- TensorRT optimization
- Batch inference for throughput
- Edge deployment considerations (if needed)

### Integration Pattern
```
User Upload Image
    ↓
Backend API (Nest.js)
    ↓
Image Preprocessing
    ↓
TensorFlow Inference Service
    ↓
Classification Result
    ↓
Backend API Response
    ↓
Frontend Display
```
