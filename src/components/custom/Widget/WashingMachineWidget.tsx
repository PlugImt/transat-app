import { useWashingMachines } from "@/hooks/useWashingMachines";
import type { AppStackParamList } from "@/services/storage/types";
import theme from "@/themes";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { WashingMachineIcon, Wind } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export function WashingMachineWidget() {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();

  const { data, isPending, isError, error, refetch } = useWashingMachines();

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
      <View className="flex flex-col gap-2">
        <Text className="h3">{t("services.washing_machine.title")}</Text>
        <View className="bg-card p-4 rounded-lg flex justify-center items-center">
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  if (isError || error || !data) {
    return null;
  }

  return (
    <View className="flex flex-col gap-2">
      <Text className="h3">{t("services.washing_machine.title")}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("WashingMachine")}
        accessible={true}
        activeOpacity={0.4}
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
          <Text className="text-foreground text-ellipsis">
            {t("services.washing_machine.available_machines")}
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
          <Text className="text-foreground text-ellipsis">
            {t("services.washing_machine.available_dryers")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default WashingMachineWidget;
