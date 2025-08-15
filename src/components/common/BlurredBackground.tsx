import { StyleSheet, View } from "react-native";
import Image from "@/components/common/Image";
import { useTheme } from "@/contexts/ThemeContext";

interface BlurredBackgroundProps {
  picture: string;
  blurIntensity?: number;
}

export const BlurredBackground = ({
  picture,
  blurIntensity = 70,
}: BlurredBackgroundProps) => {
  const { actualTheme } = useTheme();

  // biome-ignore lint/suspicious/noExplicitAny: to be replaced with proper type
  let BlurViewComp: any = null;
  try {
    BlurViewComp = require("expo-blur").BlurView;
  } catch (_e) {
    BlurViewComp = null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={picture}
        fill
        resizeMode="cover"
        blurRadius={40}
        radius={0}
        style={{ opacity: 0.3 }}
      />
      {BlurViewComp ? (
        <BlurViewComp
          intensity={blurIntensity}
          tint={actualTheme}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
    </View>
  );
};
