import { useTheme } from "@/themes/useThemeProvider";
import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

export const SettingsItem = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
}: Props) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between py-4"
      onPress={() => onPress?.()}
    >
      <View className="flex-row items-center gap-3">
        <View className="w-8">{icon}</View>
        <View>
          <Text className="text-foreground">{title}</Text>
          {subtitle && (
            <Text className="text-sm text-foreground/60">{subtitle}</Text>
          )}
        </View>
      </View>
      <View className="flex-row items-center">
        {rightElement}
        {onPress && <ChevronRight size={20} color={theme.primary} />}
      </View>
    </TouchableOpacity>
  );
};

export default SettingsItem;
