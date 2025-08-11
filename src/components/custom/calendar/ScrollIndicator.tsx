import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ScrollIndicatorProps {
  side: "left" | "right";
  onPress?: (side: "left" | "right") => void;
}

export const ScrollIndicator = ({ side, onPress }: ScrollIndicatorProps) => {
  const { theme } = useTheme();

  const handlePress = async () => {
    if (onPress) {
      onPress(side);
    }
  };

  return (
    <>
      <LinearGradient
        pointerEvents="none"
        colors={
          side === "left"
            ? [theme.card, `${theme.card}00`]
            : [`${theme.card}00`, theme.card]
        }
        locations={[0, 1]}
        style={{
          position: "absolute",
          left: side === "left" ? 0 : undefined,
          right: side === "left" ? undefined : -10,
          top: 0,
          bottom: 0,
          width: 80,
          zIndex: 5,
          transform: [{ rotate: "270deg" }],
        }}
      />

      <View
        style={{
          position: "absolute",
          left: side === "left" ? 8 : undefined,
          right: side === "left" ? undefined : 8,
          top: 0,
          bottom: 0,
          justifyContent: "center",
          zIndex: 10,
        }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={handlePress}
          accessibilityRole="button"
          activeOpacity={0.8}
          style={{
            borderRadius: 9999,
            overflow: "hidden",
          }}
        >
          {side === "left" ? (
            <ChevronLeft size={25} color={theme.text} />
          ) : (
            <ChevronRight size={25} color={theme.text} />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};
