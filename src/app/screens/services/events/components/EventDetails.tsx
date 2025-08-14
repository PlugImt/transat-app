import {
  type RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Edit, MoreVertical, Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { IconButton } from "@/components/common/Button";
import CardGroup from "@/components/common/CardGroup";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import { Text } from "@/components/common/Text";
import { UserCard, UserCardSkeleton } from "@/components/custom";
import ClubCard, { ClubCardSkeleton } from "@/components/custom/card/ClubCard";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { EventDetails as EventDetailsType } from "@/dto/event";
import {
  useDeleteEvent,
  useEventDetails,
} from "@/hooks/services/event/useEvent";
import type { AppStackParamList } from "@/types/navigation";
import {
  EventDetailsHeader,
  EventDetailsHeaderSkeleton,
} from "./EventDetailsHeader";

type NavigationProp = StackNavigationProp<{
  EventMemberList: { id: number };
  EditEvent: { id: number };
}>;

export type EventDetailsRouteProp = RouteProp<
  AppStackParamList,
  "EventDetails"
>;

type EventActionsProps = {
  event: EventDetailsType;
};

const EventActions = ({ event }: EventActionsProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  const handleEditEvent = () => {
    navigation.navigate("EditEvent", { id: event.id });
  };

  const handleDeleteEvent = () => {
    deleteEvent(event.id);
    navigation.goBack();
  };

  return (
    <>
      <DropdownMenuItem
        label={t("common.edit")}
        onPress={handleEditEvent}
        icon={<Edit size={16} color={theme.text} />}
      />
      <Dialog>
        <DialogTrigger>
          <DropdownMenuItem
            label={t("common.delete")}
            onPress={() => {}}
            variant="destructive"
            icon={<Trash2 size={16} color={theme.destructive} />}
            preventClose
          />
        </DialogTrigger>
        <DialogContent
          title={t("services.events.delete.title")}
          cancelLabel={t("services.events.delete.cancel")}
          confirmLabel={t("services.events.delete.confirm")}
          onCancel={() => {}}
          onConfirm={handleDeleteEvent}
          isPending={isDeleting}
          disableConfirm={isDeleting}
        >
          <Text>{t("services.events.delete.description")}</Text>
        </DialogContent>
      </Dialog>
    </>
  );
};

const EventDetails = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
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

  const eventActions = (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton
          icon={<MoreVertical size={20} color={theme.text} />}
          variant="ghost"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <EventActions event={event} />
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Page
      title={t("services.events.title")}
      refreshing={isPending}
      onRefresh={refetch}
      header={eventActions}
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
