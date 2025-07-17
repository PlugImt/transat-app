import { useTranslation } from "react-i18next";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";

export const Games = () => {
  const { t } = useTranslation();

  return (
    <Page
      title={t("games.title")}
      disableScroll
      className="flex-1 justify-center items-center gap-0"
    >
      <Text variant="h2" className="text-center">
        {t("common.underConstruction")}
      </Text>
      <Text className="text-center" color="muted">
        {t("common.underConstructionDesc")}
      </Text>
    </Page>
  );
};

export default Games;
