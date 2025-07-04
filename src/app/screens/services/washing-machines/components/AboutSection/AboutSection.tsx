import { useTranslation } from "react-i18next";
import { AboutModal } from "@/components/custom/AboutModal";

export const AboutSection = () => {
  const { t } = useTranslation();
  const openingHours = [{ day: "24/7", lunch: "", dinner: "" }];

  return (
    <AboutModal
      title={t("services.washingMachine.title")}
      description={t("services.washingMachine.about")}
      openingHours={openingHours}
      location={t("services.washingMachine.location")}
      price={t("services.washingMachine.price")}
      additionalInfo={t("services.washingMachine.additionalInfo")}
    />
  );
};
