import Loading from "@/app/components/common/Loading";
import Page from "@/app/components/common/Page";
import { isWeekend } from "@/app/lib/utils";
import RestaurantCard from "@/components/custom/RestaurantCard";
import { getRestaurant } from "@/lib/restaurant";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface MenuData {
  grilladesMidi: string[];
  migrateurs: string[];
  cibo: string[];
  accompMidi: string[];
  grilladesSoir: string[];
  accompSoir: string[];
}

export const Restaurant = () => {
  const { t } = useTranslation();

  const [menuData, setMenuData] = useState<MenuData | undefined>({
    grilladesMidi: [],
    migrateurs: [],
    cibo: [],
    accompMidi: [],
    grilladesSoir: [],
    accompSoir: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const weekend: boolean = useMemo(() => isWeekend(), []);
  const empty: boolean = useMemo(
    () =>
      menuData?.grilladesMidi.length === 0 &&
      menuData?.migrateurs.length === 0 &&
      menuData?.cibo.length === 0 &&
      menuData?.accompMidi.length === 0 &&
      menuData?.grilladesSoir.length === 0 &&
      menuData?.accompSoir.length === 0,
    [menuData],
  );

  const fetchMenuData = async () => {
    try {
      const data = await getRestaurant(setRefreshing);
      setMenuData(data);
      // biome-ignore lint/suspicious/noExplicitAny: à être remplacé par React Query
    } catch (error: any) {
      console.error("Error while getting the menu :", error);
      setError(`${error.message}`);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: à être remplacé par React Query
  useEffect(() => {
    fetchMenuData().then((r) => r);
  }, []);

  const onRefresh = () => {
    setRefreshing(!refreshing);
  };

  if (isLoading) {
    return (
      <Page refreshing={refreshing} onRefresh={onRefresh}>
        <Loading />
      </Page>
    );
  }

  if (weekend || empty) {
    return (
      <Page refreshing={refreshing} onRefresh={onRefresh}>
        <View className="min-h-screen flex justify-center items-center">
          <Image
            source={require("@/assets/images/Logos/restaurant.png")}
            className="w-40 h-40 grayscale"
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

  if (error) {
    return (
      <Page refreshing={refreshing} onRefresh={onRefresh}>
        <View className="min-h-screen flex justify-center items-center ">
          <Text className="text-red-500 text-center h1">{error}</Text>
        </View>
      </Page>
    );
  }

  return (
    <Page refreshing={refreshing} onRefresh={onRefresh}>
      <Text className="h1 m-4">{t("services.restaurant.title")}</Text>

      <View className="flex flex-col gap-8">
        <View className="flex flex-col gap-4">
          <Text className="h3 ml-4">{t("services.restaurant.lunch")}</Text>

          <RestaurantCard
            title={t("services.restaurant.grill")}
            meals={menuData?.grilladesMidi}
            icon={"Beef"}
          />
          <RestaurantCard
            title={t("services.restaurant.migrator")}
            meals={menuData?.migrateurs}
            icon={"ChefHat"}
          />
          <RestaurantCard
            title={t("services.restaurant.vegetarian")}
            meals={menuData?.cibo}
            icon={"Vegan"}
          />
          <RestaurantCard
            title={t("services.restaurant.side_dishes")}
            meals={menuData?.accompMidi}
            icon={"Soup"}
          />
        </View>

        {menuData?.grilladesSoir && menuData?.accompSoir && (
          <View className="flex flex-col gap-4">
            <Text className="h3 ml-4">{t("services.restaurant.dinner")}</Text>

            <RestaurantCard
              title={t("services.restaurant.grill")}
              meals={menuData?.grilladesSoir}
              icon={"Beef"}
            />

            <RestaurantCard
              title={t("services.restaurant.side_dishes")}
              meals={menuData?.accompSoir}
              icon={"Soup"}
            />
          </View>
        )}
      </View>
    </Page>
  );
};

export default Restaurant;
