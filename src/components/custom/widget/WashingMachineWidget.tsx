import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useWashingMachines } from "@/hooks/useWashingMachines";
import type { AppStackParamList } from "@/services/storage/types";
import type { MachineData } from "@/types/washingMachine";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { WashingMachineIcon, Wind } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export function WashingMachineWidget() {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { theme } = useTheme();

  const { data: rawData, isPending, isError, error } = useWashingMachines();
  const data = rawData as
    | (MachineData & { type: "WASHING MACHINE" | "DRYER" })[]
    | undefined;

  const [totalWashers, setTotalWashers] = useState<number>(0);
  const [totalDryers, setTotalDryers] = useState<number>(0);
  const [availableWashers, setAvailableWashers] = useState<number>(0);
  const [availableDryers, setAvailableDryers] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const washingMachines = data.filter(
        (machine: MachineData & { type: "WASHING MACHINE" | "DRYER" }) =>
          machine.type === "WASHING MACHINE",
      );
      const dryers = data.filter(
        (machine: MachineData & { type: "WASHING MACHINE" | "DRYER" }) =>
          machine.type === "DRYER",
      );

      setTotalWashers(washingMachines.length);
      setTotalDryers(dryers.length);

      setAvailableWashers(
        washingMachines.filter(
          (machine: MachineData & { type: "WASHING MACHINE" | "DRYER" }) =>
            machine.available,
        ).length,
      );
      setAvailableDryers(
        dryers.filter(
          (machine: MachineData & { type: "WASHING MACHINE" | "DRYER" }) =>
            machine.available,
        ).length,
      );
    }
  }, [data]);

  if (isPending) {
    return <WashingMachineWidgetLoading />;
  }

  if (isError || error || !data) {
    return null;
  }

  return (
    <View className="flex flex-col gap-2">
      <Text className="h3 ml-4" style={{ color: theme.foreground }}>
        {t("services.washingMachine.title")}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("WashingMachine")}
        style={{ backgroundColor: theme.card }}
        className="px-6 py-4 rounded-lg flex-row justify-between gap-6 overflow-hidden"
      >
        <View
          className="items-center"
          style={{ maxWidth: Dimensions.get("window").width / 2 - 50 }}
        >
          <WashingMachineIcon
            size={40}
            color={availableWashers === 0 ? theme.muted : theme.primary}
          />
          <Text
            style={{ color: theme.foreground }}
            className="text-lg font-bold"
          >
            {availableWashers}/{totalWashers}
          </Text>
          <Text
            style={{ color: theme.foreground }}
            className="flex-1 text-center"
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {t("services.washingMachine.machineAvailable")}
          </Text>
        </View>
        <View
          className="items-center"
          style={{ maxWidth: Dimensions.get("window").width / 2 - 50 }}
        >
          <Wind
            size={40}
            color={availableDryers === 0 ? theme.muted : theme.primary}
          />
          <Text
            style={{ color: theme.foreground }}
            className="text-lg font-bold"
          >
            {availableDryers}/{totalDryers}
          </Text>
          <Text
            style={{ color: theme.foreground }}
            className="flex-1 text-center"
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {t("services.washingMachine.dryerAvailable")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default WashingMachineWidget;

export const WashingMachineWidgetLoading = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { theme } = useTheme();

  return (
    <View className="flex flex-col gap-2">
      <Text className="h3">{t("services.washingMachine.title")}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("WashingMachine")}
        style={{ backgroundColor: theme.card }}
        className="px-6 py-4 rounded-lg flex-row justify-between gap-6"
      >
        <View className="items-center gap-2">
          <WashingMachineIcon size={40} color={theme.muted} />
          <TextSkeleton variant="lg" lines={1} lastLineWidth={32} />

          <Text
            style={{ color: theme.foreground }}
            className="flex-1 text-center"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {t("services.washingMachine.machineAvailable")}
          </Text>
        </View>
        <View className="items-center gap-2">
          <Wind size={40} color={theme.muted} />
          <TextSkeleton variant="lg" lines={1} lastLineWidth={32} />
          <Text
            style={{ color: theme.foreground }}
            className="flex-1 text-center"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {t("services.washingMachine.dryerAvailable")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
