import { View, StyleSheet, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function NotFoundScreen() {

  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
          <Text style={styles.button} onPress={() => router.back()}>
            Go back to previous page!
          </Text>
      </View>
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
