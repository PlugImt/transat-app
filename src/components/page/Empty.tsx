import { Sprout } from "lucide-react-native";
import { cloneElement, isValidElement } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

interface EmptyProps {
  icon?: React.ReactElement<{ color?: string; size?: number }>;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const Empty = ({ icon, title, description, children }: EmptyProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const Icon = isValidElement(icon) ? (
    cloneElement(icon, {
      color: theme.text,
      ...(icon.props.size === undefined && { size: 40 }),
    })
  ) : (
    <Sprout color={theme.text} size={40} />
  );

  return (
    <View className="flex-1 justify-center items-center gap-4 mt-10">
      {Icon}
      <View className="items-center">
        <Text className="text-center" variant="h2">
          {title ?? t("common.empty")}
        </Text>
        {description && (
          <Text className="text-center" color="muted" variant="lg">
            {description}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
};
