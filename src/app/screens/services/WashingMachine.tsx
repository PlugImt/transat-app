import WashingMachineCard from "@/components/custom/WashingMachineCard";
import { useWashingMachines } from "@/hooks/useWashingMachines";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

export const WashingMachine: FC = () => {
  const { t } = useTranslation();

  const { data, isPending, isFetching, isError, error, refetch } =
    useWashingMachines();

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0D0505]">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0D0505]">
        <Text className="text-red-500 text-center">
          Error: {(error as Error).message}
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0D0505]">
        <Text className="text-red-500 text-center">No data available?</Text>
      </View>
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
    <ScrollView
      className="flex-1 p-5 bg-[#0D0505] pt-8"
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={() => refetch()}
          colors={["#ec7f32"]}
          progressBackgroundColor="#0D0505"
        />
      }
    >
      <Text className="text-[#ffe6cc] text-2xl font-black">
        {t("services.washing_machine.title")}
      </Text>

      {washingMachines?.length > 0 && (
        <>
          <Text className="text-[#ffe6cc] text-xl font-bold mt-5 mb-3">
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
        </>
      )}

      {dryers?.length > 0 && (
        <>
          <Text className="text-[#ffe6cc] text-xl font-bold mt-5 mb-3">
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
        </>
      )}

      {washingMachines?.length === 0 && dryers?.length === 0 && (
        <Text className="text-white text-center">No machines available</Text>
      )}

      <View className="h-12" />
    </ScrollView>
  );
};

export default WashingMachine;
