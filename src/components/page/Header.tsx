import { useNavigation } from "@react-navigation/native";
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

export const HEADER_HEIGHT = 60;

type HeaderProps = {
  headerShown: SharedValue<number>;
  title?: string | ReactNode;
  goBack?: boolean;
  children?: React.ReactNode;
};

export function Header({ headerShown, title, goBack, children }: HeaderProps) {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    // If goBack is true, the header is not shown (here to compute the value every time)
    const sharedValue = !goBack ? (headerShown.value ?? 1) : 1;
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
    // If goBack is true, the header is not shown (here to compute the value every time)
    const sharedValue = !goBack ? (headerShown.value ?? 1) : 1;
    return {
      opacity: interpolate(sharedValue, [0, 1], [0, 1], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      style={[headerAnimatedStyle, { backgroundColor: theme.overlay }]}
      className="absolute top-0 left-0 right-0 z-10"
    >
      <Animated.View
        style={[contentAnimatedStyle, { height: HEADER_HEIGHT }]}
        className="flex flex-row justify-between items-center py-2.5 px-4 w-full flex-1"
      >
        <View className="flex flex-row items-center flex-1">
          {(goBack || title) && (
            <View className="flex flex-row items-center flex-1">
              {goBack && (
                <ArrowLeft
                  color={theme.text}
                  onPress={() => navigation.goBack()}
                />
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
