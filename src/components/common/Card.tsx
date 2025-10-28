import type React from "react";
import { TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

interface CardProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  onPress?: () => void;
  active?: boolean;
}

const Card = ({ children, className, onPress, active = false }: CardProps) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      className={cn("rounded-xl border-[1.5px] px-6 py-4 gap-4", className)}
      style={{ backgroundColor: theme.card, borderColor: active ? theme.primary : theme.border }}
      onPress={onPress}
      disabled={!onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Card;
