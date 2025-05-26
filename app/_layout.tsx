import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    // lock the entire app to portrait at runtime
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false}} />
        <Stack.Screen name="camera" options={{ headerShown: false}} />
        <Stack.Screen name="previousScans" options={{ headerShown: false}} />
        <Stack.Screen name="result" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
  );
}