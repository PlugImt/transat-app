import { WidgetSkeleton } from "@/components/Skeleton";
import { useWashingMachines } from "@/hooks/useWashingMachines";
import type { AppStackParamList } from "@/services/storage/types";
import { useTheme } from "@/themes/useThemeProvider";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { WashingMachineIcon, Wind } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export function WashingMachineWidget() {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const theme = useTheme();

  const { data, isPending, isError, error } = useWashingMachines();

  const [totalWashers, setTotalWashers] = useState<number>(0);
  const [totalDryers, setTotalDryers] = useState<number>(0);
  const [availableWashers, setAvailableWashers] = useState<number>(0);
  const [availableDryers, setAvailableDryers] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const washingMachines = data.filter(
        (machine) => machine.nom_type.trim() === "LAVE LINGE",
      );
      const dryers = data.filter(
        (machine) => machine.nom_type.trim() !== "LAVE LINGE",
      );

      setTotalWashers(washingMachines.length);
      setTotalDryers(dryers.length);

      setAvailableWashers(
        washingMachines.filter((machine) => machine.time_before_off === 0)
          .length,
      );
      setAvailableDryers(
        dryers.filter((machine) => machine.time_before_off === 0).length,
      );
    }
  }, [data]);

  if (isPending) {
    return (
      <WidgetSkeleton title contentType="grid" gridColumns={2} gridItems={2} />
    );
  }

  if (isError || error || !data) {
    return null;
  }

  return (
    <View className="flex flex-col gap-2">
      <Text className="h3">{t("services.washingMachine.title")}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("WashingMachine")}
        className="px-6 py-4 rounded-lg bg-card flex-row justify-between gap-6"
      >
        <View className="items-center">
          <WashingMachineIcon
            size={40}
            color={availableWashers === 0 ? "#494949" : theme.primary}
          />
          <Text className="text-lg font-bold text-foreground">
            {availableWashers}/{totalWashers}
          </Text>
          <Text className="text-foreground" ellipsizeMode="tail">
            {t("services.washingMachine.machineAvailable")}
          </Text>
        </View>
        <View className="items-center">
          <Wind
            size={40}
            color={availableDryers === 0 ? "#494949" : theme.primary}
          />
          <Text className="text-lg font-bold text-foreground">
            {availableDryers}/{totalDryers}
          </Text>
          <Text className="text-foreground" ellipsizeMode="tail">
            {t("services.washingMachine.dryerAvailable")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default WashingMachineWidget;
