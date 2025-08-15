import { useRoute } from "@react-navigation/native";
import {
  Bell,
  BellOff,
  Clock,
  ExternalLink,
  MapPin,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Linking, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Button } from "@/components/common/Button";
import Image from "@/components/common/Image";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { EventDetails } from "@/dto/event";
import { useDate } from "@/hooks/common";
import { useAnimatedHeaderContext } from "@/hooks/common/useAnimatedHeader";
import {
  useJoinClubMutation,
  useLeaveClubMutation,
} from "@/hooks/services/club/useClub";
import type { EventDetailsRouteProp } from "./EventDetails";

interface NotificationButtonProps {
  isMember: boolean;
  disabled?: boolean;
}

const NotificationButton = ({
  isMember,
  disabled,
}: NotificationButtonProps) => {
  const { t } = useTranslation();
  const route = useRoute<EventDetailsRouteProp>();
  const { id } = route.params;

  const { mutate: joinClub, isPending: isJoining } = useJoinClubMutation(id);
  const { mutate: leaveClub, isPending: isLeaving } = useLeaveClubMutation(id);

  if (isMember) {
    return (
      <Button
        label={t("user.notInterested")}
        onPress={() => leaveClub()}
        icon={<BellOff />}
        className="flex-1"
        disabled={disabled}
        isUpdating={isJoining || isLeaving}
      />
    );
  }
  return (
    <Button
      label={t("user.interested")}
      onPress={() => joinClub()}
      icon={<Bell />}
      className="flex-1"
      disabled={disabled}
      isUpdating={isJoining || isLeaving}
    />
  );
};

interface EventDetailsHeaderProps {
  event: EventDetails;
}

export const EventDetailsHeader = ({ event }: EventDetailsHeaderProps) => {
  const { name: title, description, location, link } = event;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { formatTime, formatAgo } = useDate();
  const animatedHeaderCtx = useAnimatedHeaderContext();

  const BANNER_MAX_HEIGHT = 200;
  const BANNER_MIN_HEIGHT = 96;

  const bannerStyle = useAnimatedStyle(() => {
    const y = animatedHeaderCtx?.scrollY ? animatedHeaderCtx.scrollY.value : 0;
    const raw = BANNER_MAX_HEIGHT - y * 0.6;
    const height = Math.min(
      BANNER_MAX_HEIGHT,
      Math.max(BANNER_MIN_HEIGHT, raw),
    );
    return { height };
  });

  const label = link?.toLowerCase().includes("whatsapp")
    ? "WhatsApp"
    : String(t("common.link"));

  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : undefined;
  const rangeDate = endDate
    ? `${formatTime(startDate)} — ${formatTime(endDate)}`
    : formatTime(startDate);

  return (
    <View className="gap-4">
      {event.picture && (
        <Animated.View
          style={[bannerStyle]}
          className="w-full overflow-hidden rounded-xl"
        >
          <Image source={event.picture} fill resizeMode="cover" />
        </Animated.View>
      )}
      <View>
        <Text variant="h2">{title}</Text>
        <Text variant="lg" color="primary">
          {formatAgo(startDate).toLowerCase()}
        </Text>
        {description && <Text color="muted">{description}</Text>}
      </View>
      <View className="flex-row items-center gap-2 justify-between flex-wrap">
        <View className="flex-row items-center gap-1">
          <MapPin color={theme.text} size={20} />
          <Text>{location}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Clock color={theme.text} size={20} />
          <Text>{rangeDate}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        {link && link.length > 0 && (
          <Button
            label={label}
            icon={<ExternalLink />}
            variant="secondary"
            onPress={() => Linking.openURL(link)}
            className="flex-1"
          />
        )}
        <NotificationButton isMember={event.is_interested} />
      </View>
    </View>
  );
};

export default EventDetailsHeader;

export const EventDetailsHeaderSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View className="gap-4">
      <View>
        <TextSkeleton variant="h2" lastLineWidth={200} />
        <TextSkeleton variant="sm" lastLineWidth={80} />
        <TextSkeleton lines={2} />
      </View>
      <View className="flex-row items-center gap-2 justify-between flex-wrap">
        <View className="flex-row items-center gap-1">
          <MapPin color={theme.text} size={20} />
          <TextSkeleton lastLineWidth={100} />
        </View>
        <View className="flex-row items-center gap-1">
          <Clock color={theme.text} size={20} />
          <TextSkeleton lastLineWidth={100} />
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <NotificationButton isMember={false} disabled />
      </View>
    </View>
  );
};
