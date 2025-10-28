# Video Processing Pipeline Example

**Production-Ready Video Processing System**

> **When to Use**: Video uploads, transcoding, thumbnails, streaming
> **Skill**: systemdev-specialist
> **Related**: backend-nestjs (video API), devops-deployment (processing workers)

---

## Overview

This example demonstrates a complete video processing pipeline:
- Video upload and validation
- Background processing with Bull Queue
- FFmpeg transcoding (multiple formats)
- Thumbnail generation
- HLS streaming preparation
- Progress tracking
- S3 storage integration
- Webhook notifications

**Architecture**: Upload → Queue → FFmpeg Workers → S3 → Delivery

## System Architecture

```
Client Upload       API Server          Queue System        Workers
┌──────────┐       ┌───────────┐       ┌──────────┐       ┌─────────────┐
│ Video    │──────▶│ Upload    │──────▶│ Bull     │──────▶│ FFmpeg      │
│ File     │◀──────│ Endpoint  │◀──────│ Queue    │◀──────│ Processing  │
└──────────┘       └───────────┘       └──────────┘       └─────────────┘
                         │                    │                    │
                         │                    │                    ▼
                         │                    │            ┌─────────────┐
                         │                    │            │ - Transcode │
                         │                    │            │ - Thumbnail │
                         │                    │            │ - HLS       │
                         │                    │            └─────────────┘
                         ▼                    ▼                    │
                   ┌───────────┐       ┌──────────┐              │
                   │ Redis     │       │ Progress │              │
                   │ Status    │       │ Updates  │              │
                   └───────────┘       └──────────┘              ▼
                                                          ┌─────────────┐
                                                          │ S3 Storage  │
                                                          │ - Original  │
                                                          │ - 1080p     │
                                                          │ - 720p      │
                                                          │ - 480p      │
                                                          │ - Thumbnail │
                                                          └─────────────┘
```

## Complete Implementation

### 1. Video Queue Service

```typescript
// backend/src/video/video-queue.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface VideoProcessingJob {
  videoId: string;
  userId: string;
  filePath: string;
  originalName: string;
}

@Injectable()
export class VideoQueueService {
  constructor(
    @InjectQueue('video-processing')
    private videoQueue: Queue,
  ) {}

  async addProcessingJob(data: VideoProcessingJob) {
    const job = await this.videoQueue.add('process-video', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: false,
      removeOnFail: false,
    });

    return {
      jobId: job.id,
      status: await job.getState(),
    };
  }

  async getJobStatus(jobId: string) {
    const job = await this.videoQueue.getJob(jobId);

    if (!job) {
      return null;
    }

    return {
      id: job.id,
      status: await job.getState(),
      progress: job.progress(),
      data: job.data,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason,
    };
  }

  async getActiveJobs() {
    return this.videoQueue.getActive();
  }

  async getCompletedJobs(start = 0, end = 10) {
    return this.videoQueue.getCompleted(start, end);
  }

  async getFailedJobs(start = 0, end = 10) {
    return this.videoQueue.getFailed(start, end);
  }

  async retryJob(jobId: string) {
    const job = await this.videoQueue.getJob(jobId);
    if (job) {
      await job.retry();
      return true;
    }
    return false;
  }

  async removeJob(jobId: string) {
    const job = await this.videoQueue.getJob(jobId);
    if (job) {
      await job.remove();
      return true;
    }
    return false;
  }
}
```

### 2. Video Processor (FFmpeg)

```typescript
// backend/src/video/video-processor.service.ts
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

interface TranscodeOptions {
  resolution: string;
  videoBitrate: string;
  audioBitrate: string;
}

const TRANSCODE_PRESETS: Record<string, TranscodeOptions> = {
  '1080p': {
    resolution: '1920x1080',
    videoBitrate: '5000k',
    audioBitrate: '192k',
  },
  '720p': {
    resolution: '1280x720',
    videoBitrate: '2500k',
    audioBitrate: '128k',
  },
  '480p': {
    resolution: '854x480',
    videoBitrate: '1000k',
    audioBitrate: '128k',
  },
};

@Injectable()
export class VideoProcessorService {
  private s3: S3;
  private bucket: string;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucket = process.env.AWS_S3_BUCKET || '';
  }

  async processVideo(
    inputPath: string,
    videoId: string,
    onProgress: (percent: number) => void,
  ): Promise<{
    original: string;
    transcoded: Record<string, string>;
    thumbnail: string;
    hls: string;
  }> {
    const tempDir = path.join('/tmp', videoId);
    await mkdir(tempDir, { recursive: true });

    try {
      // 1. Get video metadata
      const metadata = await this.getVideoMetadata(inputPath);

      // 2. Upload original to S3
      const originalUrl = await this.uploadToS3(
        inputPath,
        `videos/${videoId}/original.mp4`,
      );
      onProgress(10);

      // 3. Generate thumbnail
      const thumbnailPath = path.join(tempDir, 'thumbnail.jpg');
      await this.generateThumbnail(inputPath, thumbnailPath);
      const thumbnailUrl = await this.uploadToS3(
        thumbnailPath,
        `videos/${videoId}/thumbnail.jpg`,
      );
      onProgress(20);

      // 4. Transcode to multiple resolutions
      const transcodedUrls: Record<string, string> = {};
      const resolutions = ['1080p', '720p', '480p'];
      let progressStep = 30;

      for (const resolution of resolutions) {
        if (this.shouldTranscode(metadata, resolution)) {
          const outputPath = path.join(tempDir, `${resolution}.mp4`);

          await this.transcode(
            inputPath,
            outputPath,
            TRANSCODE_PRESETS[resolution],
            (percent) => {
              const totalProgress = progressStep + (percent / resolutions.length);
              onProgress(totalProgress);
            },
          );

          transcodedUrls[resolution] = await this.uploadToS3(
            outputPath,
            `videos/${videoId}/${resolution}.mp4`,
          );

          await unlink(outputPath);
        }
        progressStep += 70 / resolutions.length;
      }

      // 5. Generate HLS playlist
      const hlsPath = path.join(tempDir, 'hls');
      await mkdir(hlsPath, { recursive: true });
      await this.generateHLS(inputPath, hlsPath);

      // Upload HLS files
      const hlsFiles = fs.readdirSync(hlsPath);
      for (const file of hlsFiles) {
        await this.uploadToS3(
          path.join(hlsPath, file),
          `videos/${videoId}/hls/${file}`,
        );
      }

      const hlsUrl = `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/${videoId}/hls/playlist.m3u8`;
      onProgress(100);

      // Cleanup
      await this.cleanup(tempDir);

      return {
        original: originalUrl,
        transcoded: transcodedUrls,
        thumbnail: thumbnailUrl,
        hls: hlsUrl,
      };
    } catch (error) {
      await this.cleanup(tempDir);
      throw error;
    }
  }

  private async getVideoMetadata(inputPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata);
      });
    });
  }

  private async generateThumbnail(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .screenshots({
          timestamps: ['10%'],
          filename: path.basename(outputPath),
          folder: path.dirname(outputPath),
          size: '1280x720',
        })
        .on('end', () => resolve())
        .on('error', reject);
    });
  }

  private async transcode(
    inputPath: string,
    outputPath: string,
    options: TranscodeOptions,
    onProgress: (percent: number) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .size(options.resolution)
        .videoBitrate(options.videoBitrate)
        .audioBitrate(options.audioBitrate)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-preset fast',
          '-movflags +faststart', // Enable progressive download
          '-pix_fmt yuv420p',
        ])
        .output(outputPath)
        .on('progress', (progress) => {
          onProgress(progress.percent || 0);
        })
        .on('end', () => resolve())
        .on('error', reject)
        .run();
    });
  }

  private async generateHLS(
    inputPath: string,
    outputDir: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-codec: copy',
          '-start_number 0',
          '-hls_time 10',
          '-hls_list_size 0',
          '-f hls',
        ])
        .output(path.join(outputDir, 'playlist.m3u8'))
        .on('end', () => resolve())
        .on('error', reject)
        .run();
    });
  }

  private shouldTranscode(metadata: any, resolution: string): boolean {
    const videoStream = metadata.streams.find((s: any) => s.codec_type === 'video');
    if (!videoStream) return false;

    const height = videoStream.height;
    const targetHeight = parseInt(resolution);

    // Only transcode if source resolution is higher
    return height >= targetHeight;
  }

  private async uploadToS3(filePath: string, key: string): Promise<string> {
    const fileContent = fs.readFileSync(filePath);

    await this.s3
      .upload({
        Bucket: this.bucket,
        Key: key,
        Body: fileContent,
        ContentType: this.getContentType(filePath),
      })
      .promise();

    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const types: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.m3u8': 'application/x-mpegURL',
      '.ts': 'video/MP2T',
    };
    return types[ext] || 'application/octet-stream';
  }

  private async cleanup(dir: string): Promise<void> {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          await this.cleanup(filePath);
        } else {
          await unlink(filePath);
        }
      }
      fs.rmdirSync(dir);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}
```

### 3. Bull Queue Processor

```typescript
// backend/src/video/video.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { VideoProcessorService } from './video-processor.service';
import { PrismaService } from '../prisma/prisma.service';
import { WebhookService } from '../webhook/webhook.service';

@Processor('video-processing')
export class VideoProcessor {
  constructor(
    private videoProcessor: VideoProcessorService,
    private prisma: PrismaService,
    private webhook: WebhookService,
  ) {}

  @Process('process-video')
  async handleVideoProcessing(job: Job) {
    const { videoId, userId, filePath, originalName } = job.data;

    try {
      // Update status to processing
      await this.prisma.video.update({
        where: { id: videoId },
        data: { status: 'processing' },
      });

      // Process video
      const result = await this.videoProcessor.processVideo(
        filePath,
        videoId,
        (percent) => {
          job.progress(percent);
        },
      );

      // Update database
      await this.prisma.video.update({
        where: { id: videoId },
        data: {
          status: 'completed',
          originalUrl: result.original,
          transcodedUrls: result.transcoded,
          thumbnailUrl: result.thumbnail,
          hlsUrl: result.hls,
          processedAt: new Date(),
        },
      });

      // Send webhook notification
      await this.webhook.send(userId, {
        event: 'video.processed',
        data: {
          videoId,
          status: 'completed',
          urls: result,
        },
      });

      return result;
    } catch (error) {
      // Update status to failed
      await this.prisma.video.update({
        where: { id: videoId },
        data: {
          status: 'failed',
          errorMessage: error.message,
        },
      });

      // Send error notification
      await this.webhook.send(userId, {
        event: 'video.failed',
        data: {
          videoId,
          error: error.message,
        },
      });

      throw error;
    }
  }
}
```

### 4. Video Upload Controller

```typescript
// backend/src/video/video.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { VideoQueueService } from './video-queue.service';
import { PrismaService } from '../prisma/prisma.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Controller('videos')
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(
    private videoQueue: VideoQueueService,
    private prisma: PrismaService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: '/tmp/uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${uuid()}${path.extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadVideo(
    @CurrentUser() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }), // 500MB
          new FileTypeValidator({ fileType: /(mp4|webm|mov|avi)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // Create video record
    const video = await this.prisma.video.create({
      data: {
        userId: user.userId,
        originalName: file.originalname,
        fileSize: file.size,
        status: 'pending',
      },
    });

    // Add to processing queue
    const job = await this.videoQueue.addProcessingJob({
      videoId: video.id,
      userId: user.userId,
      filePath: file.path,
      originalName: file.originalname,
    });

    return {
      videoId: video.id,
      jobId: job.jobId,
      status: job.status,
    };
  }

  @Get(':id/status')
  async getVideoStatus(@Param('id') id: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        originalUrl: true,
        transcodedUrls: true,
        thumbnailUrl: true,
        hlsUrl: true,
        processedAt: true,
        errorMessage: true,
      },
    });

    return video;
  }

  @Get('job/:jobId')
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.videoQueue.getJobStatus(jobId);
  }
}
```

### 5. Frontend Integration

```typescript
// frontend/components/video/video-uploader.tsx
'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Video } from 'lucide-react';

export function VideoUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload video
      const { data } = await apiClient.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / (e.total || 1));
          setUploadProgress(percent);
        },
      });

      setVideoId(data.videoId);
      setProcessingStatus('processing');

      // Poll for processing status
      pollStatus(data.videoId);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const pollStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await apiClient.get(`/videos/${id}/status`);

        if (data.status === 'completed') {
          setProcessingStatus('completed');
          clearInterval(interval);
        } else if (data.status === 'failed') {
          setProcessingStatus('failed');
          clearInterval(interval);
        }
      } catch (error) {
        clearInterval(interval);
      }
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8">
        <Video className="mb-4 h-10 w-10" />
        <p className="text-sm font-medium">Select video to upload</p>
        <input
          type="file"
          className="hidden"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>

      {file && (
        <div>
          <p className="text-sm">{file.name}</p>
          <Button onClick={handleUpload} disabled={uploading}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      )}

      {uploading && <Progress value={uploadProgress} />}

      {processingStatus && (
        <div className="rounded-lg border p-4">
          <p>Status: {processingStatus}</p>
        </div>
      )}
    </div>
  );
}
```

## Docker Configuration

```dockerfile
# Dockerfile for video processing worker
FROM node:18-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["node", "dist/worker.js"]
```

## Key Patterns

1. **Queue-Based Processing**: Asynchronous video processing with Bull
2. **FFmpeg Integration**: Industry-standard video transcoding
3. **Multi-Resolution**: Adaptive streaming support
4. **Progress Tracking**: Real-time processing updates
5. **HLS Generation**: Streaming-ready output
6. **Error Recovery**: Automatic retry with exponential backoff
7. **Cleanup**: Temporary file management

## Common Pitfalls

❌ **DON'T**:
- Process videos synchronously
- Store processed files locally
- Skip thumbnail generation
- Ignore video metadata
- Forget cleanup

✅ **DO**:
- Use queue for async processing
- Upload to S3
- Generate thumbnails early
- Check video resolution before transcoding
- Clean up temporary files

## Related Examples

- **Backend**: `backend-nestjs/examples/03-file-upload.md`
- **Deployment**: `devops-deployment/examples/01-complete-docker-setup.md`
- **ML**: `01-ai-ml-model-tensorflow.md` (video classification)
