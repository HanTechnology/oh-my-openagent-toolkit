# Navigation Architecture Example

**React Navigation 6+ with TypeScript and Deep Linking**

> **When to Use**: Mobile apps with 5+ screens requiring structured navigation
> **Skill**: mobile-react-native
> **Related**: fullstack-integration (navigation architecture), qa-testing (navigation testing)

---

## Overview

This example demonstrates a production-ready navigation architecture with:
- Tab navigation with nested stack navigators
- Type-safe routes and navigation params
- Deep linking (iOS Universal Links, Android App Links)
- Authentication-aware navigation guards
- Platform-specific transitions (iOS modals, Android slide)
- Navigation state persistence
- **NO EMOJIS** (text-only navigation labels)

## Architecture Decision

**Problem**: Design navigation for mobile app with 20+ screens, tab navigation, nested stacks, deep linking, and authentication flow

**Decision**: React Navigation 6+ with TypeScript

**Rationale**:
- Full TypeScript support with type-safe navigation params
- Platform-native navigation patterns (iOS modals, Android back button)
- Smooth 60fps transitions with native-driver animations
- Built-in deep linking support
- Large ecosystem (60K+ GitHub stars)
- Excellent documentation and community support

## File Structure

```
app/
├── types/
│   └── navigation.ts            # Navigation type definitions
├── navigation/
│   ├── RootNavigator.tsx        # Root navigator (auth-aware)
│   ├── AuthNavigator.tsx        # Auth stack navigator
│   ├── MainNavigator.tsx        # Main tab navigator
│   ├── HomeStack.tsx            # Home nested stack
│   ├── ProfileStack.tsx         # Profile nested stack
│   └── linking-config.ts        # Deep linking configuration
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── home/
│   │   ├── HomeScreen.tsx
│   │   └── DetailScreen.tsx
│   └── profile/
│       ├── ProfileScreen.tsx
│       └── SettingsScreen.tsx
└── hooks/
    └── useNavigationHelper.ts   # Navigation utility hooks
```

## Navigation Type Definitions

```typescript
// types/navigation.ts
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { CompositeScreenProps } from '@react-navigation/native'

// Root Navigator (Auth-aware)
export type RootStackParamList = {
  Auth: undefined
  Main: undefined
}

// Auth Navigator
export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
}

// Main Tab Navigator
export type MainTabParamList = {
  HomeTab: undefined
  SearchTab: undefined
  NotificationsTab: undefined
  ProfileTab: undefined
}

// Home Stack (nested in HomeTab)
export type HomeStackParamList = {
  Home: undefined
  Detail: {
    id: string
    title: string
  }
  Comments: {
    postId: string
  }
}

// Profile Stack (nested in ProfileTab)
export type ProfileStackParamList = {
  Profile: undefined
  Settings: undefined
  EditProfile: {
    userId: string
  }
}

// Composite Types for nested navigation
export type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Home'>,
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>

export type DetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'Detail'>
export type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>

// Navigation props helper
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

## Root Navigator (Auth-Aware)

```typescript
// navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth } from '@/hooks/useAuth'
import { AuthNavigator } from './AuthNavigator'
import { MainNavigator } from './MainNavigator'
import { linkingConfig } from './linking-config'
import type { RootStackParamList } from '@/types/navigation'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer linking={linkingConfig}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

## Auth Navigator

```typescript
// navigation/AuthNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Platform } from 'react-native'
import { LoginScreen } from '@/screens/auth/LoginScreen'
import { RegisterScreen } from '@/screens/auth/RegisterScreen'
import { ForgotPasswordScreen } from '@/screens/auth/ForgotPasswordScreen'
import type { AuthStackParamList } from '@/types/navigation'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
        ...Platform.select({
          ios: {
            presentation: 'modal',
            animation: 'slide_from_bottom',
          },
          android: {
            animation: 'slide_from_right',
          },
        }),
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </Stack.Navigator>
  )
}
```

## Main Tab Navigator

```typescript
// navigation/MainNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native'
import { HomeStack } from './HomeStack'
import { ProfileStack } from './ProfileStack'
import { SearchScreen } from '@/screens/SearchScreen'
import { NotificationsScreen } from '@/screens/NotificationsScreen'
import type { MainTabParamList } from '@/types/navigation'

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 8,
            },
          }),
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <SearchIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <BellIcon color={color} size={size} />
          ),
          tabBarBadge: 3, // Example: Show notification count
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <UserIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
```

## Home Nested Stack

```typescript
// navigation/HomeStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Platform } from 'react-native'
import { HomeScreen } from '@/screens/home/HomeScreen'
import { DetailScreen } from '@/screens/home/DetailScreen'
import { CommentsScreen } from '@/screens/home/CommentsScreen'
import type { HomeStackParamList } from '@/types/navigation'

const Stack = createNativeStackNavigator<HomeStackParamList>()

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
        headerTintColor: '#007AFF',
        ...Platform.select({
          ios: {
            headerLargeTitle: true,
          },
        }),
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Feed' }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          ...Platform.select({
            ios: {
              presentation: 'modal',
            },
          }),
        })}
      />
      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          title: 'Comments',
          ...Platform.select({
            ios: {
              presentation: 'card',
            },
            android: {
              animation: 'slide_from_bottom',
            },
          }),
        }}
      />
    </Stack.Navigator>
  )
}
```

## Type-Safe Navigation

```typescript
// screens/home/HomeScreen.tsx
import { useNavigation } from '@react-navigation/native'
import type { HomeScreenProps } from '@/types/navigation'

export function HomeScreen({ navigation, route }: HomeScreenProps) {
  const handleNavigateToDetail = (id: string, title: string) => {
    // Type-safe navigation with params
    navigation.navigate('Detail', {
      id,
      title,
    })
  }

  return (
    <View>
      <TouchableOpacity onPress={() => handleNavigateToDetail('123', 'Post Title')}>
        <Text>View Post</Text>
      </TouchableOpacity>
    </View>
  )
}

// screens/home/DetailScreen.tsx
export function DetailScreen({ route, navigation }: DetailScreenProps) {
  // Type-safe route params
  const { id, title } = route.params

  return (
    <View>
      <Text>{title}</Text>
      <Text>Post ID: {id}</Text>
    </View>
  )
}
```

## Deep Linking Configuration

```typescript
// navigation/linking-config.ts
import type { LinkingOptions } from '@react-navigation/native'
import * as Linking from 'expo-linking'

const prefix = Linking.createURL('/')

export const linkingConfig: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [prefix, 'myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: '',
              Detail: 'post/:id',
              Comments: 'post/:postId/comments',
            },
          },
          SearchTab: 'search',
          NotificationsTab: 'notifications',
          ProfileTab: {
            screens: {
              Profile: 'profile',
              Settings: 'settings',
              EditProfile: 'profile/:userId/edit',
            },
          },
        },
      },
    },
  },
}

// Example deep link URLs:
// myapp://post/123
// https://myapp.com/post/123/comments
// myapp://profile/user-456/edit
```

## iOS Universal Links Setup

```typescript
// app.json
{
  "expo": {
    "ios": {
      "associatedDomains": [
        "applinks:myapp.com",
        "applinks:www.myapp.com"
      ]
    }
  }
}

// Create .well-known/apple-app-site-association on your server:
// https://myapp.com/.well-known/apple-app-site-association
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.yourcompany.myapp",
        "paths": ["*"]
      }
    ]
  }
}
```

## Android App Links Setup

```typescript
// app.json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "myapp.com",
              "pathPrefix": "/"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}

// Create .well-known/assetlinks.json on your server:
// https://myapp.com/.well-known/assetlinks.json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourcompany.myapp",
      "sha256_cert_fingerprints": ["SHA256_FINGERPRINT"]
    }
  }
]
```

## Navigation Utility Hooks

```typescript
// hooks/useNavigationHelper.ts
import { useNavigation, useRoute } from '@react-navigation/native'
import { Platform } from 'react-native'
import type { HomeScreenProps } from '@/types/navigation'

export function useNavigationHelper() {
  const navigation = useNavigation()

  const navigateWithAnalytics = (screen: string, params?: any) => {
    // Log navigation event for analytics
    console.log('Navigation:', screen, params)
    navigation.navigate(screen as never, params)
  }

  const goBackOrHome = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.navigate('HomeTab' as never)
    }
  }

  const showModal = (screen: string, params?: any) => {
    if (Platform.OS === 'ios') {
      navigation.navigate(screen as never, params)
    } else {
      // Android: Use slide from bottom animation
      navigation.navigate(screen as never, params)
    }
  }

  return {
    navigateWithAnalytics,
    goBackOrHome,
    showModal,
  }
}
```

## Navigation State Persistence

```typescript
// App.tsx
import { useState, useEffect, useRef } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'

export function App() {
  const [isReady, setIsReady] = useState(false)
  const [initialState, setInitialState] = useState()

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY)
        const state = savedStateString ? JSON.parse(savedStateString) : undefined

        if (state !== undefined) {
          setInitialState(state)
        }
      } finally {
        setIsReady(true)
      }
    }

    if (!isReady) {
      restoreState()
    }
  }, [isReady])

  if (!isReady) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      {/* Your navigators */}
    </NavigationContainer>
  )
}
```

## Platform-Specific Navigation Patterns

### iOS Navigation Patterns

```typescript
// iOS-specific modal presentation
<Stack.Screen
  name="Detail"
  component={DetailScreen}
  options={{
    presentation: 'modal',
    animation: 'slide_from_bottom',
    headerLargeTitle: true,
    headerTransparent: false,
  }}
/>

// iOS-specific swipe gestures
<Stack.Navigator
  screenOptions={{
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    fullScreenGestureEnabled: true,
  }}
>
```

### Android Navigation Patterns

```typescript
// Android-specific transitions
<Stack.Screen
  name="Detail"
  component={DetailScreen}
  options={{
    animation: 'slide_from_right',
    animationTypeForReplace: 'push',
  }}
/>

// Android hardware back button handling
import { BackHandler } from 'react-native'

useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
      return true // Prevent default behavior
    }
    return false // Allow default behavior (exit app)
  })

  return () => backHandler.remove()
}, [navigation])
```

## Performance Optimization

```typescript
// Lazy load screens
import { lazy } from 'react'

const DetailScreen = lazy(() => import('@/screens/home/DetailScreen'))

// Pre-load screens for faster navigation
import { useFocusEffect } from '@react-navigation/native'

export function HomeScreen() {
  useFocusEffect(
    useCallback(() => {
      // Pre-fetch data for next screen
      prefetchDetailData()
    }, [])
  )
}

// Optimize re-renders
import { memo } from 'react'

export const HomeScreen = memo(function HomeScreen({ navigation, route }) {
  // Screen component
})
```

## Testing Navigation

```typescript
// __tests__/navigation.test.tsx
import { NavigationContainer } from '@react-navigation/native'
import { render, fireEvent } from '@testing-library/react-native'
import { HomeScreen } from '@/screens/home/HomeScreen'

describe('Navigation', () => {
  it('navigates to detail screen with correct params', () => {
    const navigation = { navigate: jest.fn() }
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen navigation={navigation} route={{}} />
      </NavigationContainer>
    )

    fireEvent.press(getByText('View Post'))

    expect(navigation.navigate).toHaveBeenCalledWith('Detail', {
      id: '123',
      title: 'Post Title',
    })
  })
})
```

## Integration with Other Skills

**Coordinates with**:
- **fullstack-integration**: Navigation architecture design, deep linking strategy
- **qa-testing**: Navigation flow testing with Detox E2E tests
- **backend-nestjs/fastapi**: Deep link handling for notification actions

## Related Examples
- 01-authentication-flow.md (Auth-aware navigation guards)
- 03-performance-optimization.md (Navigation performance optimization)

---

**Best Practices Summary**:
- Use TypeScript for type-safe navigation params
- Implement deep linking for better UX (Universal Links, App Links)
- Handle platform differences (iOS modals vs Android slides)
- Optimize navigation performance (lazy loading, pre-fetching)
- Test navigation flows with React Navigation Testing Library
- Persist navigation state for better UX
- NO EMOJIS (text-only labels and titles)
