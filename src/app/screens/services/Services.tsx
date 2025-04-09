import Card from "@/components/common/Card";
import Page from "@/components/common/Page";
import type { AppStackParamList } from "@/services/storage/types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const Services = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();

  return (
    <Page>
      <Text className="h1 m-4">{t("services.title")}</Text>

      <Card
        image={require("@/assets/images/Logos/machine_large.png")}
        // animation={require('@/assets/animations/washingMachine.json')}
        onPress={() => navigation.navigate("WashingMachine")}
      />
      <Card
        image={require("@/assets/images/Logos/restaurant_large.png")}
        onPress={() => navigation.navigate("Restaurant")}
      />
      {/*<Card*/}
      {/*  image={require("@/assets/images/Logos/clubs_large.png")}*/}
      {/*  onPress={() => navigation.navigate("Clubs")}*/}
      {/*/>*/}
      <Card
        image={require("@/assets/images/Logos/traq_large.png")}
        onPress={() => navigation.navigate("Traq")}
      />
      {/*<Card*/}
      {/*  image={require("@/assets/images/Logos/velo_large.png")}*/}
      {/*  onPress={() => navigation.navigate("WashingMachine")}*/}
      {/*/>*/}
      <View style={{ height: 50 }} />
    </Page>
  );
};

export default Services;
