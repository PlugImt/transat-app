import { useTranslation } from "react-i18next";
import { AboutModal } from "@/components/custom/AboutModal";

export const AboutSection = () => {
  const { t } = useTranslation();
  const openingHours = [{ day: "24/7", lunch: "", dinner: "" }];

  return (
    <AboutModal
      title={t("services.laundry.title")}
      description={t("services.laundry.about")}
      openingHours={openingHours}
      location={t("services.laundry.location")}
      price={t("services.laundry.price")}
      additionalInfo={t("services.laundry.additionalInfo")}
    />
  );
};
