import { Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface DividerProps {
  label?: string;
  className?: string;
}

export default function Divider({ label, className }: DividerProps) {
  const { theme } = useTheme();

  if (label) {
    return (
      <View className="flex-row items-center">
        <View
          style={{ backgroundColor: theme.border }}
          className="h-px rounded-full flex-1"
        />
        <Text style={{ color: theme.textSecondary }} className="text-sm mx-3">
          {label}
        </Text>
        <View
          style={{ backgroundColor: theme.border }}
          className="h-px rounded-full flex-1"
        />
      </View>
    );
  }

  return (
    <View
      style={{ backgroundColor: theme.border }}
      className={`h-px rounded-full w-full my-2 ${className || ""}`}
    />
  );
}
