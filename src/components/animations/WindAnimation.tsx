import { MotiView } from "moti";
import { useWindowDimensions, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

const WIND_COUNT = 10;
const windYPositions = Array.from(
  { length: WIND_COUNT },
  (_, i) => 20 + i * 12 + Math.random() * 10,
);

const WindPattern = ({ index, fixedY }: { index: number; fixedY: number }) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const opacity = Math.random() * 0.3 + 0.2;
  const duration = Math.random() * 3000 + 2000;

  return (
    <MotiView
      key={`wind-${index}`}
      from={{
        translateX: -40,
        translateY: fixedY,
        opacity,
      }}
      animate={{
        translateX: width + 40,
        translateY: fixedY,
        opacity,
      }}
      transition={{
        type: "timing",
        duration,
        loop: true,
        repeatReverse: false,
      }}
      style={{
        position: "absolute",
        width: 40,
        height: 3,
        backgroundColor: theme.primary,
        borderRadius: 5,
      }}
    />
  );
};

const WindAnimation = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        opacity: 0.3,
      }}
    >
      {windYPositions.map((fixedY, i) => (
        <WindPattern key={fixedY.toString()} index={i} fixedY={fixedY} />
      ))}
    </View>
  );
};

export default WindAnimation;
