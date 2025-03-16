import Page from "@/components/common/Page";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

export const Games = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <Text className="h1 m-4">{t("games.title")}</Text>
    </Page>
  );
};

export default Games;
