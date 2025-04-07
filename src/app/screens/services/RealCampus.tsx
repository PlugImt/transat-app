import { type CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Camera, RefreshCw } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function RealCampus() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [secondPhotoUri, setSecondPhotoUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("front");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [originalFacing, setOriginalFacing] = useState<CameraType>("front");
  const cameraRef = useRef(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (isLoading && timer === 0) {
      // Store original facing before flipping
      setOriginalFacing(facing);
      // Flip camera to opposite orientation
      setFacing(facing === "front" ? "back" : "front");

      // Small delay to ensure camera has switched
      setTimeout(() => {
        takeSecondPicture();
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isLoading, timer]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-center text-lg mb-4">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={requestPermission}
        >
          <Text className="text-white text-base font-semibold">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
      setIsLoading(true);
      setTimer(2);
    }
  };

  const takeSecondPicture = async () => {
    if (cameraRef.current) {
      const secondPhoto = await cameraRef.current.takePictureAsync();
      setSecondPhotoUri(secondPhoto.uri);
      setIsLoading(false);
      // Return to original facing
      setFacing(originalFacing);
    }
  };

  const toggleCamera = () => {
    setFacing((prev) => (prev === "front" ? "back" : "front"));
  };

  const resetCamera = () => {
    setPhotoUri(null);
    setSecondPhotoUri(null);
  };

  return (
    <View className="flex-1 items-center justify-center bg-black px-4 py-8">
      {photoUri && !isLoading && secondPhotoUri ? (
        <View className="w-full h-full items-center">
          <View className="relative w-full h-4/5">
            <Image
              source={{ uri: photoUri }}
              className="w-full h-full rounded-xl"
              resizeMode="cover"
            />

            {/* Second picture in the left corner with border */}
            <View className="absolute bottom-4 left-4 border-4 border-white rounded-lg overflow-hidden shadow-lg">
              <Image
                source={{ uri: secondPhotoUri }}
                className="w-32 h-40"
                resizeMode="cover"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={resetCamera}
            className="bg-red-500 mt-4 px-6 py-3 rounded-full"
          >
            <Text className="text-white text-lg font-semibold">Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="w-full h-full items-center relative">
          {/* Back Button */}
          <TouchableOpacity
            className="absolute top-0 left-0 p-3 z-10"
            onPress={() => {}}
          >
            <Text className="text-white text-lg">← Back</Text>
          </TouchableOpacity>

          {/* Camera with increased height */}
          <CameraView
            ref={cameraRef}
            style={{
              width: "100%",
              height: 600,
              borderRadius: 20,
              overflow: "hidden",
            }}
            facing={facing}
          />

          {isLoading && (
            <View className="absolute inset-0 bg-black/50 items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                Loading... {timer}s
              </Text>
            </View>
          )}

          {/* Controls */}
          <View className="w-full mt-4 flex-row justify-center gap-6">
            <TouchableOpacity
              onPress={takePicture}
              className="bg-green-600 p-4 rounded-full flex items-center justify-center"
              disabled={isLoading}
            >
              <Camera size={32} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleCamera}
              className="bg-yellow-500 p-4 rounded-full flex items-center justify-center"
              disabled={isLoading}
            >
              <RefreshCw size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
