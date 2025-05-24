import { useTheme } from "@/contexts/ThemeContext";
import { Text, View } from "react-native";

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
          style={{ backgroundColor: theme.muted + "99" }}
          className="h-px rounded-full flex-1"
        />
        <Text
          style={{ color: theme.foreground + "99" }}
          className="text-sm mx-3"
        >
          {label}
        </Text>
        <View
          style={{ backgroundColor: theme.muted + "99" }}
          className="h-px rounded-full flex-1"
        />
      </View>
    );
  }

  return (
    <View
      style={{ backgroundColor: theme.muted + "99" }}
      className={`h-px rounded-full w-full my-2 ${className || ""}`}
    />
  );
}
