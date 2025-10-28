# File Upload Module Example

**S3 File Upload with Nest.js**

> **Skill**: backend-nestjs
> **Related**: frontend-nextjs (file upload forms), devops-deployment (S3 config)

---

## File Upload Implementation

```typescript
// upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string) {
    const key = `${folder}/${uuid()}-${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const result = await this.s3.upload(params).promise();

    return {
      url: result.Location,
      key: result.Key,
    };
  }

  async deleteFile(key: string) {
    await this.s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    }).promise();
  }
}

// upload/upload.controller.ts
@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.uploadFile(file, 'images');
  }
}
```

## Key Patterns

1. **Multer**: File handling middleware
2. **S3 SDK**: AWS file storage
3. **Validation**: Size and type checking
4. **UUID**: Unique file names
5. **Public URLs**: Accessible file links
