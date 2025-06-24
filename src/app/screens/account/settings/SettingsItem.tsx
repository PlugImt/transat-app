import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  icon?: React.ReactNode;
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
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between py-4"
      onPress={() => onPress?.()}
    >
      <View className="flex-row items-center gap-3">
        {icon}
        <View className="ml-2.5">
          <Text style={{ color: theme.text }}>{title}</Text>
          {subtitle && (
            <Text
              style={{ color: theme.textSecondary }}
              className="text-sm break-words"
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View className="flex-row items-center">
        {rightElement}
        {/*{onPress && <ChevronRight size={20} color={theme.primary} />}*/}
      </View>
    </TouchableOpacity>
  );
};

export default SettingsItem;
