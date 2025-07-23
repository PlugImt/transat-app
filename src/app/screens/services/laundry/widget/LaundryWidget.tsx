import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { WashingMachineIcon, Wind } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Card from "@/components/common/Card";
import CardGroup from "@/components/common/CardGroup";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useLaundryStats } from "@/hooks/laundry/useLaundry";
import type { AppStackParamList } from "@/types";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const LaundryWidget = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { theme } = useTheme();

  const {
    availableWashers,
    totalWashers,
    availableDryers,
    totalDryers,
    isPending,
    isError,
    error,
  } = useLaundryStats();

  if (isPending) {
    return <LaundryWidgetLoading />;
  }

  if (isError || error) {
    return null;
  }

  return (
    <CardGroup
      title={t("services.laundry.title")}
      onPress={() => navigation.navigate("Laundry")}
    >
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
            numberOfLines={1}
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
            numberOfLines={1}
            variant="sm"
            color="muted"
          >
            {t("services.laundry.dryerAvailable")}
          </Text>
        </View>
      </Card>
    </CardGroup>
  );
};

export default LaundryWidget;

export const LaundryWidgetLoading = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();
  const { theme } = useTheme();

  return (
    <CardGroup
      title={t("services.laundry.title")}
      onPress={() => navigation.navigate("Laundry")}
    >
      <Card
        onPress={() => navigation.navigate("Laundry")}
        className="flex-row justify-between gap-6"
      >
        <View className="items-center gap-2">
          <WashingMachineIcon size={32} color={theme.muted} />
          <TextSkeleton variant="lg" lastLineWidth={32} />

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
          <TextSkeleton variant="lg" lastLineWidth={32} />
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
    </CardGroup>
  );
};
