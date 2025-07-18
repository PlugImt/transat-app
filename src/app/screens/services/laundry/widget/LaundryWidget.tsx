import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { WashingMachineIcon, Wind } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useLaundry } from "@/hooks/useLaundry";
import type { AppStackParamList } from "@/services/storage/types";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const LaundryWidget = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { theme } = useTheme();

  const { dryers, washingMachines, isPending, isError, error } = useLaundry();

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
    return <LaundryWidgetLoading />;
  }

  if (isError || error || !dryers || !washingMachines) {
    return null;
  }

  return (
    <View className="flex flex-col gap-2">
      <Text className="ml-4" variant="h3">
        {t("services.laundry.title")}
      </Text>
      <Card
        onPress={() => navigation.navigate("Laundry")}
        className="flex-row justify-between gap-6"
      >
        <View className="items-center">
          <WashingMachineIcon
            size={32}
            color={availableWashers === 0 ? theme.muted : theme.primary}
          />
          <Text variant="lg">
            {availableWashers}/{totalWashers}
          </Text>
          <Text
            className="flex-1 text-center"
            numberOfLines={2}
            variant="sm"
            color="muted"
          >
            {t("services.laundry.machineAvailable")}
          </Text>
        </View>
        <View className="items-center">
          <Wind
            size={32}
            color={availableDryers === 0 ? theme.muted : theme.primary}
          />
          <Text variant="lg">
            {availableDryers}/{totalDryers}
          </Text>
          <Text
            className="flex-1 text-center"
            numberOfLines={2}
            variant="sm"
            color="muted"
          >
            {t("services.laundry.dryerAvailable")}
          </Text>
        </View>
      </Card>
    </View>
  );
};

export default LaundryWidget;

export const LaundryWidgetLoading = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { theme } = useTheme();

  return (
    <View className="flex flex-col gap-2">
      <Text variant="h3">{t("services.laundry.title")}</Text>
      <Card
        onPress={() => navigation.navigate("Laundry")}
        className="flex-row justify-between gap-6"
      >
        <View className="items-center gap-2">
          <WashingMachineIcon size={32} color={theme.muted} />
          <TextSkeleton variant="lg" lines={1} lastLineWidth={32} />

          <Text
            className="flex-1 text-center"
            numberOfLines={1}
            variant="sm"
            color="muted"
          >
            {t("services.laundry.machineAvailable")}
          </Text>
        </View>
        <View className="items-center gap-2">
          <Wind size={32} color={theme.muted} />
          <TextSkeleton variant="lg" lines={1} lastLineWidth={32} />
          <Text
            className="flex-1 text-center"
            numberOfLines={1}
            variant="sm"
            color="muted"
          >
            {t("services.laundry.dryerAvailable")}
          </Text>
        </View>
      </Card>
    </View>
  );
};
