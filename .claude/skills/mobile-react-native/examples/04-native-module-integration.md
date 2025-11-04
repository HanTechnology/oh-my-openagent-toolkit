# Native Module Integration Example

**TurboModules, Camera, Location, and Push Notifications**

> **When to Use**: Mobile apps requiring native device feature access
> **Skill**: mobile-react-native
> **Related**: systemdev-specialist (native code optimization), devops-deployment (native builds)

---

## Overview

This example demonstrates native module integration with:
- TurboModules with New Architecture (Fabric + JSI)
- Camera integration (expo-camera)
- Location services (expo-location)
- Push notifications (expo-notifications)
- Platform-specific native code (Swift, Kotlin)
- Expo config plugins
- Biometric authentication (covered in 01-authentication-flow.md)

## Architecture: React Native New Architecture

```
JavaScript Layer
    ↓ JSI (JavaScript Interface)
TurboModules (Type-safe, synchronous native calls)
    ↓
Native Layer (Swift/Objective-C for iOS, Kotlin/Java for Android)
```

**Benefits**:
- Type-safe native calls
- Synchronous method invocation
- Better performance (direct memory access via JSI)
- Lazy loading of native modules

## 1. Camera Integration

### Camera Setup

```typescript
// hooks/useCamera.ts
import { useState, useRef, useEffect } from 'react'
import { Camera, CameraType, FlashMode } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'

export function useCamera() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [cameraType, setCameraType] = useState(CameraType.back)
  const [flashMode, setFlashMode] = useState(FlashMode.off)
  const cameraRef = useRef<Camera>(null)

  useEffect(() => {
    requestPermissions()
  }, [])

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync()
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync()
    setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted')
  }

  const takePicture = async () => {
    if (!cameraRef.current) return null

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: true,
      })

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(photo.uri)
      return asset
    } catch (error) {
      console.error('Camera error:', error)
      return null
    }
  }

  const toggleCameraType = () => {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    )
  }

  const toggleFlash = () => {
    setFlashMode((current) =>
      current === FlashMode.off ? FlashMode.on : FlashMode.off
    )
  }

  return {
    hasPermission,
    cameraType,
    flashMode,
    cameraRef,
    takePicture,
    toggleCameraType,
    toggleFlash,
  }
}
```

### Camera Screen Component

```typescript
// screens/CameraScreen.tsx
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { Camera } from 'expo-camera'
import { useCamera } from '@/hooks/useCamera'
import { CameraIcon, FlipCameraIcon, FlashIcon } from 'lucide-react-native'

export function CameraScreen() {
  const {
    hasPermission,
    cameraType,
    flashMode,
    cameraRef,
    takePicture,
    toggleCameraType,
    toggleFlash,
  } = useCamera()

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>
  }

  if (hasPermission === false) {
    return <View style={styles.container}><Text>Camera permission denied</Text></View>
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
      >
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={toggleFlash}>
            <FlashIcon color="#FFF" size={32} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <FlipCameraIcon color="#FFF" size={32} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    padding: 16,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
})
```

## 2. Location Services

### Location Hook

```typescript
// hooks/useLocation.ts
import { useState, useEffect } from 'react'
import * as Location from 'expo-location'

export interface LocationData {
  latitude: number
  longitude: number
  accuracy: number | null
  altitude: number | null
  heading: number | null
  speed: number | null
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    requestPermissions()
  }, [])

  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setError('Location permission denied')
        return
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Permission request failed')
    }
  }

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        heading: coords.heading,
        speed: coords.speed,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location')
    } finally {
      setIsLoading(false)
    }
  }

  const watchLocation = async (
    callback: (location: LocationData) => void
  ): Promise<Location.LocationSubscription | null> => {
    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 100, // Update every 100 meters
          timeInterval: 10000, // Update every 10 seconds
        },
        ({ coords }) => {
          const locationData: LocationData = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            altitude: coords.altitude,
            heading: coords.heading,
            speed: coords.speed,
          }
          setLocation(locationData)
          callback(locationData)
        }
      )

      return subscription
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to watch location')
      return null
    }
  }

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      })

      if (addresses.length > 0) {
        const address = addresses[0]
        return {
          street: address.street,
          city: address.city,
          region: address.region,
          country: address.country,
          postalCode: address.postalCode,
          formattedAddress: `${address.street}, ${address.city}, ${address.region} ${address.postalCode}`,
        }
      }

      return null
    } catch (err) {
      console.error('Geocoding error:', err)
      return null
    }
  }

  return {
    location,
    error,
    isLoading,
    getCurrentLocation,
    watchLocation,
    reverseGeocode,
  }
}
```

### Background Location Tracking

```typescript
// services/location/background-tracking.ts
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'

const BACKGROUND_LOCATION_TASK = 'background-location-task'

// Define background task
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error)
    return
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] }
    const latestLocation = locations[locations.length - 1]

    // Send location to server
    await sendLocationToServer(latestLocation.coords)
  }
})

export async function startBackgroundLocationTracking() {
  // Request background permission
  const { status } = await Location.requestBackgroundPermissionsAsync()
  if (status !== 'granted') {
    throw new Error('Background location permission denied')
  }

  // Start tracking
  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 60000, // 1 minute
    distanceInterval: 500, // 500 meters
    foregroundService: {
      notificationTitle: 'Location Tracking',
      notificationBody: 'Tracking your location in the background',
    },
  })
}

export async function stopBackgroundLocationTracking() {
  await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
}

async function sendLocationToServer(coords: Location.LocationObjectCoords) {
  try {
    await fetch(`${API_URL}/api/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('Failed to send location:', error)
  }
}
```

## 3. Push Notifications

### Notification Service

```typescript
// services/notifications/notification-service.ts
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const notificationService = {
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices')
      return null
    }

    try {
      // Request permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== 'granted') {
        throw new Error('Push notification permission denied')
      }

      // Get push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // From app.json
      })

      // Configure Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        })
      }

      return token.data
    } catch (error) {
      console.error('Push notification registration error:', error)
      return null
    }
  },

  async scheduleLocalNotification(
    title: string,
    body: string,
    trigger?: Notifications.NotificationTriggerInput
  ) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: trigger || null, // null = immediate
    })
  },

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync()
  },

  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync()
  },

  async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count)
  },
}
```

### Notification Hooks

```typescript
// hooks/useNotifications.ts
import { useEffect, useRef, useState } from 'react'
import * as Notifications from 'expo-notifications'
import { notificationService } from '@/services/notifications/notification-service'
import { useAuth } from '@/hooks/useAuth'

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)
  const [notification, setNotification] = useState<Notifications.Notification | null>(null)
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()
  const { user } = useAuth()

  useEffect(() => {
    registerForPushNotifications()

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification)
      }
    )

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data
        // Handle notification tap (e.g., navigate to specific screen)
        handleNotificationResponse(data)
      }
    )

    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [])

  const registerForPushNotifications = async () => {
    const token = await notificationService.registerForPushNotifications()
    if (token) {
      setExpoPushToken(token)
      // Send token to backend
      await sendTokenToBackend(token)
    }
  }

  const sendTokenToBackend = async (token: string) => {
    if (!user) return

    try {
      await fetch(`${API_URL}/api/notifications/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          pushToken: token,
          platform: Platform.OS,
        }),
      })
    } catch (error) {
      console.error('Failed to register push token:', error)
    }
  }

  const handleNotificationResponse = (data: any) => {
    // Navigate based on notification data
    if (data.type === 'message') {
      navigation.navigate('Messages', { conversationId: data.conversationId })
    } else if (data.type === 'friend-request') {
      navigation.navigate('FriendRequests')
    }
  }

  return {
    expoPushToken,
    notification,
  }
}
```

## 4. Custom Native Module (TurboModule)

### Creating a Native Module with Expo

```typescript
// app.json - Configure Expo config plugin
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "newArchEnabled": true
          },
          "android": {
            "newArchEnabled": true
          }
        }
      ]
    ]
  }
}
```

### iOS Native Module (Swift)

```swift
// ios/MyNativeModule.swift
import ExpoModulesCore

public class MyNativeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyNativeModule")

    // Synchronous function (TurboModule benefit)
    Function("calculateHash") { (input: String) -> String in
      return input.sha256() // Example: Fast hash calculation
    }

    // Asynchronous function
    AsyncFunction("fetchUserData") { (userId: String, promise: Promise) in
      DispatchQueue.global().async {
        // Perform network request or heavy computation
        let userData = self.fetchUser(userId)
        promise.resolve(userData)
      }
    }

    // Event emitter
    Events("onDataUpdate")

    // Property
    Property("version")
      .get { () -> String in
        return "1.0.0"
      }
  }

  private func fetchUser(_ userId: String) -> [String: Any] {
    // Native implementation
    return ["id": userId, "name": "User Name"]
  }
}
```

### Android Native Module (Kotlin)

```kotlin
// android/src/main/java/expo/modules/mynativemodule/MyNativeModule.kt
package expo.modules.mynativemodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MyNativeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyNativeModule")

    // Synchronous function
    Function("calculateHash") { input: String ->
      return input.sha256() // Example: Fast hash calculation
    }

    // Asynchronous function
    AsyncFunction("fetchUserData") { userId: String ->
      // Perform network request or heavy computation
      val userData = fetchUser(userId)
      return@AsyncFunction userData
    }

    // Events
    Events("onDataUpdate")

    // Property
    Property("version")
      .get { "1.0.0" }
  }

  private fun fetchUser(userId: String): Map<String, Any> {
    // Native implementation
    return mapOf("id" to userId, "name" to "User Name")
  }
}

// Extension function for SHA256
private fun String.sha256(): String {
  val bytes = MessageDigest.getInstance("SHA-256").digest(this.toByteArray())
  return bytes.joinToString("") { "%02x".format(it) }
}
```

### Using Native Module in JavaScript

```typescript
// hooks/useNativeModule.ts
import { NativeModules, NativeEventEmitter } from 'react-native'

const { MyNativeModule } = NativeModules
const eventEmitter = new NativeEventEmitter(MyNativeModule)

export function useNativeModule() {
  useEffect(() => {
    const subscription = eventEmitter.addListener('onDataUpdate', (data) => {
      console.log('Data update from native:', data)
    })

    return () => subscription.remove()
  }, [])

  const calculateHash = (input: string): string => {
    // Synchronous call - TurboModule benefit
    return MyNativeModule.calculateHash(input)
  }

  const fetchUserData = async (userId: string): Promise<any> => {
    return await MyNativeModule.fetchUserData(userId)
  }

  const getVersion = (): string => {
    return MyNativeModule.version
  }

  return {
    calculateHash,
    fetchUserData,
    getVersion,
  }
}
```

## 5. Platform-Specific Code

### File-based Platform Separation

```typescript
// utils/PlatformHelper.ios.ts
export class PlatformHelper {
  static getStatusBarHeight(): number {
    return 44 // iOS status bar height
  }

  static getNativeFeature(): string {
    return 'iOS Feature'
  }
}

// utils/PlatformHelper.android.ts
export class PlatformHelper {
  static getStatusBarHeight(): number {
    return 24 // Android status bar height
  }

  static getNativeFeature(): string {
    return 'Android Feature'
  }
}

// Usage in components (Metro automatically loads correct file)
import { PlatformHelper } from '@/utils/PlatformHelper'

const statusBarHeight = PlatformHelper.getStatusBarHeight()
```

### Platform.select API

```typescript
import { Platform, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        paddingTop: 44,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        paddingTop: 24,
        elevation: 4,
      },
    }),
  },
})

// Platform-specific component rendering
const HeaderButton = Platform.select({
  ios: () => <IOSHeaderButton />,
  android: () => <AndroidHeaderButton />,
})()
```

## 6. Expo Config Plugins

### Custom Config Plugin

```javascript
// plugins/withCustomNativeCode.js
const { withDangerousMod, withPlugins } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

function withCustomNativeCode(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        'MyApp/AppDelegate.mm'
      )

      let contents = fs.readFileSync(filePath, 'utf-8')

      // Add custom native code
      if (!contents.includes('// CUSTOM_CODE')) {
        contents = contents.replace(
          'return [super application:application didFinishLaunchingWithOptions:launchOptions];',
          `// CUSTOM_CODE
  [self setupCustomFeature];
  return [super application:application didFinishLaunchingWithOptions:launchOptions];`
        )

        fs.writeFileSync(filePath, contents)
      }

      return config
    },
  ])
}

module.exports = withCustomNativeCode

// app.json
{
  "expo": {
    "plugins": ["./plugins/withCustomNativeCode"]
  }
}
```

## Performance Considerations

### Native Module Performance

```typescript
// Use TurboModules for synchronous operations (faster)
const hash = MyNativeModule.calculateHash(data) // Synchronous

// Batch native calls to reduce bridge overhead
const results = await MyNativeModule.batchProcess(dataArray)

// Cache native module results
const cachedResults = useMemo(() => {
  return MyNativeModule.expensiveOperation(input)
}, [input])
```

## Security Best Practices

1. **Camera**: Request permissions before accessing
2. **Location**: Use minimum required accuracy
3. **Notifications**: Validate notification data before navigation
4. **Native Modules**: Sanitize all inputs to native code
5. **Background Tasks**: Minimize battery drain

## Testing Native Integrations

```typescript
// __tests__/camera.test.ts
import { Camera } from 'expo-camera'

jest.mock('expo-camera')

describe('Camera Integration', () => {
  it('requests camera permission', async () => {
    ;(Camera.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    })

    const { status } = await Camera.requestCameraPermissionsAsync()
    expect(status).toBe('granted')
  })
})
```

## Integration with Other Skills

**Coordinates with**:
- **systemdev-specialist**: Native code optimization, performance profiling
- **devops-deployment**: EAS Build configuration for native modules
- **qa-testing**: Native feature testing with Detox
- **backend-nestjs/fastapi**: Server-side notification sending, location data storage

## Related Examples
- 01-authentication-flow.md (Biometric authentication native module)
- 03-performance-optimization.md (Native module performance)

---

**Best Practices Summary**:
- Use Expo modules for common native features (camera, location, notifications)
- Create custom TurboModules for performance-critical operations
- Use platform-specific files for platform-dependent logic
- Request permissions before accessing native features
- Test native integrations with mocks
- Configure Expo config plugins for native code modifications
- Minimize battery drain with efficient background tasks
- Use New Architecture (Fabric + TurboModules + JSI) for best performance
