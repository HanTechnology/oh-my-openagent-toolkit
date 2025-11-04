# Authentication Flow Example

**React Native 0.82+ with Biometric Authentication**

> **When to Use**: Every mobile application requiring user authentication
> **Skill**: mobile-react-native
> **Related**: backend-nestjs (JWT authentication API), backend-fastapi (async auth API), fullstack-integration (auth architecture)

---

## Overview

This example demonstrates a complete mobile authentication system with:
- Login and register screens with validation
- JWT token management with SecureStore
- Biometric authentication (Face ID, Touch ID, Android fingerprint)
- Type-safe navigation in auth flow
- Platform-specific UI patterns (iOS modals, Android screens)
- Secure token storage and automatic token refresh
- **NO EMOJIS** (text-only UI)

## File Structure

```
app/
├── (auth)/
│   ├── _layout.tsx              # Auth flow layout
│   ├── login.tsx                # Login screen
│   ├── register.tsx             # Register screen
│   └── biometric-setup.tsx      # Biometric enrollment
├── (tabs)/
│   └── index.tsx                # Protected home screen
├── types/
│   └── auth.ts                  # Auth TypeScript types
├── services/
│   ├── auth/
│   │   ├── auth-service.ts      # Auth API client
│   │   ├── biometric-service.ts # Biometric authentication
│   │   └── token-service.ts     # Token storage and refresh
├── hooks/
│   ├── useAuth.ts               # Auth state hook
│   └── useBiometric.ts          # Biometric auth hook
└── components/
    └── auth/
        ├── AuthInput.tsx        # Styled input component
        └── AuthButton.tsx       # Styled button component
```

## TypeScript Types

```typescript
// types/auth.ts

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export enum BiometricType {
  FACE_ID = 'FACE_ID',
  TOUCH_ID = 'TOUCH_ID',
  FINGERPRINT = 'FINGERPRINT',
  NONE = 'NONE',
}
```

## Token Service (Secure Storage)

```typescript
// services/auth/token-service.ts
import * as SecureStore from 'expo-secure-store'

const ACCESS_TOKEN_KEY = 'auth_access_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

export const tokenService = {
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ])
  },

  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
  },

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ])
  },
}
```

## Biometric Service

```typescript
// services/auth/biometric-service.ts
import * as LocalAuthentication from 'expo-local-authentication'
import { BiometricType } from '@/types/auth'

export const biometricService = {
  async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    const isEnrolled = await LocalAuthentication.isEnrolledAsync()
    return hasHardware && isEnrolled
  },

  async getSupportedTypes(): Promise<BiometricType[]> {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
    const supported: BiometricType[] = []

    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      supported.push(BiometricType.FACE_ID)
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      supported.push(BiometricType.FINGERPRINT)
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      supported.push(BiometricType.TOUCH_ID)
    }

    return supported.length > 0 ? supported : [BiometricType.NONE]
  },

  async authenticate(reason: string = 'Authenticate to continue'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        requireConfirmation: false,
      })

      return result.success
    } catch (error) {
      console.error('Biometric authentication error:', error)
      return false
    }
  },
}
```

## Auth API Service

```typescript
// services/auth/auth-service.ts
import axios from 'axios'
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth'
import { tokenService } from './token-service'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add access token
apiClient.interceptors.request.use(async (config) => {
  const token = await tokenService.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and not a retry, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = await tokenService.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data
        await tokenService.saveTokens(accessToken, newRefreshToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        await tokenService.clearTokens()
        throw refreshError
      }
    }

    return Promise.reject(error)
  }
)

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    await tokenService.saveTokens(
      response.data.tokens.accessToken,
      response.data.tokens.refreshToken
    )
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    await tokenService.saveTokens(
      response.data.tokens.accessToken,
      response.data.tokens.refreshToken
    )
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      await tokenService.clearTokens()
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },
}
```

## Auth State Hook

```typescript
// hooks/useAuth.ts
import { create } from 'zustand'
import type { User, LoginCredentials, RegisterData } from '@/types/auth'
import { authService } from '@/services/auth/auth-service'
import { tokenService } from '@/services/auth/token-service'
import { router } from 'expo-router'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null })
      const response = await authService.login(credentials)
      set({ user: response.user, isAuthenticated: true, isLoading: false })
      router.replace('/(tabs)')
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      })
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null })
      const response = await authService.register(data)
      set({ user: response.user, isAuthenticated: true, isLoading: false })
      router.replace('/(tabs)')
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
      })
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true })
      await authService.logout()
      set({ user: null, isAuthenticated: false, isLoading: false })
      router.replace('/(auth)/login')
    } catch (error) {
      set({ isLoading: false })
    }
  },

  checkAuth: async () => {
    try {
      const token = await tokenService.getAccessToken()
      if (!token) {
        set({ isAuthenticated: false, user: null })
        return
      }

      const user = await authService.getCurrentUser()
      set({ user, isAuthenticated: true })
    } catch (error) {
      set({ isAuthenticated: false, user: null })
      await tokenService.clearTokens()
    }
  },

  clearError: () => set({ error: null }),
}))
```

## Biometric Authentication Hook

```typescript
// hooks/useBiometric.ts
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { biometricService } from '@/services/auth/biometric-service'
import type { BiometricType } from '@/types/auth'

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled'

export function useBiometric() {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [supportedTypes, setSupportedTypes] = useState<BiometricType[]>([])

  useEffect(() => {
    checkAvailability()
    checkEnabled()
  }, [])

  const checkAvailability = async () => {
    const available = await biometricService.isAvailable()
    setIsAvailable(available)

    if (available) {
      const types = await biometricService.getSupportedTypes()
      setSupportedTypes(types)
    }
  }

  const checkEnabled = async () => {
    const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY)
    setIsEnabled(enabled === 'true')
  }

  const enable = async () => {
    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true')
    setIsEnabled(true)
  }

  const disable = async () => {
    await AsyncStorage.removeItem(BIOMETRIC_ENABLED_KEY)
    setIsEnabled(false)
  }

  const authenticate = async (reason?: string): Promise<boolean> => {
    if (!isAvailable || !isEnabled) {
      return false
    }

    return await biometricService.authenticate(reason)
  }

  return {
    isAvailable,
    isEnabled,
    supportedTypes,
    enable,
    disable,
    authenticate,
  }
}
```

## Login Screen

```typescript
// app/(auth)/login.tsx
import { useState } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native'
import { useAuth } from '@/hooks/useAuth'
import { useBiometric } from '@/hooks/useBiometric'
import { AuthInput } from '@/components/auth/AuthInput'
import { AuthButton } from '@/components/auth/AuthButton'
import { Link } from 'expo-router'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error, clearError } = useAuth()
  const { isAvailable: biometricAvailable, isEnabled: biometricEnabled, authenticate } = useBiometric()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password')
      return
    }

    await login({ email, password })
  }

  const handleBiometricLogin = async () => {
    const success = await authenticate('Login with biometric authentication')
    if (success) {
      // In production, you would retrieve saved credentials
      // This is a simplified example
      Alert.alert('Success', 'Biometric authentication successful')
    } else {
      Alert.alert('Error', 'Biometric authentication failed')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <AuthInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="Enter your email"
        />

        <AuthInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          placeholder="Enter your password"
        />

        <AuthButton
          title="Sign In"
          onPress={handleLogin}
          loading={isLoading}
          style={styles.loginButton}
        />

        {biometricAvailable && biometricEnabled && (
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricLogin}
            disabled={isLoading}
          >
            <Text style={styles.biometricText}>
              {Platform.OS === 'ios' ? 'Sign in with Face ID' : 'Sign in with Fingerprint'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 8,
  },
  biometricButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  biometricText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
})
```

## Platform-Specific Considerations

### iOS Specific
- Uses Face ID or Touch ID via LocalAuthentication API
- Modal presentation for auth flow (configure in `_layout.tsx`)
- SF Symbols icons (via vector-icons)
- iOS HIG-compliant UI patterns

### Android Specific
- Uses Fingerprint authentication
- Material Design elevation and ripple effects
- Android back button handling
- Material Design color system

## Security Best Practices

1. **Token Storage**: Use SecureStore (Keychain on iOS, EncryptedSharedPreferences on Android)
2. **No Hardcoded Secrets**: All API URLs and secrets in environment variables
3. **HTTPS Only**: All API communication over HTTPS
4. **Token Refresh**: Automatic token refresh on 401 errors
5. **Biometric Fallback**: Allow device PIN/password as fallback
6. **Session Timeout**: Implement auto-logout after inactivity

## Testing Strategy

```typescript
// __tests__/auth-service.test.ts
import { authService } from '@/services/auth/auth-service'
import { tokenService } from '@/services/auth/token-service'

jest.mock('@/services/auth/token-service')

describe('authService', () => {
  it('should store tokens after successful login', async () => {
    const credentials = { email: 'test@example.com', password: 'password123' }

    await authService.login(credentials)

    expect(tokenService.saveTokens).toHaveBeenCalled()
  })

  it('should clear tokens on logout', async () => {
    await authService.logout()

    expect(tokenService.clearTokens).toHaveBeenCalled()
  })
})
```

## Integration with Backend

**Coordinates with**:
- **backend-nestjs**: JWT authentication endpoints (/auth/login, /auth/register, /auth/refresh)
- **backend-fastapi**: Async authentication with OAuth2 + JWT
- **fullstack-integration**: Mobile-backend auth flow architecture

## Related Examples
- 02-navigation-architecture.md (Protected routes, auth-aware navigation)
- 03-performance-optimization.md (Optimizing auth flow startup time)

---

**Best Practices Summary**:
- Use SecureStore for sensitive data (tokens, credentials)
- Implement biometric authentication for better UX
- Handle platform differences (Face ID vs Fingerprint)
- Automatic token refresh for seamless experience
- Type-safe API client with proper error handling
- WCAG-compliant accessible forms
- NO EMOJIS (text-only UI)
