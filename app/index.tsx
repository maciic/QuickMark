import { View, StyleSheet, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import MainMenuButton from '../components/mainMenuButton'; 

export default function Index() {
  const router = useRouter();

  const cameraOnPress = () => {
    // Simple navigation without params - the layout files handle the header options
    router.push('/camera');
  };
  
  const previousOnPress = () => {
    // Simple navigation without params - the layout files handle the header options
    router.push('/previousScans');
  };

  return (
    <View style={styles.container}>

      <LinearGradient
        colors={['#EDDD53', '#57C785', '#2A7B9B'] }
        locations={[0, 0.2, 1]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}

        style={styles.colorContainer}
      />

      <View style={styles.footerContainer}>
        <Text style={{ fontSize: 40, color: '#f7f4ee'}}>Welcome to</Text>
        <Text style={{ fontSize: 40, color: '#f7f4ee', marginBottom: 100}}>QuickMark</Text>
        <MainMenuButton title="New scan" icon={<Entypo name="camera" size={30} color="#25292e" />} onPress={cameraOnPress} />
        <MainMenuButton title="Previous scans" icon={<Entypo name="list" size={30} color="#25292e"/>} onPress={previousOnPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    flex: 4 / 6,
    alignItems: 'center',
  },

  colorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
