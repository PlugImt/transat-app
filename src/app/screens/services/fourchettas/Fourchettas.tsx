import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useTranslation } from "react-i18next";

import { Image, View } from "react-native";

import { AboutModal } from "@/components/custom/AboutModal";
import FourchettasEventCard from "@/components/custom/card/FourchettasEventCard";

import {getEventsUpcoming} from "@/api/endpoints/fourchettas/fourchettas.endpoints";
import { useEffect } from "react";
//import type { Event } from "@/dto";
export const Fourchettas = () => {
    const { t } = useTranslation();

    useEffect(() => {
        getEventsUpcoming(
            () => console.log("Request started"),
            () => console.log("Request ended"),
        ).then((events) => {
            console.log("Fetched events:", events);
        }).catch((error) => {
            console.error("Error fetching events:", error);
        });
    }, []);
    
  return (
    <Page
          title={t("services.fourchettas.title")}
          header={
            <AboutModal
              title={t("services.fourchettas.title")}
              description={t("services.fourchettas.about")}
              additionalInfo={t("services.fourchettas.additionalInfo")}
            />
          }
          className="flex min-w-full flex-col justify-center items-center gap-8 p-4"
        >
          <View className=" flex flex-row justify-start items-center gap-8 p-8">
            <Image
              source={require("@/assets/images/services/fourchettas.png")}
              className="w-10 h-10"
              resizeMode="contain"
            />
    
            <View className="gap-4 max-w-md">
              <Text variant="h1" className="text-center">
                {t("services.fourchettas.welcome")}
              </Text>
    
              <Text className="text-center" color="muted">
                {t("services.fourchettas.description")}
              </Text>
                </View>
          </View>
            <View className="min-w-full w-full flex items-center gap-4">
            <FourchettasEventCard
              image="https://static.vecteezy.com/system/resources/previews/044/776/845/non_2x/chicken-isolated-on-transparent-background-png.png"
              title= "Los Pollos Hermanos"
              description="du bon poulet"
              date="2023-10-01"
              time="18:00"
              form_closing_date="2023-09-30"
              form_closing_time="17:00"
              onPress={() => console.log("Order command ...")}
            />
            </View>
        </Page>
  );
};

export default Fourchettas;
