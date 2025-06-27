import { EmploiDuTempsWidgetLoading } from "@/components/custom/widget/EmploiDuTempsWidgetLoading";
import { WashingMachineWidgetLoading } from "@/components/custom/widget/WashingMachineWidget";
import { useTranslation } from "react-i18next";
import { WeatherSkeleton } from "../weather";
import Page from "@/components/common/Page";
import { Text } from "react-native";
import { isDinner, isLunch, isWeekend } from "@/utils";
import { RestaurantWidgetLoading } from "@/components/custom/widget/RestaurantWidget";

export const LoadingState = () => {
  const { t } = useTranslation();

  return (
    <Page className="gap-6">
      <Text className="h1 m-4">{t("common.welcome")}</Text>
      <WeatherSkeleton />
      {!isWeekend() && !isLunch() && !isDinner() && <RestaurantWidgetLoading />}
      <EmploiDuTempsWidgetLoading />
      <WashingMachineWidgetLoading />
    </Page>
  );
};