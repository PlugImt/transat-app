import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { WashingMachineIcon, Wind } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useWashingMachines } from "@/hooks/useWashingMachines";
import type { AppStackParamList } from "@/services/storage/types";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const WashingMachineWidget = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { theme } = useTheme();

  const { dryers, washingMachines, isPending, isError, error } =
    useWashingMachines();

  const [totalWashers, setTotalWashers] = useState<number>(0);
  const [totalDryers, setTotalDryers] = useState<number>(0);
  const [availableWashers, setAvailableWashers] = useState<number>(0);
  const [availableDryers, setAvailableDryers] = useState<number>(0);

  useEffect(() => {
    setTotalWashers(washingMachines.length);
    setTotalDryers(dryers.length);

    setAvailableWashers(
      washingMachines.filter((washer) => washer.available).length,
    );
    setAvailableDryers(dryers.filter((dryer) => dryer.available).length);
  }, [dryers, washingMachines]);

  if (isPending) {
    return <WashingMachineWidgetLoading />;
  }

  if (isError || error || !dryers || !washingMachines) {
    return null;
  }

  return (
    <View className="flex flex-col gap-2">
      <Text className="h3 ml-4" style={{ color: theme.text }}>
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
          <Text style={{ color: theme.text }} className="text-lg font-bold">
            {availableWashers}/{totalWashers}
          </Text>
          <Text
            style={{ color: theme.text }}
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
          <Text style={{ color: theme.text }} className="text-lg font-bold">
            {availableDryers}/{totalDryers}
          </Text>
          <Text
            style={{ color: theme.text }}
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
};

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
            style={{ color: theme.text }}
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
            style={{ color: theme.text }}
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
