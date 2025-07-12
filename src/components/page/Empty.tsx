import { Sprout } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
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
        <Text className="h2 text-center" style={{ color: theme.text }}>
          {title ?? t("common.empty")}
        </Text>
        {description && (
          <Text
            className="lg text-center"
            style={{ color: theme.textSecondary }}
          >
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};
