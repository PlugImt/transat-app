import { ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text as NativeText, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { type ThemeColorKeys, useTheme } from "@/contexts/ThemeContext";
import Image from "../common/Image";
import { TextSkeleton } from "../Skeleton";
import ImageSkeleton from "../Skeleton/ImageSkeleton";

const MAX_COUNT = 100;

const getImageProps = (size: "default" | "sm", borderColor: string) => {
  const sizeProps = size === "default" ? 32 : 24;
  return {
    radius: 9999,
    size: sizeProps,
    style: {
      borderWidth: 1,
      borderColor,
    },
  };
};

interface UserStackProps {
  pictures?: string[];
  count?: number;
  max?: number;
  size?: "default" | "sm";
  onPress?: () => void;
  borderColor?: ThemeColorKeys;
}

export const UserStack = ({
  pictures,
  max = 3,
  size = "default",
  onPress,
  count,
  borderColor = "background",
}: UserStackProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const sizeProps = size === "default" ? 32 : 24;

  const imageProps = getImageProps(size, theme[borderColor]);

  if (!pictures || pictures.length === 0) {
    return null;
  }

  return (
    <View className="gap-2">
      <View className="flex-row ml-2">
        {pictures.slice(0, max).map((picture) => (
          <Image
            source={picture}
            key={picture}
            className="-ml-2"
            {...imageProps}
          />
        ))}
        {count && count > max && (
          <View
            className="bg-black items-center justify-center rounded-full relative -ml-2"
            style={{ width: sizeProps, height: sizeProps }}
          >
            <Image source={pictures[max]} {...imageProps} />
            <View
              className="absolute inset-0 bg-black/50 rounded-full"
              style={{ ...imageProps.style }}
            />
            <NativeText className="text-white text-sm font-medium absolute inset-x-0 text-center">{`+${count - max > MAX_COUNT ? MAX_COUNT : count - max}`}</NativeText>
          </View>
        )}
      </View>

      {count && (
        <TouchableOpacity
          className="flex-row items-center"
          onPress={onPress}
          disabled={!onPress}
        >
          <Text variant="sm">{t("services.clubs.interested", { count })}</Text>
          {onPress && <ChevronRight color={theme.text} size={16} />}
        </TouchableOpacity>
      )}
    </View>
  );
};

interface UserStackSkeletonProps {
  size?: "default" | "sm";
  max?: number;
  borderColor?: ThemeColorKeys;
}

export const UserStackSkeleton = ({
  size = "default",
  max = 3,
  borderColor = "background",
}: UserStackSkeletonProps) => {
  const { theme } = useTheme();

  const imageProps = getImageProps(size, theme[borderColor]);

  return (
    <View className="gap-2">
      <View className="flex-row ml-2">
        {Array.from({ length: max }).map((_, index) => (
          <View
            key={`user-stack-skeleton-${index.toString()}`}
            className="-ml-2"
          >
            <ImageSkeleton {...imageProps} />
          </View>
        ))}
      </View>
      <TextSkeleton variant="sm" />
    </View>
  );
};
