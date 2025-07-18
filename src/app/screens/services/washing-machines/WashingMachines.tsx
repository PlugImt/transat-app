import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useWashingMachines } from "@/hooks/useWashingMachines";
import {
  AboutSection,
  ErrorState,
  MachineList,
  WashingMachineLoadingState,
} from "./components";

export const WashingMachines = () => {
  const { t } = useTranslation();
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
      onRefresh={refetch}
      refreshing={isFetching}
      className="gap-6"
      title={t("services.washingMachine.title")}
      header={<AboutSection />}
    >
      {isEmpty ? (
        <View className="min-h-screen flex justify-center items-center">
          <Text variant="h1" className="text-center">
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
