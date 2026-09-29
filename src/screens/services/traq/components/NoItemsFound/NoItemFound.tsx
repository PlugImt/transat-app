import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";

export const NoItemsFound = () => {
  const { t } = useTranslation();
  return (
    <View className="flex items-center justify-center">
      <Text color="muted" variant="h3">
        {t("services.traq.noItemsFound")}
      </Text>
    </View>
  );
};
