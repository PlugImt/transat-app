import { useRoute } from "@react-navigation/native";
import { Bell, BellOff, ExternalLink, MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Linking, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { UserStack, UserStackSkeleton } from "@/components/custom";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { ClubDetails } from "@/dto/club";
import {
  useJoinClubMutation,
  useLeaveClubMutation,
} from "@/hooks/services/club/useClub";
import type { ClubDetailsRouteProp } from "../ClubDetails";

interface NotificationButtonProps {
  isMember: boolean;
  disabled?: boolean;
}

const NotificationButton = ({
  isMember,
  disabled,
}: NotificationButtonProps) => {
  const { t } = useTranslation();
  const route = useRoute<ClubDetailsRouteProp>();
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

interface ClubDetailsHeaderProps {
  club: ClubDetails;
}

export const ClubDetailsHeader = ({ club }: ClubDetailsHeaderProps) => {
  const {
    name: title,
    description,
    member_photos,
    member_count,
    location,
    link,
  } = club;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const label = link?.toLowerCase().includes("whatsapp")
    ? "WhatsApp"
    : String(t("common.link"));

  return (
    <View className="gap-4">
      <View>
        <View className="flex-row items-center gap-1">
          <MapPin color={theme.text} size={12} />
          <Text variant="sm">{location}</Text>
        </View>
        <Text variant="h2">{title}</Text>
        <Text color="muted">{description}</Text>
      </View>
      <UserStack pictures={member_photos} count={member_count} />
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
        <NotificationButton isMember={club.has_joined} />
      </View>
    </View>
  );
};

export default ClubDetailsHeader;

export const ClubDetailsHeaderSkeleton = () => {
  const { t } = useTranslation();

  return (
    <View className="gap-4">
      <View>
        <TextSkeleton variant="sm" lastLineWidth={50} />
        <TextSkeleton variant="h2" lastLineWidth={200} />
        <TextSkeleton lines={2} />
      </View>
      <UserStackSkeleton />
      <View className="flex-row items-center gap-2">
        <Button
          label={String(t("common.link"))}
          icon={<ExternalLink />}
          variant="secondary"
          className="flex-1"
          disabled
        />
        <NotificationButton isMember disabled />
      </View>
    </View>
  );
};
