# Complete Authentication Flow Example

**End-to-End JWT Authentication Integration**

> **When to Use**: Every application requiring secure user authentication
> **Skill**: fullstack-integration
> **Related**: frontend-nextjs (auth pages), backend-nestjs (auth module)

---

## Overview

This example demonstrates the complete authentication flow from frontend to backend:
- User registration and login
- JWT token generation and storage
- Protected route access
- Token refresh mechanism
- Logout flow
- Error handling across the stack

**Architecture**: Next.js 15.5+ App Router + Nest.js Backend + PostgreSQL

## System Architecture

```
Frontend (Next.js)          Backend (Nest.js)           Database
┌─────────────────┐        ┌──────────────────┐        ┌──────────┐
│ Login Form      │───────▶│ POST /auth/login │───────▶│ Users    │
│ (Client)        │◀───────│ Response: tokens │◀───────│ Table    │
└─────────────────┘        └──────────────────┘        └──────────┘
         │                          │
         │ Store tokens             │ Validate JWT
         ▼                          ▼
┌─────────────────┐        ┌──────────────────┐
│ localStorage    │        │ JWT Strategy     │
│ - accessToken   │        │ - Verify token   │
│ - refreshToken  │        │ - Extract user   │
└─────────────────┘        └──────────────────┘
         │                          │
         │ API requests             │ Protected routes
         ▼                          ▼
┌─────────────────┐        ┌──────────────────┐
│ API Client      │───────▶│ GET /users/me    │
│ (with auth)     │◀───────│ Response: user   │
└─────────────────┘        └──────────────────┘
```

## Complete Flow Implementation

### 1. Backend Authentication Module

```typescript
// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Save hashed refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Save hashed refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  private async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
```

### 2. Frontend API Client

```typescript
// frontend/lib/api/auth.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
});

// Request interceptor: Add access token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Request new tokens
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
};

export { apiClient };
```

### 3. Frontend Auth Context

```typescript
// frontend/contexts/auth-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, LoginCredentials, RegisterData } from '@/lib/api/auth';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const userData = await authAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(credentials);

      // Save tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Set user
      setUser(response.user);

      // Redirect
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(data);

      // Save tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Set user
      setUser(response.user);

      // Redirect
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 4. Protected Route Pattern

```typescript
// frontend/components/auth/protected-route.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

### 5. Protected Page Implementation

```typescript
// frontend/app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, User } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={logout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
```

### 6. Root Layout Integration

```typescript
// frontend/app/layout.tsx
import { AuthProvider } from '@/contexts/auth-context';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## Authentication Flow Sequence

### Registration Flow

```
1. User fills registration form
   └─▶ frontend/app/(auth)/register/page.tsx

2. Form submits to useAuth().register()
   └─▶ frontend/contexts/auth-context.tsx

3. API call to backend
   └─▶ POST /auth/register
       └─▶ backend/src/auth/auth.controller.ts

4. User created in database
   └─▶ backend/src/auth/auth.service.ts
       └─▶ Prisma creates user
       └─▶ Password hashed with bcrypt
       └─▶ Tokens generated (access + refresh)
       └─▶ Refresh token hashed and saved

5. Response returns to frontend
   └─▶ { user, accessToken, refreshToken }

6. Frontend saves tokens
   └─▶ localStorage.setItem('accessToken', ...)
   └─▶ localStorage.setItem('refreshToken', ...)

7. User state updated
   └─▶ setUser(response.user)

8. Redirect to dashboard
   └─▶ router.push('/dashboard')
```

### Login Flow

```
1. User fills login form
   └─▶ frontend/app/(auth)/login/page.tsx

2. Form submits to useAuth().login()
   └─▶ frontend/contexts/auth-context.tsx

3. API call to backend
   └─▶ POST /auth/login
       └─▶ backend/src/auth/auth.controller.ts

4. Credentials validated
   └─▶ backend/src/auth/auth.service.ts
       └─▶ User found by email
       └─▶ Password compared with bcrypt
       └─▶ Tokens generated if valid
       └─▶ Refresh token hashed and saved

5. Response returns to frontend
   └─▶ { user, accessToken, refreshToken }

6. Frontend saves tokens
   └─▶ localStorage saved

7. User state updated and redirected
   └─▶ Dashboard page loaded
```

### Protected Request Flow

```
1. User accesses protected page
   └─▶ frontend/app/(dashboard)/dashboard/page.tsx

2. ProtectedRoute checks auth
   └─▶ useAuth().isAuthenticated
       └─▶ If false: redirect to /login
       └─▶ If true: render page

3. API request made
   └─▶ apiClient.get('/users/me')

4. Request interceptor adds token
   └─▶ Authorization: Bearer {accessToken}

5. Backend validates token
   └─▶ JwtAuthGuard
       └─▶ JwtStrategy.validate()
       └─▶ Token decoded and verified

6. If valid: response returned
   └─▶ User data sent to frontend

7. If invalid (401):
   └─▶ Response interceptor triggered
       └─▶ POST /auth/refresh
       └─▶ New tokens received
       └─▶ Saved to localStorage
       └─▶ Original request retried

8. If refresh fails:
   └─▶ Logout user
   └─▶ Redirect to /login
```

### Logout Flow

```
1. User clicks logout
   └─▶ useAuth().logout()

2. API call to backend
   └─▶ POST /auth/logout

3. Backend clears refresh token
   └─▶ Set user.refreshToken = null

4. Frontend clears state
   └─▶ localStorage cleared
   └─▶ User state set to null
   └─▶ Redirect to /login
```

## Error Handling Patterns

### Backend Error Handling

```typescript
// Custom exception filter
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      message: typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).message
        : exceptionResponse,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Frontend Error Handling

```typescript
// Error handling in login
const login = async (credentials: LoginCredentials) => {
  setIsLoading(true);
  try {
    const response = await authAPI.login(credentials);
    // ... success handling
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
    throw error;
  } finally {
    setIsLoading(false);
  }
};
```

## Security Best Practices

### 1. Token Security

```typescript
// Short-lived access tokens
expiresIn: '15m' // Access token

// Long-lived refresh tokens
expiresIn: '7d' // Refresh token

// Hash refresh tokens in database
const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
```

### 2. Password Security

```typescript
// Strong password validation
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
  message: 'Password must contain uppercase, lowercase, and number',
})
@MinLength(8)
password: string;

// Secure hashing
const hashedPassword = await bcrypt.hash(password, 10);
```

### 3. CORS Configuration

```typescript
// backend/src/main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

### 4. Environment Variables

```bash
# Backend .env
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
DATABASE_URL=postgresql://...
FRONTEND_URL=http://localhost:3000

# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Key Integration Patterns

1. **Token Storage**: localStorage for client-side persistence
2. **Automatic Refresh**: Axios interceptors for seamless token renewal
3. **Protected Routes**: ProtectedRoute component with auth check
4. **Context API**: Centralized auth state management
5. **Error Recovery**: Graceful fallback on auth failures
6. **Type Safety**: TypeScript interfaces across frontend/backend

## Common Pitfalls

❌ **DON'T**:
- Store tokens in cookies without httpOnly flag
- Use long-lived access tokens (>15 minutes)
- Store passwords in plain text
- Skip token validation on backend
- Expose JWT secrets in code

✅ **DO**:
- Use short-lived access tokens with refresh mechanism
- Hash passwords with bcrypt (10+ salt rounds)
- Validate all tokens on backend
- Clear tokens on logout
- Use environment variables for secrets

## Related Examples

- **Frontend**: `frontend-nextjs/examples/01-authentication-pages.md`
- **Backend**: `backend-nestjs/examples/01-authentication-module.md`
- **Testing**: `qa-testing/examples/01-e2e-test-suite.md` (auth flow testing)
