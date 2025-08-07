import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { hapticFeedback } from "@/utils/haptics.utils";

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
  const handlePress = () => {
    hapticFeedback.light();
    onPress?.();
  };

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between py-4"
      onPress={handlePress}
    >
      <View className="flex-row items-center gap-3 flex-1">
        {icon}
        <View className="ml-2.5 flex-1">
          <Text>{title}</Text>
          {subtitle && (
            <Text color="muted" variant="sm">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View className="flex-row items-center">{rightElement}</View>
    </TouchableOpacity>
  );
};

export default SettingsItem;
