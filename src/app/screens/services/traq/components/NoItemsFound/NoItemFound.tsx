import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const NoItemsFound = () => {
  const { t } = useTranslation();
  return (
    <View className="flex items-center justify-center">
      <Text className="h3 text-muted-foreground">
        {t("services.traq.noItemsFound")}
      </Text>
    </View>
  );
};
