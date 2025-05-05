import { StyleSheet, View, Pressable, Text } from "react-native";

type Props = {
    title: string;
    onPress: () => void;
};

export default function SimpleButton({ title, onPress }: Props) {
    return (
        <View style={[styles.buttonContainer]}>
            <Pressable style={[styles.button]} onPress={onPress}>
                <Text style={[styles.buttonLabel]}>{title}</Text>
            </Pressable>
        </View>

    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#253353',
        borderRadius: 50,
        width: 100,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonLabel: {
        color: '#f7f4ee',
        fontSize: 15,
    },
});
