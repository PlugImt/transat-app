import { useTranslation } from "react-i18next";
import { AboutModal } from "@/components/custom/AboutModal";

export const AboutBassine = () => {
  const { t } = useTranslation();

  return (
    <AboutModal
      title={t("services.games.bassine.title")}
      description={t("services.games.bassine.description")}
      location={t("services.games.bassine.location")}
      price={t("services.games.bassine.price")}
    />
  );
};
