import { Dialog } from "@/components/common/Dialog";
import Loading from "@/components/common/Loading";
import Page from "@/components/common/Page";
import WashingMachineCard from "@/components/custom/WashingMachineCard";
import { useWashingMachines } from "@/hooks/useWashingMachines";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const WashingMachine: FC = () => {
  const { t } = useTranslation();

  const { data, isPending, isFetching, isError, error, refetch } =
    useWashingMachines();

  if (isPending) {
    return <Loading />;
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
      <Text className="h1">{t("services.washing_machine.title")}</Text>

      {washingMachines?.length > 0 && (
        <View className="flex-col gap-4">
          <Text className="text-foreground text-xl font-bold">
            {t("services.washing_machine.washing_machine")}
          </Text>
          {washingMachines.map((item) => (
            <Dialog key={item.machine_id}>
              <WashingMachineCard
                key={item.machine_id}
                number={item.selecteur_machine}
                type={t("services.washing_machine.washing_machine")}
                status={item.time_before_off}
                icon={"WASHING MACHINE"}
              />
            </Dialog>
          ))}
        </View>
      )}

      {dryers?.length > 0 && (
        <View className="flex-col gap-4">
          <Text className="text-foreground text-xl font-bold">
            {t("services.washing_machine.dryer")}
          </Text>
          {dryers.map((item) => (
            <Dialog key={item.machine_id}>
              <WashingMachineCard
                number={item.selecteur_machine}
                type={t("services.washing_machine.dryer")}
                status={item.time_before_off}
                icon={"DRYER"}
              />
            </Dialog>
          ))}
        </View>
      )}
    </Page>
  );
};

export default WashingMachine;
