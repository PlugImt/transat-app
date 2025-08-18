import { ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text as NativeText, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { type ThemeColorKeys, useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/class.utils";
import Image from "../common/Image";
import { TextSkeleton } from "../Skeleton";
import ImageSkeleton from "../Skeleton/ImageSkeleton";

const MAX_COUNT = 100;

interface UserStackProps {
  pictures?: string[];
  count?: number;
  max?: number;
  size?: "default" | "sm";
  onPress?: () => void;
  borderColor?: ThemeColorKeys;
  moreText?: string;
  moreTextColor?: ThemeColorKeys;
}

export const UserStack = ({
  pictures = [],
  max = 3,
  size = "default",
  onPress,
  count,
  borderColor = "background",
  moreText,
  moreTextColor = "text",
}: UserStackProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (!pictures?.length) return null;

  const sizeProps = size === "default" ? 32 : 24;
  const imageProps = {
    radius: 9999,
    size: sizeProps,
    style: {
      borderWidth: 1,
      borderColor: theme[borderColor],
    },
  };

  const displayedPictures = pictures.slice(0, max);
  const hasOverflow = count && count > pictures.length;
  const overflowCount = hasOverflow
    ? Math.min(count - pictures.length, MAX_COUNT)
    : 0;

  const ImagesRow = (
    <>
      {displayedPictures.map((picture) => (
        <Image
          source={picture}
          key={picture}
          className="-ml-2"
          {...imageProps}
        />
      ))}

      {hasOverflow && (
        <View
          className="bg-black items-center justify-center rounded-full relative -ml-2"
          style={{ width: sizeProps, height: sizeProps }}
        >
          <Image source={pictures[pictures.length - 1]} {...imageProps} />
          <View
            className="absolute inset-0 bg-black/50 rounded-full"
            style={{ ...imageProps.style }}
          />
          <NativeText className="text-white text-sm font-medium absolute inset-x-0 text-center">
            +{overflowCount}
          </NativeText>
        </View>
      )}
    </>
  );

  return (
    <View>
      {onPress ? (
        <TouchableOpacity
          className="flex-row ml-2"
          onPress={onPress}
          disabled={!onPress}
        >
          {displayedPictures.map((picture) => (
            <Image
              source={picture}
              key={picture}
              className="-ml-2"
              {...imageProps}
            />
          ))}

          {hasOverflow && (
            <View
              className="bg-black items-center justify-center rounded-full relative -ml-2"
              style={{ width: sizeProps, height: sizeProps }}
            >
              <Image source={pictures[pictures.length - 1]} {...imageProps} />
              <View
                className="absolute inset-0 bg-black/50 rounded-full"
                style={{ ...imageProps.style }}
              />
              <NativeText
                className={cn(
                  "text-white font-medium absolute inset-x-0 text-center",
                  size === "sm" ? "text-xs" : "text-sm",
                )}
              >
                +{overflowCount}
              </NativeText>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View className="flex-row ml-2">
          {displayedPictures.map((picture) => (
            <Image
              source={picture}
              key={picture}
              className="-ml-2"
              {...imageProps}
            />
          ))}

          {hasOverflow && (
            <View
              className="bg-black items-center justify-center rounded-full relative -ml-2"
              style={{ width: sizeProps, height: sizeProps }}
            >
              <Image source={pictures[pictures.length - 1]} {...imageProps} />
              <View
                className="absolute inset-0 bg-black/50 rounded-full"
                style={{ ...imageProps.style }}
              />
              <NativeText
                className={cn(
                  "text-white font-medium absolute inset-x-0 text-center",
                  size === "sm" ? "text-xs" : "text-sm",
                )}
              >
                +{overflowCount}
              </NativeText>
            </View>
          )}
        </View>
      )}

      {moreText && count && (
        <TouchableOpacity
          className="flex-row items-center"
          onPress={onPress}
          disabled={!onPress}
        >
          <Text variant="sm" color={moreTextColor}>
            {t(moreText, { count })}
          </Text>
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
  const sizeProps = size === "default" ? 32 : 24;

  const imageProps = {
    radius: 9999,
    size: sizeProps,
    style: {
      borderWidth: 1,
      borderColor: theme[borderColor],
    },
  };

  return (
    <View>
      <View className="flex-row ml-2">
        {Array.from({ length: max }).map((_, index) => (
          <View
            key={`user-stack-skeleton-${index.toString()}-${size}-${max}`}
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
