import { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";

export default function Result() {
  const { payload } = useLocalSearchParams();
  const data = payload ? JSON.parse(payload as string) : null;

  useEffect(() => {
    if (!data) return;
    const persistResult = async () => {
      // create (if needed) and use a sub-folder under documentDirectory
      const baseDir = FileSystem.documentDirectory + "QuickMark2/";
      await FileSystem.makeDirectoryAsync(baseDir, { intermediates: true });
      const fileUri = baseDir + "list-of-results.json";

      // check if file exists
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
      // append new result
      allResults.push(data);
      // write back to file
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(allResults, null, 2)
      );
    };

    persistResult();
  }, [data]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Processed Result:</Text>
      <Text>{JSON.stringify(data, null, 2)}</Text>
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}