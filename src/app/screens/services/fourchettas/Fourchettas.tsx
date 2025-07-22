import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useTranslation } from "react-i18next";

import { View } from "react-native";

import { AboutModal } from "@/components/custom/AboutModal";
import FourchettasEventCard from "@/components/custom/card/FourchettasEventCard";
import { FourchettasEventCardLoading } from "@/components/custom/card/FourchettasEventCard";

import { getEventsUpcoming } from "@/api/endpoints/fourchettas/fourchettas.endpoints";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/account/useUser";
import type { Event } from "@/dto";
import type { AppStackParamList } from "@/types";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type AppScreenNavigationProp = StackNavigationProp<AppStackParamList>;

export const Fourchettas = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const navigation = useNavigation<AppScreenNavigationProp>();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventsUpcoming(
      () => {
        setLoading(true);
      },
      () => {},
      () => {},
      (data: Event[]) => {
        setEvents(data);
        setLoading(false);
      },
    );
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
        {loading ? (
          <>
            <FourchettasEventCardLoading />
            <FourchettasEventCardLoading />
          </>
        ) : events.length === 0 ? (
          <Text className="text-center" color="muted">
            {t("services.fourchettas.noEvents")}
          </Text>
        ) : null}
        {events.map((event) => (
          <FourchettasEventCard
            key={event.id}
            image={event.img_url}
            title={event.title}
            description={event.description}
            date={event.date}
            time={event.time}
            form_closing_date={event.form_closing_date}
            form_closing_time={event.form_closing_time}
            onPress={() =>
              navigation.navigate("FourchettasOrder", { id: event.id })
            }
          />
        ))}
      </View>
    </Page>
  );
};

export default Fourchettas;
