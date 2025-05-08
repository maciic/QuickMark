import { StyleSheet, Pressable, View } from "react-native";

type Props = {
  icon: React.ReactNode;
  onPress: () => void;
  color?: string;   // optional base color
};

export default function CircleButton({ icon, onPress, color }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonContainer,
        color && { borderColor: color },
        pressed && { borderColor: "#4e5154" },
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            { backgroundColor: color ?? "#253353" },
            pressed && { backgroundColor: "#4e5154" },
          ]}
        >
          {icon}
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
    height: 70,
    width: 70,
    padding: 3,
  },
  button: {
    backgroundColor: "#253353", // default
    borderRadius: 50,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
