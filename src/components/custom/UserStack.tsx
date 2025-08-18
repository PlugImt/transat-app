import { ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text as NativeText, TouchableOpacity, View } from "react-native";
import { Avatar } from "@/components/common";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import ImageSkeleton from "@/components/Skeleton/ImageSkeleton";
import { type ThemeColorKeys, useTheme } from "@/contexts/ThemeContext";
import type { User } from "@/dto";
import { cn } from "@/utils/class.utils";

const MAX_COUNT = 100;

interface UserStackProps {
  users?: User[];
  count?: number;
  max?: number;
  size?: "default" | "sm";
  onPress?: () => void;
  borderColor?: ThemeColorKeys;
  moreText?: string;
  moreTextColor?: ThemeColorKeys;
}

export const UserStack = ({
  users = [],
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

  if (!users?.length) return null;

  const sizeProps = size === "default" ? 32 : 24;
  const imageProps = {
    size: sizeProps,
    style: {
      borderWidth: 1,
      borderColor: theme[borderColor],
    },
  };

  const displayedPictures = users.slice(0, max);
  const hasOverflow = count && count > users.length;
  const overflowCount = hasOverflow
    ? Math.min(count - users.length, MAX_COUNT)
    : 0;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View className="flex-row ml-2">
        {displayedPictures.map((user, index) => (
          <Avatar
            user={user}
            key={`${user.profile_picture}-${index}`}
            className="-ml-2"
            {...imageProps}
          />
        ))}

        {hasOverflow && (
          <View
            className="bg-black items-center justify-center rounded-full relative -ml-2"
            style={{ width: sizeProps, height: sizeProps }}
          >
            <Avatar
              user={{
                first_name: "",
                last_name: "",
                profile_picture: users[users.length - 1].profile_picture,
              }}
              {...imageProps}
            />
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

      {moreText && count && (
        <View className="flex-row items-center">
          <Text variant="sm" color={moreTextColor}>
            {t(moreText, { count })}
          </Text>
          {onPress && <ChevronRight color={theme.text} size={16} />}
        </View>
      )}
    </TouchableOpacity>
  );
};

interface UserStackSkeletonProps {
  size?: "default" | "sm";
  max?: number;
  borderColor?: ThemeColorKeys;
  moreText?: boolean;
}

export const UserStackSkeleton = ({
  size = "default",
  max = 3,
  borderColor = "background",
  moreText = false,
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
      {moreText && <TextSkeleton variant="sm" />}
    </View>
  );
};
