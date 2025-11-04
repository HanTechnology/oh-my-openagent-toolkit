# Performance Optimization Example

**React Native Performance Best Practices**

> **When to Use**: All mobile applications requiring optimal performance
> **Skill**: mobile-react-native
> **Related**: quality-controller (performance validation), systemdev-specialist (profiling)

---

## Overview

This example demonstrates performance optimization techniques to achieve:
- Cold start time: <3s (target: <2s)
- Warm start time: <1s (target: <500ms)
- Memory usage: <150MB (target: <100MB)
- Smooth 60fps UI animations
- Bundle size optimization
- Battery efficiency

## Performance Targets

```typescript
// Quality Standards (from quality-controller)
const PERFORMANCE_TARGETS = {
  coldStart: 3000, // ms - maximum
  coldStartTarget: 2000, // ms - target
  warmStart: 1000, // ms - maximum
  warmStartTarget: 500, // ms - target
  memoryBaseline: 150, // MB - maximum
  memoryTarget: 100, // MB - target
  fps: 60, // frames per second
  batteryDrainPerHour: 5, // percentage - maximum during active use
}
```

## 1. Startup Time Optimization

### App Entry Point Optimization

```typescript
// index.js - Optimized entry point
import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'

// CRITICAL: Minimize work before registerComponent
AppRegistry.registerComponent(appName, () => require('./App').default)

// DON'T: Import heavy dependencies at app entry
// ❌ import './services/analytics'
// ❌ import './utils/largeLibrary'
```

### Lazy Loading Screens

```typescript
// App.tsx
import { lazy, Suspense } from 'react'
import { Text } from 'react-native'

// Lazy load non-critical screens
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'))
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'))

function App() {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ProfileScreen />
    </Suspense>
  )
}
```

### Code Splitting with Dynamic Imports

```typescript
// Lazy load heavy libraries
const loadChartLibrary = async () => {
  const { VictoryChart } = await import('victory-native')
  return VictoryChart
}

export function ChartScreen() {
  const [ChartComponent, setChartComponent] = useState(null)

  useEffect(() => {
    loadChartLibrary().then(setChartComponent)
  }, [])

  if (!ChartComponent) {
    return <LoadingSpinner />
  }

  return <ChartComponent data={data} />
}
```

### Deferred Initialization

```typescript
// App.tsx - Initialize non-critical services after mount
import { useEffect } from 'react'
import { InteractionManager } from 'react-native'

function App() {
  useEffect(() => {
    // Wait for interactions to finish before initializing
    InteractionManager.runAfterInteractions(() => {
      // Initialize analytics
      initializeAnalytics()

      // Initialize crash reporting
      initializeCrashReporting()

      // Pre-fetch data for next screens
      prefetchUserData()
    })
  }, [])

  return <NavigationContainer>{/* ... */}</NavigationContainer>
}
```

### Optimized Splash Screen

```typescript
// app.json - Configure splash screen
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },
    "ios": {
      "splash": {
        "image": "./assets/splash-ios.png",
        "tabletImage": "./assets/splash-ios-tablet.png"
      }
    }
  }
}

// Hide splash screen after app is ready
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync() // Keep splash visible during loading

function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts, data, etc.
        await loadFonts()
        await loadInitialData()
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return <View onLayout={onLayoutRootView}>{/* App */}</View>
}
```

## 2. Memory Management

### FlatList Optimization

```typescript
// Optimized FlatList for long lists
import { FlatList, View, Text } from 'react-native'

interface Item {
  id: string
  title: string
  description: string
}

export function OptimizedList({ items }: { items: Item[] }) {
  const renderItem = useCallback(({ item }: { item: Item }) => (
    <ItemCard item={item} />
  ), [])

  const keyExtractor = useCallback((item: Item) => item.id, [])

  const getItemLayout = useCallback(
    (data: Item[] | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  )

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      // Performance optimizations
      removeClippedSubviews={true} // Unmount offscreen components
      maxToRenderPerBatch={10} // Render 10 items per batch
      updateCellsBatchingPeriod={50} // Update batches every 50ms
      windowSize={10} // Render 10 screen heights worth of items
      initialNumToRender={10} // Initial items to render
      // Memory optimizations
      onEndReachedThreshold={0.5} // Load more when 50% from bottom
      onEndReached={loadMoreItems}
    />
  )
}

// Memoized list item
const ItemCard = memo(({ item }: { item: Item }) => (
  <View style={styles.card}>
    <Text>{item.title}</Text>
    <Text>{item.description}</Text>
  </View>
))
```

### Image Optimization

```typescript
// Use expo-image for better performance
import { Image } from 'expo-image'

export function OptimizedImage({ uri }: { uri: string }) {
  return (
    <Image
      source={{ uri }}
      placeholder={blurhash} // Low-quality placeholder
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk" // Cache strategy
      style={{ width: 300, height: 200 }}
      // Reduce memory footprint
      recyclingKey={uri}
      priority="high"
    />
  )
}

// Image caching configuration
import * as FileSystem from 'expo-file-system'

const imageCache = new Map<string, string>()

export async function getCachedImage(url: string): Promise<string> {
  if (imageCache.has(url)) {
    return imageCache.get(url)!
  }

  const filename = url.split('/').pop()
  const fileUri = `${FileSystem.cacheDirectory}${filename}`

  try {
    const { exists } = await FileSystem.getInfoAsync(fileUri)
    if (exists) {
      imageCache.set(url, fileUri)
      return fileUri
    }

    // Download and cache
    await FileSystem.downloadAsync(url, fileUri)
    imageCache.set(url, fileUri)
    return fileUri
  } catch (error) {
    console.error('Image cache error:', error)
    return url // Fallback to original URL
  }
}
```

### Component Memoization

```typescript
// Use React.memo for expensive components
import { memo } from 'react'

const ExpensiveComponent = memo(
  ({ data, onPress }: { data: Data; onPress: () => void }) => {
    // Expensive rendering logic
    return <View>{/* Complex UI */}</View>
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
  }
)

// Use useMemo for expensive computations
function DataScreen({ items }: { items: Item[] }) {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.active).sort((a, b) => a.priority - b.priority)
  }, [items])

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0)
  }, [items])

  return <View>{/* Render with computed values */}</View>
}

// Use useCallback to prevent re-renders
function ParentComponent() {
  const [count, setCount] = useState(0)

  const handlePress = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  return <ChildComponent onPress={handlePress} />
}
```

## 3. Bundle Size Optimization

### Metro Configuration

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config')

module.exports = (() => {
  const config = getDefaultConfig(__dirname)

  return {
    ...config,
    transformer: {
      ...config.transformer,
      minifierPath: 'metro-minify-terser',
      minifierConfig: {
        compress: {
          drop_console: true, // Remove console.log in production
        },
      },
    },
  }
})()
```

### Tree Shaking

```typescript
// Import only what you need
// ❌ Bad: Imports entire library
import * as _ from 'lodash'

// ✅ Good: Import specific functions
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

// Use package.json sideEffects for tree shaking
{
  "sideEffects": false // Enables aggressive tree shaking
}
```

### Optimize Dependencies

```bash
# Analyze bundle size
npx expo-doctor@latest --fix-dependencies

# Check bundle composition
npx react-native-bundle-visualizer

# Remove unused dependencies
npm uninstall unused-package

# Use lighter alternatives
# ❌ moment.js (200KB)
# ✅ date-fns (13KB with tree-shaking)
```

### Code Splitting by Platform

```typescript
// Platform-specific imports
import { Platform } from 'react-native'

const ImagePicker = Platform.select({
  ios: () => require('./ImagePicker.ios').default,
  android: () => require('./ImagePicker.android').default,
})()

// Or use file extensions
// ImagePicker.ios.tsx
// ImagePicker.android.tsx
// Metro will automatically load the correct file
import ImagePicker from './ImagePicker'
```

## 4. 60fps UI Performance

### Animated API Optimization

```typescript
import { Animated, Easing } from 'react-native'

export function SmoothAnimation() {
  const fadeAnim = useRef(new Animated.Value(0)).current

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true, // CRITICAL: Run on native thread
    }).start()
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Content */}
    </Animated.View>
  )
}
```

### Reanimated for Complex Animations

```typescript
// Use Reanimated 3 for complex gestures and animations
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'

export function ReanimatedExample() {
  const offset = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    }
  })

  const handlePress = () => {
    offset.value = withSpring(100)
  }

  return (
    <Animated.View style={animatedStyles}>
      {/* Content */}
    </Animated.View>
  )
}
```

### InteractionManager for Heavy Operations

```typescript
import { InteractionManager } from 'react-native'

function ExpensiveScreen() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // Wait for animations to complete
    InteractionManager.runAfterInteractions(() => {
      // Run expensive operation
      const processedData = processLargeDataset()
      setData(processedData)
    })
  }, [])

  return <View>{data && <DataView data={data} />}</View>
}
```

### Avoid Re-renders During Scroll

```typescript
function ScrollableList() {
  const [scrollEnabled, setScrollEnabled] = useState(true)

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      onScrollBeginDrag={() => {
        // Disable expensive operations during scroll
        setScrollEnabled(false)
      }}
      onMomentumScrollEnd={() => {
        // Re-enable after scroll
        setScrollEnabled(true)
      }}
      scrollEventThrottle={16} // Limit scroll events to 60fps
    />
  )
}
```

## 5. Performance Monitoring

### React Native Performance Monitor

```typescript
// Enable performance monitor in development
import { PerformanceObserver, performance } from 'perf_hooks'

if (__DEV__) {
  const perfObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}ms`)
    })
  })
  perfObserver.observe({ entryTypes: ['measure'] })
}

// Measure specific operations
performance.mark('operation-start')
// ... expensive operation ...
performance.mark('operation-end')
performance.measure('operation', 'operation-start', 'operation-end')
```

### Flipper Performance Monitoring

```bash
# Install Flipper plugins for React Native
npm install --save-dev react-native-flipper

# Run Flipper desktop app
# Monitor: CPU usage, Memory, Network, Navigation
```

### Custom Performance Metrics

```typescript
// utils/performance.ts
export class PerformanceTracker {
  private static metrics: Map<string, number> = new Map()

  static startMeasure(key: string) {
    this.metrics.set(key, Date.now())
  }

  static endMeasure(key: string): number {
    const start = this.metrics.get(key)
    if (!start) return 0

    const duration = Date.now() - start
    this.metrics.delete(key)

    // Log to analytics
    logPerformanceMetric(key, duration)

    return duration
  }

  static async measureAsync<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> {
    this.startMeasure(key)
    try {
      return await fn()
    } finally {
      this.endMeasure(key)
    }
  }
}

// Usage
PerformanceTracker.startMeasure('screen-load')
// ... load screen ...
const loadTime = PerformanceTracker.endMeasure('screen-load')
console.log(`Screen loaded in ${loadTime}ms`)
```

## 6. Battery Optimization

### Reduce Background Activity

```typescript
import { AppState } from 'react-native'

function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        // Pause expensive operations
        stopLocationTracking()
        pauseAnimations()
        clearIntervals()
      } else if (nextAppState === 'active') {
        // Resume operations
        resumeLocationTracking()
        resumeAnimations()
      }
    })

    return () => subscription.remove()
  }, [])

  return <View>{/* App */}</View>
}
```

### Optimize Location Services

```typescript
import * as Location from 'expo-location'

// Use appropriate accuracy for your use case
const locationConfig = {
  accuracy: Location.Accuracy.Balanced, // Not Highest
  distanceInterval: 100, // Update every 100 meters
  timeInterval: 10000, // Update every 10 seconds
}

// Stop location when not needed
useEffect(() => {
  let subscription: Location.LocationSubscription

  const startTracking = async () => {
    subscription = await Location.watchPositionAsync(
      locationConfig,
      (location) => {
        updateUserLocation(location)
      }
    )
  }

  startTracking()

  return () => {
    if (subscription) {
      subscription.remove()
    }
  }
}, [])
```

## Performance Checklist

- [ ] Cold start time <3s (target: <2s)
- [ ] Warm start time <1s (target: <500ms)
- [ ] Memory usage <150MB (target: <100MB)
- [ ] All animations run at 60fps
- [ ] FlatList configured with optimization props
- [ ] Images use expo-image with caching
- [ ] Heavy operations use InteractionManager
- [ ] Bundle size optimized (removed console.log, tree-shaking)
- [ ] Platform-specific code split
- [ ] Performance monitoring enabled in development
- [ ] Battery drain <5% per hour during active use

## Integration with Other Skills

**Coordinates with**:
- **quality-controller**: Validates performance targets are met
- **systemdev-specialist**: Advanced profiling and optimization
- **qa-testing**: Performance testing automation

## Related Examples
- 01-authentication-flow.md (Optimize auth flow startup)
- 02-navigation-architecture.md (Navigation performance optimization)
- 04-native-module-integration.md (Native code performance)

---

**Best Practices Summary**:
- Lazy load screens and heavy libraries
- Use FlatList optimizations for long lists
- Leverage expo-image for image performance
- Run animations on native thread (useNativeDriver: true)
- Monitor performance in development with Flipper
- Optimize bundle size (tree-shaking, code splitting)
- Reduce battery drain (pause background activity)
- Target: <3s cold start, <1s warm start, <150MB memory, 60fps UI
