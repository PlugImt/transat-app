import { useNavigation } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import CardGroup from "@/components/common/CardGroup";
import { WidgetBoundary } from "@/components/query";
import { useClubEvents } from "@/hooks/services/event/useEvent";
import type { AppNavigation } from "@/types";
import { EventCard, EventCardSkeleton } from "../components/EventCard";

export const ClubEventWidget = ({ clubId }: { clubId: number }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigation>();
  const { data, isPending, isFetching, isError, error, refetch } = useClubEvents(
    clubId,
    "upcoming",
  );

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
      loading={<ClubEventWidgetSkeleton />}
      isEmpty={!data?.length}
    >
      <CardGroup
        title={t("services.events.title")}
        onPress={
          data && data.length > 3
            ? () => navigation.navigate("ClubEvents", { id: clubId })
            : undefined
        }
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

export const ClubEventWidgetSkeleton = () => {
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
