import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import LoadingScreen from "@/components/custom/Loading";
import WashingMachineCard from "@/components/custom/card/WashingMachineCard";
import { useWashingMachines } from "@/hooks/useWashingMachines";
import React, { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const WashingMachine: FC = () => {
  const { t } = useTranslation();
  const [aboutPopupVisible, setAboutPopupVisible] = useState(false);
  const openingHoursData = [{ day: "24/7", lunch: "", dinner: "" }];

  const { data, isPending, isFetching, isError, error, refetch } =
    useWashingMachines();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <Page refreshing={isPending} onRefresh={refetch}>
        <Text className="h1 m-4">{t("services.washing_machine.title")}</Text>
        <View className="min-h-screen flex justify-center items-center">
          <Text className="text-red-500 text-center h1">{error?.message}</Text>
        </View>
      </Page>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Page refreshing={isPending} onRefresh={refetch}>
        <Text className="h1 m-4">{t("services.washing_machine.title")}</Text>
        <View className="min-h-screen flex justify-center items-center ">
          <Text className="text-foreground text-center h1">
            {t("services.washing_machine.no_machines")}
          </Text>
        </View>
      </Page>
    );
  }

  // Group washing machines and dryers separately
  const washingMachines = data?.filter(
    (machine) => machine.nom_type.trim() === "LAVE LINGE",
  );
  const dryers = data?.filter(
    (machine) => machine.nom_type.trim() !== "LAVE LINGE",
  );

  return (
    <Page
      onRefresh={refetch}
      refreshing={isFetching}
      className="flex-col gap-6"
    >
      <View className="flex-row gap-2 justify-between items-center">
        <Text className="h1">{t("services.washing_machine.title")}</Text>
        <AboutModal
          // @ts-ignore
          isVisible={aboutPopupVisible}
          onClose={() => setAboutPopupVisible(false)}
          title={t("services.washing_machine.title")}
          description={t("services.washing_machine.about")}
          openingHours={openingHoursData}
          location={t("services.washing_machine.location")}
          price={t("services.washing_machine.price")}
          additionalInfo={t("services.washing_machine.additional_info")}
        />
      </View>

      {washingMachines?.length > 0 && (
        <View className="flex-col gap-4">
          <Text className="text-foreground text-xl font-bold">
            {t("services.washing_machine.washing_machine")}
          </Text>
          {washingMachines.map((item) => (
            <WashingMachineCard
              key={item.machine_id}
              number={item.selecteur_machine}
              type={t("services.washing_machine.washing_machine")}
              status={item.time_before_off}
              icon={"WASHING MACHINE"}
            />
          ))}
        </View>
      )}

      {dryers?.length > 0 && (
        <View className="flex-col gap-4">
          <Text className="text-foreground text-xl font-bold">
            {t("services.washing_machine.dryer")}
          </Text>
          {dryers.map((item) => (
            <WashingMachineCard
              key={item.machine_id}
              number={item.selecteur_machine}
              type={t("services.washing_machine.dryer")}
              status={item.time_before_off}
              icon={"DRYER"}
            />
          ))}
        </View>
      )}
    </Page>
  );
};

export default WashingMachine;
