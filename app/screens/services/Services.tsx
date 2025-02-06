import Page from "@/app/components/common/Page";
import type { AppStackParamList } from "@/app/services/storage/types";
import Card from "@/components/common/Card";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const Services = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();

  return (
    <Page>
      <Text className="h1 m-4">{t("services.services")}</Text>

      <Card
        image={require("@/assets/images/Logos/machine_large.png")}
        // animation={require('@/assets/animations/washing_machine.json')}
        onPress={() => navigation.navigate("WashingMachine")}
      />
      <Card
        image={require("@/assets/images/Logos/restaurant_large.png")}
        onPress={() => navigation.navigate("Restaurant")}
      />
      <Card
        image={require("@/assets/images/Logos/clubs_large.png")}
        onPress={() => navigation.navigate("Clubs")}
      />
      <Card
        image={require("@/assets/images/Logos/traq_large.png")}
        onPress={() => navigation.navigate("Traq")}
      />
      <Card
        image={require("@/assets/images/Logos/velo_large.png")}
        onPress={() => navigation.navigate("WashingMachine")}
      />
      <View style={{ height: 50 }} />
      {/*<Button title={t('services.market')} onPress={() => console.log('Restaurant')}/>*/}
      {/*<Button title={t('services.reservations')} onPress={() => console.log('Restaurant')}/>*/}
      {/*<Button title={t('services.events')} onPress={() => console.log('Restaurant')}/>*/}
    </Page>
  );
};

export default Services;
