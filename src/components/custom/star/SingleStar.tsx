import { Star as LucidStar } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface SingleStarProps {
  index: number;
  isFilled: boolean;
  size: number;
  onPress?: (index: number) => void;
  disabled?: boolean;
}

export const SingleStar = ({
  index,
  isFilled,
  size,
  onPress,
  disabled,
}: SingleStarProps) => {
  const { theme } = useTheme();
  const isDisabled = disabled || !onPress;

  const getStarColors = (isFilled: boolean) => {
    const colors = {
      filled: {
        color: theme.primary,
        fillColor: theme.primary,
      },
      empty: {
        color: theme.muted,
        fillColor: theme.muted,
      },
    };

    if (disabled) return colors.empty;
    return isFilled ? colors.filled : colors.empty;
  };

  const { color, fillColor } = getStarColors(isFilled);

  const handlePress = () => {
    if (!isDisabled) {
      onPress(index);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={isDisabled}>
      <LucidStar
        size={size}
        color={color}
        fill={isFilled ? fillColor : "transparent"}
      />
    </TouchableOpacity>
  );
};
