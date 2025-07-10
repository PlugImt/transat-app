import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import type React from "react";
import { Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";

export const HEADER_HEIGHT = 60;

type HeaderProps = {
  headerShown: SharedValue<number>;
  title?: string;
  goBack?: boolean;
  children?: React.ReactNode;
};

export function Header({ headerShown, title, goBack, children }: HeaderProps) {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            headerShown.value,
            [0, 1],
            [-HEADER_HEIGHT, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        headerShown.value,
        [0, 1],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <Animated.View
      style={[headerAnimatedStyle, { backgroundColor: theme.overlay }]}
      className="absolute top-0 left-0 right-0 z-10"
    >
      <Animated.View
        style={[contentAnimatedStyle, { height: HEADER_HEIGHT }]}
        className="flex flex-row justify-between items-center py-2.5 px-4 w-full"
      >
        {(goBack || title) && (
          <View className="flex flex-row items-center">
            {goBack && (
              <ArrowLeft
                color={theme.text}
                onPress={() => navigation.goBack()}
              />
            )}
            {title && (
              <Text className="h1 ml-4" style={{ color: theme.text }}>
                {title}
              </Text>
            )}
          </View>
        )}
        {children}
      </Animated.View>
    </Animated.View>
  );
}
