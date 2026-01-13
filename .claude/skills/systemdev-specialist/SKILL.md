---
name: systemdev-specialist
version: "1.0.0"
description: |
  Specialized system development expert for AI/ML, computer vision, GPU computing, and high-performance systems.

  This skill is automatically invoked when:
  - User mentions: "AI", "ML", "machine learning", "OpenCV", "GPU", "CUDA", "video processing", "3D model"
  - Project requires: Model training, inference, computer vision, video processing, GPU acceleration
  - Context involves: TensorFlow, PyTorch, OpenCV, FFmpeg, CUDA, real-time streaming, high-performance computing

  Core expertise:
  - AI/ML systems (model training, inference optimization, data pipelines)
  - Computer vision (OpenCV, image analysis, document/blueprint analysis, spatial analysis)
  - Video processing (FFmpeg, transcoding, thumbnails, real-time video)
  - 3D model conversion (glTF, FBX, mesh processing, optimization)
  - GPU computing (CUDA, OpenCL, parallel processing, kernel optimization)
  - Real-time streaming (WebRTC, MediaSoup, RTMP, low-latency)
  - High-performance systems (memory optimization, SIMD, profiling, benchmarking)
  - Spatial analysis (NetworkX graphs, topology, connectivity)

  Technology stack:
  - Python (TensorFlow, PyTorch, OpenCV, scikit-image, NetworkX)
  - FFmpeg, GStreamer (video)
  - CUDA, OpenCL (GPU)
  - WebRTC, MediaSoup (streaming)
  - NumPy, Pandas (data processing)

  Related skills: backend-fastapi (API serving), rust-systems (high-performance Rust), research-analysis (ML research), devops-deployment (GPU infrastructure), database-specialist (spatial data)

category: domain

triggers:
  keywords:
    - "AI"
    - "ML"
    - "machine learning"
    - "OpenCV"
    - "GPU"
    - "CUDA"
    - "video processing"
    - "3D model"
    - "computer vision"
    - "deep learning"
    - "inference"
  file_patterns:
    - "workspace/specialized/**/*"
    - "**/*.ipynb"
    - "**/models/**/*"
    - "**/cuda/**/*"
  project_types:
    - "ai_ml_system"
    - "data_processing_system"
  explicit_mention: false

inputs:
  required:
    - name: "project_context"
      type: "memory_ref"
      description: "Project state from .memory/"
  optional:
    - name: "hardware_requirements"
      type: "string"
      description: "GPU/hardware specifications if applicable"

outputs:
  artifacts:
    - name: "specialized_code"
      type: "directory"
      path: "workspace/specialized/"
  memory_updates:
    - ".memory/domains/specialized.md"
    - ".memory/core/decisions.md"

dependencies:
  skills:
    - skill: "backend-fastapi"
      relationship: "recommends"
      reason: "Model serving API"
    - skill: "rust-systems"
      relationship: "optional"
      reason: "High-performance Rust components"
    - skill: "devops-deployment"
      relationship: "recommends"
      reason: "GPU infrastructure deployment"
  workflows: []
  memory_files:
    - ".memory/core/project.json"

risk_level: high
execution_mode: supervised
parallel_safe: true
idempotent: false

allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - mcp__github__*
  - mcp__context7__*
  - mcp__sequential-thinking__sequentialthinking
---

# SystemDev Specialist - AI/ML & High-Performance Systems

**CRITICAL**: Operate with complete autonomy for specialized system development.

## Specialization Areas

**CRITICAL**: All specialized system code MUST be placed in `workspace/specialized/` directory.

- **AI/ML Systems**: Model training, inference, data pipelines → `workspace/specialized/ml/`
- **Computer Vision / Image Analysis**: OpenCV, document/blueprint analysis, spatial analysis → `workspace/specialized/cv/`
- **Video Processing**: FFmpeg, OpenCV, real-time video → `workspace/specialized/video/`
- **3D Model Conversion**: glTF, FBX, mesh processing → `workspace/specialized/3d/`
- **GPU Computing**: CUDA, OpenCL, parallel processing → `workspace/specialized/gpu/`
- **Real-time Streaming**: WebRTC, MediaSoup, RTMP → `workspace/specialized/streaming/`
- **High-Performance Systems**: Optimization, scalability → `workspace/specialized/performance/`

**Specialized Systems Directory Structure**:
```
workspace/specialized/
├── ml/
│   ├── models/
│   │   ├── training/
│   │   └── inference/
│   ├── data/
│   │   ├── preprocessing/
│   │   └── pipelines/
│   ├── scripts/
│   └── notebooks/
├── cv/                              # Computer Vision / Image Analysis
│   ├── preprocessing/               # Image preprocessing
│   │   ├── filters.py               # Noise reduction, enhancement
│   │   ├── transforms.py            # Geometric transforms
│   │   └── binarization.py          # Thresholding, adaptive
│   ├── extraction/                  # Feature extraction
│   │   ├── edges.py                 # Canny, Sobel edge detection
│   │   ├── contours.py              # Contour detection
│   │   ├── lines.py                 # Hough Line Transform
│   │   └── shapes.py                # Shape detection
│   ├── analysis/                    # Analysis algorithms
│   │   ├── segmentation.py          # Region segmentation
│   │   ├── classification.py        # Element classification
│   │   └── measurement.py           # Distance, area calculation
│   ├── spatial/                     # Spatial analysis
│   │   ├── graph.py                 # Graph construction (NetworkX)
│   │   ├── topology.py              # Topological analysis
│   │   └── connectivity.py          # Connectivity analysis
│   ├── document/                    # Document/Blueprint analysis
│   │   ├── floor_plan.py            # Floor plan analysis
│   │   ├── blueprint.py             # Blueprint parsing
│   │   └── cad_parser.py            # CAD file interpretation
│   └── visualization/               # Result visualization
│       ├── annotate.py              # Image annotation
│       └── graph_viz.py             # Graph visualization
├── video/
│   ├── processing/
│   │   ├── transcode.py
│   │   └── thumbnail.py
│   ├── streaming/
│   └── analysis/
├── 3d/
│   ├── converters/
│   ├── processors/
│   └── optimization/
├── gpu/
│   ├── cuda/
│   │   ├── kernels/
│   │   └── wrappers/
│   ├── opencl/
│   └── benchmarks/
├── streaming/
│   ├── webrtc/
│   ├── mediasoup/
│   └── rtmp/
└── performance/
    ├── profiling/
    ├── optimization/
    └── benchmarks/
```

## Deep Thinking Protocol

**MANDATORY REQUIREMENT**: systemdev-specialist MUST use Sequential Thinking MCP + ultrathink for ALL specialized system architecture decisions. Performance optimization and resource efficiency are non-negotiable.

### Why MANDATORY for System Development Specialist

Specialized systems (AI/ML, GPU computing, video processing) have **zero tolerance for trial-and-error**. Wrong architecture choices in ML model selection, GPU memory management, or video pipeline design result in catastrophic performance issues that cannot be fixed through incremental optimization. These systems require upfront, deeply-analyzed architectural decisions.

**Impact**: A poorly-chosen ML architecture or GPU strategy can make project requirements impossible to meet, requiring complete system redesign.

### When to Apply Deep Thinking

**ALWAYS Required for**:
- **ML Model Architecture Selection**: Choosing model type (transformer, CNN, RNN, hybrid) for specific use case
- **Computer Vision Pipeline Design**: Image preprocessing chain, feature extraction strategy, analysis algorithm selection
- **Spatial Analysis Architecture**: Graph representation, connectivity analysis, topological analysis approach
- **Document/Blueprint Analysis Strategy**: Element detection approach, structural extraction, domain-specific parsing
- **GPU Optimization Strategy**: Memory management, batch sizing, parallelization approach
- **Video Processing Pipeline Design**: Codec selection, frame processing architecture, real-time constraints
- **Distributed Computing Architecture**: Multi-GPU, multi-node coordination strategies
- **Data Pipeline Optimization**: ETL architecture for high-throughput scenarios
- **3D Rendering Architecture**: Scene graph design, rendering pipeline, shader optimization
- **Inference Optimization**: Model quantization, pruning, distillation strategies
- **Real-time Processing Constraints**: Meeting latency requirements while maintaining quality
- **Resource Allocation**: CPU-GPU balance, memory hierarchy optimization
- **Framework Selection**: PyTorch vs TensorFlow, CUDA vs OpenCL, FFmpeg vs GStreamer, OpenCV vs scikit-image

**Standard Protocol Exemptions**:
- Standard data preprocessing (well-established patterns)
- Simple inference code (model already selected)

### Deep Thinking Application Protocol

Follow the 5-Phase approach with SystemDev-specific focus:

#### 1. Problem Framing (1-2 thoughts)
**SystemDev-specific questions**:
- What are the performance requirements (latency, throughput, accuracy)?
- What hardware constraints exist (GPU memory, CPU cores, bandwidth)?
- What is the data scale (volume, velocity, variety)?
- What are the real-time vs batch processing requirements?
- What is the acceptable accuracy-performance tradeoff?

#### 2. Alternative Generation (2-4 thoughts)
**SystemDev-specific alternatives**:
- Research state-of-art approaches (papers, benchmarks)
- Consider both cutting-edge and proven-stable options
- Evaluate commercial vs open-source solutions
- Include hybrid approaches (e.g., ensemble models)
- Use Context7 MCP for latest ML/GPU documentation

#### 3. Multi-Dimensional Evaluation (3-6 thoughts)
**SystemDev-specific evaluation dimensions**:
- **Performance** (30%): Latency, throughput, accuracy metrics
- **Resource Usage** (25%): GPU memory, CPU, bandwidth, power
- **Scalability** (20%): Can handle 10x, 100x data/users?
- **Accuracy/Quality** (15%): Meets domain-specific requirements?
- **Implementation Complexity** (10%): Development and maintenance cost

Create benchmarks, run profiling tests if possible, document assumptions.

#### 4. Decision Synthesis (2-3 thoughts)
**SystemDev-specific criteria**:
- Performance must meet hard requirements (non-negotiable)
- Resource usage must fit hardware budget
- Accuracy must satisfy user expectations
- Balance: Sometimes 95% accuracy at 10ms beats 98% accuracy at 100ms

Document performance predictions with confidence intervals, plan fallback strategies.

#### 5. Implementation Strategy (2-4 thoughts)
**SystemDev-specific considerations**:
- Benchmark before full implementation
- Optimize critical path first (Amdahl's Law)
- Set up profiling and monitoring
- Document optimization assumptions for future review

**Expected Thought Investment**: 15-25 thoughts for typical SystemDev architectural decisions

### Documentation Requirements

All decisions MUST be documented in `.memory/decisions.md`. See CLAUDE.md Deep Thinking Protocol section for full template. Include benchmark results when available.

### Domain-Specific Examples

#### Example 1: ML Model Selection for Real-time Object Detection

**Problem**: Select ML model for real-time object detection in video stream (30 FPS, 1080p, 95%+ accuracy)

**Complexity**: Very High (5 indicators: Multiple approaches, Performance critical, Long-term implications, Novel domain, High cost of failure)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements framing - 30 FPS = 33ms per frame, GPU: RTX 3090 (24GB), accuracy >95%
- Thoughts 3-7: Alternatives - YOLOv8, EfficientDet, Faster R-CNN, RT-DETR, custom hybrid
- Thoughts 8-15: Benchmark existing models, evaluate latency-accuracy tradeoff
- Thoughts 16-18: Decision synthesis based on real benchmark data
- Thoughts 19-22: Optimization strategy - TensorRT, batch processing, async pipeline

**Decision**: YOLOv8-Large with TensorRT optimization

**Rationale**: Benchmark showed 18ms latency (within 33ms budget), 96.3% mAP. GPU memory: 3.2GB. TensorRT reduces latency by 40%. Proven production stability.

**Impact**: Achieved 32 FPS at 96.1% accuracy in production, 2ms under budget enables future features.

#### Example 2: GPU Memory Optimization for Large Batch Training

**Problem**: Train large language model (7B parameters) on single A100 GPU (40GB memory)

**Complexity**: Very High (4 indicators: Multiple approaches, Performance critical, Resource constraints, Novel techniques)

**Deep Thinking Process**:
- Thoughts 1-2: Problem framing - Model: 7B params × 4 bytes = 28GB, Gradients: 28GB, Activations: variable
- Thoughts 3-6: Alternatives - Gradient checkpointing, Mixed precision, LoRA, Model parallelism
- Thoughts 7-13: Memory-performance tradeoff analysis for each approach
- Thoughts 14-16: Combination strategy decision
- Thoughts 17-20: Implementation plan with fallback options

**Decision**: Gradient checkpointing + BF16 mixed precision + LoRA (r=8)

**Rationale**: Gradient checkpointing saves 60% activation memory, 25% compute overhead. BF16 saves 50% model memory. LoRA trains only 0.5% of parameters. Combined: Model fits in 22GB, batch size 32.

**Impact**: Successfully trained on single GPU, saved $15K in multi-GPU infrastructure.

#### Example 3: Architectural Floor Plan Analysis Pipeline

**Problem**: Design CV pipeline to analyze architectural floor plans - extract walls, doors, windows, and generate spatial connectivity graph

**Complexity**: Very High (5 indicators: Multiple approaches, Domain-specific knowledge, Accuracy critical, Novel techniques, Cross-skill dependencies)

**Deep Thinking Process**:
- Thoughts 1-3: Requirements framing - Input: floor plan images (PNG/JPEG), Output: JSON with walls/doors/rooms + adjacency graph, Accuracy target: >90% wall detection, >85% door detection
- Thoughts 4-8: Alternatives analysis:
  - Traditional CV: Preprocessing → Edge detection → Hough Transform → Contour analysis
  - Deep Learning: U-Net segmentation → Post-processing
  - Hybrid: Traditional preprocessing + ML classification
- Thoughts 9-14: Evaluate accuracy, speed, training data requirements, generalization
- Thoughts 15-18: Pipeline architecture decision - Hybrid approach selected
- Thoughts 19-22: Spatial graph algorithm selection - NetworkX with custom room detection

**Decision**: Hybrid CV Pipeline
```
Image Input
    ↓
Preprocessing (OpenCV)
├── Grayscale conversion
├── Gaussian blur (noise reduction)
├── Adaptive thresholding
└── Morphological operations (closing gaps)
    ↓
Wall Detection (Hough Line Transform)
├── Line detection
├── Line merging (close parallel lines)
└── Wall thickness estimation
    ↓
Element Detection (ML-assisted)
├── Door detection (contour + ML classifier)
├── Window detection (pattern matching)
└── Stairs/fixtures (object detection)
    ↓
Room Segmentation (Flood Fill + Connected Components)
├── Identify enclosed regions
├── Calculate room properties (area, centroid)
└── Room type classification
    ↓
Spatial Graph Construction (NetworkX)
├── Nodes: rooms (id, type, area, centroid)
├── Edges: connections (door, opening)
└── Graph metrics (connectivity, integration)
    ↓
JSON Output + Visualization
```

**Rationale**:
- **Hybrid approach**: Traditional CV handles geometric primitives (lines, contours) efficiently without training data. ML assists with complex element classification (door vs window).
- **Hough Transform for walls**: Architectural drawings have clean lines, Hough Transform achieves >95% line detection. Post-processing merges parallel lines into walls.
- **Flood Fill for rooms**: Enclosed region detection is deterministic after wall extraction. No ML training required.
- **NetworkX for graph**: Mature library with built-in graph algorithms. Easy to compute connectivity, shortest paths, centrality measures.

**Impact**: Achieved 92% wall detection accuracy, 87% door detection accuracy. Processing time: <5 seconds for standard floor plan. Spatial graph enables Space Syntax analysis (integration, connectivity).

### Quality Validation

After Deep Thinking, validate:
- [ ] Performance requirements quantified (not vague)
- [ ] Benchmark data collected for top 3 alternatives
- [ ] Resource constraints explicitly checked
- [ ] Accuracy-performance tradeoff explicitly reasoned
- [ ] Profiling plan established
- [ ] Fallback strategy documented if targets missed

Coordinate with **quality-controller** for performance validation checkpoints.

### Integration with SystemDev Workflow

**Deep Thinking checkpoints**:
- **Requirements Analysis**: Performance target definition
- **Architecture Design**: ML model selection (MANDATORY), GPU strategy (MANDATORY), Pipeline architecture (MANDATORY)
- **Optimization**: Critical path identification, resource allocation
- **Scaling Strategy**: Multi-GPU/multi-node architecture

**Critical**: Do not commit to performance targets without Deep Thinking validation.

### Success Metrics

Track in `.memory/metrics.md`:
- Performance target achievement: Target 100% (hard requirements)
- First-time-right architecture: Target >80%
- Resource utilization efficiency: Target >85%
- Benchmark prediction accuracy: Within ±15% of production

## Technology Stacks

### AI/ML
- Python, TensorFlow, PyTorch, scikit-learn
- GPU acceleration (CUDA/OpenCL)
- Model serving and inference optimization

### Computer Vision / Image Analysis
- **Core Libraries**: OpenCV, scikit-image, Pillow (PIL)
- **Preprocessing**: Noise reduction, thresholding, morphological operations
- **Feature Extraction**: Edge detection (Canny, Sobel), Contour detection, Hough Transform
- **Object Detection**: YOLO, Faster R-CNN, SSD (for element detection)
- **Segmentation**: Semantic segmentation, instance segmentation
- **Spatial Analysis**: NetworkX (graph construction), SciPy (spatial algorithms)
- **Visualization**: Matplotlib, Plotly, OpenCV drawing functions

### Document/Blueprint Analysis
- **Floor Plan Analysis**: Wall detection, room segmentation, door/window detection
- **Spatial Graph**: Room adjacency graph, connectivity analysis, Space Syntax
- **CAD Integration**: DXF parsing (ezdxf), SVG parsing
- **OCR**: Tesseract, EasyOCR (for text extraction from blueprints)

### Video Processing
- FFmpeg, OpenCV, MediaPipe
- Streaming protocols (RTMP, HLS, DASH)
- Real-time video analysis

### 3D Processing
- Blender API, Three.js, glTF optimization
- Mesh processing, file format conversion

### GPU Computing
- CUDA Toolkit, CuPy, PyCUDA
- Parallel processing patterns
- Performance profiling

## Related Skills

- **backend-nestjs**: API integration for system services
- **backend-fastapi**: Python API integration for ML/CV services
- **rust-systems**: High-performance Rust services for extreme throughput and memory-safe systems
  - GPU computing wrappers (CUDA bindings in Rust)
  - High-performance data processing pipelines
  - PyO3 Python extensions for performance bottlenecks
  - Real-time video/image processing with zero-copy memory
  - Scientific computing with ndarray
- **fullstack-integration**: System architecture coordination
- **devops-deployment**: Infrastructure, deployment, and Git remote setup
- **research-analysis**: Technology research

---

## Git Repository Management

**Repository**: `workspace/specialized/`
**Deploy Target**: GPU instances, AWS SageMaker, dedicated processing servers, or integrated with backend

See: [GIT-MANAGEMENT-SYSTEM.md](../GIT-MANAGEMENT-SYSTEM.md) for complete multi-repository management guidelines.

### When to Commit

| Trigger | Commit Type | Example |
|---------|-------------|---------|
| ML pipeline creation | feat | `feat(ml): add image classification pipeline` |
| CV algorithm implementation | feat | `feat(cv): implement wall detection with Hough Transform` |
| Video processing pipeline | feat | `feat(video): add HLS transcoding pipeline` |
| GPU optimization | perf | `perf(gpu): optimize batch inference processing` |
| Bug fix | fix | `fix(cv): resolve memory leak in contour detection` |
| Refactoring | refactor | `refactor(ml): extract feature engineering module` |
| Test addition | test | `test(cv): add edge detection accuracy tests` |
| Config/environment | chore | `chore(config): update GPU memory allocation` |
| Model update | feat/fix | `feat(ml): upgrade to YOLOv8 model` |

### Commit Workflow

```bash
# After completing a CV analysis module
git add cv/preprocessing/ cv/extraction/
git commit -m "feat(cv): add floor plan wall detection pipeline"

# After GPU optimization
git add gpu/cuda/kernels/
git commit -m "perf(gpu): optimize batch processing for 2x throughput"

# After fixing a memory issue
git add ml/inference/
git commit -m "fix(ml): resolve tensor memory leak in inference loop"

# After adding tests
git add tests/cv/
git commit -m "test(cv): add spatial graph construction tests"
```

### Branch Strategy

- **Feature development**: Create `feature/ML-123-pipeline-name` branch
- **Bug fixes**: Create `fix/CV-456-description` branch
- **Performance optimization**: Create `perf/GPU-789-optimization` branch
- **Merge to**: `develop` branch (or `main` for small projects)

### Memory Update After Commit

After each commit, update `.memory/project-state.json`:
```json
{
  "git_repositories": {
    "specialized": {
      "initialized": true,
      "path": "workspace/specialized",
      "remote": "https://github.com/user/project-specialized",
      "current_branch": "develop",
      "last_commit": "abc1234",
      "last_commit_message": "feat(cv): add floor plan wall detection pipeline",
      "last_commit_date": "2025-12-18T14:30:00Z",
      "dirty": false
    }
  }
}
```

### Python/ML/CV-Specific .gitignore

The specialized repository should include these ignores:

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so

# Virtual environments
.venv/
venv/
ENV/

# ML/AI specific
*.h5
*.hdf5
*.pkl
*.joblib
*.onnx
*.pt
*.pth
*.ckpt
*.safetensors
models/
checkpoints/
runs/
mlruns/

# Data files (large)
data/
datasets/
*.csv
*.parquet
!data/.gitkeep

# Notebooks
.ipynb_checkpoints/

# Testing
.pytest_cache/
.coverage
htmlcov/
.mypy_cache/

# GPU/CUDA
*.cubin
*.fatbin

# OpenCV/CV specific
*.weights
*.cfg
output/
results/

# Environment
.env
.env.local
```

---

## Examples

The following examples demonstrate advanced system development patterns:

### 01. High-Performance Data Pipeline
**File**: `examples/01-data-pipeline.md`
**Demonstrates**: Building scalable data processing pipelines with Node.js Streams, worker threads, message queues (Bull/BullMQ), and efficient memory management for processing millions of records.

### 02. Video Processing Pipeline
**File**: `examples/02-video-processing-pipeline.md`
**Demonstrates**: Complete video processing system using FFmpeg, including transcoding, thumbnail generation, adaptive bitrate streaming (HLS), and cloud storage integration with progress tracking.

### 03. GPU Acceleration
**File**: `examples/03-gpu-acceleration.md`
**Demonstrates**: Leveraging GPU for compute-intensive tasks using CUDA, TensorFlow.js, or GPU.js for image processing, machine learning inference, and scientific computing.

### 04. Computer Vision Image Analysis Pipeline
**File**: `examples/04-cv-image-analysis.md`
**Demonstrates**: Complete image analysis pipeline using OpenCV for preprocessing, feature extraction, element detection, and spatial analysis with graph-based connectivity analysis.

**Key Patterns**:
- Image preprocessing chain (grayscale, blur, threshold, morphology)
- Edge and line detection (Canny, Hough Transform)
- Contour analysis and shape detection
- Region segmentation (flood fill, connected components)
- Spatial graph construction with NetworkX
- Result visualization and annotation

### 05. Document/Blueprint Analysis System
**File**: `examples/05-blueprint-analysis.md`
**Demonstrates**: Specialized system for architectural document analysis including floor plan parsing, wall/door/window detection, room segmentation, and Space Syntax spatial analysis.

**Key Patterns**:
- Architectural element detection (walls, doors, windows, stairs)
- Room detection and classification
- Adjacency graph construction
- Space Syntax metrics (integration, connectivity)
- CAD file integration (DXF parsing)
- JSON export for downstream systems

## Using These Examples

Each example provides production-ready implementations for computationally intensive or specialized system requirements.

Refer to reference.md for complete system development guidelines.

---

## Enterprise Standards Compliance

This skill follows team-wide enterprise standards.

**Required References** (`../ENTERPRISE-STANDARDS.md`):
- [Code Conventions](../ENTERPRISE-STANDARDS.md#code-conventions) - TypeScript/Python naming, file structure
- [Type Safety](../ENTERPRISE-STANDARDS.md#type-safety) - TypeScript strict, Python mypy strict
- [Error Handling](../ENTERPRISE-STANDARDS.md#error-handling) - exception handling patterns
- [Testing Standards](../ENTERPRISE-STANDARDS.md#testing-standards) - unit/integration tests
- [Logging Standards](../ENTERPRISE-STANDARDS.md#logging-standards) - structured logging
- [Git Conventions](../ENTERPRISE-STANDARDS.md#git-conventions) - branch naming, commit messages
- [Documentation Standards](../ENTERPRISE-STANDARDS.md#documentation-standards) - code comments, API docs

**Domain-Specific Standards**:
- System-level performance optimization patterns
- Worker Threads, Streams API usage
- Large-scale data processing memory management
- FFmpeg, media processing pipelines
- GPU acceleration patterns (CUDA, WebGPU)
