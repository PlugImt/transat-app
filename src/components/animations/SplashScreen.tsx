import { MotiView } from "moti";
import { Image, View } from "react-native";
import Logo from "@/assets/images/icon.png";
import { useTheme } from "@/contexts/ThemeContext";

export const SplashScreen = () => {
  const { theme } = useTheme();
  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: theme.background }}
    >
      <MotiView
        from={{ scale: 1 }}
        animate={{ scale: 1.25 }}
        transition={{
          type: "timing",
          duration: 1000,
          loop: true,
          repeatReverse: true,
        }}
        className="w-[135px] h-[135px]"
      >
        <Image source={Logo} className="w-full h-full" />
      </MotiView>
    </View>
  );
};
