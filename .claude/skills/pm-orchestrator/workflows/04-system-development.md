# System Development Workflow

## Overview

- **Primary Skill**: systemdev-specialist
- **Supporting Skills**: fullstack-integration, backend-nestjs, devops-deployment
- **Dependencies**: architecture-design (must be complete)
- **Conditional**: Only executed if specialized system requirements identified
- **Parallel Execution**: Can run parallel with main implementation if decoupled

## Workflow Activation

**This workflow is ONLY activated when**:
- AI/ML processing requirements exist
- Video processing needs identified
- 3D conversion requirements present
- High-performance computing needed
- Real-time streaming required
- GPU acceleration necessary

**If NO specialized requirements**: Skip this workflow entirely and proceed to implementation.

## Workflow Steps

### Phase 1: System Requirements Verification

**Objective**: Verify and scope specialized system development needs

**Actions**:
1. **Read Architecture Documentation**:
   - .memory/integration-architecture.md (system service requirements)
   - .memory/service-architecture.md (system integration specs)
   - .memory/active-context.md (project context)

2. **Verify System Requirements**:
   - Check for AI/ML requirements (model training, inference, data processing)
   - Check for video processing (encoding, streaming, real-time)
   - Check for 3D processing (model conversion, rendering, optimization)
   - Check for high-performance computing (parallel processing, GPU)
   - Check for real-time streaming (WebRTC, media servers, CDN)

3. **Determine Scope**:
   - If NO specialized requirements found:
     - Update .memory/active-context.md: "system_development: not_required"
     - Exit workflow and proceed to implementation
   - If specialized requirements found:
     - Proceed with system development

### Phase 2: System Architecture and Technology Selection

**Objective**: Design specialized system architecture and select technologies

**Actions**:
1. **Use Sequential Thinking MCP** for system design:
   ```
   - Define system service architecture
   - Select appropriate technologies for requirements
   - Design data flow and integration patterns
   - Plan resource allocation and optimization
   - Identify performance bottlenecks and solutions
   ```

2. **Technology Selection by Requirement Type**:

   **AI/ML Systems**:
   - Framework: TensorFlow 2.x or PyTorch 2.x
   - Data Processing: pandas, NumPy, scikit-learn
   - Model Serving: TensorFlow Serving, TorchServe, or FastAPI
   - GPU Acceleration: CUDA, cuDNN
   - Deployment: Docker containers with GPU support

   **Video Processing**:
   - Core: FFmpeg, OpenCV
   - Computer Vision: MediaPipe
   - Streaming: HLS, DASH protocols
   - Real-time: WebRTC
   - Storage: S3-compatible object storage

   **3D Processing**:
   - Automation: Blender Python API
   - Format Handling: glTF, FBX converters
   - Mesh Processing: trimesh, PyMesh
   - Rendering: Three.js (client-side)
   - Optimization: Mesh simplification, texture compression

   **Real-time Streaming**:
   - Signaling: WebRTC
   - Media Server: MediaSoup, Kurento
   - Protocols: RTMP, WebRTC, HLS
   - CDN: CloudFront, Cloudflare Stream
   - Adaptive Bitrate: HLS/DASH

3. **Integration Architecture**:
   - Define API contracts with main application
   - Plan message queues (if async processing)
   - Design file upload/download workflows
   - Plan WebSocket/SSE for real-time updates

### Phase 3: System Service Implementation

**Objective**: Implement core system processing services

**Actions**:

**For AI/ML Systems**:
1. **Environment Setup**:
   - Create Python virtual environment
   - Install ML frameworks (TensorFlow/PyTorch)
   - Setup GPU acceleration (CUDA)
   - Configure development tools

2. **Model Implementation**:
   - Read .memory/model-architecture.md (if AI-focused project)
   - Implement model training pipeline
   - Create inference service
   - Setup data preprocessing
   - Implement feature extraction

3. **API Development**:
   - Create FastAPI/Flask service
   - Implement model serving endpoints
   - Add request validation
   - Setup async processing (if needed)

**For Video Processing**:
1. **Processing Pipeline Setup**:
   - Configure FFmpeg encoding profiles
   - Setup OpenCV processing workflows
   - Implement video optimization
   - Create streaming pipeline

2. **Service Implementation**:
   - Upload handling
   - Background processing with queues
   - Progress tracking
   - Result delivery

**For 3D Processing**:
1. **Blender Automation**:
   - Setup Blender headless mode
   - Implement conversion scripts
   - Create mesh optimization workflows
   - Setup glTF export pipeline

2. **Processing Service**:
   - File upload and validation
   - Async processing queue
   - Mesh optimization
   - Output delivery

**For Real-time Streaming**:
1. **WebRTC Setup**:
   - Implement signaling server
   - Setup TURN/STUN servers
   - Configure peer connections
   - Handle connection lifecycle

2. **Media Server Setup**:
   - Configure MediaSoup/Kurento
   - Setup recording pipelines
   - Implement adaptive bitrate
   - Configure CDN integration

### Phase 4: Performance Optimization and GPU Acceleration

**Objective**: Optimize system performance for production

**Actions**:
1. **GPU Acceleration**:
   - Setup CUDA/OpenCL
   - Implement parallel processing
   - Optimize memory management
   - Configure compute shaders (if applicable)

2. **Performance Profiling**:
   - Benchmark processing performance
   - Measure resource utilization
   - Identify bottlenecks
   - Optimize critical paths

3. **Resource Optimization**:
   - Memory optimization
   - CPU/GPU balance
   - I/O optimization
   - Caching strategies

4. **Scalability Planning**:
   - Horizontal scaling approach
   - Load balancing strategy
   - Queue management
   - Resource allocation

### Phase 5: System Integration and API Development

**Objective**: Integrate system services with main application

**Actions**:
1. **RESTful API Development**:
   - Create system service endpoints
   - Implement request validation
   - Add authentication/authorization
   - Setup rate limiting

2. **Asynchronous Processing**:
   - Setup message queue (Redis, RabbitMQ)
   - Implement background workers
   - Create job status tracking
   - Setup result notifications

3. **File Upload/Download**:
   - Implement multipart upload
   - Setup progress tracking
   - Create download endpoints
   - Configure storage (S3, local)

4. **Real-time Communication**:
   - Setup WebSocket/SSE
   - Implement progress updates
   - Create status notifications
   - Handle connection management

5. **Error Handling**:
   - Implement retry mechanisms
   - Create fallback strategies
   - Setup error logging
   - Handle resource cleanup

### Phase 6: Cross-Skill Collaboration and Validation

**Objective**: Validate system integration with other components

**Collaboration Pattern**:
1. **Architecture Validation**:
   - Mention **fullstack-integration** skill for:
     - System architecture review
     - Integration pattern validation
     - Data flow confirmation

2. **Backend Integration**:
   - Mention **backend-nestjs** skill for:
     - API integration validation
     - Database integration (if needed)
     - Authentication integration

3. **Deployment Planning**:
   - Mention **devops-deployment** skill for:
     - Docker configuration
     - GPU support requirements
     - Infrastructure planning

4. **Collaboration Documentation**:
   - Update .memory/collaboration.log.md
   - Record integration decisions
   - Track validation results

### Phase 7: Testing and System Validation

**Objective**: Comprehensive testing of system services

**Actions**:
1. **Unit Testing**:
   - Test processing modules
   - Test API endpoints
   - Test error handling
   - Test edge cases

2. **Integration Testing**:
   - Test API integration with backend
   - Test file upload/download flows
   - Test async processing
   - Test WebSocket communication

3. **Performance Testing**:
   - Benchmark processing speed
   - Test concurrent processing
   - Measure resource usage
   - Validate latency targets

4. **Load Testing**:
   - Test concurrent requests
   - Test queue handling
   - Test resource limits
   - Validate scaling behavior

5. **End-to-End Testing**:
   - Test complete workflows
   - Test error recovery
   - Test data integrity
   - Validate user experience

### Phase 8: Documentation and System Specifications

**Objective**: Create comprehensive system service documentation

**Deliverables**:

1. **.memory/system-specs.md**:
   ```markdown
   # System Service Specifications

   ## System Architecture Overview
   - Component diagram
   - Service responsibilities
   - Integration points

   ## API Documentation
   ### Endpoints
   - POST /process: [Description]
   - GET /status/:id: [Description]
   - GET /result/:id: [Description]

   ### Request/Response Schemas
   ```json
   {
     "input": "...",
     "options": {...}
   }
   ```

   ## Processing Pipeline
   - Input validation
   - Processing stages
   - Output generation
   - Error handling

   ## Performance Specifications
   - Processing time targets
   - Throughput capacity
   - Resource requirements
   - Scaling characteristics

   ## Integration Guide
   - Backend integration steps
   - Authentication requirements
   - Error handling patterns
   - WebSocket events (if applicable)
   ```

2. **.memory/system-performance.md**:
   ```markdown
   # System Performance Metrics

   ## Benchmarks
   - Processing speed: [X operations/second]
   - Latency: [Xms 95th percentile]
   - Throughput: [X concurrent requests]

   ## Resource Utilization
   - CPU usage: [Target/Max]
   - GPU usage: [Target/Max]
   - Memory usage: [Target/Max]

   ## Optimization Results
   - [Optimization 1]: [Impact]
   - [Optimization 2]: [Impact]

   ## Scaling Characteristics
   - Horizontal scaling: [Capability]
   - Vertical scaling: [Limits]
   ```

### Phase 9: Memory System Updates

**Objective**: Update memory with system development completion

**Memory Updates**:

1. **Update .memory/active-context.md**:
   ```markdown
   ## System Development
   Status: Completed
   Type: [AI/ML | Video | 3D | Streaming]

   ## System Services
   - [Service 1]: Operational
   - [Service 2]: Operational

   ## Performance
   - Processing: [Xms latency]
   - Throughput: [X ops/sec]

   ## Next Steps
   - Integration with main application
   - Deployment configuration
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "systemDevelopment": {
       "required": true,
       "type": "ai_ml",
       "status": "completed",
       "services": ["model-inference", "data-processing"],
       "performance": {
         "latency": "95ms",
         "throughput": "1000 ops/sec"
       }
     }
   }
   ```

3. **Update .memory/decisions.md**:
   ```markdown
   ## [YYYY-MM-DD] System Development Decisions

   ### Technology Selection
   **Decision**: Use TensorFlow 2.x for model serving
   **Rationale**: Production-ready, GPU support, wide adoption
   **Impact**: Development approach, deployment requirements

   ### GPU Acceleration
   **Decision**: Use CUDA for GPU acceleration
   **Rationale**: Best performance, native TensorFlow support
   **Impact**: Infrastructure requirements, cost

   ### Integration Pattern
   **Decision**: Async processing with message queue
   **Rationale**: Decouples services, handles load spikes
   **Impact**: Architecture complexity, reliability
   ```

## Completion Criteria

**All criteria must be met before proceeding**:

- ✅ **System Services Implemented**: All required specialized services operational
- ✅ **Performance Validated**: Meets performance targets for processing
- ✅ **Integration Tested**: API integration with main application confirmed
- ✅ **Documentation Complete**: .memory/system-specs.md and system-performance.md created
- ✅ **Testing Complete**: Unit, integration, performance, and E2E tests passing
- ✅ **Expert Validation**: Collaboration with architecture and backend completed
- ✅ **Memory System Updated**: All system development context recorded

## Verification Steps

1. **Functional Verification**:
   - Confirm all processing pipelines working
   - Verify API endpoints operational
   - Check error handling robust

2. **Performance Verification**:
   - Validate processing speed meets targets
   - Confirm resource usage acceptable
   - Check scaling characteristics

3. **Integration Verification**:
   - Test backend integration
   - Verify authentication working
   - Confirm data flow correct

## Next Workflows

**Sequential**:
→ **05-implementation.md**: Main application implementation (if not already started)
→ **06-integration.md**: System integration and coordination

## Common Issues and Resolutions

**Issue**: GPU acceleration not working
**Resolution**: Verify CUDA installation, check driver compatibility, validate GPU allocation

**Issue**: Processing too slow
**Resolution**: Profile bottlenecks, optimize algorithms, add caching, consider batch processing

**Issue**: Integration complexity high
**Resolution**: Simplify API contracts, use message queues for decoupling, add retry mechanisms

**Issue**: Resource usage excessive
**Resolution**: Optimize memory management, use lazy loading, implement resource pooling

## Output Example

**Success Output**:
```
System Development Completed
=============================

✅ System Type: AI/ML Model Inference
✅ Services: Model serving API, data preprocessing pipeline
✅ Performance: 95ms latency (target: <100ms), 1200 ops/sec throughput
✅ GPU Acceleration: CUDA enabled, 80% GPU utilization
✅ Integration: REST API + WebSocket status updates
✅ Testing: All tests passing (32 unit, 15 integration, 5 performance)

Key Specifications:
- Framework: TensorFlow 2.15
- Model: Custom classification model (90% accuracy)
- API: FastAPI with async processing
- Queue: Redis for background jobs
- Storage: S3 for model artifacts

Next Steps:
→ Integration with main Nest.js backend
→ Deployment configuration with Docker GPU support
```
