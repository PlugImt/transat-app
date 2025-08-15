import { StyleSheet, View } from "react-native";
import Image from "@/components/common/Image";
import { useTheme } from "@/contexts/ThemeContext";

interface BlurredBackgroundProps {
  picture: string;
}

export const BlurredBackground = ({ picture }: BlurredBackgroundProps) => {
  const { actualTheme } = useTheme();

  let BlurViewComp: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    BlurViewComp = require("expo-blur").BlurView;
  } catch (e) {
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
          intensity={70}
          tint={actualTheme}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
    </View>
  );
};
