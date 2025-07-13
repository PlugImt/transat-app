import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider = ({ label, className }: DividerProps) => {
  const { theme } = useTheme();

  if (label) {
    return (
      <View className="flex-row items-center">
        <View
          style={{ backgroundColor: theme.border }}
          className="h-px rounded-full flex-1"
        />
        <Text className="mx-3" color="muted" variant="sm">
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
};
