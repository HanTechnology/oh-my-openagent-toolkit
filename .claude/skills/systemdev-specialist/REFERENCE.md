# SystemDev Specialist - Technical Reference

> **Purpose**: Technical reference for the systemdev-specialist skill in the autonomous skills-based development system.
> **Related Skills**: backend-nestjs, backend-fastapi, fullstack-integration, research-analysis, devops-deployment, mcp-tools-orchestrator
> **Examples**: See examples/ directory for production-ready specialized system patterns.

---

## SystemDev Specialist Skill Guidelines

### Core Responsibilities

**CRITICAL**: Operate with complete autonomy for specialized system development

**Specialization Areas**
- **AI/ML Systems**: Model training, inference optimization, data pipelines
- **Video Processing**: FFmpeg, OpenCV, real-time video streaming
- **3D Model Conversion**: glTF, FBX, mesh processing, format conversion
- **GPU Computing**: CUDA, OpenCL, parallel processing optimization
- **Real-time Streaming**: WebRTC, MediaSoup, RTMP, HLS, DASH
- **High-Performance Systems**: Optimization, scalability, resource management

**Technology Leadership**
- Specialized system architecture and design
- Performance optimization and benchmarking
- Resource management and scaling strategies
- Integration with main application systems

### Ultimate Goals
- **Production-ready specialized systems** with optimal performance
- **Zero user confirmations required** for technical decisions
- Seamless integration with backend-nestjs, backend-fastapi, and fullstack systems

---

## Technology Stacks

### AI/ML Systems
```
- Python: TensorFlow, PyTorch, scikit-learn
- Node.js: TensorFlow.js, ONNX Runtime
- GPU Acceleration: CUDA, OpenCL, CuDNN
- Model Serving: TensorFlow Serving, TorchServe
- Data Processing: Pandas, NumPy, Dask
- MLOps: MLflow, Weights & Biases
- Inference Optimization: ONNX, TensorRT, quantization
```

### Video Processing
```
- FFmpeg: Video transcoding, format conversion
- OpenCV: Real-time video analysis
- MediaPipe: Computer vision pipelines
- Streaming Protocols: RTMP, HLS, DASH, WebRTC
- Node.js: fluent-ffmpeg, node-opencv
- Storage: Cloud storage integration (S3, GCS)
- CDN: CloudFlare, AWS CloudFront
```

### 3D Processing
```
- Blender API: Automated 3D processing
- Three.js: Web-based 3D rendering
- glTF: 3D model format optimization
- Mesh Processing: Geometry optimization, LOD generation
- Format Conversion: FBX, OBJ, STL, COLLADA
```

### GPU Computing
```
- CUDA Toolkit: Parallel computing
- CuPy, PyCUDA: Python GPU acceleration
- OpenCL: Cross-platform GPU computing
- Performance Profiling: nvprof, Nsight
- Memory Optimization: Unified memory, streams
```

### Real-time Streaming
```
- WebRTC: Peer-to-peer communication
- MediaSoup: SFU server implementation
- RTMP: Live streaming protocol
- HLS/DASH: Adaptive bitrate streaming
- Socket.io: Real-time signaling
```

---

## Production Examples

This skill provides specialized system implementation examples in the `examples/` directory:

### Available Examples

#### 01. High-Performance Data Pipeline (`examples/01-data-pipeline.md`)
- **Demonstrates**: Scalable data processing with Node.js Streams
- **Key Patterns**: Worker threads, message queues (Bull/BullMQ), memory management
- **Integration**: Processing millions of records efficiently
- **Technologies**: Node.js Streams, Bull, Redis, worker_threads
- **Use when**: Building scalable data processing systems

#### 02. Video Processing Pipeline (`examples/02-video-processing-pipeline.md`)
- **Demonstrates**: Complete video processing system using FFmpeg
- **Key Patterns**: Transcoding, thumbnail generation, HLS streaming, cloud storage
- **Integration**: Upload → Process → Store → Deliver workflow
- **Technologies**: FFmpeg, fluent-ffmpeg, Sharp, AWS S3, CloudFront
- **Use when**: Handling video uploads and streaming

#### 03. GPU Acceleration (`examples/03-gpu-acceleration.md`)
- **Demonstrates**: Leveraging GPU for compute-intensive tasks
- **Key Patterns**: CUDA integration, TensorFlow.js GPU, image processing
- **Integration**: Machine learning inference, scientific computing
- **Technologies**: CUDA, TensorFlow.js, GPU.js, parallel processing
- **Use when**: Optimizing computationally intensive operations

### Using These Examples
- Examples provide production-ready implementations
- Specialized system patterns and optimizations
- Integration with NestJS backend services
- Cross-references with backend-nestjs, backend-fastapi, fullstack-integration, and devops-deployment
- Performance benchmarks and optimization guidelines

---

## Skill Coordination

### Autonomous Operation
This skill operates with **complete autonomy**, requiring **zero user confirmations** for:
- Specialized system architecture and design
- Technology stack selection for specialized needs
- Performance optimization strategies
- Resource allocation and scaling decisions
- Integration approach with main application

### Skill Invocation Context
This skill is automatically invoked by Claude when:
- User requests involve: "AI", "ML", "video processing", "GPU", "3D", "high-performance", "streaming"
- Related skills mention: "systemdev-specialist skill" in their outputs
- Context matches: specialized computing, performance optimization, AI/ML integration

### Cross-Skill Collaboration
Coordinates with related skills through natural language mentions:

**backend-nestjs** (TypeScript):
- API integration for specialized services
- Message queue coordination (Bull/BullMQ)
- Database integration for processed data
- Authentication and authorization for specialized endpoints
- Monitoring and logging integration

**backend-fastapi** (Python - Recommended for AI/ML):
- Async API endpoints for ML model serving
- AI/ML inference optimization and integration
- Python scientific computing stack integration
- GPU resource management for model inference
- Background task handling with async patterns

**fullstack-integration**:
- System architecture coordination
- API contract design for specialized services
- Real-time feature integration
- Performance optimization across stack
- Type-safe integration patterns

**research-analysis**:
- Technology research for specialized requirements
- Performance benchmark analysis
- Architecture pattern research
- Tool and framework evaluation
- Best practice identification

**devops-deployment**:
- GPU-enabled infrastructure setup
- Container optimization for specialized workloads
- Scaling strategies for compute-intensive services
- Monitoring and resource management
- Cloud platform selection and configuration

**mcp-tools-orchestrator**:
- Sequential Thinking MCP for complex system design
- Context7 MCP for specialized technology documentation
- GitHub MCP for implementation pattern research
- Multi-tool coordination for research and development

### Coordination Pattern
1. **Natural Language Mentions**: Mentioning skill names triggers automatic invocation
2. **Shared Memory System**: Architecture and design stored in .memory/ directory
3. **Autonomous Invocation**: Claude automatically invokes skills with full context
4. **Zero User Confirmation**: All specialized development autonomous

---

## Specialization Implementation Approaches

### AI/ML Systems

**Model Training Pipeline**
- Data preprocessing and augmentation
- Model architecture design
- Training loop implementation
- Hyperparameter tuning
- Model evaluation and validation

**Inference Optimization**
- Model quantization (int8, float16)
- ONNX conversion for cross-platform deployment
- TensorRT optimization for GPU inference
- Batch processing for efficiency
- Caching and result storage

**MLOps Integration**
- Model versioning and registry
- Experiment tracking
- A/B testing infrastructure
- Model monitoring and retraining
- CI/CD for ML models

---

### Video Processing

**Transcoding Pipeline**
- Multiple quality levels (360p, 720p, 1080p, 4K)
- Format conversion (MP4, WebM, HLS)
- Audio processing and normalization
- Thumbnail and preview generation
- Metadata extraction

**Streaming Implementation**
- HLS/DASH adaptive bitrate streaming
- RTMP live streaming support
- WebRTC peer-to-peer streaming
- CDN integration and optimization
- Low-latency streaming protocols

---

### GPU Computing

**CUDA Implementation**
- Kernel development and optimization
- Memory management (global, shared, constant)
- Thread hierarchy optimization
- Performance profiling and tuning
- Error handling and debugging

**Integration Patterns**
- Python bindings (PyCUDA, CuPy)
- Node.js native modules
- REST API for GPU services
- Batch processing optimization
- Resource scheduling and management

---

### High-Performance Data Processing

**Stream Processing**
- Node.js Streams for large datasets
- Backpressure handling
- Memory-efficient processing
- Parallel processing with worker threads
- Progress tracking and monitoring

**Message Queues**
- Bull/BullMQ for job processing
- Redis for queue management
- Retry strategies and error handling
- Priority queues and rate limiting
- Job status tracking and monitoring

---

## Performance Optimization Strategies

### Profiling and Benchmarking
- CPU profiling (Node.js profiler, py-spy)
- Memory profiling (heapdump, memory-profiler)
- GPU profiling (nvprof, Nsight)
- Load testing and stress testing
- Bottleneck identification

### Optimization Techniques
- Algorithm optimization
- Parallel processing and concurrency
- Memory optimization and caching
- Database query optimization
- Network optimization and CDN usage

### Scaling Strategies
- Horizontal scaling (multiple instances)
- Vertical scaling (resource upgrades)
- Load balancing and distribution
- Caching layers (Redis, CDN)
- Auto-scaling based on load

---

## Integration with Main Application

### Backend API Integration
- RESTful API endpoints for specialized services
- WebSocket for real-time updates
- Message queue integration
- Authentication and authorization
- Rate limiting and throttling

### Database Integration
- Processed data storage
- Metadata and status tracking
- Job queue persistence
- Result caching
- Analytics and reporting

### Monitoring and Observability
- Performance metrics tracking
- Resource utilization monitoring
- Error tracking and alerting
- Logging and debugging
- Cost monitoring (GPU, cloud resources)

---

## Related Skills and Resources

**Related Skills**:
- **backend-nestjs**: API integration (TypeScript), message queues, database operations
- **backend-fastapi**: API integration (Python), AI/ML model serving, async operations
- **fullstack-integration**: System architecture, API contracts, integration patterns
- **research-analysis**: Technology research, performance benchmarking, pattern analysis
- **devops-deployment**: Infrastructure setup, GPU environments, container optimization
- **mcp-tools-orchestrator**: Advanced MCP usage, research coordination

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Production Examples**: See examples/ directory for specialized system patterns

---

This technical reference guide supports AI/ML systems, video processing, GPU computing, high-performance data processing, and the autonomous skills-based development system.
