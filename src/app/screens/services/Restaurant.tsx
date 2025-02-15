import Loading from "@/components/common/Loading";
import Page from "@/components/common/Page";
import RestaurantCard from "@/components/custom/RestaurantCard";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { isWeekend } from "@/lib/utils";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

export const Restaurant = () => {
  const { t } = useTranslation();

  const {
    data: menu,
    isPending,
    refetch,
    error,
    isError,
  } = useRestaurantMenu();

  const weekend: boolean = useMemo(() => isWeekend(), []);

  if (isPending) {
    return (
      <Page refreshing={isPending} onRefresh={refetch}>
        <Text className="h1 m-4">{t("services.restaurant.title")}</Text>
        <Loading />
      </Page>
    );
  }

  if (weekend) {
    return (
      <Page refreshing={isPending} onRefresh={refetch}>
        <Text className="h1 m-4">{t("services.restaurant.title")}</Text>
        <View className="min-h-full flex justify-center items-center">
          <Image
            source={require("@/assets/images/Logos/restaurant.png")}
            className="w-40 h-40 filter grayscale"
          />
          <Text className="h1 text-red-500 text-center">
            {weekend
              ? t("services.restaurant.closed")
              : t("services.restaurant.no_data")}
          </Text>
        </View>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page refreshing={isPending} onRefresh={refetch}>
        <Text className="h1 m-4">{t("services.restaurant.title")}</Text>
        <View className="min-h-screen flex justify-center items-center ">
          <Text className="text-red-500 text-center h1">{error?.message}</Text>
        </View>
      </Page>
    );
  }

  return (
    <Page refreshing={isPending} onRefresh={refetch}>
      <Text className="h1 m-4">{t("services.restaurant.title")}</Text>

      <View className="flex flex-col gap-8">
        <View className="flex flex-col gap-4">
          <Text className="h3 ml-4">{t("services.restaurant.lunch")}</Text>

          <RestaurantCard
            title={t("services.restaurant.grill")}
            meals={menu?.grilladesMidi}
            icon={"Beef"}
          />
          <RestaurantCard
            title={t("services.restaurant.migrator")}
            meals={menu?.migrateurs}
            icon={"ChefHat"}
          />
          <RestaurantCard
            title={t("services.restaurant.vegetarian")}
            meals={menu?.cibo}
            icon={"Vegan"}
          />
          <RestaurantCard
            title={t("services.restaurant.side_dishes")}
            meals={menu?.accompMidi}
            icon={"Soup"}
          />
        </View>

        {menu?.grilladesSoir && menu?.accompSoir && (
          <View className="flex flex-col gap-4">
            <Text className="h3 ml-4">{t("services.restaurant.dinner")}</Text>

            <RestaurantCard
              title={t("services.restaurant.grill")}
              meals={menu?.grilladesSoir}
              icon={"Beef"}
            />

            <RestaurantCard
              title={t("services.restaurant.side_dishes")}
              meals={menu?.accompSoir}
              icon={"Soup"}
            />
          </View>
        )}
      </View>
    </Page>
  );
};

export default Restaurant;
