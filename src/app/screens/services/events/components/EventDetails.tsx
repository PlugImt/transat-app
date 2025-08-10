import {
  type RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import CardGroup from "@/components/common/CardGroup";
import { UserCard, UserCardSkeleton } from "@/components/custom";
import ClubCard, { ClubCardSkeleton } from "@/components/custom/card/ClubCard";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useEventDetails } from "@/hooks/services/event/useEvent";
import type { AppStackParamList } from "@/types/navigation";
import {
  EventDetailsHeader,
  EventDetailsHeaderSkeleton,
} from "./EventDetailsHeader";

type NavigationProp = StackNavigationProp<{
  EventMemberList: { id: number };
}>;

export type EventDetailsRouteProp = RouteProp<
  AppStackParamList,
  "EventDetails"
>;

const EventDetails = () => {
  const { t } = useTranslation();
  const route = useRoute<EventDetailsRouteProp>();
  const { id } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const {
    data: event,
    isPending,
    isError,
    error,
    refetch,
  } = useEventDetails(id);

  if (isError) {
    return (
      <ErrorPage
        error={error}
        title={t("services.events.title")}
        refetch={refetch}
        isRefetching={isPending}
      />
    );
  }

  if (isPending) {
    return <EventDetailsSkeleton />;
  }

  if (!event) {
    return (
      <Page
        title={t("services.events.title")}
        refreshing={isPending}
        onRefresh={refetch}
      >
        <Empty
          title={t("services.events.errors.notFound")}
          description={t("services.events.errors.notFoundDescription")}
        />
      </Page>
    );
  }

  return (
    <Page
      title={t("services.events.title")}
      refreshing={isPending}
      onRefresh={refetch}
    >
      <EventDetailsHeader event={event} />
      <CardGroup title={t("services.events.organizer")}>
        <ClubCard club={event.club} size="sm" />
      </CardGroup>
      <CardGroup title={t("services.events.createdBy")}>
        <UserCard user={event.creator} />
      </CardGroup>
      <CardGroup
        title={t("services.events.peopleInterested")}
        onPress={() => {
          navigation.navigate("EventMemberList", { id: event.id });
        }}
      >
        <View className="gap-2">
          {event.attendees.slice(0, 3).map((attendee) => (
            <UserCard key={attendee.email} user={attendee} />
          ))}
        </View>
      </CardGroup>
    </Page>
  );
};

export default EventDetails;

export const EventDetailsSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Page title={t("services.events.title")}>
      <EventDetailsHeaderSkeleton />
      <CardGroup title={t("services.events.organizer")}>
        <ClubCardSkeleton size="sm" />
      </CardGroup>
      <CardGroup title={t("services.events.createdBy")}>
        <UserCardSkeleton />
      </CardGroup>
      <CardGroup title={t("services.events.peopleInterested")}>
        <View className="gap-2">
          <UserCardSkeleton />
          <UserCardSkeleton />
          <UserCardSkeleton />
        </View>
      </CardGroup>
    </Page>
  );
};
