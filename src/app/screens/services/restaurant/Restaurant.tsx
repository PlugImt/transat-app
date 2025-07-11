import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";
import { AboutModal } from "@/components/custom/AboutModal";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { useMenuRestaurant } from "@/hooks/useMenuRestaurant";
import { getOpeningHoursData, isWeekend, outOfService } from "@/utils";
import { LoadingState, RestaurantMenu } from "./components";

export const Restaurant = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const openingHoursData = useMemo(() => getOpeningHoursData(t), [t]);

  const { menu, isPending, refetch, isError, error } = useMenuRestaurant();

  const weekend: boolean = useMemo(() => isWeekend(), []);
  const outOfHours: boolean = useMemo(
    () => (menu?.updated_date ? outOfService(menu.updated_date) : false),
    [menu?.updated_date],
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
        about={
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
            source={require("@/assets/images/Logos/restaurant.png")}
            className="w-40 h-40 filter grayscale"
          />
          <Text className="h1 text-center" style={{ color: theme.text }}>
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
        about={
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
            source={require("@/assets/images/Logos/restaurant.png")}
            className="w-40 h-40 filter grayscale"
          />
          <View className="gap-2">
            <Text className="h1 text-center" style={{ color: theme.text }}>
              {t("services.restaurant.closedNight.title")}
            </Text>
            <Text className="h3 text-center text-muted-foreground">
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
        about={
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
          <Text className="text-red-500 text-center h1">{error?.message}</Text>
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
      about={
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
