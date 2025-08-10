import { PartyPopper } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useEvents } from "@/hooks/services/event/useEvent";
import { EventCard, EventCardSkeleton } from "./components/EventCard";

export const Events = () => {
  const { t } = useTranslation();
  const {
    data: upcomingEvents,
    isPending: isUpcomingPending,
    isError: isUpcomingError,
    error: upcomingError,
    refetch: refetchUpcoming,
  } = useEvents("upcoming");
  const {
    data: pastEvents,
    isPending: isPastPending,
    isError: isPastError,
    error: pastError,
    refetch: refetchPast,
  } = useEvents("past");

  const isPending = isUpcomingPending || isPastPending;
  const isError = isUpcomingError || isPastError;
  const error = upcomingError || pastError;
  const refetch = () => {
    refetchUpcoming();
    refetchPast();
  };

  if (isPending) {
    return <EventsSkeleton />;
  }

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

  return (
    <Tabs defaultValue="upcoming">
      <Page
        title={t("services.events.title")}
        refreshing={isPending}
        onRefresh={refetch}
        className="gap-4"
        style={{ paddingBottom: 0 }}
        disableScroll
      >
        <TabsContent value="upcoming">
          <Animated.FlatList
            data={upcomingEvents}
            renderItem={({ item }) => <EventCard event={item} />}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ gap: 8 }}
            ListHeaderComponent={
              <TabsList>
                <TabsTrigger
                  value="upcoming"
                  title={t("services.events.upcoming")}
                />
                <TabsTrigger value="past" title={t("services.events.past")} />
              </TabsList>
            }
            ListEmptyComponent={
              <Empty
                icon={<PartyPopper />}
                title={t("services.events.errors.emptyUpcoming")}
                description={t(
                  "services.events.errors.emptyUpcomingDescription",
                )}
              />
            }
          />
        </TabsContent>

        <TabsContent value="past">
          <Animated.FlatList
            data={pastEvents}
            renderItem={({ item }) => <EventCard event={item} />}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ gap: 8 }}
            ListHeaderComponent={
              <TabsList>
                <TabsTrigger
                  value="upcoming"
                  title={t("services.events.upcoming")}
                />
                <TabsTrigger value="past" title={t("services.events.past")} />
              </TabsList>
            }
            ListEmptyComponent={
              <Empty
                icon={<PartyPopper />}
                title={t("services.events.errors.emptyPast")}
                description={t("services.events.errors.emptyPastDescription")}
              />
            }
          />
        </TabsContent>
      </Page>
    </Tabs>
  );
};

export default Events;

const EventsSkeleton = () => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="upcoming">
      <Page
        title={t("services.events.title")}
        className="gap-4"
        style={{ paddingBottom: 0 }}
        disableScroll
      >
        <TabsContent value="upcoming">
          <Animated.FlatList
            data={Array.from({ length: 10 })}
            renderItem={() => <EventCardSkeleton />}
            contentContainerStyle={{ gap: 8 }}
            ListHeaderComponent={
              <TabsList>
                <TabsTrigger
                  value="upcoming"
                  title={t("services.events.upcoming")}
                />
                <TabsTrigger value="past" title={t("services.events.past")} />
              </TabsList>
            }
          />
        </TabsContent>

        <TabsContent value="past">
          <Animated.FlatList
            data={Array.from({ length: 10 })}
            renderItem={() => <EventCardSkeleton />}
            contentContainerStyle={{ gap: 8 }}
            ListHeaderComponent={
              <TabsList>
                <TabsTrigger
                  value="upcoming"
                  title={t("services.events.upcoming")}
                />
                <TabsTrigger value="past" title={t("services.events.past")} />
              </TabsList>
            }
          />
        </TabsContent>
      </Page>
    </Tabs>
  );
};
