---
name: systemdev-specialist
description: "Specialized system development for AI/ML, video processing, 3D graphics, GPU computing, and high-performance systems. Use when: building AI models, processing video streams, converting 3D models, implementing GPU acceleration, creating real-time streaming systems, developing high-performance computing solutions. Conditional skill for specialized requirements."
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
- **GPU Optimization Strategy**: Memory management, batch sizing, parallelization approach
- **Video Processing Pipeline Design**: Codec selection, frame processing architecture, real-time constraints
- **Distributed Computing Architecture**: Multi-GPU, multi-node coordination strategies
- **Data Pipeline Optimization**: ETL architecture for high-throughput scenarios
- **3D Rendering Architecture**: Scene graph design, rendering pipeline, shader optimization
- **Inference Optimization**: Model quantization, pruning, distillation strategies
- **Real-time Processing Constraints**: Meeting latency requirements while maintaining quality
- **Resource Allocation**: CPU-GPU balance, memory hierarchy optimization
- **Framework Selection**: PyTorch vs TensorFlow, CUDA vs OpenCL, FFmpeg vs GStreamer

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
- **fullstack-integration**: System architecture coordination
- **devops-deployment**: Infrastructure and deployment
- **research-analysis**: Technology research

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
