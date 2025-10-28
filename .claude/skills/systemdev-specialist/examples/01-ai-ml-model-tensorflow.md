# AI/ML Model with TensorFlow Example

**Production-Ready Machine Learning Model Deployment**

> **When to Use**: Image classification, prediction APIs, ML-powered features
> **Skill**: systemdev-specialist
> **Related**: backend-nestjs (ML API), devops-deployment (model serving)

---

## Overview

This example demonstrates a complete ML model integration:
- TensorFlow model training and export
- Model serving with TensorFlow Serving
- REST API for predictions
- Image preprocessing pipeline
- Model versioning and updates
- Performance optimization
- GPU acceleration (optional)

**Architecture**: TensorFlow → Saved Model → TensorFlow Serving → Nest.js API

## System Architecture

```
Client Request          API Layer              ML Layer
┌────────────┐         ┌─────────────┐        ┌──────────────────┐
│ Image      │────────▶│ Nest.js API │───────▶│ TensorFlow       │
│ Upload     │◀────────│ - Validate  │◀───────│ Serving          │
└────────────┘         │ - Preprocess│        │ - Model v1.0     │
                       └─────────────┘        │ - GPU Support    │
                                              └──────────────────┘
                                                       │
                                                       ▼
                                              ┌──────────────────┐
                                              │ Saved Model      │
                                              │ - Weights        │
                                              │ - Architecture   │
                                              │ - Preprocessing  │
                                              └──────────────────┘
```

## Complete Implementation

### 1. Model Training (Python)

```python
# train_model.py
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import os

# Configuration
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 50
NUM_CLASSES = 10
MODEL_VERSION = "1"
MODEL_NAME = "image_classifier"

def create_model():
    """Create CNN model for image classification"""
    model = keras.Sequential([
        # Input layer
        layers.Input(shape=(*IMAGE_SIZE, 3)),

        # Preprocessing
        layers.Rescaling(1./255),

        # Data augmentation
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),

        # Convolutional blocks
        layers.Conv2D(32, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.BatchNormalization(),

        layers.Conv2D(64, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.BatchNormalization(),

        layers.Conv2D(128, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.BatchNormalization(),

        layers.Conv2D(256, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.BatchNormalization(),

        # Dense layers
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])

    return model

def train_model(train_dataset, val_dataset):
    """Train the model"""
    model = create_model()

    # Compile
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )

    # Callbacks
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            'checkpoints/model_{epoch:02d}_{val_accuracy:.2f}.h5',
            save_best_only=True,
            monitor='val_accuracy'
        ),
        keras.callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=10,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7
        ),
        keras.callbacks.TensorBoard(
            log_dir='logs',
            histogram_freq=1
        )
    ]

    # Train
    history = model.fit(
        train_dataset,
        validation_data=val_dataset,
        epochs=EPOCHS,
        callbacks=callbacks
    )

    return model, history

def export_model(model, export_path):
    """Export model in SavedModel format for TensorFlow Serving"""

    # Create signature
    @tf.function(input_signature=[
        tf.TensorSpec(shape=[None, *IMAGE_SIZE, 3], dtype=tf.float32, name='images')
    ])
    def serve_fn(images):
        # Preprocessing
        images = tf.cast(images, tf.float32) / 255.0

        # Prediction
        predictions = model(images, training=False)

        return {
            'predictions': predictions,
            'class_ids': tf.argmax(predictions, axis=1),
            'confidences': tf.reduce_max(predictions, axis=1)
        }

    # Save model
    tf.saved_model.save(
        model,
        export_path,
        signatures={'serving_default': serve_fn}
    )

    print(f"Model exported to {export_path}")

def load_dataset():
    """Load and preprocess dataset"""
    # Example: Load from directory
    train_ds = tf.keras.utils.image_dataset_from_directory(
        'data/train',
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode='int'
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        'data/val',
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        label_mode='int'
    )

    # Optimize performance
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    return train_ds, val_ds

if __name__ == '__main__':
    # Load data
    print("Loading dataset...")
    train_ds, val_ds = load_dataset()

    # Train model
    print("Training model...")
    model, history = train_model(train_ds, val_ds)

    # Export for serving
    export_path = f"models/{MODEL_NAME}/{MODEL_VERSION}"
    print(f"Exporting model to {export_path}...")
    export_model(model, export_path)

    print("Training complete!")
    print(f"Final validation accuracy: {history.history['val_accuracy'][-1]:.4f}")
```

### 2. TensorFlow Serving Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  tensorflow-serving:
    image: tensorflow/serving:latest-gpu  # or latest for CPU
    container_name: tf-serving
    ports:
      - "8501:8501"  # REST API
      - "8500:8500"  # gRPC API
    volumes:
      - ./models:/models
    environment:
      - MODEL_NAME=image_classifier
      - MODEL_BASE_PATH=/models/image_classifier
    command:
      - "--model_config_file=/models/models.config"
      - "--model_config_file_poll_wait_seconds=60"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

```protobuf
# models/models.config
model_config_list {
  config {
    name: 'image_classifier'
    base_path: '/models/image_classifier'
    model_platform: 'tensorflow'
    model_version_policy {
      latest {
        num_versions: 2
      }
    }
  }
}
```

### 3. Backend ML Service (Nest.js)

```typescript
// backend/src/ml/ml.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as sharp from 'sharp';
import * as tf from '@tensorflow/tfjs-node';

interface PredictionResult {
  classId: number;
  className: string;
  confidence: number;
  allPredictions: Array<{
    classId: number;
    className: string;
    probability: number;
  }>;
}

@Injectable()
export class MLService {
  private readonly tfServingUrl = process.env.TF_SERVING_URL || 'http://localhost:8501';
  private readonly modelName = 'image_classifier';

  // Class labels (should match training data)
  private readonly classNames = [
    'airplane', 'automobile', 'bird', 'cat', 'deer',
    'dog', 'frog', 'horse', 'ship', 'truck'
  ];

  async predictImage(imageBuffer: Buffer): Promise<PredictionResult> {
    try {
      // Preprocess image
      const preprocessed = await this.preprocessImage(imageBuffer);

      // Make prediction request to TensorFlow Serving
      const response = await axios.post(
        `${this.tfServingUrl}/v1/models/${this.modelName}:predict`,
        {
          instances: [preprocessed]
        },
        {
          timeout: 10000, // 10 seconds
        }
      );

      // Parse response
      const predictions = response.data.predictions[0];
      const classId = predictions.indexOf(Math.max(...predictions));
      const confidence = predictions[classId];

      // Get top 5 predictions
      const allPredictions = predictions
        .map((prob: number, idx: number) => ({
          classId: idx,
          className: this.classNames[idx],
          probability: prob,
        }))
        .sort((a: any, b: any) => b.probability - a.probability)
        .slice(0, 5);

      return {
        classId,
        className: this.classNames[classId],
        confidence,
        allPredictions,
      };
    } catch (error) {
      console.error('Prediction error:', error);
      throw new BadRequestException('Failed to make prediction');
    }
  }

  private async preprocessImage(imageBuffer: Buffer): Promise<number[][][]> {
    try {
      // Resize and normalize image using sharp
      const resized = await sharp(imageBuffer)
        .resize(224, 224, {
          fit: 'cover',
          position: 'center',
        })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Convert to 3D array [height, width, channels]
      const { data, info } = resized;
      const pixels: number[][][] = [];

      for (let y = 0; y < info.height; y++) {
        const row: number[][] = [];
        for (let x = 0; x < info.width; x++) {
          const idx = (y * info.width + x) * 3;
          row.push([
            data[idx],     // R
            data[idx + 1], // G
            data[idx + 2], // B
          ]);
        }
        pixels.push(row);
      }

      return pixels;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      throw new BadRequestException('Invalid image format');
    }
  }

  async predictBatch(images: Buffer[]): Promise<PredictionResult[]> {
    const predictions = await Promise.all(
      images.map((img) => this.predictImage(img))
    );
    return predictions;
  }

  async getModelMetadata() {
    try {
      const response = await axios.get(
        `${this.tfServingUrl}/v1/models/${this.modelName}/metadata`
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to get model metadata');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.tfServingUrl}/v1/models/${this.modelName}`,
        { timeout: 3000 }
      );
      return response.data.model_version_status?.[0]?.state === 'AVAILABLE';
    } catch {
      return false;
    }
  }
}
```

### 4. ML Controller

```typescript
// backend/src/ml/ml.controller.ts
import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MLService } from './ml.service';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';

@ApiTags('ml')
@Controller('ml')
export class MLController {
  constructor(private mlService: MLService) {}

  @Post('predict')
  @ApiOperation({ summary: 'Predict image class' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async predict(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.mlService.predictImage(file.buffer);

    return {
      success: true,
      prediction: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('predict/batch')
  @ApiOperation({ summary: 'Predict multiple images' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  async predictBatch(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const results = await this.mlService.predictBatch(
      files.map((f) => f.buffer)
    );

    return {
      success: true,
      predictions: results,
      count: results.length,
    };
  }

  @Get('metadata')
  @ApiOperation({ summary: 'Get model metadata' })
  async getMetadata() {
    return this.mlService.getModelMetadata();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check ML service health' })
  async healthCheck() {
    const healthy = await this.mlService.healthCheck();

    return {
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    };
  }
}
```

### 5. Frontend Integration

```typescript
// frontend/lib/api/ml.ts
import { apiClient } from './client';

export interface MLPrediction {
  classId: number;
  className: string;
  confidence: number;
  allPredictions: Array<{
    classId: number;
    className: string;
    probability: number;
  }>;
}

export const mlAPI = {
  predict: async (file: File): Promise<MLPrediction> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/ml/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.prediction;
  },

  predictBatch: async (files: File[]): Promise<MLPrediction[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await apiClient.post('/ml/predict/batch', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.predictions;
  },

  getMetadata: async () => {
    const response = await apiClient.get('/ml/metadata');
    return response.data;
  },

  healthCheck: async () => {
    const response = await apiClient.get('/ml/health');
    return response.data;
  },
};
```

### 6. Image Classifier Component

```typescript
// frontend/components/ml/image-classifier.tsx
'use client';

import { useState } from 'react';
import { mlAPI, type MLPrediction } from '@/lib/api/ml';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export function ImageClassifier() {
  const [image, setImage] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Classify
    setIsClassifying(true);
    setPrediction(null);

    try {
      const result = await mlAPI.predict(file);
      setPrediction(result);
    } catch (error) {
      console.error('Classification failed:', error);
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      <Card className="p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary">
          <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">Upload image to classify</p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP up to 10MB
          </p>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isClassifying}
          />
        </label>
      </Card>

      {/* Preview */}
      {image && (
        <Card className="p-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={image}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
        </Card>
      )}

      {/* Results */}
      {isClassifying && (
        <Card className="p-6">
          <p className="mb-2 text-sm text-muted-foreground">
            Classifying image...
          </p>
          <Progress value={undefined} />
        </Card>
      )}

      {prediction && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Classification Results</h3>

          {/* Top prediction */}
          <div className="mb-4 rounded-lg bg-primary/10 p-4">
            <p className="text-sm text-muted-foreground">Top Prediction</p>
            <p className="text-2xl font-bold">{prediction.className}</p>
            <p className="text-sm">
              Confidence: {(prediction.confidence * 100).toFixed(2)}%
            </p>
          </div>

          {/* All predictions */}
          <div className="space-y-2">
            <p className="text-sm font-medium">All Predictions:</p>
            {prediction.allPredictions.map((pred, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm">{pred.className}</span>
                <div className="flex items-center gap-2">
                  <Progress
                    value={pred.probability * 100}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    {(pred.probability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
```

## Model Performance Optimization

### GPU Acceleration

```python
# Enable GPU in TensorFlow
import tensorflow as tf

# Check GPU availability
print("GPUs Available:", tf.config.list_physical_devices('GPU'))

# Configure GPU memory growth
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)
```

### Model Quantization

```python
# Quantize model for faster inference
def quantize_model(model, export_path):
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    tflite_model = converter.convert()

    with open(f'{export_path}/model.tflite', 'wb') as f:
        f.write(tflite_model)
```

## Monitoring and Logging

```typescript
// Track prediction metrics
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MLMetricsService {
  constructor(private prisma: PrismaService) {}

  async logPrediction(
    userId: string,
    prediction: PredictionResult,
    latencyMs: number,
  ) {
    await this.prisma.mlPrediction.create({
      data: {
        userId,
        classId: prediction.classId,
        confidence: prediction.confidence,
        latencyMs,
        timestamp: new Date(),
      },
    });
  }

  async getMetrics(startDate: Date, endDate: Date) {
    const predictions = await this.prisma.mlPrediction.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return {
      totalPredictions: predictions.length,
      averageLatency: predictions.reduce((sum, p) => sum + p.latencyMs, 0) / predictions.length,
      classDistribution: this.calculateClassDistribution(predictions),
    };
  }
}
```

## Key Patterns

1. **SavedModel Format**: Standard TensorFlow export for serving
2. **TensorFlow Serving**: Production-grade model serving
3. **Image Preprocessing**: Sharp for fast image manipulation
4. **Batch Prediction**: Handle multiple images efficiently
5. **Health Checks**: Monitor model availability
6. **GPU Support**: Optional GPU acceleration
7. **Versioning**: Multiple model versions in production

## Common Pitfalls

❌ **DON'T**:
- Load models in Node.js (use TensorFlow Serving)
- Skip image preprocessing
- Forget error handling
- Ignore model versioning
- Skip performance monitoring

✅ **DO**:
- Use TensorFlow Serving for production
- Preprocess images correctly
- Handle prediction errors gracefully
- Version models properly
- Monitor prediction metrics

## Related Examples

- **Backend**: `backend-nestjs/examples/03-file-upload.md`
- **Deployment**: `devops-deployment/examples/01-complete-docker-setup.md`
- **Testing**: `qa-testing/examples/03-performance-testing.md`
