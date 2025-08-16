import { Minus, Plus } from "lucide-react-native";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  useBassineDecrement,
  useBassineIncrement,
} from "@/hooks/services/bassine/useBassine";

export interface BassineButtonIncrementProps {
  type: "plus" | "minus";
  currentScore?: number;
}

const BassineButtonIncrement = ({
  type,
  currentScore,
}: BassineButtonIncrementProps) => {
  const { theme } = useTheme();
  const isPlus = type === "plus";

  const { mutate: increment, isPending: isIncPending } = useBassineIncrement();
  const { mutate: decrement, isPending: isDecPending } = useBassineDecrement();

  const isMinusDisabledByScore = !isPlus && (currentScore ?? 0) <= 0;
  const isLoading = isPlus ? isIncPending : isDecPending;
  const disabled = isMinusDisabledByScore || isIncPending || isDecPending;

  const onPress = () => {
    if (disabled) return;
    if (isPlus) {
      increment();
    } else {
      decrement();
    }
  };

  return (
    <TouchableOpacity
      className="items-center justify-center"
      onPress={onPress}
      accessibilityRole="button"
      disabled={disabled}
      style={{
        backgroundColor: disabled
          ? theme.input
          : isPlus
            ? theme.primary
            : theme.secondary,
        width: 48,
        height: 48,
        borderRadius: 24,
        opacity: disabled ? 0.9 : 1,
      }}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={isPlus ? theme.primaryText : theme.secondaryText}
        />
      ) : isPlus ? (
        <Plus size={24} color={disabled ? theme.muted : theme.primaryText} />
      ) : (
        <Minus size={24} color={disabled ? theme.muted : theme.secondaryText} />
      )}
    </TouchableOpacity>
  );
};

export default BassineButtonIncrement;
