import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import type React from "react";
import type { ReactNode } from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { TabRoute } from "@/types";

export const HEADER_HEIGHT = 60;

type HeaderProps = {
  headerShown: SharedValue<number>;
  title?: string | ReactNode;
  children?: React.ReactNode;
  onBack?: () => void;
  backgroundColor?: string;
};

export function Header({
  headerShown,
  title,
  children,
  onBack,
  backgroundColor,
}: HeaderProps) {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const route = useRoute();
  const canGoBack =
    onBack || !Object.values(TabRoute).includes(route.name as TabRoute);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    // If canGoBack is true, the header is not shown (here to compute the value every time)
    const sharedValue = !canGoBack ? (headerShown.value ?? 1) : 1;
    return {
      transform: [
        {
          translateY: interpolate(
            sharedValue,
            [0, 1],
            [-HEADER_HEIGHT, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    // If canGoBack is true, the header is not shown (here to compute the value every time)
    const sharedValue = !canGoBack ? (headerShown.value ?? 1) : 1;
    return {
      opacity: interpolate(sharedValue, [0, 1], [0, 1], Extrapolation.CLAMP),
    };
  });

  if (!title) {
    return null;
  }

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <Animated.View
      style={[
        headerAnimatedStyle,
        { backgroundColor: backgroundColor || theme.overlay },
      ]}
      className="absolute top-0 left-0 right-0 z-10"
    >
      <Animated.View
        style={[contentAnimatedStyle, { height: HEADER_HEIGHT }]}
        className="flex flex-row justify-between items-center py-2.5 px-4 w-full flex-1"
      >
        <View className="flex flex-row items-center flex-1">
          {(canGoBack || title) && (
            <View className="flex flex-row items-center flex-1">
              {canGoBack && (
                <ArrowLeft color={theme.text} onPress={handleBack} />
              )}
              {title && (
                <Text variant="h1" className="ml-4 flex-1" numberOfLines={1}>
                  {title}
                </Text>
              )}
            </View>
          )}
        </View>
        {children}
      </Animated.View>
    </Animated.View>
  );
}
