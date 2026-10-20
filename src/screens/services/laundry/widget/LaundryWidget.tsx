import { useRouter } from "expo-router";
import { WashingMachineIcon, Wind } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Card from "@/components/common/Card";
import CardGroup from "@/components/common/CardGroup";
import { Text } from "@/components/common/Text";
import { WidgetBoundary } from "@/components/query";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { useLaundryStats } from "@/hooks/services/laundry/useLaundry";
import { paths } from "@/navigation/paths";

export const LaundryWidget = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();

  const {
    availableWashers,
    totalWashers,
    availableDryers,
    totalDryers,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useLaundryStats();

  return (
    <WidgetBoundary
      title={t("services.laundry.title")}
      query={{
        isPending,
        isFetching,
        isError,
        error,
        refetch,
      }}
      loading={<LaundryWidgetLoading />}
    >
      <CardGroup
        title={t("services.laundry.title")}
        onPress={() => router.push(paths.laundry)}
      >
        <Card
          onPress={() => router.push(paths.laundry)}
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
    </WidgetBoundary>
  );
};

export default LaundryWidget;

export const LaundryWidgetLoading = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <CardGroup
      title={t("services.laundry.title")}
      onPress={() => router.push(paths.laundry)}
    >
      <Card
        onPress={() => router.push(paths.laundry)}
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
