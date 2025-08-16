import { Minus, Plus } from 'lucide-react-native';
import { TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useBassineDecrement, useBassineIncrement } from '@/hooks/services/bassine/useBassine';

export interface BassineButtonIncrementProps {
  type: "plus" | "minus";
  currentScore?: number;
}

const BassineButtonIncrement = ({ type, currentScore }: BassineButtonIncrementProps) => {
  const { theme } = useTheme();
  const isPlus = type === "plus";

  const { mutate: increment, isPending: isIncPending } = useBassineIncrement();
  const { mutate: decrement, isPending: isDecPending } = useBassineDecrement();

  const isMinusDisabledByScore = !isPlus && ((currentScore ?? 0) <= 0);
  const isPending = isIncPending || isDecPending;
  const disabled = isMinusDisabledByScore || isPending;

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
      className={`flex-row items-center rounded-xl justify-center gap-1.5 p-2 ${disabled ? 'bg-gray-200' : 'bg-gray-300'}`}
      onPress={onPress}
      disabled={disabled}
    >
      {isPlus ? (
        <Plus size={24} color={theme.text}/>
      ) : (
        <Minus size={24} color={isMinusDisabledByScore ? theme.muted : theme.text}/>
      )}
    </TouchableOpacity>
  );
};

export default BassineButtonIncrement;
