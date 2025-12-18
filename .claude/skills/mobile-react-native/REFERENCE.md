# Mobile React Native - Technical Reference

## Technology Stack

### Core Framework
- **React Native**: 0.82+ with New Architecture (Fabric + TurboModules + JSI)
- **TypeScript**: 5.x+ with strict mode
- **Hermes**: JavaScript engine (enabled by default)

### Development Tools
- **Expo SDK**: Latest stable (managed workflow preferred)
- **EAS Build**: Cloud builds for iOS/Android
- **EAS Update**: Over-the-air updates
- **Metro**: Bundler configuration

### Navigation
- **React Navigation 6+**: Primary navigation library
- **Expo Router**: File-based routing alternative

### State Management
- **TanStack Query**: Server state management
- **Zustand/Redux Toolkit**: Client state management
- **React Context**: Component-level state

### UI Components
- **React Native Paper**: Material Design components
- **NativeBase**: Cross-platform UI library
- **Tamagui**: High-performance styling

---

## Project Structure

```
workspace/mobile/
├── app/                          # Expo Router (if using)
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── profile.tsx
│   ├── (auth)/                   # Auth flow group
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── _layout.tsx               # Root layout
├── src/
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   └── features/             # Feature-specific components
│   │       ├── ProductCard.tsx
│   │       └── CartItem.tsx
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useProducts.ts
│   ├── services/                 # API services
│   │   ├── api.ts
│   │   └── auth.service.ts
│   ├── stores/                   # State management
│   │   ├── auth.store.ts
│   │   └── cart.store.ts
│   ├── types/                    # TypeScript types
│   │   └── index.ts
│   ├── utils/                    # Utilities
│   │   ├── storage.ts
│   │   └── validation.ts
│   └── constants/                # App constants
│       ├── colors.ts
│       └── config.ts
├── assets/                       # Static assets
│   ├── images/
│   └── fonts/
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build configuration
├── tsconfig.json
└── package.json
```

---

## Code Standards

### Component Pattern

```typescript
// Component with TypeScript
import React, { FC, memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  onPress: (id: string) => void;
}

export const ProductCard: FC<ProductCardProps> = memo(({
  id,
  title,
  price,
  imageUrl,
  onPress,
}) => {
  return (
    <Pressable 
      style={styles.container}
      onPress={() => onPress(id)}
      accessibilityRole="button"
      accessibilityLabel={`View ${title}`}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
});
```

### Custom Hook Pattern

```typescript
// useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import type { Product, CreateProductDto } from '@/types';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductDto) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

### Navigation Setup

```typescript
// app/_layout.tsx (Expo Router)
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#000',
            headerTitleStyle: { fontWeight: '600' },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="product/[id]" 
            options={{ title: 'Product Details' }} 
          />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

---

## Performance Optimization

### Startup Optimization

```typescript
// Lazy load heavy screens
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./screens/Dashboard'));

// In navigation
<Suspense fallback={<LoadingScreen />}>
  <Dashboard />
</Suspense>
```

### List Optimization

```typescript
// Optimized FlatList
import { FlatList, View } from 'react-native';

<FlatList
  data={products}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ProductCard {...item} />}
  // Performance optimizations
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  windowSize={5}
  initialNumToRender={10}
  // Item layout for fixed-height items
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Image Optimization

```typescript
import { Image } from 'expo-image';

// Use expo-image for better caching
<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

---

## Platform-Specific Code

### Platform Module

```typescript
// Button.tsx with platform differences
import { Platform, Pressable, TouchableNativeFeedback } from 'react-native';

export const Button: FC<ButtonProps> = ({ onPress, children }) => {
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple('#rgba(0,0,0,0.2)', false)}
      >
        <View style={styles.button}>{children}</View>
      </TouchableNativeFeedback>
    );
  }
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      {children}
    </Pressable>
  );
};
```

### Platform-Specific Files

```
components/
├── Header.tsx        # Shared logic
├── Header.ios.tsx    # iOS-specific
└── Header.android.tsx # Android-specific
```

---

## Security Best Practices

### Secure Storage

```typescript
import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },
  
  async getItem(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  },
  
  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};

// Store tokens securely
await secureStorage.setItem('auth_token', token);
```

### Biometric Authentication

```typescript
import * as LocalAuthentication from 'expo-local-authentication';

export async function authenticateWithBiometrics(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) return false;
  
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to continue',
    fallbackLabel: 'Use passcode',
  });
  
  return result.success;
}
```

---

## Testing

### Component Testing

```typescript
// ProductCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    title: 'Test Product',
    price: 99.99,
    imageUrl: 'https://example.com/image.jpg',
  };

  it('renders product information correctly', () => {
    const { getByText } = render(
      <ProductCard {...mockProduct} onPress={jest.fn()} />
    );
    
    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();
  });

  it('calls onPress with product id when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <ProductCard {...mockProduct} onPress={onPress} />
    );
    
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledWith('1');
  });
});
```

### E2E Testing with Detox

```typescript
// e2e/login.test.ts
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should login successfully with valid credentials', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    
    await expect(element(by.text('Welcome'))).toBeVisible();
  });
});
```

---

## EAS Configuration

### eas.json

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "{{APPLE_ID}}",
        "ascAppId": "{{ASC_APP_ID}}",
        "appleTeamId": "{{APPLE_TEAM_ID}}"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services.json",
        "track": "production"
      }
    }
  }
}
```

---

## Performance Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| Cold Start | <3s | 5s |
| Warm Start | <1s | 2s |
| Frame Rate | 60fps | - |
| Memory Usage | <150MB | 200MB |
| JS Bundle | <2MB | 5MB |
| App Size | <50MB | 100MB |

---

## Related Skills

- **backend-nestjs/fastapi**: Mobile API development
- **fullstack-integration**: API contracts and type sharing
- **devops-deployment**: EAS Build configuration
- **qa-testing**: Mobile E2E testing (Detox)
- **security-specialist**: Mobile security (secure storage, biometrics)
