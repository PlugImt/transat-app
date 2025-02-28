import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import Loading from "@/components/custom/Loading";
import NotificationBell from "@/components/custom/NotificationBell";
import TraqCard from "@/components/custom/card/TraqCard";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const Traq = () => {
  const { t } = useTranslation();

  const {
    data: menu,
    isPending,
    refetch,
    error,
    isError,
  } = useRestaurantMenu();

  if (isPending) {
    return <Loading />;
  }

  const header = (
    <View className="flex-row gap-2 justify-between items-center">
      <View className="flex flex-row items-center gap-2">
        <Text className="h1 m-4">{t("services.traq.title")}</Text>
        <NotificationBell service={"TRAQ"} />
      </View>

      <AboutModal
        title={t("services.traq.title")}
        description={t("services.traq.about")}
        openingHours={t("services.traq.opening_hours")}
        location={t("services.traq.location")}
        additionalInfo={t("services.traq.additional_info")}
      />
    </View>
  );

  if (isError) {
    return (
      <Page refreshing={isPending} onRefresh={refetch}>
        {header}

        <View className="min-h-screen flex justify-center items-center ">
          <Text className="text-red-500 text-center h1">{error?.message}</Text>
        </View>
      </Page>
    );
  }

  return (
    <Page refreshing={isPending} onRefresh={refetch}>
      {header}

      <View className="flex flex-col gap-8">
        <View className="flex flex-col gap-4">
          <TraqCard
            image={
              "https://jumpseller.s3.eu-west-1.amazonaws.com/store/elvino-cl/assets/Kasteel.png"
            }
            name={"Kasteel Rouge"}
            description={
              "Bière belge alliant la force d’une brune et la douceur de la cerise. Gourmande et légèrement sucrée, elle offre une belle rondeur en bouche."
            }
            price={3}
            limited={true}
            alcohol={8}
          />

          <TraqCard
            image={
              "https://www.tempetedelouest.fr/wp-content/uploads/2023/09/logo-kerisac.png"
            }
            name={"Kerisac"}
            description={
              "Cidre breton artisanal, équilibré entre douceur et acidité. Ses arômes fruités et sa fine effervescence en font un incontournable."
            }
            price={2.5}
            alcohol={5.5}
          />

          <TraqCard
            image={
              "https://www.vanhonsebrouck.be/wp-content/uploads/external/70ed1eeb0e074191d0646ef029fa3223-1000x0-c-default.webp"
            }
            name={"Filou"}
            description={
              "Bière blonde belge aux notes maltées et épicées. Son équilibre entre douceur et amertume séduit les amateurs de caractère."
            }
            price={3}
            outOfStock={true}
            alcohol={8.5}
          />
        </View>
      </View>
    </Page>
  );
};

export default Traq;
