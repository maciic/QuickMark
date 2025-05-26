import { StyleSheet, Pressable } from "react-native";

type Props = {
  icon: React.ReactNode;
  onPress: () => void;
};

export default function TransparentButton({ icon, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed, // only applied when pressed === true
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent", // ← use a valid default
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  pressed: {
    backgroundColor: "#4e5154",
  },
});
