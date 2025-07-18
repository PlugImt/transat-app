import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AboutSection } from "@/app/screens/services/laundry/components/AboutSection";
import { Text } from "@/components/common/Text";
import { LaundryCardSkeleton } from "@/components/custom/card/LaundryCard";
import { Page } from "@/components/page/Page";

export const LaundryLoadingState = () => {
  const { t } = useTranslation();
  const nbMachines = 4;

  return (
    <Page
      goBack
      className="gap-6"
      title={t("services.laundry.title")}
      header={<AboutSection />}
    >
      <View className="flex-col gap-4">
        <Text variant="h3">{t("services.laundry.laundry")}</Text>
        {[...Array(nbMachines).keys()].map((index) => (
          <LaundryCardSkeleton key={index} icon="WASHING MACHINE" />
        ))}
      </View>

      <View className="flex-col gap-4">
        <Text variant="h3">{t("services.laundry.dryer")}</Text>
        {[...Array(nbMachines).keys()].map((index) => (
          <LaundryCardSkeleton key={index} icon="DRYER" />
        ))}
      </View>
    </Page>
  );
};
