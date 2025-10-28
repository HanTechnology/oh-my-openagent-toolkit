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
