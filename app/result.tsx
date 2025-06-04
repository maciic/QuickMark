import { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";
import { Feather } from '@expo/vector-icons';

import SimpleButton from "../components/simpleButton";

export default function Result() {
  const { payload } = useLocalSearchParams();
  const data = payload ? JSON.parse(payload as string) : null;

  useEffect(() => {
    if (!data) return;
    const persistResult = async () => {
      const baseDir = FileSystem.documentDirectory + "QuickMark2/";
      await FileSystem.makeDirectoryAsync(baseDir, { intermediates: true });
      const fileUri = baseDir + "list-of-results.json";
      const info = await FileSystem.getInfoAsync(fileUri);
      let allResults: any[] = [];

      if (info.exists) {
        try {
          const content = await FileSystem.readAsStringAsync(fileUri);
          allResults = JSON.parse(content);
        } catch {
          allResults = [];
        }
      }

      allResults.push(data);
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(allResults, null, 2)
      );
    };

    persistResult();
  }, [data]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Correct Answers</Text>

      <View style={styles.passContainer}>
        <Text style={styles.passText}>{data.correctAnswers}</Text>
      </View>

      {data && (
        <View style={styles.resultBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Exam ID:</Text>
            <Text style={styles.value}>{data.examId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Neptun code:</Text>
            <Text style={styles.value}>{data.examineeNeptunCode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Student name:</Text>
            <Text style={styles.value}>{data.userUsername}</Text>
          </View>
        </View>
      )}

      <SimpleButton title="New Scan" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  passText: {
    fontSize: 88,
    fontWeight: "bold",
    color: "#253353",
    textAlign: "center",
    marginBottom: 24,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    textAlign: "center",
  },
  resultBox: {
    width: "80%",
    padding: 16,
    marginBottom: 64,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  passContainer: {
    marginVertical: 20,
  },
});