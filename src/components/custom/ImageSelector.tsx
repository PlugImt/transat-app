import { Image as ImageIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import Image from "@/components/common/Image";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/class.utils";

interface ImageSelectorProps {
  imageUrl?: string;
  onImageSelect: () => void;
  isUploading?: boolean;
  title?: string;
  placeholder?: string;
  uploadingText?: string;
  size?: number;
  aspectRatio?: "square" | "video" | "custom";
  className?: string;
  disabled?: boolean;
}

export const ImageSelector = ({
  imageUrl,
  onImageSelect,
  isUploading = false,
  title,
  placeholder,
  uploadingText,
  size = 200,
  aspectRatio = "video",
  className,
  disabled = false,
}: ImageSelectorProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const placeholderText = placeholder || t("common.imageSelector.placeholder");
  const uploadingTextText =
    uploadingText || t("common.imageSelector.uploading");

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    custom: "",
  };

  const aspectRatioClass = aspectRatioClasses[aspectRatio];

  return (
    <View className={cn("gap-1.5", className)}>
      {title && (
        <Text variant="sm" className="h3" color="muted">
          {title}
        </Text>
      )}
      <TouchableOpacity
        onPress={onImageSelect}
        className="relative"
        disabled={disabled || isUploading}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            size={size}
            radius={12}
            className={cn("w-full", aspectRatioClass)}
          />
        ) : (
          <View
            className={cn(
              "border-2 border-dashed rounded-xl p-6 items-center justify-center gap-2",
              aspectRatioClass,
            )}
            style={{
              borderColor: theme.muted,
              width: size,
              height: size,
            }}
          >
            <ImageIcon size={48} color={theme.muted} />
            <Text color="muted" className="text-center">
              {isUploading ? uploadingTextText : placeholderText}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
