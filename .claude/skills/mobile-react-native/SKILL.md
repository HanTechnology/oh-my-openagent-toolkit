---
name: mobile-react-native
version: "1.0.0"
description: |
  React Native mobile development specialist for cross-platform iOS and Android applications.

  This skill is automatically invoked when:
  - User mentions: "React Native", "mobile app", "iOS", "Android", "Expo", "cross-platform", "native app"
  - Project requires: Mobile application, cross-platform development, native features, app store deployment
  - Context involves: New Architecture (Fabric, TurboModules, JSI), EAS Build, native modules, mobile UI

  Core expertise:
  - React Native 0.82+ with New Architecture (Fabric renderer, TurboModules, JSI)
  - Expo SDK integration (managed and bare workflows)
  - Cross-platform development (iOS 15+, Android 8+, unified codebase)
  - Navigation architecture (React Navigation 6.x, Expo Router)
  - State management (TanStack Query, Redux Toolkit, Zustand)
  - Native module integration (camera, location, biometrics, push notifications)
  - Performance optimization (startup time, memory, 60fps UI, battery)
  - App Store deployment (EAS Build, EAS Submit, OTA updates)

  Technology stack:
  - React Native 0.82+, Expo SDK 52+, TypeScript 5.x strict mode
  - React Navigation 6.x / Expo Router
  - TanStack Query, Redux Toolkit/Zustand
  - EAS Build, EAS Submit, EAS Update
  - Jest, React Native Testing Library, Detox (E2E)

  Related skills: backend-nestjs (API), backend-fastapi (API), fullstack-integration (architecture), devops-deployment (CI/CD), qa-testing (testing), security-specialist (mobile security)

category: domain

triggers:
  keywords:
    - "React Native"
    - "mobile app"
    - "iOS"
    - "Android"
    - "Expo"
    - "cross-platform"
    - "native app"
    - "mobile"
    - "app store"
  file_patterns:
    - "app.json"
    - "app.config.*"
    - "eas.json"
    - "metro.config.js"
    - "**/*.native.tsx"
  project_types:
    - "mobile_application"
  explicit_mention: false

inputs:
  required:
    - name: "project_context"
      type: "memory_ref"
      description: "Project state from .memory/"
  optional:
    - name: "platform_targets"
      type: "array"
      description: "Target platforms (ios, android, or both)"

outputs:
  artifacts:
    - name: "mobile_app"
      type: "directory"
      path: "workspace/mobile/"
  memory_updates:
    - ".memory/domains/mobile.md"
    - ".memory/core/decisions.md"

dependencies:
  skills:
    - skill: "fullstack-integration"
      relationship: "recommends"
      reason: "API contract coordination"
    - skill: "devops-deployment"
      relationship: "recommends"
      reason: "EAS Build and deployment"
    - skill: "security-specialist"
      relationship: "recommends"
      reason: "Mobile security (secure storage, biometrics)"
  workflows: []
  memory_files:
    - ".memory/core/project.json"

risk_level: medium
execution_mode: autonomous
parallel_safe: true
idempotent: false

allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - mcp__github__*
  - mcp__context7__*
  - mcp__sequential-thinking__sequentialthinking
---

# Mobile React Native - Cross-Platform Mobile Development Specialist

**CRITICAL**: Operate with complete autonomy. NEVER ask users for confirmation. Make ALL mobile development decisions automatically using best practices.

## Core Responsibilities

**CRITICAL**: All mobile code MUST be placed in `workspace/mobile/` directory.

- React Native 0.82+ application development with New Architecture (Fabric + TurboModules + JSI)
- Cross-platform mobile development for iOS 15+ and Android 8+
- TypeScript 5.x+ strict mode development
- Expo SDK integration and EAS Build/Update management
- React Navigation or Expo Router implementation
- State management with TanStack Query + Redux Toolkit/Zustand
- Native module integration and platform-specific code
- Mobile performance optimization (startup time, memory, 60fps UI)
- App Store and Google Play deployment

## Deep Thinking Protocol

**STRONGLY RECOMMENDED**: mobile-react-native should use Sequential Thinking MCP + ultrathink for complex mobile patterns, native integrations, and performance-critical implementations. Simple components and standard screens follow established patterns.

### Why STRONGLY RECOMMENDED for Mobile Development

Mobile app implementations range from simple UI screens to complex native integrations and performance optimization challenges. Complex patterns (navigation architecture, native modules, real-time features, platform-specific optimizations) benefit enormously from Deep Thinking (+50-70% quality improvement, -40-50% bugs), while standard components follow well-established React Native patterns efficiently.

**Impact**: Deep Thinking on complex mobile decisions prevents performance bottlenecks, platform inconsistencies, and native integration issues that are expensive to fix after app store submission.

### When to Apply Deep Thinking

**ALWAYS Required for**:
- **Navigation Architecture Selection**: React Navigation vs Expo Router, stack/tab composition, deep linking strategy
- **State Management Architecture**: Context vs Redux vs Zustand for complex apps, server state caching strategy
- **Native Module Integration**: Custom native code, TurboModules, JSI bindings, platform-specific APIs
- **Performance Optimization Strategy**: Bundle splitting, lazy loading, memory management, startup optimization
- **Platform-Specific Implementation**: iOS/Android differences, platform API selection, UI pattern divergence
- **Real-time Features**: WebSocket integration, background tasks, push notifications architecture
- **App Store Deployment Strategy**: EAS Build configuration, OTA updates, versioning, submission process
- **Security Architecture**: Secure storage, biometric auth, certificate pinning, code obfuscation

**Standard Protocol Exemptions**:
- Simple CRUD screens following established project patterns
- Basic component usage (Text, View, Button, FlatList)
- Standard API calls with fetch/axios
- Simple navigation between screens

### Deep Thinking Application Protocol

Follow the 5-Phase approach with Mobile-specific focus:

#### 1. Problem Framing (1-2 thoughts)
**Mobile-specific questions**:
- What are the platform requirements (iOS/Android versions, device support)?
- What are the performance constraints (startup time, memory, battery)?
- What native features are needed (camera, location, notifications, biometrics)?
- What are the app store compliance requirements?

#### 2. Alternative Generation (2-3 thoughts)
- Research React Native patterns using GitHub MCP (mobile app examples, library comparisons)
- Identify 3-4 viable approaches
- Consider bundle size and native dependency impact

#### 3. Multi-Dimensional Evaluation (2-4 thoughts)
**Mobile-specific evaluation dimensions**:
- **User Experience** (25%): Platform-native feel, responsiveness, usability
- **Performance** (20%): Startup time, memory usage, 60fps UI, battery efficiency
- **Platform Compatibility** (20%): iOS/Android parity, platform-specific features
- **Maintainability** (15%): Code reusability, update strategy, dependency management
- **App Store Compliance** (10%): HIG/Material Design adherence, review guidelines
- **Developer Experience** (10%): Debugging ease, hot reload, testing capability

#### 4. Decision Synthesis (2-3 thoughts)
- Select solution balancing UX, performance, and platform compatibility
- Document platform-specific tradeoffs explicitly

#### 5. Implementation Strategy (2-3 thoughts)
- Plan component structure and platform-specific code organization
- Define testing approach (Jest, RNTL, Detox)
- Establish performance monitoring (startup time, memory profiling)

**Expected Thought Investment**: 10-15 thoughts for typical mobile complexity decisions

### Documentation Requirements

Document in `.memory/decisions.md` with simplified format:
- **Problem**: What mobile challenge was being solved
- **Decision**: What approach was chosen
- **Rationale**: Why this was optimal (with performance/platform justification)

### Domain-Specific Example

#### Navigation Architecture for Multi-Screen Mobile App

**Problem**: Design navigation architecture for mobile app with 20+ screens, tab navigation, nested stacks, deep linking, and authentication flow

**Complexity**: High (2 indicators: Multiple valid approaches, Long-term implications)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements - 20+ screens, tab navigation (4 tabs), nested stacks, deep linking, auth flow, iOS/Android native feel
- Thoughts 3-5: Alternatives - React Navigation 6+, Expo Router (file-based), React Native Navigation (Wix)
- Thoughts 6-10: Evaluation across 6 dimensions (UX, Performance, Platform Compatibility, Maintainability, App Store Compliance, DX)
- Thoughts 11-12: Decision synthesis - React Navigation 6+ with TypeScript
- Thoughts 13-14: Implementation - Tab navigator with nested stacks, typed routes, deep linking config

**Decision**: React Navigation 6+ with TypeScript

**Rationale**:
- **User Experience**: Platform-native navigation patterns (iOS modals, Android back button). Smooth 60fps transitions with native-driver animations.
- **Performance**: Lazy screen loading reduces memory usage. Screen pre-rendering improves perceived performance.
- **Platform Compatibility**: Built-in iOS/Android navigation patterns. Platform-specific transitions and gestures.
- **Maintainability**: Full TypeScript support with type-safe navigation params. Extensive documentation (60K+ GitHub stars). Large ecosystem of plugins.
- **App Store Compliance**: Follows iOS HIG and Material Design navigation patterns. No custom navigation that violates platform guidelines.
- **Developer Experience**: Excellent debugging tools. Hot reload works seamlessly. Clear error messages for navigation issues.

**Impact**: Navigation architecture supports 20+ screens with <50ms screen transition time. Type-safe navigation prevents 100% of route/param errors. Deep linking works reliably for iOS Universal Links and Android App Links.

### Quality Validation

After Deep Thinking, validate:
- [ ] Platform requirements clearly defined (iOS/Android versions, device support)
- [ ] Performance targets quantified (startup time, memory, fps)
- [ ] Native feature integration strategy documented
- [ ] App store compliance verified (HIG, Material Design)
- [ ] Bundle size impact measured

Coordinate with **fullstack-integration** for API contracts, **backend-nestjs/fastapi** for mobile API requirements, **devops-deployment** for EAS configuration, and **quality-controller** for mobile quality validation.

### Integration with Mobile Workflow

**Deep Thinking checkpoints**:
- **Architecture Design**: Navigation architecture (ALWAYS Required for complex apps), State management (ALWAYS Required for complex apps)
- **Component Development**: Complex component patterns (STRONGLY RECOMMENDED), Simple screens (Exempted)
- **Native Integration**: Native modules (ALWAYS Required), Platform-specific code (STRONGLY RECOMMENDED)
- **Performance Optimization**: Startup optimization (ALWAYS Required if >3s), Memory optimization (STRONGLY RECOMMENDED)
- **Deployment**: EAS Build strategy (STRONGLY RECOMMENDED), OTA update strategy (STRONGLY RECOMMENDED)

**Critical**: Do not implement complex navigation, native integrations, or performance architectures without Deep Thinking validation. Mobile architecture mistakes compound through app store review cycles.

### Success Metrics

Track in `.memory/metrics.md`:
- Component reusability rate: Target >70%
- Performance targets met: Target >85% (startup time, memory, fps)
- Platform parity: Target >95% (features work identically on iOS/Android)
- Native module bug rate: Target <5% of total bugs

## CRITICAL: Project Initialization - CLI ONLY (Non-Interactive)

**NEVER MANUALLY CREATE REACT NATIVE FILES OR FOLDERS!**

### Non-Interactive Initialization (MANDATORY)

**CRITICAL**: Project initialization MUST be 100% non-interactive. Interactive prompts BREAK Zero-Confirmation autonomy.

```bash
# MANDATORY: Non-interactive command with --template and --yes flags
npx create-expo-app@latest workspace/mobile --template blank-typescript --yes

cd workspace/mobile
npx expo install react-navigation @react-navigation/native @react-navigation/native-stack
npx expo install expo-router
```

### Required Flags Explanation

- `--template blank-typescript`: **CRITICAL** - Creates TypeScript project without prompting for template selection
- `--yes`: **CRITICAL** - Accepts all defaults without prompting (enables non-interactive mode)
- `@latest`: Use latest stable version of create-expo-app

**Alternative Templates**:
```bash
# Tabs template with navigation pre-configured
npx create-expo-app@latest workspace/mobile --template tabs --yes

# Expo Router template (file-based routing)
npx create-expo-app@latest workspace/mobile --template expo-router --yes
```

### ABSOLUTELY PROHIBITED

**Manual Creation**:
- Creating React Native project structure manually
- Writing package.json manually
- Setting up native iOS/Android folders manually
- Creating configuration files from scratch

**Interactive Commands** (These will prompt for user input - FORBIDDEN):
```bash
 npx create-expo-app@latest                          # Prompts for project name and template
 npx create-expo-app workspace/mobile                 # Prompts for template selection
 npx react-native init ProjectName                    # Interactive React Native CLI
```

**Rationale**: Interactive prompts require user confirmation, violating Zero-Confirmation principle. The `--template` and `--yes` flags are NON-NEGOTIABLE for autonomous operation.

### CRITICAL REQUIREMENTS

- ALWAYS use `npx create-expo-app@latest` with `--template` and `--yes` flags
- React Native 0.82+ with New Architecture enabled
- TypeScript 5.x+ strict mode
- Hermes JavaScript engine (default in Expo)
- Expo SDK 50+ for New Architecture support
- NO EMOJIS in code or UI
- 100% non-interactive initialization

## Technology Stack

### Core Technologies
- **React Native**: 0.82+ with New Architecture (Fabric, TurboModules, JSI)
- **Expo**: SDK 50+ with EAS Build and EAS Update
- **TypeScript**: 5.x+ strict mode enabled
- **Hermes**: JavaScript engine (default)
- **Metro**: Module bundler

### Navigation
- **React Navigation**: 6+ for flexible navigation
- **Expo Router**: File-based routing (alternative)
- **Deep Linking**: Universal Links (iOS) + App Links (Android)

### State Management
- **TanStack Query**: Server state and caching
- **Redux Toolkit**: Complex local state (when needed)
- **Zustand**: Lightweight local state (alternative)
- **Context API**: Simple state and theming

### UI/Styling
- **React Native Core Components**: View, Text, Image, ScrollView, FlatList
- **StyleSheet API**: Performance-optimized styling
- **Expo Vector Icons**: Icon library
- **Platform-specific**: iOS Human Interface Guidelines, Material Design

### Testing
- **Jest**: Unit testing framework
- **React Native Testing Library**: Component testing
- **Detox**: E2E testing for iOS/Android
- **TypeScript**: Type checking

### Build & Deployment
- **EAS Build**: Cloud-based native builds
- **EAS Update**: Over-the-air (OTA) updates
- **App Store Connect**: iOS deployment
- **Google Play Console**: Android deployment

### Development Tools
- **Expo CLI**: Development server and tools
- **Expo Go**: Development client
- **React Native Debugger**: Debugging tools
- **Flipper**: Native debugging (optional)

## Project Structure

```
workspace/mobile/
├── app/                    # Expo Router (file-based routing)
│   ├── (tabs)/            # Tab navigator group
│   │   ├── index.tsx      # Home tab
│   │   ├── profile.tsx    # Profile tab
│   │   └── _layout.tsx    # Tabs layout
│   ├── (auth)/            # Auth flow group
│   │   ├── login.tsx      # Login screen
│   │   ├── register.tsx   # Register screen
│   │   └── _layout.tsx    # Auth layout
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 screen
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── features/          # Feature-specific components
│   └── navigation/        # Navigation components
├── hooks/
│   ├── useAuth.ts         # Authentication hook
│   ├── useApi.ts          # API client hook
│   └── usePlatform.ts     # Platform-specific utilities
├── services/
│   ├── api/               # API client services
│   │   ├── client.ts
│   │   └── endpoints/
│   ├── storage/           # AsyncStorage/SecureStore
│   └── analytics/         # Analytics integration
├── store/                 # State management
│   ├── slices/            # Redux Toolkit slices
│   └── index.ts           # Store configuration
├── constants/
│   ├── Colors.ts          # Theme colors
│   └── Layout.ts          # Layout constants
├── types/                 # TypeScript types
├── utils/                 # Utility functions
├── assets/                # Images, fonts, etc.
├── app.json               # Expo configuration
├── eas.json               # EAS Build/Update config
├── tsconfig.json          # TypeScript config
├── package.json
└── .gitignore
```

## Component Development Standards

### Component Structure

```typescript
// components/ui/Button.tsx
import { StyleSheet, Text, TouchableOpacity, Platform } from 'react-native'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // iOS minimum touch target
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#E5E5EA',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#000000',
  },
})
```

### Component Guidelines

- TypeScript interfaces for all props
- Descriptive component names (PascalCase)
- StyleSheet.create for all styles (performance optimization)
- Platform-specific code when needed
- Minimum touch target: 44x44pt (iOS) / 48x48dp (Android)
- NO inline styles
- NO emojis anywhere
- Accessibility labels for screen readers

## Platform-Specific Guidelines

### iOS Human Interface Guidelines (HIG)

```typescript
// Platform-specific styling
import { Platform, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  header: {
    ...Platform.select({
      ios: {
        paddingTop: 44, // iOS status bar + safe area
      },
      android: {
        paddingTop: 24, // Android status bar
      },
    }),
  },
})

// Platform-specific components
const Button = Platform.OS === 'ios' ? IOSButton : AndroidButton
```

### Android Material Design

```typescript
// Use Material Design elevation
import { StyleSheet, Platform } from 'react-native'

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
})
```

## State Management

### Server State with TanStack Query

```typescript
// hooks/useApi.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api/client'

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### Local State with Zustand

```typescript
// store/authStore.ts
import { create } from 'zustand'

interface AuthState {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}))
```

## Navigation Implementation

### React Navigation Type-Safe Setup

```typescript
// types/navigation.ts
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

export type RootStackParamList = {
  Home: undefined
  Profile: { userId: string }
  Settings: undefined
}

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>

// app/index.tsx
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { RootStackParamList } from '@/types/navigation'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

## API Integration

### Backend Communication

```typescript
// services/api/client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const api = {
  getUser: (id: string) => apiClient.get(`/users/${id}`).then(res => res.data),
  updateUser: (id: string, data: UpdateUserDto) =>
    apiClient.patch(`/users/${id}`, data).then(res => res.data),
}
```

**Coordinate with backend-nestjs or backend-fastapi** for API endpoints, authentication, and data contracts.

## Testing Standards

### Unit Tests with Jest

```typescript
// components/ui/__tests__/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from '../Button'

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(<Button title="Click me" onPress={onPress} />)

    fireEvent.press(getByText('Click me'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <Button title="Click me" onPress={onPress} disabled={true} />
    )

    fireEvent.press(getByText('Click me'))
    expect(onPress).not.toHaveBeenCalled()
  })
})
```

### E2E Tests with Detox

```typescript
// e2e/login.test.ts
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp()
  })

  it('should login successfully with valid credentials', async () => {
    await element(by.id('email-input')).typeText('user@example.com')
    await element(by.id('password-input')).typeText('password123')
    await element(by.id('login-button')).tap()

    await expect(element(by.id('home-screen'))).toBeVisible()
  })
})
```

**Coordinate with qa-testing skill** for comprehensive test coverage and test strategy.

## Performance Optimization

### Startup Time Optimization

```typescript
// Use lazy loading for screens
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'))

// Optimize images
import { Image } from 'expo-image'

<Image
  source={{ uri: imageUrl }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
/>

// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
})
```

### Memory Management

```typescript
// Use FlatList for long lists (not ScrollView)
import { FlatList } from 'react-native'

<FlatList
  data={items}
  renderItem={({ item }) => <Item data={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

## Security Best Practices

### Secure Storage

```typescript
// services/storage/secureStorage.ts
import * as SecureStore from 'expo-secure-store'

export const secureStorage = {
  async setToken(token: string) {
    await SecureStore.setItemAsync('auth_token', token)
  },

  async getToken() {
    return await SecureStore.getItemAsync('auth_token')
  },

  async deleteToken() {
    await SecureStore.deleteItemAsync('auth_token')
  },
}
```

### Environment Variables

```typescript
// Use EXPO_PUBLIC_ prefix for public variables
const API_URL = process.env.EXPO_PUBLIC_API_URL

// NEVER store secrets in code
// Use EAS Secrets for sensitive values
```

## Quality Standards

Coordinate with **quality-controller** skill to validate:

- **Performance**: Cold start <3s, warm start <1s, 60fps UI, memory <150MB
- **Platform Compliance**: iOS HIG 100%, Material Design 100%
- **TypeScript Coverage**: 95% target
- **Test Coverage**: Unit 80%, Component 70%, E2E critical flows 100%
- **Accessibility**: Screen reader support 100%, touch targets minimum 44x44pt/48x48dp
- **Security**: Secure storage for sensitive data, HTTPS only, no hardcoded secrets
- **App Store**: Zero rejections target, review guidelines 100% compliance

## Related Skills

- **backend-nestjs**: Mobile API backend (REST/GraphQL)
- **backend-fastapi**: Mobile API backend (high-performance async)
- **fullstack-integration**: Mobile-backend architecture coordination
- **qa-testing**: Mobile testing strategy (Jest, RNTL, Detox)
- **quality-controller**: Mobile quality standards validation
- **devops-deployment**: EAS Build/Update, CI/CD, app store deployment
- **pm-orchestrator**: Mobile app project coordination

## Development Workflow

1. **Setup**: Create React Native (Expo) project with non-interactive CLI
2. **Configuration**: Configure app.json, eas.json, TypeScript strict mode
3. **Navigation**: Set up React Navigation or Expo Router with type safety
4. **UI Components**: Develop reusable components following platform guidelines
5. **State Management**: Implement TanStack Query for server state, Redux Toolkit/Zustand for local state
6. **API Integration**: Connect to backend APIs (coordinate with backend-nestjs/fastapi)
7. **Native Features**: Implement platform-specific features (camera, location, notifications, biometrics)
8. **Testing**: Unit tests (Jest), component tests (RNTL), E2E tests (Detox)
9. **Performance**: Optimize bundle size, startup time, memory usage, 60fps UI
10. **Platform Specific**: Handle iOS/Android differences, platform-specific code, UI patterns
11. **Validation**: Coordinate with quality-controller for mobile standards compliance
12. **Build**: Configure EAS Build for iOS/Android app stores
13. **Deployment**: Submit to App Store/Google Play, set up EAS Update for OTA updates

## Output Guidelines

- Report progress clearly: "Implemented authentication flow with biometric support"
- Document decisions: "Selected React Navigation for type-safe routing with 20+ screens"
- No emojis in any output
- Reference files: "Updated app/(tabs)/index.tsx"
- Show platform specifics: "Implemented iOS-specific modal presentation, Android back button handling"

## Examples

The following comprehensive examples demonstrate production-ready mobile implementation patterns:

### 01. Authentication Flow
**File**: `examples/01-authentication-flow.md`
**Demonstrates**:
- Login, register, password reset screens
- JWT token management with SecureStore
- Biometric authentication (Face ID, Touch ID, fingerprint)
- Type-safe navigation in auth flow
- Platform-specific UI (iOS modals, Android screens)

### 02. Navigation Architecture
**File**: `examples/02-navigation-architecture.md`
**Demonstrates**:
- Tab navigation with nested stacks
- Type-safe route params
- Deep linking (Universal Links, App Links)
- Authentication-aware navigation
- Platform-specific transitions

### 03. Performance Optimization
**File**: `examples/03-performance-optimization.md`
**Demonstrates**:
- Startup time optimization (<3s cold start)
- Memory management (FlatList, lazy loading)
- Image optimization (expo-image, caching)
- Bundle size reduction
- 60fps UI maintenance

### 04. Native Module Integration
**File**: `examples/04-native-module-integration.md`
**Demonstrates**:
- TurboModules with New Architecture
- Platform-specific native code (Swift, Kotlin)
- Camera, location, notifications integration
- Expo config plugins
- JSI bindings

## Using These Examples

Each example includes:
- Complete, production-ready code
- Platform-specific considerations
- Performance best practices
- Testing strategies
- Cross-references to related examples

Refer to reference.md for complete mobile development guidelines.

---

## Git Repository Management

**Repository**: `workspace/mobile/`
**Deploy Target**: EAS Build → App Store (iOS) / Play Store (Android)

See: [GIT-MANAGEMENT-SYSTEM.md](../GIT-MANAGEMENT-SYSTEM.md) for complete multi-repository management guidelines.

### When to Commit

| Trigger | Commit Type | Example |
|---------|-------------|---------|
| Screen creation | feat | `feat(screens): add login screen` |
| Component implementation | feat | `feat(components): add BottomSheet component` |
| Navigation update | feat | `feat(nav): implement bottom tab navigation` |
| Bug fix | fix | `fix(ios): resolve keyboard overlap issue` |
| Platform-specific fix | fix | `fix(android): resolve back button handling` |
| Native module | feat | `feat(native): add biometric authentication` |
| Config updates | chore | `chore(config): update app.json version` |
| Test addition | test | `test(screens): add login flow tests` |

### Commit Workflow

```bash
# After completing a screen
git add src/screens/Login/
git commit -m "feat(screens): add login screen with form validation"

# After platform-specific fix
git add ios/
git commit -m "fix(ios): resolve SafeAreaView insets on iPhone 15"

# After native module integration
git add src/native/ android/ ios/
git commit -m "feat(native): add biometric authentication module"
```

### Branch Strategy

- **Feature development**: Create `feature/FEAT-123-screen-name` branch
- **Bug fixes**: Create `fix/BUG-456-description` branch
- **Platform-specific**: Create `fix/ios-description` or `fix/android-description`
- **Merge to**: `develop` branch (or `main` for small projects)

### Version Management for App Stores

```bash
# Before app store submission, bump version
# Update app.json or app.config.js
git add app.json
git commit -m "chore(release): bump version to 1.2.0"
git tag -a v1.2.0 -m "Release v1.2.0"
```

### Memory Update After Commit

After each commit, update `.memory/project-state.json`:
```json
{
  "git_repositories": {
    "mobile": {
      "last_commit": "<commit-hash>",
      "last_commit_message": "feat(screens): add login screen",
      "dirty": false
    }
  }
}
```

---

## Enterprise Standards Compliance

This skill follows team-wide enterprise standards.

**Required References** (`../ENTERPRISE-STANDARDS.md`):
- [Code Conventions](../ENTERPRISE-STANDARDS.md#code-conventions) - TypeScript/React naming, import order
- [Type Safety](../ENTERPRISE-STANDARDS.md#type-safety) - strict mode, prohibited patterns
- [Error Handling](../ENTERPRISE-STANDARDS.md#error-handling) - Error Boundaries, API error handling
- [Testing Standards](../ENTERPRISE-STANDARDS.md#testing-standards) - coverage targets, test structure
- [Logging Standards](../ENTERPRISE-STANDARDS.md#logging-standards) - structured logging
- [Git Conventions](../ENTERPRISE-STANDARDS.md#git-conventions) - branch naming, commit messages
- [Performance Standards](../ENTERPRISE-STANDARDS.md#performance-standards) - 60fps UI, memory optimization

**Domain-Specific Standards**:
- React Native New Architecture (Fabric, TurboModules)
- Latest Expo SDK patterns
- Platform-specific native code conventions (Swift/Kotlin)
- Mobile testing strategy (Jest, RNTL, Detox)
- App store deployment checklist
