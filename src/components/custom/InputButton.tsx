import type { LucideIcon } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

interface InputButtonProps {
  Icon: LucideIcon;
  label?: string;
  placeholder: string;
  value?: string;
  error?: string;
  onPress: () => void;
}

export const InputButton = ({
  Icon,
  label,
  placeholder,
  value,
  error,
  onPress,
}: InputButtonProps) => {
  const { theme } = useTheme();

  const inputContainerStyle = {
    backgroundColor: theme.input,
    borderColor: error ? theme.destructive : "transparent",
    borderWidth: error ? 1 : 0,
  };

  return (
    <View className="gap-1.5 flex-1">
      {label && (
        <Text variant="sm" color="muted">
          {label}
        </Text>
      )}
      <TouchableOpacity
        className="px-4 rounded-lg h-12 flex-row items-center gap-2"
        style={inputContainerStyle}
        onPress={onPress}
      >
        <Icon size={16} color={theme.muted} />
        <Text variant="sm" color={value ? "text" : "muted"}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
