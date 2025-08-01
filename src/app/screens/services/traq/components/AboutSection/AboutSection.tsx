import { useTranslation } from "react-i18next";
import { AboutModal } from "@/components/custom/AboutModal";

export const AboutSection = () => {
  const { t } = useTranslation();
  return (
    <AboutModal
      title={t("services.traq.title")}
      description={t("services.traq.about")}
      openingHours={t("services.traq.openingHours")}
      location={t("services.traq.location")}
    />
  );
};
