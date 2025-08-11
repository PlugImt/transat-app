import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { PartyPopper, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { RefreshControl } from "react-native";
import Animated from "react-native-reanimated";
import { IconButton } from "@/components/common/Button";
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
import { useEventsWithTabs } from "@/hooks/services/event/useEvent";
import { EventCard, EventCardSkeleton } from "./components/EventCard";

type NavigationProp = StackNavigationProp<{
  AddEvent: undefined;
}>;

const EventsTabContent = ({ tabValue }: { tabValue: "upcoming" | "past" }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { events, isPending, refetch, activeTab } = useEventsWithTabs();

  const shouldLoadData = activeTab === tabValue;
  const displayEvents = shouldLoadData ? events : [];

  const flatListProps = {
    renderItem: ({ item }: { item: Event }) => <EventCard event={item} />,
    keyExtractor: (item: Event) => String(item.id),
    contentContainerClassName: "gap-2",
    showsVerticalScrollIndicator: false,
    onRefresh: () => refetch(),
    refreshing: isPending && shouldLoadData,
    refreshControl: (
      <RefreshControl
        refreshing={isPending && shouldLoadData}
        onRefresh={refetch}
        tintColor={theme.text}
        colors={[theme.primary]}
        progressViewOffset={HEADER_HEIGHT}
      />
    ),
    ListHeaderComponent: (
      <TabsList>
        <TabsTrigger value="upcoming" title={t("services.events.upcoming")} />
        <TabsTrigger value="past" title={t("services.events.past")} />
      </TabsList>
    ),
  };

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
      data={displayEvents}
      ListEmptyComponent={getEmptyComponent()}
    />
  );
};

export const Events = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const { isPending, isError, error, refetch } = useEventsWithTabs();

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
    <Page
      title={t("services.events.title")}
      className="gap-4"
      style={{ paddingBottom: 0 }}
      disableScroll
      header={
        <IconButton
          icon={<Plus color={theme.primary} />}
          variant="link"
          onPress={() => navigation.navigate("AddEvent")}
        />
      }
    >
      <Tabs defaultValue="upcoming">
        <TabsContent value="upcoming">
          <EventsTabContent tabValue="upcoming" />
        </TabsContent>

        <TabsContent value="past">
          <EventsTabContent tabValue="past" />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default Events;

const EventsSkeleton = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  return (
    <Tabs defaultValue="upcoming">
      <Page
        title={t("services.events.title")}
        className="gap-4"
        style={{ paddingBottom: 0 }}
        disableScroll
        header={
          <IconButton
            icon={<Plus color={theme.primary} />}
            variant="link"
            onPress={() => navigation.navigate("AddEvent")}
          />
        }
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
