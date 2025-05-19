import Page from "@/components/common/Page";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const Games = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("games.title")}>
      <View className="min-h-screen flex justify-center items-center ">
        <Text className="text-foreground text-center h1 -mt-60">
          {t("common.underConstruction")}
        </Text>
        <Text className="text-foreground text-center p-2.5">
          {t("common.underConstructionDesc")}
        </Text>
      </View>
    </Page>
  );
};

export default Games;
