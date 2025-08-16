import { type RouteProp, useRoute } from "@react-navigation/native";
import { PartyPopper } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { RefreshControl } from "react-native";
import Animated from "react-native-reanimated";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { HEADER_HEIGHT } from "@/components/page/Header";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { Event } from "@/dto/event";
import { useClubEventsByTab } from "@/hooks/services/event/useEvent";
import type { BottomTabParamList } from "@/types/navigation";
import { EventCard, EventCardSkeleton } from "./components/EventCard";

export type ClubEventsRouteProp = RouteProp<BottomTabParamList, "ClubEvents">;

const ClubEventsTabContent = ({
  tabValue,
  clubId,
}: {
  tabValue: "upcoming" | "past";
  clubId: number;
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { events, isPending, isError, error, refetch } = useClubEventsByTab(
    clubId,
    tabValue,
  );

  if (isPending) {
    return <ClubEventsSkeleton />;
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

  const flatListProps = {
    renderItem: ({ item }: { item: Event }) => <EventCard event={item} />,
    keyExtractor: (item: Event) => String(item.id),
    contentContainerClassName: "gap-2",
    showsVerticalScrollIndicator: false,
    onRefresh: () => refetch(),
    refreshing: isPending,
    refreshControl: (
      <RefreshControl
        refreshing={isPending}
        onRefresh={refetch}
        tintColor={theme.text}
        colors={[theme.primary]}
        progressViewOffset={HEADER_HEIGHT}
      />
    ),
    ListHeaderComponent: (
      <TabsList className="mb-4">
        <TabsTrigger value="upcoming" title={t("services.events.upcoming")} />
        <TabsTrigger value="past" title={t("services.events.past")} />
      </TabsList>
    ),
  } as const;

  const getEmptyComponent = () => {
    if (tabValue === "upcoming") {
      return (
        <Empty
          icon={<PartyPopper />}
          title={t("services.events.errors.emptyUpcoming")}
          description={t("services.events.errors.emptyUpcomingDescription")}
        />
      );
    }
    return (
      <Empty
        icon={<PartyPopper />}
        title={t("services.events.errors.emptyPast")}
        description={t("services.events.errors.emptyPastDescription")}
      />
    );
  };

  return (
    <Animated.FlatList
      {...flatListProps}
      data={events || []}
      ListEmptyComponent={getEmptyComponent()}
    />
  );
};

export const ClubEvents = () => {
  const { t } = useTranslation();
  const route = useRoute<ClubEventsRouteProp>();
  const { id } = route.params;

  return (
    <Page
      title={t("services.events.title")}
      className="gap-4 flex-1"
      style={{ paddingBottom: 0 }}
      disableScroll
    >
      <Tabs defaultValue="upcoming">
        <TabsContent value="upcoming">
          <ClubEventsTabContent tabValue="upcoming" clubId={id} />
        </TabsContent>

        <TabsContent value="past">
          <ClubEventsTabContent tabValue="past" clubId={id} />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default ClubEvents;

const ClubEventsSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Animated.FlatList
      data={Array.from({ length: 10 })}
      renderItem={() => <EventCardSkeleton />}
      contentContainerStyle={{ gap: 8 }}
      ListHeaderComponent={
        <TabsList>
          <TabsTrigger value="upcoming" title={t("services.events.upcoming")} />
          <TabsTrigger value="past" title={t("services.events.past")} />
        </TabsList>
      }
    />
  );
};
