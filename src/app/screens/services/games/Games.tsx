import { useTranslation } from "react-i18next";
import { BlurredBackground } from "@/components/common/BlurredBackground";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";

export const Games = () => {
  const { t } = useTranslation();

  return (
    <Page
      title={t("games.title")}
      disableScroll
      className="flex-1 justify-center items-center gap-0"
      background={
        <BlurredBackground
          picture={
            "https://images.unsplash.com/photo-1517815154571-fbabad618f3f?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          blurIntensity={90}
        />
      }
      headerColor="transparent"
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
