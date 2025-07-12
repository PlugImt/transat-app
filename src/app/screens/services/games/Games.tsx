import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";

export const Games = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Page title={t("games.title")}>
      <View className="min-h-screen flex justify-center items-center ">
        <Text className="text-center h1 -mt-60" style={{ color: theme.text }}>
          {t("common.underConstruction")}
        </Text>
        <Text className="text-center p-2.5" style={{ color: theme.text }}>
          {t("common.underConstructionDesc")}
        </Text>
      </View>
    </Page>
  );
};

export default Games;
