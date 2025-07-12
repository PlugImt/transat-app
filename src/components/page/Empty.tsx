import { Sprout } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

interface EmptyProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export const Empty = ({ icon, title, description }: EmptyProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <View className="flex-1 justify-center items-center gap-4 mt-10">
      {icon ?? <Sprout color={theme.text} size={40} />}
      <View className="items-center">
        <Text className="text-center" variant="h2">
          {title ?? t("common.empty")}
        </Text>
        {description && (
          <Text className="text-center" color="textSecondary" variant="lg">
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};
