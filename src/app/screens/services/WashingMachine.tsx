import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import WashingMachineCard, {
  WashingMachineCardSkeleton,
} from "@/components/custom/card/WashingMachineCard";
import { useTheme } from "@/contexts/ThemeContext";
import { MachineData } from "@/dto";
import { useWashingMachines } from "@/hooks/useWashingMachines";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const WashingMachine: FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [_aboutPopupVisible, _setAboutPopupVisible] = useState(false);
  const openingHoursData = [{ day: "24/7", lunch: "", dinner: "" }];

  const {
    data: rawData,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useWashingMachines();
  const data = rawData as
    | (MachineData & { type: "WASHING MACHINE" | "DRYER" })[]
    | undefined;

  if (isPending) {
    return <WashingMachineLoading />;
  }

  if (isError) {
    return (
      <Page goBack refreshing={isPending} onRefresh={refetch}>
        <Text className="h1 m-4">{t("services.washingMachine.title")}</Text>
        <View className="min-h-screen flex justify-center items-center">
          <Text className="text-red-500 text-center h1">{error?.message}</Text>
        </View>
      </Page>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Page goBack refreshing={isPending} onRefresh={refetch}>
        <Text className="h1 m-4">{t("services.washingMachine.title")}</Text>
        <View className="min-h-screen flex justify-center items-center ">
          <Text style={{ color: theme.text }} className="text-center h1">
            {t("services.washingMachine.noMachine")}
          </Text>
        </View>
      </Page>
    );
  }

  // Group washing machines and dryers separately using the new 'type' property
  const washingMachines = data?.filter(
    (machine: MachineData & { type: "WASHING MACHINE" | "DRYER" }) =>
      machine.type === "WASHING MACHINE",
  );
  const dryers = data?.filter(
    (machine: MachineData & { type: "WASHING MACHINE" | "DRYER" }) =>
      machine.type === "DRYER",
  );

  return (
    <Page
      goBack
      onRefresh={refetch}
      refreshing={isFetching}
      className="gap-6"
      title={t("services.washingMachine.title")}
      about={
        <AboutModal
          title={t("services.washingMachine.title")}
          description={t("services.washingMachine.about")}
          openingHours={openingHoursData}
          location={t("services.washingMachine.location")}
          price={t("services.washingMachine.price")}
          additionalInfo={t("services.washingMachine.additionalInfo")}
        />
      }
    >
      {washingMachines?.length > 0 && (
        <View className="flex-col gap-4">
          <Text
            style={{ color: theme.text }}
            className="text-xl font-bold ml-4"
          >
            {t("services.washingMachine.washingMachine")}
          </Text>
          {washingMachines.map(
            (item: MachineData & { type: "WASHING MACHINE" | "DRYER" }) => (
              <WashingMachineCard
                key={item.number}
                number={item.number.toString()}
                type={t("services.washingMachine.washingMachine")}
                status={item.time_left}
                icon={"WASHING MACHINE"}
              />
            ),
          )}
        </View>
      )}

      {dryers?.length > 0 && (
        <View className="flex-col gap-4">
          <Text
            style={{ color: theme.text }}
            className="text-xl font-bold ml-4"
          >
            {t("services.washingMachine.dryer")}
          </Text>
          {dryers.map(
            (item: MachineData & { type: "WASHING MACHINE" | "DRYER" }) => (
              <WashingMachineCard
                key={item.number}
                number={item.number.toString()}
                type={t("services.washingMachine.dryer")}
                status={item.time_left}
                icon={"DRYER"}
              />
            ),
          )}
        </View>
      )}
    </Page>
  );
};

export default WashingMachine;

const WashingMachineLoading = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const openingHoursData = [{ day: "24/7", lunch: "", dinner: "" }];

  const nbMachines = 4;

  return (
    <Page
      goBack
      className="gap-6"
      title={t("services.washingMachine.title")}
      about={
        <AboutModal
          title={t("services.washingMachine.title")}
          description={t("services.washingMachine.about")}
          openingHours={openingHoursData}
          location={t("services.washingMachine.location")}
          price={t("services.washingMachine.price")}
          additionalInfo={t("services.washingMachine.additionalInfo")}
        />
      }
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
