import type { BottomTabNavigationProp } from "expo-router/build/react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "expo-router/build/react-navigation/native-stack";
import { router } from "expo-router";
import {
  type CompositeNavigationProp,
  useNavigation,
} from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { AboutModal } from "@/components/custom/AboutModal";
import { Page } from "@/components/page/Page";
import { useUser } from "@/hooks/account/useUser";
import { useEventsUpcomingPhone } from "@/hooks/services/fourchettas/useFourchettas";
import type { AppStackParamList, BottomTabParamList } from "@/types";
import {
  FourchettasEventCard,
  FourchettasEventCardLoading,
} from "./components/FourchettasEventCard";
import { phoneWithoutSpaces } from "./utils/common";

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AppStackParamList>,
  BottomTabNavigationProp<BottomTabParamList>
>;
export const Fourchettas = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const {
    data: events = [],
    isLoading,
    isError,
  } = useEventsUpcomingPhone(phoneWithoutSpaces(user?.phone_number ?? ""));

  if (!user?.phone_number || user?.phone_number === "") {
    return (
      <Page title={t("services.fourchettas.title")} className="h-full">
        <View className="items-center gap-4 h-full justify-center">
          <Image
            source={require("@/assets/images/services/fourchettas_dead.png")}
            style={{ width: 200, height: 200 }}
          />
          <Text className="text-center w-3/4">
            {t("services.fourchettas.noPhoneNumber")}
          </Text>
          <Button
            variant="default"
            onPress={() => {
              router.push("/(app)/(tabs)/(account)/EditProfile");
            }}
            label={t("services.fourchettas.addPhoneNumberButton")}
          />
        </View>{" "}
      </Page>
    );
  }

  if (isLoading) {
    return (
      <Page title={t("services.fourchettas.title")} className="h-full">
        <View className="w-full items-center gap-4">
          <FourchettasEventCardLoading />
        </View>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page title={t("services.fourchettas.title")} className="h-full">
        <View className="items-center gap-4 h-full justify-center">
          <Image
            source={require("@/assets/images/services/fourchettas_dead.png")}
            className="w-32 h-32"
          />
          <Text className="text-center w-3/4" color="warning">
            {t("services.fourchettas.apiError")}
          </Text>
        </View>
      </Page>
    );
  }

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
      className="gap-6"
    >
      <Text variant="h2">{t("services.fourchettas.nextEvent")}</Text>
      <View className="min-w-full w-full flex items-center gap-4">
        {events.length === 0 ? (
          <View className="items-center gap-4">
            <Image
              source={require("@/assets/images/services/fourchettas.png")}
              style={{ width: 200, height: 200 }}
            />
            <Text className="text-center" color="primary">
              {t("services.fourchettas.noEvents")}
            </Text>
          </View>
        ) : (
          events.map((evt) => (
            <FourchettasEventCard
              key={evt.id}
              event={evt}
              onPress={() =>
                navigation.navigate(
                  "FourchettasOrder",
                  {
                    id: evt.id,
                    orderUser: JSON.stringify(evt.orderuser),
                  } as never,
                )
              }
            />
          ))
        )}
      </View>
    </Page>
  );
};

export default Fourchettas;
