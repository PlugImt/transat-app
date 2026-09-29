import { useNavigation } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import CardGroup from "@/components/common/CardGroup";
import { WidgetBoundary } from "@/components/query";
import { useEvents } from "@/hooks/services/event/useEvent";
import type { AppNavigation } from "@/types";
import { EventCard, EventCardSkeleton } from "../components/EventCard";

export const EventWidget = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigation>();
  const { data, isPending, isFetching, isError, error, refetch } =
    useEvents("upcoming");

  return (
    <WidgetBoundary
      title={t("services.events.title")}
      query={{
        isPending,
        isFetching,
        isError,
        error,
        refetch,
      }}
      loading={<EventWidgetSkeleton />}
      isEmpty={!data?.length}
    >
      <CardGroup
        title={t("services.events.title")}
        onPress={() => {
          navigation.navigate("Events");
        }}
      >
        <View className="gap-2">
          {data?.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>
      </CardGroup>
    </WidgetBoundary>
  );
};

export const EventWidgetSkeleton = () => {
  const { t } = useTranslation();
  return (
    <CardGroup title={t("services.events.title")}>
      <View className="gap-2">
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
      </View>
    </CardGroup>
  );
};
