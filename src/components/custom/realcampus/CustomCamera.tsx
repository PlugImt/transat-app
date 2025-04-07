import { CameraView, type FlashMode } from "expo-camera";
import { useRef } from "react";
import { Text, View } from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";

interface CustomCameraProps {
  cameraRef: any;
  facing: "front" | "back";
  isLoading: boolean;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  flash: FlashMode;
}

export default function CustomCamera({
  cameraRef,
  facing,
  isLoading,
  zoomLevel,
  setZoomLevel,
  flash,
}: CustomCameraProps) {
  // baseZoom stores the starting zoom level for the pinch gesture.
  const baseZoom = useRef<number>(0);
  const maxZoom = 0.3;

  // Update zoom continuously as the gesture changes.
  const handlePinchGesture = (event: any) => {
    const scale = event.nativeEvent.scale;

    let newZoom = baseZoom.current + (scale - 1) * 0.25;
    newZoom = Math.max(0, Math.min(newZoom, maxZoom));
    setZoomLevel(newZoom);
  };

  const onPinchHandlerStateChange = () => {
    baseZoom.current = zoomLevel;
  };

  return (
    <PinchGestureHandler
      onGestureEvent={handlePinchGesture}
      onHandlerStateChange={onPinchHandlerStateChange}
    >
      <View
        style={{
          width: "100%",
          height: 600,
          overflow: "hidden",
          borderRadius: 20,
        }}
      >
        <CameraView
          ref={cameraRef}
          style={{ width: "100%", height: 600 }}
          facing={facing}
          zoom={zoomLevel}
          flash={flash}
        />

        {/* Zoom indicator */}
        {!isLoading && zoomLevel > 0 && (
          <View
            style={{
              position: "absolute",
              bottom: 20,
              alignSelf: "center",
              backgroundColor: "rgba(0,0,0,0.6)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              {Math.round((zoomLevel / maxZoom) * 100)}%
            </Text>
          </View>
        )}
      </View>
    </PinchGestureHandler>
  );
}
