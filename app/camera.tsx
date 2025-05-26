import { CameraView, FlashMode, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, SafeAreaView, Alert, Text, View, Image as RNImage } from "react-native";
import { Image } from "expo-image";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useIsFocused } from '@react-navigation/native';
import { SaveFormat, manipulateAsync, ImageManipulator } from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { UPLOAD_URL } from "../config/api";

import TransparentButton from "../components/transparentButton";


export default function App() {
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<any>(null);
  const [flash, setFlash] = useState<FlashMode>("off");
  const router = useRouter();
  const [pictureTaken, setPictureTaken] = useState<boolean>(false);

  // Refs for coordinate transformation
  const originalImageSize = useRef<{ width: number; height: number } | null>(null);
  const displayedImageLayout = useRef<{ width: number; height: number; x: number; y: number } | null>(null);

  // when we get a new uri, fetch its original size
  useEffect(() => {
    if (uri) {
      RNImage.getSize(
        uri,
        (width, height) => {
          originalImageSize.current = { width, height };
        },
        (err) => {
          console.warn('failed to get image size', err);
        }
      );
    }
  }, [uri]);

  useEffect(() => {
    if (!ref.current) return;
    if (isFocused) {
      // screen has come back into focus → resume preview
      ref.current.resumePreview?.();
    } else {
      // screen is going out of focus → pause preview
      ref.current.pausePreview?.();
    }
  }, [isFocused]);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }


  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri);
    setPictureTaken(true);
  };

  const toggleFlash = () => {
    setFlash((flash) => (flash === "off" ? "on" : "off"));
  };

  const handleRotate = async () => {
    if (!uri) return;

    try {
      const manipulated = await manipulateAsync(
        uri,
        [{ rotate: 90 }],
        {
          format: SaveFormat.JPEG,
        }
      );
      setUri(manipulated.uri);
    } catch (err) {
      console.error("Rotation failed:", err);
      Alert.alert("Error", "Could not rotate image.");
    }
  };


  const handleSaveOriginal = async () => {
    if (!uri) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();

   if (status !== "granted") {
     Alert.alert("Permission required", "Need permission to save images.");
     return;
   }

   try {
     const manipulated = await manipulateAsync(
       uri,
        [],
        {
          compress: 0.1,
          format: SaveFormat.JPEG,
        }
      );

      await MediaLibrary.saveToLibraryAsync(manipulated.uri);

      Alert.alert("Saved", "Original image saved to your gallery.");
    } catch (err) {
      console.error("Save failed:", err);
      Alert.alert("Error", "Could not save original image.");
    }
  };

  const sendImageToProcess = async () => {
    if (!uri) return;

    try {
      
      // upload to your server
      const formData = new FormData();
      formData.append("file", await (await fetch(uri)).blob(), "image.jpg");

      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
      // assume JSON { processedUri: string, ... }
      const data = await res.json();
      
      // For demo purposes, we will just simulate a successful response
      //const data = { examId: "XYZ987", studentId: "Abc123", pass: true }; // Replace with actual response from your server

      // navigate to result.tsx with the returned data
      router.push({
        pathname: "/result",
        params: { payload: JSON.stringify(data) }
      });

      setPictureTaken(false); // Reset the camera view

    } catch (error) {
      console.error("Error sending image:", error);
      Alert.alert("Error", "Failed to send image.");
    }
  };

  const cropImageView = () => (
    
    <SafeAreaView style={styles.cropContainer}>
      {/* Container for the image and overlay */}
      <View style={styles.imageContainer}>
        {/* Display the background image */}
        <Image
          source={{ uri }}
          style={styles.image}
          onLayout={(e) => { displayedImageLayout.current = e.nativeEvent.layout; }}
          onError={(e) => Alert.alert("Error", "Failed to load image.")}
        />
      </View>

      {/* Controls */}
      <View style={styles.buttonContainer}>

        <TransparentButton
          onPress={() => setPictureTaken(false)}
          icon={<Feather name="corner-down-left" size={36} color="white" />}
        />
        <TransparentButton
          onPress={handleRotate}
          icon={<Feather name="rotate-ccw" size={36} color="white" />}
        />
        <TransparentButton
          onPress={handleSaveOriginal}
          icon={<Feather name="save" size={36} color="white" />}
        />
        <TransparentButton
          onPress={sendImageToProcess}
          icon={<Feather name="send" size={36} color="white" />}
        />

      </View>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      {/* only render the live preview when focused */}
      {isFocused && (
        <CameraView
          ref={ref}
          style={[ styles.camera, {
            opacity: pictureTaken ? 0.3 : 1,
            zIndex: pictureTaken ? 0 : 1,
          } ]}
          flash={flash}
          mute
          ratio="16:9"
          responsiveOrientationWhenOrientationLocked
        >
          <View style={styles.shutterContainer}>
            <TransparentButton
              onPress={() => router.back()}
              icon={<AntDesign name="close" size={35} color="white" />}
            />


            <Pressable onPress={takePicture}>
              {({ pressed }) => (
                <View style={[styles.shutterBtn, { opacity: pressed ? 0.5 : 1 }]}>
                  <View style={[styles.shutterBtnInner, { backgroundColor: "white" }]} />
                </View>
              )}
            </Pressable>

            <TransparentButton
              onPress={toggleFlash}
              icon={flash === "off" ? (
                <Entypo name="flash" size={35} color="gray" />
              ) : (
                <Entypo name="flash" size={35} color="white" />
              )}
            />

          </View>
        </CameraView>
      )}

      {/* your crop UI */}
      {pictureTaken && cropImageView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    position: "absolute",
    top: "7%",
    left: 0,
    width: "100%",
    aspectRatio: 9 / 16,    // width:height = 9:16
  },
  shutterContainer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  cropContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    width: "100%",
    zIndex: 1,
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  buttonContainer: {
    flex: 0.1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
  },
});