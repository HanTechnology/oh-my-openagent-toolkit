# File Upload Flow Example

**Complete File Upload Integration (Frontend → Backend → S3)**

> **When to Use**: Image uploads, document management, media storage
> **Skill**: fullstack-integration
> **Related**: frontend-nextjs (file upload), backend-nestjs (S3 integration)

---

## Overview

This example demonstrates the complete file upload flow:
- Frontend file selection and preview
- Progress tracking with upload indicator
- Drag-and-drop support
- File validation (size, type)
- Backend S3 integration
- Pre-signed URL generation
- Direct browser-to-S3 upload
- Error handling and retry
- Multiple file uploads

**Architecture**: Next.js frontend → Nest.js backend → AWS S3

## System Architecture

```
Frontend                 Backend                S3
┌──────────────┐        ┌────────────────┐     ┌─────────────┐
│ File Select  │        │                │     │             │
│ - Validation │───1───▶│ Generate       │     │             │
│ - Preview    │◀───2───│ Pre-Signed URL │     │             │
└──────────────┘        └────────────────┘     │             │
       │                                        │             │
       │                                        │    AWS S3   │
       │              Direct Upload             │             │
       └───────────────3──────────────────────▶│             │
                                                │             │
┌──────────────┐        ┌────────────────┐     │             │
│ Confirmation │◀───4───│ Save Metadata  │     │             │
│ Display      │        │ to Database    │     │             │
└──────────────┘        └────────────────┘     └─────────────┘

Flow:
1. Request pre-signed URL from backend
2. Backend generates S3 pre-signed URL
3. Frontend uploads directly to S3
4. Frontend notifies backend of successful upload
```

## Complete Implementation

### 1. Backend S3 Service

```typescript
// backend/src/upload/upload.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';

interface GeneratePresignedUrlDto {
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface FileUploadResult {
  url: string;
  key: string;
  fileName: string;
  fileSize: number;
}

@Injectable()
export class UploadService {
  private s3: S3;
  private bucket: string;

  constructor(private prisma: PrismaService) {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucket = process.env.AWS_S3_BUCKET || '';
  }

  async generatePresignedUrl(
    userId: string,
    dto: GeneratePresignedUrlDto,
  ): Promise<{ uploadUrl: string; key: string }> {
    // Validate file
    this.validateFile(dto.fileName, dto.fileType, dto.fileSize);

    // Generate unique key
    const extension = dto.fileName.split('.').pop();
    const key = `uploads/${userId}/${uuid()}.${extension}`;

    // Generate pre-signed URL (valid for 5 minutes)
    const uploadUrl = await this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.bucket,
      Key: key,
      ContentType: dto.fileType,
      Expires: 300, // 5 minutes
    });

    return { uploadUrl, key };
  }

  async confirmUpload(
    userId: string,
    key: string,
    fileName: string,
  ): Promise<FileUploadResult> {
    // Verify file exists in S3
    try {
      await this.s3
        .headObject({
          Bucket: this.bucket,
          Key: key,
        })
        .promise();
    } catch (error) {
      throw new BadRequestException('File not found in S3');
    }

    // Get file metadata
    const { ContentLength } = await this.s3
      .headObject({
        Bucket: this.bucket,
        Key: key,
      })
      .promise();

    // Save to database
    const file = await this.prisma.file.create({
      data: {
        key,
        fileName,
        fileSize: ContentLength || 0,
        userId,
        url: `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      },
    });

    return {
      url: file.url,
      key: file.key,
      fileName: file.fileName,
      fileSize: file.fileSize,
    };
  }

  async uploadDirect(
    file: Express.Multer.File,
    userId: string,
    folder: string = 'uploads',
  ): Promise<FileUploadResult> {
    // Validate file
    this.validateFile(file.originalname, file.mimetype, file.size);

    // Generate unique key
    const extension = file.originalname.split('.').pop();
    const key = `${folder}/${userId}/${uuid()}.${extension}`;

    // Upload to S3
    const result = await this.s3
      .upload({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
      .promise();

    // Save to database
    const savedFile = await this.prisma.file.create({
      data: {
        key: result.Key,
        fileName: file.originalname,
        fileSize: file.size,
        userId,
        url: result.Location,
      },
    });

    return {
      url: savedFile.url,
      key: savedFile.key,
      fileName: savedFile.fileName,
      fileSize: savedFile.fileSize,
    };
  }

  async deleteFile(userId: string, key: string): Promise<void> {
    // Verify ownership
    const file = await this.prisma.file.findFirst({
      where: { key, userId },
    });

    if (!file) {
      throw new BadRequestException('File not found or access denied');
    }

    // Delete from S3
    await this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key: key,
      })
      .promise();

    // Delete from database
    await this.prisma.file.delete({
      where: { id: file.id },
    });
  }

  private validateFile(fileName: string, fileType: string, fileSize: number) {
    // File size limit: 10MB
    const maxSize = 10 * 1024 * 1024;
    if (fileSize > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // Allowed file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(fileType)) {
      throw new BadRequestException('File type not allowed');
    }

    // File extension validation
    const extension = fileName.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf', 'doc', 'docx'];

    if (!extension || !allowedExtensions.includes(extension)) {
      throw new BadRequestException('File extension not allowed');
    }
  }
}
```

### 2. Backend Upload Controller

```typescript
// backend/src/upload/upload.controller.ts
import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  // Generate pre-signed URL for direct upload
  @Post('presigned-url')
  async generatePresignedUrl(
    @CurrentUser() user: any,
    @Body() dto: { fileName: string; fileType: string; fileSize: number },
  ) {
    return this.uploadService.generatePresignedUrl(user.userId, dto);
  }

  // Confirm upload completion
  @Post('confirm')
  async confirmUpload(
    @CurrentUser() user: any,
    @Body() dto: { key: string; fileName: string },
  ) {
    return this.uploadService.confirmUpload(user.userId, dto.key, dto.fileName);
  }

  // Direct upload through backend
  @Post('direct')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDirect(
    @CurrentUser() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|gif|pdf|doc|docx)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.uploadDirect(file, user.userId);
  }

  // Multiple files upload
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadMultiple(
    @CurrentUser() user: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploads = await Promise.all(
      files.map((file) => this.uploadService.uploadDirect(file, user.userId)),
    );

    return { files: uploads };
  }

  // Delete file
  @Delete(':key')
  async deleteFile(@CurrentUser() user: any, @Param('key') key: string) {
    await this.uploadService.deleteFile(user.userId, key);
    return { success: true };
  }
}
```

### 3. Frontend Upload Hook

```typescript
// frontend/lib/hooks/use-file-upload.ts
import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import axios from 'axios';

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

export function useFileUpload() {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(
    new Map(),
  );

  const uploadFile = async (file: File): Promise<string> => {
    const fileId = `${file.name}-${Date.now()}`;

    // Initialize progress
    setUploads((prev) =>
      new Map(prev).set(fileId, {
        fileName: file.name,
        progress: 0,
        status: 'pending',
      }),
    );

    try {
      // 1. Get pre-signed URL from backend
      setUploads((prev) => {
        const newMap = new Map(prev);
        const upload = newMap.get(fileId)!;
        upload.status = 'uploading';
        return newMap;
      });

      const { data } = await apiClient.post('/upload/presigned-url', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      const { uploadUrl, key } = data;

      // 2. Upload directly to S3
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );

          setUploads((prev) => {
            const newMap = new Map(prev);
            const upload = newMap.get(fileId)!;
            upload.progress = progress;
            return newMap;
          });
        },
      });

      // 3. Confirm upload with backend
      const { data: result } = await apiClient.post('/upload/confirm', {
        key,
        fileName: file.name,
      });

      // 4. Update status
      setUploads((prev) => {
        const newMap = new Map(prev);
        const upload = newMap.get(fileId)!;
        upload.status = 'success';
        upload.url = result.url;
        return newMap;
      });

      return result.url;
    } catch (error: any) {
      setUploads((prev) => {
        const newMap = new Map(prev);
        const upload = newMap.get(fileId)!;
        upload.status = 'error';
        upload.error = error.message || 'Upload failed';
        return newMap;
      });

      throw error;
    }
  };

  const uploadMultiple = async (files: File[]): Promise<string[]> => {
    const uploads = await Promise.all(files.map((file) => uploadFile(file)));
    return uploads;
  };

  const clearUpload = (fileId: string) => {
    setUploads((prev) => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
  };

  const clearAll = () => {
    setUploads(new Map());
  };

  return {
    uploads: Array.from(uploads.values()),
    uploadFile,
    uploadMultiple,
    clearUpload,
    clearAll,
  };
}
```

### 4. File Upload Component

```typescript
// frontend/components/upload/file-upload.tsx
'use client';

import { useState, useRef } from 'react';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadComplete?: (urls: string[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export function FileUpload({
  onUploadComplete,
  accept = 'image/*,.pdf,.doc,.docx',
  maxFiles = 5,
  maxSize = 10,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploads, uploadFile, uploadMultiple, clearAll } = useFileUpload();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate file count
    if (fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file sizes
    const invalidFiles = fileArray.filter(
      (file) => file.size > maxSize * 1024 * 1024,
    );
    if (invalidFiles.length > 0) {
      alert(`Files must be smaller than ${maxSize}MB`);
      return;
    }

    try {
      const urls = await uploadMultiple(fileArray);
      onUploadComplete?.(urls);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={cn(
          'relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum {maxFiles} files, up to {maxSize}MB each
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Uploading Files</h3>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>

          {uploads.map((upload, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {upload.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {upload.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                {upload.status === 'uploading' && (
                  <FileIcon className="h-5 w-5 text-primary" />
                )}
                {upload.status === 'pending' && (
                  <FileIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* File Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {upload.fileName}
                </p>

                {upload.status === 'uploading' && (
                  <Progress value={upload.progress} className="mt-2 h-1" />
                )}

                {upload.status === 'success' && (
                  <p className="text-xs text-green-600">Upload complete</p>
                )}

                {upload.status === 'error' && (
                  <p className="text-xs text-destructive">
                    {upload.error || 'Upload failed'}
                  </p>
                )}
              </div>

              {/* Progress Percentage */}
              {upload.status === 'uploading' && (
                <span className="text-sm text-muted-foreground">
                  {upload.progress}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 5. Image Upload with Preview

```typescript
// frontend/components/upload/image-upload.tsx
'use client';

import { useState } from 'react';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  currentImage?: string;
}

export function ImageUpload({
  onUploadComplete,
  currentImage,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const { uploadFile } = useFileUpload();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      onUploadComplete?.(url);
    } catch (error) {
      console.error('Upload failed:', error);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete?.('');
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-primary/50">
          <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">Click to upload image</p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP up to 10MB
          </p>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}

      {isUploading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
    </div>
  );
}
```

### 6. Prisma Schema

```prisma
// prisma/schema.prisma
model File {
  id        String   @id @default(cuid())
  key       String   @unique
  fileName  String
  fileSize  Int
  url       String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

## Upload Flow Sequence

### Pre-Signed URL Flow (Recommended)

```
1. User selects file
   └─▶ Validation: size, type, extension

2. Request pre-signed URL
   └─▶ POST /upload/presigned-url
       └─▶ { fileName, fileType, fileSize }

3. Backend generates URL
   └─▶ S3.getSignedUrl('putObject')
       └─▶ Returns: { uploadUrl, key }

4. Direct upload to S3
   └─▶ PUT to pre-signed URL
       └─▶ With progress tracking
       └─▶ File stored in S3

5. Confirm upload
   └─▶ POST /upload/confirm { key, fileName }
       └─▶ Backend verifies file in S3
       └─▶ Saves metadata to database
       └─▶ Returns: { url, key }

6. Update UI
   └─▶ Display uploaded file
   └─▶ Call onUploadComplete callback
```

### Direct Upload Flow (Alternative)

```
1. User selects file
   └─▶ Validation

2. Upload through backend
   └─▶ POST /upload/direct (multipart/form-data)
       └─▶ File in request body

3. Backend processes
   └─▶ Validates file
   └─▶ Uploads to S3
   └─▶ Saves metadata
   └─▶ Returns URL

4. Update UI
```

## Security Best Practices

### 1. File Validation

```typescript
// Both frontend and backend validation
const validateFile = (file: File) => {
  // Size check
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large');
  }

  // Type check
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  // Extension check (prevent double extension attacks)
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !['jpg', 'jpeg', 'png', 'pdf'].includes(extension)) {
    throw new Error('Invalid file extension');
  }
};
```

### 2. S3 Bucket Configuration

```json
// S3 CORS Configuration
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourapp.com"],
      "AllowedMethods": ["PUT", "GET"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### 3. Pre-Signed URL Expiration

```typescript
// Short expiration (5 minutes)
Expires: 300
```

## Performance Optimization

### 1. Image Optimization

```typescript
// Compress images before upload
import imageCompression from 'browser-image-compression';

const compressImage = async (file: File): Promise<File> => {
  return await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });
};
```

### 2. Chunked Upload for Large Files

```typescript
// For files > 100MB, use multipart upload
const uploadLargeFile = async (file: File) => {
  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  const chunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < chunks; i++) {
    const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
    // Upload each chunk
  }
};
```

## Key Integration Patterns

1. **Pre-Signed URLs**: Direct browser-to-S3 upload (faster, reduces backend load)
2. **Progress Tracking**: Real-time upload progress with axios onUploadProgress
3. **File Validation**: Both client and server-side validation
4. **Preview Generation**: FileReader for immediate preview
5. **Error Recovery**: Retry failed uploads
6. **Database Metadata**: Track uploaded files for management
7. **Access Control**: User-specific S3 keys and permissions

## Common Pitfalls

❌ **DON'T**:
- Upload through backend for large files (use pre-signed URLs)
- Skip file validation
- Store files without user association
- Use public S3 buckets without access control
- Forget to handle upload errors

✅ **DO**:
- Use pre-signed URLs for direct S3 upload
- Validate files on both frontend and backend
- Associate files with users
- Set appropriate S3 bucket policies
- Implement progress tracking and error handling

## Related Examples

- **Backend**: `backend-nestjs/examples/03-file-upload.md`
- **Frontend**: `frontend-nextjs/examples/03-form-components-validation.md`
- **API Integration**: `02-api-integration-pattern.md`
