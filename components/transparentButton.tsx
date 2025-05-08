import { StyleSheet, Pressable, View } from "react-native";

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
        pressed && { backgroundColor: "#4e5154" },
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({

  button: {
    backgroundColor: "", // default
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
