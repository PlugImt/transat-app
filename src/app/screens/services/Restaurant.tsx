import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";
import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import RestaurantCard from "@/components/custom/card/RestaurantCard";
import { useTheme } from "@/contexts/ThemeContext";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { isWeekend, outOfService } from "@/lib/utils";

export const Restaurant = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const {
    data: menu,
    isPending,
    refetch,
    error,
    isError,
  } = useRestaurantMenu();

  const weekend: boolean = useMemo(() => isWeekend(), []);
  const outOfHours: boolean = useMemo(
    () => (menu?.updated_date ? outOfService(menu.updated_date) : false),
    [menu?.updated_date],
  );

  const openingHoursData = [
    {
      day: " ",
      lunch: t("services.restaurant.lunch"),
      dinner: t("services.restaurant.dinner"),
    },
    {
      day: t("common.days.monday"),
      lunch: "11h30-13h30",
      dinner: "18h30-19h45",
    },
    {
      day: t("common.days.tuesday"),
      lunch: "11h30-13h30",
      dinner: "18h30-19h45",
    },
    {
      day: t("common.days.wednesday"),
      lunch: "11h30-13h30",
      dinner: "18h30-19h45",
    },
    {
      day: t("common.days.thursday"),
      lunch: "11h30-13h30",
      dinner: "18h30-19h45",
    },
    {
      day: t("common.days.friday"),
      lunch: "11h30-13h30",
      dinner: t("services.restaurant.closed"),
    },
    {
      day: t("common.days.weekend"),
      lunch: t("services.restaurant.closed"),
      dinner: t("services.restaurant.closed"),
    },
  ];

  if (isPending) {
    return <RestaurantLoading />;
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
      {/*{header}*/}

      <View className="flex flex-col gap-8">
        <View className="flex flex-col gap-4">
          <Text className="h3 ml-4" style={{ color: theme.text }}>
            {t("services.restaurant.lunch")}
          </Text>

          {menu?.grilladesMidi && menu.grilladesMidi.length > 0 && (
            <RestaurantCard
              title={t("services.restaurant.grill")}
              meals={menu.grilladesMidi}
              icon={"Beef"}
            />
          )}
          {menu?.migrateurs && menu.migrateurs.length > 0 && (
            <RestaurantCard
              title={t("services.restaurant.migrator")}
              meals={menu.migrateurs}
              icon={"ChefHat"}
            />
          )}
          {menu?.cibo && menu.cibo.length > 0 && (
            <RestaurantCard
              title={t("services.restaurant.vegetarian")}
              meals={menu.cibo}
              icon={"Vegan"}
            />
          )}
          {menu?.accompMidi && menu.accompMidi.length > 0 && (
            <RestaurantCard
              title={t("services.restaurant.sideDishes")}
              meals={menu.accompMidi}
              icon={"Soup"}
            />
          )}
        </View>

        {(menu?.grilladesSoir?.length ?? 0) > 0 ||
        (menu?.accompSoir?.length ?? 0) > 0 ? (
          <View className="flex flex-col gap-4">
            <Text className="h3 ml-4" style={{ color: theme.text }}>
              {t("services.restaurant.dinner")}
            </Text>

            {menu?.grilladesSoir && menu.grilladesSoir.length > 0 && (
              <RestaurantCard
                title={t("services.restaurant.grill")}
                meals={menu.grilladesSoir}
                icon={"Beef"}
              />
            )}
            {menu?.accompSoir && menu.accompSoir.length > 0 && (
              <RestaurantCard
                title={t("services.restaurant.sideDishes")}
                meals={menu.accompSoir}
                icon={"Soup"}
              />
            )}
          </View>
        ) : null}
      </View>
    </Page>
  );
};

export default Restaurant;

const RestaurantLoading = () => {
  const { t } = useTranslation();

  const openingHoursData = [
    {
      day: " ",
      lunch: t("services.restaurant.lunch"),
      dinner: t("services.restaurant.dinner"),
    },
    {
      day: t("common.days.monday"),
      lunch: "11h30-13h30",
      dinner: "18h30-19h45",
    },
    {
      day: t("common.days.tuesday"),
      lunch: "11h30-13h30",
      dinner: "18h30-19h45",
    },
    {
      day: t("common.days.wednesday"),
      lunch: "11h30-13h30",
      dinner: "18h30-19h45",
    },
    {
      day: t("common.days.thursday"),
      lunch: "11h30-13h30",
      dinner: "18h30-19h45",
    },
    {
      day: t("common.days.friday"),
      lunch: "11h30-13h30",
      dinner: t("services.restaurant.closed"),
    },
    {
      day: t("common.days.weekend"),
      lunch: t("services.restaurant.closed"),
      dinner: t("services.restaurant.closed"),
    },
  ];

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
