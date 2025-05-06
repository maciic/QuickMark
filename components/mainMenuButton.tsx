import { StyleSheet, View, Pressable, Text } from "react-native";

type Props = {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
};

export default function MainMenuButton({ title, icon, onPress }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <View style={styles.buttonIcon}>{icon}</View>
                <Text style={styles.buttonLabel}>{title}</Text>
            </Pressable>
        </View>

    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        borderWidth: 2,
        borderColor: '#253353',
        borderRadius: 50,
        width: 300,
        height: 80,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        marginBottom: 50,
    },
    button: {
        backgroundColor: '#253353',
        borderRadius: 50,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        padding: 6,
    },
    buttonIcon: {
        borderRadius: 50,
        width:60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f4ee',
        marginRight: 10,
    },
    buttonLabel: {
        color: '#f7f4ee',
        fontSize: 25,
        marginRight: 10,
    },
});
