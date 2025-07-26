import { ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text as NativeText, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { type ThemeColorKeys, useTheme } from "@/contexts/ThemeContext";
import Image from "../common/Image";

interface UserStackProps {
  pictures: string[];
  count: number;
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
  borderColor = "destructive",
}: UserStackProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const sizeProps = size === "default" ? 32 : 24;

  const imageProps = {
    radius: "round" as const,
    size: sizeProps,
    style: {
      borderWidth: 1,
      borderColor: theme[borderColor],
    },
  };

  const countMax = count - max > 100 ? "99" : count - max;

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
        {count > max && (
          <View
            className="bg-black items-center justify-center rounded-full relative -ml-2"
            style={{ width: sizeProps, height: sizeProps }}
          >
            <Image source={pictures[max]} {...imageProps} />
            <View className="absolute inset-0 bg-black/50 rounded-full" />
            <NativeText className="text-white text-sm font-medium absolute inset-x-0 text-center">{`+${countMax}`}</NativeText>
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
