import { Image as ImageIcon, Trash } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import Image from "@/components/common/Image";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/class.utils";
import { IconButton } from "../common/Button";

interface ImageSelectorProps {
  imageUrl?: string;
  onImageSelect: () => void;
  onImageRemove?: () => void;
  isUploading?: boolean;
  title?: string;
  placeholder?: string;
  uploadingText?: string;
  size?: number;
  aspectRatio?: "square" | "video" | "banner" | "custom";
  className?: string;
  disabled?: boolean;
}

export const ImageSelector = ({
  imageUrl,
  onImageSelect,
  onImageRemove,
  isUploading = false,
  title,
  placeholder,
  uploadingText,
  size = 200,
  aspectRatio = "square",
  className,
  disabled = false,
}: ImageSelectorProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const placeholderText = placeholder || t("common.imageSelector.placeholder");
  const uploadingTextText =
    uploadingText || t("common.imageSelector.uploading");

  const aspectRatioClasses = {
    square: 1,
    video: 16 / 9,
    banner: 3 / 1,
    custom: undefined as number | undefined,
  };
  const computedRatio = aspectRatioClasses[aspectRatio];

  return (
    <View className={cn("gap-1.5", className)}>
      {title && (
        <Text variant="sm" className="h3" color="muted">
          {title}
        </Text>
      )}
      <TouchableOpacity
        onPress={onImageSelect}
        className={cn("relative overflow-hidden rounded-xl w-full")}
        style={
          aspectRatio === "square"
            ? { width: size, height: size }
            : { width: "100%", aspectRatio: computedRatio ?? 16 / 9 }
        }
        disabled={disabled || isUploading}
      >
        {imageUrl ? (
          <>
            <Image source={imageUrl} radius={12} fill resizeMode="cover" />
            {onImageRemove && (
              <IconButton
                icon={<Trash />}
                onPress={onImageRemove}
                className="absolute top-2 right-2"
                variant="link"
                size="sm"
              />
            )}
          </>
        ) : (
          <View
            className={cn(
              "border-2 border-dashed rounded-xl p-6 items-center justify-center gap-2 h-full w-full",
            )}
            style={{
              borderColor: theme.muted,
            }}
          >
            <ImageIcon size={48} color={theme.muted} />
            <View className="flex-row items-center gap-2">
              <Text color="muted" className="text-center">
                {isUploading ? uploadingTextText : placeholderText}
              </Text>
              {isUploading && (
                <ActivityIndicator size="small" color={theme.primary} />
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
