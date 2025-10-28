# API Integration Pattern Example

**Production-Ready API Integration with Error Handling & Retry Logic**

> **When to Use**: All frontend-backend communication
> **Skill**: fullstack-integration
> **Related**: frontend-nextjs (data fetching), backend-nestjs (API design)

---

## Overview

This example demonstrates production-grade API integration patterns:
- Centralized API client configuration
- Request/response interceptors
- Automatic retry logic with exponential backoff
- Error handling and recovery
- Loading states and optimistic updates
- Type-safe API contracts
- Request cancellation
- Cache management

**Architecture**: Type-safe API layer with resilient error handling

## System Architecture

```
Frontend Layer          API Client Layer        Backend Layer
┌──────────────┐       ┌─────────────────┐     ┌──────────────┐
│ React Query  │──────▶│ API Client      │────▶│ Nest.js API  │
│ Hooks        │◀──────│ - Interceptors  │◀────│ Controllers  │
└──────────────┘       │ - Retry Logic   │     └──────────────┘
                       │ - Error Handler │
                       │ - Cache         │
                       └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │ Error Recovery  │
                       │ - Retry 3x      │
                       │ - Exponential   │
                       │ - Fallback      │
                       └─────────────────┘
```

## Complete Implementation

### 1. Type-Safe API Contracts

```typescript
// shared/types/api.ts
// Shared types between frontend and backend

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
```

### 2. Advanced API Client

```typescript
// frontend/lib/api/client.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Base delay in ms
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request ID for tracking
let requestId = 0;

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add request ID
    config.headers['X-Request-ID'] = `req-${++requestId}`;

    // Add auth token
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp
    (config as any).metadata = { startTime: Date.now() };

    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response time
    const duration = Date.now() - (response.config as any).metadata?.startTime;
    console.log(
      `[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`,
    );

    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retry?: number };

    // Don't retry if no config
    if (!config) {
      return Promise.reject(error);
    }

    // Initialize retry count
    config._retry = config._retry || 0;

    // Check if should retry
    const shouldRetry =
      config._retry < MAX_RETRIES &&
      RETRY_STATUS_CODES.includes(error.response?.status || 0);

    if (shouldRetry) {
      config._retry++;

      // Calculate exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, config._retry - 1);

      console.warn(
        `[API] Retrying request (${config._retry}/${MAX_RETRIES}) after ${delay}ms...`,
      );

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Retry request
      return apiClient(config);
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - try token refresh
      return handleTokenRefresh(error);
    }

    // Log error
    console.error('[API] Request failed:', {
      url: config.url,
      method: config.method,
      status: error.response?.status,
      message: error.message,
    });

    return Promise.reject(error);
  },
);

// Token refresh handler
async function handleTokenRefresh(error: AxiosError) {
  const config = error.config as AxiosRequestConfig & { _retry?: boolean };

  // Only try refresh once
  if (config._retry) {
    // Already tried refresh, logout user
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    return Promise.reject(error);
  }

  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    // Request new token
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Save new tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    // Retry original request
    config._retry = true;
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;

    return apiClient(config);
  } catch (refreshError) {
    // Refresh failed
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    return Promise.reject(refreshError);
  }
}

// Request cancellation helper
export function createCancelToken() {
  return axios.CancelToken.source();
}

export function isCancelError(error: any): boolean {
  return axios.isCancel(error);
}
```

### 3. API Service Layer

```typescript
// frontend/lib/api/products.ts
import { apiClient, createCancelToken } from './client';
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  PaginatedResponse,
  PaginationParams,
} from '@/types/api';

export const productsAPI = {
  // Get all products with pagination
  getAll: async (
    params?: PaginationParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get('/products', {
      params,
      signal,
    });
    return response.data;
  },

  // Get single product
  getById: async (id: string, signal?: AbortSignal): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`, { signal });
    return response.data;
  },

  // Create product
  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  // Update product
  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await apiClient.patch(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // Search products
  search: async (query: string, signal?: AbortSignal): Promise<Product[]> => {
    const response = await apiClient.get('/products/search', {
      params: { q: query },
      signal,
    });
    return response.data;
  },
};
```

### 4. React Query Integration

```typescript
// frontend/lib/hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api/products';
import type { CreateProductDto, UpdateProductDto, PaginationParams } from '@/types/api';
import { useToast } from '@/components/ui/use-toast';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Get all products
export function useProducts(params?: PaginationParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: ({ signal }) => productsAPI.getAll(params, signal),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

// Get single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: ({ signal }) => productsAPI.getById(id, signal),
    enabled: !!id,
  });
}

// Create product
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productsAPI.create(data),
    onMutate: async (newProduct) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(productKeys.lists());

      // Optimistically update (optional)
      // queryClient.setQueryData(productKeys.lists(), (old: any) => {
      //   return {
      //     ...old,
      //     data: [...(old?.data || []), { id: 'temp', ...newProduct }],
      //   };
      // });

      return { previousProducts };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(productKeys.lists(), context.previousProducts);
      }

      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Update product
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productsAPI.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: productKeys.detail(id) });

      // Snapshot
      const previousProduct = queryClient.getQueryData(productKeys.detail(id));

      // Optimistic update
      queryClient.setQueryData(productKeys.detail(id), (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousProduct };
    },
    onError: (error, { id }, context) => {
      // Rollback
      if (context?.previousProduct) {
        queryClient.setQueryData(productKeys.detail(id), context.previousProduct);
      }

      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => productsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    },
  });
}
```

### 5. Component Integration

```typescript
// frontend/app/(dashboard)/products/page.tsx
'use client';

import { useState } from 'react';
import { useProducts, useDeleteProduct } from '@/lib/hooks/use-products';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useProducts({ page, limit: 10 });
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Failed to load products</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>

      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'category', label: 'Category' },
          { key: 'price', label: 'Price' },
          {
            key: 'actions',
            label: '',
            render: (product) => (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(product.id)}
                disabled={deleteProduct.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ),
          },
        ]}
        data={data?.data || []}
        currentPage={page}
        totalPages={data?.meta.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### 6. Backend Error Response Format

```typescript
// backend/src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message
          : exceptionResponse,
      error:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).error
          : undefined,
    };

    response.status(status).json(errorResponse);
  }
}

// Apply globally in main.ts
app.useGlobalFilters(new HttpExceptionFilter());
```

### 7. Request Cancellation Example

```typescript
// frontend/components/product-search.tsx
'use client';

import { useState, useEffect } from 'react';
import { productsAPI } from '@/lib/api/products';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Product } from '@/types/api';

export function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const abortController = new AbortController();

    const search = async () => {
      setIsSearching(true);
      try {
        const products = await productsAPI.search(query, abortController.signal);
        setResults(products);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Search cancelled');
        } else {
          console.error('Search failed:', error);
        }
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeout = setTimeout(search, 300);

    return () => {
      clearTimeout(timeout);
      abortController.abort(); // Cancel request on cleanup
    };
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {results.length > 0 && (
        <div className="absolute mt-2 w-full rounded-md border bg-background p-2 shadow-lg">
          {results.map((product) => (
            <div key={product.id} className="p-2 hover:bg-muted">
              {product.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Error Handling Strategy

### Error Types

```typescript
// frontend/lib/errors.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: string[],
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    public errors: Record<string, string[]>,
  ) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

// Error parser
export function parseAPIError(error: any): APIError | NetworkError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new NetworkError('No response from server');
    }

    const { status, data } = error.response;
    return new APIError(
      status,
      data.message || 'An error occurred',
      Array.isArray(data.message) ? data.message : undefined,
    );
  }

  return new NetworkError(error.message);
}
```

## Performance Optimization

### 1. Request Deduplication

```typescript
// React Query automatically deduplicates requests
const { data: product1 } = useProduct('123'); // Makes request
const { data: product2 } = useProduct('123'); // Uses same request
```

### 2. Prefetching

```typescript
// Prefetch on hover
const queryClient = useQueryClient();

const handleMouseEnter = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsAPI.getById(id),
  });
};
```

### 3. Background Refetching

```typescript
useQuery({
  queryKey: productKeys.list(),
  queryFn: productsAPI.getAll,
  refetchOnWindowFocus: true,
  refetchInterval: 5 * 60 * 1000, // Every 5 minutes
});
```

## Key Integration Patterns

1. **Centralized Client**: Single axios instance with interceptors
2. **Type Safety**: Shared types between frontend/backend
3. **Retry Logic**: Automatic retry with exponential backoff
4. **Token Refresh**: Seamless token renewal on 401
5. **Request Cancellation**: AbortController for cleanup
6. **React Query**: Caching, deduplication, optimistic updates
7. **Error Handling**: Consistent error format and recovery

## Common Pitfalls

❌ **DON'T**:
- Create multiple axios instances
- Skip request cancellation in useEffect
- Ignore loading and error states
- Make API calls directly in components
- Forget to handle token refresh

✅ **DO**:
- Use centralized API client
- Cancel requests on component unmount
- Handle all loading/error/success states
- Use service layer for API calls
- Implement automatic token refresh

## Related Examples

- **Authentication**: `01-complete-authentication-flow.md`
- **Frontend**: `frontend-nextjs/examples/02-dashboard-components.md`
- **Backend**: `backend-nestjs/examples/02-crud-module.md`
