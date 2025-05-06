import { StyleSheet, View, Pressable, Text } from "react-native";

type Props = {
    icon: React.ReactNode;
    onPress: () => void;
    color?: string;
};

export default function CircleButton({ icon, onPress, color }: Props) {

    const buttonStyle = [styles.button];
    const buttonContainerStyle = [styles.buttonContainer];

    if (color) {
        buttonStyle.push({ ...styles.button, backgroundColor: color });
        buttonContainerStyle.push({ ...styles.buttonContainer, borderColor: color });
    }
    
    return (
        <View style={buttonContainerStyle}>
            <Pressable style={buttonStyle} onPress={onPress}>
                <View style={styles.icon}>{icon}</View>
            </Pressable>
        </View>

    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        borderWidth: 2,
        borderColor: '#253353',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        width: 70,
        padding: 3,
    },
    button: {
        backgroundColor: '#253353',
        borderRadius: 50,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    icon: {
        
    },
});
