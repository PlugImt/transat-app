import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Page } from "@/components/common/Page";
import { WashingMachineCardSkeleton } from "@/components/custom/card/WashingMachineCard";
import { useTheme } from "@/contexts/ThemeContext";
import { AboutSection } from "../AboutSection";

export const WashingMachineLoadingState = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const nbMachines = 4;

  return (
    <Page
      goBack
      className="gap-6"
      title={t("services.washingMachine.title")}
      about={<AboutSection />}
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
