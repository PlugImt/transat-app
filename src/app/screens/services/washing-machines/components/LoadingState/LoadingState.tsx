import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AboutSection } from "@/app/screens/services/washing-machines/components/AboutSection";
import { WashingMachineCardSkeleton } from "@/components/custom/card/WashingMachineCard";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";

export const WashingMachineLoadingState = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const nbMachines = 4;

  return (
    <Page
      goBack
      className="gap-6"
      title={t("services.washingMachine.title")}
      header={<AboutSection />}
    >
      <View className="flex-col gap-4">
        <Text style={{ color: theme.text }} className="text-xl font-bold">
          {t("services.washingMachine.washingMachine")}
        </Text>
        {[...Array(nbMachines).keys()].map((index) => (
          <WashingMachineCardSkeleton key={index} icon="WASHING MACHINE" />
        ))}
      </View>

      <View className="flex-col gap-4">
        <Text style={{ color: theme.text }} className="text-xl font-bold">
          {t("services.washingMachine.dryer")}
        </Text>
        {[...Array(nbMachines).keys()].map((index) => (
          <WashingMachineCardSkeleton key={index} icon="DRYER" />
        ))}
      </View>
    </Page>
  );
};
