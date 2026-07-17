import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from '../src/store';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import '../src/services/firebase';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal' }} />
          </Stack>
        </GestureHandlerRootView>
      </Provider>
    </ErrorBoundary>
  );
}
