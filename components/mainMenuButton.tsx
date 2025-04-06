import { StyleSheet, View, Pressable, Text } from "react-native";

type Props = {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
};

export default function MainMenuButton({ title, icon, onPress }: Props) {
    return (
        <View style={[styles.buttonContainer, {borderWidth: 1, borderColor: '#ffd33d', borderRadius: 10}]}>
            <Pressable style={[styles.button, {backgroundColor: "#fff"}]} onPress={onPress}>
                <Text style={[styles.buttonLabel, {color: "#25292e"}]}>{title}</Text>
                <View style={styles.buttonIcon}>{icon}</View>
            </Pressable>
        </View>

    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonIcon: {
        paddingLeft: 8,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
    },
});
