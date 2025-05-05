import { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Entypo } from '@expo/vector-icons';

import SimpleButton from '../components/simpleButton'; 

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

  // Clear all saved scans
  const clearAll = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'QuickMark2/list-of-results.json';
      // overwrite with empty array
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([], null, 2));
      setResults([]);
    } catch (err) {
      console.error('Failed to clear results:', err);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const examId = item.examId;
    const studentId = item.studentId;
    const pass = item.pass ? 'Yes' : 'No';

    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{index + 1}</Text>
        <Text style={styles.cell}>{examId}</Text>
        <Text style={styles.cell}>{studentId}</Text>
        <Text style={styles.cell}>{pass}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => router.back()} />

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
        <Text>No previous scans found.</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <SimpleButton title="Clear all" onPress={clearAll} />
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  list: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  icon: {
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f4ee',
    marginRight: 10,
  },

  item: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },

  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },

  payload: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});