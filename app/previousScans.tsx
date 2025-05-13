import { useState, useEffect } from 'react';
import { Image, View, FlatList, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Feather } from '@expo/vector-icons';
 
import CircleButton from '../components/circleButton';

export default function PreviousScans() {
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const baseDir = FileSystem.documentDirectory + 'QuickMark2/';
        const fileUri = baseDir + 'list-of-results.json';
        const info = await FileSystem.getInfoAsync(fileUri);
        if (info.exists) {
          const content = await FileSystem.readAsStringAsync(fileUri);
          setResults(JSON.parse(content));
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Failed to load previous scans:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, []);

  // perform deletion after user confirms
  const performClearAll = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'QuickMark2/list-of-results.json';
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([], null, 2));
      setResults([]);
    } catch (err) {
      console.error('Failed to clear results:', err);
    }
  };

  // prompt user before clearing
  const clearAll = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete all previous scans?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performClearAll },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {

    return (
      <View style={styles.listRow}>
        <Text style={styles.listCell}>{index + 1}</Text>
        <Text style={styles.listCell}>{item.examId}</Text>
        <Text style={styles.listCell}>{item.studentId}</Text>
        <View style={styles.listIcon}>
          <Feather name={item.pass ? 'check-circle' : 'x'} size={24} color={item.pass ? 'green' : 'red'} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>#</Text>
        <Text style={styles.headerCell}>Exam ID</Text>
        <Text style={styles.headerCell}>Student ID</Text>
        <Text style={styles.headerCell}>Pass</Text>
      </View>

      {loading ? (

        <Text>Loading…</Text>

      ) : results.length === 0 ? (

        <View style={styles.emptyStateContainer}>

          <Text style={styles.emptyStateText}>No previous scans found.</Text>
          <Image 
            style={{ width: "80%", opacity: 0.7, marginTop: 30}}
            resizeMode="contain"
            source={require('../assets/images/no-scanned-items-bg.png')}
          />

        </View>

      ) : (

        <FlatList
          data={results}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={{marginTop: 8}}
        />
      )}

      <View style={styles.navigationContainer}>
        <CircleButton
          icon={<Feather name="corner-down-left" color="white" size={30} />}
          onPress={() => router.back()}
        />

        <CircleButton
          icon={<Feather name="trash-2" color="white" size={30} />}
          onPress={results.length > 0 ? clearAll : () => {}}
          color={results.length > 0 ? '#253353': '#4e5154'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },

  headerRow: {
    flexDirection: 'row',
    paddingTop: 60,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },

  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },

  listRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  listCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },

  listIcon: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
  },

  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },

  navigationContainer: {
    height: 70,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "#fff",
  },
});