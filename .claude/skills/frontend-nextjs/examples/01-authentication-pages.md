# Authentication Pages Example

**Next.js 15.5+ App Router Authentication Implementation**

> **When to Use**: Every web application requiring user authentication
> **Skill**: frontend-nextjs
> **Related**: backend-nestjs (JWT authentication), fullstack-integration (auth flow)

---

## Overview

This example demonstrates a complete authentication system with:
- Login page with email/password
- Registration page with validation
- Client-side and server-side form validation
- JWT token management
- Protected route redirects
- Accessible forms (WCAG 2.1 AA)
- **NO EMOJIS** (only Lucide Icons)

## File Structure

```
app/
├── (auth)/
│   ├── layout.tsx              # Auth layout (Server Component)
│   ├── login/
│   │   └── page.tsx            # Login page (Server Component wrapper)
│   └── register/
│       └── page.tsx            # Register page (Server Component wrapper)
├── components/
│   └── auth/
│       ├── login-form.tsx      # Login form (Client Component)
│       ├── register-form.tsx   # Register form (Client Component)
│       └── auth-card.tsx       # Shared auth card wrapper
├── lib/
│   ├── api/
│   │   └── auth.ts             # Auth API client
│   ├── hooks/
│   │   └── use-auth.ts         # Auth hook
│   └── schemas/
│       └── auth.ts             # Zod validation schemas
└── types/
    └── auth.ts                 # TypeScript types
```

## TypeScript Types

```typescript
// types/auth.ts

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  field?: string;
}
```

## Validation Schemas

```typescript
// lib/schemas/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

## Auth API Client

```typescript
// lib/api/auth.ts
import type { AuthResponse, LoginCredentials, RegisterData } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class AuthAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public field?: string
  ) {
    super(message);
    this.name = 'AuthAPIError';
  }
}

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new AuthAPIError(
        error.message || 'Login failed',
        response.status,
        error.field
      );
    }

    return response.json();
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new AuthAPIError(
        error.message || 'Registration failed',
        response.status,
        error.field
      );
    }

    return response.json();
  },

  async logout(): Promise<void> {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
```

## Auth Hook

```typescript
// lib/hooks/use-auth.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/auth';
import type { LoginCredentials, RegisterData, User } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(credentials);

      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      setUser(response.user);
      router.push('/dashboard');

      return response;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(data);

      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      setUser(response.user);
      router.push('/dashboard');

      return response;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
```

## Login Form Component

```typescript
// components/auth/login-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { LogIn, Loader2 } from 'lucide-react'; // Lucide Icons ONLY

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/hooks/use-auth';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setApiError(null);

    try {
      await login(data);
    } catch (error: any) {
      setApiError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isLoading}
          {...register('password')}
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {apiError && (
        <div
          className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
          role="alert"
        >
          {apiError}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign in
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
```

## Register Form Component

```typescript
// components/auth/register-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { UserPlus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/hooks/use-auth';
import { registerSchema, type RegisterInput } from '@/lib/schemas/auth';

export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setApiError(null);

    try {
      await registerUser(data);
    } catch (error: any) {
      setApiError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          disabled={isLoading}
          {...register('name')}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          disabled={isLoading}
          {...register('password')}
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Must be at least 8 characters with uppercase, lowercase, and number
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          disabled={isLoading}
          {...register('confirmPassword')}
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
        />
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {apiError && (
        <div
          className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
          role="alert"
        >
          {apiError}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Create account
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
```

## Auth Card Wrapper

```typescript
// components/auth/auth-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

## Auth Layout

```typescript
// app/(auth)/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in or create an account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      {children}
    </div>
  );
}
```

## Login Page

```typescript
// app/(auth)/login/page.tsx
import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthCard>
  );
}
```

## Register Page

```typescript
// app/(auth)/register/page.tsx
import { AuthCard } from '@/components/auth/auth-card';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an account"
      description="Enter your information to get started"
    >
      <RegisterForm />
    </AuthCard>
  );
}
```

## Key Patterns

### 1. Server Components vs Client Components
- **Pages are Server Components** by default (faster initial load)
- **Forms are Client Components** ("use client" directive needed for interactivity)
- **Layouts are Server Components** (better SEO, no JS overhead)

### 2. Form Validation Strategy
- **Client-side**: Immediate feedback with Zod + react-hook-form
- **Server-side**: Backend validation with DTOs
- **Double validation**: Security and UX

### 3. Error Handling
- Field-level errors from Zod
- API errors displayed globally
- Accessible error messages (aria-describedby)

### 4. Accessibility
- Proper label associations
- ARIA attributes for errors
- Keyboard navigation
- Focus management
- Screen reader support

### 5. Loading States
- Disabled inputs during submission
- Loading spinner (Lucide Icons)
- Button text changes

## Best Practices

### ✅ DO
- Use Server Components by default
- Validate on both client and server
- Store tokens in localStorage (or httpOnly cookies for better security)
- Clear sensitive data on logout
- Use Lucide Icons ONLY
- Implement proper ARIA labels
- Use TypeScript strict mode
- Handle loading and error states

### ❌ DON'T
- Use emojis anywhere
- Store passwords in plain text
- Skip server-side validation
- Forget accessibility attributes
- Use inline styles (use Tailwind)
- Mix icon libraries
- Expose sensitive data in client code

## Common Pitfalls

### Issue 1: CORS Errors
**Problem**: API calls failing with CORS errors
**Solution**: Configure backend CORS with frontend origin
```typescript
// Backend (Nest.js)
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

### Issue 2: Token Not Persisting
**Problem**: User logged out on page refresh
**Solution**: Implement token refresh mechanism
```typescript
// Add token refresh logic
const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken');
  // Call refresh endpoint
};
```

### Issue 3: Client Component Hydration Error
**Problem**: "Text content does not match" error
**Solution**: Avoid rendering different content on server vs client
```typescript
// Bad
const time = new Date().toLocaleString(); // Different on server/client

// Good
const [time, setTime] = useState<string | null>(null);
useEffect(() => setTime(new Date().toLocaleString()), []);
```

## Related Examples

- **Backend**: See `backend-nestjs/examples/01-authentication-module.md` for JWT implementation
- **Integration**: See `fullstack-integration/examples/01-complete-authentication-flow.md` for end-to-end flow
- **Testing**: See `qa-testing/examples/01-e2e-test-suite.md` for authentication testing

## Performance Considerations

- Server Components reduce JavaScript bundle size
- Lazy load form validation schemas
- Debounce API calls for username availability checks
- Use React.memo for expensive components
- Optimize images with next/image

## Security Considerations

- **HTTPS only** in production
- **HttpOnly cookies** for tokens (better than localStorage)
- **CSRF protection** for state-changing operations
- **Rate limiting** on login/register endpoints
- **Password hashing** on backend (bcrypt)
- **Input sanitization** to prevent XSS
