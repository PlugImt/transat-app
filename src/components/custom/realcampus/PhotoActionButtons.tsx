import { IconButton } from "@/components/common/Button";
import { Save, Send, Trash2 } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

interface PhotoActionButtonsProps {
  onRetake: () => void;
  onSendPhotos: () => void;
  onSavePicture: () => void;
}

export default function PhotoActionButtons({
  onRetake,
  onSendPhotos,
  onSavePicture,
}: PhotoActionButtonsProps) {
  return (
    <View
      style={{
        width: "100%",
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <IconButton
        icon={<Trash2 size={32} color="white" />}
        onPress={onRetake}
      />

      <IconButton
        icon={<Send size={32} color="white" />}
        onPress={onSendPhotos}
      />

      <IconButton
        icon={<Save size={32} color="white" />}
        onPress={onSavePicture}
      />
    </View>
  );
}
