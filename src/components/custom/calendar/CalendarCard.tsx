import { TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

interface CardProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  onPress?: () => void;
  backgroundColor?: string;
  borderColor?: string;
}

const CalendarCard = ({
  children,
  className,
  onPress,
  backgroundColor,
  borderColor,
}: CardProps) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      className={cn("rounded-xl border-[1.5px] px-5 py-3 gap-4", className)}
      style={{
        backgroundColor: backgroundColor || theme.card,
        borderColor: borderColor || theme.border,
      }}
      onPress={onPress}
      disabled={!onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default CalendarCard;
