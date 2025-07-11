import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { useWashingMachines } from "@/hooks/useWashingMachines";
import {
  AboutSection,
  ErrorState,
  MachineList,
  WashingMachineLoadingState,
} from "./components";

export const WashingMachines = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [_aboutPopupVisible, _setAboutPopupVisible] = useState(false);

  const {
    dryers,
    washingMachines,
    error,
    isEmpty,
    isError,
    isFetching,
    isPending,
    refetch,
  } = useWashingMachines();

  if (isPending) return <WashingMachineLoadingState />;

  if (isError)
    return (
      <ErrorState
        error={error}
        title={t("services.washingMachine.title")}
        onRefresh={refetch}
      />
    );

  return (
    <Page
      goBack
      onRefresh={refetch}
      refreshing={isFetching}
      className="gap-6"
      title={t("services.washingMachine.title")}
      about={<AboutSection />}
    >
      {isEmpty ? (
        <View className="min-h-screen flex justify-center items-center">
          <Text style={{ color: theme.text }} className="text-center h1">
            {t("services.washingMachine.noMachine")}
          </Text>
        </View>
      ) : (
        <>
          <MachineList
            title={t("services.washingMachine.washingMachine")}
            items={washingMachines}
            icon="WASHING MACHINE"
          />
          <MachineList
            title={t("services.washingMachine.dryer")}
            items={dryers}
            icon="DRYER"
          />
        </>
      )}
    </Page>
  );
};

export default WashingMachines;
