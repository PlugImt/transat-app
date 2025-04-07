import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MissingPermissionProps {
  requestPermission: () => void;
}

export default function MissingPermission({
  requestPermission,
}: MissingPermissionProps) {
  return (
    <View className="flex-1 items-center justify-center px-4">
      <Text className="text-center text-lg mb-4">
        We need your permission to show the camera.
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
