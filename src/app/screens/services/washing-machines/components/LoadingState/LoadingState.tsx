import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AboutSection } from "@/app/screens/services/washing-machines/components/AboutSection";
import { Text } from "@/components/common/Text";
import { WashingMachineCardSkeleton } from "@/components/custom/card/WashingMachineCard";
import { Page } from "@/components/page/Page";

export const WashingMachineLoadingState = () => {
  const { t } = useTranslation();
  const nbMachines = 4;

  return (
    <Page
      goBack
      className="gap-6"
      title={t("services.washingMachine.title")}
      header={<AboutSection />}
    >
      <View className="flex-col gap-4">
        <Text variant="h3">{t("services.washingMachine.washingMachine")}</Text>
        {[...Array(nbMachines).keys()].map((index) => (
          <WashingMachineCardSkeleton key={index} icon="WASHING MACHINE" />
        ))}
      </View>

      <View className="flex-col gap-4">
        <Text variant="h3">{t("services.washingMachine.dryer")}</Text>
        {[...Array(nbMachines).keys()].map((index) => (
          <WashingMachineCardSkeleton key={index} icon="DRYER" />
        ))}
      </View>
    </Page>
  );
};
