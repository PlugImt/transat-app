import { IconButton } from "@/components/common/Button";
import { Camera, RefreshCw } from "lucide-react-native";
import { View } from "react-native";

export default function CameraControls({
  onTakePicture,
  onToggleCamera,
  isLoading,
}: {
  onTakePicture: () => void;
  onToggleCamera: () => void;
  isLoading: boolean;
}) {
  return (
    <View className="w-full mt-4 flex-row justify-center gap-6">
      <IconButton
        icon={<Camera size={32} color="white" />}
        onPress={onTakePicture}
        disabled={isLoading}
      />
      <IconButton
        icon={<RefreshCw size={32} color="white" />}
        onPress={onToggleCamera}
        disabled={isLoading}
      />
    </View>
  );
}
