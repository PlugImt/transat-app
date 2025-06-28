import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Page } from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import RestaurantCard from "@/components/custom/card/RestaurantCard";
import { getOpeningHoursData } from "@/utils";

export const LoadingState = () => {
  const { t } = useTranslation();
  const openingHoursData = useMemo(() => getOpeningHoursData(t), [t]);

  return (
    <Page
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
      <View className="flex flex-col gap-8">
        <View className="flex flex-col gap-4">
          <Text className="h3 ml-4">{t("services.restaurant.lunch")}</Text>

          <RestaurantCard
            title={t("services.restaurant.grill")}
            icon={"Beef"}
          />
          <RestaurantCard
            title={t("services.restaurant.migrator")}
            icon={"ChefHat"}
          />
          <RestaurantCard
            title={t("services.restaurant.vegetarian")}
            icon={"Vegan"}
          />
          <RestaurantCard
            title={t("services.restaurant.sideDishes")}
            icon={"Soup"}
          />
        </View>

        <View className="flex flex-col gap-4">
          <Text className="h3 ml-4">{t("services.restaurant.dinner")}</Text>
          <RestaurantCard
            title={t("services.restaurant.grill")}
            icon={"Beef"}
          />
          <RestaurantCard
            title={t("services.restaurant.sideDishes")}
            icon={"Soup"}
          />
        </View>
      </View>
    </Page>
  );
};
