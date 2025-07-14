import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";

export const Games = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("games.title")}>
      <View className="min-h-screen flex justify-center items-center ">
        <Text variant="h2" className="text-center -mt-60">
          {t("common.underConstruction")}
        </Text>
        <Text className="text-center p-2.5" color="muted">
          {t("common.underConstructionDesc")}
        </Text>
      </View>
    </Page>
  );
};

export default Games;
