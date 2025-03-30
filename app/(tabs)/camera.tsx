import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';

export default function CameraTab() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<FlashMode>('off');

    const [torch, setTorch] = useState(false);  // Vaku állapot kezelése
    const [permission, requestPermission] = useCameraPermissions();
    const [uri, setUri] = useState<string | null>(null);
    const ref = useRef<CameraView>(null);
    const navigation = useNavigation();


    
    if (!permission) {
        // Kamera engedélyek még töltődnek
        return <View />;
    };

    if (!permission.granted) {
        // Ha nincs engedély
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    };

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    function toggleFlash() {
        setFlash(current => (current === 'off' ? 'on' : 'off'));
    };

    function toggleTorch() {
        setTorch(current => (current === false ? true : false));
    };

    const takePicture = async () => {
        const photo = await ref.current?.takePictureAsync();
        setUri(photo?.uri);
    };

    const renderPicture = () => {
        return (
          <View>
            <Image source={{ uri }} contentFit="contain" style={{ width: 300, aspectRatio: 1 }} />
            <Button onPress={() => setUri(null)} title="Take another picture" />
          </View>
        );
    };

    const renderCamera = () => {
        return (
            <CameraView style={styles.camera} facing={facing} enableTorch={torch} ref={ref} mute={true} flash={flash}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={toggleFlash}>
                        <Text style={styles.text}>{flash === "off" ? 'Vaku kikapcsolva' : 'Vaku bekapcsolva'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={toggleTorch}>
                        <Text style={styles.text}>{torch === false ? 'Lámpa kikapcsolva' : 'Lámpa bekapcsolva'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.text}>Kép Készítése</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                        <Text style={styles.text}>Kilépés</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        )
    }

    return (
        <View style={styles.container}>
            {uri ? renderPicture() : renderCamera()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      },

    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
