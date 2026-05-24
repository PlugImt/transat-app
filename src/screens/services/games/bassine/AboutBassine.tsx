import { useTranslation } from "react-i18next";
import { AboutModal } from "@/components/custom/AboutModal";

export const AboutBassine = () => {
  const { t } = useTranslation();

  return (
    <AboutModal
      title={t("games.bassine.title")}
      description={t("games.bassine.description")}
      location={t("games.bassine.location")}
      price={t("games.bassine.price")}
    />
  );
};
