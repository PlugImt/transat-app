import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import EmploiDuTempsCard from "@/components/custom/card/EmploiDuTempsCard";
import { useEmploiDuTemps } from "@/hooks/useEmploiDuTemps";
import { isWeekend, outOfService } from "@/lib/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

export const EmploiDuTemps = () => {
  const { t } = useTranslation();

  const {
    data: menu,
    isPending,
    refetch,
    error,
    isError,
  } = useEmploiDuTemps();

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
    return <EmploiDuTempsLoading />;
  }

  if (weekend) {
    return (
      <Page
        refreshing={isPending}
        onRefresh={refetch}
        title={t("services.emploiDuTemps.title")}
        about={
          <AboutModal
            title={t("services.emploiDuTemps.title")}
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
          <Text className="h1 text-center">
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
            <Text className="h1 text-center">
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
          <Text className="h3 ml-4">{t("services.restaurant.lunch")}</Text>
        </View>
          <View className="flex flex-col gap-4">
            <Text className="h3 ml-4">{t("services.restaurant.dinner")}</Text>
              <EmploiDuTempsCard
                title={t("services.restaurant.grill")}
                icon={"Beef"}
              />
          </View>
      </View>
    </Page>
  );
};

export default EmploiDuTemps;

const EmploiDuTempsLoading = () => {
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

          <EmploiDuTempsCard
            title={t("services.restaurant.grill")}
            icon={"Beef"}
          />
          <EmploiDuTempsCard
            title={t("services.restaurant.migrator")}
            icon={"ChefHat"}
          />
          <EmploiDuTempsCard
            title={t("services.restaurant.vegetarian")}
            icon={"Vegan"}
          />
          <EmploiDuTempsCard
            title={t("services.restaurant.sideDishes")}
            icon={"Soup"}
          />
        </View>

        <View className="flex flex-col gap-4">
          <Text className="h3 ml-4">{t("services.restaurant.dinner")}</Text>
          <EmploiDuTempsCard
            title={t("services.restaurant.grill")}
            icon={"Beef"}
          />
          <EmploiDuTempsCard
            title={t("services.restaurant.sideDishes")}
            icon={"Soup"}
          />
        </View>
      </View>
    </Page>
  );
};
