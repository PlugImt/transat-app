import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import WashingMachineCard, {
  WashingMachineCardSkeleton,
} from "@/components/custom/card/WashingMachineCard";
import { useWashingMachines } from "@/hooks/useWashingMachines";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const WashingMachine: FC = () => {
  const { t } = useTranslation();
  const [_aboutPopupVisible, _setAboutPopupVisible] = useState(false);
  const openingHoursData = [{ day: "24/7", lunch: "", dinner: "" }];

  const { data, isPending, isFetching, isError, error, refetch } =
    useWashingMachines();

  const header = (
    <View className="flex-row gap-2 justify-between items-center">
      <Text className="h1">{t("services.washingMachine.title")}</Text>
      <AboutModal
        title={t("services.washingMachine.title")}
        description={t("services.washingMachine.about")}
        openingHours={openingHoursData}
        location={t("services.washingMachine.location")}
        price={t("services.washingMachine.price")}
        additionalInfo={t("services.washingMachine.additionalInfo")}
      />
    </View>
  );

  if (isPending) {
    return <WashingMachineLoading header={header} />;
  }

  if (isError) {
    return (
      <Page refreshing={isPending} onRefresh={refetch}>
        <Text className="h1 m-4">{t("services.washingMachine.title")}</Text>
        <View className="min-h-screen flex justify-center items-center">
          <Text className="text-red-500 text-center h1">{error?.message}</Text>
        </View>
      </Page>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Page refreshing={isPending} onRefresh={refetch}>
        <Text className="h1 m-4">{t("services.washingMachine.title")}</Text>
        <View className="min-h-screen flex justify-center items-center ">
          <Text className="text-foreground text-center h1">
            {t("services.washingMachine.noMachine")}
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
    <Page onRefresh={refetch} refreshing={isFetching} className="gap-6">
      {header}

      {washingMachines?.length > 0 && (
        <View className="flex-col gap-4">
          <Text className="text-foreground text-xl font-bold">
            {t("services.washingMachine.washingMachine")}
          </Text>
          {washingMachines.map((item) => (
            <WashingMachineCard
              key={item.machine_id}
              number={item.selecteur_machine}
              type={t("services.washingMachine.washingMachine")}
              status={item.time_before_off}
              icon={"WASHING MACHINE"}
            />
          ))}
        </View>
      )}

      {dryers?.length > 0 && (
        <View className="flex-col gap-4">
          <Text className="text-foreground text-xl font-bold">
            {t("services.washingMachine.dryer")}
          </Text>
          {dryers.map((item) => (
            <WashingMachineCard
              key={item.machine_id}
              number={item.selecteur_machine}
              type={t("services.washingMachine.dryer")}
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

interface WashingMachineLoadingProps {
  header: React.ReactNode;
}

const WashingMachineLoading = ({ header }: WashingMachineLoadingProps) => {
  const { t } = useTranslation();

  const nbMachines = 4;

  return (
    <Page className="gap-6">
      {header}

      <View className="flex-col gap-4">
        <Text className="text-foreground text-xl font-bold">
          {t("services.washingMachine.washingMachine")}
        </Text>
        {[...Array(nbMachines).keys()].map((index) => (
          <WashingMachineCardSkeleton key={index} icon="WASHING MACHINE" />
        ))}
      </View>

      <View className="flex-col gap-4">
        <Text className="text-foreground text-xl font-bold">
          {t("services.washingMachine.dryer")}
        </Text>
        {[...Array(nbMachines).keys()].map((index) => (
          <WashingMachineCardSkeleton key={index} icon="DRYER" />
        ))}
      </View>
    </Page>
  );
};
