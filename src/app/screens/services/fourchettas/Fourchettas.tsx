import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useTranslation } from "react-i18next";

import { View, Image } from "react-native";

import { AboutModal } from "@/components/custom/AboutModal";
import {
  FourchettasEventCard,
  FourchettasEventCardLoading,
} from "./components/FourchettasEventCard";
import {
  getEventsUpcoming,
  GetOrderByPhoneAndEvent,
} from "@/api/endpoints/fourchettas/fourchettas.endpoints";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/account/useUser";
import type { Event, Order } from "@/dto";
import type { AppStackParamList } from "@/types";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { phoneWithoutSpaces } from "./utils/common";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const Fourchettas = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    getEventsUpcoming(
      () => {
        setLoading(true);
      },
      () => {},
      () => {
        setError(true);
      },
      (data: Event[]) => {
        const fetchOrderPromises = data.map(async (event) => {
          if (user?.phone_number && event.id) {
            return new Promise<void>((resolve) => {
              GetOrderByPhoneAndEvent(
                phoneWithoutSpaces(user?.phone_number),
                event.id,
                () => {},
                () => {},
                () => {
                  setError(true);
                },
                (orders: Order[]) => {
                  if (orders.length > 0) {
                    event.orderedOfUser = orders[0];
                  }
                  resolve();
                },
              );
            });
          }
          return Promise.resolve();
        });

        Promise.all(fetchOrderPromises).then(() => {
          setLoading(false);
          setEvents(data);
        });
      },
    );
  }, [user]);

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
        {error ? (
          <View className="flex flex-col items-center gap-4">
            <Image
              source={require("@/assets/images/services/fourchettas_dead.png")}
              style={{ width: 200, height: 200 }}
            />
            <Text className="text-center w-3/4" color="primary">
              {t("services.fourchettas.apiError")}
            </Text>
          </View>
        ) : loading ? (
          <>
            <FourchettasEventCardLoading />
            <FourchettasEventCardLoading />
          </>
        ) : events.length === 0 ? (
          <View className="flex flex-col items-center gap-4">
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
                navigation.navigate("FourchettasOrder", {
                  id: evt.id,
                  orderUser: evt.orderedOfUser,
                })
              }
            />
          ))
        )}
      </View>
    </Page>
  );
};

export default Fourchettas;
