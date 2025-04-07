import CameraControls from "@/components/custom/realcampus/CameraControls";
import CustomCamera from "@/components/custom/realcampus/CustomCamera";
import MissingPermission from "@/components/custom/realcampus/MissingPermission";
import PhotoActionButtons from "@/components/custom/realcampus/PhotoActionButtons";
import { type CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RealCampus() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [secondPhotoUri, setSecondPhotoUri] = useState<string | null>(null);

  const [facing, setFacing] = useState<CameraType>("front");
  const [originalFacing, setOriginalFacing] = useState<CameraType>("front");
  const [swappedPhotos, setSwappedPhotos] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [timer, setTimer] = useState<number>(0);

  const cameraRef = useRef(null);

  const [zoomLevel, setZoomLevel] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (isLoading && timer === 0) {
      // Already flipped the camera during countdown, so we can take the second picture now.
      takeSecondPicture();
    }

    return () => clearInterval(interval);
  }, [isLoading, timer]);

  // Reset settings when returning to camera
  useEffect(() => {
    if (!photoUri) {
      setZoomLevel(0);
    }
  }, [photoUri]);

  useEffect(() => {
    // Request camera permissions on component mount.
    if (!permission?.granted) {
      requestPermission();
    }

    // Request media library permissions for saving photos.
    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }
  }, []);

  if (!permission || !mediaPermission) return <View />;
  if (!permission.granted) {
    return <MissingPermission requestPermission={requestPermission} />;
  }

  /**
   *
   */
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
        setIsLoading(true);
        setTimer(4);
        // Store original facing before flipping.
        setOriginalFacing(facing);
        // Flip camera immediately after taking first picture so user can see what will be captured.
        setFacing(facing === "front" ? "back" : "front");
      } catch (error) {
        console.error("Error taking picture:", error);
        alert("Failed to take picture. Please try again.");
      }
    }
  };

  /**
   *
   */
  const takeSecondPicture = async () => {
    if (cameraRef.current) {
      try {
        const secondPhoto = await cameraRef.current.takePictureAsync();
        setSecondPhotoUri(secondPhoto.uri);
        setIsLoading(false);
        // Return to original facing
        setFacing(originalFacing);
      } catch (error) {
        console.error("Error taking second picture:", error);
        alert("Failed to take second picture. Please try again.");
        resetCamera();
      }
    }
  };

  /**
   *
   */
  const toggleCamera = () => {
    setFacing((prev) => (prev === "front" ? "back" : "front"));
    setZoomLevel(0);
  };

  /**
   *
   */
  const resetCamera = () => {
    setPhotoUri(null);
    setSecondPhotoUri(null);
    setSwappedPhotos(false);
    setZoomLevel(0);
  };

  /**
   *
   */
  const toggleSwapPhotos = () => {
    setSwappedPhotos((prev) => !prev);
  };

  /**
   *
   */
  const sendPhotos = async () => {
    try {
      alert("Photos would be sent now");
    } catch (error) {
      console.error("Error sending photos:", error);
      alert("Failed to send photos");
    }
  };

  /**
   *
   */
  const savePicture = async () => {
    try {
      if (photoUri && secondPhotoUri && mediaPermission?.granted) {
        await MediaLibrary.saveToLibraryAsync(photoUri);
        await MediaLibrary.saveToLibraryAsync(secondPhotoUri);
        alert("Photos saved to gallery!");
      } else {
        alert("Permission not granted or no photo available.");
      }
    } catch (error) {
      console.error("Error saving photo:", error);
      alert("Failed to save photo");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center bg-black px-4 py-8">
        {photoUri && !isLoading && secondPhotoUri ? (
          <View className="w-full h-full items-center">
            <View className="relative w-full">
              {/* Main photo */}
              <Image
                source={{ uri: swappedPhotos ? secondPhotoUri : photoUri }}
                className="w-full h-full rounded-2xl"
                resizeMode="cover"
                style={{ width: "100%", height: 600, borderRadius: 20 }}
              />

              {/* Second photo */}
              <View
                style={{
                  position: "absolute",
                  zIndex: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  padding: 10,
                }}
              >
                <TouchableOpacity onPress={toggleSwapPhotos}>
                  <View
                    style={{
                      width: "100%",
                      borderWidth: 4,
                      borderColor: "white",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{
                        uri: swappedPhotos ? photoUri : secondPhotoUri,
                      }}
                      style={{
                        width: 120,
                        height: 160,
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <PhotoActionButtons
              onRetake={resetCamera}
              onSendPhotos={sendPhotos}
              onSavePicture={savePicture}
            />
          </View>
        ) : (
          <View className="w-full h-full items-center relative">
            <CustomCamera
              cameraRef={cameraRef}
              facing={facing}
              isLoading={isLoading}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              flash={"off"}
            />

            {isLoading && (
              <View className="absolute inset-0 bg-black/50 items-center justify-center">
                <Text className="text-white text-5xl font-bold">
                  {timer > 0 ? `${timer}s` : "Taking second photo..."}
                </Text>
              </View>
            )}

            <CameraControls
              onTakePicture={takePicture}
              onToggleCamera={toggleCamera}
              isLoading={isLoading}
            />
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}
