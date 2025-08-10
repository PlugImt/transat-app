import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { ChevronRight, Clock, MapPin } from "lucide-react-native";
import { View } from "react-native";
import Card from "@/components/common/Card";
import Image from "@/components/common/Image";
import { Text } from "@/components/common/Text";
import { UserStack, UserStackSkeleton } from "@/components/custom";
import { TextSkeleton } from "@/components/Skeleton";
import ImageSkeleton from "@/components/Skeleton/ImageSkeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { Event } from "@/dto/event";
import { useDate } from "@/hooks/common";

type NavigationProp = StackNavigationProp<{
  EventDetails: { id: number };
}>;

type EventCardProps = {
  event: Event;
};

export const EventCard = ({ event }: EventCardProps) => {
  const { theme } = useTheme();
  const { formatWeekday, formatTime } = useDate();
  const navigation = useNavigation<NavigationProp>();

  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  return (
    <Card
      className="flex-row items-center gap-0"
      onPress={() => {
        navigation.navigate("EventDetails", { id: event.id });
      }}
    >
      <View className="flex-1 flex-row items-center gap-4">
        <Image source={event.picture} className="rounded-md" size={100} />
        <View className="gap-2 flex-1">
          <View>
            <Text variant="h3">{event.name}</Text>
            <Text variant="sm" color="primary">
              {formatWeekday(startDate).toLowerCase()}
            </Text>
          </View>
          <View className="flex-row items-center gap-x-2 flex-wrap">
            <View className="flex-row items-center gap-1">
              <MapPin color={theme.muted} size={14} />
              <Text variant="sm" color="muted">
                {event.location}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock color={theme.muted} size={14} />
              <Text variant="sm" color="muted">
                {formatTime(startDate)} — {formatTime(endDate)}
              </Text>
            </View>
          </View>
          <UserStack
            pictures={event.member_photos}
            borderColor="card"
            count={event.attendee_count}
            size="sm"
            moreTextColor="muted"
          />
        </View>
      </View>
      <ChevronRight color={theme.muted} />
    </Card>
  );
};

export const EventCardSkeleton = () => {
  const { theme } = useTheme();
  return (
    <Card className="flex-row items-center gap-0">
      <View className="flex-1 flex-row items-center gap-4">
        <ImageSkeleton size={100} />
        <View className="gap-2 flex-1">
          <View>
            <TextSkeleton variant="h3" lastLineWidth="100%" />
            <TextSkeleton variant="sm" lastLineWidth={80} />
          </View>
          <View className="flex-row items-center gap-x-2 flex-wrap">
            <View className="flex-row items-center gap-1">
              <MapPin color={theme.muted} size={14} />
              <TextSkeleton variant="sm" lastLineWidth={60} />
            </View>
            <View className="flex-row items-center gap-1">
              <Clock color={theme.muted} size={14} />
              <TextSkeleton variant="sm" lastLineWidth={60} />
            </View>
          </View>
          <UserStackSkeleton size="sm" borderColor="card" />
        </View>
      </View>
      <ChevronRight color={theme.muted} />
    </Card>
  );
};
