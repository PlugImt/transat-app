import { useNavigation } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import CardGroup from "@/components/common/CardGroup";
import { useAssociationEvents } from "@/hooks/services/event/useEvent";
import type { AppNavigation } from "@/types";
import { EventCard, EventCardSkeleton } from "../components/EventCard";

export const AssociationEventWidget = ({ associationId }: { associationId: number }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigation>();
  const { data, isPending, isError } = useAssociationEvents(associationId, "upcoming");

  if (isPending) {
    return <AssociationEventWidgetSkeleton />;
  }

  if (isError || !data || data.length === 0) {
    return null;
  }

  return (
    <CardGroup
      title={t("services.events.title")}
      onPress={
        data.length > 3
          ? () => navigation.navigate("AssociationEvents", { id: associationId })
          : undefined
      }
    >
      <View className="gap-2">
        {data?.slice(0, 3).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </View>
    </CardGroup>
  );
};

export const AssociationEventWidgetSkeleton = () => {
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
