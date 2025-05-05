import { CameraView, FlashMode, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, SafeAreaView, Dimensions, Alert, Text, View, Image as RNImage } from "react-native";
import { Image } from "expo-image";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from "expo-media-library";    // <-- added

// Import the frame-only overlay component and its Corners type
import CropOverlayFrameOnly, { Corners } from '../components/CropOverlay'; // Adjust path if needed

// Get screen dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<any>(null);
  const [flash, setFlash] = useState<FlashMode>("off");
  const router = useRouter();
  const [pictureTaken, setPictureTaken] = useState<boolean>(false);

  // State to hold the latest corner coordinates received from the overlay
  const [cropCorners, setCropCorners] = useState<Corners | null>(null);
  const [croppedUri, setCroppedUri] = useState<string | null>(null);  // <-- added

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
          console.log('original image size:', width, height);
        },
        (err) => {
          console.warn('failed to get image size', err);
        }
      );
    }
  }, [uri]);

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
    console.log(" --- Picture taken: ", pictureTaken);
  };

  const toggleFlash = () => {
    setFlash((flash) => (flash === "off" ? "on" : "off"));
  };

  const renderCamera = () => (
    <CameraView
      style={styles.camera}
      ref={ref}
      flash={flash}
      mute
      ratio="16:9"                            // ← still 16:9
      responsiveOrientationWhenOrientationLocked
    >
      <View style={styles.shutterContainer}>
        <Pressable onPress={toggleFlash}>
          {flash === "off" ? (
            <Entypo name="flash" size={32} color="gray" />
          ) : (
            <Entypo name="flash" size={32} color="white" />
          )}
        </Pressable>
        <Pressable onPress={takePicture}>
          {({ pressed }) => (
            <View style={[styles.shutterBtn, { opacity: pressed ? 0.5 : 1 }]}>
              <View style={[styles.shutterBtnInner, { backgroundColor: "white" }]} />
            </View>
          )}
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <AntDesign name="close" size={32} color="white" />
        </Pressable>
      </View>
    </CameraView>
  );

  const handleLayoutChange = (currentCorners: Corners) => {
    setCropCorners(currentCorners); // Update local state
  };

  const handleCrop = async () => {

    // --- Coordinate Transformation Logic (Same as before) ---
    if (
      !originalImageSize.current ||
      !displayedImageLayout.current ||
      !cropCorners
    ) {
      Alert.alert("Error", "Missing image or crop data for cropping.");
      return;
    }
    const origWidth = originalImageSize.current.width;
    const origHeight = originalImageSize.current.height;
    const displayWidth = displayedImageLayout.current.width;
    const displayHeight = displayedImageLayout.current.height;
    const displayX = displayedImageLayout.current.x;
    const displayY = displayedImageLayout.current.y;
    const scaleX = origWidth / displayWidth;
    const scaleY = origHeight / displayHeight;
    const scale = Math.min(scaleX, scaleY);   // ← use “contain” on Android
    const actualDisplayWidth = origWidth / scale;
    const actualDisplayHeight = origHeight / scale;
    const offsetX = displayX + (displayWidth - actualDisplayWidth) / 2;
    const offsetY = displayY + (displayHeight - actualDisplayHeight) / 2;
    const cropOriginX = (cropCorners.topLeft.x - offsetX) * scale;
    const cropOriginY = (cropCorners.topLeft.y - offsetY) * scale;
    const cropWidth = Math.abs(cropCorners.topRight.x - cropCorners.topLeft.x) * scale;
    const cropHeight = Math.abs(cropCorners.bottomLeft.y - cropCorners.topLeft.y) * scale;
    const cropRegion = {
      originX: Math.max(0, Math.round(cropOriginX)),
      originY: Math.max(0, Math.round(cropOriginY)),
      width: Math.max(1, Math.round(cropWidth)),
      height: Math.max(1, Math.round(cropHeight)),
    };
    console.log("Calculated Crop Region (Image Coords):", cropRegion);
    // --- End Coordinate Transformation ---

    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ crop: cropRegion }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      setCroppedUri(result.uri);

      // immediately save the cropped image
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        await MediaLibrary.createAssetAsync(result.uri);
        Alert.alert("Success", "Cropped image saved to your gallery.");
      } else {
        Alert.alert("Permission required", "Need permission to save cropped image.");
      }
    } catch (error) {
      console.error("Could not crop image:", error);
      Alert.alert("Error", "Failed to crop and save the image.");
    }
  };

  // always saves the original unedited picture
  const handleSaveOriginal = async () => {
    if (!uri) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Need permission to save images.");
      return;
    }

    try {

      const result = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG }
      );

      await MediaLibrary.createAssetAsync(result.uri);
      Alert.alert("Saved", "Original image saved to your gallery.");
    } catch (err) {
      console.error("Save failed:", err);
      Alert.alert("Error", "Could not save original image.");
    }
  };

  const cropImageView = () => (
    <SafeAreaView style={styles.container2}>
      {/* Container for the image and overlay */}
      <View style={styles.imageContainer}>
        {/* Display the background image */}
        <Image
          source={{ uri }}
          contentFit="cover"
          style={styles.image}                      // ← 9:16 aspect ratio
          onLayout={(e) => { displayedImageLayout.current = e.nativeEvent.layout; }}
          onError={(e) => Alert.alert("Error", "Failed to load image.")}
        />

        {/* Render the frame-only overlay, passing the callback */}
        <CropOverlayFrameOnly
          onLayoutChange={handleLayoutChange}
        // You can still pass initialCorners or styling props here if needed
        />
      </View>

      {/* Controls */}
      <View style={styles.buttonContainer}>
        <Button title="Crop Image" onPress={handleCrop} disabled={!cropCorners} />
        <Button title="Save Image" onPress={handleSaveOriginal} disabled={!uri} />
        <Button title="Back" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      {pictureTaken ? cropImageView() : renderCamera()}
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
    width: "100%",
    aspectRatio: 9 / 16,    // width:height = 9:16
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
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
  container2: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 9 / 16,    // match preview aspect ratio
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});