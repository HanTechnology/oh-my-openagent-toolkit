# Form Components with Validation Example

**Production-Ready Forms with Next.js 15.5+ and Zod**

> **When to Use**: Any data input scenario (create, update operations)
> **Skill**: frontend-nextjs
> **Related**: backend-nestjs (DTO validation), fullstack-integration (form submission)

---

## Overview

Production-ready form handling with:
- react-hook-form for form state
- Zod for type-safe validation
- Shadcn/ui form components
- File upload support
- Multi-step forms
- **NO EMOJIS** (Lucide Icons only)

## Complete Product Form Example

```typescript
// lib/schemas/product.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),

  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive('Price must be positive')
    .max(999999, 'Price is too high'),

  category: z
    .string()
    .min(1, 'Category is required'),

  stock: z
    .number()
    .int('Stock must be a whole number')
    .nonnegative('Stock cannot be negative'),

  tags: z
    .array(z.string())
    .min(1, 'At least one tag is required'),

  image: z
    .instanceof(File, { message: 'Image is required' })
    .refine((file) => file.size <= 5000000, 'Max file size is 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .png, .webp formats are supported'
    ),
});

export type ProductFormInput = z.infer<typeof productSchema>;
```

```typescript
// components/products/product-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Save, Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { productSchema, type ProductFormInput } from '@/lib/schemas/product';

interface ProductFormProps {
  initialData?: Partial<ProductFormInput>;
  onSubmit: (data: ProductFormInput) => Promise<void>;
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: ProductFormInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      router.push('/products');
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          {...register('name')}
          disabled={isSubmitting}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          rows={4}
          {...register('description')}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            disabled={isSubmitting}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            {...register('stock', { valueAsNumber: true })}
            disabled={isSubmitting}
          />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select onValueChange={(value) => setValue('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">Product Image *</Label>
        <div className="flex items-center gap-4">
          <Input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          {imagePreview && (
            <div className="relative h-20 w-20">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full rounded object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6"
                onClick={() => {
                  setImagePreview(null);
                  setValue('image', undefined as any);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {errors.image && (
          <p className="text-sm text-destructive">{errors.image.message}</p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Product
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

## Multi-Step Form Example

```typescript
// components/forms/multi-step-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepConfig {
  title: string;
  fields: string[];
  component: React.ComponentType<any>;
}

export function MultiStepForm({ steps }: { steps: StepConfig[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm();

  const nextStep = async () => {
    const isValid = await form.trigger(steps[currentStep].fields);
    if (isValid) setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`flex-1 h-2 rounded ${
              idx <= currentStep ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Step Title */}
      <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>

      {/* Step Content */}
      <CurrentStepComponent form={form} />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          type="button"
          onClick={currentStep === steps.length - 1 ? form.handleSubmit(() => {}) : nextStep}
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
          {currentStep < steps.length - 1 && (
            <ChevronRight className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
```

## Key Patterns

1. **Controlled Forms**: react-hook-form manages state
2. **Type-Safe Validation**: Zod schemas with TypeScript inference
3. **Field-Level Errors**: Individual field validation
4. **File Upload**: Preview and validation
5. **Multi-Step**: Progress tracking and step validation

## Best Practices

✅ DO:
- Validate on client AND server
- Provide immediate feedback
- Show loading states
- Use proper input types (number, email, etc.)
- Implement file size/type validation

❌ DON'T:
- Trust client-side validation alone
- Skip accessibility attributes
- Use emojis in error messages
- Forget to handle submission errors

## Related Examples

- **Backend**: `backend-nestjs/examples/02-crud-module.md` for DTO validation
- **Integration**: `fullstack-integration/examples/02-api-integration.md` for submission
