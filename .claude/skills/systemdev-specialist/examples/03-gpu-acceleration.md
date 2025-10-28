# GPU Acceleration Example

**High-Performance GPU Computing with CUDA**

> **When to Use**: ML inference, video encoding, parallel processing, scientific computing
> **Skill**: systemdev-specialist
> **Related**: backend-nestjs (GPU API), devops-deployment (GPU containers)

---

## Overview

This example demonstrates GPU acceleration integration:
- CUDA setup and configuration
- GPU-accelerated video encoding with FFmpeg
- TensorFlow GPU inference
- Multi-GPU support
- Resource monitoring and allocation
- Docker GPU passthrough
- Performance benchmarking

**Architecture**: CUDA → Docker GPU → Application Layer

## System Architecture

```
Application Layer      GPU Layer           Hardware
┌─────────────┐       ┌──────────────┐    ┌─────────────┐
│ Node.js API │──────▶│ CUDA Runtime │───▶│ NVIDIA GPU  │
│             │◀──────│              │◀───│             │
└─────────────┘       └──────────────┘    └─────────────┘
       │                     │                    │
       │                     │                    │
       ▼                     ▼                    ▼
┌─────────────┐       ┌──────────────┐    ┌─────────────┐
│ FFmpeg GPU  │──────▶│ NVENC/NVDEC  │───▶│ Video       │
│ Encoding    │       │ Hardware     │    │ Codec Accel │
└─────────────┘       └──────────────┘    └─────────────┘
       │                     │                    │
       ▼                     ▼                    ▼
┌─────────────┐       ┌──────────────┐    ┌─────────────┐
│ TensorFlow  │──────▶│ CUDA Kernels │───▶│ Tensor      │
│ GPU Ops     │       │ cuDNN        │    │ Cores       │
└─────────────┘       └──────────────┘    └─────────────┘
```

## Complete Implementation

### 1. GPU Detection and Management

```typescript
// backend/src/gpu/gpu-manager.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface GPUInfo {
  id: number;
  name: string;
  memoryTotal: number;
  memoryUsed: number;
  memoryFree: number;
  utilization: number;
  temperature: number;
}

@Injectable()
export class GPUManagerService implements OnModuleInit {
  private gpuCount = 0;
  private gpuInfo: GPUInfo[] = [];

  async onModuleInit() {
    await this.detectGPUs();
    this.startMonitoring();
  }

  private async detectGPUs() {
    try {
      const { stdout } = await execAsync(
        'nvidia-smi --query-gpu=count --format=csv,noheader,nounits',
      );
      this.gpuCount = parseInt(stdout.trim());
      console.log(`Detected ${this.gpuCount} GPU(s)`);
    } catch (error) {
      console.warn('No NVIDIA GPU detected or nvidia-smi not available');
      this.gpuCount = 0;
    }
  }

  private startMonitoring() {
    if (this.gpuCount === 0) return;

    // Update GPU info every 5 seconds
    setInterval(() => {
      this.updateGPUInfo();
    }, 5000);
  }

  private async updateGPUInfo() {
    try {
      const { stdout } = await execAsync(
        'nvidia-smi --query-gpu=index,name,memory.total,memory.used,memory.free,utilization.gpu,temperature.gpu --format=csv,noheader,nounits',
      );

      this.gpuInfo = stdout
        .trim()
        .split('\n')
        .map((line) => {
          const [id, name, memTotal, memUsed, memFree, util, temp] = line
            .split(', ')
            .map((v, i) => (i === 1 ? v : parseFloat(v)));

          return {
            id: id as number,
            name: name as string,
            memoryTotal: memTotal as number,
            memoryUsed: memUsed as number,
            memoryFree: memFree as number,
            utilization: util as number,
            temperature: temp as number,
          };
        });
    } catch (error) {
      console.error('Failed to update GPU info:', error);
    }
  }

  getGPUCount(): number {
    return this.gpuCount;
  }

  getGPUInfo(): GPUInfo[] {
    return this.gpuInfo;
  }

  async getDetailedInfo(): Promise<any> {
    if (this.gpuCount === 0) {
      return { available: false };
    }

    try {
      const { stdout } = await execAsync('nvidia-smi -q -x');
      return {
        available: true,
        count: this.gpuCount,
        gpus: this.gpuInfo,
        raw: stdout,
      };
    } catch (error) {
      return {
        available: false,
        error: error.message,
      };
    }
  }

  selectGPU(workloadType: 'inference' | 'encoding' | 'training'): number | null {
    if (this.gpuCount === 0) return null;

    // Strategy: Select GPU with lowest utilization
    const sortedGPUs = [...this.gpuInfo].sort(
      (a, b) => a.utilization - b.utilization,
    );

    return sortedGPUs[0]?.id ?? null;
  }

  async setGPU(gpuId: number): Promise<void> {
    process.env.CUDA_VISIBLE_DEVICES = gpuId.toString();
  }
}
```

### 2. GPU-Accelerated Video Encoding

```typescript
// backend/src/gpu/gpu-video-encoder.service.ts
import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import { GPUManagerService } from './gpu-manager.service';

interface EncodeOptions {
  inputPath: string;
  outputPath: string;
  resolution?: string;
  bitrate?: string;
  preset?: 'fast' | 'medium' | 'slow';
  useGPU?: boolean;
}

@Injectable()
export class GPUVideoEncoderService {
  constructor(private gpuManager: GPUManagerService) {}

  async encode(options: EncodeOptions): Promise<void> {
    const {
      inputPath,
      outputPath,
      resolution = '1920x1080',
      bitrate = '5000k',
      preset = 'medium',
      useGPU = true,
    } = options;

    const hasGPU = this.gpuManager.getGPUCount() > 0;

    if (useGPU && hasGPU) {
      return this.encodeWithGPU(options);
    } else {
      return this.encodeWithCPU(options);
    }
  }

  private async encodeWithGPU(options: EncodeOptions): Promise<void> {
    const { inputPath, outputPath, resolution, bitrate, preset } = options;

    // Select best GPU
    const gpuId = this.gpuManager.selectGPU('encoding');
    if (gpuId !== null) {
      await this.gpuManager.setGPU(gpuId);
    }

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .size(resolution!)
        .videoBitrate(bitrate!)
        // NVIDIA hardware encoding
        .videoCodec('h264_nvenc')
        .audioCodec('aac')
        .outputOptions([
          '-preset', this.getNvencPreset(preset!),
          '-rc:v', 'vbr',  // Variable bitrate
          '-cq:v', '23',   // Quality
          '-b:v', bitrate!,
          '-maxrate', this.getMaxRate(bitrate!),
          '-bufsize', this.getBufSize(bitrate!),
          '-profile:v', 'high',
          '-level', '4.2',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart',
        ])
        .output(outputPath)
        .on('start', (cmd) => {
          console.log('[GPU Encode] Started:', cmd);
        })
        .on('progress', (progress) => {
          console.log(`[GPU Encode] Progress: ${progress.percent?.toFixed(2)}%`);
        })
        .on('end', () => {
          console.log('[GPU Encode] Completed');
          resolve();
        })
        .on('error', (err) => {
          console.error('[GPU Encode] Error:', err);
          reject(err);
        })
        .run();
    });
  }

  private async encodeWithCPU(options: EncodeOptions): Promise<void> {
    const { inputPath, outputPath, resolution, bitrate, preset } = options;

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .size(resolution!)
        .videoBitrate(bitrate!)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-preset', preset!,
          '-crf', '23',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart',
        ])
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }

  private getNvencPreset(preset: string): string {
    const presets: Record<string, string> = {
      fast: 'p1',     // Fastest
      medium: 'p4',   // Balanced
      slow: 'p7',     // Best quality
    };
    return presets[preset] || 'p4';
  }

  private getMaxRate(bitrate: string): string {
    const value = parseInt(bitrate);
    return `${value * 1.5}k`;
  }

  private getBufSize(bitrate: string): string {
    const value = parseInt(bitrate);
    return `${value * 2}k`;
  }

  async benchmark(inputPath: string): Promise<{
    cpu: { time: number; fps: number };
    gpu: { time: number; fps: number };
    speedup: number;
  }> {
    const tempOutput = '/tmp/benchmark-output.mp4';

    // Benchmark CPU
    const cpuStart = Date.now();
    await this.encodeWithCPU({
      inputPath,
      outputPath: tempOutput,
      useGPU: false,
    });
    const cpuTime = Date.now() - cpuStart;

    // Benchmark GPU
    const gpuStart = Date.now();
    await this.encodeWithGPU({
      inputPath,
      outputPath: tempOutput,
      useGPU: true,
    });
    const gpuTime = Date.now() - gpuStart;

    return {
      cpu: {
        time: cpuTime,
        fps: 0, // Calculate from video duration
      },
      gpu: {
        time: gpuTime,
        fps: 0,
      },
      speedup: cpuTime / gpuTime,
    };
  }
}
```

### 3. TensorFlow GPU Service

```typescript
// backend/src/gpu/gpu-tensorflow.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node-gpu';
import { GPUManagerService } from './gpu-manager.service';

@Injectable()
export class GPUTensorFlowService implements OnModuleInit {
  private model: tf.LayersModel | null = null;

  constructor(private gpuManager: GPUManagerService) {}

  async onModuleInit() {
    await this.checkGPUAvailability();
    console.log('TensorFlow backend:', tf.getBackend());
  }

  private async checkGPUAvailability() {
    const hasGPU = this.gpuManager.getGPUCount() > 0;

    if (hasGPU) {
      console.log('TensorFlow GPU support enabled');
      console.log('CUDA version:', tf.ENV.get('CUDA_VERSION'));

      // Test GPU with simple operation
      const a = tf.tensor([[1, 2], [3, 4]]);
      const b = tf.tensor([[5, 6], [7, 8]]);
      const c = tf.matMul(a, b);

      console.log('GPU test result:', await c.data());

      // Cleanup
      a.dispose();
      b.dispose();
      c.dispose();
    } else {
      console.warn('TensorFlow running on CPU (no GPU detected)');
    }
  }

  async loadModel(modelPath: string) {
    this.model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log('Model loaded on:', tf.getBackend());
  }

  async predict(inputData: number[][]): Promise<number[]> {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    return tf.tidy(() => {
      // Create tensor from input
      const inputTensor = tf.tensor2d(inputData);

      // Make prediction on GPU
      const prediction = this.model!.predict(inputTensor) as tf.Tensor;

      // Get result
      return Array.from(prediction.dataSync());
    });
  }

  async batchPredict(
    batchData: number[][][],
  ): Promise<number[][]> {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    return tf.tidy(() => {
      const inputTensor = tf.tensor3d(batchData);
      const predictions = this.model!.predict(inputTensor) as tf.Tensor;

      const result = predictions.arraySync() as number[][];
      return result;
    });
  }

  getMemoryInfo() {
    return {
      numTensors: tf.memory().numTensors,
      numBytes: tf.memory().numBytes,
      unreliable: tf.memory().unreliable,
    };
  }

  disposeModel() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    tf.disposeVariables();
  }
}
```

### 4. GPU Controller

```typescript
// backend/src/gpu/gpu.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { GPUManagerService } from './gpu-manager.service';
import { GPUVideoEncoderService } from './gpu-video-encoder.service';
import { GPUTensorFlowService } from './gpu-tensorflow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('gpu')
@Controller('gpu')
@UseGuards(JwtAuthGuard)
export class GPUController {
  constructor(
    private gpuManager: GPUManagerService,
    private gpuEncoder: GPUVideoEncoderService,
    private gpuTensorFlow: GPUTensorFlowService,
  ) {}

  @Get('info')
  @ApiOperation({ summary: 'Get GPU information' })
  async getGPUInfo() {
    return {
      count: this.gpuManager.getGPUCount(),
      gpus: this.gpuManager.getGPUInfo(),
    };
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Get detailed GPU information' })
  async getDetailedInfo() {
    return this.gpuManager.getDetailedInfo();
  }

  @Get('tensorflow/memory')
  @ApiOperation({ summary: 'Get TensorFlow memory usage' })
  getTensorFlowMemory() {
    return this.gpuTensorFlow.getMemoryInfo();
  }

  @Post('encode/benchmark')
  @ApiOperation({ summary: 'Benchmark GPU vs CPU encoding' })
  async benchmarkEncoding(@Body() dto: { inputPath: string }) {
    return this.gpuEncoder.benchmark(dto.inputPath);
  }

  @Post('tensorflow/predict')
  @ApiOperation({ summary: 'Make GPU-accelerated prediction' })
  async predict(@Body() dto: { data: number[][] }) {
    return this.gpuTensorFlow.predict(dto.data);
  }
}
```

### 5. Docker GPU Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.gpu
    environment:
      - NODE_ENV=production
      - CUDA_VISIBLE_DEVICES=0
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    runtime: nvidia
```

```dockerfile
# Dockerfile.gpu
FROM nvidia/cuda:12.0.0-cudnn8-runtime-ubuntu22.04

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install FFmpeg with NVENC support
RUN apt-get install -y \
    ffmpeg \
    nvidia-cuda-toolkit

# Install TensorFlow dependencies
RUN apt-get install -y \
    python3-pip \
    && pip3 install tensorflow[and-cuda]

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm ci --only=production

# Install TensorFlow.js GPU bindings
RUN npm install @tensorflow/tfjs-node-gpu

COPY . .

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### 6. Kubernetes GPU Deployment

```yaml
# k8s-gpu-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gpu-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gpu-app
  template:
    metadata:
      labels:
        app: gpu-app
    spec:
      containers:
      - name: app
        image: your-registry/gpu-app:latest
        resources:
          limits:
            nvidia.com/gpu: 1
          requests:
            nvidia.com/gpu: 1
        env:
        - name: NVIDIA_VISIBLE_DEVICES
          value: "0"
        - name: CUDA_VISIBLE_DEVICES
          value: "0"
      nodeSelector:
        accelerator: nvidia-tesla-t4
```

### 7. Performance Monitoring

```typescript
// backend/src/gpu/gpu-monitor.service.ts
import { Injectable } from '@nestjs/common';
import { GPUManagerService } from './gpu-manager.service';

interface PerformanceMetric {
  timestamp: Date;
  gpuUtilization: number;
  memoryUsed: number;
  temperature: number;
  power: number;
}

@Injectable()
export class GPUMonitorService {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 1000;

  constructor(private gpuManager: GPUManagerService) {
    this.startMonitoring();
  }

  private startMonitoring() {
    setInterval(() => {
      this.collectMetrics();
    }, 1000);
  }

  private collectMetrics() {
    const gpus = this.gpuManager.getGPUInfo();

    gpus.forEach((gpu) => {
      const metric: PerformanceMetric = {
        timestamp: new Date(),
        gpuUtilization: gpu.utilization,
        memoryUsed: gpu.memoryUsed,
        temperature: gpu.temperature,
        power: 0, // Get from nvidia-smi
      };

      this.metrics.push(metric);

      // Keep only recent metrics
      if (this.metrics.length > this.maxMetrics) {
        this.metrics.shift();
      }
    });
  }

  getMetrics(duration: number = 60): PerformanceMetric[] {
    const cutoff = new Date(Date.now() - duration * 1000);
    return this.metrics.filter((m) => m.timestamp > cutoff);
  }

  getAverageUtilization(duration: number = 60): number {
    const metrics = this.getMetrics(duration);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.gpuUtilization, 0);
    return sum / metrics.length;
  }

  getPeakMemoryUsage(duration: number = 60): number {
    const metrics = this.getMetrics(duration);
    return Math.max(...metrics.map((m) => m.memoryUsed));
  }

  getAverageTemperature(duration: number = 60): number {
    const metrics = this.getMetrics(duration);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.temperature, 0);
    return sum / metrics.length;
  }
}
```

## GPU Best Practices

### 1. Memory Management

```typescript
// Always dispose tensors
tf.tidy(() => {
  const result = model.predict(input);
  return result.dataSync();
});

// Check memory leaks
console.log(tf.memory());
```

### 2. Batch Processing

```typescript
// Process in batches for better GPU utilization
const batchSize = 32;
for (let i = 0; i < data.length; i += batchSize) {
  const batch = data.slice(i, i + batchSize);
  await processBatch(batch);
}
```

### 3. Multi-GPU Support

```typescript
// Distribute workload across GPUs
const gpuCount = gpuManager.getGPUCount();
const workloadPerGPU = Math.ceil(totalWork / gpuCount);

for (let gpuId = 0; gpuId < gpuCount; gpuId++) {
  await gpuManager.setGPU(gpuId);
  await processOnGPU(workloadPerGPU);
}
```

## Performance Benchmarks

Typical speedups with GPU acceleration:

- **Video Encoding**: 3-5x faster with NVENC
- **ML Inference**: 10-100x faster depending on model
- **Image Processing**: 5-15x faster
- **Matrix Operations**: 20-50x faster

## Key Patterns

1. **GPU Detection**: Check availability before using
2. **Fallback**: CPU processing when GPU unavailable
3. **Resource Monitoring**: Track GPU utilization and memory
4. **Memory Management**: Dispose tensors to prevent leaks
5. **Batch Processing**: Maximize GPU utilization
6. **Multi-GPU**: Distribute workload across GPUs
7. **Docker GPU**: Proper NVIDIA runtime configuration

## Common Pitfalls

❌ **DON'T**:
- Assume GPU is always available
- Forget to dispose GPU memory
- Use GPU for small workloads (overhead > benefit)
- Ignore temperature monitoring
- Skip Docker GPU runtime configuration

✅ **DO**:
- Check GPU availability first
- Clean up GPU resources
- Use GPU for large batches
- Monitor GPU metrics
- Configure NVIDIA Docker runtime properly

## Related Examples

- **ML Model**: `01-ai-ml-model-tensorflow.md`
- **Video Processing**: `02-video-processing-pipeline.md`
- **Deployment**: `devops-deployment/examples/01-complete-docker-setup.md`
