import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import {
  LoadingState,
  RestaurantMenu,
} from "@/app/screens/services/restaurant/components";
import { Text } from "@/components/common/Text";
import { AboutModal } from "@/components/custom/AboutModal";
import { Page } from "@/components/page/Page";
import { useMenuRestaurant } from "@/hooks/useMenuRestaurant";
import { getOpeningHoursData, isWeekend, outOfService } from "@/utils";

export const Restaurant = () => {
  const { t } = useTranslation();
  const openingHoursData = useMemo(() => getOpeningHoursData(t), [t]);

  const { menu, isPending, refetch, isError, error } = useMenuRestaurant();

  const weekend: boolean = useMemo(() => isWeekend(), []);
  const outOfHours: boolean = useMemo(
    () =>
      menu?.updatedDate ? outOfService(menu.updatedDate.toString()) : false,
    [menu?.updatedDate],
  );

  if (isPending || !menu) {
    return <LoadingState />;
  }

  if (weekend) {
    return (
      <Page
        refreshing={isPending}
        onRefresh={refetch}
        title={t("services.restaurant.title")}
        header={
          <AboutModal
            title={t("services.restaurant.title")}
            description={t("services.restaurant.about")}
            openingHours={openingHoursData}
            location={t("services.restaurant.location")}
            price={t("services.restaurant.price")}
            additionalInfo={t("services.restaurant.additionalInfo")}
          />
        }
      >
        <View className="min-h-full flex justify-center items-center gap-4">
          <Image
            source={require("@/assets/images/services/restaurant.png")}
            className="w-40 h-40 filter grayscale"
          />
          <Text variant="h1" className="text-center">
            {weekend
              ? t("services.restaurant.closedWeekends")
              : t("services.restaurant.noData")}
          </Text>
        </View>
      </Page>
    );
  }

  if (outOfHours) {
    return (
      <Page
        refreshing={isPending}
        onRefresh={refetch}
        title={t("services.restaurant.title")}
        header={
          <AboutModal
            title={t("services.restaurant.title")}
            description={t("services.restaurant.about")}
            openingHours={openingHoursData}
            location={t("services.restaurant.location")}
            price={t("services.restaurant.price")}
            additionalInfo={t("services.restaurant.additionalInfo")}
          />
        }
      >
        <View className="min-h-full flex justify-center items-center gap-4">
          <Image
            source={require("@/assets/images/services/restaurant.png")}
            className="w-40 h-40 filter grayscale"
          />
          <View className="gap-2">
            <Text variant="h1" className="text-center">
              {t("services.restaurant.closedNight.title")}
            </Text>
            <Text className="text-center" color="muted">
              {t("services.restaurant.closedNight.description")}
            </Text>
          </View>
        </View>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page
        refreshing={isPending}
        onRefresh={refetch}
        title={t("services.restaurant.title")}
        header={
          <AboutModal
            title={t("services.restaurant.title")}
            description={t("services.restaurant.about")}
            openingHours={openingHoursData}
            location={t("services.restaurant.location")}
            price={t("services.restaurant.price")}
            additionalInfo={t("services.restaurant.additionalInfo")}
          />
        }
      >
        <View className="min-h-screen flex justify-center items-center ">
          <Text variant="h1" className="text-center" color="destructive">
            {error?.message}
          </Text>
        </View>
      </Page>
    );
  }

  return (
    <Page
      refreshing={isPending}
      onRefresh={refetch}
      goBack
      title={t("services.restaurant.title")}
      header={
        <AboutModal
          title={t("services.restaurant.title")}
          description={t("services.restaurant.about")}
          openingHours={openingHoursData}
          location={t("services.restaurant.location")}
          price={t("services.restaurant.price")}
          additionalInfo={t("services.restaurant.additionalInfo")}
        />
      }
    >
      <RestaurantMenu menu={menu} />
    </Page>
  );
};

export default Restaurant;
