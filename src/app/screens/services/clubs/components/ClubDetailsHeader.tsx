import { useRoute } from "@react-navigation/native";
import { Bell, BellOff, ExternalLink } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Linking, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { UserStack } from "@/components/custom";
import {
  useJoinClubMutation,
  useLeaveClubMutation,
} from "@/hooks/services/club/useClub";
import type { ClubDetailsRouteProp } from "../ClubDetails";

const NotificationButton = ({ isMember }: { isMember: boolean }) => {
  const { t } = useTranslation();
  const route = useRoute<ClubDetailsRouteProp>();
  const { id } = route.params;

  const { mutate: joinClub } = useJoinClubMutation(id);
  const { mutate: leaveClub } = useLeaveClubMutation(id);

  if (isMember) {
    return (
      <Button
        label={t("user.notInterested")}
        onPress={() => leaveClub()}
        icon={<BellOff />}
        className="flex-1"
      />
    );
  }
  return (
    <Button
      label={t("user.interested")}
      onPress={() => joinClub()}
      icon={<Bell />}
      className="flex-1"
    />
  );
};

interface ClubDetailsHeaderProps {
  title: string;
  description: string;
  member_photos: string[];
  member_count: number;
  location?: string;
  link?: string;
}

export const ClubDetailsHeader = ({
  title,
  description,
  member_photos,
  member_count,
  location,
  link,
}: ClubDetailsHeaderProps) => {
  const { t } = useTranslation();

  const label = link?.toLowerCase().includes("whatsapp")
    ? "WhatsApp"
    : String(t("common.link"));

  return (
    <View className="gap-4">
      <View>
        <Text variant="sm">{location}</Text>
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
        <NotificationButton isMember={true} />
      </View>
    </View>
  );
};

export default ClubDetailsHeader;
