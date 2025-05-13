import { StyleSheet, Pressable, View, Text } from "react-native";

type Props = {
    title: string;
    onPress: () => void;
};

export default function SimpleButton({
  title,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      // style the outer container (border) based on pressed state
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && { borderColor: "#4e5154" },
      ]}
    >
      {/* children-as-function to style inner view */}
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            pressed && { backgroundColor: "#4e5154" },
          ]}
        >
          <Text style={styles.buttonLabel}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderWidth: 2,
    borderColor: "#253353",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 220,
    padding: 3,
  },
  button: {
    backgroundColor: "#253353",
    borderRadius: 50,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    color: "#f7f4ee",
    fontSize: 15,
  },
});
