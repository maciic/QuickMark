import { View, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

import MainMenuButton from '@/components/mainMenuButton'; 

export default function Index() {

  const router = useRouter();

  const cameraOnPress = () => {
    router.push('/(tabs)/camera2');
  }
  
  const previousOnPress = () => {
    router.push('/+not-found');
  }
  


  return (
    <View style={styles.container}>
      <View style={styles.footerContainer}>
        <MainMenuButton title="New scan" icon={<Entypo name="camera" size={24} color="#25292e" />} onPress={cameraOnPress} />
        <MainMenuButton title="Previous scans" icon={<Entypo name="list" size={24} color="#25292e"/>} onPress={previousOnPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 28,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
