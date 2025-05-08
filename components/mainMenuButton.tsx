import { StyleSheet, Pressable, View, Text } from "react-native";

type Props = {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
};

export default function MainMenuButton({ title, icon, onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.buttonContainer,
                pressed && { borderColor: "#343a46" },
            ]}
        >
            {({ pressed }) => (
                <View
                    style={[
                        styles.button,
                        // change inner background when pressed
                        pressed && { backgroundColor: "#343a46" },
                    ]}
                >
                    <View style={styles.buttonIcon}>{icon}</View>
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
        borderRadius: 50,
        width: 300,
        height: 80,
        marginHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        marginBottom: 50,
    },
    button: {
        backgroundColor: "#253353",
        borderRadius: 50,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        padding: 6,
    },
    buttonIcon: {
        borderRadius: 50,
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f7f4ee",
        marginRight: 10,
    },
    buttonLabel: {
        color: "#f7f4ee",
        fontSize: 25,
        marginRight: 10,
    },
});
